# CorpIndex Global Prime

CorpIndex Global Prime is an MVP dashboard for ranking corporate expansion readiness across global markets.

The first version is a static, deployable product surface that validates whether founders, operators, and analysts care about a practical market-readiness index before adding accounts, paid data feeds, or complex backend workflows.

## MVP Scope

- Responsive dashboard with global market rankings
- Interactive search and region filtering
- Prime score summary metrics
- Nigeria country brief as the first deep-dive template
- Operator waitlist capture stored in browser local storage
- Vercel-ready static deployment config

## Product Pipeline Notes

- CEO / Founder: Proves demand for a ranked market intelligence product.
- CTO: Static-first architecture keeps deployment fast and low-risk.
- Database/Auth: Deferred; no sensitive user data or authenticated workflows in MVP.
- Backend Logic: Deferred; score model is currently static and transparent.
- Frontend: Mobile-first single-page dashboard.
- Integration/API: Deferred until a data-source partner or internal research workflow exists.
- Security: No server-side secrets; static headers configured in `vercel.json`.
- Testing: `node --check app.js` plus local HTTP smoke test.
- Deployment: Ready for Vercel static hosting.
- Documentation/Growth: README and waitlist CTA included.

## Local Run

```bash
node server.mjs
```

Open `http://localhost:4173`.

## Files

- `index.html` - App shell and semantic content
- `styles.css` - Responsive product UI
- `app.js` - Market data, rankings, filters, metrics, and waitlist behavior
- `vercel.json` - Static hosting headers
- `server.mjs` - Local static server for smoke testing

## Next MVP Decisions

1. Replace static scores with a repeatable research rubric and source citations.
2. Add Supabase only when saved leads, admin editing, or user accounts are required.
3. Turn Nigeria into the first full market page with pricing, risk, and launch playbooks.
4. Add analytics to measure ranking views, searches, market interest, and waitlist conversion.
