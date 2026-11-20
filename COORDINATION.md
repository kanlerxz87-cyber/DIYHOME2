# COORDINATION.md — shared task board

> Read this file before starting any work. Claim a task by writing your session ID and
> file scope here, then commit and push the claim immediately. Never start a task another
> session has claimed. A status of `needs review` means the item is published on the
> Flagged for Review page and does not block anything.

**Repository:** `kanlerxz87-cyber/DIYHOME2`
**Production branch:** `main` (GitHub Pages source: `main`, path `/`)
**Site URL:** https://kanlerxz87-cyber.github.io/DIYHOME2/

---

## Session registry

| Session ID | Branch | Started (UTC) | Scope |
| --- | --- | --- | --- |
| `arena-ecb1bfed` | `arena/ecb1bfed-diyhome2` | 2026-11-20 | Full build: data, verification, site generator, feeds, compliance, integration + merge |

---

## Task board

| ID | Task | Status | Owner | Files touched |
| --- | --- | --- | --- | --- |
| T01 | Claim scope + board bootstrap | done | `arena-ecb1bfed` | `COORDINATION.md` |
| T02 | Resolve submitted short links to destinations; record intended vs observed | done | `arena-ecb1bfed` | `data/products.json`, `data/observations.json` |
| T03 | Verify Associates policy clauses from official Amazon sources | done | `arena-ecb1bfed` | `data/sources.json`, `verification/` |
| T04 | Verify FTC endorsement guidance from official FTC sources | done | `arena-ecb1bfed` | `data/sources.json` |
| T05 | Build static site generator + templates | in progress | `arena-ecb1bfed` | `scripts/`, `src/` |
| T06 | Product pages, category pages, table register | unclaimed | — | `products/`, `categories/` |
| T07 | Question-shaped guides (4) | unclaimed | — | `guides/` |
| T08 | Disclosure strip on every page + footer repeat | unclaimed | — | `src/partials.js` |
| T09 | Outbound-click counter + 5 defined events + self-hosted endpoint hook | unclaimed | — | `assets/js/analytics.js` |
| T10 | Campaign ledger (empty, defined) + provenance rules | unclaimed | — | `data/campaign-ledger.json` |
| T11 | sitemap.xml + feed.xml + robots.txt generated from data | unclaimed | — | `scripts/build.mjs` |
| T12 | Link + disclosure + sponsored-attribute audit script | unclaimed | — | `scripts/audit.mjs` |
| T13 | GitHub Actions: build, audit, deploy check | unclaimed | — | `.github/workflows/` |
| T14 | Exec summary | unclaimed | — | `EXECUTIVE-SUMMARY.md` |
| T15 | Final integration: re-verify, PR to `main`, merge, confirm Pages deploy | unclaimed | — | whole repo |

---

## Claim log

### 2026-11-20 — `arena-ecb1bfed` claims T01–T05, T08–T15

Scope: the entire repository. This is a single-session build on an empty repo, so there
are no competing claims to avoid. File scope is declared as `**/*` and will be narrowed
in later edits if a second session appears.

**Coordination rules honoured by this session:**
- All work stays on branch `arena/ecb1bfed-diyhome2`. No other branch is created or pushed.
- Shared outputs (`data/*.json`, site navigation, `index.html`, `sitemap.xml`, `feed.xml`)
  are written directly by this session because it is also the final integration session.
- Small, frequent commits.
- No item is marked verified without an official-source link recorded in `data/sources.json`.

---

## Findings log

### F01 — Submitted short links resolve to different products than their codes suggest
Four link lines were submitted, but only **three unique URLs** were supplied (`B03QDuGdo`
appears twice). None of the three `link.amazon` short codes equals the ASIN it resolves to:

| Submitted | Observed destination | Observed ASIN |
| --- | --- | --- |
| `https://link.amazon/B0hmGG4m2` | `https://www.amazon.com/dp/B08FKW9JRM` | `B08FKW9JRM` |
| `https://link.amazon/B03QDuGdo` | `https://www.amazon.com/dp/B0BSKQW2T2` | `B0BSKQW2T2` |
| `https://link.amazon/B0hpD2JGQ` | `https://www.amazon.com/dp/B08DY9HRWD` | `B08DY9HRWD` |

Because the code and the destination disagree, the code **must not** be treated as the
ASIN. Status: `needs review`.

### F02 — No Associates tag observed on any resolved destination
The resolved URLs carried Amazon session/referrer parameters but **no `tag=` parameter
carrying `shopnow047c-20`** was observed at resolution time. Tracking therefore could not
be confirmed from the public side. Status: `needs review`, blocks revenue claims.

### F03 — Commission rate card is not publicly readable
`https://affiliate-program.amazon.com/help/operating/schedule` redirects to an Associates
sign-in. Standard commission rates therefore cannot be verified from a public official
source, so no rate, earnings estimate, or revenue forecast appears anywhere on the site.

### F04 — Ratings and prices are deliberately suppressed on the public site
- Star ratings / review counts: Participation Requirements §2(t) forbids displaying Amazon
  customer reviews or star ratings unless obtained via Creators API or PA API. Not enrolled
  in the API, so nothing is displayed.
- Prices: Participation Requirements §2(b) permits price display only if Amazon serves the
  link or the data comes from the API. Identical for §2(y) (no price tracking/alerting).
  No price is rendered anywhere on the public site.

### F05 — Suggested editorial titles did not match the supplied inventory
The four suggested guide titles concern air fryers and multi-function kitchen appliances.
None of the three supplied products is an air fryer. Writing those guides would require
inventing product specifications, so they are recorded as **hypotheses only** and replaced
with four question-shaped guides grounded in the verified catalogue.

---

## Handoff protocol

If a claim is older than 60 minutes with no commits, any session may take the task over and
must record the handoff below.

_(no handoffs recorded)_
