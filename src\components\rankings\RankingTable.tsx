import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, ChevronDown, ChevronUp, Clock, ExternalLink, Filter, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { companies, type Company } from "@/data/companies";
import { cn } from "@/lib/utils";

const RankingTable = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: keyof Company; direction: "asc" | "desc" }>({
    key: "rank",
    direction: "asc",
  });

  const filteredCompanies = companies.filter((company) =>
    [company.name, company.ticker, company.country, company.sector].some((value) =>
      value.toLowerCase().includes(searchQuery.toLowerCase()),
    ),
  );

  const sortedCompanies = [...filteredCompanies].sort((a, b) => {
    if (sortConfig.direction === "asc") return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
    return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
  });

  const handleSort = (key: keyof Company) => {
    setSortConfig((prev) => ({ key, direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc" }));
  };

  const getRankBadge = (rank: number) => {
    if (rank <= 3) return "rank-gold";
    if (rank <= 10) return "rank-silver";
    return "rank-bronze";
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="mb-2 text-2xl font-bold md:text-3xl">Global Top 100</h2>
            <p className="text-muted-foreground">Real-time corporate excellence rankings</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search companies..." value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} className="w-full border-border/50 bg-card pl-10 sm:w-[280px]" />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>

        <div className="card-gradient overflow-hidden rounded-xl border border-border/50">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50 bg-secondary/30">
                  {["rank", "score"].map((key) => (
                    <th key={key} className="cursor-pointer px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground" onClick={() => handleSort(key as keyof Company)}>
                      <div className="flex items-center gap-1">
                        {key === "rank" ? "Rank" : "$CI$ Score"}
                        {sortConfig.key === key && (sortConfig.direction === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                      </div>
                    </th>
                  ))}
                  {["Company", "Change", "Sentiment", "Status", "Action"].map((label) => (
                    <th key={label} className={cn("px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground", label === "Action" && "text-right")}>
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedCompanies.map((company, index) => (
                  <motion.tr key={company.ticker} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: index * 0.02 }} className="border-b border-border/30 transition-colors hover:bg-secondary/20">
                    <td className="px-4 py-4">
                      <span className={cn("rank-badge", getRankBadge(company.rank))}>#{company.rank}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="font-mono font-semibold text-primary">${company.score.toFixed(1)}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-medium">{company.name}</div>
                      <div className="font-mono text-sm text-muted-foreground">
                        {company.ticker} • {company.country} • {company.sector}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={cn("font-mono text-sm", company.change > 0 && "text-success", company.change < 0 && "text-destructive", company.change === 0 && "text-muted-foreground")}>
                        {company.change > 0 && "+"}
                        {company.change.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={cn("text-sm font-medium capitalize", company.sentiment === "bullish" && "text-success", company.sentiment === "bearish" && "text-destructive", company.sentiment === "neutral" && "text-muted-foreground")}>
                        {company.sentiment}
                      </span>
                    </td>
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
      </div>
    </section>
  );
};

export default RankingTable;
