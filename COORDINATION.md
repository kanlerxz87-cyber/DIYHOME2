# COORDINATION.md — DIYHOME2 Shared Task Board

This file coordinates all workstreams for `kanlerxz87-cyber/DIYHOME2` (DIY Home Upgrades — Amazon Associates Publication, Verification Register & Operations Dashboard).

- **Repository:** `kanlerxz87-cyber/DIYHOME2`
- **Target Live Site:** `https://kanlerxz87-cyber.github.io/DIYHOME2/`
- **Selected Tracking ID:** `shopnow047c-20`
- **Active Working Branch:** `arena/b92d7dd8-diyhome2` (Arena single-branch session policy; all commits and PR originate from this branch)
- **Session ID:** `arena-b92d7dd8`
- **Last Updated (UTC):** `2026-11-20`

---

## Task Board

| Task ID | Task Description | Status | Owning Session | Branch | File Scope | Notes / Verification |
| --- | --- | --- | --- | --- | --- | --- |
| T-01 | Repository audit, product redirect resolution, line-by-line official source verification & structured data files | `done` | `arena-b92d7dd8` | `arena/b92d7dd8-diyhome2` | `data/*.json`, `EXECUTIVE_SUMMARY.md` | Verified all 4 submitted links (3 unique + 1 duplicate), 15 official sources (`S01`–`S12`, `P01`–`P03`), and 10 flagged items |
| T-02 | Privacy-preserving analytics client (5 defined events), self-hosted collector specification & empty provenance-tracked campaign ledger | `done` | `arena-b92d7dd8` | `arena/b92d7dd8-diyhome2` | `assets/js/analytics.js`, `analytics/**`, `data/campaign-ledger.json` | Smoke-tested `analytics/endpoint/server.mjs` (`202` valid event, `400` disallowed event, accurate `/summary`); campaign ledger initialized empty |
| T-03 | Publication front page, design system, bespoke editorial SVG imagery, category pages & 4 question-shaped buyer guides | `done` | `arena-b92d7dd8` | `arena/b92d7dd8-diyhome2` | `index.html`, `assets/css/**`, `assets/img/**`, `assets/js/app.js`, `categories/**`, `guides/**`, `about.html` | Front page leads with products & buyer questions; masthead + footer verbatim disclosures above the fold; all Amazon links marked `rel="sponsored"` |
| T-04 | Dashboard & verification surfaces (Executive Summary, Product Register, Compliance Gate, Analytics Hub, Flagged for Review) | `done` | `arena-b92d7dd8` | `arena/b92d7dd8-diyhome2` | `summary.html`, `dashboard.html`, `compliance.html`, `analytics.html`, `flagged.html` | Every dashboard table row links to an official `https://` source; unverified/API-gated fields left blank & flagged |
| T-05 | Findability & automation (RSS `feed.xml`, `sitemap.xml`, `robots.txt`, `.nojekyll`, automated compliance gate script & GitHub Actions workflow) | `done` | `arena-b92d7dd8` | `arena/b92d7dd8-diyhome2` | `feed.xml`, `sitemap.xml`, `robots.txt`, `.nojekyll`, `scripts/verify_site.mjs`, `.github/workflows/compliance-gate.yml`, `README.md` | `node scripts/verify_site.mjs` passed 7/7 checks (14 HTML pages, 41 outbound Amazon links, 496 internal links, 0 errors); HTTP 200 verified on all 31 routes/assets |
| T-06 | Final integration verification, PR to `main`, merge & GitHub Pages live deployment verification | `in progress` | `arena-b92d7dd8` | `arena/b92d7dd8-diyhome2` | All site outputs | Opening PR from `arena/b92d7dd8-diyhome2` to `main`, merging, and verifying live GitHub Pages deployment |

---

## Verified Official Sources Log (2026-11-20)

