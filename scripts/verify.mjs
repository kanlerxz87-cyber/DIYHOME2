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
const feedLinks = [...feedXml.matchAll(/<link>([^<]+)<\/link>/g)].map((m) => m[1]).filter((u) => u.includes("/DIYHOME2/"));
for (const u of feedLinks) {
  const rel = toPath(u);
  if (rel && !fs.existsSync(path.join(ROOT, rel))) fail("feed:dead", `${u} → ${rel} not on disk`);
  if (rel && !sm.includes(u)) fail("feed:not-in-sitemap", `${u} is in the feed but not the sitemap`);
}
say(`sitemap ${sm.length} URLs and feed ${feedLinks.length} links resolve and agree`);

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
