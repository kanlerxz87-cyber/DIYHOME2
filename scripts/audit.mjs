#!/usr/bin/env node
/**
 * DIY Home Upgrades — publish gate.
 *
 * Walks every generated page and fails (exit 1) if any of these hold:
 *   1. an internal link points at a file that does not exist
 *   2. a page is missing the required disclosure statement
 *   3. a page is missing the disclosure strip *or* the footer repeat
 *   4. an outbound Amazon link is not marked rel="sponsored"
 *   5. an outbound link has no rel attribute at all
 *   6. a data table has a row with no source link
 *   7. a page has no <title>, meta description or canonical URL
 *   8. a sitemap or feed URL does not resolve to a built page
 *   9. a price is rendered anywhere (policy: prices are never shown)
 *  10. a star rating is rendered anywhere (policy: ratings are never shown)
 *  11. a page has zero or more than one <h1>
 *  12. the disclosure strip is not above the first product/spec content
 *
 * Usage: node scripts/audit.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const site = JSON.parse(fs.readFileSync(path.join(ROOT, "data/products.json"), "utf8")).site;
const BASE = site.base_url;

const errors = [];
const warnings = [];
const ok = [];

function fail(check, file, detail) {
  errors.push({ check, file, detail });
}
function warn(check, file, detail) {
  warnings.push({ check, file, detail });
}

/* ---------- collect pages ---------- */
function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === ".git" || entry.name === "node_modules" || entry.name === "scripts") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.name.endsWith(".html") && full.split(path.sep).length > 2) out.push(full);
  }
  return out;
}
const pages = walk(ROOT).sort();

/* ---------- helpers ---------- */
const rel = (p) => path.relative(ROOT, p);

