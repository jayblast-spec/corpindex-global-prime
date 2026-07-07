import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const articles = [
  ["Rankings Update", "Q4 2024 Global Rankings: Tech Giants Maintain Dominance Amid Market Shifts", "Apple retains the top spot for the eighth consecutive quarter, while NVIDIA sees the largest score increase driven by AI infrastructure demand.", "December 15, 2024", "8 min read"],
  ["Methodology", "Methodology Update: ESG Metrics Now Weighted at 15%", "Starting January 2025, environmental and social governance factors will carry increased weight in our $CI$ Score calculations.", "December 12, 2024", "5 min read"],
  ["Analysis", "European Companies Surge in Latest Rankings", "LVMH and ASML lead a wave of European firms climbing the global rankings, reflecting strong Q3 performance.", "December 10, 2024", "6 min read"],
  ["Announcement", "New Verification Process Launches for Startups", "CorpIndex introduces a streamlined verification pathway for high-growth startups with $50M+ valuations.", "December 8, 2024", "4 min read"],
  ["Regional", "Asian Markets: Japan and Korea Lead Regional Growth", "Analysis of the top-performing companies in the Asia-Pacific region and what's driving their success.", "December 5, 2024", "7 min read"],
  ["Sector Analysis", "Healthcare Sector: Innovation Drives Score Improvements", "Pharmaceutical and biotech companies see significant score improvements as R&D investments pay off.", "December 3, 2024", "6 min read"],
  ["Education", "Understanding the $CI$ Score: A Deep Dive", "A comprehensive guide to interpreting CorpIndex scores and what they mean for investors.", "December 1, 2024", "10 min read"],
];

const News = () => (
  <section className="container mx-auto px-4 py-16">
    <div className="mx-auto mb-12 max-w-3xl text-center">
      <h1 className="mb-4 text-4xl font-bold md:text-5xl">News & Insights</h1>
      <p className="text-lg text-muted-foreground">The latest updates on global rankings, methodology changes, and market analysis</p>
    </div>
    <div className="grid gap-5">
      {articles.map(([category, title, body, date, read], index) => (
        <Card key={title} className={index === 0 ? "card-gradient border-primary/30" : "border-border/50"}>
          <CardContent className="p-6">
            <p className="mb-2 text-sm font-semibold text-primary">{category}</p>
            <h2 className="mb-3 text-2xl font-bold">{title}</h2>
            <p className="mb-4 text-muted-foreground">{body}</p>
            <p className="text-sm text-muted-foreground">
              {date} • {read}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
    <div className="mt-8 text-center">
      <Button variant="outline" size="lg">Load More Articles</Button>
    </div>
  </section>
);

export default News;
