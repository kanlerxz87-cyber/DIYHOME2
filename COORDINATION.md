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
| T-01 | Repository audit, product redirect resolution, line-by-line official source verification & structured data files | `in progress` | `arena-b92d7dd8` | `arena/b92d7dd8-diyhome2` | `data/*.json`, `EXECUTIVE_SUMMARY.md` | Verifying 4 submitted links (3 unique + 1 duplicate), Amazon Associates 2026 policies, FTC Endorsement Guides, Google Search Central rules |
| T-02 | Privacy-preserving analytics client (5 defined events), self-hosted collector specification & empty provenance-tracked campaign ledger | `in progress` | `arena-b92d7dd8` | `arena/b92d7dd8-diyhome2` | `assets/js/analytics.js`, `analytics/**`, `data/campaign-ledger.json` | Zero cookies, zero PII, no fabricated revenue/conversion forecasts |
| T-03 | Publication front page, design system, bespoke editorial SVG imagery, category pages & 4 question-shaped buyer guides | `in progress` | `arena-b92d7dd8` | `arena/b92d7dd8-diyhome2` | `index.html`, `assets/css/**`, `assets/img/**`, `assets/js/app.js`, `categories/**`, `guides/**`, `about.html` | Lead with products; masthead + footer disclosures above the fold; `rel="sponsored"` on all outbound Amazon links |
| T-04 | Dashboard & verification surfaces (Executive Summary, Product Register, Compliance Gate, Analytics Hub, Flagged for Review) | `in progress` | `arena-b92d7dd8` | `arena/b92d7dd8-diyhome2` | `summary.html`, `dashboard.html`, `compliance.html`, `analytics.html`, `flagged.html` | Every table row cites an official source URL; unverified fields explicitly blank & flagged |
| T-05 | Findability & automation (RSS `feed.xml`, `sitemap.xml`, `robots.txt`, `.nojekyll`, automated compliance gate script & GitHub Actions workflow) | `in progress` | `arena-b92d7dd8` | `arena/b92d7dd8-diyhome2` | `feed.xml`, `sitemap.xml`, `robots.txt`, `.nojekyll`, `scripts/verify_site.mjs`, `.github/workflows/compliance-gate.yml`, `README.md` | Automated checks for disclosure, `rel="sponsored"`, zero static prices/ratings, zero Amazon image hotlinks, zero broken links |
| T-06 | Final integration verification, PR to `main`, merge & GitHub Pages live deployment verification | `unclaimed` | — | `arena/b92d7dd8-diyhome2` | All site outputs | Runs after T-01..T-05 complete |

---

## Verified Official Sources Log

*(Populated as tasks complete; every entry links directly to an official source.)*

## Flagged Irregularities Summary

*(Populated during T-01 and published on `flagged.html`.)*

## Integration, PR & Deployment Log

- **Pull Request:** Pending
- **Merge Commit:** Pending
- **GitHub Pages Verification:** Pending
