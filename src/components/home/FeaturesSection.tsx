import { motion } from "framer-motion";
import { Award, BarChart3, Globe, Lock, Shield, Zap } from "lucide-react";

const features = [
  { icon: Shield, title: "Rigorous Vetting", description: "Every company undergoes comprehensive due diligence through our proprietary 200+ point evaluation framework." },
  { icon: BarChart3, title: "Data-Driven Scores", description: "Our $CI$ Score synthesizes financial performance, governance, innovation, and market positioning." },
  { icon: Globe, title: "Global Coverage", description: "Track and compare companies across 147 countries with localized insights and regional rankings." },
  { icon: Zap, title: "Real-Time Updates", description: "Rankings refresh continuously as new data flows in from our network of verified sources." },
  { icon: Award, title: "Premium Certification", description: "Verified companies receive official CorpIndex certification badges for credibility and trust." },
  { icon: Lock, title: "Institutional Grade", description: "Trusted by leading investment firms, analysts, and Fortune 500 executives worldwide." },
];

const FeaturesSection = () => (
  <section className="bg-card/30 py-20">
    <div className="container mx-auto px-4">
      <div className="mb-16 text-center">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-4 text-3xl font-bold md:text-4xl">
          The Authority in Corporate Intelligence
        </motion.h2>
        <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="mx-auto max-w-2xl text-lg text-muted-foreground">
          CorpIndex sets the global standard for evaluating and certifying corporate excellence
        </motion.p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <motion.div key={feature.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="group rounded-xl border border-border/50 bg-card p-6 transition-all duration-300 hover:border-primary/30">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
              <feature.icon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
            <p className="text-sm text-muted-foreground">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesSection;