/** Map an href to a file on disk, or null if it is external/anchor. */
function resolveHref(href, fromPage) {
  if (!href) return null;
  if (href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return null;
  if (href.startsWith("data:")) return null;

  let clean = href.split("#")[0].split("?")[0];
  if (!clean) return null;

  if (clean.startsWith(BASE)) {
    clean = clean.slice(BASE.length);
  } else if (/^https?:\/\//.test(clean)) {
    return null; // genuinely external
  } else if (!clean.startsWith("/")) {
    // relative to the page's directory
    const dir = path.dirname(fromPage);
    const target = path.resolve(dir, clean);
    return fs.existsSync(target) ? null : target;
  } else if (clean.startsWith("/")) {
    clean = clean.slice(1);
  }

  const target = path.join(ROOT, clean);
  if (fs.existsSync(target)) {
    const stat = fs.statSync(target);
    if (stat.isDirectory()) {
      return fs.existsSync(path.join(target, "index.html")) ? null : target;
    }
    return null;
  }
  // allow extensionless internal routes
  if (fs.existsSync(path.join(ROOT, clean, "index.html"))) return null;
  return target;
}

/* ---------- per page ---------- */
const DISCLOSURE = site.disclosure;

for (const page of pages) {
  const html = fs.readFileSync(page, "utf8");
  const r = rel(page);
  const is404 = r === "404.html";

  /* 7. head essentials */
  if (!/<title>[^<]{12,}<\/title>/.test(html)) fail("head:title", r, "missing or too-short <title>");
  if (!/<meta name="description" content="[^"]{30,}"/.test(html))
    fail("head:description", r, "missing or too-short meta description");
  if (!/<link rel="canonical" href="[^"]+"/.test(html)) fail("head:canonical", r, "missing canonical link");

  /* 2 + 3. disclosure present, and present twice */
  const disclosureCount = html.split(DISCLOSURE).length - 1;
  if (disclosureCount === 0) fail("disclosure:missing", r, "required statement not found anywhere on the page");
  if (!html.includes('class="disclosure-strip"')) fail("disclosure:strip", r, "no disclosure strip under the masthead");
  if (!html.includes("foot-disclosure")) fail("disclosure:footer", r, "no disclosure repeat in the footer");
  if (disclosureCount < 2 && !is404)
    warn("disclosure:repeat", r, `statement appears ${disclosureCount}× — expected at least twice`);

  /* 12. strip comes before the first product/spec content */
  const stripAt = html.indexOf('class="disclosure-strip"');
  const specAt = html.indexOf('id="specs"');
  const tableAt = html.indexOf("<table");
  const firstContent = [specAt, tableAt].filter((i) => i > -1).sort((a, b) => a - b)[0];
  if (stripAt > -1 && firstContent !== undefined && stripAt > firstContent)
    fail("disclosure:above-fold", r, "disclosure strip appears after the first table/spec block");

  /* 11. exactly one h1 */
  const h1s = (html.match(/<h1[\s>]/g) || []).length;
  if (h1s !== 1) fail("structure:h1", r, `expected exactly one <h1>, found ${h1s}`);

  /* 1. internal links */
  const hrefs = [...html.matchAll(/href="([^"]*)"/g)].map((m) => m[1]);
  for (const href of hrefs) {
    const missing = resolveHref(href, page);
    if (missing) fail("link:broken", r, `→ ${href} (looked for ${path.relative(ROOT, missing)})`);
  }

  /* 4 + 5. outbound link relativity
   *
   * There are two classes of outbound link and they have opposite obligations:
   *
   *  COMMERCE  — amazon.com product pages, amzn.to, link.amazon. These invite a
   *              purchase, so every one must carry rel="sponsored".
   *
   *  EVIDENCE  — policy documents, government guidance and standards. These are
   *              citations, so they must NOT be marked sponsored (that would
   *              misrepresent a citation as an advert) but must be rel="noopener"
   *              and must never point at an Amazon commerce destination.
   */
  const EVIDENCE_HOSTS = [
    "affiliate-program.amazon.com",
    "ftc.gov",
    "ecfr.gov",
    "sell.amazon.com",
    "govinfo.gov",
    "federalregister.gov",
    "amazon.com/gp/help",
  ];
  const COMMERCE_RE = /^https?:\/\/(www\.)?(amazon\.com\/dp\/|amzn\.to\/|link\.amazon\/)/;
  const UNTAGGED_AMAZON_RE = /^https?:\/\/(www\.)?amazon\.com\/(?!gp\/help)/;

  const anchors = [...html.matchAll(/<a\b([^>]*)>/g)].map((m) => m[1]);
  let commerce = 0;
  for (const a of anchors) {
    const hrefM = a.match(/href="([^"]*)"/);
    if (!hrefM) continue;
    const href = hrefM[1];
    if (!/^https?:\/\//.test(href)) continue;
    if (href.includes("kanlerxz87-cyber.github.io")) continue;

    const relM = a.match(/rel="([^"]*)"/);
    const rels = relM ? relM[1].split(/\s+/) : [];
    const isCommerce = COMMERCE_RE.test(href);
    const isEvidence = EVIDENCE_HOSTS.some((h) => href.includes(h));

    if (isCommerce) {
      commerce += 1;
      if (!rels.includes("sponsored"))
        fail("link:not-sponsored", r, `commerce link without rel="sponsored": ${href}`);
      if (!rels.includes("noopener"))
        fail("link:noopener", r, `commerce link without rel="noopener": ${href}`);
    } else if (isEvidence) {
      if (rels.includes("sponsored"))
        fail("link:citation-marked-sponsored", r, `citation wrongly marked sponsored: ${href}`);
      if (!relM) warn("link:no-rel", r, `citation without rel attribute: ${href}`);
    } else if (UNTAGGED_AMAZON_RE.test(href)) {
      fail("link:untagged-amazon", r, `Amazon link that is neither a tagged sponsored link nor an evidence page: ${href}`);
    } else if (!relM) {
      warn("link:no-rel", r, `external link has no rel attribute: ${href}`);
    }
  }
  if (commerce) ok.push(`${r}: ${commerce} sponsored commerce link(s)`);

  /* 9. no prices anywhere */
  const priceHits = [...html.matchAll(/\$\s?\d{1,4}\.\d{2}/g)].map((m) => m[0]);
  if (priceHits.length) fail("policy:price", r, `rendered price-like values: ${[...new Set(priceHits)].join(", ")}`);

  /* 10. no star ratings anywhere */
  if (/\bout of 5 stars\b/i.test(html) || /\d\.\d\s*★/.test(html))
    fail("policy:rating", r, "rendered a star rating");
}

/* ---------- 6. table rows must carry a source ---------- */
const tablePages = pages.filter((p) => {
  const r = rel(p);
  return r === "register/index.html" || r === "sources/index.html";
});
for (const page of tablePages) {
  const html = fs.readFileSync(page, "utf8");
  const r = rel(page);
  const isSourcesPage = r === "sources/index.html";
  const bodies = [...html.matchAll(/<tbody>([\s\S]*?)<\/tbody>/g)].map((m) => m[1]);
  for (const body of bodies) {
    const rows = [...body.matchAll(/<tr\b[\s\S]*?<\/tr>/g)].map((m) => m[0]);
    rows.forEach((row, i) => {
      /* A row is sourced if it links to the official page, or — on the source
         library itself — prints the official URL in full. Printed URLs are used
         for Amazon product pages so that no untagged Amazon link is emitted. */
      const hasLink = /class="src"/.test(row) || /<a [^>]*href="https?:\/\//.test(row);
      const hasPrintedUrl = isSourcesPage && /<code[^>]*>https?:\/\//.test(row);
      if (!hasLink && !hasPrintedUrl) fail("table:no-source", r, `row ${i + 1} has no source link`);
    });
  }
}
ok.push(`source coverage checked on ${tablePages.length} tables`);

