# DIY Home Upgrades

[Publication](https://kanlerxz87-cyber.github.io/DIYHOME2/) · [Executive summary](summary.html) · [Product register](register.html) · [Flagged for Review](review.html)

Rebuild with `python3 scripts/build.py`; verify with `python3 scripts/check.py`. Commit the generated HTML and XML alongside their inputs. GitHub Pages serves the root of `main`.

## Evidence and release gates

The product register is a dated observation, not proof of buying intent. Do not turn a redirect into an intended ASIN. Before enabling an affiliate CTA, record intent and its source, verify site enrollment and the tracking ID, generate one official Special Link in the enrolled workflow, confirm the listing and reporting, and review [Amazon policy](https://affiliate-program.amazon.com/help/operating/policies) and [FTC disclosure guidance](https://www.ftc.gov/business-guidance/resources/disclosures-101-social-media-influencers). Do not use live Amazon data or imagery without an authorized integration and policy review. No synthetic demand, rankings, quotes, orders, or forecasts.

## Measurement

`python3 scripts/serve.py --db analytics.sqlite3` serves the site and its same-origin aggregate collector. Use a persistent volume and HTTPS proxy, disable proxy access logging for the collector, and restrict access to the database. The collector accepts four browser events, stores only day/event/page/count, and honors GPC/DNT. Counts can include bots and repeat views; they are not sessions or conversions. Keep retention limited (e.g., delete daily aggregates after 90 days). Pages itself cannot host this endpoint; it does not collect events on the static deployment.

The fifth event, reported orders, is not a browser event. Use only dated, authorized Associates reports; preserve timestamp, source, channel, eligible sessions, clicks, and reported orders in a private provenance ledger before reporting aggregates. Import a normalized private JSON row with `python3 scripts/serve.py --authorized-report PATH`; use the six ledger columns in snake_case, an ISO timestamp with timezone, and null for missing metrics. Use a unique report identifier as source and only nonoverlapping report windows. Do not upload proprietary exports to this repository.

Search Console owner verification and authorized Amazon access are not provisioned. RSS is available as the no-email reader subscription. Review reports monthly when available before choosing the next editorial topic.
