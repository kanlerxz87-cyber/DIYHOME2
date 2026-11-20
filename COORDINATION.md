# Coordination

| Task | Status | Owner | Scope |
|---|---|---|---|
| Initial site and integration | done | 8a9218ed | README.md, site/, scripts/, .github/, COORDINATION.md |

## Integration verification

- Baseline `b8df795` contained only a project-name README. No existing sitemap, feed, analytics configuration, or task claims.
- 2026-11-20: checked each unique submission against Amazon's resolved listing: [row 1](https://www.amazon.com/dp/B08FKW9JRM), [rows 2–3](https://www.amazon.com/dp/B0BSKQW2T2), [row 4](https://www.amazon.com/dp/B08DY9HRWD). Duplicate and air-fryer mismatch recorded. Listing observations are not product-intent confirmations.
- Checked [Associates agreement](https://affiliate-program.amazon.com/help/operating/agreement), [FTC disclosure guidance](https://www.ftc.gov/business-guidance/resources/disclosures-101-social-media-influencers), and [Creators API reference](https://affiliate-program.amazon.com/creatorsapi/docs/en-us/api-reference). No account evidence or authorized conversion data. Outstanding matters are published in `review.html`.
- Local generation and link/disclosure/feed validation passed. Deployment verification follows PR merge.
