import { FormEvent, useState } from "react";
import { Briefcase, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const Partner = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="py-16">
      <div className="container mx-auto grid gap-8 px-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-warning">Partner program</p>
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">Reach executives through CorpIndex.</h1>
          <p className="text-lg text-muted-foreground">
            Sponsorship, research partnerships, and data access become real revenue paths once ranking traffic is validated.
          </p>
        </div>
        <Card className="card-gradient border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-warning" />
              Partner inquiry
            </CardTitle>
            <CardDescription>Capture partner demand before building the marketplace.</CardDescription>
          </CardHeader>
          <CardContent>
            {submitted ? (
              <div className="rounded-lg border border-success/40 bg-success/10 p-5 text-success">
                <CheckCircle2 className="mb-3 h-6 w-6" />
                Partner inquiry captured. This is ready to wire into Supabase when we add backend storage.
              </div>
            ) : (
              <form className="grid gap-4" onSubmit={handleSubmit}>
                <Input required placeholder="Name" />
                <Input required type="email" placeholder="Work email" />
                <Input required placeholder="Company" />
                <Input placeholder="Partnership type" />
                <Button type="submit" variant="premium">
                  Become a Partner
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Partner;
