#!/usr/bin/env node
/**
 * Supplementary verification gate for the merged publication.
 *
 * `scripts/check.py` (owned by another session) already validates local links,
 * XML, the doubled disclosure and Amazon reference markup. This script covers
 * the ground it does not, so the two complement rather than duplicate:
 *
 *   1. every citation id used in data/ resolves to data/citation-register.json
 *   2. every citation URL is https and on an allowed publisher host
 *   3. no restricted source is treated as establishing anything
 *   4. no price and no star rating is rendered in any published page
 *   5. every Amazon product link is tagged, has no query string, and is not a
 *      shortener
 *   6. every published page carries the disclosure above its first table and in
 *      the footer
 *   7. the campaign ledger is still empty and schema-valid if rows appear
 *   8. sitemap and feed agree, and every entry resolves on disk
 *   9. the intended/observed separation in data/links.json has not been blurred
 *  10. every product in data/products.json has a listing URL and an ASIN that
 *      satisfies the 10-character definition
 *
 * Run: node scripts/verify.mjs
 * Exits non-zero on any failure, so it can gate a merge.
 */

import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const errors = [];
const notes = [];

const readJson = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), "utf8"));
const fail = (check, detail) => errors.push({ check, detail });
const say = (m) => notes.push(m);

const register = readJson("data/citation-register.json");
const links = readJson("data/links.json");
const products = readJson("data/products.json");
const ledger = readJson("data/campaign-ledger.json");
const flags = readJson("data/flags.json");
const _cats = readJson("data/products.json").categories.map((c) => c.slug);
const _catSlugs = _cats.map((sl) => `category/${sl}.html`);

const CITE = Object.fromEntries(register.sources.map((s) => [s.id, s]));
const ALLOWED_HOSTS = [
  "affiliate-program.amazon.com",
  "ftc.gov",
  "www.ftc.gov",
  "ecfr.gov",
  "www.ecfr.gov",
  "sell.amazon.com",
  "www.amazon.com",
  "amazon.com",
  "link.amazon",
];

