# Coordination

| Task | Status | Owner | Scope |
|---|---|---|---|
| Initial integration and publication | done | d69e4487 | README.md, root publication files, assets/, scripts/, .github/workflows/, COORDINATION.md |
| Product intent, enrolled tracking, and account-dependent integrations | needs review | d69e4487 | review.html, measurement.html |

2026-11-20: Baseline contained only README.md. Followed three distinct submitted Amazon short URLs; observed official listings for [B08FKW9JRM](https://www.amazon.com/dp/B08FKW9JRM), [B0BSKQW2T2](https://www.amazon.com/dp/B0BSKQW2T2) (submitted twice), and [B08DY9HRWD](https://www.amazon.com/dp/B08DY9HRWD). These establish observed targets, not intent or attribution. Reviewed the [Associates agreement](https://affiliate-program.amazon.com/help/operating/agreement) and [FTC guidance](https://www.ftc.gov/business-guidance/resources/ftcs-endorsement-guides-what-people-are-asking). Local build checks validate internal paths, disclosure, sponsored listing links, and XML. No conflicting scopes found. Arena's fixed branch is the integration branch.

| Task | Status | Owner | Scope |
|---|---|---|---|
| Register and ledger integration | done | arena/7ad50d57-diyhome2 | product-register.json, campaign-ledger.csv, documentation |

- [PR #3](https://github.com/kanlerxz87-cyber/DIYHOME2/pull/3): A parallel publication merged while this branch was in progress. Resolved overlapping files in favor of the completed publication and preserved its builder, navigation, guides, collector, and checks. Integrated only the complementary machine-readable register and ledger. Independently observed the same three Amazon destinations; no affiliate attribution or intent confirmed. GitHub records the merge result on the linked PR.
