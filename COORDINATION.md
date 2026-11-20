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
| First-party measurement service, campaign ledger and reporting surface | done | c1033a7f | measurement/ and this board |

2026-11-20: Both other branches have current claims. Request to integration owners: resolve overlapping publishing scopes with each other; link the measurement report from the dashboard navigation/footer, and load its consent-aware client only with a deployed service URL. This session will not edit either owner's files or change Pages settings. Assigned branch arena/c1033a7f-diyhome2 is fixed by the workspace.

Integration log: parallel publication PR #2 completed during measurement development. Resolved add/add board conflict by keeping both histories. Reusing its event vocabulary and database schema rather than introducing parallel analytics.
| Task | Status | Owner | Scope |
|---|---|---|---|
| Register and ledger integration | done | arena/7ad50d57-diyhome2 | product-register.json, campaign-ledger.csv, documentation |

- [PR #3](https://github.com/kanlerxz87-cyber/DIYHOME2/pull/3): A parallel publication merged while this branch was in progress. Resolved overlapping files in favor of the completed publication and preserved its builder, navigation, guides, collector, and checks. Integrated only the complementary machine-readable register and ledger. Independently observed the same three Amazon destinations; no affiliate attribution or intent confirmed. GitHub records the merge result on the linked PR.
Merge log: PR #3 added evidence records in parallel. Retained both board entries; the desk will use its canonical campaign-ledger.csv, not a second ledger.

2026-11-20, c1033a7f: Re-fetched all three distinct submitted links, confirming the three observed Amazon targets recorded above; submission 03 repeats 02. No intended ASIN, account enrollment, Special Link tracking, sales, profitability or conversion confirmed. Checked [Amazon §§1,5](https://affiliate-program.amazon.com/help/operating/agreement), [GitHub static hosting](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages) and [hosting limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits). Report flags account and hosting limits. Built publication, checked internal paths/disclosures/sponsored references/XML, tested all five counter events on isolated temporary storage, origin rejection, GPC suppression, source validation and empty ledger. Production data untouched. See issue #1 for shared-navigation handoff.
