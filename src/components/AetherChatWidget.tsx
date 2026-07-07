import { FormEvent, KeyboardEvent, lazy, Suspense, useCallback, useMemo, useRef, useState } from "react";
import type { AetherAiState } from "@/components/Aether3D";

const Aether3D = lazy(() => import("@/components/Aether3D"));

type ChatRole = "user" | "assistant" | "system";

interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
}

interface StreamRequestBody {
  message: string;
  history: Array<Pick<ChatMessage, "role" | "content">>;
}

const decoder = new TextDecoder();

function createId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

function extractTokenFromJson(value: unknown): string {
  if (!value || typeof value !== "object") return "";

  const record = value as Record<string, unknown>;
  if (typeof record.delta === "string") return record.delta;
  if (typeof record.content === "string") return record.content;
  if (typeof record.text === "string") return record.text;
  if (typeof record.token === "string") return record.token;
  if (typeof record.message === "string") return record.message;

  const choices = record.choices;
  if (Array.isArray(choices)) {
    return choices
      .map((choice) => {
        if (!choice || typeof choice !== "object") return "";
        const choiceRecord = choice as Record<string, unknown>;
        const delta = choiceRecord.delta;
        if (delta && typeof delta === "object" && typeof (delta as Record<string, unknown>).content === "string") {
          return (delta as Record<string, string>).content;
        }
        if (typeof choiceRecord.text === "string") return choiceRecord.text;
        if (typeof choiceRecord.content === "string") return choiceRecord.content;
        return "";
      })
      .join("");
  }

  return "";
}

function parseSseChunk(chunk: string) {
  const lines = chunk
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const tokens: string[] = [];
  let done = false;

  for (const line of lines) {
    if (line.startsWith(":")) continue;
    const payload = line.startsWith("data:") ? line.slice(5).trim() : line;

    if (!payload || payload === "[DONE]") {
      done = done || payload === "[DONE]";
      continue;
    }

    try {
      const token = extractTokenFromJson(JSON.parse(payload) as unknown);
      if (token) tokens.push(token);
    } catch {
      tokens.push(payload);
    }
  }

  return { done, text: tokens.join("") };
}

const starterMessage: ChatMessage = {
  id: "assistant-starter",
  role: "assistant",
  content: "I am Aether, CorpIndex's live intelligence co-pilot. Ask for a company brief, risk scan, or investor-ready angle.",
};