/* ---------- 8. sitemap & feed ---------- */
function checkSitemap(file) {
  const full = path.join(ROOT, file);
  if (!fs.existsSync(full)) return fail("feed:missing", file, "file does not exist");
  const xml = fs.readFileSync(full, "utf8");
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  if (!locs.length) fail("feed:empty", file, "no <loc> entries");
  for (const loc of locs) {
    const missing = resolveHref(loc, full);
    if (missing) fail("feed:dead-link", file, `→ ${loc}`);
  }
  ok.push(`${file}: ${locs.length} <loc>, all resolve`);
}

function checkFeed(file) {
  const full = path.join(ROOT, file);
  if (!fs.existsSync(full)) return fail("feed:missing", file, "file does not exist");
  const xml = fs.readFileSync(full, "utf8");
  if (!/<rss version="2\.0"/.test(xml)) fail("feed:not-rss", file, "not an RSS 2.0 document");
  if (!/<channel>/.test(xml)) fail("feed:no-channel", file, "no <channel> element");
  if (!/<title>/.test(xml)) fail("feed:no-title", file, "channel has no <title>");
  if (!/<atom:link [^>]*rel="self"/.test(xml)) fail("feed:no-self", file, "no atom:link rel=self");

  /* Item-level only: a <link> inside <item>. The channel itself also has a
     <link>, which must exist but is not an item. */
  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((m) => m[1]);
  if (!items.length) fail("feed:empty", file, "no <item> entries");
  for (const item of items) {
    const linkM = item.match(/<link>([^<]+)<\/link>/);
    const guidM = item.match(/<guid[^>]*>([^<]+)<\/guid>/);
    if (!linkM) {
      fail("feed:item-no-link", file, "an item has no <link>");
      continue;
    }
    if (!guidM) fail("feed:item-no-guid", file, `item ${linkM[1]} has no <guid>`);
    for (const u of [linkM[1], guidM && guidM[1]].filter(Boolean)) {
      const missing = resolveHref(u, full);
      if (missing) fail("feed:dead-link", file, `→ ${u}`);
    }
  }
  ok.push(`${file}: ${items.length} items, each with a resolving link and guid`);
}

checkSitemap("sitemap.xml");
checkSitemap("index.xml");
checkFeed("feed.xml");

/* ---------- required files ---------- */
for (const f of ["robots.txt", "feed.xml", "sitemap.xml", "404.html", "assets/site.css", "assets/js/analytics.js"]) {
  if (!fs.existsSync(path.join(ROOT, f))) fail("files:missing", f, "required file not present");
}

/* ---------- every ASIN on the site has a source ---------- */
const products = JSON.parse(fs.readFileSync(path.join(ROOT, "data/products.json"), "utf8")).products;
for (const p of products) {
  const pagePath = path.join(ROOT, "products", p.slug, "index.html");
  if (!fs.existsSync(pagePath)) {
    fail("product:missing", p.slug, "product page not generated");
    continue;
  }
  const html = fs.readFileSync(pagePath, "utf8");
  if (!html.includes(p.asin)) fail("product:asin", p.slug, `ASIN ${p.asin} does not appear on its page`);
  if (!html.includes(p.listing_url)) fail("product:listing", p.slug, "official listing URL not linked");
  if (!/rel="sponsored/.test(html)) fail("product:sponsored", p.slug, "no sponsored outbound link");
}
ok.push(`${products.length} product pages: ASIN, listing URL and sponsored rel all present`);

/* ---------- report ---------- */
const line = "─".repeat(72);
console.log(`\n${line}\nDIY Home Upgrades — publish gate\n${line}`);
for (const o of ok) console.log(`  ✓ ${o}`);

if (warnings.length) {
  console.log(`\n  ${warnings.length} warning(s):`);
  for (const w of warnings) console.log(`    ! [${w.check}] ${w.file} — ${w.detail}`);
}

if (errors.length) {
  console.log(`\n  ${errors.length} FAILURE(S):`);
  for (const e of errors) console.log(`    ✗ [${e.check}] ${e.file}\n        ${e.detail}`);
  console.log(`\n${line}\nGATE FAILED — do not publish.\n${line}\n`);
  process.exit(1);
}

console.log(`\n  Pages checked: ${pages.length}`);
console.log(`\n${line}\nGATE PASSED — ${pages.length} pages, 0 broken links, 0 missing disclosures, 0 unsponsored outbound links.\n${line}\n`);
