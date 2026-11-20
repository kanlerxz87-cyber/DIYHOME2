# DIYHOME2 — DIY Home Upgrades Journal & Affiliate Operations Platform

**Live GitHub Pages Site:** [https://kanlerxz87-cyber.github.io/DIYHOME2/](https://kanlerxz87-cyber.github.io/DIYHOME2/)  
**Selected Amazon Associates Tracking ID:** `shopnow047c-20`

> **Affiliate Disclosure:** As an Amazon Associate I earn from qualifying purchases. Every outbound product link on the live site is labeled `(paid link)` and marked `rel="sponsored"`.

---

## Overview

DIYHOME2 is a measurement-first DIY Home Upgrades publication and verification platform built for GitHub Pages. It pairs a reader-focused editorial front page and question-shaped buying guides with transparent verification registers, an automated compliance gate, privacy-preserving click analytics, and a Flagged for Review queue.

### Key Surfaces
- **Publication Front Page (`index.html`)** — Leads with verified DIY home upgrades, buyer questions, project clusters, and RSS / reader question capture.
- **Category Pages (`categories/wall-backsplash-tools.html`, `categories/kitchen-organization.html`)** — Category-specific specs, honest buyer caveats, and measurement frameworks.
- **Buyer Guides (`guides/*.html`)** — 4 original, question-shaped guides automatically syndicated in `feed.xml` and indexed in `sitemap.xml`.
- **Executive Summary (`summary.html` & `EXECUTIVE_SUMMARY.md`)** — Line-by-line audit of the 4 submitted links (3 unique + 1 duplicate), 2026 policy posture, and next human-gated milestones.
- **Product Register & Verification Dashboard (`dashboard.html`)** — Strictly separates Product-Intent Confirmation fields from Observed Redirect Targets, with official source links on every row.
- **Compliance Gate & Official Sources (`compliance.html`)** — Official trusted source register (`S01`..`S12` and `P01`..`P03`) covering Amazon Associates April 2026 policies, PA-API 5 deprecation / Creators API migration, FTC Endorsement Guides (16 C.F.R. Part 255), and Google Search Central `rel="sponsored"`.
- **Privacy-Preserving Analytics & Campaign Ledger (`analytics.html`)** — Client-side 5-event telemetry (`assets/js/analytics.js`), deployable zero-dependency Node.js collector (`analytics/endpoint/server.mjs`), and an intentionally empty provenance-tracked campaign ledger (`data/campaign-ledger.json`).
- **Flagged for Review (`flagged.html`)** — All 10 irregularities, duplicate submissions, unverified fields, and API gates published transparently for manual review.

---

## Local Build & Automated Compliance Gate

```bash
# Rebuild all static HTML pages, sitemap.xml, feed.xml, and robots.txt from data/*.json
node scripts/build_site.mjs

# Run automated compliance gate (disclosures, rel="sponsored", zero static prices/ratings,
# zero Amazon image hotlinks, data separation, feed/sitemap, and zero broken links)
node scripts/verify_site.mjs
```

### Optional Self-Hosted Analytics Collector

```bash
PORT=8787 ALLOWED_ORIGIN=https://kanlerxz87-cyber.github.io node analytics/endpoint/server.mjs
```

See `COORDINATION.md` for session task tracking, official sources log, and PR/deployment history.
