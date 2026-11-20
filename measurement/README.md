# Campaign desk

`/measurement/` is the static report. Self-host the **whole publication** plus the counter using `METRICS_ORIGIN=https://your-public-host METRICS_DB=/private/persistent/metrics.sqlite3 python3 measurement/server.py`, behind a same-origin TLS proxy with access logging disabled, request limits and backups. Without an explicit origin the service does not collect events. The Pages build has no endpoint and does not silently substitute zeroes for missing reports.

This extends `scripts/serve.py`: one database, one `/events` collector and the publication's five allowlisted event names. Opt in or out under Flagged for Review → Privacy preferences on this host. Daily counters are totals, not unique people, audited orders or bot-filtered sessions. No external analytics provider or user identifier. The preference uses local storage; DNT/GPC disable collection. Do not include identifiers in proxy logs. Preview storage is temporary, not a production data warehouse.

`campaign.csv` is a header-only schema until authorized data is supplied. Use UTC timestamps, traceable official source URLs, nonnegative integer counts when available, blank for unavailable fields, and a dated report reference; never substitute site clicks for reported orders. No external account credentials required or stored. Never publish private reports or account/customer details.
