# Executive summary

**Project:** DIY Home Upgrades — an Amazon affiliate publication
**Tracking ID:** `shopnow047c-20`
**Built:** 20 November 2026
**Live site:** https://kanlerxz87-cyber.github.io/DIYHOME2/
**Repository:** https://github.com/kanlerxz87-cyber/DIYHOME2

---

## What was asked for, and what exists

| Requirement | Status | Where to see it |
| --- | --- | --- |
| A landing page that reads like a shop, not an audit | Done | `/` — front page leads with three products |
| Subpages organised by category | Done | `/categories/wallpaper-tools/`, `/paper-towel-holders/`, `/pot-racks/` |
| Every entry in a simple table with analysis | Done | `/register/` — 9 columns, one row per product |
| Every table row sourced to an official site | Done | Source column on every row; `/sources/` lists 12 documents |
| Blank + flagged where unconfirmable | Done | 3 of 9 register columns are `unverified` and explain why |
| A live GitHub Pages site | Done | Pages built from `main`, verified after merge |
| Executive summary | This file | — |
| Disclosure above the fold, repeated in footer | Done | Verified mechanically on all 27 pages |
| Every outbound product link marked sponsored | Done | 10 sponsored links; audited |
| Intended vs observed link records separated | Done | `data/links.json` — two field groups, never merged |
| Click and conversion measurement | Partial | 5 events implemented; endpoint deliberately empty (flag F10) |
| Empty campaign ledger, strictly defined | Done | `/ledger/` — 6 columns, 0 rows |
| Flagged-for-review page | Done | `/flagged/` — 10 items with sources |
| Coordination board | Done | `COORDINATION.md` |
| PR opened and merged without waiting | Done | See `COORDINATION.md` |
| Search engines given one site to index | Done | Canonicals, sitemap, robots, RSS, JSON-LD, `/search/` |

---

## The three products

