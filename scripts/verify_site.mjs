#!/usr/bin/env node
/**
 * DIYHOME2 Automated Compliance Gate & Site Verification Suite
 * Exits non-zero if any disclosure, rel="sponsored", API policy gate,
 * data separation rule, feed/sitemap check, or internal link fails.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const BASE_URL = 'https://kanlerxz87-cyber.github.io/DIYHOME2/';
const VERBATIM_DISCLOSURE = 'As an Amazon Associate I earn from qualifying purchases.';

const errors = [];
const passed = [];

function ok(msg) {
  passed.push(msg);
}

function fail(msg) {
  errors.push(msg);
}

function collectHtmlFiles(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...collectHtmlFiles(full));
    } else if (entry.name.endsWith('.html')) {
      out.push(path.relative(ROOT, full));
    }
  }
  return out.sort();
}

const htmlFiles = collectHtmlFiles(ROOT);
if (htmlFiles.length < 10) {
  fail(`Expected at least 10 HTML pages, found ${htmlFiles.length}`);
} else {
  ok(`Found ${htmlFiles.length} static HTML pages to audit`);
}

// Disallowed static scraped Amazon prices/review counts & image hosts
const FORBIDDEN_PATTERNS = [
  { re: /m\.media-amazon\.com/i, reason: 'Hotlinked Amazon product image URL (violates Amazon IP license)' },
  { re: /images-na\.ssl-images-amazon\.com/i, reason: 'Hotlinked Amazon image CDN URL' },
  { re: /\$5\.08|\$6\.79|\$17\.74|\$23\.99|\$5\.99|\$7\.99/, reason: 'Hardcoded static Amazon price (violates Creators API / S02 policy)' },
  { re: /26,432|12,099|18,835/, reason: 'Hardcoded static Amazon review count (violates S02 clause t)' }
];

let totalInternalLinksChecked = 0;
let totalAmazonLinksChecked = 0;

for (const relPath of htmlFiles) {
  const fullPath = path.join(ROOT, relPath);
  const html = fs.readFileSync(fullPath, 'utf8');

  // 1. Verbatim disclosure in masthead and footer
  const mastheadMatch = html.match(/data-disclosure-placement="masthead"[\s\S]*?<\/div>/);
  const footerMatch = html.match(/data-disclosure-placement="footer"[\s\S]*?<\/div>/);
  if (!mastheadMatch || !mastheadMatch[0].includes(VERBATIM_DISCLOSURE)) {
    fail(`${relPath}: Missing verbatim Associates disclosure in above-the-fold masthead strip`);
  }
  if (!footerMatch || !footerMatch[0].includes(VERBATIM_DISCLOSURE)) {
    fail(`${relPath}: Missing verbatim Associates disclosure in footer`);
  }

  // 2. Canonical, RSS alternate, analytics script
  if (!html.includes('<link rel="canonical" href="https://kanlerxz87-cyber.github.io/DIYHOME2/')) {
    fail(`${relPath}: Missing canonical link pointing to GitHub Pages root`);
  }
  if (!html.includes('type="application/rss+xml"')) {
    fail(`${relPath}: Missing RSS feed autodiscovery link`);
  }
  if (!html.includes('assets/js/analytics.js')) {
    fail(`${relPath}: Missing privacy-preserving analytics.js script`);
  }

  // 3. Forbidden static Amazon data or hotlinked images
  for (const fp of FORBIDDEN_PATTERNS) {
    if (fp.re.test(html)) {
      fail(`${relPath}: ${fp.reason}`);
    }
  }

  // 4. Inspect every anchor tag
  const anchorRegex = /<a\b([^>]*)>/gi;
  let m;
  while ((m = anchorRegex.exec(html)) !== null) {
    const attrs = m[1];
    const hrefMatch = attrs.match(/\bhref="([^"]+)"/i);
    if (!hrefMatch) continue;
    const href = hrefMatch[1];

    // External Amazon link checks
    if (/^https?:\/\/(www\.)?(amazon\.com|link\.amazon)\b/i.test(href)) {
      totalAmazonLinksChecked += 1;
      const relMatch = attrs.match(/\brel="([^"]+)"/i);
      const relVals = relMatch ? relMatch[1].toLowerCase().split(/\s+/) : [];
      if (!relVals.includes('sponsored')) {
        fail(`${relPath}: Amazon outbound link missing rel="sponsored" -> ${href}`);
      }
      if (!/\btarget="_blank"/i.test(attrs)) {
        fail(`${relPath}: Amazon outbound link missing target="_blank" -> ${href}`);
      }
      continue;
    }

    // Internal relative link checks
    if (!href.startsWith('http://') && !href.startsWith('https://') && !href.startsWith('mailto:') && !href.startsWith('#')) {
      totalInternalLinksChecked += 1;
      const cleanHref = href.split('#')[0].split('?')[0];
      if (!cleanHref) continue;
      const resolved = path.resolve(path.dirname(fullPath), cleanHref);
      if (!fs.existsSync(resolved)) {
        fail(`${relPath}: Broken internal link -> ${href}`);
      }
    }
  }

  // 5. Inspect every <img src> and <script src> and <link rel="stylesheet" href>
  const assetRegex = /<(?:img|script)\b[^>]*\bsrc="([^"]+)"/gi;
  while ((m = assetRegex.exec(html)) !== null) {
    const src = m[1];
    if (src.startsWith('http://') || src.startsWith('https://')) continue;
    const resolved = path.resolve(path.dirname(fullPath), src.split('?')[0]);
    if (!fs.existsSync(resolved)) {
      fail(`${relPath}: Broken local asset src -> ${src}`);
    }
  }

  // 6. On dashboard/audit tables, ensure every tbody row has an official https:// source link
  if (['summary.html', 'dashboard.html', 'compliance.html', 'flagged.html'].includes(relPath)) {
    const tbodies = html.match(/<tbody[^>]*>[\s\S]*?<\/tbody>/gi) || [];
    tbodies.forEach((tb, tbIdx) => {
      const rows = tb.match(/<tr\b[^>]*>[\s\S]*?<\/tr>/gi) || [];
      rows.forEach((row, rIdx) => {
        if (!/href="https:\/\//i.test(row)) {
          fail(`${relPath} table #${tbIdx + 1} row #${rIdx + 1}: Missing official https:// source link`);
        }
      });
    });
  }
}

ok(`Checked ${totalAmazonLinksChecked} outbound Amazon links for rel="sponsored" and target="_blank"`);
ok(`Checked ${totalInternalLinksChecked} internal links across all HTML pages`);

// 7. Data governance checks
const products = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/products.json'), 'utf8'));
for (const p of products.products) {
  if (!p.product_intent_confirmation || !p.observed_redirect_target) {
    fail(`data/products.json ${p.product_id}: Missing separated intent vs. observed redirect objects`);
  }
  if (p.product_intent_confirmation.intended_asin && p.product_intent_confirmation.intended_asin === p.observed_redirect_target.observed_asin && !p.product_intent_confirmation.confirmation_date) {
    fail(`data/products.json ${p.product_id}: intended_asin merged with observed_asin without confirmation_date`);
  }
  if (p.creators_api_gated_fields.live_price !== '' || p.creators_api_gated_fields.customer_star_rating !== '') {
    fail(`data/products.json ${p.product_id}: Creators API gated fields must remain empty until API enrollment`);
  }
}
ok('Verified strict separation of product_intent_confirmation vs. observed_redirect_target in data/products.json');

const ledger = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/campaign-ledger.json'), 'utf8'));
if (!Array.isArray(ledger.entries) || ledger.entries.length !== 0) {
  fail('data/campaign-ledger.json: Initial campaign ledger must start empty until authorized first-party reports arrive');
} else {
  ok('Verified data/campaign-ledger.json starts empty with strict provenance schema');
}

// 8. Sitemap, RSS feed, and robots.txt checks
const sitemap = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
const feed = fs.readFileSync(path.join(ROOT, 'feed.xml'), 'utf8');
const editorial = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/editorial-plan.json'), 'utf8'));

for (const g of editorial.published_guides) {
  const fullUrl = BASE_URL + g.url;
  if (!sitemap.includes(`<loc>${fullUrl}</loc>`)) {
    fail(`sitemap.xml: Missing published guide ${fullUrl}`);
  }
  if (!feed.includes(`<link>${fullUrl}</link>`)) {
    fail(`feed.xml: Missing published guide ${fullUrl}`);
  }
}

const locMatches = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)];
for (const lm of locMatches) {
  const url = lm[1];
  if (!url.startsWith(BASE_URL)) {
    fail(`sitemap.xml: Non-canonical base URL ${url}`);
    continue;
  }
  const rel = url === BASE_URL ? 'index.html' : url.slice(BASE_URL.length);
  if (!fs.existsSync(path.join(ROOT, rel))) {
    fail(`sitemap.xml: Points to missing file ${rel}`);
  }
}
ok(`Verified sitemap.xml (${locMatches.length} URLs) and feed.xml (${editorial.published_guides.length} guides)`);

if (!fs.existsSync(path.join(ROOT, '.nojekyll')) || !fs.existsSync(path.join(ROOT, 'robots.txt'))) {
  fail('Missing .nojekyll or robots.txt for GitHub Pages deployment');
} else {
  ok('Verified .nojekyll and robots.txt present');
}

console.log('\n=== DIYHOME2 Compliance Gate Report ===');
for (const p of passed) console.log(`  [PASS] ${p}`);
if (errors.length) {
  console.error('\n=== FAILURES ===');
  for (const e of errors) console.error(`  [FAIL] ${e}`);
  process.exit(1);
}
console.log(`\nALL ${passed.length} COMPLIANCE & VERIFICATION CHECKS PASSED (0 errors).\n`);
