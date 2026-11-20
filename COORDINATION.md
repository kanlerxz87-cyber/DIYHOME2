# Coordination

| Task | Status | Owner | Scope |
|---|---|---|---|
| Initial integration and publication | done | d69e4487 | README.md, root publication files, assets/, scripts/, .github/workflows/, COORDINATION.md |
| Product intent, enrolled tracking, and account-dependent integrations | needs review | d69e4487 | review.html, measurement.html |

2026-11-20: Baseline contained only README.md. Followed three distinct submitted Amazon short URLs; observed official listings for [B08FKW9JRM](https://www.amazon.com/dp/B08FKW9JRM), [B0BSKQW2T2](https://www.amazon.com/dp/B0BSKQW2T2) (submitted twice), and [B08DY9HRWD](https://www.amazon.com/dp/B08DY9HRWD). These establish observed targets, not intent or attribution. Reviewed the [Associates agreement](https://affiliate-program.amazon.com/help/operating/agreement) and [FTC guidance](https://www.ftc.gov/business-guidance/resources/ftcs-endorsement-guides-what-people-are-asking). Local build checks validate internal paths, disclosure, sponsored listing links, and XML. No conflicting scopes found. Arena's fixed branch is the integration branch.

## Additional session claims (at startup)

| Task | Status | Owner | Scope |
|---|---|---|---|
| Publication front page and final integration | in progress | 3a819254 | index.html, guides/, review/, assets/, styles.css, app.js, README.md, .github/ |
| Initial integration and publication | in progress | d69e4487 | README.md, site/, scripts/, .github/workflows/ |
| First-party measurement service, campaign ledger and reporting surface | in progress | c1033a7f | measurement/ and this board |

2026-11-20: Both other branches have current claims. Request to integration owners: resolve overlapping publishing scopes with each other; link the measurement report from the dashboard navigation/footer, and load its consent-aware client only with a deployed service URL. This session will not edit either owner's files or change Pages settings. Assigned branch arena/c1033a7f-diyhome2 is fixed by the workspace.

Integration log: parallel publication PR #2 completed during measurement development. Resolved add/add board conflict by keeping both histories. Reusing its event vocabulary and database schema rather than introducing parallel analytics.
