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
  summary: string;
}

export const companies: Company[] = [
  { rank: 1, name: "Apple Inc.", ticker: "AAPL", score: 94.2, change: 2.3, sentiment: "bullish", status: "verified", country: "US", sector: "Technology", summary: "Premium consumer ecosystem with durable revenue quality and world-class brand trust." },
  { rank: 2, name: "Microsoft Corporation", ticker: "MSFT", score: 93.8, change: 1.1, sentiment: "bullish", status: "verified", country: "US", sector: "Technology", summary: "Enterprise software, cloud infrastructure, and AI distribution at global scale." },
  { rank: 3, name: "Alphabet Inc.", ticker: "GOOGL", score: 92.5, change: -0.4, sentiment: "neutral", status: "verified", country: "US", sector: "Technology", summary: "Search, ads, cloud, and frontier AI assets with regulatory scrutiny." },
  { rank: 4, name: "Amazon.com Inc.", ticker: "AMZN", score: 91.7, change: 0.8, sentiment: "bullish", status: "verified", country: "US", sector: "Consumer", summary: "Commerce, logistics, and AWS create one of the strongest corporate operating systems." },
  { rank: 5, name: "NVIDIA Corporation", ticker: "NVDA", score: 90.9, change: 3.2, sentiment: "bullish", status: "verified", country: "US", sector: "Technology", summary: "AI compute leadership with exceptional demand and ecosystem leverage." },
  { rank: 6, name: "Meta Platforms Inc.", ticker: "META", score: 89.4, change: -1.2, sentiment: "bearish", status: "verified", country: "US", sector: "Technology", summary: "Massive attention network with AI ad efficiency and metaverse investment risk." },
  { rank: 7, name: "Tesla Inc.", ticker: "TSLA", score: 88.1, change: 0, sentiment: "neutral", status: "verified", country: "US", sector: "Automotive", summary: "High brand gravity across EVs, energy, autonomy, and robotics." },
  { rank: 8, name: "Berkshire Hathaway", ticker: "BRK.B", score: 87.6, change: 0.5, sentiment: "bullish", status: "verified", country: "US", sector: "Financial", summary: "Diversified cash generation and long-term governance credibility." },
  { rank: 9, name: "JPMorgan Chase", ticker: "JPM", score: 86.3, change: 1.8, sentiment: "bullish", status: "verified", country: "US", sector: "Financial", summary: "Global banking franchise with institutional trust and risk discipline." },
  { rank: 10, name: "Visa Inc.", ticker: "V", score: 85.9, change: -0.3, sentiment: "neutral", status: "verified", country: "US", sector: "Financial", summary: "Payments network scale with exceptional margins and regulatory exposure." },
  { rank: 11, name: "Samsung Electronics", ticker: "005930.KS", score: 85.2, change: 1.5, sentiment: "bullish", status: "verified", country: "KR", sector: "Technology", summary: "Semiconductors, devices, and manufacturing depth across global supply chains." },
  { rank: 12, name: "LVMH", ticker: "MC.PA", score: 84.8, change: 0.9, sentiment: "bullish", status: "verified", country: "FR", sector: "Luxury", summary: "Luxury portfolio with pricing power and cross-market brand prestige." },
  { rank: 13, name: "Toyota Motor", ticker: "TM", score: 84.1, change: -0.2, sentiment: "neutral", status: "verified", country: "JP", sector: "Automotive", summary: "Manufacturing reliability and global distribution with transition timing questions." },
  { rank: 14, name: "Nestle", ticker: "NESN.SW", score: 83.7, change: 0.4, sentiment: "bullish", status: "pending", country: "CH", sector: "Consumer", summary: "Consumer staples leader with resilient demand and certification pending." },
  { rank: 15, name: "ASML Holding", ticker: "ASML", score: 83.2, change: 2.1, sentiment: "bullish", status: "verified", country: "NL", sector: "Technology", summary: "Critical semiconductor equipment monopoly with geopolitical sensitivity." },
];
