import { Github, Linkedin, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

const footerGroups = [
  { title: "Rankings", links: [["Global Top 100", "/rankings"], ["By Country", "/rankings/country"], ["By Sector", "/rankings/sector"], ["Top Startups", "/rankings/startups"]] },
  { title: "Company", links: [["About Us", "/about"], ["Methodology", "/methodology"], ["News & Insights", "/news"], ["Careers", "/careers"]] },
  { title: "Services", links: [["Apply for Review", "/apply"], ["Advertise", "/partner"], ["Partner", "/partner"], ["API Access", "/api"]] },
  { title: "Legal", links: [["Privacy Policy", "/privacy"], ["Terms of Service", "/terms"], ["Cookie Policy", "/cookies"]] },
];

const Footer = () => (
  <footer className="border-t border-border/50 bg-card/50">
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
        <div className="col-span-2 md:col-span-1">
          <Link to="/" className="mb-4 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-gradient-to-br from-primary to-primary/70">
              <span className="font-mono text-sm font-bold text-primary-foreground">CI</span>
            </div>
            <span className="text-lg font-semibold tracking-tight">
              Corp<span className="text-primary">Index</span>
            </span>
          </Link>
          <p className="mb-4 text-sm text-muted-foreground">
            The definitive global authority for corporate ranking and certification.
          </p>
          <div className="flex gap-3">
            {[Twitter, Linkedin, Github].map((Icon) => (
              <a key={Icon.displayName} href="#" className="text-muted-foreground transition-colors hover:text-primary">
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>

        {footerGroups.map((group) => (
          <div key={group.title}>
            <h4 className="mb-4 text-sm font-semibold">{group.title}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {group.links.map(([label, href]) => (
                <li key={href}>
                  <Link to={href} className="transition-colors hover:text-foreground">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-border/50 pt-8 md:flex-row">
        <p className="text-sm text-muted-foreground">© 2026 CorpIndex. All rights reserved.</p>
        <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
          <span className="h-2 w-2 animate-pulse rounded-full bg-success" />
          All systems operational
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
