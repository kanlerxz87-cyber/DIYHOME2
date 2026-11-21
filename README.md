# DIY Home Upgrades

[Publication](https://kanlerxz87-cyber.github.io/DIYHOME2/) · [Executive summary](https://kanlerxz87-cyber.github.io/DIYHOME2/summary.html) · [Flagged for Review](https://kanlerxz87-cyber.github.io/DIYHOME2/review.html)

## Where to start

- **[The shop](https://kanlerxz87-cyber.github.io/DIYHOME2/shop.html)** — every product in one table, by category.
- **[Buying guides](https://kanlerxz87-cyber.github.io/DIYHOME2/guides.html)** — one buyer question per guide.
- **[Executive summary](EXECUTIVE_SUMMARY.md)** — what was verified, what was not, and why.

Shop pages and category pages are generated from `data/products.json`; the narrative pages are generated
from `scripts/build.py`. `scripts/summary.py` holds the executive-summary page. Do not hand-edit generated
HTML — change the data or the builder and re-run it.

Build and validate from the repo root with `python3 scripts/build.py && python3 scripts/check.py`. GitHub Pages serves the generated root files from main. The builder is the source of truth for pages, sitemap and feed.

## Measurement

GitHub Pages does not collect events. To run the optional self-hosted collector on another host, run `METRICS_ORIGIN=https://your-public-origin METRICS_DB=/path/to/persistent.sqlite3 python3 scripts/serve.py` behind a same-origin HTTPS reverse proxy with request limits and access logs disabled. The database is not served publicly. Without the origin setting the endpoint stays disabled. Counts are grouped by UTC date, page and event; there are no visitor IDs, cookies, IPs or referrers in the application database. Counts are directional and not bot-filtered sessions.

The five instrumentation events (no external event dictionary was supplied) are `page_view`, `guide_view`, `listing_reference_click`, `affiliate_click` (reserved for approved paid links) and `feed_click`. Purchases must come from authorized Associates reports, not client events. Keep the campaign ledger empty until provenance is available.

## Launch limits

No Associates account, reports, authorized API integration, or Search Console ownership were available. No affiliate URLs or prices are published. The AI-assisted guides are not product tests. No autonomous research, ranking, revenue optimization, or email collection is running. RSS offers a no-data subscription path.

## Machine-readable launch records

[`product-register.json`](product-register.json) preserves all four submissions, including the duplicate. Observed Amazon destinations are separate from intended ASINs, listing URLs and confirmation evidence. Null values are unverified. [`campaign-ledger.csv`](campaign-ledger.csv) has headers only; do not treat the absence of authorized reports as zero orders.

## Flagged for Review

[`data/flags.json`](data/flags.json) is the single source for every open irregularity and every dated re-check; `scripts/build.py` renders all of it on `review.html`, and `scripts/verify.mjs` fails the build if any flag or re-check is missing from the page. Public category commission rates (Associates Help, Table 1) are recorded as source S13; the account's own rate card is sign-in only, so no per-product rate or earnings figure is published.

## Independent review record (2026-11-21)

`data/reviews.json` and `data/discrepancies.json` hold the line-by-line re-verification of every claim
this site makes: each official page, the section read, the date printed on the page, the date it was
read, and what the reading changed here. The table is rendered on the Spec & policy audit page, one
row per document. Anything Amazon displays that this site may not restate — price, star rating, review
count, monthly purchase-volume badge, merchandising badge — is recorded there as withheld, with the
exact string and the read date, and is rendered nowhere. The review found 17 open flags in total; they
are published in full on the Flagged for Review page with a source on every row.

Verification commands, all of which must pass before a merge:

```
python3 scripts/build.py && python3 scripts/check.py
node scripts/verify.mjs          # review record, drift, and purchase-volume checks
node audit/check_audit.mjs
python3 scripts/render_review.py --check   # audit review table vs data/discrepancies.json
```
