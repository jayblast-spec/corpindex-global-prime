import RankingTable from "@/components/rankings/RankingTable";

const Rankings = () => (
  <div className="py-8">
    <div className="container mx-auto px-4 pb-4">
      <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary">CorpIndex Prime</p>
      <h1 className="text-4xl font-bold md:text-5xl">Corporate Rankings</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        Compare the highest-scoring public and private companies by certification status, market signal, and $CI$ score.
      </p>
    </div>
    <RankingTable />
  </div>
);

export default Rankings;
