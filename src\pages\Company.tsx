import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Clock, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { companies } from "@/data/companies";

const Company = () => {
  const params = useParams();
  const company = companies.find((item) => item.ticker.toLowerCase() === params.ticker);

  if (!company) {
    return (
      <section className="container mx-auto px-4 py-16">
        <Link to="/rankings">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4" />
            Back to rankings
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Company not found</h1>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-16">
      <Link to="/rankings">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to rankings
        </Button>
      </Link>
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <Card className="card-gradient border-border/50">
          <CardHeader>
            <div className="mb-4 flex items-center justify-between gap-4">
              <span className="rank-badge rank-gold">#{company.rank}</span>
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
            </div>
            <CardTitle className="text-4xl">{company.name}</CardTitle>
            <p className="font-mono text-muted-foreground">
              {company.ticker} • {company.country} • {company.sector}
            </p>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-muted-foreground">{company.summary}</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>CorpIndex Score</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <div className="font-mono text-5xl font-bold text-primary">${company.score.toFixed(1)}</div>
              <p className="mt-1 text-sm text-muted-foreground">Composite corporate excellence score</p>
            </div>
            <div className="flex items-center gap-2 text-success">
              <TrendingUp className="h-4 w-4" />
              <span className="font-mono">
                {company.change > 0 && "+"}
                {company.change.toFixed(1)}%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Company;
