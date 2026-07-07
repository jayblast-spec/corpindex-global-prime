const trackedCompanies = [
  { name: "Apple", ticker: "AAPL", cik: "0000320193", sector: "Technology" },
  { name: "Microsoft", ticker: "MSFT", cik: "0000789019", sector: "Technology" },
  { name: "Alphabet", ticker: "GOOGL", cik: "0001652044", sector: "Technology" },
  { name: "Amazon", ticker: "AMZN", cik: "0001018724", sector: "Consumer" },
  { name: "NVIDIA", ticker: "NVDA", cik: "0001045810", sector: "Technology" },
  { name: "Meta", ticker: "META", cik: "0001326801", sector: "Technology" },
  { name: "JPMorgan", ticker: "JPM", cik: "0000019617", sector: "Financial" },
  { name: "Visa", ticker: "V", cik: "0001403161", sector: "Financial" },
  { name: "Dangote", ticker: "DANGCEM.NG", sector: "Industrial" },
  { name: "MTN Nigeria", ticker: "MTNN.NG", sector: "Telecom" },
];

const marketTickers = ["AAPL", "MSFT", "GOOGL", "AMZN", "NVDA", "META", "JPM", "V"];

type NewsItem = {
  title: string;
  url: string;
  source: string;
  publishedAt?: string;
  domain?: string;
  tone?: number;
};

type MarketSignal = {
  ticker: string;
  price: number | null;
  changePercent: number | null;
  source: string;
};

type FilingSignal = {
  company: string;
  ticker: string;
  form: string;
  filedAt: string;
  accession: string;
  url: string;
};

const jsonHeaders = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "public, max-age=0, must-revalidate",
};

async function fetchJson(url: string, init?: RequestInit) {
  const response = await fetch(url, {
    ...init,
    headers: {
      "User-Agent": "CorpIndex Intelligence desk@corpindex.global",
      Accept: "application/json",
      ...(init?.headers || {}),
    },
  });

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }

  return response.json();
}

async function fetchText(url: string, init?: RequestInit) {
  const response = await fetch(url, {
    ...init,
    headers: {
      "User-Agent": "CorpIndex Intelligence desk@corpindex.global",
      Accept: "text/html,application/rss+xml,application/xml,text/xml",
      ...(init?.headers || {}),
    },
  });

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }

  return response.text();
}

async function fetchGdeltNews(): Promise<NewsItem[]> {
  const query = encodeURIComponent(
    '(corporate OR earnings OR "stock market" OR governance OR acquisition OR "AI infrastructure" OR fintech OR "Nigeria")',
  );
  const url = `https://api.gdeltproject.org/api/v2/doc/doc?query=${query}&mode=ArtList&format=json&maxrecords=40&sort=HybridRel&timespan=24h`;
  const data = await fetchJson(url);
  const articles = Array.isArray(data.articles) ? data.articles : [];

  return articles.slice(0, 24).map((article: Record<string, unknown>) => ({
    title: String(article.title || "Untitled signal"),
    url: String(article.url || "#"),
    source: String(article.sourceCollectionIdentifier || article.sourceCountry || "GDELT"),
    domain: String(article.domain || ""),
    publishedAt: String(article.seendate || ""),
    tone: typeof article.tone === "number" ? article.tone : undefined,
  }));
}

function decodeXml(value: string) {
  return value
    .replace(/<!\[CDATA\[(.*?)\]\]>/gs, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
}

async function fetchGoogleNewsRss(): Promise<NewsItem[]> {
  const topics = [
    "corporate earnings governance artificial intelligence companies",
    "global companies market cap corporate governance",
    "Nigeria business telecom banking industrial earnings",
  ];

  const results: PromiseSettledResult<NewsItem[]>[] = await Promise.allSettled(
    topics.map(async (topic) => {
      const url = `https://news.google.com/rss/search?q=${encodeURIComponent(topic)}&hl=en-US&gl=US&ceid=US:en`;
      const xml = await fetchText(url);
      const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].slice(0, 10);

      return items.map((match) => {
        const block = match[1];
        const title = decodeXml(block.match(/<title>([\s\S]*?)<\/title>/)?.[1] || "Corporate signal");
        const link = decodeXml(block.match(/<link>([\s\S]*?)<\/link>/)?.[1] || "#");
        const pubDate = decodeXml(block.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] || "");
        const source = decodeXml(block.match(/<source[^>]*>([\s\S]*?)<\/source>/)?.[1] || "Google News");

        return {
          title,
          url: link,
          source,
          domain: source,
          publishedAt: pubDate,
        };
      });
    }),
  );

  const news = results.flatMap((result) => (result.status === "fulfilled" ? result.value : []));

  return Array.from(new Map(news.map((item) => [item.url, item])).values()).slice(0, 24);
}

async function fetchNewsSignals() {
  try {
    const gdelt = await fetchGdeltNews();
    if (gdelt.length) return gdelt;
  } catch {
    // Fall through to RSS source. GDELT occasionally blocks or times out from serverless regions.
  }

  return fetchGoogleNewsRss();
}

async function fetchMarketSignals(): Promise<MarketSignal[]> {
  const results = await Promise.allSettled(
    marketTickers.map(async (ticker) => {
      const data = await fetchJson(`https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?range=5d&interval=1d`);
      const result = data.chart?.result?.[0];
      const meta = result?.meta;
      const previousClose = Number(meta?.chartPreviousClose || meta?.previousClose || 0);
      const price = Number(meta?.regularMarketPrice || 0);
      const rawChangePercent =
        typeof meta?.regularMarketChangePercent === "number"
          ? Number(meta.regularMarketChangePercent)
          : previousClose && price
            ? ((price - previousClose) / previousClose) * 100
            : null;

      return {
        ticker,
        price: Number.isFinite(price) && price > 0 ? Number(price.toFixed(2)) : null,
        changePercent: rawChangePercent === null ? null : Number(rawChangePercent.toFixed(2)),
        source: "Yahoo Finance chart API",
      };
    }),
  );

  return results
    .filter((result): result is PromiseFulfilledResult<MarketSignal> => result.status === "fulfilled")
    .map((result) => result.value);
}