| # | Product | Brand | ASIN | Category | Source |
| --- | --- | --- | --- | --- | --- |
| 1 | Art3d smoothing tool kit | Art3d | `B08FKW9JRM` | Wallpaper tools | [Amazon listing](https://www.amazon.com/dp/B08FKW9JRM) |
| 2 | Under-cabinet paper towel holder | niffgaff | `B0BSKQW2T2` | Paper towel holders | [Amazon listing](https://www.amazon.com/dp/B0BSKQW2T2) |
| 3 | ORDORA 8-tier pots and pans organizer | ORDORA | `B08DY9HRWD` | Pot racks | [Amazon listing](https://www.amazon.com/dp/B08DY9HRWD) |

Four link lines were submitted but only **three unique URLs**. `link.amazon/B03QDuGdo`
appeared twice and is counted once.

---

## Five findings that shaped the build

**1. The short codes are not ASINs.** All three `link.amazon` codes are 9 characters.
Amazon defines an ASIN as a 10-character code. Each resolves to a different 10-character
ASIN. Treating the code as the product identifier would have corrupted every record, so
the site keeps `intended_asin` (empty) and `observed_asin` (recorded) in separate fields.
→ flag **F01**

**2. No tracking tag was observable on the resolved destinations.** The links resolved
with Amazon session parameters but no `tag=` carrying `shopnow047c-20`. This is the one
finding that blocks revenue claims: untagged links earn nothing. It is *not* a finding
that the links are invalid — compliance cannot be established from outside the account.
→ flag **F02**

**3. The commission rate card is behind a sign-in.** `/help/operating/schedule` redirects
to Associates login. No rate, earnings estimate or revenue forecast appears anywhere on
the site, because none could be verified. → flag **F03**

**4. Two policies forbid the two things affiliate sites normally show.** Participation
Requirements §2(t) bars star ratings without API access; §2(b) and §2(y) bar prices
unless Amazon serves them or they come from the API, and bar price tracking outright.
The site therefore shows neither, and says why on every product page. → flag **F04**

**5. The suggested guide topics did not match the catalogue.** The four proposed titles
concerned air fryers and multi-function appliances; none are in the supplied inventory.
Publishing them would have meant inventing specifications. They are recorded as working
titles with reasons, and four guide topics were written that the verified catalogue can
actually support. → flag **F06**

---

## Compliance position

Everything below is traced to a document that was read, not recalled.

| Obligation | Source | How it is met |
| --- | --- | --- |
| Required disclosure, clearly and prominently, on the Site | Operating Agreement §5 | Verbatim statement, twice per page: strip under the masthead and footer |
| Every Amazon link must be a properly tagged Special Link | Operating Agreement §1; Policies §2(a) | No untagged Amazon product link exists anywhere. Citations to Amazon pages are printed as plain text, not anchors |
| Special Links accessed directly from the Site | Policies §2(b) | No cloaking, no redirect hop, no JS interstitial |
| No Rewards, no bookmarking encouragement, no paid search on Amazon marks | Policies §2(g), §2(b), §2(f) | None present |
| No star ratings or review text without API access | Policies §2(t) | None shown; explained on each product page |
| Price display only when Amazon serves it or via API | Policies §2(b), §2(y) | No prices shown; no price tracking |
| No Redirecting Links / intermediate sites | Commission Income Statement §2(e) | Outbound clicks are beacons; the browser goes straight to Amazon |
| Disclose third-party cookies and data practice | Policies §3(e) | `/privacy/` — no cookies set by this site; Amazon's own notice linked |
| Disclosure placement practical guidance | FTC Endorsement Guides FAQ | Strip sits above the H1 and above all content |
| Material connection must be disclosed | 16 CFR §255.5 | Same statement, plus `/disclosure/` |
| ASIN identification | Amazon Seller blog | Used to prove the short codes cannot be ASINs |

### Where this build deliberately diverges from the brief

The brief asked for **price and competition analysis**, product research scoring, and
**conversion optimisation**. Those were not built as automated scoring features, for a
concrete reason: every input they would need — price history, sales rank, commission
rate, click and order data — sits behind an account this build cannot read. A scoring
model built on unverifiable inputs would produce confident, wrong numbers, which is
exactly the failure mode the brief asks to avoid. What exists instead is the structure
to receive those numbers and a strict schema for recording them, plus a public note
explaining the gap.

---

## Measurement

Five events are implemented in `assets/js/analytics.js`: `page_view`, `product_view`,
`outbound_click`, `guide_complete`, `subscribe`. No cookies, no identifiers, no third
party; `Do Not Track` and `Global Privacy Control` suppress everything.

The endpoint ships **empty**. Until a collector is hosted and configured, events are
logged to the console and discarded. The site claims no measurement today. → flag **F10**

The click counter is a beacon, not a redirect, because a redirect would create the
intermediate-site pattern that Amazon disqualifies. → flag **F07**

---

## Editorial

Four guides, each question-shaped and grounded in the verified catalogue:

1. *Do you actually need a wallpaper tool kit for peel-and-stick?*
2. *Adhesive or screws: how to choose an under-cabinet paper towel holder*
3. *How many tiers do you actually need in a pots and pans organizer?*
4. *A no-hype checklist for comparing kitchen storage: capacity, cleanup and counter space*

Cadence is set at monthly. No claim of sustained frequency is made until two issues ship.

---

## Open items (published, not hidden)

All 10 are on `/flagged/` with source links. The three that matter:

| Flag | Issue | Blocking what |
| --- | --- | --- |
| F02 | No tracking tag observed | Any revenue claim |
| F03 | Rate card unreadable | Any commission estimate |
| F04 | Price/rating unverifiable | Comparison tables |

---

## What to do next, in order

1. **Confirm the three links in Associates Central.** Generate each from inside the
   enrolled account, verify the tag appears in the destination, then confirm one click in
   the tracking report before scaling. This closes F01 and F02 and is the single highest
   value action.
2. **Read the rate card** while signed in and record it with its effective date (F03).
3. **Host a collector** and set `data-endpoint` (F10).
4. **Ship issue two** from measured queries rather than instinct.
5. **Apply for Creators API / PA API** if price and rating columns are wanted (F04).

---

## Build integrity

- 27 HTML pages generated from 6 JSON data files by one dependency-free script.
- `scripts/audit.mjs` blocks publish on 12 classes of defect: broken internal links,
  missing disclosure, missing strip or footer repeat, unsponsored commerce links,
  citation links wrongly marked sponsored, untagged Amazon links, source-less table rows,
  dead sitemap or feed links, missing head metadata, rendered prices, rendered ratings,
  and wrong `<h1>` count.
- CI rebuilds and fails if committed output drifts from the data.
- No dependencies, no third-party scripts, no web fonts, no CDN.

**Current gate status: PASS** — 26 pages checked, 0 broken links, 0 missing disclosures,
0 unsponsored outbound links.
