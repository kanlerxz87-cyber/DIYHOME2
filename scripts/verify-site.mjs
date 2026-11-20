import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { BASE_URL, pages, sources } from '../src/content.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');
const OFFICIAL_HOSTS = new Set([
  'affiliate-program.amazon.com',
  'sell.amazon.com',
  'www.ftc.gov',
  'search.google.com',
  'developers.google.com',
  'docs.github.com',
  'www.rssboard.org'
]);
const REQUIRED_EVENTS = ['page_view', 'guide_view', 'outbound_click', 'product_link_click', 'reported_order'];

async function filesBelow(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const result = [];
  for (const entry of entries) {
    const fullPath = join(directory, entry.name);
    if (entry.isDirectory()) result.push(...await filesBelow(fullPath));
    else result.push(fullPath);
  }
  return result;
}

function canonicalFor(page) {
  if (page.canonicalPath !== undefined) return new URL(page.canonicalPath, BASE_URL).href;
  if (page.path === 'index.html') return BASE_URL;
  return new URL(page.path, BASE_URL).href;
}

const htmlFiles = (await filesBelow(DIST)).filter((file) => file.endsWith('.html'));
assert.equal(htmlFiles.length, pages.length + 1, 'Every manifest page plus the 404 page must be built.');

for (const page of pages) {
  const filePath = join(DIST, page.path);
  const html = await readFile(filePath, 'utf8');
  const headerAt = html.indexOf('<header class="masthead">');
  const disclosureAt = html.indexOf('class="disclosure-strip"');
  const mainAt = html.indexOf('<main ');
  const footerAt = html.indexOf('<footer class="site-footer">');
  assert.ok(headerAt >= 0 && headerAt < disclosureAt && disclosureAt < mainAt && mainAt < footerAt, `${page.path}: masthead, above-fold disclosure, main, and footer must appear in order.`);
  assert.ok((html.match(/As an Amazon Associate I earn from qualifying purchases\./g) || []).length >= 2, `${page.path}: exact Associates statement must appear in header disclosure and footer.`);
  assert.ok(html.includes(`href="${canonicalFor(page)}"`), `${page.path}: canonical URL is missing or incorrect.`);
  assert.ok(html.includes('href="') && html.includes('assets/site.css') && html.includes('assets/site.js'), `${page.path}: shared assets are missing.`);
  assert.equal((html.match(/rel="canonical"/g) || []).length, 1, `${page.path}: expected one canonical link.`);
}

const allHtml = await Promise.all(htmlFiles.map((file) => readFile(file, 'utf8')));
const combinedHtml = allHtml.join('\n');
const externalAnchors = [...combinedHtml.matchAll(/<a\b([^>]*href="(https:[^"]+)"[^>]*)>/g)];
for (const [, attributes, href] of externalAnchors) {
  const url = new URL(href);
  assert.ok(OFFICIAL_HOSTS.has(url.hostname), `Unexpected external source host: ${url.hostname}`);
  assert.match(attributes, /target="_blank"/, `External reference should open in a new tab: ${href}`);
  assert.match(attributes, /rel="[^"]*noopener[^"]*"/, `External reference needs noopener: ${href}`);
}

const productAnchors = [...combinedHtml.matchAll(/<a\b([^>]*data-product-link="true"[^>]*)>/g)];
for (const [, attributes] of productAnchors) {
  assert.match(attributes, /rel="[^"]*sponsored[^"]*"/, 'Every activated outbound product link must include rel="sponsored".');
  assert.match(attributes, /rel="[^"]*nofollow[^"]*"/, 'Every activated outbound product link must include rel="nofollow".');
  assert.match(attributes, /data-analytics-key="product_[a-zA-Z0-9_-]+"/, 'Every product link must use a non-URL analytics key.');
}
assert.equal(productAnchors.length, 0, 'No product links may be activated before the link and listing gate passes.');
const anchorTags = combinedHtml.match(/<a[^>]*>/g) || [];
assert.equal(anchorTags.some((tag) => tag.includes('href="https://link.amazon/')), false, 'Submitted short links must be shown as plain text, not active outbound anchors.');

for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  const tableBlocks = [...html.matchAll(/<table\b[^>]*data-source-required="true"[^>]*>[\s\S]*?<\/table>/g)];
  for (const [table] of tableBlocks) {
    const rows = [...table.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/g)].slice(1);
    for (const [row] of rows) {
      assert.match(row, /class="source-ref"[\s\S]*?href="https:\/\//, `Every sourced data row needs an official reference in ${relative(DIST, file)}.`);
      const sourceUrl = row.match(/class="source-ref"[\s\S]*?href="(https:[^"]+)"/)?.[1];
      assert.ok(sourceUrl, `Missing source URL in ${relative(DIST, file)}.`);
      assert.ok(OFFICIAL_HOSTS.has(new URL(sourceUrl).hostname), `Non-official source in ${relative(DIST, file)}: ${sourceUrl}`);
    }
  }
}

