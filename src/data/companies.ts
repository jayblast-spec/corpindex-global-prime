export interface Company {
  rank: number;
  name: string;
  ticker: string;
  score: number;
  change: number;
  sentiment: "bullish" | "bearish" | "neutral";
  status: "verified" | "pending";
  country: string;
  sector: string;
  marketCap: string;
  summary: string;
}

export const companies: Company[] = [
  { rank: 1, name: "Apple Inc.", ticker: "AAPL", score: 94.2, change: 2.3, sentiment: "bullish", status: "verified", country: "United States", sector: "Technology", marketCap: "$3.0T", summary: "Premium consumer ecosystem with durable revenue quality and world-class brand trust." },
  { rank: 2, name: "Microsoft Corporation", ticker: "MSFT", score: 93.8, change: 1.1, sentiment: "bullish", status: "verified", country: "United States", sector: "Technology", marketCap: "$2.8T", summary: "Enterprise software, cloud infrastructure, and AI distribution at global scale." },
  { rank: 3, name: "Alphabet Inc.", ticker: "GOOGL", score: 92.5, change: -0.4, sentiment: "neutral", status: "verified", country: "United States", sector: "Technology", marketCap: "$1.9T", summary: "Search, ads, cloud, and frontier AI assets with regulatory scrutiny." },
  { rank: 4, name: "Amazon.com Inc.", ticker: "AMZN", score: 91.7, change: 0.8, sentiment: "bullish", status: "verified", country: "United States", sector: "Consumer", marketCap: "$1.8T", summary: "Commerce, logistics, and AWS create one of the strongest corporate operating systems." },
  { rank: 5, name: "NVIDIA Corporation", ticker: "NVDA", score: 90.9, change: 3.2, sentiment: "bullish", status: "verified", country: "United States", sector: "Technology", marketCap: "$1.7T", summary: "AI compute leadership with exceptional demand and ecosystem leverage." },
  { rank: 6, name: "Meta Platforms Inc.", ticker: "META", score: 89.4, change: -1.2, sentiment: "bearish", status: "verified", country: "United States", sector: "Technology", marketCap: "$1.2T", summary: "Massive attention network with AI ad efficiency and metaverse investment risk." },
  { rank: 7, name: "Tesla Inc.", ticker: "TSLA", score: 88.1, change: 0, sentiment: "neutral", status: "verified", country: "United States", sector: "Automotive", marketCap: "$780B", summary: "High brand gravity across EVs, energy, autonomy, and robotics." },
  { rank: 8, name: "Berkshire Hathaway", ticker: "BRK.B", score: 87.6, change: 0.5, sentiment: "bullish", status: "verified", country: "United States", sector: "Financial", marketCap: "$760B", summary: "Diversified cash generation and long-term governance credibility." },
  { rank: 9, name: "JPMorgan Chase", ticker: "JPM", score: 86.3, change: 1.8, sentiment: "bullish", status: "verified", country: "United States", sector: "Financial", marketCap: "$540B", summary: "Global banking franchise with institutional trust and risk discipline." },
  { rank: 10, name: "Visa Inc.", ticker: "V", score: 85.9, change: -0.3, sentiment: "neutral", status: "verified", country: "United States", sector: "Financial", marketCap: "$520B", summary: "Payments network scale with exceptional margins and regulatory exposure." },
  { rank: 11, name: "Samsung Electronics", ticker: "005930.KS", score: 85.2, change: 1.5, sentiment: "bullish", status: "verified", country: "South Korea", sector: "Technology", marketCap: "$380B", summary: "Semiconductors, devices, and manufacturing depth across global supply chains." },
  { rank: 12, name: "LVMH", ticker: "MC.PA", score: 84.8, change: 0.9, sentiment: "bullish", status: "verified", country: "France", sector: "Luxury", marketCap: "$420B", summary: "Luxury portfolio with pricing power and cross-market brand prestige." },
  { rank: 13, name: "Toyota Motor", ticker: "TM", score: 84.1, change: -0.2, sentiment: "neutral", status: "verified", country: "Japan", sector: "Automotive", marketCap: "$290B", summary: "Manufacturing reliability and global distribution with transition timing questions." },
  { rank: 14, name: "Nestle", ticker: "NESN.SW", score: 83.7, change: 0.4, sentiment: "bullish", status: "pending", country: "Switzerland", sector: "Consumer", marketCap: "$270B", summary: "Consumer staples leader with resilient demand and certification pending." },
  { rank: 15, name: "ASML Holding", ticker: "ASML", score: 83.2, change: 2.1, sentiment: "bullish", status: "verified", country: "Netherlands", sector: "Technology", marketCap: "$350B", summary: "Critical semiconductor equipment monopoly with geopolitical sensitivity." },
  { rank: 16, name: "UnitedHealth Group", ticker: "UNH", score: 82.8, change: 0.7, sentiment: "bullish", status: "verified", country: "United States", sector: "Healthcare", marketCap: "$480B", summary: "Healthcare scale and payer-provider data depth create durable institutional value." },
  { rank: 17, name: "Novo Nordisk", ticker: "NVO", score: 82.4, change: 1.9, sentiment: "bullish", status: "verified", country: "Denmark", sector: "Healthcare", marketCap: "$430B", summary: "Pharmaceutical innovation and obesity-care demand support premium growth." },
  { rank: 18, name: "Walmart Inc.", ticker: "WMT", score: 81.9, change: 0.3, sentiment: "neutral", status: "verified", country: "United States", sector: "Retail", marketCap: "$420B", summary: "Retail scale, supply chain strength, and omnichannel reach." },
  { rank: 19, name: "Mastercard Inc.", ticker: "MA", score: 81.5, change: -0.5, sentiment: "neutral", status: "verified", country: "United States", sector: "Financial", marketCap: "$390B", summary: "Global card network with high trust and strong cross-border payments exposure." },
  { rank: 20, name: "Procter & Gamble", ticker: "PG", score: 81.1, change: 0.6, sentiment: "bullish", status: "verified", country: "United States", sector: "Consumer", marketCap: "$360B", summary: "Brand portfolio resilience and distribution discipline across essential categories." },
  { rank: 21, name: "Dangote Industries", ticker: "DANGCEM.NG", score: 79.8, change: 1.4, sentiment: "bullish", status: "verified", country: "Nigeria", sector: "Industrial", marketCap: "$14.2B", summary: "Industrial scale and regional infrastructure influence across West Africa." },
  { rank: 22, name: "MTN Nigeria", ticker: "MTNN.NG", score: 78.5, change: 0.9, sentiment: "bullish", status: "verified", country: "Nigeria", sector: "Telecom", marketCap: "$8.7B", summary: "Telecom distribution, mobile money adjacency, and resilient network demand." },
  { rank: 23, name: "BUA Cement", ticker: "BUACEMENT.NG", score: 76.2, change: 2.1, sentiment: "bullish", status: "verified", country: "Nigeria", sector: "Industrial", marketCap: "$6.4B", summary: "Industrial production capacity positioned for infrastructure demand." },
  { rank: 24, name: "Airtel Africa", ticker: "AIRTELAFRI.NG", score: 75.8, change: 0.7, sentiment: "bullish", status: "verified", country: "Nigeria", sector: "Telecom", marketCap: "$5.2B", summary: "Pan-African telecom exposure with meaningful Nigerian market weight." },
  { rank: 25, name: "Zenith Bank", ticker: "ZENITHBANK.NG", score: 74.3, change: -0.2, sentiment: "neutral", status: "verified", country: "Nigeria", sector: "Financial", marketCap: "$2.8B", summary: "Tier-one bank with strong corporate banking and digital channel adoption." },
  { rank: 26, name: "GTBank Holding", ticker: "GTCO.NG", score: 73.9, change: 1.1, sentiment: "bullish", status: "verified", country: "Nigeria", sector: "Financial", marketCap: "$2.5B", summary: "Consumer and SME banking brand with efficient operating model." },
  { rank: 27, name: "Seplat Energy", ticker: "SEPLAT.NG", score: 72.6, change: 0.5, sentiment: "neutral", status: "pending", country: "Nigeria", sector: "Energy", marketCap: "$1.9B", summary: "Energy asset base with transition and governance diligence still pending." },
  { rank: 28, name: "Access Holdings", ticker: "ACCESSCORP.NG", score: 71.4, change: -0.8, sentiment: "bearish", status: "verified", country: "Nigeria", sector: "Financial", marketCap: "$1.6B", summary: "Regional banking expansion with integration and operating-risk questions." },
];

export const sectors = Array.from(new Set(companies.map((company) => company.sector))).sort();
export const countries = Array.from(new Set(companies.map((company) => company.country))).sort();
