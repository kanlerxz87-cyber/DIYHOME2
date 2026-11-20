# DIY HOME

A publication-led DIY home and kitchen site with a shop shortlist, question-shaped buying guides, a seasonal file, and source-linked operations pages.

## What is in this repository

- Static publication site generated from `src/content.mjs` into `dist/` by `scripts/build-site.mjs`.
- 15 pages: front page, executive summary, shop shortlist, guide index, four kitchen guides, winter 2026/27 seasonal file, research desk, requirements register, measurement, campaign ledger, method & sources, and flagged-for-review.
- Generated `sitemap.xml`, `feed.xml`, `robots.txt`, and `404.html`.
- Product-intent register in `data/product-intent.json` with four submitted link records. The repeated URL is preserved as two records. Intended ASIN, official listing URL, confirmation date, source, and observed redirect target remain blank until verified.
- Campaign ledger schema in `data/campaign-ledger.csv`; it contains headers only because no authorized first-party report has been imported.
- Self-hosted aggregate analytics endpoint in `server.mjs` for the five events: `page_view`, `guide_view`, `outbound_click`, `product_link_click`, and `reported_order`. It stores daily aggregates only and does not persist IP address, user agent, referrer, query string, cookies, or account identifiers.

## Verification status

No product links are active. The supplied `link.amazon` URLs have not been followed or tested in this session; their exact compliance status is unresolved and they are not described as invalid. The owner-supplied tracking ID `shopnow047c-20`, Associates enrollment, product identities, prices, reviews, commissions, search demand, clicks, orders, and revenue are not verified here.

GitHub Pages serves the static site only; it does not run the Node analytics endpoint. Search Console ownership and query data are not connected. The seasonal file includes a Search Console setup surface for when the property is verified.

## Commands

```bash
npm test
npm run build
npm start
```

`npm test` builds the site, runs the static verifier, and runs the analytics/server tests. `npm start` builds and serves the site plus the same-origin aggregate endpoint on port 4173 by default.

## Deployment

`.github/workflows/pages.yml` runs `npm test`, uploads `dist/` as the Pages artifact, and deploys it with the GitHub Pages actions. The repository’s Pages source must be set to GitHub Actions for the deploy job to publish the artifact.

## Official references

- Amazon Associates Operating Agreement: https://affiliate-program.amazon.com/help/operating/agreement
- Amazon Associates Program Policies: https://affiliate-program.amazon.com/help/operating/policies
- Amazon ASIN overview: https://sell.amazon.com/blog/how-to-create-a-new-asin-amazon
- FTC Disclosures 101: https://www.ftc.gov/business-guidance/resources/disclosures-101-social-media-influencers
- Google Search Console: https://search.google.com/search-console/about
- Google sitemap guidance: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- Google outbound-link guidance: https://developers.google.com/search/docs/crawling-indexing/qualify-outbound-links
- GitHub Pages custom workflows: https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages
- RSS 2.0 specification: https://www.rssboard.org/rss-specification
