import { Card, CardContent } from "@/components/ui/card";

const stats = [
  ["10,247", "Companies Indexed"],
  ["147", "Countries Covered"],
  ["2,418", "Verified Firms"],
  ["500K+", "Active Users"],
];

const leaders = [
  ["Alexandra Chen", "CEO & Founder"],
  ["Marcus Williams", "Chief Data Officer"],
  ["Sarah Mitchell", "Head of Research"],
  ["David Park", "VP Engineering"],
];

const values = [
  ["Transparency", "We believe in complete transparency in our methodology, data sources, and evaluation criteria. Our process is open for scrutiny."],
  ["Integrity", "Our rankings are immune to influence. No company can pay for a better score. Our credibility is our most valuable asset."],
  ["Excellence", "We hold ourselves to the same standards we apply to the companies we evaluate. Continuous improvement is in our DNA."],
];

const About = () => (
  <section className="container mx-auto px-4 py-16">
    <div className="mx-auto mb-12 max-w-4xl text-center">
      <h1 className="mb-5 text-4xl font-bold md:text-6xl">Defining the Global Standard for Corporate Excellence</h1>
      <p className="text-lg text-muted-foreground">
        CorpIndex was founded with a singular mission: to create the most comprehensive, transparent, and authoritative ranking system for global corporations. We believe that trust in business starts with transparency.
      </p>
    </div>

    <div className="mb-14 grid gap-4 md:grid-cols-4">
      {stats.map(([value, label]) => (
        <Card key={label} className="border-border/50 text-center">
          <CardContent className="p-6">
            <p className="font-mono text-4xl font-bold text-primary">{value}</p>
            <p className="mt-2 text-sm text-muted-foreground">{label}</p>
          </CardContent>
        </Card>
      ))}
    </div>

    <div className="mb-14 grid gap-5 md:grid-cols-2">
      {[
        ["Our Mission", "To provide investors, executives, and institutions with the most reliable, data-driven insights into corporate performance and governance. We empower stakeholders to make informed decisions through transparent, rigorous evaluation."],
        ["Our Vision", "To become the definitive global benchmark for corporate excellence, trusted by every major investor, analyst, and business leader. We envision a world where corporate transparency is the norm, not the exception."],
      ].map(([title, body]) => (
        <Card key={title} className="card-gradient border-border/50">
          <CardContent className="p-8">
            <h2 className="mb-3 text-3xl font-bold">{title}</h2>
            <p className="text-muted-foreground">{body}</p>
          </CardContent>
        </Card>
      ))}
    </div>

    <div className="mb-14 text-center">
      <h2 className="mb-2 text-3xl font-bold">Leadership Team</h2>
      <p className="mb-8 text-muted-foreground">Our team combines decades of experience in finance, data science, and corporate governance</p>
      <div className="grid gap-5 md:grid-cols-4">
        {leaders.map(([name, role]) => (
          <Card key={name} className="border-border/50">
            <CardContent className="p-6">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/15 font-mono text-xl font-bold text-primary">
                {name.split(" ").map((part) => part[0]).join("")}
              </div>
              <h3 className="font-semibold">{name}</h3>
              <p className="text-sm text-muted-foreground">{role}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>

    <div>
      <h2 className="mb-8 text-center text-3xl font-bold">Our Values</h2>
      <div className="grid gap-5 md:grid-cols-3">
        {values.map(([title, body]) => (
          <Card key={title} className="border-border/50">
            <CardContent className="p-6">
              <h3 className="mb-3 text-xl font-semibold">{title}</h3>
              <p className="text-muted-foreground">{body}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </section>
);

export default About;