- **S01** Amazon Associates Program Operating Agreement — `https://affiliate-program.amazon.com/help/operating/agreement`
- **S02** Amazon Associates Program Policies (Updated April 14, 2026) — `https://affiliate-program.amazon.com/help/operating/policies`
- **S03** Amazon Associates Operating Agreement Changes (Effective April 14, 2026) — `https://affiliate-program.amazon.com/help/operating/compare`
- **S04** Amazon Associates Standard Commission Income Rates (Table 1) — `https://affiliate-program.amazon.com/help/node/topic/GRXPHT8U84RAYDXZ`
- **S05** Amazon Onsite Associates Commission Income Statement — `https://affiliate-program.amazon.com/help/node/topic/G4ARBJC7Z2NK48CA`
- **S06** Amazon PA-API 5 Deprecation Notice & Creators API Migration — `https://affiliate-program.amazon.com/creatorsapi/docs/en-us/paapiv5-deprecation`
- **S07** FTC Endorsement Guides: What People Are Asking (16 C.F.R. Part 255) — `https://www.ftc.gov/business-guidance/resources/ftcs-endorsement-guides-what-people-are-asking`
- **S08** Amazon Associates Help: Why Identify Yourself as an Associate — `https://affiliate-program.amazon.com/help/node/topic/GHQNZAU6669EZS98`
- **S09** Amazon Associates Application Review Process — `https://affiliate-program.amazon.com/help/node/topic/G8TW5AE9XL2VX9VM`
- **S10** Amazon Standard Identification Number (ASIN) Definition — `https://sell.amazon.com/blog/fba-new-selection-program`
- **S11** Google Search Central: Qualify Outbound Links (`rel="sponsored"`) — `https://developers.google.com/search/docs/crawling-indexing/qualify-outbound-links`
- **S12** Google Search Central: Spam Policies (Link Spam & Thin Affiliation) — `https://developers.google.com/search/docs/essentials/spam-policies`
- **P01** Amazon US Product Detail Page (Observed Redirect of `link.amazon/B0hmGG4m2`) — `https://www.amazon.com/dp/B08FKW9JRM`
- **P02** Amazon US Product Detail Page (Observed Redirect of `link.amazon/B03QDuGdo`, submitted twice) — `https://www.amazon.com/dp/B0BSKQW2T2`
- **P03** Amazon US Product Detail Page (Observed Redirect of `link.amazon/B0hpD2JGQ`) — `https://www.amazon.com/dp/B08DY9HRWD`

---

## Flagged Irregularities Summary (Published on `flagged.html` — Status: `needs review`)

1. **FLG-01 (High):** Exact duplicate submission of `https://link.amazon/B03QDuGdo` on lines 2 and 3 (`SUB-02`, `SUB-03`).
2. **FLG-02 (High):** Product-intent confirmation (`intended_asin`, `official_listing_url`, `confirmation_date`, `confirmation_source`) pending owner confirmation; strictly separated from observed redirect targets (`B08FKW9JRM`, `B0BSKQW2T2`, `B08DY9HRWD`).
3. **FLG-03 (High):** Exact Amazon Associates Special Link compliance status of supplied `link.amazon` links unresolved under `S02` (not claimed invalid); `tag=shopnow047c-20` not observed in redirect query string; test one link per product in Associates Central before scaling.
4. **FLG-04 (Medium):** Live prices, availability, customer star ratings, review counts, and Amazon images intentionally left blank pending Amazon Creators API enrollment (PA-API 5 is deprecated).
5. **FLG-05 (Medium):** `B08FKW9JRM` (Art3d) listing Technical Details states `Item Package Quantity: 3` while Bullet 1 lists 5 items; California Prop 65 notice displayed.
6. **FLG-06 (Medium):** `B08DY9HRWD` (ORDORA) listing title states lightweight cookware up to `11"` (`10 lb/tier` light-duty) while Bullet 4 states `up to 12 inches`; newer heavy-duty model `B0BYYTQMTR` banner and California Prop 65 notice displayed.
7. **FLG-07 (Low):** Exact SKU commission fee tier for `B0BSKQW2T2` and `B08DY9HRWD` (`Kitchen 4.50%` vs `Home 3.00%`) unconfirmed until first-party Associates report.
8. **FLG-08 (Low):** Missing UPC on `B08FKW9JRM` and missing UPC / Date First Available on `B0BSKQW2T2` left blank.
9. **FLG-09 (Low):** Brief template example titles referenced air fryers whereas all submitted product links resolve to DIY Home Upgrades (`sprefix=diy+home+upgrades`).
10. **FLG-10 (Medium):** Self-hosted analytics endpoint deployment, Google Search Console verification token, and Amazon Associates 3-sale / ~10-post review milestones remain open post-deploy actions.

---

## Integration, PR & Deployment Log

- **Automated Verification:** `node scripts/verify_site.mjs` — PASS (7/7 suites, 0 errors, 14 HTML pages, 41 outbound Amazon links checked, 496 internal links checked)
- **Pull Request:** Pending creation
- **Merge Result:** Pending
- **GitHub Pages Verification:** Pending
