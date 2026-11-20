# DIY Home

Buyer-first home improvement publication. [GitHub Pages](https://kanlerxz87-cyber.github.io/DIYHOME2/) · [Executive summary](summary.html) · [Flagged for Review](review.html).

Run `python3 tools/build.py && python3 tools/check.py`. GitHub Pages publishes the generated root files from `main`. The hero is illustrative AI-generated artwork, not a product photo. No scraped product images, reviews, ratings, prices or commission estimates are published.

## Publication gate

The submissions observed on 2026-11-20 resolve to Amazon listings for a smoothing kit, a paper towel holder (submitted twice), and a pots-and-pans organizer. These are not confirmation of product intent or affiliate attribution. The register retains both concepts separately. The build locks out Special Links. Do not unlock it without enrolled-account confirmation of intent, destination and tracking reports for each link, plus review of the applicable [Amazon policies](https://affiliate-program.amazon.com/help/operating/policies) and [FTC endorsement guidance](https://www.ftc.gov/business-guidance/resources/ftcs-endorsement-guides-what-people-are-asking).

## Measurement and editorial cadence

`python3 tools/collector.py` runs the optional SQLite aggregate collector. Run it on infrastructure you control behind HTTPS with request logging disabled, request timeouts/rate limits, and a protected database (`METRICS_DB`). Set `SITE_ORIGIN` to the site origin and configure a `metrics-endpoint` meta tag pointing at `/events` in the shared template only after deployment and privacy review. Browser events are directional counts, not unique sessions or trusted conversion evidence. The optional `/reports` endpoint requires `REPORT_TOKEN` and accepts JSON `{date,count}` for an authorized aggregate report. Append only incremental orders once; do not replay cumulative reports. Keep dated provenance in the campaign ledger; the collector does not fetch or authenticate Amazon reports. Never expose the token or raw account reports in the site or Git.

Start a fortnightly guide cadence after measurement is live. Review Search Console queries monthly and use measured demand and authorized outcomes to prioritize topics. Sitemap and feed regenerate together. Search Console ownership, a deployed collector, authorized commerce data, an AI provider, and email capture are not configured. RSS is the reader subscription option without a mailing list. Air fryer questions are backlog ideas, not evidence of demand.
