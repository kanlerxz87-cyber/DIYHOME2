# COORDINATION.md — DIYHOME2 shared task board

Project: **DIY Home Upgrades** — Amazon Associates affiliate publication for DIY home upgrade topics.
Tracking ID (selected): `shopnow047c-20`
Environment branch for this work: `arena/7ebfbe32-diyhome2` (branch name fixed by the Arena session; the `session-<id>/<task>` convention could not be followed without violating the session branch constraint, so file scopes are recorded below instead).
Session ID: `arena-7ebfbe32`
Today: 2026-11-20 (UTC)

Status legend: `unclaimed` · `in progress` · `done` · `needs review`

## Ground rules for all sessions
1. Read this file before starting. Never start a task another session has claimed.
2. Claim by writing your session ID + file scope here, commit, and push the claim immediately.
3. Keep scopes non-overlapping. If you need a file owned by another session, log the request here instead of editing it.
4. Small, frequent commits. `git pull --rebase` before every push.
5. Never mark anything `verified` without checking it against an official source and linking that source here.
6. Flagged items go on the site's **Flagged for Review** page; flagged items do not block merge.

## Critical environment finding (applies to every task)
Outbound network access from this environment is restricted to GitHub, npm and PyPI hosts.
`amazon.com`, `link.amazon`, and `affiliate-program.amazon.com` are **not reachable** (curl: SSL_ERROR_SYSCALL / 000).
Consequence: **no Amazon product attribute (title, price, rating, specs, availability) could be verified from an official source.** All such values are left blank or explicitly marked unverified and flagged on the Flagged for Review page. Nothing was inferred to fill gaps. FTC / Associates Central sources were verified via web search (URLs + excerpts) and are linked in the site's Verification page for manual review.

## Task board

