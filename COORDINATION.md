# Coordination board

| Task | Status | Owner session | File scope |
|---|---|---|---|
| Final integration: build publication site, editorial guide, sitemap/feed, and review register | done | `arena/3a819254-diyhome2` | `COORDINATION.md`, `index.html`, `guides/`, `review/`, `campaigns/`, `analytics/`, `styles.css`, `app.js`, `README.md`, `feed.xml`, `sitemap.xml`, `robots.txt`, `.nojekyll` |
| Product/link confirmation, account-backed analytics, Search Console, reader capture and post-merge Pages deployment | needs review | `arena/3a819254-diyhome2` | `review/index.html`, `analytics/index.html`, `campaigns/index.html`, `README.md` |

## Work log

- The repository was inspected before work began: only `README.md` existed; no prior coordination board or site implementation was present.
- Claim recorded and pushed before implementation in commit `4964fce` on the Arena-assigned branch `arena/3a819254-diyhome2`. The platform requires this session to remain on that branch; no separate `session-…` branch was created.
- Site content and source checks completed on 2026-11-20. Four submitted link rows are preserved; input 02 and 03 duplicate exactly. Submitted path tokens are kept distinct from confirmed ASIN, official product listing, confirmation date/source, and observed redirect target. The four visible tokens are nine characters each; Amazon's public seller material describes an ASIN as 10 alphanumeric characters. No conclusion that the short links are invalid is made.
- Product identity, final link targets, Associates tracking ID `shopnow047c-20`, program enrollment and resulting account reports are not verified. Product fact cells remain blank; flagged in the public review register. No price, review, trend, commission, click-performance, order, conversion or revenue claim is fabricated.
- Affiliate disclosure appears immediately below the masthead and repeats in the footer on every HTML page. Each supplied product outbound anchor has `rel="sponsored nofollow noopener"`.
- Official sources checked and linked in the site:
  - Amazon Associates Operating Agreement: https://affiliate-program.amazon.com/help/operating/agreement (checked §§1 and 5; tagged Special Links and Associate identification statement).
  - Amazon PA API requirements: https://affiliate-program.amazon.com/help/node/topic/GVJ2BJP35457CLML (account, agreement and API application/license requirements).
  - Amazon ASIN definition: https://sell.amazon.com/blog/fba-new-selection-program (10-character alphanumeric identifier).
  - FTC Endorsement Guides Q&A: https://www.ftc.gov/business-guidance/resources/ftcs-endorsement-guides-what-people-are-asking (affiliate disclosure and context-dependent clear/conspicuous guidance).
  - Google Search Central sitemap guide: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap (sitemap and Search Console guidance).
  - GitHub Pages overview: https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages (static hosting description).
- Verified checks: Python HTML parser found local links resolve across all HTML pages; every HTML page has a canonical and a top disclosure strip. `feed.xml` and `sitemap.xml` parse as valid XML. `node --check app.js` passes. Local HTTP smoke test returned 200 for `/`, all four publication/dashboard routes, RSS, sitemap and robots.txt. GitHub API reports Pages enabled on `main` at `/`, public, with URL https://kanlerxz87-cyber.github.io/DIYHOME2/; the release deployment still must be checked after merge.
- Measurement is intentionally limited: the five named event counters (`page_view`, `outbound_click`, `guide_open`, `review_register_open`, `disclosure_view`) aggregate in each browser's local storage only. GitHub Pages cannot host a custom server endpoint. No server endpoint, Search Console property, authorized Associates reports, or reader capture account is connected. These limitations are published on the review/measurement pages and do not block integration.
- Editorial target is one evidence-checked guide per month. Search-query-led topic selection is pending Search Console verification and usable data. RSS and sitemap include the published guide.
- No parallel session or pre-existing files conflicted with the implementation scope.

## Pull request and deployment record

Pending final site commit, PR creation/merge, and post-merge GitHub Pages verification. Record the PR URL, merge result, and Pages deployment result here when complete.
