import CTASection from "@/components/home/CTASection";
import FeaturesSection from "@/components/home/FeaturesSection";
import HeroSection from "@/components/home/HeroSection";
import RankingTable from "@/components/rankings/RankingTable";

const Home = () => (
  <>
    <HeroSection />
    <RankingTable />
    <FeaturesSection />
    <CTASection />
  </>
);

export default Home;