const productIntent = JSON.parse(await readFile(join(DIST, 'data', 'product-intent.json'), 'utf8'));
assert.equal(productIntent.records.length, 4, 'All four user-supplied link submissions must be retained.');
assert.equal(productIntent.records[1].submittedUrl, productIntent.records[2].submittedUrl, 'The repeated URL must remain as two records.');
for (const record of productIntent.records) {
  assert.equal(record.status, 'unverified');
  for (const field of ['intendedAsin', 'officialListingUrl', 'confirmationDate', 'source', 'observedRedirectTarget']) {
    assert.equal(record[field], '', `${record.submissionId}: ${field} must remain blank until independently verified.`);
  }
}
assert.equal(productIntent.trackingId.value, 'shopnow047c-20');
assert.equal(productIntent.trackingId.verified, false);

const eventSchema = JSON.parse(await readFile(join(DIST, 'data', 'event-schema.json'), 'utf8'));
assert.deepEqual(eventSchema.events.map((event) => event.name), REQUIRED_EVENTS, 'The analytics schema must define exactly the five published event types.');
assert.ok(eventSchema.notPersistedByApplication.includes('IP address'));
assert.ok(eventSchema.notPersistedByApplication.includes('query string'));

const campaignCsv = await readFile(join(DIST, 'data', 'campaign-ledger.csv'), 'utf8');
const campaignRows = campaignCsv.trimEnd().split('\n');
assert.equal(campaignRows.length, 1, 'The campaign ledger must remain empty until a report is obtained.');
assert.match(campaignRows[0], /report_timestamp_utc,source,channel,eligible_sessions,clicks,reported_orders,source_reference,provenance_note/);

const sitemap = await readFile(join(DIST, 'sitemap.xml'), 'utf8');
for (const page of pages) assert.ok(sitemap.includes(`<loc>${canonicalFor(page)}</loc>`), `Sitemap missing ${page.path}.`);
assert.equal((sitemap.match(/<url>/g) || []).length, pages.length);

const feed = await readFile(join(DIST, 'feed.xml'), 'utf8');
const guides = pages.filter((page) => page.type === 'guide');
assert.equal((feed.match(/<item>/g) || []).length, guides.length, 'RSS must include every guide.');
for (const guide of guides) assert.ok(feed.includes(canonicalFor(guide)), `RSS feed missing ${guide.path}.`);
assert.ok(feed.includes('Basket or oven-style air fryer'));

const robots = await readFile(join(DIST, 'robots.txt'), 'utf8');
assert.ok(robots.includes(new URL('sitemap.xml', BASE_URL).href));
for (const sourceUrl of Object.values(sources)) assert.ok(new URL(sourceUrl).protocol === 'https:');

const sourceRequiredTables = combinedHtml.match(/data-source-required="true"/g) || [];
assert.ok(sourceRequiredTables.length >= 4, 'Expected source-linked requirements, research, product, and review tables.');

for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  const hrefs = [...html.matchAll(/\b(?:href|src)="([^"]+)"/g)].map((match) => match[1]);
  for (const href of hrefs) {
    if (/^(?:https?:|mailto:|tel:|data:|javascript:|#)/i.test(href)) continue;
    const clean = href.split(/[?#]/, 1)[0];
    if (!clean) continue;
    const fromDirectory = dirname(file);
    let target = resolve(fromDirectory, clean);
    try {
      const targetStat = await stat(target);
      if (targetStat.isDirectory()) target = join(target, 'index.html');
      await stat(target);
    } catch {
      assert.fail(`Broken internal link in ${relative(DIST, file)}: ${href}`);
    }
  }
}

console.log(`Verified ${pages.length} publication pages, ${guides.length} guides, sitemap, RSS, source-linked tables, and blank-first product records.`);
