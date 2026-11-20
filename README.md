# DIY Home Upgrades

[Publication](https://kanlerxz87-cyber.github.io/DIYHOME2/) · [Executive summary](https://kanlerxz87-cyber.github.io/DIYHOME2/summary.html) · [Flagged for Review](https://kanlerxz87-cyber.github.io/DIYHOME2/review.html)

Build and validate from the repo root with `python3 scripts/build.py && python3 scripts/check.py`. GitHub Pages serves the generated root files from main. The builder is the source of truth for pages, sitemap and feed.

## Measurement

GitHub Pages does not collect events. To run the optional self-hosted collector on another host, run `METRICS_ORIGIN=https://your-public-origin METRICS_DB=/path/to/persistent.sqlite3 python3 scripts/serve.py` behind a same-origin HTTPS reverse proxy with request limits and access logs disabled. The database is not served publicly. Without the origin setting the endpoint stays disabled. Counts are grouped by UTC date, page and event; there are no visitor IDs, cookies, IPs or referrers in the application database. Counts are directional and not bot-filtered sessions.

The five instrumentation events (no external event dictionary was supplied) are `page_view`, `guide_view`, `listing_reference_click`, `affiliate_click` (reserved for approved paid links) and `feed_click`. Purchases must come from authorized Associates reports, not client events. Keep the campaign ledger empty until provenance is available.

## Launch limits

No Associates account, reports, authorized API integration, or Search Console ownership were available. No affiliate URLs or prices are published. The AI-assisted guides are not product tests. No autonomous research, ranking, revenue optimization, or email collection is running. RSS offers a no-data subscription path.

## Machine-readable launch records

[`product-register.json`](product-register.json) preserves all four submissions, including the duplicate. Observed Amazon destinations are separate from intended ASINs, listing URLs and confirmation evidence. Null values are unverified. [`campaign-ledger.csv`](campaign-ledger.csv) has headers only; do not treat the absence of authorized reports as zero orders.
