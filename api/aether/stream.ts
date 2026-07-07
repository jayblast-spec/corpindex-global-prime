function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function asText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function getPageName(path: string) {
  if (path === "/") return "home";
  if (path.startsWith("/rankings")) return "rankings";
  if (path.startsWith("/intelligence")) return "intelligence";
  if (path.startsWith("/methodology")) return "methodology";
  if (path.startsWith("/news")) return "news";
  if (path.startsWith("/apply")) return "company application";
  if (path.startsWith("/partner")) return "partner";
  if (path.startsWith("/company/")) return "company profile";
  return path.replace("/", "") || "CorpIndex";
}

function isCapabilityQuestion(prompt: string) {
  return /\b(what can you do|what do you do|help|capabilities|how can you help|who are you)\b/i.test(prompt);
}

function isExplainPageQuestion(prompt: string) {
  return /\b(explain this page|this page|where am i|what is this page|how do i use this)\b/i.test(prompt);
}

function isRiskQuestion(prompt: string) {
  return /\b(risk|risks|red flag|red flags|governance|compliance|sanction|litigation|audit|ownership)\b/i.test(prompt);
}

function isBriefQuestion(prompt: string) {
  return /\b(brief|summary|report|analyze|analyse|company|investor|rating|score|watchlist)\b/i.test(prompt);
}

function buildCapabilityAnswer() {
  return [
    "I can help you turn CorpIndex signals into decision-ready corporate intelligence.\n\n",
    "Here is what I can do:\n",
    "- Create company briefs for investors, partners, and analysts.\n",
    "- Summarize governance, ownership, audit, disclosure, and regulatory risk.\n",
    "- Explain why a company score or ranking may matter.\n",
    "- Turn market movement, filings, and news into a plain-English signal.\n",
    "- Draft watchlist notes for sectors, countries, or verified companies.\n",
    "- Help compare companies by credibility, momentum, and institutional trust.\n\n",
    "Try asking: \"Give me a risk brief on Apple\", \"Compare NVIDIA and Microsoft\", or \"Create a Nigeria banking watchlist note.\"",
  ].join("");
}

function buildPageAnswer(path: string) {
  const page = getPageName(path);

  const pageGuides: Record<string, string> = {
    home:
      "This is the CorpIndex command surface: rankings, verification, and live intelligence. Best next step: open Rankings, Intelligence, or Methodology.",
    rankings:
      "This page compares companies by score, sector, country, status, market cap, and movement. Use filters, then open a company profile for deeper context.",
    intelligence:
      "This is the live signal layer: news, market movement, filings, and generated briefs. Use it when you need current context.",
    methodology:
      "This page explains the scoring model, evaluation process, and CorpIndex Verified Standard. It is the trust foundation.",
    news:
      "This page turns CorpIndex signals into ranking updates, market analysis, methodology notes, and regional intelligence.",
    "company application":
      "This is where a company begins indexing and verification. The value is credibility through governance, ownership, disclosure, and monitoring review.",
    partner:
      "This page is for sponsors, data partners, and institutional collaborators who want access to CorpIndex's executive and investor audience.",
    "company profile":
      "This company profile is for score context, verification status, market signals, and risk posture before peer comparison.",
  };

  return [
    `${page} guide: `,
    pageGuides[page] || "This page is part of the CorpIndex intelligence platform. I can help summarize it, explain the next action, or turn it into a brief.",
    " Ask me what to inspect next.",
  ].join("");
}

function buildRiskAnswer(prompt: string, path: string) {
  const subject = prompt.replace(/\s+/g, " ").trim() || "this company";
  const page = getPageName(path);

  return [
    `Risk brief for ${subject}\n\n`,
    `Current context: ${page} page.\n\n`,
    "Primary risk lenses:\n",
    "- Governance: board independence, audit quality, executive concentration, and disclosure discipline.\n",
    "- Ownership: beneficial ownership clarity, control-chain complexity, related-party exposure, and insider influence.\n",
    "- Regulatory: litigation, sanctions exposure, sector supervision, filing behavior, and adverse-media signals.\n",
    "- Market: sharp price movement, valuation pressure, earnings surprises, and sentiment shifts.\n",
    "- Digital resilience: cybersecurity posture, data governance, AI use, and operational continuity.\n\n",
    "CorpIndex interpretation: the strongest companies are not just high-growth; they are transparent, resilient, well-governed, and continuously monitorable.",
  ].join("");
}

function buildCompanyBrief(prompt: string, path: string) {
  const subject = prompt.replace(/\s+/g, " ").trim() || "the requested company";
  const page = getPageName(path);

  return [
    `CorpIndex brief: ${subject}\n\n`,
    `Current context: ${page} page.\n\n`,
    "Executive read:\n",
    "Aether would evaluate this company through corporate quality, governance reliability, market momentum, and public-source signal freshness.\n\n",
    "What to inspect:\n",
    "- Score context: ranking position, sector peers, country exposure, and score movement.\n",
    "- Trust layer: verification status, disclosure quality, ownership transparency, and audit confidence.\n",
    "- Signal movement: news intensity, market changes, filing activity, and regulatory alerts.\n",
    "- Investor angle: whether the company is becoming more credible, more risky, or more strategically important.\n\n",
    "Best next question: ask me for a risk scan, peer comparison, or investor-ready one-page note on a specific company.",
  ].join("");
}

function buildBrief(prompt: string, path: string) {
  const normalizedPrompt = prompt || "Create an investor-ready CorpIndex intelligence brief.";

  if (isCapabilityQuestion(normalizedPrompt)) return buildCapabilityAnswer();
  if (isExplainPageQuestion(normalizedPrompt)) return buildPageAnswer(path);
  if (isRiskQuestion(normalizedPrompt)) return buildRiskAnswer(normalizedPrompt, path);
  if (isBriefQuestion(normalizedPrompt)) return buildCompanyBrief(normalizedPrompt, path);

  return [
    "I can help with CorpIndex intelligence work.\n\n",
    "Ask me for a company brief, risk scan, peer comparison, governance review, market signal explanation, or investor-ready note. ",
    "For best results, include a company, sector, country, or specific question.",
  ].join("");
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const prompt = asText(req.body?.message);
  const pagePath = asText(req.body?.context?.path) || "/";
  const brief = buildBrief(prompt, pagePath);
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
