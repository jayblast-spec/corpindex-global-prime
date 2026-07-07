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
  context: {
    path: string;
    title: string;
  };
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
  content: "I can explain this page, create a brief, or scan risk.",
};

const quickActions = ["Explain this page", "Create brief", "Risk scan"] as const;

export default function AetherChatWidget() {
  const [aiState, setAiState] = useState<AetherAiState>("idle");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([starterMessage]);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const successTimerRef = useRef<number | null>(null);

  const isBusy = aiState === "processing" || aiState === "typing";
  const visibleMessages = isExpanded ? messages.slice(-4) : messages.slice(-1);
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

  const getPageContext = useCallback(() => {
    const path = window.location.pathname;
    const title = document.title || "CorpIndex";

    return { path, title };
  }, []);

  const submit = useCallback(
    async (event?: FormEvent<HTMLFormElement>, overridePrompt?: string) => {
      event?.preventDefault();

      const prompt = (overridePrompt || input).trim();
      if (!prompt || isBusy) return;

      if (successTimerRef.current) {
        window.clearTimeout(successTimerRef.current);
        successTimerRef.current = null;
      }

      setError(null);
      setIsExpanded(true);
      setAiState("processing");
      setInput("");

      const userMessage: ChatMessage = { id: createId("user"), role: "user", content: prompt };
      const assistantMessage: ChatMessage = { id: createId("assistant"), role: "assistant", content: "" };
      const history = [...messages, userMessage].map(({ role, content }) => ({ role, content }));

      setMessages((current) => [...current, userMessage, assistantMessage]);

      try {
        await streamAnswer({ message: prompt, history, context: getPageContext() }, assistantMessage.id);
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
    [getPageContext, input, isBusy, messages, streamAnswer],
  );

  const handleInputKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void submit();
    }
  };

  return (
    <div className="pointer-events-none fixed bottom-3 right-3 z-50 h-[min(86vh,46rem)] w-[min(96vw,38rem)] sm:bottom-5 sm:right-5">
      <div className="absolute bottom-16 right-0 h-[min(72vh,38rem)] w-[min(92vw,32rem)] drop-shadow-[0_32px_70px_rgba(15,23,42,0.42)] sm:bottom-20 sm:right-1">
        <Suspense fallback={<div className="h-full w-full animate-pulse rounded-[2rem] bg-white/10 backdrop-blur-sm" />}>
          <Aether3D aiState={aiState} className="h-full w-full" />
        </Suspense>
      </div>

      <section className="pointer-events-auto absolute bottom-0 right-0 w-[min(90vw,19.5rem)] overflow-hidden rounded-[1.35rem] border border-white/20 bg-slate-100/65 text-slate-950 shadow-2xl shadow-slate-900/20 backdrop-blur-2xl">
        <div className="flex items-center justify-between border-b border-white/40 px-3.5 py-2.5">
          <div>
            <p className="text-sm font-semibold tracking-tight">Aether</p>
            <p className="text-xs text-slate-600">CorpIndex intelligence co-pilot</p>
          </div>
          <button
            aria-label={isExpanded ? "Minimize Aether chat" : "Expand Aether chat"}
            className="rounded-full border border-slate-900/10 bg-white/65 px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-slate-600 transition hover:bg-white"
            onClick={() => setIsExpanded((value) => !value)}
            type="button"
          >
            {isExpanded ? "Minimize" : statusLabel}
          </button>
        </div>

        <div className={`${isExpanded ? "max-h-48" : "max-h-20"} space-y-2 overflow-y-auto p-3`}>
          {visibleMessages.map((message) => (
            <article
              key={message.id}
              className={`rounded-2xl px-3 py-2 text-xs leading-5 ${
                message.role === "user"
                  ? "ml-8 bg-slate-950 text-white"
                  : "mr-8 border border-slate-900/10 bg-white/70 text-slate-700 shadow-sm"
              }`}
            >
              {message.content || <span className="animate-pulse text-slate-400">Composing...</span>}
            </article>
          ))}
          {error && <p className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-700">{error}</p>}
        </div>

        <div className="flex gap-2 overflow-x-auto border-t border-white/40 bg-white/20 px-3 py-2.5">
          {quickActions.map((action) => (
            <button
              className="shrink-0 rounded-full border border-slate-900/10 bg-white/65 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-white disabled:opacity-45"
              disabled={isBusy}
              key={action}
              onClick={() => void submit(undefined, action)}
              type="button"
            >
              {action}
            </button>
          ))}
        </div>

        <form className="border-t border-white/40 bg-white/35 p-3" onSubmit={submit}>
          <div className="flex items-end gap-2 rounded-2xl border border-slate-900/10 bg-white/70 p-2 shadow-inner">
            <textarea
              aria-label="Message Aether"
              className="max-h-20 min-h-9 flex-1 resize-none bg-transparent px-2 py-1.5 text-sm text-slate-950 outline-none placeholder:text-slate-500"
              disabled={isBusy}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleInputKeyDown}
              placeholder="Ask for a brief..."
              rows={1}
              value={input}
            />
            <button
              className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-45"
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
