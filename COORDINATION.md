# Coordination

| Task | Status | Owner | Scope |
|---|---|---|---|
| Initial integration and publication | done | d69e4487 | README.md, root publication files, assets/, scripts/, .github/workflows/, COORDINATION.md |
| Product intent, enrolled tracking, and account-dependent integrations | needs review | d69e4487 | review.html, measurement.html |

2026-11-20: Baseline contained only README.md. Followed three distinct submitted Amazon short URLs; observed official listings for [B08FKW9JRM](https://www.amazon.com/dp/B08FKW9JRM), [B0BSKQW2T2](https://www.amazon.com/dp/B0BSKQW2T2) (submitted twice), and [B08DY9HRWD](https://www.amazon.com/dp/B08DY9HRWD). These establish observed targets, not intent or attribution. Reviewed the [Associates agreement](https://affiliate-program.amazon.com/help/operating/agreement) and [FTC guidance](https://www.ftc.gov/business-guidance/resources/ftcs-endorsement-guides-what-people-are-asking). Local build checks validate internal paths, disclosure, sponsored listing links, and XML. No conflicting scopes found. Arena's fixed branch is the integration branch.

2026-11-20: [PR #2](https://github.com/kanlerxz87-cyber/DIYHOME2/pull/2) passed publication checks and merged as `1471ecbb44049cc15d071b093b0898fed4473a35`. [GitHub Pages deployment](https://github.com/kanlerxz87-cyber/DIYHOME2/actions/runs/44684603494) succeeded. Amazon’s [ASIN documentation](https://sell.amazon.com/blog/what-is-an-asin) confirms how to read catalog IDs from listing URLs; this does not confirm intent.
