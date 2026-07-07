import { motion } from "framer-motion";
import { ArrowRight, Globe, Shield, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const stats = [
  { icon: Globe, value: "147", label: "Countries Tracked" },
  { icon: TrendingUp, value: "10K+", label: "Companies Indexed" },
  { icon: Shield, value: "2.4K", label: "Verified Firms" },
];

const HeroSection = () => (
  <section className="relative overflow-hidden py-20 lg:py-32">
    <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
    <div className="absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />

    <div className="container relative mx-auto px-4">
      <div className="mx-auto max-w-4xl text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 inline-flex items-center gap-2 rounded-full border border-border/50 bg-card px-4 py-2">
          <span className="h-2 w-2 animate-pulse rounded-full bg-success" />
          <span className="text-sm font-medium text-muted-foreground">Live Rankings • Updated in Real-Time</span>
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6 text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
          The Global Standard for <span className="text-gradient-primary">Corporate Excellence</span>
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl">
          CorpIndex ranks and certifies the world's top companies through rigorous, data-driven methodology. The definitive authority trusted by investors, executives, and institutions worldwide.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-16 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link to="/rankings">
            <Button size="xl" className="group">
              Explore Rankings
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link to="/apply">
            <Button variant="outline" size="xl">
              Submit Your Company
            </Button>
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mx-auto grid max-w-2xl grid-cols-3 gap-8">
          {stats.map(({ icon: Icon, value, label }) => (
            <div key={label} className="text-center">
              <div className="mb-2 flex items-center justify-center gap-2">
                <Icon className="h-5 w-5 text-primary" />
                <span className="font-mono text-3xl font-bold md:text-4xl">{value}</span>
              </div>
              <span className="text-sm text-muted-foreground">{label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  </section>
);

export default HeroSection;
