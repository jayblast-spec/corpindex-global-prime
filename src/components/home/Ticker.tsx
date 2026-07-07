import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { companies } from "@/data/companies";

const tickerData = companies.slice(0, 10).map((company) => ({
  symbol: company.ticker,
  score: company.score,
  change: company.change,
  trend: company.change > 0 ? "up" : company.change < 0 ? "down" : "neutral",
}));

const Ticker = () => (
  <div className="fixed left-0 right-0 top-16 z-40 overflow-hidden border-b border-border/50 bg-card/95 backdrop-blur">
    <div className="flex animate-ticker">
      {[...tickerData, ...tickerData].map((item, index) => (
        <div key={`${item.symbol}-${index}`} className="flex items-center gap-3 whitespace-nowrap border-r border-border/30 px-6 py-2">
          <span className="font-mono text-sm font-semibold">{item.symbol}</span>
          <span className="font-mono text-sm text-primary">${item.score.toFixed(1)}</span>
          <div
            className={cn(
              "flex items-center gap-1 font-mono text-xs",
              item.trend === "up" && "text-success",
              item.trend === "down" && "text-destructive",
              item.trend === "neutral" && "text-muted-foreground",
            )}
          >
            {item.trend === "up" && <TrendingUp className="h-3 w-3" />}
            {item.trend === "down" && <TrendingDown className="h-3 w-3" />}
            {item.trend === "neutral" && <Minus className="h-3 w-3" />}
            {item.change > 0 && "+"}
            {item.change.toFixed(1)}%
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Ticker;
