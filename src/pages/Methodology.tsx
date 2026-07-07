import { Award, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const pillars = [
  { weight: "30%", title: "Financial Performance", body: "Revenue growth, profitability, cash flow stability, and return metrics across multiple timeframes.", items: ["Revenue CAGR", "EBITDA Margins", "Free Cash Flow", "ROE/ROA", "Debt Ratios"] },
  { weight: "20%", title: "Governance & Compliance", body: "Board structure, executive compensation, regulatory compliance, and ethical business practices.", items: ["Board Independence", "Audit Quality", "Regulatory Standing", "ESG Compliance", "Transparency Score"] },
  { weight: "20%", title: "Innovation & Technology", body: "R&D investment, patent portfolio, digital transformation, and technological competitive advantage.", items: ["R&D Investment", "Patent Filings", "Tech Adoption", "Digital Revenue", "AI Integration"] },
  { weight: "15%", title: "Market Position", body: "Market share, competitive moat, brand strength, and geographic diversification.", items: ["Market Share", "Brand Value", "Geographic Reach", "Customer Retention", "Competitive Moat"] },
  { weight: "15%", title: "Stakeholder Impact", body: "Employee satisfaction, customer experience, community engagement, and environmental responsibility.", items: ["Employee NPS", "Customer Satisfaction", "Community Impact", "Environmental Score", "Supply Chain Ethics"] },
];

const process = [
  ["01", "Data Collection", "We aggregate data from 200+ verified sources including financial filings, regulatory databases, and proprietary research."],
  ["02", "Quantitative Analysis", "Our algorithms process 500+ data points per company through our proprietary scoring framework."],
  ["03", "Qualitative Assessment", "Expert analysts review governance structures, strategic initiatives, and market positioning."],
  ["04", "Peer Comparison", "Companies are benchmarked against sector peers and global standards for relative scoring."],
  ["05", "Final Score Calculation", "Weighted scores are combined to generate the final $CI$ Score on a 0-100 scale."],
];

const Methodology = () => (
  <section className="container mx-auto px-4 py-16">
    <div className="mx-auto mb-12 max-w-3xl text-center">
      <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary">Proprietary Framework</p>
      <h1 className="mb-4 text-4xl font-bold md:text-5xl">Our Methodology</h1>
      <p className="text-lg text-muted-foreground">
        CorpIndex employs a rigorous, multi-dimensional framework to evaluate and rank companies. Our proprietary $CI$ Score synthesizes quantitative and qualitative factors across five core pillars.
      </p>
    </div>

    <div className="mb-14">
      <div className="mb-8 text-center">
        <h2 className="mb-2 text-3xl font-bold">The $CI$ Score Framework</h2>
        <p className="text-muted-foreground">Our score is built on five weighted pillars, each capturing essential dimensions of corporate excellence</p>
      </div>
      <div className="grid gap-5 lg:grid-cols-5">
        {pillars.map((pillar) => (
          <Card key={pillar.title} className="border-border/50">
            <CardContent className="p-6">
              <div className="mb-4 font-mono text-3xl font-bold text-primary">{pillar.weight}</div>
              <h3 className="mb-3 text-lg font-semibold">{pillar.title}</h3>
              <p className="mb-4 text-sm text-muted-foreground">{pillar.body}</p>
              <ul className="space-y-2 text-sm">
                {pillar.items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>

    <div className="mb-14">
      <div className="mb-8 text-center">
        <h2 className="mb-2 text-3xl font-bold">Evaluation Process</h2>
        <p className="text-muted-foreground">Our five-step evaluation process ensures consistency, accuracy, and fairness across all company assessments</p>
      </div>
      <div className="grid gap-4 md:grid-cols-5">
        {process.map(([step, title, body]) => (
          <Card key={step} className="border-border/50">
            <CardContent className="p-6">
              <div className="mb-4 font-mono text-2xl font-bold text-primary">{step}</div>
              <h3 className="mb-2 font-semibold">{title}</h3>
              <p className="text-sm text-muted-foreground">{body}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>

    <Card className="card-gradient border-border/50">
      <CardContent className="grid gap-8 p-8 lg:grid-cols-[1fr_260px]">
        <div>
          <h2 className="mb-3 text-3xl font-bold">Verification Status</h2>
          <p className="mb-5 text-muted-foreground">
            Companies can achieve "Verified" status by completing our enhanced due diligence process, which includes document verification, management interviews, and on-site assessments.
          </p>
          <ul className="grid gap-3 md:grid-cols-2">
            {["Enhanced credibility with investors", "Official CorpIndex certification badge", "Priority listing in search results", "Access to premium analytics"].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-primary/30 bg-background/70 p-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Award className="h-7 w-7" />
          </div>
          <p className="text-sm text-muted-foreground">CorpIndex Score</p>
          <p className="font-mono text-4xl font-bold text-primary">$94.2</p>
          <p className="mt-2 text-sm font-semibold text-success">Verified Company</p>
        </div>
      </CardContent>
    </Card>
  </section>
);

export default Methodology;
