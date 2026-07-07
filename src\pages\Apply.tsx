import { FormEvent, useState } from "react";
import { Building2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

const Apply = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="py-16">
      <div className="container mx-auto grid gap-8 px-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary">Company review</p>
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">Apply for CorpIndex certification.</h1>
          <p className="text-lg text-muted-foreground">
            Submit your company for preliminary indexing. The MVP captures qualification intent before automating the full 200+ point review workflow.
          </p>
        </div>
        <Card className="card-gradient border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Indexing application
            </CardTitle>
            <CardDescription>Tell the review desk where to start.</CardDescription>
          </CardHeader>
          <CardContent>
            {submitted ? (
              <div className="rounded-lg border border-success/40 bg-success/10 p-5 text-success">
                <CheckCircle2 className="mb-3 h-6 w-6" />
                Your application intent has been captured for the MVP review queue.
              </div>
            ) : (
              <form className="grid gap-4" onSubmit={handleSubmit}>
                <Input required placeholder="Company name" />
                <Input required type="email" placeholder="Work email" />
                <Input required placeholder="Website" />
                <Input placeholder="Sector" />
                <label className="flex items-start gap-3 text-sm text-muted-foreground">
                  <Checkbox required className="mt-1" />
                  I confirm this company can be contacted for preliminary CorpIndex review.
                </label>
                <Button type="submit" variant="terminal">
                  Submit for Review
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Apply;
