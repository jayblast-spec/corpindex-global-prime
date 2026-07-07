import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, ChevronDown, ChevronUp, Clock, Download, ExternalLink, Map, Search, Table2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { companies, countries, sectors, type Company } from "@/data/companies";
import { cn } from "@/lib/utils";

const metrics = [
  { label: "Total Companies", value: "10,247" },
  { label: "Countries", value: "147" },
  { label: "Verified", value: "2,418" },
  { label: "Avg Score", value: "$72.4" },
];

const RankingTable = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sector, setSector] = useState("all");
  const [country, setCountry] = useState("all");
  const [view, setView] = useState<"table" | "map">("table");
  const [sortConfig, setSortConfig] = useState<{ key: keyof Company; direction: "asc" | "desc" }>({
    key: "rank",
    direction: "asc",
  });

  const sortedCompanies = useMemo(() => {
    const filtered = companies.filter((company) => {
      const matchesSearch = [company.name, company.ticker, company.country, company.sector].some((value) =>
        value.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      const matchesSector = sector === "all" || company.sector === sector;
      const matchesCountry = country === "all" || company.country === country;
      return matchesSearch && matchesSector && matchesCountry;
    });

    return [...filtered].sort((a, b) => {
      if (sortConfig.direction === "asc") return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
      return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
    });
  }, [country, searchQuery, sector, sortConfig]);

  const handleSort = (key: keyof Company) => {
    setSortConfig((prev) => ({ key, direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc" }));
  };

  const getRankBadge = (rank: number) => {
    if (rank <= 3) return "rank-gold";
    if (rank <= 10) return "rank-silver";
    return "rank-bronze";
  };

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <h1 className="mb-3 text-4xl font-bold md:text-5xl">Global Rankings</h1>
          <p className="mx-auto max-w-3xl text-lg text-muted-foreground">
            Complete corporate excellence rankings with real-time data and comprehensive filtering
          </p>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-4">
          {metrics.map((metric) => (
            <div key={metric.label} className="rounded-xl border border-border/50 bg-card p-5">
              <p className="text-sm text-muted-foreground">{metric.label}</p>
              <p className="mt-2 font-mono text-3xl font-bold">{metric.value}</p>
            </div>
          ))}
        </div>

        <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="inline-flex rounded-lg border border-border/50 bg-card p-1">
            <Button variant={view === "table" ? "default" : "ghost"} size="sm" onClick={() => setView("table")}>
              <Table2 className="h-4 w-4" />
              Table View
            </Button>
            <Button variant={view === "map" ? "default" : "ghost"} size="sm" onClick={() => setView("map")}>
              <Map className="h-4 w-4" />
              Map View
            </Button>
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>

        <div className="mb-6 grid gap-3 lg:grid-cols-[1fr_220px_220px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by company name or ticker..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="border-border/50 bg-card pl-10"
            />
          </div>
          <select className="h-10 rounded-md border border-input bg-card px-3 text-sm" value={sector} onChange={(event) => setSector(event.target.value)}>
            <option value="all">All Sectors</option>
            {sectors.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <select className="h-10 rounded-md border border-input bg-card px-3 text-sm" value={country} onChange={(event) => setCountry(event.target.value)}>
            <option value="all">All Countries</option>
            {countries.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        {view === "map" ? (
          <div className="card-gradient rounded-xl border border-border/50 p-8">
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
              {sortedCompanies.slice(0, 12).map((company) => (
                <Link key={company.ticker} to={`/company/${company.ticker.toLowerCase()}`} className="rounded-lg border border-border/50 bg-background/50 p-4 transition-colors hover:border-primary/50">
                  <div className="mb-3 flex items-center justify-between">
                    <span className={cn("rank-badge", getRankBadge(company.rank))}>#{company.rank}</span>
                    <span className="font-mono text-primary">${company.score.toFixed(1)}</span>
                  </div>
                  <p className="font-semibold">{company.name}</p>
                  <p className="text-sm text-muted-foreground">{company.country}</p>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="card-gradient overflow-hidden rounded-xl border border-border/50">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px]">
                <thead>
                  <tr className="border-b border-border/50 bg-secondary/30">
                    <SortableHead label="Rank" sortKey="rank" sortConfig={sortConfig} onSort={handleSort} />
                    <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Company</th>
                    <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Sector</th>
                    <SortableHead label="$CI$ Score" sortKey="score" sortConfig={sortConfig} onSort={handleSort} />
                    <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Change</th>
                    <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Market Cap</th>
                    <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                    <th className="px-4 py-4 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedCompanies.map((company, index) => (
                    <motion.tr key={company.ticker} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: index * 0.01 }} className="border-b border-border/30 transition-colors hover:bg-secondary/20">
                      <td className="px-4 py-4">
                        <span className={cn("rank-badge", getRankBadge(company.rank))}>#{company.rank}</span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-medium">{company.name}</div>
                        <div className="font-mono text-sm text-muted-foreground">
                          {company.ticker} • {company.country}
                        </div>
                      </td>
                      <td className="px-4 py-4">{company.sector}</td>
                      <td className="px-4 py-4">
                        <span className="font-mono font-semibold text-primary">${company.score.toFixed(1)}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={cn("font-mono text-sm", company.change > 0 && "text-success", company.change < 0 && "text-destructive", company.change === 0 && "text-muted-foreground")}>
                          {company.change > 0 && "+"}
                          {company.change.toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-4 py-4 font-mono">{company.marketCap}</td>
                      <td className="px-4 py-4">
                        {company.status === "verified" ? (
                          <Badge variant="outline" className="gap-1 border-success/50 text-success">
                            <CheckCircle2 className="h-3 w-3" />
                            Verified
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="gap-1 border-warning/50 text-warning">
                            <Clock className="h-3 w-3" />
                            Pending
                          </Badge>
                        )}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <Link to={`/company/${company.ticker.toLowerCase()}`}>
                          <Button variant="ghost" size="sm" className="gap-1">
                            View
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </Link>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="mt-6 flex items-center justify-center gap-2">
          <Button variant="outline" size="sm">Previous</Button>
          {[1, 2, 3].map((page) => (
            <Button key={page} variant={page === 1 ? "default" : "outline"} size="sm">
              {page}
            </Button>
          ))}
          <span className="px-2 text-muted-foreground">...</span>
          <Button variant="outline" size="sm">100</Button>
          <Button variant="outline" size="sm">Next</Button>
        </div>
      </div>
    </section>
  );
};

interface SortableHeadProps {
  label: string;
  sortKey: keyof Company;
  sortConfig: { key: keyof Company; direction: "asc" | "desc" };
  onSort: (key: keyof Company) => void;
}

const SortableHead = ({ label, sortKey, sortConfig, onSort }: SortableHeadProps) => (
  <th className="cursor-pointer px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground" onClick={() => onSort(sortKey)}>
    <div className="flex items-center gap-1">
      {label}
      {sortConfig.key === sortKey && (sortConfig.direction === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
    </div>
  </th>
);

export default RankingTable;
