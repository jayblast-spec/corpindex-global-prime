import { motion } from "framer-motion";
import { ArrowRight, Briefcase, Building2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CTASection = () => (
  <section className="py-20">
    <div className="container mx-auto px-4">
      <div className="grid gap-6 md:grid-cols-2">
        <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/20 to-primary/5 p-8 lg:p-10">
          <div className="absolute right-0 top-0 h-64 w-64 -translate-y-1/2 translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
          <div className="relative">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/20">
              <Building2 className="h-7 w-7 text-primary" />
            </div>
            <h3 className="mb-3 text-2xl font-bold">For Companies</h3>
            <p className="mb-6 max-w-md text-muted-foreground">
              Get your company evaluated and certified by CorpIndex. Join the elite ranks of verified global enterprises and gain instant credibility with investors and partners.
            </p>
            <Link to="/apply">
              <Button className="group">
                Apply for Indexing
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative overflow-hidden rounded-2xl border border-warning/20 bg-gradient-to-br from-warning/20 to-warning/5 p-8 lg:p-10">
          <div className="absolute right-0 top-0 h-64 w-64 -translate-y-1/2 translate-x-1/2 rounded-full bg-warning/10 blur-3xl" />
          <div className="relative">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-warning/20">
              <Briefcase className="h-7 w-7 text-warning" />
            </div>
            <h3 className="mb-3 text-2xl font-bold">For Partners & Advertisers</h3>
            <p className="mb-6 max-w-md text-muted-foreground">
              Reach high-value decision makers and investors through premium sponsorship opportunities. Connect with our exclusive audience of executives and analysts.
            </p>
            <Link to="/partner">
              <Button variant="premium" className="group">
                Become a Partner
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default CTASection;
