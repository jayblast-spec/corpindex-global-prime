import { Activity, ArrowUpRight, DatabaseZap, FileText, Globe2, Newspaper, Radar, Sparkles, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatRefresh, useIntelligence } from "@/lib/intelligence";
import { cn } from "@/lib/utils";

const Intelligence = () => {
  const { data, error, loading } = useIntelligence();

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="mb-10 grid gap-8 lg:grid-cols-[1fr_360px] lg:items-end">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary">Live Intelligence OS</p>
          <h1 className="mb-4 text-4xl font-bold md:text-6xl">Always-current corporate intelligence, not static rankings.</h1>
          <p className="max-w-3xl text-lg text-muted-foreground">
            CorpIndex now monitors news, market movement, and regulatory filings to produce source-backed corporate briefs that refresh continuously.
          </p>
        </div>
        <Card className="card-gradient border-primary/30">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Radar className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold">Freshness Engine</p>
                <p className="text-sm text-muted-foreground">{loading ? "Refreshing..." : data?.freshness.label || "Awaiting feed"}</p>
              </div>
            </div>
            <p className="font-mono text-2xl font-bold">{formatRefresh(data?.refreshedAt)}</p>
            <p className="mt-2 text-sm text-muted-foreground">{data?.freshness.nextRefreshHint || "CorpIndex continuously refreshes public news, market, and filing signals throughout the day."}</p>
          </CardContent>
        </Card>
      </div>

      {error && (
        <Card className="mb-8 border-destructive/40">
          <CardContent className="p-5 text-destructive">{error}</CardContent>
        </Card>
      )}

      <div className="mb-8 grid gap-4 md:grid-cols-4">
        <Metric icon={Newspaper} label="News Signals" value={data?.coverage.newsSignals ?? (loading ? "..." : "0")} />
        <Metric icon={Activity} label="Market Signals" value={data?.coverage.marketSignals ?? (loading ? "..." : "0")} />
        <Metric icon={FileText} label="Filing Signals" value={data?.coverage.filingSignals ?? (loading ? "..." : "0")} />
        <Metric icon={DatabaseZap} label="Tracked Companies" value={data?.coverage.trackedCompanies ?? 10} />
      </div>

      <div className="mb-10 grid gap-5 lg:grid-cols-3">
        {(data?.reports || []).map((report) => (
          <Card key={report.id} className="card-gradient border-border/50">
            <CardContent className="p-6">
              <div className="mb-4 flex items-center justify-between gap-3">
                <Badge variant="outline" className="border-primary/40 text-primary">{report.category}</Badge>
                <Badge variant="outline" className={cn(report.urgency === "High" ? "border-warning/50 text-warning" : "border-success/50 text-success")}>
                  {report.urgency}
                </Badge>
              </div>
              <h2 className="mb-3 text-2xl font-bold">{report.title}</h2>
              <p className="mb-5 text-muted-foreground">{report.summary}</p>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {report.bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-2">
                    <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {bullet}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Live News Desk</h2>
              <Globe2 className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-4">
              {(data?.news || []).slice(0, 8).map((item) => (
                <a key={item.url} href={item.url} target="_blank" rel="noreferrer" className="block rounded-lg border border-border/50 p-4 transition-colors hover:border-primary/50">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-primary">{item.domain || item.source}</p>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="mt-2 text-xs text-muted-foreground">{item.publishedAt || "Recently seen"}</p>
                </a>
              ))}
              {!loading && !data?.news.length && <p className="text-muted-foreground">No live news returned during this refresh window.</p>}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-border/50">
            <CardContent className="p-6">
              <h2 className="mb-5 text-2xl font-bold">Market Movement</h2>
              <div className="space-y-3">
                {(data?.markets || []).map((signal) => (
                  <div key={signal.ticker} className="flex items-center justify-between rounded-lg border border-border/50 p-3">
                    <span className="font-mono font-semibold">{signal.ticker}</span>
                    <div className="text-right">
                      <p className="font-mono">${signal.price?.toFixed(2) || "--"}</p>
                      <p className={cn("font-mono text-sm", (signal.changePercent || 0) >= 0 ? "text-success" : "text-destructive")}>
                        {signal.changePercent !== null && signal.changePercent > 0 ? "+" : ""}
                        {signal.changePercent ?? "--"}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-6">
              <h2 className="mb-5 text-2xl font-bold">Regulatory Filings</h2>
              <div className="space-y-3">
                {(data?.filings || []).slice(0, 6).map((filing) => (
                  <a key={filing.accession} href={filing.url} target="_blank" rel="noreferrer" className="block rounded-lg border border-border/50 p-3 transition-colors hover:border-primary/50">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold">{filing.company}</p>
                        <p className="text-sm text-muted-foreground">{filing.form} • {filing.filedAt}</p>
                      </div>
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-10 rounded-xl border border-primary/30 bg-primary/10 p-6">
        <h2 className="mb-2 text-2xl font-bold">Build an elite corporate watchlist</h2>
        <p className="text-muted-foreground">
          Track verified companies, sector shifts, regulatory filings, market movement, and regional signals in one continuously refreshed intelligence layer.
        </p>
        <Button className="mt-5">Create Intelligence Brief</Button>
      </div>
    </section>
  );
};

const Metric = ({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string | number }) => (
  <Card className="border-border/50">
    <CardContent className="p-5">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 font-mono text-3xl font-bold">{value}</p>
    </CardContent>
  </Card>
);

export default Intelligence;