| ID | Task | Owner | Scope (files) | Status |
|----|------|-------|----------------|--------|
| T-001 | Repo review, baseline, network/source audit | arena-7ebfbe32 | README.md (read-only), COORDINATION.md | done |
| T-002 | COORDINATION.md board creation + claims | arena-7ebfbe32 | COORDINATION.md | done |
| T-003 | Build pipeline + design system (stdlib Python, no deps) | arena-7ebfbe32 | tools/build.py, tools/check_links.py, data/*.json, data/*.csv, docs/assets/css/site.css | done |
| T-004 | Publication front page (landing rebuild) | arena-7ebfbe32 | docs/index.html (generated) | done |
| T-005 | Question-shaped guides x4 (working titles only) | arena-7ebfbe32 | data/guides.json, docs/guides/*.html (generated) | done |
| T-006 | Product-intent confirmation records + Special Links audit | arena-7ebfbe32 | data/product-intent-confirmation.json, data/products.json | done |
| T-007 | Measurement: 5-event privacy-preserving analytics + self-hostable collector + dashboard | arena-7ebfbe32 | docs/assets/js/*.js, tools/collector.py, docs/measurement-plan.html (generated), docs/dashboard.html (generated) | done |
| T-008 | Campaign ledger (empty, well-defined, provenance-tracked) | arena-7ebfbe32 | data/campaign-ledger.csv, docs/campaign-ledger.html (generated) | done |
| T-009 | SEO: sitemap.xml, feed.xml (RSS), robots.txt, JSON-LD, meta/OG | arena-7ebfbe32 | docs/sitemap.xml, docs/feed.xml, docs/robots.txt (generated) | done |
| T-010 | Compliance: above-the-fold disclosure strip, sponsored rel attrs, FTC/Associates review notes | arena-7ebfbe32 | docs/*.html (generated), docs/disclosure.html | done |
| T-011 | Flagged for Review page + Executive Summary (MD + HTML) | arena-7ebfbe32 | docs/flagged.html, EXECUTIVE_SUMMARY.md, docs/executive-summary.html | done |
| T-012 | Source register + Verification page | arena-7ebfbe32 | data/source-register.json, docs/verification.html (generated) | done |
| T-013 | Build + internal link check + HTML sanity | arena-7ebfbe32 | tools/check_links.py | done |
| T-014 | PR from arena/7ebfbe32-diyhome2 → main, merge, GitHub Pages deploy, record results | arena-7ebfbe32 | .github/workflows/deploy-pages.yml, COORDINATION.md | unclaimed |
| SG-27 | Nav labels: single nav group "Explore" + footer access to all dashboard surfaces | arena-7ebfbe32 | docs (generated) | done |
| SG-28 | Shipped RSS feed (auto-generated from guides.json + new guides appended on rebuild) | arena-7ebfbe32 | docs/feed.xml (generated) | done |
| SG-29 | Search Console: NOT verifiable from this environment — flagged, owner action required | arena-7ebfbe32 | docs/flagged.html | needs review |
| SG-30 | Reader capture: form built, **disabled** until an endpoint is configured (no data leaves the page otherwise) | arena-7ebfbe32 | docs/assets/js/reader-capture.js, docs (generated) | done |

## Sources used (linked; all marked with access method)
See the site's **Verification** page (`docs/verification.html`) and `data/source-register.json` for the full register with retrieval dates and access methods. Headline sources:
1. Amazon Associates Program Operating Agreement — https://affiliate-program.amazon.com/help/operating/agreement (via web search excerpt; not fetchable from sandbox)
2. Amazon Associates Program Policies — https://affiliate-program.amazon.com/help/operating/policies (via web search excerpt; not fetchable)
3. Amazon Associates Participation Requirements — https://affiliate-program.amazon.com/help/operating/participation/ (via web search excerpt; not fetchable)
4. FTC — Endorsements, Influencers, and Reviews (16 CFR Part 255) — https://www.ftc.gov/business-guidance/advertising-marketing/endorsements-influencers-reviews (via web search excerpt; not fetchable)
5. FTC press release, updated Endorsement Guides (2023-06) — https://www.ftc.gov/news-events/news/press-releases/2023/06/federal-trade-commission-announces-updated-advertising-guides-combat-deceptive-reviews-endorsements (via web search excerpt; not fetchable)

## Irregularities log (summary — full list on the Flagged for Review page)
- F-001: All Amazon product attributes unverified (Amazon unreachable); values left blank, not inferred.
- F-002: Submitted link list contains `https://link.amazon/B03QDuGdo` **twice** — deduplicated; noted for owner.
- F-003: `link.amazon` short links unresolved; compliance status of these links is **unresolved** — not claimed valid or invalid. Required action: open each link in Associates Central / a browser and confirm destination + tracking report before scaling.
- F-004: Intended ASINs (from the submitted URLs): B0hmGG4m2, B03QDuGdo, B0hpD2JGQ. No ASIN could be bound to a product name, category, or the air-fryer hypotheses.
- F-005: Candidate listing URLs (`https://www.amazon.com/dp/<ASIN>`) are constructed, not verified; stored as separate `candidate_listing_url`, never merged with confirmation fields.
- F-006: Search Console ownership cannot be verified from this environment; meta-verification tag intentionally NOT fabricated.
- F-007: Analytics/reader-capture endpoint not configured; SG-30 capture form is inert by design until configured.
- F-008: Campaign ledger intentionally empty (headers only); no conversion data exists.
- F-009: Operating Agreement disclosure sentence quoted verbatim on every page; placement review still flagged for owner.
- F-010: No claims about popularity, search volume, ranking, or product superiority anywhere (no data available).

## Handoff / conflict notes
- No other sessions were present in COORDINATION.md (file did not exist). This session claimed all tasks on 2026-11-20.
- `git pull --rebase` required before every push; small commits pushed as they land.

## Merge / deploy record
T-014 in progress: PR to main to be opened next; merge + Pages verification to follow. See PR link in the next update.
