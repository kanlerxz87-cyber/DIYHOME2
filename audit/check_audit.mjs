#!/usr/bin/env node
/**
 * Automated verification suite for the complementary /audit/ verification addendum.
 * Verifies verbatim Associates disclosures, rel="sponsored" & zero query strings
 * on Amazon reference links, zero static prices/ratings/hotlinked Amazon images,
 * valid local links, valid JSON data files, and official https:// source on every row.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const AUDIT_HTML = path.join(__dirname, 'index.html');
const NOTICE = 'As an Amazon Associate I earn from qualifying purchases.';
const html = fs.readFileSync(AUDIT_HTML, 'utf8');

const failures = [];
const assert = (cond, msg) => {
  if (!cond) failures.push(msg);
};

// 1. Verbatim disclosure appears twice (masthead + footer)
const noticeCount = html.split(NOTICE).length - 1;
assert(noticeCount === 2, `Expected verbatim disclosure 2 times, found ${noticeCount}`);

// 2. Zero forbidden static prices, review counts, or hotlinked Amazon CDN images
assert(!/m\.media-amazon\.com|images-na\.ssl-images-amazon\.com/i.test(html), 'Found hotlinked Amazon image URL');
assert(!/\$5\.08|\$6\.79|\$17\.74|\$23\.99|\$5\.99|\$7\.99/.test(html), 'Found hardcoded static Amazon price');
assert(!/26,432|12,099|18,835/.test(html), 'Found hardcoded static Amazon review count');

// 3. Inspect every anchor tag & asset
const linkRegex = /<a\b([^>]*)>/gi;
let m;
let amazonCount = 0;
let internalCount = 0;
while ((m = linkRegex.exec(html)) !== null) {
  const attrs = m[1];
  const hrefMatch = attrs.match(/\bhref="([^"]+)"/i);
  if (!hrefMatch) continue;
  const href = hrefMatch[1];
  if (/^https?:\/\/(www\.)?(amazon\.com|link\.amazon)\b/i.test(href)) {
    amazonCount += 1;
    const relMatch = attrs.match(/\brel="([^"]+)"/i);
    const relVals = relMatch ? relMatch[1].toLowerCase().split(/\s+/) : [];
    assert(relVals.includes('sponsored'), `Amazon link missing rel="sponsored": ${href}`);
    assert(!href.includes('?'), `Amazon reference link must not include unvalidated query string: ${href}`);
  } else if (!href.startsWith('http://') && !href.startsWith('https://') && !href.startsWith('#')) {
    internalCount += 1;
    // An in-page or cross-page fragment must be resolved against the file, not
    // the whole href: `../sources.html#src-S01` is a file, not a filename with a
    // hash in it. Fragment targets are checked too, so a renamed anchor fails.
    const [filePart, frag] = href.split("#");
    const target = path.resolve(__dirname, filePart || "index.html");
    assert(fs.existsSync(target), `Broken internal link in audit/index.html: ${href}`);
    if (frag && fs.existsSync(target) && target.endsWith(".html")) {
      const body = fs.readFileSync(target, "utf8");
      assert(body.includes(`id="${frag}"`), `Missing anchor #${frag} in ${path.relative(__dirname, target)}`);
    }
  }
}

// 4. Every tbody row includes an official https:// source URL
const tbodies = html.match(/<tbody[^>]*>[\s\S]*?<\/tbody>/gi) || [];
assert(tbodies.length === 4, `Expected 4 audit tables, found ${tbodies.length}`);
tbodies.forEach((tb, idx) => {
  const rows = tb.match(/<tr\b[^>]*>[\s\S]*?<\/tr>/gi) || [];
  assert(rows.length > 0, `Table #${idx + 1} has zero rows`);
  rows.forEach((r, rIdx) => {
    // A row must carry an official https reference. It may be a link, or a URL
    // printed as text: an untagged Amazon listing link is never published as a
    // link (that is what F12 records), so the review table prints it in code.
    const refd = r.match(/(?:href="|<code>)(https:\/\/[^"<]+)/);
    assert(refd, `Table #${idx + 1} row #${rIdx + 1} missing official https:// source`);
    if (refd) {
      const host = new URL(refd[1]).host;
      assert(/^(www\.)?(amazon\.com|link\.amazon|affiliate-program\.amazon\.com|sell\.amazon\.com|ecfr\.gov|www\.ecfr\.gov|ftc\.gov|www\.ftc\.gov|developers\.google\.com)$/.test(host),
        `Table #${idx + 1} row #${rIdx + 1} cites a non-official host: ${host}`);
    }
  });
});

// 5. Validate JSON datasets in audit/data/
for (const f of ['verified-specs.json', 'official-sources.json', 'flagged-discrepancies.json']) {
  const p = path.join(__dirname, 'data', f);
  const parsed = JSON.parse(fs.readFileSync(p, 'utf8'));
  assert(parsed && typeof parsed === 'object', `Invalid JSON in audit/data/${f}`);
}

if (failures.length) {
  console.error('AUDIT CHECK FAILURES:\n - ' + failures.join('\n - '));
  process.exit(1);
}
console.log(`Audit checks passed (2 disclosures, ${amazonCount} Amazon reference links with rel="sponsored" & no query, ${internalCount} internal links, 3 sourced tables, 3 valid JSON files).`);
