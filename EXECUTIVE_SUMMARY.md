# Executive Summary — DIYHOME2 (DIY Home Upgrades Affiliate Publication & Platform)

**Date Verified (UTC):** 2026-11-20  
**Repository:** `kanlerxz87-cyber/DIYHOME2`  
**Live GitHub Pages Site:** `https://kanlerxz87-cyber.github.io/DIYHOME2/`  
**Selected Amazon Associates Tracking ID:** `shopnow047c-20`

---

## 1. Mission & Strategic Shift

DIYHOME2 transforms a strict Amazon Associates source register into a **buyer-first DIY Home Upgrades publication** (*DIY Home Upgrades Journal*) backed by an automated compliance gate, privacy-preserving click measurement, and transparent audit dashboards.

- **Read like a shop, not an audit:** The landing page leads with verified DIY home upgrade products, practical buyer questions, and project clusters (*Renter-Friendly Peel & Stick*, *Weekend Kitchen Refresh*, *Cabinet Space Optimization*). Every verification register, compliance log, campaign ledger, and flagged-item table remains one click away via a single **Dashboard & Ops** navigation group and the global footer.
- **Zero hallucinations, strict provenance:** Every specification is verified directly from official Amazon US product detail pages or official policy documentation (Amazon Associates Central, U.S. FTC, Google Search Central). Every unverified or policy-gated field is explicitly left blank and published on `flagged.html` for manual review.

---

## 2. Line-by-Line Audit of Submitted Product Links

Four links were submitted in the project brief. Line-by-line inspection revealed **3 unique products and 1 exact duplicate submission**:

| Line | Submitted Short Link | Status | Observed Redirect Target ASIN (2026-11-20) | Intended ASIN Confirmation | Verified Brand & Product (Observed Listing) | Official Source |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `https://link.amazon/B0hmGG4m2` | Unique (`PROD-01`) | `B08FKW9JRM` | *Blank — Pending confirmation* | **Art3d** Smoothing Tool Kit for Peel and Stick Wallpaper (Model `A17999`) | [Amazon B08FKW9JRM](https://www.amazon.com/dp/B08FKW9JRM) |
| 2 | `https://link.amazon/B03QDuGdo` | Unique (`PROD-02`) | `B0BSKQW2T2` | *Blank — Pending confirmation* | **niffgaff** Under-Cabinet Paper Towel Holder, Matte Black Aluminum (Model `TN2200-BLK-NA 01`) | [Amazon B0BSKQW2T2](https://www.amazon.com/dp/B0BSKQW2T2) |
| 3 | `https://link.amazon/B03QDuGdo` | **Duplicate of Line 2** (`FLG-01`) | `B0BSKQW2T2` | *Blank — Confirm duplicate* | Duplicate of `PROD-02` | [Amazon B0BSKQW2T2](https://www.amazon.com/dp/B0BSKQW2T2) |
| 4 | `https://link.amazon/B0hpD2JGQ` | Unique (`PROD-03`) | `B08DY9HRWD` | *Blank — Pending confirmation* | **ORDORA** 8-Tier Adjustable Pots & Pans Organizer, 16.6" Light-Duty (Model `ODR8Tier`, UPC `655100721821`) | [Amazon B08DY9HRWD](https://www.amazon.com/dp/B08DY9HRWD) |

### Key Product Governance Findings
1. **Strict Separation of Product-Intent vs. Observed Redirects (`FLG-02`):** Submitted tokens (`B0hmGG4m2`, `B03QDuGdo`, `B0hpD2JGQ`) are 9-character short-link identifiers, not 10-character Amazon ASINs ([Amazon ASIN definition](https://sell.amazon.com/blog/fba-new-selection-program)). Observed redirects are stored separately from `intended_asin`, `official_listing_url`, `confirmation_date`, and `confirmation_source` and are never merged without explicit owner confirmation.
2. **Unresolved Short-Link Compliance & Missing Tracking Parameter (`FLG-03`):** Observed redirects did not include `tag=shopnow047c-20` in their resolved query parameters. We do **not** claim the supplied `link.amazon` links are invalid; their exact Amazon Associates Special Link status is unresolved under [Amazon Associates Program Policies](https://affiliate-program.amazon.com/help/operating/policies). All outbound product links on the site use transparent candidate URLs (`https://www.amazon.com/dp/{OBSERVED_ASIN}?tag=shopnow047c-20`) marked `rel="sponsored noopener noreferrer"`, pending one-by-one testing inside Amazon Associates Central / SiteStripe before scaling.
3. **Internal Listing Discrepancies Caught (`FLG-05`, `FLG-06`):**
   - `B08FKW9JRM` (Art3d): Technical Details states `Item Package Quantity: 3`, while product bullets list 5 items (large smoothing tool, blue squeegee, utility knife, replacement blades, measuring tape). Carries a California Proposition 65 warning.
   - `B08DY9HRWD` (ORDORA): Title states lightweight cookware up to `11"` (`Style: M-16.61"H-LightDuty`, `10 lbs/tier`), while Bullet 4 states `up to 12 inches`. Amazon also shows a newer heavy-duty model banner (`B0BYYTQMTR`, 20.8", 120 lbs) and a California Proposition 65 warning.

---

## 3. Compliance, API & Commission Analysis (Verified Official Sources Only)

| Governance Area | Verified Official Rule / Rate | Official Source |
| --- | --- | --- |
| **Mandatory Disclosure** | Verbatim statement required clearly & conspicuously on site: *"As an Amazon Associate I earn from qualifying purchases."* Placed above the fold under the masthead and repeated in the footer on every page. | [Associates Operating Agreement §5](https://affiliate-program.amazon.com/help/operating/agreement) · [FTC Endorsement Guides (16 C.F.R. Part 255)](https://www.ftc.gov/business-guidance/resources/ftcs-endorsement-guides-what-people-are-asking) |
| **Link-Level Disclosure & SEO** | Every outbound product link displays `(paid link)` and uses `rel="sponsored noopener noreferrer"` to comply with FTC clarity and Google Search link qualification rules. | [Amazon Disclosure Help](https://affiliate-program.amazon.com/help/node/topic/GHQNZAU6669EZS98) · [Google Search Central](https://developers.google.com/search/docs/crawling-indexing/qualify-outbound-links) |
| **Dynamic Prices, Ratings & Images Gate** | Static scraped prices, availability, customer star ratings, and non-API Amazon images are prohibited. **PA-API 5.0 is deprecated** (HTTP 403) and replaced by **Amazon Creators API**. All dynamic fields are intentionally left blank until Creators API enrollment. | [Program Policies (Updated Apr 14, 2026)](https://affiliate-program.amazon.com/help/operating/policies) · [PA-API 5 Deprecation Notice](https://affiliate-program.amazon.com/creatorsapi/docs/en-us/paapiv5-deprecation) |
| **Original Content Rule (April 2026)** | Effective April 14, 2026, Amazon requires original content with commentary, analysis, or transformation for additional value; Google Spam Policies penalize thin affiliation. | [Operating Agreement Changes (Apr 14, 2026)](https://affiliate-program.amazon.com/help/operating/compare) · [Google Spam Policies](https://developers.google.com/search/docs/essentials/spam-policies) |
| **Commission Schedule (Table 1)** | **Tools & Home Improvement (`PROD-01`):** `3.00%` fixed standard rate. **Home & Kitchen / Kitchen & Dining (`PROD-02`, `PROD-03`):** `4.50%` (Kitchen) or `3.00%` (Home) — exact SKU fee tier unconfirmed until first-party Associates report. No revenue forecast is fabricated. | [Standard Commission Income Rates](https://affiliate-program.amazon.com/help/node/topic/GRXPHT8U84RAYDXZ) |
| **Enrollment Review Gate** | Requires >= 3 qualified sales within 180 days (personal orders excluded) and robust original content (rule of thumb: >= 10 posts). | [Associates Application Review](https://affiliate-program.amazon.com/help/node/topic/G8TW5AE9XL2VX9VM) |

---

## 4. Platform Architecture: What Is Automated vs. Human-Gated

### Automated Machinery (Implemented in Repo)
1. **Automated Compliance Gate (`scripts/verify_site.mjs` + `.github/workflows/compliance-gate.yml`):** Automatically blocks any commit or PR that omits masthead/footer disclosures, leaves an Amazon link without `rel="sponsored"`, hardcodes static Amazon prices/ratings, hotlinks `m.media-amazon.com`, merges `intended_asin` with `observed_redirect_target`, or introduces broken internal links.
2. **Privacy-Preserving First-Party Analytics (`assets/js/analytics.js` + `analytics/endpoint/server.mjs`):** Records the **five defined events** (`page_view`, `guide_scroll_depth`, `disclosure_viewed`, `outbound_affiliate_click`, `reader_capture_intent`) without cookies, PII, or third-party trackers. Includes a ready-to-deploy self-hosted Node.js collector endpoint plus a live client-side event inspector on `analytics.html`.
3. **Findability & Publication Infrastructure:** Canonical URLs, JSON-LD structured data, `sitemap.xml`, `robots.txt`, RSS `feed.xml`, 4 original question-shaped buyer guides, category pages, and a biweekly publishing cadence driven by future Search Console queries.

### Human-Gated Decisions (Cannot Be Automated Safely)
1. Confirming written product intent (`intended_asin`) for `PROD-01`..`PROD-03` and resolving duplicate submission `SUB-03`.
2. Generating/testing Special Links in Amazon Associates Central (`shopnow047c-20`) and confirming clicks appear in official Associates reporting.
3. Enrolling in Amazon Creators API for live price/availability refresh.
4. Importing authorized first-party reports into `data/campaign-ledger.json` (intentionally initialized empty with zero fabricated conversion or revenue numbers).
5. Deploying `analytics/endpoint/server.mjs` and verifying domain ownership in Google Search Console.