async function fetchSecFilings(): Promise<FilingSignal[]> {
  const secCompanies = trackedCompanies.filter((company) => company.cik);
  const results = await Promise.allSettled(
    secCompanies.map(async (company) => {
      const data = await fetchJson(`https://data.sec.gov/submissions/CIK${company.cik}.json`);
      const recent = data.filings?.recent;
      const form = recent?.form?.[0];
      const filedAt = recent?.filingDate?.[0];
      const accession = recent?.accessionNumber?.[0];

      if (!form || !filedAt || !accession) {
        throw new Error("No recent filing");
      }

      const accessionPath = String(accession).replace(/-/g, "");
      const cikPath = String(Number(company.cik));

      return {
        company: company.name,
        ticker: company.ticker,
        form,
        filedAt,
        accession,
        url: `https://www.sec.gov/Archives/edgar/data/${cikPath}/${accessionPath}/${accession}-index.html`,
      };
    }),
  );

  return results
    .filter((result): result is PromiseFulfilledResult<FilingSignal> => result.status === "fulfilled")
    .map((result) => result.value)
    .sort((a, b) => b.filedAt.localeCompare(a.filedAt))
    .slice(0, 8);
}

function buildReports(news: NewsItem[], markets: MarketSignal[], filings: FilingSignal[]) {
  const topDomains = news
    .map((item) => item.domain)
    .filter(Boolean)
    .slice(0, 5);
  const positiveMovers = markets.filter((item) => (item.changePercent || 0) > 0).sort((a, b) => (b.changePercent || 0) - (a.changePercent || 0));
  const negativeMovers = markets.filter((item) => (item.changePercent || 0) < 0).sort((a, b) => (a.changePercent || 0) - (b.changePercent || 0));

  return [
    {
      id: "market-pulse",
      title: "Global Corporate Pulse",
      category: "Market Intelligence",
      urgency: positiveMovers.length + negativeMovers.length >= 6 ? "High" : "Medium",
      summary:
        positiveMovers.length > 0
          ? `${positiveMovers[0].ticker} leads tracked market momentum at ${positiveMovers[0].changePercent}%, while CorpIndex is monitoring ${news.length} current corporate news signals.`
          : `CorpIndex is monitoring ${news.length} current corporate news signals across public markets, governance, AI, fintech, and Nigeria exposure.`,
      bullets: [
        `${markets.length} tracked market instruments refreshed from public chart data.`,
        `${news.length} public news signals ingested from the last 24 hours.`,
        topDomains.length ? `Most visible source domains include ${topDomains.join(", ")}.` : "Source-domain concentration is still forming.",
      ],
    },
    {
      id: "filings-monitor",
      title: "Regulatory Filing Watch",
      category: "Governance",
      urgency: filings.length >= 5 ? "High" : "Medium",
      summary:
        filings.length > 0
          ? `${filings[0].company} has the latest tracked SEC filing (${filings[0].form}) dated ${filings[0].filedAt}.`
          : "SEC filing monitor is online; no recent filings were returned during this refresh window.",
      bullets: filings.slice(0, 3).map((filing) => `${filing.company}: ${filing.form} filed ${filing.filedAt}`),
    },
    {
      id: "africa-watch",
      title: "Nigeria & Africa Corporate Watch",
      category: "Regional Intelligence",
      urgency: news.some((item) => item.title.toLowerCase().includes("nigeria")) ? "High" : "Medium",
      summary:
        "Nigeria-linked corporates remain a differentiated CorpIndex wedge because global ranking products under-cover African enterprise quality and governance signals.",
      bullets: [
        "Nigeria companies remain represented in the live ranking dataset.",
        "The news engine watches Nigeria, fintech, telecom, industrial, and governance keywords.",
        "Next monetizable layer: verified country brief subscriptions for investors and expansion teams.",
      ],
    },
  ];
}

export default async function handler(_req: any, res: any) {
  const refreshedAt = new Date().toISOString();
  const errors: string[] = [];

  const [newsResult, marketResult, filingsResult] = await Promise.allSettled([
    fetchNewsSignals(),
    fetchMarketSignals(),
    fetchSecFilings(),
  ]);

  const news = newsResult.status === "fulfilled" ? newsResult.value : [];
  const markets = marketResult.status === "fulfilled" ? marketResult.value : [];
  const filings = filingsResult.status === "fulfilled" ? filingsResult.value : [];

  if (newsResult.status === "rejected") errors.push(`News source: ${newsResult.reason}`);
  if (marketResult.status === "rejected") errors.push(`Market source: ${marketResult.reason}`);
  if (filingsResult.status === "rejected") errors.push(`SEC source: ${filingsResult.reason}`);

  const payload = {
    refreshedAt,
    freshness: {
      label: errors.length ? "Partial live refresh" : "Live refresh complete",
      nextRefreshHint: "CorpIndex continuously refreshes public news, market, and filing signals throughout the day.",
    },
    coverage: {
      newsSignals: news.length,
      marketSignals: markets.length,
      filingSignals: filings.length,
      trackedCompanies: trackedCompanies.length,
    },
    reports: buildReports(news, markets, filings),
    news,
    markets,
    filings,
    errors,
  };

  res.status(200).setHeader("Content-Type", jsonHeaders["Content-Type"]);
  res.setHeader("Cache-Control", jsonHeaders["Cache-Control"]);
  res.send(JSON.stringify(payload));
}
