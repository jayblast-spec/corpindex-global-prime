function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function asText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function buildBrief(prompt: string) {
  const normalizedPrompt = prompt || "Create an investor-ready CorpIndex intelligence brief.";

  return [
    `Aether brief: ${normalizedPrompt}\n\n`,
    "CorpIndex reads this as an intelligence workflow, not a static website action. ",
    "For an MVP-grade response, the product should synthesize live market movement, regulatory filings, company ranking context, and source-backed news into one concise analyst note.\n\n",
    "Signal frame:\n",
    "- Governance: flag board, audit, ownership, sanctions, litigation, and disclosure risk.\n",
    "- Market: connect price movement to corporate events instead of showing raw numbers alone.\n",
    "- Verification: separate verified trust status from promotional claims.\n",
    "- Investor angle: explain why the signal matters now, who should care, and what changed.\n\n",
    "Recommended next action: open the Intelligence page, generate a company-specific brief, then convert the strongest signal into a saved watchlist item or verification upsell.",
  ].join("");
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const prompt = asText(req.body?.message);
  const brief = buildBrief(prompt);
  const chunks = brief.match(/.{1,90}(\s|$)/g) || [brief];

  res.statusCode = 200;
  res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();

  for (const chunk of chunks) {
    res.write(`data: ${JSON.stringify({ delta: chunk })}\n\n`);
    await sleep(45);
  }

  res.write("data: [DONE]\n\n");
  res.end();
}