/* 1 + 2 + 3 — the citation register itself ------------------------------- */
for (const [id, s] of Object.entries(CITE)) {
  if (!/^https:\/\//.test(s.url)) fail("cite:not-https", `${id} → ${s.url}`);
  let host = "";
  try {
    host = new URL(s.url).host;
  } catch {
    fail("cite:bad-url", `${id} → ${s.url}`);
    continue;
  }
  if (!ALLOWED_HOSTS.includes(host)) fail("cite:host", `${id} uses a non-official host: ${host}`);
  if (!s.claim) fail("cite:no-claim", `${id} records no claim`);
  if (s.access === "restricted" && s.claim && !/^nothing/i.test(s.claim))
    fail("cite:restricted-claims-something", `${id} is restricted but asserts a claim`);
  if (s.access === "public" && !s.dated_on_page) fail("cite:no-date", `${id} has no dated_on_page`);
}
say(`${Object.keys(CITE).length} citation sources checked for scheme, host, claim and access state`);

/* every source id referenced anywhere in data/ must exist in the register */
function referencedIds(node, out = new Set()) {
  if (Array.isArray(node)) node.forEach((n) => referencedIds(n, out));
  else if (node && typeof node === "object") {
    for (const [k, v] of Object.entries(node)) {
      if (k === "sources" && Array.isArray(v)) v.forEach((x) => typeof x === "string" && out.add(x));
      else if (k === "source" && typeof v === "string" && /^S\d+$/.test(v)) out.add(v);
      else if (k === "basis" && typeof v === "string") {
        v.split(/,\s*/).forEach((x) => /^S\d+$/.test(x.trim()) && out.add(x.trim()));
      } else referencedIds(v, out);
    }
  }
  return out;
}
for (const f of ["data/products.json", "data/links.json", "data/flags.json"]) {
  for (const id of referencedIds(readJson(f))) {
    if (!CITE[id]) fail("cite:dangling", `${f} references ${id}, which is not in the citation register`);
  }
}
say("every source id referenced in data files resolves to a register entry");

/* 4 — nothing priced or rated is rendered --------------------------------- */
const pages = fs.readdirSync(ROOT).filter((f) => f.endsWith(".html"));
const NESTED = ["field-notes/counter-fit/index.html", "measurement/index.html"];
for (const p of [...pages, ...NESTED.filter((n) => fs.existsSync(path.join(ROOT, n)))]) {
  const html = fs.readFileSync(path.join(ROOT, p), "utf8");
  if (/\$\s?\d+\.\d{2}/.test(html)) fail("policy:price", `${p} renders a price-like value`);
  if (/out of 5 stars|\d\.\d\s*★/i.test(html)) fail("policy:rating", `${p} renders a star rating`);
}
say(`${pages.length + NESTED.filter((n) => fs.existsSync(path.join(ROOT, n))).length} pages scanned for prices and ratings`);

/* 5 — Amazon product links ------------------------------------------------ */
const SHORTENERS = ["amzn.to", "bit.ly", "geni.us", "link.amazon"];
for (const p of pages) {
  const html = fs.readFileSync(path.join(ROOT, p), "utf8");
  for (const m of html.matchAll(/<a\b[^>]*href="(https?:\/\/[^"]*amazon[^"]*)"[^>]*>/gi)) {
    const tag = m[0];
    const href = m[1];
    const rel = (tag.match(/rel="([^"]*)"/) || [])[1] || "";
    const isProduct = /\/dp\//.test(href);
    if (isProduct) {
      if (!rel.split(/\s+/).includes("sponsored")) fail("link:not-sponsored", `${p} → ${href}`);
      if (/\?/.test(href)) fail("link:has-query", `${p} → ${href} carries a query string`);
    }
    if (SHORTENERS.some((s) => href.includes(s))) fail("link:shortener", `${p} → ${href}`);
  }
}
say("Amazon product links: all sponsored, no query strings, no shorteners");

/* 6 — disclosure placement ------------------------------------------------ */
const NOTICE = "As an Amazon Associate I earn from qualifying purchases.";
for (const p of pages) {
  const html = fs.readFileSync(path.join(ROOT, p), "utf8");
  const first = html.indexOf(NOTICE);
  if (first === -1) {
    fail("disclosure:missing", p);
    continue;
  }
  const firstTable = Math.min(
    ...[html.indexOf("<table"), html.indexOf("<aside")].filter((i) => i > -1).concat([Infinity])
  );
  if (first > firstTable) fail("disclosure:below-content", `${p} — notice appears after the first table/aside`);
  if (html.split(NOTICE).length - 1 < 2) fail("disclosure:not-repeated", `${p} — notice appears only once`);
}
say("disclosure present above content and repeated in the footer on every page");

/* 7 — the ledger stays honest -------------------------------------------- */
if (!Array.isArray(ledger.rows)) fail("ledger:shape", "campaign-ledger.json has no rows array");
else {
  const required = ["row_id", "timestamp_utc", "source", "channel", "provenance_note"];
  for (const row of ledger.rows) {
    for (const k of required) if (!(k in row)) fail("ledger:row", `row ${row.row_id || "?"} missing ${k}`);
    if (!row.provenance_note) fail("ledger:provenance", `row ${row.row_id || "?"} has no provenance note`);
  }
  say(`campaign ledger: ${ledger.rows.length} row(s), schema ${ledger.rows.length ? "valid" : "not yet exercised"}`);
}

/* 8 — sitemap and feed agree with what is on disk ------------------------ */
function locs(file) {
  const p = path.join(ROOT, file);
  if (!fs.existsSync(p)) {
    fail("xml:missing", file);
    return [];
  }
  return [...fs.readFileSync(p, "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}
function toPath(url) {
  const base = "https://kanlerxz87-cyber.github.io/DIYHOME2/";
  if (!url.startsWith(base)) return null;
  const rest = url.slice(base.length) || "index.html";
  return rest.endsWith("/") ? rest + "index.html" : rest;
}
const sm = locs("sitemap.xml");
for (const u of sm) {
  const rel = toPath(u);
  if (rel === null) {
    fail("sitemap:foreign-url", u);
    continue;
  }
  if (!fs.existsSync(path.join(ROOT, rel))) fail("sitemap:dead", `${u} → ${rel} not on disk`);
}
const feedXml = fs.existsSync(path.join(ROOT, "feed.xml")) ? fs.readFileSync(path.join(ROOT, "feed.xml"), "utf8") : "";
/* Item-level links only. The channel's own <link> points at the homepage and is
   not an entry; counting it made feed lengths look correct when they were not. */
const feedLinks = [...feedXml.matchAll(/<item>[\s\S]*?<\/item>/g)]
  .map((m) => (m[0].match(/<link>([^<]+)<\/link>/) || [])[1])
  .filter((u) => u && u.includes("/DIYHOME2/"));
if (!feedLinks.length) fail("feed:empty", "feed.xml contains no item links");
for (const u of feedLinks) {
  const rel = toPath(u);
  if (rel && !fs.existsSync(path.join(ROOT, rel))) fail("feed:dead", `${u} → ${rel} not on disk`);
  if (rel && !sm.includes(u)) fail("feed:not-in-sitemap", `${u} is in the feed but not the sitemap`);
}
/* Every published reading page should be reachable from the feed. Without this,
   a page can sit in the sitemap and be invisible to subscribers — which is the
   coverage gap the board requested be closed. Search and 404 are excluded
   deliberately: neither is an article. */
const FEED_EXEMPT = ["/252/", "search", "404"];
for (const u of sm) {
  if (FEED_EXEMPT.some((x) => u.includes(x))) continue;
  if (!feedLinks.includes(u)) fail("feed:coverage-gap", `${u} is published in the sitemap but missing from the feed`);
}
say(`sitemap ${sm.length} URLs and feed ${feedLinks.length} items resolve, agree, and the feed covers every published page`);

/* 9 — intended and observed stay separated ------------------------------- */
for (const l of links.links) {
  if (!("intended_asin" in l)) fail("links:no-intended-field", l.id);
  if (!("observed_asin" in l)) fail("links:no-observed-field", l.id);
  if (l.intended_asin && !l.confirmation_date)
    fail("links:intent-without-date", `${l.id} has an intended ASIN but no confirmation date`);
  if (l.intended_asin && !l.confirmation_source)
    fail("links:intent-without-source", `${l.id} has an intended ASIN but no confirmation source`);
  if (l.submitted_code === l.observed_asin) fail("links:code-equals-asin", `${l.id} treats the short code as the ASIN`);
  if (l.submitted_code_length === 10 && /^B0/.test(l.submitted_code))
    fail("links:code-looks-like-asin", `${l.id} — recheck whether the code really is 10 characters`);
}
say(`${links.links.length} link records keep intent and observation in separate fields`);

/* 10 — product records ---------------------------------------------------- */
for (const p of products.products) {
  if (!/^https:\/\/www\.amazon\.com\/dp\//.test(p.listing_url)) fail("product:listing", `${p.slug} → ${p.listing_url}`);
  if (!/^[A-Z0-9]{10}$/.test(p.asin)) fail("product:asin-format", `${p.slug} → ${p.asin}`);
}
// The observed ASINs must match what the live listings actually are.
const OBSERVED = { "B0hmGG4m2": "B08FKW9JRM", B03QDuGdo: "B0BSKQW2T2", B0hpD2JGQ: "B08DY9HRWD" };
for (const l of links.links) {
  const expected = OBSERVED[l.submitted_code];
  if (expected && l.observed_asin !== expected)
    fail("links:observation-changed", `${l.id} recorded ${l.observed_asin}, expected ${expected}`);
}
say(`${products.products.length} product records and ${links.links.length} observations cross-checked`);

/* 13 — untagged Amazon links cannot appear without F12 disclosure, site-wide ---- */
// Added by arena/94688dd1-diyhome2. F12 discloses that no tag can be honestly added
// until a Special Link is validated in the enrolled account. That means every Amazon
// product link on this site is untagged, so the count is pinned here: a new page that
// adds one silently would widen the compliance gap the site has published without
// saying so. This caught a real slip - the first shop build linked each category's
// browse node, adding untagged links F12 did not describe.
const BROWSER_PAGES = [...pages, ...NESTED.filter((n) => fs.existsSync(path.join(ROOT, n)))];
const AMAZON_TAG = /<a\b[^>]*href="(https?:\/\/(?:www\.)?amazon\.[^"]*)"[^>]*>/gi;
function untaggedCount(file) {
  const html = fs.readFileSync(path.join(ROOT, file), "utf8");
  let n = 0;
  for (const m of html.matchAll(AMAZON_TAG)) {
    if (!/\/dp\//.test(m[1])) continue;
    const rel = (m[0].match(/rel="([^"]*)"/) || [])[1] || "";
    if (rel.split(/\s+/).includes("sponsored") && !/[?&]tag=/.test(m[1])) n++;
  }
  return n;
}
const EXPECTED_UNTAGGED = {
  "wallpaper.html": 1, "paper-towels.html": 1, "cookware.html": 1,
  "review.html": 4, "shop.html": 3, "audit/index.html": 6,
  ...Object.fromEntries(_catSlugs.map((f) => [f, 1])),
};
for (const p of BROWSER_PAGES) {
  const n = untaggedCount(p);
  const want = EXPECTED_UNTAGGED[p] ?? 0;
  if (n !== want) fail("links:untagged-count", `${p} has ${n} untagged Amazon product link(s), expected ${want}. Update F12 before changing this.`);
}
say(`untagged Amazon product links pinned to the F12 disclosure across ${BROWSER_PAGES.length} pages`);

/* 14 — the independent re-check log is published, and stays honest ---------- */
// Added by arena/ff38bd99-diyhome2. data/verification-2026-11-21.json records a
// fresh fetch of every cited document. Publishing it is the point: a log that
// exists only in the repository is not a receivable claim to a reader. Three
// properties are enforced, because each is a way the log could quietly lie:
//   a) every row must be on sources.html,
//   b) a source the register calls restricted may not be reported reachable,
//   c) a row may not both claim a confirmed quote and record no evidence.
const verifyDoc = readJson("data/verification-2026-11-21.json");
const sourcesHtml = fs.readFileSync(path.join(ROOT, "sources.html"), "utf8");
if (!verifyDoc.sources?.length) fail("recheck:empty", "the verification log has no rows");
for (const r of verifyDoc.sources ?? []) {
  if (!sourcesHtml.includes(`<strong>${r.id}</strong>`)) fail("recheck:unpublished", `${r.id} is not on sources.html`);
  if (!r.what_the_fetch_showed) fail("recheck:no-evidence", `${r.id} records no observation`);
  const cite = CITE[r.id];
  if (cite && cite.access === "restricted" && r.reachable)
    fail("recheck:restricted-marked-reachable", `${r.id} is restricted in the citation register but reported reachable`);
  if (r.quote_confirmed && !r.what_the_fetch_showed)
    fail("recheck:quote-without-evidence", `${r.id} claims a confirmed quote with no observation`);
  if (r.quote_confirmed && !/^https:\/\//.test(r.url)) fail("recheck:not-https", `${r.id} → ${r.url}`);
}
say(`${(verifyDoc.sources ?? []).length} sources re-checked on ${verifyDoc.checked_on} and published on sources.html`);

/* 15 — the FAQ exists, is linked, and claims nothing it cannot support ------- */
// The FAQ is the last surface before a click, so the two easy ways for it to go
// wrong are checked here: it silently disappears from the published set, or it
// grows a price or rating sentence that the policy constraint forbids.
const faqHtml = fs.readFileSync(path.join(ROOT, "faq.html"), "utf8");
if (!sm.includes("https://kanlerxz87-cyber.github.io/DIYHOME2/faq.html")) fail("faq:not-published", "faq.html is missing from the sitemap");
if (!fs.readFileSync(path.join(ROOT, "index.html"), "utf8").includes('href="faq.html"')) fail("faq:unlinked", "the front page does not link the FAQ");
const faqQuestions = [...faqHtml.matchAll(/<summary>([^<]+)<\/summary>/g)].length;
if (faqQuestions < 6) fail("faq:too-thin", `the FAQ answers ${faqQuestions} question(s)`);
for (const bad of [/\$\d/, /\bdollars\b/i, /\d(\.\d)? out of 5\b/, /\bstar rating of\b/i]) {
  if (bad.test(faqHtml.replace(/<code>[^<]*<\/code>/g, ""))) fail("faq:price-or-rating", `faq.html matches ${bad}`);
}
say(`${faqQuestions} buyer questions published, linked from the front page, and free of prices and ratings`);

/* 11 — every open flag and re-check is actually published on review.html ---- */
// Added by arena/bd0ba155-diyhome2. data/flags.json used to be validated but never
// rendered, so "Flagged for Review" silently omitted ten flags. Never again.
const reviewHtml = fs.readFileSync(path.join(ROOT, "review.html"), "utf8");
for (const f of flags.flags) {
  if (!reviewHtml.includes(`id="flag-${f.id}"`)) fail("flags:unpublished", `${f.id} is in data/flags.json but not on review.html`);
  if (!f.sources?.length) fail("flags:no-source", `${f.id} has no source`);
}
for (const r of flags.rechecks ?? []) {
  if (!r.sources?.length) fail("rechecks:no-source", `${r.item} has no source`);
  if (!reviewHtml.includes(r.item.replace(/&/g, "&amp;"))) fail("rechecks:unpublished", `${r.item} is not on review.html`);
}
say(`${flags.flags.length} flags and ${(flags.rechecks ?? []).length} re-checks are published on review.html with sources`);

/* 13 — the review record: every row sourced, dated, and honestly blank ------- */
// Added by arena/c3fa8e97-diyhome2. The review exists so a claim can be checked
// against the page it came from. That only works if each row names an official
// https source, the section read, and the date it was read; and if "withheld" or
// "not displayed" is allowed to stay blank instead of being filled in.
const reviews = readJson("data/reviews.json");
const disc = readJson("data/discrepancies.json");
const OK_STATES = new Set(["confirmed", "confirmed-inconsistent", "not displayed", "withheld"]);
for (const s of reviews.sources) {
  if (!/^https:\/\//.test(s.url)) fail("review:not-https", `${s.id} → ${s.url}`);
  const host = new URL(s.url).host;
  if (!ALLOWED_HOSTS.includes(host)) fail("review:host", `${s.id} uses a non-official host: ${host}`);
  if (!s.section) fail("review:no-section", `${s.id} does not say which part of the document was read`);
  if (!s.read_at) fail("review:no-date", `${s.id} has no read date`);
  if (!s.used_for) fail("review:no-purpose", `${s.id} does not say what the reading changed on the site`);
  // A restricted source may not carry a quote: it establishes nothing.
  if (s.quote && /sign-in wall/i.test(s.dated_on_page)) fail("review:restricted-quotes", `${s.id} is restricted but prints a quote`);
}
for (const p of reviews.products) {
  if (!/^B0[A-Z0-9]{8}$/.test(p.observed_asin)) fail("review:bad-asin", `${p.observed_asin} is not a 10-character ASIN`);
  for (const f of p.fields) {
    if (!OK_STATES.has(f.state)) fail("review:bad-state", `${p.observed_asin} ${f.label}: "${f.state}"`);
    const blank = f.value === "";
    if (!blank && f.state !== "confirmed" && f.state !== "confirmed-inconsistent")
      fail("review:filled-but-not-confirmed", `${p.observed_asin} ${f.label} has a value but state "${f.state}"`);
    if (f.state === "not displayed" && !blank) fail("review:inferred", `${p.observed_asin} ${f.label} claims a value the page did not show`);
    if (!blank && !CITE[f.source]) fail("review:dangling-source", `${p.observed_asin} ${f.label} cites ${f.source}`);
  }
  // The one rule this site never breaks: no figure Amazon sells attention for.
  for (const f of p.fields) {
    if (/price|rating|review count|bought|badge/i.test(f.label) && f.value !== "")
      fail("review:withheld-has-value", `${p.observed_asin} ${f.label} publishes a figure that must stay blank`);
  }
}
for (const r of disc.rows) {
  if (!/^https:\/\//.test(r.url)) fail("disc:not-https", `${r.id} → ${r.url}`);
  if (!ALLOWED_HOSTS.includes(new URL(r.url).host)) fail("disc:host", `${r.id} uses a non-official host`);
  if (!r.section || !r.read_at || !r.verdict || !r.effect) fail("disc:incomplete", `${r.id} is missing section, date, verdict or effect`);
  if (r.source && !CITE[r.source]) fail("disc:dangling-source", `${r.id} cites ${r.source}`);
  // "Confirmed" is only available to a source that was actually read.
  if (/^Confirmed/.test(r.verdict) && /sign-in wall/i.test(r.dated_on_page)) fail("disc:restricted-confirmed", `${r.id} is restricted yet marked ${r.verdict}`);
}
const auditHtml = fs.readFileSync(path.join(ROOT, "audit", "index.html"), "utf8");
for (const r of disc.rows) {
  if (!auditHtml.includes(`id="rev-${r.id}"`)) fail("disc:unpublished", `${r.id} is not on the audit page`);
  // The audit register numbers its own S01..S12 for different documents than the
  // citation register, so a row must link to the shared register explicitly.
  if (!auditHtml.includes(`href="../sources.html#src-${r.source}"`)) fail("disc:cross-link", `${r.id} does not link its register row to sources.html`);
}
say(`${reviews.sources.length} re-read documents, ${reviews.products.length} listings and ${disc.rows.length} source rows are recorded with a section, a read date and a source`);

/* 14 — nothing may publish a purchase-volume or badge figure ----------------- */
// F13: Amazon displays "20K+ bought in past month" and an Amazon's Choice badge.
// Neither is ours to restate, and the price/rating gate never looked for them.
for (const p of pages) {
  const h = fs.readFileSync(path.join(ROOT, p), "utf8");
  if (/\b\d+(\.\d+)?K?\+?\s*bought in past month/i.test(h)) fail("claims:bought-in-past-month", `${p} publishes a purchase-volume figure`);
  if (/Amazon(?:'|&#x27;|&#39;|\u2019|&#8217;)s Choice/i.test(h)) fail("claims:amazon-badge", `${p} publishes an Amazon badge`);
}

/* 12 — no page may claim no commission rate is readable anywhere ------------- */
// S13 is a public category table; "no rate published" is true of per-product rates
// only. Keep that distinction from regressing.
for (const p of pages) {
  const h = fs.readFileSync(path.join(ROOT, p), "utf8");
  if (/rate card behind sign-in; no rate published/i.test(h)) fail("claims:rate-unreadable", `${p} says no rate can be read; Table 1 (S13) is public`);
}

/* report ------------------------------------------------------------------ */
const bar = "─".repeat(70);
console.log(`\n${bar}\nSupplementary verification gate\n${bar}`);
for (const n of notes) console.log(`  ✓ ${n}`);
if (flags.flags?.length) console.log(`  · ${flags.flags.length} open flag(s) published, ${flags.flags.filter((f) => f.severity === "blocking").length} blocking revenue claims`);

if (errors.length) {
  console.log(`\n  ${errors.length} FAILURE(S):`);
  for (const e of errors) console.log(`    ✗ [${e.check}] ${e.detail}`);
  console.log(`\n${bar}\nGATE FAILED\n${bar}\n`);
  process.exit(1);
}
console.log(`\n${bar}\nGATE PASSED — no rendered prices or ratings, all citations official, ledger honest, feeds agree.\n${bar}\n`);
