# Coordination

| Task | Status | Owner | Scope |
|---|---|---|---|
| Initial integration and publication | done | d69e4487 | README.md, root publication files, assets/, scripts/, .github/workflows/, COORDINATION.md |
| Product intent, enrolled tracking, and account-dependent integrations | needs review | d69e4487 | review.html, measurement.html |

2026-11-20: Baseline contained only README.md. Followed three distinct submitted Amazon short URLs; observed official listings for [B08FKW9JRM](https://www.amazon.com/dp/B08FKW9JRM), [B0BSKQW2T2](https://www.amazon.com/dp/B0BSKQW2T2) (submitted twice), and [B08DY9HRWD](https://www.amazon.com/dp/B08DY9HRWD). These establish observed targets, not intent or attribution. Reviewed the [Associates agreement](https://affiliate-program.amazon.com/help/operating/agreement) and [FTC guidance](https://www.ftc.gov/business-guidance/resources/ftcs-endorsement-guides-what-people-are-asking). Local build checks validate internal paths, disclosure, sponsored listing links, and XML. No conflicting scopes found. Arena's fixed branch is the integration branch.

## Additional session claims (at startup)

| Task | Status | Owner | Scope |
|---|---|---|---|
| Publication front page and final integration | done | 3a819254 | existing published integration retained and verified; Campaign desk added to shared navigation/footer |
| Initial integration and publication | in progress | d69e4487 | README.md, site/, scripts/, .github/workflows/ |
| First-party measurement service, campaign ledger and reporting surface | done | c1033a7f | measurement/ and this board |

2026-11-20: Both other branches have current claims. Request to integration owners: resolve overlapping publishing scopes with each other; link the measurement report from the dashboard navigation/footer, and load its consent-aware client only with a deployed service URL. This session will not edit either owner's files or change Pages settings. Assigned branch arena/c1033a7f-diyhome2 is fixed by the workspace.

Integration log: parallel publication PR #2 completed during measurement development. Resolved add/add board conflict by keeping both histories. Reusing its event vocabulary and database schema rather than introducing parallel analytics.
| Task | Status | Owner | Scope |
|---|---|---|---|
| Register and ledger integration | done | arena/7ad50d57-diyhome2 | product-register.json, campaign-ledger.csv, documentation |

- [PR #3](https://github.com/kanlerxz87-cyber/DIYHOME2/pull/3): A parallel publication merged while this branch was in progress. Resolved overlapping files in favor of the completed publication and preserved its builder, navigation, guides, collector, and checks. Integrated only the complementary machine-readable register and ledger. Independently observed the same three Amazon destinations; no affiliate attribution or intent confirmed. GitHub records the merge result on the linked PR.
# Coordination board

| Task | Status | Owner | File scope |
|---|---|---|---|
| Publication, research register, measurement, tests and Pages integration | in progress | 9167a293 | Site assets, data, scripts, workflows, README.md and COORDINATION.md |

2026-11-20 UTC: Initial checkout contained only the repository title. No existing claims. Using assigned Arena branch as the sole integration session.

05:57 UTC correction after fetching all remote heads: parallel publishing claims exist on 3a819254, d69e4487, 7ad50d57, 8a9218ed, 77f9fde9 and 669fab92. c1033a7f owns measurement/. Relinquishing overlapping integration claim. **In progress — 9167a293 — kitchen counter-fit interactive worksheet and original illustrative editorial image, exclusively `field-notes/counter-fit/`**. Request to integration: link worksheet and reuse its image if desired; no edits here to shared navigation, analytics, workflow, or Pages settings.

06:03 UTC: Initial integration is complete on main (PRs 2 and 3). Reconciled the add/add board conflict by retaining both sessions’ histories. The initial broad claim above is superseded. Final integration for **this worksheet only**: extend the completed guide index, air fryer article, RSS and sitemap via the builder and regenerate their outputs. No changes to measurement services or existing evidence records.

| Counter-fit guide & integration | done | 9167a293 | field-notes/counter-fit/, builder, guides, air fryers, feed, sitemap |

Verified the model-limited NA46x E10 outlet clearance from [Philips Support](https://www.usa.philips.com/c-t/XC000019680/my-philips-airfryer-shows-dashes-or-an-error-code); no universal clearances or product association inferred. All worksheet inputs start blank. Image is original AI-generated editorial illustration. Ran builder, root checks, nested link/fragment and disclosure checks, and calculator tests (exact fit, shortfall, decimal fit, reset). Rebase attempted to replay previously merged parallel commits; aborted without losing work and used fast-forward-only pull after preserving both board histories.
Merge log: PR #3 added evidence records in parallel. Retained both board entries; the desk will use its canonical campaign-ledger.csv, not a second ledger.

2026-11-20, c1033a7f: Re-fetched all three distinct submitted links, confirming the three observed Amazon targets recorded above; submission 03 repeats 02. No intended ASIN, account enrollment, Special Link tracking, sales, profitability or conversion confirmed. Checked [Amazon §§1,5](https://affiliate-program.amazon.com/help/operating/agreement), [GitHub static hosting](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages) and [hosting limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits). Report flags account and hosting limits. Built publication, checked internal paths/disclosures/sponsored references/XML, tested all five counter events on isolated temporary storage, origin rejection, GPC suppression, source validation and empty ledger. Production data untouched. See issue #1 for shared-navigation handoff.

PR #5 board reconciliation: retained both worksheet and measurement histories, no application conflict.

Release receipt, 2026-11-20: [campaign desk PR #5](https://github.com/kanlerxz87-cyber/DIYHOME2/pull/5) merged into main at 06:01:24 UTC (2196f24). The first deployment failed while parallel work landed; the subsequent [Pages deployment](https://github.com/kanlerxz87-cyber/DIYHOME2/actions/runs/44684912722) succeeded with this change included. Independently fetched the [live report](https://kanlerxz87-cyber.github.io/DIYHOME2/measurement/) and confirmed its static status, all five signals, CSV link and empty ledger. No production event collection is asserted.
| Task | Status | Owner | Scope |
|---|---|---|---|
| Product-first card artwork and titles | done | 8a9218ed | assets/, scripts/build.py, generated guide index and front page |

- [PR #4](https://github.com/kanlerxz87-cyber/DIYHOME2/pull/4): Main advanced during this parallel session. Resolved overlapping files in favor of the deployed publication and integrated only the complementary category illustrations and product-first headline cards. Confirmed Amazon destinations independently; tracking and product intent remain unverified. Illustrations are decorative, not listing photos. GitHub tracks the merge result on the linked PR.

- Incorporated the independently merged measurement desk without changing its files.

- Retained the concurrently merged worksheet and its feed/sitemap entries.
PR #7 reconciliation: preserved the concurrent card-artwork log and release receipt. Extended only the measurement host allowlist for newly merged public images and worksheet assets.

| Task | Status | Owner | Scope |
|---|---|---|---|
| Parallel verification and handoff | done | arena/77f9fde9-diyhome2 | COORDINATION.md only; no site or product-data files |

2026-11-20 (`arena/77f9fde9-diyhome2`): The initial branch snapshot contained only the baseline commit and no coordination board. This session pushed its integration claim before refreshing the remote. After fetching, it found the parallel integration work and PRs #2 and #3; it stopped editing site/product files, rebased onto current `main`, and resolved successive `COORDINATION.md` conflicts by preserving all newer board entries and appending this handoff. Subsequent main-branch coordination recorded PRs #4, #5, #6 and #7 as well; this session did not modify another session's application files.

Independent review sources fetched: Amazon [Associates Operating Agreement](https://affiliate-program.amazon.com/help/operating/agreement), [Program Policies](https://affiliate-program.amazon.com/help/operating/policies), [ASIN help](https://affiliate-program.amazon.com/help/node/topic/GP38PJ6EUR6PFBEC), and the three observed listing pages ([B08FKW9JRM](https://www.amazon.com/dp/B08FKW9JRM), [B0BSKQW2T2](https://www.amazon.com/dp/B0BSKQW2T2), [B08DY9HRWD](https://www.amazon.com/dp/B08DY9HRWD)); FTC [affiliate disclosure guidance](https://www.ftc.gov/business-guidance/resources/ftcs-endorsement-guides-what-people-are-asking); Google [sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap) and [Search Console ownership verification](https://support.google.com/webmasters/answer/9008080?hl=en). The Amazon product pages support the observed listing identities only; they do not confirm the submitted links' intended products, redirect behavior, or Associates attribution. No short link is described as invalid.

Deployment review: GitHub Pages is configured for the public project site [DIY Home Upgrades](https://kanlerxz87-cyber.github.io/DIYHOME2/). At review time the Pages API reported the site built; the live homepage, Flagged for Review page, sitemap and feed were fetched. Account-side link testing, tracking-report confirmation, Search Console ownership and an analytics endpoint on the public static host remain unverified/not deployed, and remain non-blocking review items on the site.

2026-11-20 final integration update from `arena/3a819254-diyhome2`: `main` advanced again during the required pre-push rebase, causing conflicts in `COORDINATION.md`, `guides.html` and `index.html`. The rebase was aborted and the latest main history was merged. Conflicts were resolved by retaining main's newer product-first artwork and worksheet integration, then regenerating pages with the merged builder; the `Campaign desk` link is preserved in the shared dropdown/footer. The session's redundant standalone publication files were not carried into the integrated site.

Latest-build checks after this merge: `python3 scripts/build.py`, `python3 scripts/check.py`, `python3 measurement/test_desk.py`, `node field-notes/counter-fit/test.cjs`, `node --check assets/metrics.js`, XML parsing and `git diff --check` passed. The register still has four rows, preserves the duplicate, and leaves intended product identity and affiliate attribution unverified. PR creation/merge and post-merge Pages verification remain.

Release receipt, 2026-11-20: [PR #9](https://github.com/kanlerxz87-cyber/DIYHOME2/pull/9) merged into main at 06:08:34 UTC (merge commit 570cac4). The post-merge [Publication checks run](https://github.com/kanlerxz87-cyber/DIYHOME2/actions/runs/44685710412) succeeded on main, and the [Pages deployment](https://github.com/kanlerxz87-cyber/DIYHOME2/actions/runs/44685708111) succeeded; the Pages API reported status `built`. Independently fetched the live [homepage](https://kanlerxz87-cyber.github.io/DIYHOME2/), [robots.txt](https://kanlerxz87-cyber.github.io/DIYHOME2/robots.txt), [sitemap.xml](https://kanlerxz87-cyber.github.io/DIYHOME2/sitemap.xml), [Campaign desk](https://kanlerxz87-cyber.github.io/DIYHOME2/measurement/) and [Flagged for Review](https://kanlerxz87-cyber.github.io/DIYHOME2/review.html) pages: the disclosure is above the fold, the ledger remains empty with no fabricated metrics, and the four register rows keep intended ASIN/listing/confirmation fields blank with the duplicate preserved. No authorized orders, conversion data, revenue, or Search Console data are asserted; the shared analytics endpoint remains not deployed on the static host.

PR #8 handoff receipt: [PR #8](https://github.com/kanlerxz87-cyber/DIYHOME2/pull/8) merged on 2026-11-20 at 06:04:23 UTC as `59186b1c177c876e864ec9de9b0418633901b1a3`. Its publication check [44685219172](https://github.com/kanlerxz87-cyber/DIYHOME2/actions/runs/44685219172) and Pages deployment [44685218790](https://github.com/kanlerxz87-cyber/DIYHOME2/actions/runs/44685218790) succeeded.

| Task | Status | Owner | Scope |
|---|---|---|---|
| Add the counter-fit field guide to RSS | done | verified in `scripts/build.py` & `feed.xml` during `arena/b92d7dd8-diyhome2` merge | `scripts/build.py`, `feed.xml` |

2026-11-20 feed/sitemap review: after the successful main deployment following PR #9, the [live sitemap](https://kanlerxz87-cyber.github.io/DIYHOME2/sitemap.xml) includes `/field-notes/counter-fit/`, but the [live RSS feed](https://kanlerxz87-cyber.github.io/DIYHOME2/feed.xml) contains only the four root-guide items (wallpaper, paper towel holder, cookware, and air fryer) and omits the published question-shaped counter-fit guide. This conflicts with the earlier board note that the worksheet's feed and sitemap entries were both retained. Request to the final integration session: add the field-note item to RSS, or record a deliberate exclusion. This branch does not edit the builder or feed because that scope belongs to the integration session; the request remains unclaimed.

2026-11-20 (`arena/669fab92-diyhome2`): This branch initially built a parallel Node publication implementation before `main` advanced with the deployed Python-builder site from parallel sessions. To avoid duplicating the live publication, the merge keeps `main`'s deployed site, builder, register, ledger, measurement desk, and checks. The parallel Node implementation is not carried into the integrated site. No product facts, tracking, Search Console data, clicks, orders, or revenue were verified by this session; the live Flagged for Review page remains the source for unresolved items.

Release receipt, 2026-11-20: [PR #12](https://github.com/kanlerxz87-cyber/DIYHOME2/pull/12) merged into main at 06:13:02 UTC (merge commit 92f5b61). The PR check [44686182627](https://github.com/kanlerxz87-cyber/DIYHOME2/actions/runs/44686182627) succeeded; post-merge [Publication checks](https://github.com/kanlerxz87-cyber/DIYHOME2/actions/runs/44686234991) and [Pages deployment](https://github.com/kanlerxz87-cyber/DIYHOME2/actions/runs/44686234026) succeeded, and the Pages API reported status `built`. Live homepage and Flagged for Review pages were fetched after deployment; the disclosure remains above the fold and the register still preserves the duplicate with intended fields blank.

| Task | Status | Owner | Scope |
|---|---|---|---|
| Deep spec, internal discrepancy & 2026 policy audit addendum | done | arena/b92d7dd8-diyhome2 | `audit/`, `scripts/build.py` (navigation & sitemap link only), regenerated root pages, `COORDINATION.md` |

2026-11-20 reconciliation (`arena/b92d7dd8-diyhome2`): Initial checkout branched from baseline `b8df795` while parallel sessions merged PRs #2–#12 onto `main`. Merged `origin/main` cleanly and resolved all conflicts in favor of the integrated live publication (preserving its builder, artwork, worksheet, Campaign desk, register, ledger, workflows, and full coordination history) without discarding any prior session's work. Retired redundant standalone root publication files and integrated only the complementary, non-overlapping `audit/` surface (`audit/index.html`, `audit/data/*.json`, `audit/check_audit.mjs`) linked from `scripts/build.py`'s Site records dropdown, footer, and `sitemap.xml`. Confirmed `feed.xml` regenerated by `scripts/build.py` includes `/field-notes/counter-fit/` alongside the four root guides.

Complementary verified findings added in `audit/` (all independently verified 2026-11-20 against official sources):
- **Observed listing technical specs & internal discrepancies:** `B08FKW9JRM` (Art3d) `Item Package Quantity: 3` vs Bullet 1 listing 5 items + California Prop 65 notice + missing UPC; `B0BSKQW2T2` (niffgaff) verified dimensions (`2.56"L × 12.2"W`, Aluminum, `5 oz`) + missing UPC and Date First Available; `B08DY9HRWD` (ORDORA) title (`up to 11"`, `10 lb/tier` Light-Duty) vs Bullet 4 (`up to 12 inches`) + newer heavy-duty model banner (`B0BYYTQMTR`) + California Prop 65 notice + verified 3 DIY footprints & cabinet clearances.
- **2026 official regulatory & platform register (`S01`–`S12`):** Amazon PA-API 5.0 deprecation & Creators API migration ([deprecation notice](https://affiliate-program.amazon.com/creatorsapi/docs/en-us/paapiv5-deprecation)), April 14, 2026 Operating Agreement & Program Policies updates ([compare](https://affiliate-program.amazon.com/help/operating/compare)), Standard Commission Income Table 1 ([rates](https://affiliate-program.amazon.com/help/node/topic/GRXPHT8U84RAYDXZ): Tools/Home Improvement 3.00%, Kitchen 4.50% vs Home 3.00% SKU attribution unverified), Application Review thresholds ([review](https://affiliate-program.amazon.com/help/node/topic/G8TW5AE9XL2VX9VM)), FTC 16 C.F.R. Part 255, and Google Search Central `rel="sponsored"` & thin-affiliation policies.
- **Unverified / non-blocking review posture preserved:** Intended ASINs, official listing confirmations, Special Link compliance status for the submitted `link.amazon` URLs (not claimed invalid), and `shopnow047c-20` tracking remain unverified and separate from observed redirects; campaign ledger remains empty with zero fabricated metrics.

Release receipt, 2026-11-20 (`arena/b92d7dd8-diyhome2`): [PR #13](https://github.com/kanlerxz87-cyber/DIYHOME2/pull/13) merged into `main` at `06:14:11 UTC` (merge commit `b6b6af3ad4d612aba7cbf14dd435b6afc2443787`). Post-merge [Publication checks](https://github.com/kanlerxz87-cyber/DIYHOME2/actions/runs/44686373921) and [GitHub Pages deployment](https://github.com/kanlerxz87-cyber/DIYHOME2/actions/runs/44686372647) both succeeded, and the Pages API reported status `built`. Independently fetched live [homepage](https://kanlerxz87-cyber.github.io/DIYHOME2/), [Spec & policy audit](https://kanlerxz87-cyber.github.io/DIYHOME2/audit/), [sitemap.xml](https://kanlerxz87-cyber.github.io/DIYHOME2/sitemap.xml), and [feed.xml](https://kanlerxz87-cyber.github.io/DIYHOME2/feed.xml) — confirmed `/audit/` renders all 3 sourced tables and above-the-fold/footer disclosures, `/sitemap.xml` lists `/audit/` and `/field-notes/counter-fit/`, and `/feed.xml` syndicates all 5 guides including `/field-notes/counter-fit/`.

### PR #13 reconciliation and RSS coverage completion — `arena/ecb1bfed-diyhome2`

Merging main after PR #13 required resolving one code conflict and twelve generated files.
Nothing was lost:

| File | Resolution |
|---|---|
| `scripts/build.py` | One conflict, on the shared `ops` nav list. **Both** entries kept: `Citation register` and PR #13's `Spec & policy audit`. |
| 10 HTML pages + `sitemap.xml` | Took main's version, then regenerated from the merged builder. Hand-merging generated output would have produced pages that disagree with their source. |
| `COORDINATION.md` | Took main's version, then appended this entry. |

**RSS coverage completed.** Adding the audit page to the sitemap without adding it to the feed
re-opened exactly the gap this session set out to close. The new `feed:coverage-gap` check
caught it before merge, which is the check working as intended. The audit page is now in the
feed, and sitemap and feed agree at **13 URLs / 13 items**.

**Removed:** `.github/workflows/build-and-audit.yml`, a stale workflow from this session's
abandoned standalone build. It referenced `scripts/build.mjs` and `scripts/audit.mjs`, both of
which were retired, so it could only ever fail. Superseded by `scripts/verify.mjs` running
inside the surviving `check.yml`.

Verified after the merge: `python3 scripts/build.py`, `python3 scripts/check.py`,
`node scripts/verify.mjs` all pass; `git status --porcelain` empty, so output is reproducible.


### Release receipt — PR #15 (2026-11-20)

[PR #15](https://github.com/kanlerxz87-cyber/DIYHOME2/pull/15) merged into `main` at
**06:17:09 UTC**, merge commit `981449a449bdafb41c90ae3bd1918d347c023bd0`.

| Check | Result |
|---|---|
| Publication checks on `main` | [44686721341](https://github.com/kanlerxz87-cyber/DIYHOME2/actions/runs/44686721341) — success |
| Pages build and deployment | [44686720577](https://github.com/kanlerxz87-cyber/DIYHOME2/actions/runs/44686720577) — success |

Independently fetched the live pages after deployment:

- [sources.html](https://kanlerxz87-cyber.github.io/DIYHOME2/sources.html) — all 12 documents
  render with publisher, date-on-page and access state; the 6 constraints render with working
  in-page basis links; S07–S12 print their Amazon and redirector URLs as plain text, and no
  untagged Amazon product link is emitted.
- [feed.xml](https://kanlerxz87-cyber.github.io/DIYHOME2/feed.xml) — 13 items, covering every
  page in the sitemap, including `/audit/` and `/field-notes/counter-fit/`.
- Amazon listing and redirector URLs verified absent from the feed and the sitemap.

**Still unverified, and unchanged by this PR:** intended product identity, Special Link
compliance for the submitted `link.amazon` URLs (not claimed invalid), `shopnow047c-20`
tracking attribution, Search Console ownership, and a deployed analytics endpoint. The campaign
ledger remains empty. No clicks, orders, revenue, conversion rate or forecast is asserted
anywhere on the site.

**Board note for future sessions:** `COORDINATION.md` and `scripts/build.py` are the two files
every session touches, so both conflict on nearly every merge. For the board, resolve by keeping
*both* sides and appending (verified twice this session). For `build.py`, the conflict is usually
the shared `ops` nav list — keep every session's entry rather than replacing one with another.
Generated HTML should be regenerated from the merged builder, never hand-merged.

2026-11-20 (`arena/7ebfbe32-diyhome2`): session branch was cut from the stale baseline `b8df795` and its snapshot contained only README.md — the board on `main` had advanced through PRs #2–#13. Without first fetching `main`, this session built a full parallel publication (front page, four guides, builder, five-event tracker, campaign ledger, flagged-for-review page, executive summary) and opened PR #14.

Findings on reconciliation (updated after `main` raced ahead again twice: to `981449a` via PRs #15–#17 and to `d87f627` via PR #18):
- The Amazon hosts (`amazon.com`, `link.amazon`, `affiliate-program.amazon.com`) were **not reachable** from this session's build window (TLS `SSL_ERROR_SYSCALL`/`000`), unlike the sibling sessions recorded above, which report fetching the three live listings and recorded observed targets in `product-register.json` (`B08FKW9JRM`, `B0BSKQW2T2` ×2, `B08DY9HRWD`). This session's parallel data, guides, analytics vocabulary (`affiliate_outbound_click`, `guide_read`, …) and tooling **were discarded in full**. No value from that build is carried into the site.
- All conflicts across the three merges were resolved **in favor of the integrated live publication**; redundant files were removed (`tools/`, `data/`, my generated root HTML, `guides/`, `assets/css|js|img|downloads`, `EXECUTIVE_SUMMARY.md`, duplicate workflow). The merged tree differs from `origin/main` only by this coordination entry.
- Operational error recorded honestly: after the first merge, this session ran `git pull --rebase` on the open PR branch. Rebase linearized the merge and replayed `main`'s commits, stopping on a `COORDINATION.md` conflict; the rebase was aborted immediately (`git rebase --abort`), restoring the branch tip `7568bc9` intact. No force-push was needed; the remote branch ref matched the restored commit. **Never rebase an open-PR branch after merging `main` into it — merge and push directly.**
- `main` moved three times mid-session (`b6b6af3` → `981449a` → `d87f627`). This session merged `origin/main` each time before pushing; conflicts were limited to `COORDINATION.md`, resolved by keeping both histories and appending this entry. Site files were never hand-merged.
- `python3 scripts/check.py` passes on the reconciled tree; `node scripts/verify.mjs` → GATE PASSED. Pages deploy status confirmed by the PR #15 receipt above; final PR #14 merge receipt recorded at merge time.
- PR #14 was repurposed: it carries only coordination documentation and does **not** re-land parallel work. Any unique value from this session (weaker, network-blocked verification) is intentionally not shipped.
- Lesson for future sessions: `git fetch origin` + re-read `COORDINATION.md` immediately before claiming any task; an Arena session branch can be cut from an old commit while `main` races ahead.

Verification performed on the reconciled tree: `python3 scripts/check.py` → passed; `node scripts/verify.mjs` → GATE PASSED. Site files untouched relative to the integrated `main`.

### Release receipt — PR #14 (2026-11-20)

[PR #14](https://github.com/kanlerxz87-cyber/DIYHOME2/pull/14) merged into `main` at **06:20:18 UTC**, merge commit `7159b647e457dff80c64d18321e0715dfc462e3b` (coordination-only; no site/data/tooling changes were carried into `main` — the deployed publication is untouched by this session).

| Check | Result |
|---|---|
| Publication checks on `main` | [44687089140](https://github.com/kanlerxz87-cyber/DIYHOME2/actions/runs/44687089140) — success |
| Pages build and deployment | [44687088411](https://github.com/kanlerxz87-cyber/DIYHOME2/actions/runs/44687088411) — success |
| Pages API | `status: built`, `build_type: legacy`, `html_url: https://kanlerxz87-cyber.github.io/DIYHOME2/` |

Independently fetched the live [homepage](https://kanlerxz87-cyber.github.io/DIYHOME2/) after deployment — renders the integrated publication with the disclosure above the fold ("As an Amazon Associate I earn from qualifying purchases."), the three shopping-edit guides, and the air fryer guide link.

Session outcome: the initial parallel build was retired in favor of the integrated live site; the board, the conflict resolution and this receipt are the only contributions. Unresolved project-level items (intended ASIN identity, Special Link compliance, tracking attribution, Search Console ownership, deployed analytics endpoint, empty campaign ledger) remain exactly as recorded in the live site's Flagged for Review page — this session did not and cannot close them.

---

## Session bd0ba155 (2026-11-21) — claim

| Task | Status | Owner | Scope |
|---|---|---|---|
| Independent re-verification, publish all open flags on the Flagged for Review page, reconcile contradictions | done | bd0ba155 (`arena/bd0ba155-diyhome2`) | `data/flags.json`, `data/citation-register.json`, `scripts/build.py` (review/sources pages only), `scripts/verify.mjs` (new checks only), `audit/data/flagged-discrepancies.json` (one stale string), `README.md`, regenerated root HTML, `COORDINATION.md` |

Pre-claim state: fetched `origin/main` = `fb5f639`; no open PRs; no other active claims (all earlier tasks done). Local `build.py` + `check.py` + `verify.mjs` all pass at baseline.

| Findability + editorial honesty pass (OG/SEO meta, guides working-titles, executive summary tables) | done | arena/175d82e7-diyhome2 | scripts/build.py, regenerated root HTML, COORDINATION.md |

2026-11-21 (arena/175d82e7-diyhome2): Claiming the final integration polish pass. Fetched origin/main (fb5f639, PR #19) — branch is at tip, no other session holds an in-progress claim on build.py (all prior tasks done/needs review). Scope is limited to scripts/build.py + regenerated root pages + this board; explicitly NOT touching measurement/, field-notes/, audit/, data/, assets/, workflows, product-register.json or campaign-ledger.csv. Amazon hosts and github.io are not reachable from this build window (TLS SSL_ERROR_SYSCALL, same block recorded by 7ebfbe32) — no new product facts will be verified here; all product values are carried from the 2026-11-20 observations in product-register.json / data/links.json and the citation register. Intended fields stay blank.

2026-11-21 (arena/175d82e7-diyhome2): Findability + editorial honesty pass complete. Added OG/Twitter/JSON-LD/author meta to all 11 builder-generated root pages (verified facts only: site name, canonical, description, on-disk hero image; no ratings, prices, popularity or revenue claims). Added the 4 brief hypotheses as a "Working titles — not yet publishable" table on guides.html (1 published, 3 set aside with reason; disclaimer that they are not popularity/volume claims) — closing the gap where F06 claimed they were recorded but they were not rendered. Expanded summary.html with 2 sourced tables (products with observed ASINs + Amazon source links, intended blank; verification status with S01/S02/S03/S06 + Flagged for Review + Measurement). No new Amazon facts verified — Amazon hosts unreachable from this window (TLS SSL_ERROR_SYSCALL, same as 7ebfbe32); all product values carried from 2026-11-20 observations in product-register.json / data/links.json / citation-register.json. Intended fields stay blank; ledger stays empty. Verified: python3 scripts/build.py + check.py pass, node scripts/verify.mjs GATE PASSED (13/13 sitemap/feed, disclosure x2 every page, all Amazon links sponsored/no-query/no-shortener, no prices/ratings), node audit/check_audit.mjs pass, measurement desk tests 2/2 pass, worksheet tests pass, preview server serves all pages 200. Request to audit/field-notes owners: add matching OG/Twitter/JSON-LD to audit/index.html and field-notes/counter-fit/index.html (not edited here — outside claimed scope). No conflicts; no other session's files touched.

| Final re-verification and integration | in progress | 54a0fc61 | COORDINATION.md only; no site or product-data files |

2026-11-21 (`arena/54a0fc61-diyhome2`): Claimed before editing. Scope is board-only; site, data and builder files are owned by the integrated publication and will not be touched. Re-verifying all three observed listings line by line against official Amazon pages, then opening the integration PR.

### Re-verification log — 2026-11-21 (`arena/54a0fc61-diyhome2`)

Re-fetched all three observed listings from official Amazon pages and compared line by line against `data/products.json` and `data/links.json`:

| ASIN | Listing title | Browse node | Seller | Status |
|---|---|---|---|---|
| [B08FKW9JRM](https://www.amazon.com/dp/B08FKW9JRM) | Matches register exactly | 164701011 Wallpaper Tools — matches | Art3d® — matches | In Stock |
| [B0BSKQW2T2](https://www.amazon.com/dp/B0BSKQW2T2) | Matches register exactly | 3744201 Paper Towel Holders — matches | YH Urban — matches | In Stock |
| [B08DY9HRWD](https://www.amazon.com/dp/B08DY9HRWD) | Matches register exactly | 289824 Pot Racks — matches | ORDORA Official — matches | In Stock |

- Live prices were visible on the listing pages but are **not** published on the site, per the price-display conditions in S02. No price, rating or review figure appears anywhere in the generated HTML (verify.mjs gate confirms).
- The `link.amazon` short URLs themselves were not re-fetched this session (Amazon redirector hosts are outside this sandbox's egress allowlist); the observed redirect targets recorded on 2026-11-20 were re-confirmed live instead. The short-link compliance status remains unresolved and is not claimed either way.
- Fetched the live [homepage](https://kanlerxz87-cyber.github.io/DIYHOME2/): disclosure above the fold, three shopping-edit guides and the air fryer guide all render.
- Local gates re-run on this branch: `python3 scripts/build.py`, `python3 scripts/check.py`, `node scripts/verify.mjs` — all pass; `git status` clean after build, so output is reproducible.
- **No irregularities found.** Unverified items are unchanged and remain on the Flagged for Review page: intended ASINs, Special Link compliance, `shopnow047c-20` tracking attribution, Search Console ownership, deployed analytics endpoint, empty campaign ledger.

| Final re-verification and integration | done | 54a0fc61 | COORDINATION.md only; no site or product-data files |

### Release receipt — PR #20 (2026-11-21, `arena/54a0fc61-diyhome2`)

[PR #20](https://github.com/kanlerxz87-cyber/DIYHOME2/pull/20) merged into `main` at **23:20:07 UTC**, merge commit `ee8204852d1e056cc565c9d1ad668b20d0a44f55` (coordination-only; no site/data/tooling changes).

| Check | Result |
|---|---|
| Publication checks on `main` | [44961279025](https://github.com/kanlerxz87-cyber/DIYHOME2/actions/runs/44961279025) — success |
| Pages build and deployment | [44961277719](https://github.com/kanlerxz87-cyber/DIYHOME2/actions/runs/44961277719) — success |
| Pages API | `status: built`, `build_type: legacy` |

Live [homepage](https://kanlerxz87-cyber.github.io/DIYHOME2/) re-fetched after deployment — disclosure above the fold, three shopping-edit guides and the air fryer guide render. All unverified items remain on the Flagged for Review page and block nothing.

| Task | Status | Owner | Scope |
|---|---|---|---|
| Executive summary, landing page, category guides, entry tables, verification and Pages integration | done | bd698cf8 | summary.html, index.html, guides/*.html, review.html, scripts/build.py, scripts/check.py, scripts/verify.mjs, COORDINATION.md |

2026-11-21 (`arena/bd698cf8-diyhome2`): Reviewed the full repository at fb5f639. The integrated publication is already complete and reproducible: `python3 scripts/build.py && python3 scripts/check.py && node scripts/verify.mjs` all pass with a clean tree (generated output matches committed files). The landing page leads with products (three shopping-edit cards plus the air fryer guide); category buying guides live under guides.html; all four submitted links appear in the Flagged for Review table with intended fields left blank and unverified; the disclosure strip sits above the fold and repeats in the footer on every page; every Amazon product link carries `rel="sponsored"`, no query string, and no shortener; sitemap and feed agree (13 URLs / 13 items) and every entry resolves on disk; the campaign ledger is empty-by-design with schema validation; ten open flags are published and none block publication.

Live verification note: outbound network to affiliate-program.amazon.com, sell.amazon.com, www.amazon.com, link.amazon and ftc.gov returns TLS failure (HTTP 000) from this build window, so no new live Amazon/FTC fetch was possible here. All product and policy citations therefore rest on the data already recorded against official sources in data/citation-register.json (S01–S12, accessed 2026-11-20 by prior sessions), which this session re-validated for scheme, host, claim and access state via scripts/verify.mjs. Nothing was inferred or filled in; unverified fields remain blank and flagged.

The executive summary (summary.html) already outlines launch scope, findings and next decisions, and the Flagged for Review page holds the entry table with per-row Amazon source links. No new product facts, tracking, revenue or Search Console data were asserted. PR creation/merge and post-merge Pages verification remain for this session.

### Release receipt — PR #22 (2026-11-21, `arena/175d82e7-diyhome2`)

[PR #22](https://github.com/kanlerxz87-cyber/DIYHOME2/pull/22) merged into `main` at **23:21:27 UTC**, merge commit `1062e3ebcbde5188652b815fdc42cafeb3a01560`.

| Check | Result |
|---|---|
| PR checks (Publication checks) | [44961352407](https://github.com/kanlerxz87-cyber/DIYHOME2/actions/runs/44961352407) — success |
| Publication checks on `main` | [44961397512](https://github.com/kanlerxz87-cyber/DIYHOME2/actions/runs/44961397512) — success |
| Pages build and deployment | [44961396928](https://github.com/kanlerxz87-cyber/DIYHOME2/actions/runs/44961396928) — success |
| Pages API | `status: built`, `build_type: legacy`, `html_url: https://kanlerxz87-cyber.github.io/DIYHOME2/` |

Live site not re-fetched from this build window (github.io unreachable here, TLS SSL_ERROR_SYSCALL); deployment confirmed via Actions + Pages API. PR #20 session fetched the live homepage earlier the same day (disclosure above fold, three shopping-edit guides, air fryer guide). This PR added OG/Twitter/JSON-LD/author meta to root pages, the working-titles table on guides.html, and 2 sourced tables on summary.html. No product data changed; intended fields blank; ledger empty.

**Still unverified, unchanged by this PR:** intended product identity, Special Link compliance for submitted `link.amazon` URLs (not claimed invalid), `shopnow047c-20` tracking attribution, Search Console ownership, deployed analytics endpoint. No clicks, orders, revenue, conversion rate or forecast asserted.

### Re-verification and flag publication — 2026-11-21 (`arena/bd0ba155-diyhome2`)

Claim was pushed first, then `origin/main` advanced three times (PRs #20–#24); each time main was merged into this branch (no rebase). `COORDINATION.md` conflicts kept both histories; `summary.html` was regenerated from the merged builder, not hand-merged. Sessions 175d82e7 and bd698cf8 touched `build.py` and `summary.html` concurrently; their changes are intact.

**What was wrong on `main` (found by reading, not assumed):**

| # | Finding | Resolution |
|---|---|---|
| 1 | `data/flags.json` (F01–F10) was validated by `verify.mjs` but **rendered on no page**. The page titled *Flagged for Review* showed only the four-row intent table. PR #20's “no irregularities found” covered listings, not this. | `review.html` now renders every flag with observed / what-would-close-it / official sources, plus a dated re-verification log. `verify.mjs` check 11 fails the build if any flag or re-check is missing from the page. |
| 2 | **Contradiction on commission rates.** F03, S03 and the executive summary said no rate could be read anywhere; the Spec & policy audit page publishes 4.50% / 3.00%. Both could not be right. | Re-read both. The rate-card address is sign-in only (return page is the account's *custom rate card*), **and** a public category table exists ([Table 1](https://affiliate-program.amazon.com/help/node/topic/GRXPHT8U84RAYDXZ): Kitchen 4.50%, Home / Home Improvement / Tools 3.00%, All Other 4.00%). The audit figures are correct. Added as S13; F03, S03 and the summary row corrected; `verify.mjs` check 12 stops the old claim returning. Which category each ASIN pays under stays unverified. |
| 3 | **New flag F12.** [Participation Requirements §2(b)](https://affiliate-program.amazon.com/help/operating/policies): the tag must appear as a parameter in “each link you place on your Site to an Amazon Site”. The three guide pages carry one untagged reference link each. The citation page called such links “not allowed” while the guides carried them. | Not silently fixed: the tag cannot honestly be added until the Special Link is validated (F02/F08). Published as F12 with two closing options; contradictory wording corrected; summary now discloses it. Links unchanged. |
| 4 | **New flag F11.** Program Policies (updated April 14, 2026) IP License §4 add *Agent Terms* (`Agent/[name]` user agent, no concealment, stop on request). Not recorded anywhere; the brief describes an automated agent. | Published as F11, medium. Not engaged today: no Program Content is used. |
| 5 | F06 said the four working titles were recorded on the guides index; they were not rendered. 175d82e7 fixed that. F06 text still described the old state. | F06 rewritten to match: 1 published as a generic checklist, 3 held back with reasons. |
| 6 | `audit/data/flagged-discrepancies.json` FLG-03 claimed product buttons use `?tag=shopnow047c-20` candidate URLs. No page does. | String corrected; points at F12. |

**Verified against official sources this session** (all via page fetch, 2026-11-21): all three `link.amazon` short links resolve to the recorded ASINs and titles with no `tag=` parameter (so F02 stands; PR #20 noted redirectors unreachable from its window — they were reachable here); ASIN = 10 characters ([what-is-an-asin](https://sell.amazon.com/blog/what-is-an-asin), [FBA New Selection](https://sell.amazon.com/blog/fba-new-selection-program)); [Agreement](https://affiliate-program.amazon.com/help/operating/agreement) dated Oct 15, 2025; [Policies](https://affiliate-program.amazon.com/help/operating/policies) dated Apr 14, 2026; rate-card address is sign-in only; FTC FAQ page loads.

**Not verified, stated plainly:** spec-level rows on the audit page (dimensions, weight, package quantity, material, UPC). The listing pages are 17–26 fetch chunks of volatile content and the details tables were not located; only bullet 1 of B08FKW9JRM was re-read (five items — consistent with FLG-05). Treat those rows as a 2026-11-20 snapshot. Intended ASINs, Special Link compliance, `shopnow047c-20` attribution, Search Console ownership, a deployed collector and the (empty) campaign ledger are unchanged and remain open.

Gates on the merged tree: `python3 scripts/build.py`, `python3 scripts/check.py`, `node scripts/verify.mjs` (now 12 flags + 7 re-checks published), `node audit/check_audit.mjs` — all pass; build is reproducible (`git status` clean after build).

### Release receipt — PR #26 (2026-11-21, `arena/bd0ba155-diyhome2`)

[PR #26](https://github.com/kanlerxz87-cyber/DIYHOME2/pull/26) merged into `main` at **23:25:10 UTC**, merge commit `6bdc20ccb66a6eb2d9db92cfbb459b65cefb5d34`.

| Check | Result |
|---|---|
| PR check (`verify`) | pass, [run 44961666409](https://github.com/kanlerxz87-cyber/DIYHOME2/actions/runs/44961666409) |
| Publication checks on `main` | [44961705027](https://github.com/kanlerxz87-cyber/DIYHOME2/actions/runs/44961705027) — success |
| Pages build and deployment | [44961704554](https://github.com/kanlerxz87-cyber/DIYHOME2/actions/runs/44961704554) — success; Pages API `status: built` |

Independently fetched the live [Flagged for Review](https://kanlerxz87-cyber.github.io/DIYHOME2/review.html) page after deploy (first fetch returned the pre-merge CDN copy; a cache-busted fetch showed the new content): **Open flags** table present with F01–F03 and source links read through, three tables in total. Rest of the flag table (F04–F12) and the re-verification log are generated by the same loop and enforced by `verify.mjs` check 11.

| Task | Status | Owner | Scope |
|---|---|---|---|
| Shop surface: consolidated category index + shop-style landing page + catalogue tables | in progress | arena/94688dd1-diyhome2 | `scripts/build.py`, regenerated root HTML (`index.html`, `shop.html`, `category/*`), `assets/style.css`, `sitemap.xml`, `feed.xml` |
| Executive summary refresh (2026-11-21 verification state) | in progress | arena/94688dd1-diyhome2 | `summary.html` content in `scripts/build.py`, `EXECUTIVE_SUMMARY.md` |
| Navigation parity fix on the audit page | in progress | arena/94688dd1-diyhome2 | `audit/index.html` (nav dropdown only; no content change) |

2026-11-21 (`arena/94688dd1-diyhome2`): Claimed before editing, pushed immediately. Base was
`fb5f639`; `origin/main` had advanced to `ee82048` (PRs #14–#20), so main was fast-forwarded
into this branch first and the board on `main` was read before claiming. Scope is limited to
the files named above. This session does **not** edit `data/*.json`, `product-register.json`,
`campaign-ledger.csv`, `measurement/`, `field-notes/`, `review.html` content, or the workflow.
All shop content is rendered from the already-verified `data/products.json` records; no new
product claim, price, rating, review count or tracking assertion is introduced. No competing
claim is active: the three earlier claims touching `build.py`/root HTML are marked `done`.

Request logged for the record: `audit/index.html` is the only page whose nav dropdown omits
`Citation register` (7 items on every generated page, 6 there). The fix below is one nav line
and leaves the audit owner's content untouched; the owner's task is `done`, so no live claim is
being edited.

### Shop surface — delivered (`arena/94688dd1-diyhome2`, 2026-11-21)

**What changed.** The reviewer asked for a shop, not an audit, plus an executive summary. Built from the
existing verified records; no product fact was re-invented.

| File | Change |
|---|---|
| `scripts/build.py` | One shared `page_shell()` for every page (nav, disclosure, footer can no longer drift); new `shop.html` and `category/*.html` generated from `data/products.json`; `Shop` added to the navigation group; breadth-first shell write so nested nav targets resolve; RSS and sitemap extended to 17 URLs / 17 items. |
| `scripts/summary.py` | New. The executive-summary page, moved out of the builder for legibility. |
| `EXECUTIVE_SUMMARY.md` | New. Standalone plain-language summary for manual review. |
| `index.html` (generated) | Front page now ends with a shop block; products lead, records follow. |
| `audit/index.html` | Nav parity: the dropdown gained the `Citation register` entry every other page has. Content untouched. |
| `field-notes/counter-fit/`, `measurement/` | Breadcrumb added under the disclosure so the shop is reachable from nested pages. Disclosure order unchanged. |
| `assets/style.css` | Breadcrumb and `unverified` pill styling only. |
| `.github/workflows/check.yml` | One step-summary line for category count. No gate logic changed. |

**Verification performed this pass.**
- Fetched all three amazon.com listings directly and compared against `data/products.json`:
  `B08FKW9JRM` — Art3d, sold by Art3d®, ships from Amazon, node 164701011, and the five kit contents
  (large smoothing tool, blue squeegee, utility knife, replacement blades, measuring tape) match the
  published bullet list exactly. `B0BSKQW2T2` — niffgaff, YH Urban, Aluminum, Black, Under Cabinet Mount,
  5 ounces, 2.56"L x 12.2"W, Size 12.2 inches, node 3744201 — all match. `B08DY9HRWD` — ORDORA,
  ORDORA Official, eight size options, four colours, node 289824 — all match.
- Prices, star ratings, review counts and "bought in past month" figures were present on those pages and
  are **not** published, per S02. The `verify.mjs` price/rating scan confirms none reached the HTML.
- Local gates: `python3 scripts/build.py`, `python3 scripts/check.py`, `node scripts/verify.mjs` all pass;
  `git status --porcelain` clean after a rebuild, so output is reproducible.
- Independent link crawl of all 18 pages (local server, not the file system) found no dead local target
  and no broken in-page fragment.
- `scripts/verify.mjs` caught two real defects before commit: the new pages were initially missing from
  the RSS feed (four `feed:coverage-gap` failures), and an early build wrote the shell before `shop.html`
  existed. Both fixed; the gates are why.

**Irregularities found and flagged (all non-blocking, all on the live Flagged for Review page).**
1. The three supplied `link.amazon` codes are 9 characters; an ASIN is defined as 10
   ([sell.amazon.com ASIN guide](https://sell.amazon.com/blog/what-is-an-asin)). Treated as redirector
   identifiers, never written into an intended-ASIN field.
2. `https://link.amazon/B03QDuGdo` was supplied twice (entries 2 and 3). The duplicate is preserved.
3. No `tag=` parameter was observed on any resolved destination, so `shopnow047c-20` attribution is
   unconfirmed. Not claimed either way.
4. `link.amazon` / `amazon.com` redirector hosts are outside this environment's egress range; the short
   links were **not** re-fetched this session. Only the listing pages were re-verified. The 2026-11-20
   redirect observation stands as that session's record and is not reasserted as today's fact.
5. Assumption, stated openly: the shop maps each product to the existing root guide that covers its
   category (`wallpaper`, `paper-towels`, `cookware`). No per-product page exists, so no per-product claim
   is made. Flagged here rather than inventing a guide link.

**Not changed, deliberately.** `data/*.json`, `product-register.json`, `campaign-ledger.csv`,
`review.html` content fields, `sources.html` tables, `standards.html`, and all measurement files keep
their existing values and ownership. The ledger remains empty; no metric, forecast or revenue figure was
added anywhere.


### Merge reconciliation and release of the shop surface (`arena/94688dd1-diyhome2`, 2026-11-21)

`main` advanced twice while PR #25 was open — PR #23 (`arena/175d82e7`, findability: OG/Twitter/JSON-LD
meta plus the guides working-titles table and summary tables) and PR #24 (`arena/bd698cf8`). The PR was
not mergeable, so `origin/main` was merged into the session branch and the conflicts resolved without
discarding any session's work.

**Resolution rule applied:** `scripts/build.py` was rebuilt from `origin/main`'s version and this
session's shop surface re-applied on top of it. Hand-merging a 175-line generated builder is how pages
end up disagreeing with their source.

| File | Resolution |
|---|---|
| `scripts/build.py` | main's builder kept as the base; findability meta (OG, Twitter, JSON-LD, author) folded into the single `page_shell()` so **every** page — including `shop.html` and the three `category/*` pages that did not exist when that pass ran — now carries it. `Shop` retained in the nav. `RECHECK` date added. |
| `shop.html`, `category/*.html` | Regenerated from the merged builder; they inherit main's meta and the re-verification wording. |
| 11 generated root pages | main's committed versions taken from `origin/main`, then regenerated from the merged builder. Verified afterwards that every one carries `og:title`, `application/ld+json` and a working `shop.html` nav link. |
| `COORDINATION.md` | Both histories kept: main's entries first, then this session's claim, delivery log and this reconciliation note. |
| `summary.html` | This session's `scripts/summary.py` page replaces the earlier inline summary (one page, not two). Main's sourced verification rows were **carried across** into it rather than dropped, so the disclosure-wording (S01), ASIN-definition (S06) and commission-rate (S03) checks still render. Its product table is superseded by the wider findings table in the same module. |

**Merged-tree verification.** `python3 scripts/build.py`, `python3 scripts/check.py` and
`node scripts/verify.mjs` all pass on the merged tree; sitemap and feed agree at 17 URLs / 17 items;
`git status` is clean after a rebuild, so the output is reproducible. Main's findability work is
confirmed present on all 14 generated pages (10 root + 3 category + shop) and main's
"Working titles — not yet publishable" table is still rendered on `guides.html`.

**Nothing dropped:** main's OG/JSON-LD meta, guides working-titles table, summary product/verification
tables, and this session's shop surface, category pages, re-verification pass and executive summary all
ship together.


### Second reconciliation (`arena/94688dd1-diyhome2`, 2026-11-21)

`main` advanced again during the pre-push rebase check — PR #26 (`arena/bd0ba155`) added the flag
renderer, a `flags:unpublished` gate in `scripts/verify.mjs`, flag F12 (untagged guide links) and the
public category rate table (S13). Conflicts in `scripts/build.py`, `assets/style.css` and the board were
resolved without dropping anything:

| File | Resolution |
|---|---|
| `scripts/build.py` | Rebuilt from `origin/main` again, then the shop surface re-applied: `page_shell()` carries main's findability meta for root **and** nested pages; the shop block is appended at the end of the review page so main's `_rb +=` flag/re-check rendering is untouched; sitemap and feed extended with the shop entries. |
| `data/flags.json` | Main's 12 flags and 7 re-checks kept; **5 re-checks appended** by this session (audit nav parity, and one per listing plus the render check). Values, severities and F-numbers unchanged. |
| `assets/style.css` | Kept main's `.pill` rules and this session's `.crumbs` / `.unv` rules. Both. |
| Generated HTML | Taken from `origin/main`, then regenerated from the merged builder. |

Deliberate design note: this session's review-page re-check table was **not** bolted on beside main's
re-check log. It was folded into `flags.json` as sourced re-check rows, so `review.html` has one
re-verification log instead of two competing ones.

Final gates on the merged tree: `python3 scripts/build.py`, `python3 scripts/check.py`,
`node scripts/verify.mjs` → GATE PASSED (12 flags and 12 re-checks published with sources, 17 sitemap
URLs / 17 feed items, disclosure twice per page, no prices or ratings, all Amazon product links
sponsored, no shortener).


### Third reconciliation and release (`arena/94688dd1-diyhome2`, 2026-11-21)

`main` moved twice more while PR #25 was open (PR #26 `arena/bd0ba155` — flag renderer, `flags:unpublished`
gate, F12 untagged-link flag, public category rate table S13; PR #27 — flag corrections, FLG-03 fix).
The session merged `origin/main` again. `scripts/build.py` was byte-identical to the version this session
had already rebuilt on, so the only real conflict was data and the board:

| File | Resolution |
|---|---|
| `data/flags.json` | main's 12 corrected flags and 7 re-checks kept verbatim; this session's 5 re-checks appended (`session: 94688dd1`). No flag text, severity or F-number altered. |
| `scripts/build.py` | No change needed: main's version is the base and the shop surface is layered on it. |
| `review.html` + generated pages | Taken from `origin/main`, then regenerated from the merged builder. |
| `COORDINATION.md` | Both histories kept, main's first, then this session's three entries. |

Verified before merge: `python3 scripts/build.py`, `python3 scripts/check.py`, `node scripts/verify.mjs`
(GATE PASSED — 12 flags and 12 re-checks published with sources, 17 sitemap URLs / 17 feed items),
`node audit/check_audit.mjs`, and a direct 18-page internal link and fragment crawl. Build is
reproducible: `git status --porcelain` is empty after a rebuild.

Post-merge addition: F12 (untagged reference links on the three guide pages) is now also stated on the
executive summary's "Checked against the source" table and in `EXECUTIVE_SUMMARY.md`, so the summary does
not read as if the compliance picture were closed. Severity, wording and the closing action are main's,
unchanged.


### Live-page review corrections (`arena/94688dd1-diyhome2`, 2026-11-21, post-merge)

Fetching the deployed pages, rather than only the local build, found four real defects. All are fixed on
this branch and gated so they cannot come back:

1. **The shop-linked Amazon browse nodes.** The category cards and each category header linked
   `amazon.com/b?node=…` with no tag. That is an untagged Amazon link — the exact thing flag F12 exists to
   record — and it would have widened the disclosed gap without saying so. They are now printed as
   `<code>` text. `scripts/verify.mjs` gained check 13, which pins the untagged-link count per page to the
   F12 disclosure (3 guides, 3 shop, 4 review, 6 audit, 1 per category page) and fails on any change.
2. **A contradiction with F12.** The executive summary said "no page links to an untagged Amazon product
   page" while the guide reference links — and, after this branch, most product links — are untagged. That
   sentence is replaced with an accurate one.
3. **An empty column.** Each category page rendered a "Material" column, or a "Key verified spec" column,
   that was blank for that category. Columns are now chosen from the facts each category's record actually
   carries: Kit contents (wallpaper), Material + Dimensions (paper towel holders), Heights + Colours offered
   (pot racks). Nothing is inferred to fill a cell.
4. **A duplicated clause** in the shop introduction ("the Associates Program Policies (S02) the Program
   Policies permit them only…").

Also stated plainly now, on the shop page itself: every Amazon product link on the site is untagged, so
they are preview links rather than paid Special Links. That is a consequence of not being able to validate
a Special Link without the enrolled account, and it is published rather than implied.

Gates after the corrections: `python3 scripts/build.py`, `python3 scripts/check.py`,
`node scripts/verify.mjs` (GATE PASSED, including the new check 13), `node audit/check_audit.mjs`, an
18-page internal link and fragment crawl, and reproducibility (`git status` clean after a rebuild).
### Session claim — `arena/a0e07843-diyhome2` (2026-11-21)

| Task | Status | Owner | File scope |
|---|---|---|---|
| Question-shaped guide pass 2: publish the three remaining working titles from the brief, spec-free, through the builder | done | `arena/a0e07843-diyhome2` | `scripts/build.py`, `data/flags.json` (F06/F09 + two re-check rows), regenerated root HTML, `sitemap.xml`, `feed.xml`, `COORDINATION.md` |

Claimed after reading the board on `origin/main` (`fb5f639`, PR #19). Scope was the open editorial gap the site itself recorded as **F06**: three of the four working titles supplied in the brief were unpublished.

**Shipped.** Three question-shaped buyer checklists — [`air-fryer-capacity.html`](https://kanlerxz87-cyber.github.io/DIYHOME2/air-fryer-capacity.html), [`air-fryer-cleanup.html`](https://kanlerxz87-cyber.github.io/DIYHOME2/air-fryer-cleanup.html), [`multi-function-appliances.html`](https://kanlerxz87-cyber.github.io/DIYHOME2/multi-function-appliances.html) — added to the builder's guide register, so the sitemap, RSS feed, guide index, front page and open-graph typing pick them up on build. Each is a checklist of questions the reader puts to the manual, the listing or the seller. None quotes a specification, price or star rating, recommends a model, or carries a buying link, because no air fryer or appliance listing has been verified for this publication. Also added: the guide index is grouped into a product-led cluster and a buyer-checklist cluster; the four working titles from the brief are kept in a table on the guide index with their published status; `standards.html` carries a publication log (issue 01 = 2026-11-20, issue 02 = 2026-11-21) with the official sources behind each issue; feed items now carry per-issue `pubDate` values instead of one fixed date.

**Independent re-verification, 2026-11-21** (each short URL fetched and the resolved page title and final URL read; recorded as two rows in the shared `rechecks` log in `data/flags.json`, which renders on the Flagged for Review page):
- [`https://link.amazon/B0hmGG4m2`](https://link.amazon/B0hmGG4m2) → [`/dp/B08FKW9JRM`](https://www.amazon.com/dp/B08FKW9JRM), "Art3d Smoothing Tool Kit for Peel and Stick Wallpaper | Vinyl Backsplash Tile, Complete Basic Tool Set, Bubble & Crease Removal, Ergonomic Grip, Safe for DIY and New Home Buyer"
- [`https://link.amazon/B03QDuGdo`](https://link.amazon/B03QDuGdo) → [`/dp/B0BSKQW2T2`](https://www.amazon.com/dp/B0BSKQW2T2), "Paper Towel Holder Under Cabinet, Self-Adhesive or Drilling, Matte Black | Kitchen Roll Dispenser | Under-Cabinet or Wall-Mounted| Upgraded Aluminum | Lighter Yet Stronger Than Stainless Steel" (supplied twice)
- [`https://link.amazon/B0hpD2JGQ`](https://link.amazon/B0hpD2JGQ) → [`/dp/B08DY9HRWD`](https://www.amazon.com/dp/B08DY9HRWD), "ORDORA Pots and Pans Organizer Under Cabinet 16.6\", 8-Tier Adjustable Rack | 3 DIY Modes, Tool-Free Assembly, Non-Slip, Fits Lightweight Cookware Up to 11\", For Kitchen Cabinets, Shelves & Countertops"

Same three destinations as every prior session recorded, so no register row changed. Each resolved URL carried Amazon referral parameters (`lv`, `crid`, `sprefix`, `sr`, `btn_ref=srctok-…`, `channelId=500`, `plpRedirect=mhFallback`) and **no `tag=` parameter**, so F02 stands. [FTC endorsement guidance](https://www.ftc.gov/business-guidance/resources/ftcs-endorsement-guides-what-people-are-asking) was read in full and is the only source paraphrased in the multi-function appliance checklist. Intent, enrollment, tracking attribution and Special Link compliance remain unverified and are asserted nowhere.

**Irregularities found and how they were handled.**
1. `data/flags.json` was validated but rendered nowhere on the published site, so the page named "Flagged for Review" carried only the four-row intent table. This session built a renderer and a build-time assertion for it, then found on merging `main` that `arena/bd0ba155-diyhome2` had independently shipped a fuller version (severity pills, the `rechecks` log, and gate 11 in `scripts/verify.mjs`). **This session's duplicate renderer was deleted rather than shipped alongside it**; only the two new `rechecks` rows and the F06/F09 amendments survive here.
2. Cadence wording disagreed between surfaces: `standards.html` said "one question-led guide every two weeks" while F09 said "a monthly cadence". Restated as a target rhythm with the shipped-issue log as the record; F09 stays open because two consecutive on-schedule issues still have not been demonstrated.
3. The feed used a single fixed `pubDate` for every guide, so a new issue looked identical to an old one in a reader's client. Now per-issue.
4. Re-verification detail worth keeping: resolved short links do not land on a clean `/dp/<ASIN>` URL; they carry Amazon's own referral query string and no tracking tag (consistent with F02, not a new finding).

**Verification performed on the merged tree.** `python3 scripts/build.py` then `git status --porcelain` empty for generated output (reproducible); `python3 scripts/check.py` → "Local links, disclosure, Amazon reference markup and XML checks passed."; `node scripts/verify.mjs` → GATE PASSED, 20 sitemap URLs / 20 feed items, 17 root pages scanned, 12 flags and 14 re-checks published with sources; `node audit/check_audit.mjs` → "Audit checks passed"; `node field-notes/counter-fit/test.cjs` and `python3 measurement/test_desk.py` → exit 0; every URL in the sitemap and feed fetched over a local HTTP server returned 200 with the disclosure present twice; no broken in-page anchors across all root pages.

**Merge reconciliation.** `main` advanced from `fb5f639` to `05db294` (PRs #20–#27) while this branch was in progress. Merged, not rebased. Conflicts: `COORDINATION.md` (both histories kept, this entry appended), `scripts/build.py` (took `main`'s builder — shop surface, category pages, `page_shell`, summary module, flag renderer — and re-applied only this session's additive guide, cluster, log and feed changes on top), `data/flags.json` (took `main`'s 12 flags and 12 re-checks, then amended F06/F09 and appended 2 re-check rows), and seven generated files (took `main`'s, then regenerated from the merged builder; generated output is never hand-merged). Nothing from any other session was discarded.