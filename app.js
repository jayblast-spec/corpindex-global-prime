const markets = [
  {
    country: "United States",
    region: "North America",
    score: 91,
    signal: "Deep enterprise demand and mature capital markets.",
    fit: "Best for premium SaaS, AI infrastructure, and enterprise platforms.",
  },
  {
    country: "United Arab Emirates",
    region: "Middle East",
    score: 86,
    signal: "Fast policy execution and strong regional headquarters pull.",
    fit: "Best for fintech, logistics, wealth, and B2B services.",
  },
  {
    country: "Singapore",
    region: "Asia Pacific",
    score: 85,
    signal: "High trust infrastructure and gateway position into Southeast Asia.",
    fit: "Best for regulated technology, finance, and regional operations.",
  },
  {
    country: "Kenya",
    region: "Africa",
    score: 78,
    signal: "Mobile-money maturity and strong startup operating culture.",
    fit: "Best for payments, agritech, healthtech, and SMB software.",
  },
  {
    country: "Nigeria",
    region: "Africa",
    score: 76,
    signal: "Massive population scale with fintech and creator-economy momentum.",
    fit: "Best for consumer platforms, fintech, logistics, media, and AI services.",
  },
  {
    country: "Ghana",
    region: "Africa",
    score: 72,
    signal: "Improving digital rails and accessible English-speaking talent base.",
    fit: "Best for BPO, education, health, and regional pilot launches.",
  },
  {
    country: "Brazil",
    region: "Latin America",
    score: 74,
    signal: "Large domestic market with expanding digital commerce behavior.",
    fit: "Best for marketplace, fintech, and consumer subscription plays.",
  },
  {
    country: "India",
    region: "Asia Pacific",
    score: 83,
    signal: "Developer depth, payments scale, and vast SMB digitization demand.",
    fit: "Best for AI tools, SMB SaaS, commerce infrastructure, and education.",
  },
  {
    country: "United Kingdom",
    region: "Europe",
    score: 82,
    signal: "Strong financial services ecosystem and global business credibility.",
    fit: "Best for fintech, compliance, creative services, and enterprise software.",
  },
];

const nigeriaBrief = [
  {
    title: "Demand thesis",
    body: "Large youth population, fast social commerce adoption, and visible willingness to adopt digital-first financial tools.",
  },
  {
    title: "Operating friction",
    body: "Currency volatility, trust gaps, logistics constraints, and regulatory changes need local partnerships and narrow launch scope.",
  },
  {
    title: "MVP wedge",
    body: "Start with a Lagos-centered B2B or fintech pilot, prove retention, then expand into Abuja, Port Harcourt, and regional corridors.",
  },
];

const els = {
  mapGrid: document.querySelector("#map-grid"),
  rankingBody: document.querySelector("#ranking-body"),
  searchInput: document.querySelector("#search-input"),
  regionFilter: document.querySelector("#region-filter"),
  averageScore: document.querySelector("#average-score"),
  totalMarkets: document.querySelector("#total-markets"),
  topRegion: document.querySelector("#top-region"),
  highestScore: document.querySelector("#highest-score"),
  nigeriaRank: document.querySelector("#nigeria-rank"),
  nigeriaBrief: document.querySelector("#nigeria-brief"),
  leadForm: document.querySelector("#lead-form"),
  formStatus: document.querySelector("#form-status"),
};

function scoreClass(score) {
  if (score >= 82) return "high";
  if (score >= 73) return "medium";
  return "low";
}

function rankedMarkets() {
  return [...markets].sort((a, b) => b.score - a.score);
}

function renderRegionOptions() {
  const regions = [...new Set(markets.map((market) => market.region))].sort();

  for (const region of regions) {
    const option = document.createElement("option");
    option.value = region;
    option.textContent = region;
    els.regionFilter.append(option);
  }
}

function renderMap() {
  const topMarkets = rankedMarkets().slice(0, 9);
  els.mapGrid.replaceChildren(
    ...topMarkets.map((market) => {
      const tile = document.createElement("article");
      tile.className = "market-tile";
      tile.innerHTML = `
        <span>${market.region}</span>
        <strong>${market.country}</strong>
        <div class="score ${scoreClass(market.score)}">${market.score}</div>
      `;
      return tile;
    }),
  );
}

function renderRankings() {
  const query = els.searchInput.value.trim().toLowerCase();
  const region = els.regionFilter.value;

  const rows = rankedMarkets().filter((market) => {
    const matchesQuery =
      market.country.toLowerCase().includes(query) ||
      market.region.toLowerCase().includes(query) ||
      market.fit.toLowerCase().includes(query);
    const matchesRegion = region === "all" || market.region === region;
    return matchesQuery && matchesRegion;
  });

  els.rankingBody.replaceChildren(
    ...rows.map((market, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${index + 1}</td>
        <td><strong>${market.country}</strong></td>
        <td>${market.region}</td>
        <td><span class="score ${scoreClass(market.score)}">${market.score}</span></td>
        <td>${market.signal}</td>
        <td>${market.fit}</td>
      `;
      return row;
    }),
  );
}

function renderMetrics() {
  const ranked = rankedMarkets();
  const average = Math.round(markets.reduce((sum, market) => sum + market.score, 0) / markets.length);
  const regionTotals = markets.reduce((acc, market) => {
    acc[market.region] = (acc[market.region] || 0) + market.score;
    return acc;
  }, {});
  const topRegion = Object.entries(regionTotals).sort((a, b) => b[1] - a[1])[0][0];
  const nigeriaPosition = ranked.findIndex((market) => market.country === "Nigeria") + 1;

  els.averageScore.textContent = `${average}/100 avg`;
  els.totalMarkets.textContent = markets.length;
  els.topRegion.textContent = topRegion;
  els.highestScore.textContent = `${ranked[0].score}/100`;
  els.nigeriaRank.textContent = `#${nigeriaPosition}`;
}

function renderNigeriaBrief() {
  els.nigeriaBrief.replaceChildren(
    ...nigeriaBrief.map((item) => {
      const article = document.createElement("article");
      article.innerHTML = `<strong>${item.title}</strong><p>${item.body}</p>`;
      return article;
    }),
  );
}

function handleLeadSubmit(event) {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const email = String(data.get("email") || "");
  const market = String(data.get("market") || "Nigeria");

  localStorage.setItem(
    "corpindexLead",
    JSON.stringify({
      email,
      market,
      createdAt: new Date().toISOString(),
    }),
  );

  els.formStatus.textContent = `Saved. We will prioritize the ${market} brief for ${email}.`;
  event.currentTarget.reset();
}

function init() {
  renderRegionOptions();
  renderMap();
  renderMetrics();
  renderNigeriaBrief();
  renderRankings();

  els.searchInput.addEventListener("input", renderRankings);
  els.regionFilter.addEventListener("change", renderRankings);
  els.leadForm.addEventListener("submit", handleLeadSubmit);
}

init();