export default function AetherChatWidget() {
  const [aiState, setAiState] = useState<AetherAiState>("idle");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([starterMessage]);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const successTimerRef = useRef<number | null>(null);

  const isBusy = aiState === "processing" || aiState === "typing";
  const statusLabel = useMemo(() => {
    if (aiState === "processing") return "Computing";
    if (aiState === "typing") return "Streaming";
    if (aiState === "success") return "Complete";
    if (aiState === "error") return "Needs attention";
    return "Ready";
  }, [aiState]);

  const appendToAssistantMessage = useCallback((messageId: string, token: string) => {
    setMessages((current) =>
      current.map((message) => (message.id === messageId ? { ...message, content: `${message.content}${token}` } : message)),
    );
  }, []);

  const finishSuccessfully = useCallback(() => {
    setAiState("success");

    if (successTimerRef.current) {
      window.clearTimeout(successTimerRef.current);
    }

    successTimerRef.current = window.setTimeout(() => setAiState("idle"), 2500);
  }, []);

  const streamAnswer = useCallback(
    async (body: StreamRequestBody, assistantMessageId: string) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      const response = await fetch("/api/aether/stream", {
        method: "POST",
        headers: {
          Accept: "text/event-stream, application/json, text/plain",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      if (!response.ok) throw new Error(`Aether stream returned ${response.status}`);

      if (!response.body) {
        appendToAssistantMessage(assistantMessageId, await response.text());
        finishSuccessfully();
        return;
      }

      const reader = response.body.getReader();
      let buffer = "";
      let hasStreamed = false;

      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const segments = buffer.split(/\n\n|\r\n\r\n/);
          buffer = segments.pop() ?? "";

          for (const segment of segments) {
            const parsed = parseSseChunk(segment);
            if (parsed.text) {
              if (!hasStreamed) {
                hasStreamed = true;
                setAiState("typing");
              }
              appendToAssistantMessage(assistantMessageId, parsed.text);
            }
            if (parsed.done) break;
          }
        }

        const remainder = parseSseChunk(buffer);
        if (remainder.text) {
          if (!hasStreamed) setAiState("typing");
          appendToAssistantMessage(assistantMessageId, remainder.text);
        }

        finishSuccessfully();
      } finally {
        reader.releaseLock();
      }
    },
    [appendToAssistantMessage, finishSuccessfully],
  );

  const submit = useCallback(
    async (event?: FormEvent<HTMLFormElement>) => {
      event?.preventDefault();

      const prompt = input.trim();
      if (!prompt || isBusy) return;

      if (successTimerRef.current) {
        window.clearTimeout(successTimerRef.current);
        successTimerRef.current = null;
      }

      setError(null);
      setAiState("processing");
      setInput("");

      const userMessage: ChatMessage = { id: createId("user"), role: "user", content: prompt };
      const assistantMessage: ChatMessage = { id: createId("assistant"), role: "assistant", content: "" };
      const history = [...messages, userMessage].map(({ role, content }) => ({ role, content }));

      setMessages((current) => [...current, userMessage, assistantMessage]);

      try {
        await streamAnswer({ message: prompt, history }, assistantMessage.id);
      } catch (streamError) {
        if ((streamError as Error).name === "AbortError") return;
        setAiState("error");
        setError(streamError instanceof Error ? streamError.message : "Aether could not complete the stream.");
        setMessages((current) =>
          current.map((message) =>
            message.id === assistantMessage.id
              ? { ...message, content: "I could not complete that stream. Please try again." }
              : message,
          ),
        );
      }
    },
    [input, isBusy, messages, streamAnswer],
  );

  const handleInputKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void submit();
    }
  };

  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-50 w-[min(92vw,24rem)]">
      <section className="pointer-events-auto overflow-hidden rounded-3xl border border-white/10 bg-slate-950/40 text-white shadow-2xl shadow-cyan-950/30 backdrop-blur-xl">
        <div className="relative h-56 border-b border-white/10 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.22),transparent_55%),linear-gradient(135deg,rgba(15,23,42,0.88),rgba(2,6,23,0.72))]">
          <Suspense fallback={<div className="absolute inset-0 animate-pulse bg-white/5" />}>
            <Aether3D aiState={aiState} className="absolute inset-0" />
          </Suspense>
          <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur-md">
            {statusLabel}
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            <p className="text-lg font-semibold tracking-tight">Aether</p>
            <p className="text-sm text-slate-300">CorpIndex intelligence co-pilot</p>
          </div>
        </div>

        <div className="max-h-72 space-y-3 overflow-y-auto p-4">
          {messages.map((message) => (
            <article
              key={message.id}
              className={`rounded-2xl px-4 py-3 text-sm leading-6 ${
                message.role === "user"
                  ? "ml-8 bg-cyan-400/15 text-cyan-50"
                  : "mr-8 border border-white/10 bg-white/[0.06] text-slate-100"
              }`}
            >
              {message.content || <span className="animate-pulse text-slate-400">Composing...</span>}
            </article>
          ))}
          {error && <p className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-100">{error}</p>}
        </div>

        <form className="border-t border-white/10 p-3" onSubmit={submit}>
          <div className="flex items-end gap-2 rounded-2xl border border-white/10 bg-white/[0.06] p-2">
            <textarea
              aria-label="Message Aether"
              className="max-h-28 min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-sm text-white outline-none placeholder:text-slate-500"
              disabled={isBusy}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleInputKeyDown}
              placeholder="Ask for a brief..."
              rows={1}
              value={input}
            />
            <button
              className="rounded-xl bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-45"
              disabled={!input.trim() || isBusy}
              type="submit"
            >
              {isBusy ? "..." : "Send"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
