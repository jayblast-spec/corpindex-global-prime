import { Card, CardContent } from "@/components/ui/card";

const copy: Record<string, { title: string; body: string }> = {
  about: {
    title: "About CorpIndex",
    body: "CorpIndex is building the credibility layer for corporate intelligence: rankings, certification, and research surfaces trusted by investors and operators.",
  },
  methodology: {
    title: "Methodology",
    body: "The MVP score is a transparent composite across financial performance, governance, innovation, market position, operating resilience, and verification status.",
  },
  news: {
    title: "News & Insights",
    body: "Market notes, certification announcements, and corporate ranking changes will live here as the editorial engine comes online.",
  },
  careers: {
    title: "Careers",
    body: "CorpIndex will need analysts, research operators, growth engineers, and data partnerships once the ranking product proves demand.",
  },
  api: {
    title: "API Access",
    body: "The API layer is planned for partners that need programmatic access to $CI$ scores, certification status, and ranking movement.",
  },
  privacy: {
    title: "Privacy Policy",
    body: "This MVP does not store personal data on a server. Backend collection should be added with explicit consent, retention policy, and Supabase RLS.",
  },
  terms: {
    title: "Terms of Service",
    body: "CorpIndex rankings are informational and should not be treated as investment advice. Full terms should be reviewed before launch.",
  },
  cookies: {
    title: "Cookie Policy",
    body: "No tracking cookies are required in this MVP. Analytics can be added later with a clear cookie and privacy posture.",
  },
};

const SimplePage = ({ slug }: { slug: string }) => {
  const page = copy[slug] || copy.about;
  return (
    <section className="container mx-auto px-4 py-16">
      <Card className="card-gradient border-border/50">
        <CardContent className="p-8 md:p-12">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary">CorpIndex</p>
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">{page.title}</h1>
          <p className="max-w-3xl text-lg text-muted-foreground">{page.body}</p>
        </CardContent>
      </Card>
    </section>
  );
};

export default SimplePage;
