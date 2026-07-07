import { useEffect, useState } from "react";

export interface IntelligenceNewsItem {
  title: string;
  url: string;
  source: string;
  publishedAt?: string;
  domain?: string;
  tone?: number;
}

export interface MarketSignal {
  ticker: string;
  price: number | null;
  changePercent: number | null;
  source: string;
}

export interface FilingSignal {
  company: string;
  ticker: string;
  form: string;
  filedAt: string;
  accession: string;
  url: string;
}

export interface IntelligenceReport {
  id: string;
  title: string;
  category: string;
  urgency: "High" | "Medium" | "Low";
  summary: string;
  bullets: string[];
}

export interface IntelligencePayload {
  refreshedAt: string;
  freshness: {
    label: string;
    nextRefreshHint: string;
  };
  coverage: {
    newsSignals: number;
    marketSignals: number;
    filingSignals: number;
    trackedCompanies: number;
  };
  reports: IntelligenceReport[];
  news: IntelligenceNewsItem[];
  markets: MarketSignal[];
  filings: FilingSignal[];
  errors: string[];
}

export function useIntelligence() {
  const [data, setData] = useState<IntelligencePayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        const response = await fetch("/api/intelligence");
        if (!response.ok) throw new Error(`Intelligence API returned ${response.status}`);
        const payload = (await response.json()) as IntelligencePayload;
        if (!cancelled) {
          setData(payload);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Unable to load intelligence feed");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return { data, error, loading };
}

export function formatRefresh(value?: string) {
  if (!value) return "Pending first refresh";
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}
