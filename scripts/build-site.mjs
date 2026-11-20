import { copyFile, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { BASE_URL, pages } from '../src/content.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUTPUT = join(ROOT, 'dist');
const DATA_DIR = join(ROOT, 'data');
const ASSET_DIR = join(ROOT, 'src', 'assets');

const escapeHtml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#39;');

const escapeXml = (value) => escapeHtml(value).replaceAll('&#39;', '&apos;');

function pagePrefix(pagePath) {
  const depth = dirname(pagePath) === '.' ? 0 : dirname(pagePath).split(sep).length;
  return depth === 0 ? './' : '../'.repeat(depth);
}

function canonicalFor(page) {
  if (page.canonicalPath !== undefined) return new URL(page.canonicalPath, BASE_URL).href;
  if (page.path === 'index.html') return BASE_URL;
  return new URL(page.path, BASE_URL).href;
}

const navigation = [
  ['Front page', 'index.html'],
  ['Executive summary', 'executive-summary.html'],
  ['Shop the shortlist', 'shop.html'],
  ['Buying guides', 'guides/'],
  ['Seasonal file', 'seasonal/winter-2026-27.html'],
  ['Research desk', 'research.html'],
  ['RSS feed', 'feed.xml'],
  ['Requirements register', 'requirements.html'],
  ['Measurement', 'measurement.html'],
  ['Campaign ledger', 'campaign-ledger.html'],
  ['Method & sources', 'methodology.html'],
  ['Flagged for review', 'flagged-for-review.html']
];

const disclosure = `Affiliate disclosure — This site may earn from qualifying Amazon purchases. Amazon’s required statement for enrolled sites is: <q>As an Amazon Associate I earn from qualifying purchases.</q> The owner-supplied tracking ID <code>shopnow047c-20</code>, enrollment, and link status are not independently verified. No product links are active.`;

function renderNavigation(prefix) {
  return `<details class="nav-group">
    <summary aria-label="Open the site navigation">Explore</summary>
    <nav class="nav-panel" aria-label="Site navigation">
      ${navigation.map(([label, path]) => `<a href="${prefix}${path}">${label}</a>`).join('\n      ')}
    </nav>
  </details>`;
}

function renderFooter(prefix) {
  const footerLinks = navigation.filter(([, path]) => path !== 'index.html');
  return `<footer class="site-footer">
    <div class="wrap footer-inner">
      <div class="footer-top">
        <div class="footer-brand">
          <a class="brand" href="${prefix}index.html"><span class="brand-mark" aria-hidden="true">DH</span><span class="brand-copy"><strong>DIY HOME</strong><small>UPGRADE JOURNAL</small></span></a>
          <p>Clear buyer questions, source-led product notes, and no made-up numbers.</p>
        </div>
        <nav class="footer-nav" aria-label="Publication and dashboard pages">
          ${footerLinks.map(([label, path]) => path === 'feed.xml'
            ? `<a href="${prefix}${path}" type="application/rss+xml">${label}</a>`
            : `<a href="${prefix}${path}">${label}</a>`).join('\n          ')}
        </nav>
      </div>
      <aside class="footer-disclosure" aria-label="Affiliate disclosure repeated in the footer"><strong>Affiliate disclosure.</strong> ${disclosure.slice('Affiliate disclosure — '.length)}</aside>
      <div class="footer-bottom"><span>© 2026 DIY HOME · Sources checked 20 November 2026</span><span><a href="${prefix}methodology.html">How we verify</a> · <a href="${prefix}flagged-for-review.html">Flagged items</a></span></div>
    </div>
  </footer>`;
}

function renderPage(page, productIntent) {
  const prefix = pagePrefix(page.path);
  const canonical = canonicalFor(page);
  const pageBody = typeof page.body === 'function' ? page.body({ productIntent }) : page.body;
  const title = escapeHtml(page.title);
  const description = escapeHtml(page.description);
  const pageType = escapeHtml(page.type || 'page');
  const pagePath = escapeHtml(page.path);
  const feedHref = `${prefix}feed.xml`;
  const cssHref = `${prefix}assets/site.css`;
  const jsHref = `${prefix}assets/site.js`;
  const faviconHref = `${prefix}assets/favicon.svg`;
  const homeHref = `${prefix}index.html`;
  const disclosureText = disclosure.replace('Affiliate disclosure — ', '');

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light">
  <meta name="description" content="${description}">
  <meta name="robots" content="index,follow,max-image-preview:large">
  <link rel="canonical" href="${canonical}">
  <link rel="alternate" type="application/rss+xml" title="DIY HOME — Kitchen notes" href="${feedHref}">
  <link rel="icon" href="${faviconHref}" type="image/svg+xml">
  <link rel="stylesheet" href="${cssHref}">
  <meta property="og:type" content="${page.type === 'guide' ? 'article' : 'website'}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="${canonical}">
  <meta name="twitter:card" content="summary">
  <title>${title}</title>
  <script defer src="${jsHref}"></script>
</head>
<body data-page-type="${pageType}" data-page-path="${pagePath}">
  <a class="skip-link" href="#main-content">Skip to content</a>
  <div class="wrap">
    <header class="masthead">
      <a class="brand" href="${homeHref}" aria-label="DIY HOME — front page"><span class="brand-mark" aria-hidden="true">DH</span><span class="brand-copy"><strong>DIY HOME</strong><small>UPGRADE JOURNAL</small></span></a>
      ${renderNavigation(prefix)}
    </header>
    <aside class="disclosure-strip" aria-label="Affiliate disclosure"><strong>Affiliate disclosure.</strong> ${disclosureText}</aside>
  </div>
  <main class="wrap" id="main-content">
    ${pageBody}
  </main>
  ${renderFooter(prefix)}
</body>
</html>
`;
}

function buildSitemap() {
  const urls = pages.map((page) => `  <url><loc>${escapeXml(canonicalFor(page))}</loc><lastmod>${escapeXml(page.published)}</lastmod></url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

function buildFeed() {
  const guides = pages.filter((page) => page.type === 'guide').slice().sort((a, b) => b.published.localeCompare(a.published));
  const latestDate = guides.map((page) => page.published).sort().at(-1) || '2026-11-20';
  const items = guides.map((page) => {
    const canonical = canonicalFor(page);
    const pubDate = new Date(`${page.published}T12:00:00.000Z`).toUTCString();
    return `  <item>\n    <title>${escapeXml(page.title.replace(/ — DIY Home$/, ''))}</title>\n    <link>${escapeXml(canonical)}</link>\n    <guid isPermaLink="true">${escapeXml(canonical)}</guid>\n    <pubDate>${escapeXml(pubDate)}</pubDate>\n    <description>${escapeXml(page.summary)}</description>\n    <category>${escapeXml(page.section)}</category>\n  </item>`;
  }).join('\n');
  const channelDate = new Date(`${latestDate}T12:00:00.000Z`).toUTCString();
  return `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n<channel>\n  <title>DIY HOME — Kitchen notes</title>\n  <link>${escapeXml(BASE_URL)}</link>\n  <description>Question-led, source-aware home and kitchen buying guides. No unverified product claims.</description>\n  <language>en</language>\n  <lastBuildDate>${escapeXml(channelDate)}</lastBuildDate>\n  <generator>DIY HOME publication build</generator>\n  <docs>https://www.rssboard.org/rss-specification</docs>\n${items}\n</channel>\n</rss>\n`;
}

async function main() {
  const productIntent = JSON.parse(await readFile(join(DATA_DIR, 'product-intent.json'), 'utf8'));
  if (!Array.isArray(productIntent.records)) throw new Error('Product intent register must contain a records array.');
  if (pages.length === 0) throw new Error('No publication pages are configured.');

  await rm(OUTPUT, { recursive: true, force: true });
  await mkdir(OUTPUT, { recursive: true });
  for (const page of pages) {
    const outputPath = join(OUTPUT, page.path);
    await mkdir(dirname(outputPath), { recursive: true });
    await writeFile(outputPath, renderPage(page, productIntent), 'utf8');
  }

  const assetOutput = join(OUTPUT, 'assets');
  const dataOutput = join(OUTPUT, 'data');
  await mkdir(assetOutput, { recursive: true });
  await mkdir(dataOutput, { recursive: true });
  for (const name of ['site.css', 'site.js', 'cover.svg', 'favicon.svg']) {
    await copyFile(join(ASSET_DIR, name), join(assetOutput, name));
  }
  for (const name of ['product-intent.json', 'campaign-ledger.csv', 'event-schema.json']) {
    await copyFile(join(DATA_DIR, name), join(dataOutput, name));
  }

  await writeFile(join(OUTPUT, 'sitemap.xml'), buildSitemap(), 'utf8');
  await writeFile(join(OUTPUT, 'feed.xml'), buildFeed(), 'utf8');
  await writeFile(join(OUTPUT, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${new URL('sitemap.xml', BASE_URL).href}\n`, 'utf8');
  await writeFile(join(OUTPUT, '.nojekyll'), '', 'utf8');
  await writeFile(join(OUTPUT, '404.html'), renderPage({
    path: '404.html',
    type: 'page',
    title: 'Not found — DIY Home',
    description: 'That DIY HOME page could not be found.',
    body: '<div class="page-heading"><p class="eyebrow">404 · Lost in the house</p><h1>That page isn’t here.</h1><p class="lede">Try the front page or browse the question-led guides.</p><p class="hero-actions"><a class="button" href="./index.html">Go to the front page</a><a class="button secondary" href="./guides/">Browse guides</a></p></div>'
  }, productIntent), 'utf8');

  const relativePages = pages.map((page) => relative(OUTPUT, join(OUTPUT, page.path))).join(', ');
  console.log(`Built ${pages.length} pages into dist/: ${relativePages}`);
  console.log(`Generated sitemap.xml and feed.xml with ${pages.filter((page) => page.type === 'guide').length} guides.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
