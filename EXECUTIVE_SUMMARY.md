# Executive summary — DIY Home Upgrades

**Live site:** https://kanlerxz87-cyber.github.io/DIYHOME2/
**Prepared:** 2026-11-21 · **Owner branch:** `arena/94688dd1-diyhome2` · **Tracking ID selected by owner:** `shopnow047c-20`

This document is a plain-language summary of what the published site contains, what has actually been
verified against official sources, and what remains unverified. Nothing here is a forecast.

---

## 1. What was built

| Surface | URL | What it does |
|---|---|---|
| Front page | `/` | Publication-style landing page that leads with products, then guides, then the shop. |
| Shop index | `/shop.html` | Every product in one scannable table, plus category cards. |
| Category pages | `/category/wallpaper-tools.html`, `/category/paper-towel-holders.html`, `/category/pot-racks.html` | One page per Amazon browse category. |
| Buying guides | `/wallpaper.html`, `/paper-towels.html`, `/cookware.html`, `/air-fryers.html` | Question-shaped guides, one buyer question each. |
| Field note | `/field-notes/counter-fit/` | Interactive counter-measurement worksheet. |
| Flagged for Review | `/review.html` | Unconfirmed fields, the supplied short links, and the re-verification pass. |
| Spec & policy audit | `/audit/` | Line-by-line listing specs, internal listing discrepancies, 2026 policy register. |
| Citation register | `/sources.html` | 12 documents, each with the date it states and the constraint it imposes. |
| Measurement | `/measurement.html`, `/measurement/` | Empty campaign ledger and the self-hosted collector's status. |
| Editorial standards | `/standards.html` | The publishing gate the desk applies. |

All pages carry the Associates disclosure above the fold and again in the footer. Every Amazon product
link is marked `rel="sponsored noopener"`, carries no query string, and is never a shortener.

## 2. The three products, as verified

| ASIN | Product | Brand · seller | Amazon category | Source |
|---|---|---|---|---|
| [B08FKW9JRM](https://www.amazon.com/dp/B08FKW9JRM) | Art3d smoothing tool kit for peel-and-stick wallpaper (5 pieces) | Art3d · Art3d® | Wallpaper Tools (164701011) | S07 |
| [B0BSKQW2T2](https://www.amazon.com/dp/B0BSKQW2T2) | Under-cabinet paper towel holder, matte black aluminium, 12.2 in | niffgaff · YH Urban | Paper Towel Holders (3744201) | S08 |
| [B08DY9HRWD](https://www.amazon.com/dp/B08DY9HRWD) | ORDORA 8-tier under-cabinet pots and pans organizer, 16.6 in | ORDORA · ORDORA Official | Pot Racks (289824) | S09 |

Each row was fetched from the live amazon.com listing on 2026-11-20 and re-checked field by field on
2026-11-21. The shop tables render only these verified values.

## 3. What is deliberately not on the site

Prices, star ratings, review counts, stock claims and "bought in past month" figures are all visible on
the live listings and are all **deliberately omitted**. The Associates Program Policies permit price and
rating display only through Creators API / Product Advertising API content, or an Amazon-served link;
this static site has neither.
Sources: [Program Policies (§2(t) and price condition)](https://affiliate-program.amazon.com/help/operating/policies),
[Operating Agreement](https://affiliate-program.amazon.com/help/operating/agreement).

## 4. What remains unverified — and why it is not filled in

| Item | State | What would close it |
|---|---|---|
| Intended ASIN per supplied short link | Blank | Confirm inside the enrolled Associates workflow and record date + source. |
| Special Link compliance of `link.amazon` URLs | **Unresolved, not claimed invalid** | Generate and test one validated Special Link per product. |
| Tracking attribution for `shopnow047c-20` | Unverified | An authorised Associates report showing clicks against the tag. |
| Click / order / revenue figures | None | Authorised first-party reports only; the ledger stays empty until then. |
| Search Console ownership | Not verified | DNS or HTML-token verification, then submit the sitemap. |
| Analytics endpoint | Written, not deployed | A host that can run the collector; GitHub Pages cannot. |

The supplied short links were supplied twice for one product (entries 2 and 3 of the register are the
same URL). That duplicate is preserved rather than silently merged.

## 5. Verification performed in this pass

- Fetched all three amazon.com listing pages and compared title, brand, seller, category breadcrumb and
  the published spec fields against `data/products.json` — all matched.
- Confirmed the disclosure renders twice on every root page and sits above the first table or aside.
- Ran `python3 scripts/build.py`, `python3 scripts/check.py` and `node scripts/verify.mjs`: local links,
  disclosure placement, sponsored markup, sitemap/feed agreement (17 URLs, 17 items), ledger schema and
  the intended/observed separation all pass.
- The `link.amazon` redirector hosts were **not reachable** from this build environment, so the short
  links themselves were not re-fetched. The earlier redirect observation (2026-11-20) is attributed to
  the session that made it and is not reasserted as today's fact.

## 6. Irregularities flagged for review

The full list, with sources, is on the live [Flagged for Review](https://kanlerxz87-cyber.github.io/DIYHOME2/review.html)
page and in [`data/flags.json`](data/flags.json): short codes are 9 characters while an ASIN is defined as
10 ([Amazon ASIN guide](https://sell.amazon.com/blog/what-is-an-asin)); no tracking parameter was observed
on any resolved destination; the commission rate card sits behind sign-in; and the campaign ledger is empty
by design.

## 7. Recommended next actions, in order

1. Confirm the intended ASIN for each product inside the enrolled Associates workflow; record date and source.
2. Generate one validated Special Link, test the destination and the tracking report, then scale to the rest.
3. Verify Search Console ownership and submit `sitemap.xml`.
4. Deploy the optional collector, or record a deliberate decision to remain unmeasured.
5. Add ledger rows only from authorised reports, each with a dated provenance trail.
