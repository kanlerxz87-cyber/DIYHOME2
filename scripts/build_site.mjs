#!/usr/bin/env node
/**
 * DIYHOME2 Static Publication & Dashboard Builder
 * Reads verified JSON data from data/*.json and renders all static HTML pages,
 * sitemap.xml, feed.xml, and robots.txt for GitHub Pages deployment.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const BASE_URL = 'https://kanlerxz87-cyber.github.io/DIYHOME2/';
const SITE_NAME = 'DIY Home Upgrades Journal';
const TRACKING_ID = 'shopnow047c-20';
const VERIFIED_DATE = '2026-11-20';
const VERBATIM_DISCLOSURE = 'As an Amazon Associate I earn from qualifying purchases.';

const productsData = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/products.json'), 'utf8'));
const sourcesData = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/sources.json'), 'utf8'));
const flaggedData = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/flagged.json'), 'utf8'));
const ledgerData = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/campaign-ledger.json'), 'utf8'));
const editorialData = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/editorial-plan.json'), 'utf8'));

const PRODUCTS_BY_ID = Object.fromEntries(productsData.products.map((p) => [p.product_id, p]));

function esc(val) {
  return String(val ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function xmlEsc(val) {
  return String(val ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function relPrefix(pagePath) {
  const depth = pagePath.split('/').length - 1;
  return depth === 0 ? '' : '../'.repeat(depth);
}

function writeOut(relPath, content) {
  const full = path.join(ROOT, relPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, 'utf8');
}

function externalRelFor(url) {
  return /^https?:\/\/(www\.)?(amazon\.com|link\.amazon)\b/i.test(String(url || ''))
    ? 'sponsored noopener noreferrer'
    : 'noopener noreferrer';
}

function renderAffiliateButton(prod, placement, label = 'Check current price on Amazon (paid link)') {
  return `<a class="btn btn-primary" href="${esc(prod.candidate_special_link.url)}" target="_blank" rel="sponsored noopener noreferrer" data-affiliate-product="${esc(prod.product_id)}" data-observed-asin="${esc(prod.observed_redirect_target.observed_asin)}" data-tracking-id="${esc(TRACKING_ID)}" data-placement="${esc(placement)}">${esc(label)}</a>`;
}

function renderProductCard(prod, prefix, placement) {
  const specs = prod.verified_listing_specs;
  const isFlaggedSpec = prod.product_id === 'PROD-01' || prod.product_id === 'PROD-03';
  const caveat =
    prod.product_id === 'PROD-03'
      ? 'Light-duty variant: 10 lb/tier ceiling; title notes cookware up to 11" (bullets state 12", flagged). Prop 65 notice on listing.'
      : prod.product_id === 'PROD-01'
        ? 'Technical Details lists Package Qty 3 while bullets list 5 tool items (flagged). Prop 65 notice on listing.'
        : 'Dual mounting: peel-and-stick works best on smooth tile, glass, or laminate; use included screws on textured or painted wood.';

  return `
    <article class="card product-card">
      <div class="product-visual">
        <img src="${prefix}${esc(prod.illustration_svg)}" alt="${esc(prod.editorial_short_name)} editorial diagram" width="360" height="220" loading="lazy">
      </div>
      <div class="product-body">
        <div class="meta-row">
          <span class="pill pill-forest">${esc(prod.category_label)}</span>
          <span class="pill">${esc(prod.cluster)}</span>
        </div>
        <h3>${esc(prod.editorial_short_name)}</h3>
        <p>${esc(specs.verified_highlights[0])}</p>
        <dl class="spec-dl">
          <dt>Brand</dt><dd>${esc(specs.brand)}</dd>
          <dt>Material</dt><dd>${esc(specs.material)}</dd>
          <dt>Dimensions</dt><dd>${esc(specs.dimensions)}</dd>
          <dt>Weight</dt><dd>${esc(specs.item_weight)}</dd>
          <dt>Observed ASIN</dt><dd class="mono">${esc(prod.observed_redirect_target.observed_asin)} <a href="${prefix}flagged.html#FLG-02">(intent pending)</a></dd>
        </dl>
        <p class="price-gate-note"><strong>Buyer note:</strong> ${esc(caveat)} Live price &amp; customer ratings are intentionally omitted until Amazon Creators API enrollment (<a href="${prefix}compliance.html#api-gate">policy</a>).</p>
        <div class="card-actions">
          ${renderAffiliateButton(prod, placement)}
          <a class="btn btn-secondary btn-sm" href="${prefix}${esc(prod.guide_url)}">Read the Buyer Guide &rarr;</a>
          <span class="paid-hint">Paid link · Candidate Special Link (<span class="mono">${esc(TRACKING_ID)}</span>) · ${isFlaggedSpec ? `<a href="${prefix}flagged.html">Listing notes flagged</a>` : `<a href="${prefix}dashboard.html">Verified specs</a>`}</span>
        </div>
      </div>
    </article>`;
}

function renderLayout({
  pagePath,
  title,
  description,
  activeNav = '',
  pageType = 'page',
  jsonLd = null,
  bodyHtml
}) {
  const p = relPrefix(pagePath);
  const canonical = pagePath === 'index.html' ? BASE_URL : BASE_URL + pagePath;
  const fullTitle = pagePath === 'index.html' ? `${SITE_NAME} — Practical DIY Home Upgrades & Buyer Guides` : `${title} · ${SITE_NAME}`;
  const structuredData = jsonLd
    ? `<script type="application/ld+json">\n${JSON.stringify(jsonLd, null, 2)}\n</script>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(fullTitle)}</title>
  <meta name="description" content="${esc(description)}">
  <link rel="canonical" href="${esc(canonical)}">
  <link rel="alternate" type="application/rss+xml" title="${esc(SITE_NAME)} RSS Feed" href="${BASE_URL}feed.xml">
  <meta property="og:site_name" content="${esc(SITE_NAME)}">
  <meta property="og:type" content="${pageType === 'guide' ? 'article' : 'website'}">
  <meta property="og:title" content="${esc(fullTitle)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${esc(canonical)}">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="${esc(fullTitle)}">
  <meta name="twitter:description" content="${esc(description)}">
  <meta name="diyhome-analytics-endpoint" content="">
  <!-- Google Search Console verification tag slot: insert verified meta token once property is claimed -->
  <link rel="stylesheet" href="${p}assets/css/style.css">
  ${structuredData}
</head>
<body data-page-type="${esc(pageType)}">
  <a class="skip-link" href="#main-content">Skip to main content</a>

  <header class="site-header">
    <div class="container header-inner">
      <a class="brand" href="${p}index.html">
        <img class="brand-mark" src="${p}assets/img/brand-mark.svg" alt="" width="34" height="34">
        <span class="brand-text">
          <span class="brand-title">DIY Home Upgrades</span>
          <span class="brand-sub">Practical Hardware &amp; Kitchen Journal</span>
        </span>
      </a>

      <button class="mobile-menu-btn" type="button" data-mobile-toggle aria-expanded="false" aria-controls="primary-nav">Menu</button>

      <nav class="primary-nav" id="primary-nav" data-primary-nav aria-label="Primary">
        <a class="nav-link" href="${p}index.html"${activeNav === 'home' ? ' aria-current="page"' : ''}>Shop Picks</a>
        <a class="nav-link" href="${p}guides/index.html"${activeNav === 'guides' ? ' aria-current="page"' : ''}>Buyer Guides</a>
        <a class="nav-link" href="${p}categories/wall-backsplash-tools.html"${activeNav === 'wall' ? ' aria-current="page"' : ''}>Wall &amp; Backsplash</a>
        <a class="nav-link" href="${p}categories/kitchen-organization.html"${activeNav === 'kitchen' ? ' aria-current="page"' : ''}>Kitchen Storage</a>
        <a class="nav-link" href="${p}about.html"${activeNav === 'about' ? ' aria-current="page"' : ''}>Editorial Standards</a>

        <div class="nav-group" data-nav-group data-open="false">
          <button class="nav-group-btn" type="button" data-nav-group-btn aria-expanded="false" aria-haspopup="true">
            Dashboard &amp; Ops <span aria-hidden="true">&#9662;</span>
          </button>
          <div class="nav-dropdown" role="menu">
            <a href="${p}summary.html" role="menuitem">Executive Summary</a>
            <a href="${p}dashboard.html" role="menuitem">Product Register &amp; Tables</a>
            <a href="${p}compliance.html" role="menuitem">Compliance &amp; Sources</a>
            <a href="${p}analytics.html" role="menuitem">Analytics &amp; Campaign Ledger</a>
            <a href="${p}flagged.html" role="menuitem">Flagged for Review <span class="nav-badge">${flaggedData.flags.length}</span></a>
          </div>
        </div>
      </nav>
    </div>
  </header>

  <div class="disclosure-bar" role="region" aria-label="Affiliate disclosure" data-disclosure-placement="masthead">
    <div class="container disclosure-inner">
      <span><strong>Affiliate Disclosure:</strong> ${esc(VERBATIM_DISCLOSURE)} Outbound Amazon product links are labeled <strong>(paid link)</strong> and marked <code class="mono">rel="sponsored"</code>.</span>
      <span><a href="${p}compliance.html">Compliance Policy</a> &middot; <a href="${p}flagged.html">Flagged Items (${flaggedData.flags.length})</a></span>
    </div>
  </div>

  <main id="main-content">
    ${bodyHtml}
  </main>

  <footer class="site-footer">
    <div class="container">
      <div class="footer-disclosure" data-disclosure-placement="footer">
        <strong>Disclosure:</strong> ${esc(VERBATIM_DISCLOSURE)} Every outbound product link on this site is qualified with <code class="mono">rel="sponsored"</code> and identified as a paid link in accordance with the Amazon Associates Program Operating Agreement and FTC Endorsement Guides (16 C.F.R. Part 255). Live prices, availability, and customer ratings are checked directly on Amazon until Creators API integration is active.
      </div>

      <div class="footer-grid">
        <div class="footer-col">
          <h3>DIY Home Upgrades Journal</h3>
          <p>An independent, measurement-first home improvement publication. Every listed specification is checked against official product pages; unverified values are left blank and published for review.</p>
          <p class="mono">Tracking ID: ${esc(TRACKING_ID)} · Verified: ${esc(VERIFIED_DATE)}</p>
        </div>

        <div class="footer-col">
          <h3>Shop &amp; Guides</h3>
          <ul>
            <li><a href="${p}index.html">Front Page Picks</a></li>
            <li><a href="${p}categories/wall-backsplash-tools.html">Wall &amp; Backsplash Tools</a></li>
            <li><a href="${p}categories/kitchen-organization.html">Kitchen Storage &amp; Organization</a></li>
            <li><a href="${p}guides/index.html">All Buyer Guides</a></li>
            <li><a href="${p}about.html">Authorship &amp; Editorial Standards</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h3>Verification &amp; Ops Dashboard</h3>
          <ul>
            <li><a href="${p}summary.html">Executive Summary</a></li>
            <li><a href="${p}dashboard.html">Product Register &amp; Intent Table</a></li>
            <li><a href="${p}compliance.html">Compliance Gate &amp; Official Sources</a></li>
            <li><a href="${p}analytics.html">Privacy Analytics &amp; Campaign Ledger</a></li>
            <li><a href="${p}flagged.html">Flagged for Review (${flaggedData.flags.length})</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h3>Findability &amp; Feeds</h3>
          <ul>
            <li><a href="${p}feed.xml" data-reader-capture="rss" data-capture-label="footer_rss">RSS Feed (feed.xml)</a></li>
            <li><a href="${p}sitemap.xml">XML Sitemap (sitemap.xml)</a></li>
            <li><a href="${p}robots.txt">Crawler Rules (robots.txt)</a></li>
            <li><a href="${p}data/products.json">Structured Product JSON</a></li>
            <li><a href="${p}data/sources.json">Official Sources JSON</a></li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <span>&copy; 2026 DIY Home Upgrades Journal (DIYHOME2). Built with zero cookies and zero third-party ad trackers.</span>
        <span>Canonical: <a href="${esc(BASE_URL)}">${esc(BASE_URL)}</a></span>
      </div>
    </div>
  </footer>

  <script src="${p}assets/js/analytics.js" defer></script>
  <script src="${p}assets/js/app.js" defer></script>
</body>
</html>
`;
}

// ============================================================================
// 1. FRONT PAGE (index.html) — Publication Front Page, Leads with Products
// ============================================================================
function buildIndexPage() {
  const productCards = productsData.products
    .map((prod) => renderProductCard(prod, '', 'front_page_featured'))
    .join('\n');

  const guideCards = editorialData.published_guides
    .map(
      (g) => `
      <article class="card">
        <div class="meta-row">
          <span class="pill pill-forest">${esc(g.category)}</span>
          <span class="pill">${esc(g.reading_time_min)} min read</span>
        </div>
        <h3><a href="${esc(g.url)}">${esc(g.title)}</a></h3>
        <p>${esc(g.excerpt)}</p>
        <p class="paid-hint">By ${esc(g.author)} · Published ${esc(g.published_date_utc)}</p>
      </article>`
    )
    .join('\n');

  const bodyHtml = `
    <section class="hero">
      <div class="container hero-grid">
        <div>
          <span class="eyebrow">Autumn / Holiday Workshop Edition · Verified ${esc(VERIFIED_DATE)}</span>
          <h1>Practical DIY Home Upgrades, Measured Before You Buy.</h1>
          <p class="lead">Small hardware and surface-prep upgrades fail when dimensions, wall surfaces, or cabinet weight limits are guessed. We break down verified specifications, honest caveats, and exact room measurements for three high-utility home upgrades—so you buy once and install cleanly.</p>
          <div class="hero-actions">
            <a class="btn btn-primary" href="#featured-picks">Shop Verified Picks</a>
            <a class="btn btn-secondary" href="guides/index.html">Read Buyer Guides</a>
            <a class="btn btn-secondary" href="feed.xml" data-reader-capture="rss" data-capture-label="hero_rss">Subscribe via RSS</a>
          </div>
        </div>

        <aside class="hero-sidebar" aria-label="Start with your project question">
          <h2>Start With Your Buyer Question</h2>
          <ul class="quick-list">
            <li><strong>Peel &amp; Stick Wall or Backsplash?</strong><br><a href="guides/peel-and-stick-smoothing-kit-guide.html">What actually matters in a wallpaper smoothing starter kit?</a></li>
            <li><strong>Renting Your Kitchen?</strong><br><a href="guides/adhesive-vs-screw-paper-towel-holder.html">Adhesive vs. screw-mount paper towel holders: how to avoid cabinet damage</a></li>
            <li><strong>Stacking Pans in a Base Cabinet?</strong><br><a href="guides/measure-cabinet-for-pot-pan-organizer.html">How to measure cabinet height and weight limits before buying an 8-tier rack</a></li>
            <li><strong>Planning a Full Weekend Refresh?</strong><br><a href="guides/renter-friendly-kitchen-upgrade-checklist.html">A no-hype checklist for a reversible weekend kitchen upgrade</a></li>
          </ul>
        </aside>
      </div>
    </section>

    <section class="section" id="featured-picks">
      <div class="container">
        <div class="section-header">
          <div>
            <span class="eyebrow">Featured Hardware &amp; Tools</span>
            <h2>Three Weekend DIY Upgrades Worth Comparing</h2>
            <p>Every dimension, material, weight rating, and listing caveat below was verified directly against official Amazon US product pages on ${esc(VERIFIED_DATE)}. Click any product to check live pricing and availability on Amazon.</p>
          </div>
          <a class="btn btn-secondary btn-sm" href="dashboard.html">Inspect Full Spec Table &rarr;</a>
        </div>
        <div class="grid-3">
          ${productCards}
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-header">
          <div>
            <span class="eyebrow">Question-Shaped Editorial</span>
            <h2>Latest Buyer Guides</h2>
            <p>Written to answer specific fit, mounting, and trade-off questions—never copied from merchant blurbs.</p>
          </div>
          <a class="btn btn-secondary btn-sm" href="guides/index.html">View All Guides &amp; Cadence &rarr;</a>
        </div>
        <div class="grid-2">
          ${guideCards}
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-header">
          <div>
            <span class="eyebrow">Project &amp; Seasonal Clusters</span>
            <h2>Browse by Home Upgrade Cluster</h2>
            <p>Group compatible hardware before ordering so surface-prep tools, mounts, and cabinet racks work together.</p>
          </div>
        </div>
        <div class="grid-3">
          <div class="card">
            <span class="eyebrow">Cluster 01</span>
            <h3>Renter-Friendly Peel &amp; Stick</h3>
            <p>Surface smoothing, bubble removal, and clean trimming for removable vinyl wallpaper and kitchen backsplash tiles.</p>
            <p><a href="categories/wall-backsplash-tools.html">Explore Wall &amp; Backsplash Tools &rarr;</a></p>
          </div>
          <div class="card">
            <span class="eyebrow">Cluster 02</span>
            <h3>Weekend Kitchen Refresh</h3>
            <p>Clear countertop clutter in an afternoon with dual-mount under-cabinet roll holders and reversible backsplash prep.</p>
            <p><a href="categories/kitchen-organization.html">Explore Kitchen Storage Picks &rarr;</a></p>
          </div>
          <div class="card">
            <span class="eyebrow">Cluster 03</span>
            <h3>Cabinet Space Optimization</h3>
            <p>Convert stacked cookware piles into vertical or horizontal tiered storage matched to your cabinet clearance and pan weights.</p>
            <p><a href="guides/measure-cabinet-for-pot-pan-organizer.html">Open Cabinet Measurement Guide &rarr;</a></p>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="capture-box">
          <div>
            <span class="eyebrow">Reader Capture &amp; Measured Topics</span>
            <h2>Follow New Guides or Request a Measurement Breakdown</h2>
            <p>We publish a new question-shaped DIY buyer guide every 14 days and prioritize topics from real reader questions and measured search queries. Subscribe via RSS or drop a hardware question below (zero cookies, zero email tracking).</p>
            <p><a class="btn btn-forest btn-sm" href="feed.xml" data-reader-capture="rss" data-capture-label="front_capture_rss">Open RSS Feed (feed.xml)</a></p>
          </div>
          <form class="capture-form" data-reader-capture-form="topic_request">
            <label class="sr-only" for="reader-topic">Ask a DIY home upgrade buying question</label>
            <input class="input" id="reader-topic" name="topic" type="text" maxlength="140" placeholder="e.g., Best non-drill mount for textured cabinets?" required>
            <button class="btn btn-primary" type="submit">Log Question</button>
            <p class="paid-hint" data-capture-status hidden></p>
          </form>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="callout callout-forest">
          <strong>How This Publication Stays Verifiable:</strong> Every product listing is checked line by line against official Amazon pages, FTC Endorsement Guides, and Amazon Associates Program Policies. Looking for the source register, executive summary, campaign ledger, or the ${flaggedData.flags.length} flagged review items? Use the <strong>Dashboard &amp; Ops</strong> menu above or visit the <a href="summary.html">Executive Summary</a>, <a href="dashboard.html">Product Register</a>, or <a href="flagged.html">Flagged for Review</a>.
        </div>
      </div>
    </section>
  `;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: BASE_URL,
    description:
      'Measurement-first DIY Home Upgrades publication covering peel-and-stick installation tools and kitchen storage hardware with transparent Amazon Associates verification.'
  };

  writeOut(
    'index.html',
    renderLayout({
      pagePath: 'index.html',
      title: SITE_NAME,
      description:
        'Practical DIY Home Upgrades buying guides and verified hardware picks for peel-and-stick wallpaper tools, under-cabinet paper towel holders, and adjustable pot organizers.',
      activeNav: 'home',
      pageType: 'front_page',
      jsonLd,
      bodyHtml
    })
  );
}

// ============================================================================
// 2. CATEGORY SUBPAGES
// ============================================================================
function buildCategoryPages() {
  // Category 1: Wall & Backsplash Tools
  const prod1 = PRODUCTS_BY_ID['PROD-01'];
  const wallHtml = `
    <section class="section">
      <div class="container">
        <nav class="breadcrumbs" aria-label="Breadcrumb"><a href="../index.html">Home</a> &rsaquo; Wall &amp; Backsplash Tools</nav>
        <span class="eyebrow">Category · Tools &amp; Home Improvement</span>
        <h1>Wall &amp; Backsplash Installation Tools</h1>
        <p class="lead">Clean peel-and-stick wallpaper and vinyl backsplash projects depend less on expensive tile and more on bubble control, square layout measurements, and fresh utility blades.</p>

        <div class="grid-2" style="margin-top: 1.5rem;">
          ${renderProductCard(prod1, '../', 'category_wall')}
          <div class="card">
            <span class="eyebrow">Category Buying Framework</span>
            <h3>What to Check Before Buying a Smoothing Kit</h3>
            <ul>
              <li><strong>Surface Safety:</strong> Hard plastic squeegees can scuff matte or textured vinyl if pressed at steep angles; pair firm passes with light pressure or a felt edge.</li>
              <li><strong>Blade Replacement Access:</strong> Vinyl adhesive gums up blades quickly—verify replacement blades are included and standard-sized.</li>
              <li><strong>Spec Verification Note:</strong> On observed listing <span class="mono">B08FKW9JRM</span>, Technical Details lists <em>Item Package Quantity: 3</em> while product bullets list 5 items, and a California Proposition 65 notice appears on the page (<a href="../flagged.html#FLG-05">FLG-05</a>).</li>
              <li><strong>Commission Tier Reference:</strong> Official Amazon Associates Table 1 lists <em>Tools</em> and <em>Home Improvement</em> at <strong>3.00%</strong> (<a href="https://affiliate-program.amazon.com/help/node/topic/GRXPHT8U84RAYDXZ" target="_blank" rel="noopener noreferrer">official source</a>).</li>
            </ul>
            <p><a class="btn btn-secondary btn-sm" href="../guides/peel-and-stick-smoothing-kit-guide.html">Read the Full Smoothing Kit Buyer Guide &rarr;</a></p>
          </div>
        </div>

        <h2 style="margin-top: 2rem;">Verified Category Specification Table</h2>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Observed ASIN</th>
                <th>Intended ASIN</th>
                <th>Model / Part</th>
                <th>Dimensions &amp; Weight</th>
                <th>Material</th>
                <th>Official Source</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>${esc(prod1.editorial_short_name)}</strong></td>
                <td class="mono">${esc(prod1.observed_redirect_target.observed_asin)}</td>
                <td><span class="blank-cell">Blank — Pending confirmation</span></td>
                <td class="mono">${esc(prod1.verified_listing_specs.model_number)} / ${esc(prod1.verified_listing_specs.part_number)}</td>
                <td>${esc(prod1.verified_listing_specs.dimensions)} · ${esc(prod1.verified_listing_specs.item_weight)}</td>
                <td>${esc(prod1.verified_listing_specs.material)}</td>
                <td><a href="${esc(prod1.verified_listing_specs.official_source_url)}" target="_blank" rel="sponsored noopener noreferrer">Amazon Listing (paid/source)</a></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  `;

  writeOut(
    'categories/wall-backsplash-tools.html',
    renderLayout({
      pagePath: 'categories/wall-backsplash-tools.html',
      title: 'Wall & Backsplash Tools',
      description: 'Verified specs and buyer guidance for peel-and-stick wallpaper and vinyl backsplash smoothing tool kits.',
      activeNav: 'wall',
      pageType: 'category',
      bodyHtml: wallHtml
    })
  );

  // Category 2: Kitchen Storage & Organization
  const prod2 = PRODUCTS_BY_ID['PROD-02'];
  const prod3 = PRODUCTS_BY_ID['PROD-03'];
  const kitchenHtml = `
    <section class="section">
      <div class="container">
        <nav class="breadcrumbs" aria-label="Breadcrumb"><a href="../index.html">Home</a> &rsaquo; Kitchen Storage &amp; Organization</nav>
        <span class="eyebrow">Category · Home &amp; Kitchen › Kitchen &amp; Dining</span>
        <h1>Kitchen Storage &amp; Under-Cabinet Organization</h1>
        <p class="lead">Reclaim countertop prep space and stop unstacking heavy skillets with verified mounting options and real cabinet-clearance measurements.</p>

        <div class="grid-2" style="margin-top: 1.5rem;">
          ${renderProductCard(prod2, '../', 'category_kitchen')}
          ${renderProductCard(prod3, '../', 'category_kitchen')}
        </div>

        <h2 style="margin-top: 2rem;">Side-by-Side Verified Specifications</h2>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Observed ASIN</th>
                <th>Intended ASIN</th>
                <th>Material &amp; Weight</th>
                <th>Verified Dimensions</th>
                <th>Key Limit / Caveat</th>
                <th>Official Source</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>${esc(prod2.editorial_short_name)}</strong></td>
                <td class="mono">${esc(prod2.observed_redirect_target.observed_asin)}</td>
                <td><span class="blank-cell">Blank — Pending confirmation</span></td>
                <td>${esc(prod2.verified_listing_specs.material)} · ${esc(prod2.verified_listing_specs.item_weight)}</td>
                <td>${esc(prod2.verified_listing_specs.dimensions)}</td>
                <td>Dual adhesive/screw mount; submitted twice in brief (<a href="../flagged.html#FLG-01">FLG-01</a>).</td>
                <td><a href="${esc(prod2.verified_listing_specs.official_source_url)}" target="_blank" rel="sponsored noopener noreferrer">Amazon B0BSKQW2T2</a></td>
              </tr>
              <tr>
                <td><strong>${esc(prod3.editorial_short_name)}</strong></td>
                <td class="mono">${esc(prod3.observed_redirect_target.observed_asin)}</td>
                <td><span class="blank-cell">Blank — Pending confirmation</span></td>
                <td>${esc(prod3.verified_listing_specs.material)} · ${esc(prod3.verified_listing_specs.item_weight)}</td>
                <td>${esc(prod3.verified_listing_specs.dimensions)}</td>
                <td>10 lb/tier Light-Duty; 11" vs 12" listing mismatch; newer model B0BYYTQMTR noted (<a href="../flagged.html#FLG-06">FLG-06</a>).</td>
                <td><a href="${esc(prod3.verified_listing_specs.official_source_url)}" target="_blank" rel="sponsored noopener noreferrer">Amazon B08DY9HRWD</a></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  `;

  writeOut(
    'categories/kitchen-organization.html',
    renderLayout({
      pagePath: 'categories/kitchen-organization.html',
      title: 'Kitchen Storage & Organization',
      description: 'Compare under-cabinet aluminum paper towel holders and 8-tier adjustable pot and pan organizers using verified dimensions and weight limits.',
      activeNav: 'kitchen',
      pageType: 'category',
      bodyHtml: kitchenHtml
    })
  );
}

// ============================================================================
// 3. QUESTION-SHAPED BUYER GUIDES (guides/index.html + 4 guides)
// ============================================================================
function buildGuides() {
  const prod1 = PRODUCTS_BY_ID['PROD-01'];
  const prod2 = PRODUCTS_BY_ID['PROD-02'];
  const prod3 = PRODUCTS_BY_ID['PROD-03'];

  // Guides Index
  const guidesIndexHtml = `
    <section class="section">
      <div class="container">
        <nav class="breadcrumbs" aria-label="Breadcrumb"><a href="../index.html">Home</a> &rsaquo; Buyer Guides</nav>
        <span class="eyebrow">Question-Shaped Editorial Archive</span>
        <h1>DIY Home Upgrades Buyer Guides</h1>
        <p class="lead">Each guide starts with a real homeowner or renter decision—clearances, mounting surfaces, and load limits—and links directly to verified specifications and official sources.</p>

        <div class="grid-2" style="margin-top: 1.5rem;">
          ${editorialData.published_guides
            .map(
              (g) => `
              <article class="card">
                <div class="meta-row">
                  <span class="pill pill-forest">${esc(g.category)}</span>
                  <span class="pill">${esc(g.cluster)}</span>
                  <span class="pill">${esc(g.reading_time_min)} min</span>
                </div>
                <h2><a href="${esc(g.slug)}.html">${esc(g.title)}</a></h2>
                <p><strong>Editorial question:</strong> ${esc(g.question_shaped_hypothesis)}</p>
                <p>${esc(g.excerpt)}</p>
                <p class="paid-hint">Published ${esc(g.published_date_utc)} · By ${esc(g.author)}</p>
              </article>`
            )
            .join('\n')}
        </div>

        <div class="callout" style="margin-top: 2rem;">
          <h3>Publishing Cadence &amp; Measured Topic Selection</h3>
          <p>${esc(editorialData.cadence_policy)}</p>
          <p>Every guide is automatically listed in <a href="../sitemap.xml">sitemap.xml</a> and syndicated in <a href="../feed.xml">feed.xml</a>. See the <a href="../analytics.html">Analytics &amp; Campaign Ledger</a> page for Search Console and event instrumentation details.</p>
        </div>
      </div>
    </section>
  `;

  writeOut(
    'guides/index.html',
    renderLayout({
      pagePath: 'guides/index.html',
      title: 'Buyer Guides',
      description: 'Question-shaped DIY home upgrade buying guides covering peel-and-stick smoothing kits, under-cabinet paper towel mounts, and pot organizer sizing.',
      activeNav: 'guides',
      pageType: 'guides_index',
      bodyHtml: guidesIndexHtml
    })
  );

  // Helper for guide pages
  function writeGuide({ guide, productCards, contentHtml, faqRows }) {
    const pagePath = `guides/${guide.slug}.html`;
    const faqHtml = faqRows
      .map(
        (r) => `
        <tr>
          <td><strong>${esc(r.q)}</strong></td>
          <td>${esc(r.a)}</td>
          <td><a href="${esc(r.sourceUrl)}" target="_blank" rel="${externalRelFor(r.sourceUrl)}">${esc(r.sourceLabel)}</a></td>
        </tr>`
      )
      .join('\n');

    const bodyHtml = `
      <section class="section">
        <div class="container">
          <nav class="breadcrumbs" aria-label="Breadcrumb"><a href="../index.html">Home</a> &rsaquo; <a href="index.html">Buyer Guides</a> &rsaquo; ${esc(guide.category)}</nav>

          <div class="article-layout">
            <article class="prose" data-track-scroll="guide" data-guide-id="${esc(guide.guide_id)}">
              <span class="eyebrow">${esc(guide.category)} · ${esc(guide.cluster)}</span>
              <h1>${esc(guide.title)}</h1>
              <div class="byline">
                <span><strong>Author:</strong> ${esc(guide.author)}</span>
                <span><strong>Published:</strong> ${esc(guide.published_date_utc)}</span>
                <span><strong>Verified:</strong> ${esc(VERIFIED_DATE)}</span>
                <span><strong>Reading time:</strong> ${esc(guide.reading_time_min)} min</span>
              </div>

              <div class="callout callout-forest">
                <strong>Buyer Question:</strong> ${esc(guide.question_shaped_hypothesis)}
              </div>

              ${contentHtml}

              <h2>Quick Verification &amp; Buyer Q&amp;A</h2>
              <div class="table-wrap">
                <table>
                  <thead>
                    <tr><th>Question</th><th>Verified Guidance</th><th>Official Source</th></tr>
                  </thead>
                  <tbody>${faqHtml}</tbody>
                </table>
              </div>
            </article>

            <aside aria-label="Referenced hardware">
              <h2 style="font-size: 1.15rem; margin-bottom: 0.75rem;">Referenced Hardware</h2>
              <div style="display: grid; gap: 1rem;">
                ${productCards}
              </div>
            </aside>
          </div>
        </div>
      </section>
    `;

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: guide.title,
      description: guide.excerpt,
      datePublished: guide.published_date_utc,
      dateModified: VERIFIED_DATE,
      author: { '@type': 'Organization', name: guide.author },
      publisher: { '@type': 'Organization', name: SITE_NAME },
      mainEntityOfPage: BASE_URL + pagePath
    };

    writeOut(
      pagePath,
      renderLayout({
        pagePath,
        title: guide.title,
        description: guide.excerpt,
        activeNav: 'guides',
        pageType: 'guide',
        jsonLd,
        bodyHtml
      })
    );
  }

  // Guide 1: Peel-and-Stick Smoothing Kit
  writeGuide({
    guide: editorialData.published_guides[0],
    productCards: renderProductCard(prod1, '../', 'guide_g01_sidebar'),
    contentHtml: `
      <h2>Why DIY Peel-and-Stick Projects Bubble or Peel at the Seams</h2>
      <p>Most renters and first-time DIYers blame the adhesive when peel-and-stick wallpaper or vinyl backsplash tile bubbles or lifts after a week. In practice, three mechanical problems cause almost every failure: trapped air pockets under uneven hand pressure, dull knife blades tearing stretchy vinyl instead of slicing cleanly around outlets, and slight measurement drift across cabinet spans.</p>
      <p>Using household stand-ins like a credit card or kitchen scissors narrows your contact width and concentrates pressure on sharp plastic corners, which can crease thin film or scratch matte finishes.</p>

      <h2>What Actually Matters Inside a Basic Smoothing Starter Kit</h2>
      <ol>
        <li><strong>A wide smoothing paddle (around 7+ inches):</strong> Sweeps air outward from the centerline in fewer strokes than a small squeegee, keeping seams parallel along cabinet undersides.</li>
        <li><strong>A secondary compact squeegee:</strong> Reaches tight inside corners near light switches, window trim, and sink backsplashes where a wide blade cannot sit flat.</li>
        <li><strong>A dedicated craft/utility knife with spare blades:</strong> Self-adhesive backing transfers glue residue onto a blade edge within a few linear feet. Swapping to a fresh blade prevents jagged edges along countertops.</li>
        <li><strong>A soft or compact measuring tape:</strong> Lets you pre-cut panels with 1–2 inches of trim overhang before peeling the backing paper.</li>
      </ol>

      <h2>Verified Look at the Art3d Smoothing Tool Kit (Observed ASIN B08FKW9JRM)</h2>
      <p>Based on the official Amazon US listing verified on ${esc(VERIFIED_DATE)}, the <strong>Art3d Smoothing Tool Kit (Model A17999)</strong> is a compact plastic tool set measuring <strong>7.72 × 4.33 × 0.79 inches</strong> and weighing <strong>3.52 ounces</strong>. Its product bullets state that it includes a large smoothing tool, a blue squeegee, a utility knife, replacement blades, and a measuring tape.</p>
      <div class="callout callout-warn">
        <strong>Two Verified Listing Notes to Check Before Ordering:</strong>
        <ul>
          <li><strong>Package quantity discrepancy (<a href="../flagged.html#FLG-05">FLG-05</a>):</strong> The listing's Technical Details table states <em>Item Package Quantity: 3</em> even though the top bullet describes 5 items. Confirm current package contents on the official listing before buying.</li>
          <li><strong>California Proposition 65 warning:</strong> Displayed on the official product detail page.</li>
        </ul>
      </div>

      <h2>Five-Minute Surface Prep Checklist Before Your First Cut</h2>
      <ul>
        <li>Degrease kitchen backsplash walls with mild dish soap and water; wipe dry and let cure completely before peeling vinyl backing.</li>
        <li>Test adhesion on lightly textured drywall first—peel-and-stick vinyl adheres most reliably to smooth painted drywall, laminate, or glazed tile.</li>
        <li>Peel only 6–8 inches of backing paper at a time while sweeping from the center outward with the smoothing tool.</li>
        <li>Use a straightedge along countertop seams and swap to a fresh blade if you feel drag.</li>
      </ul>
      <p>${renderAffiliateButton(prod1, 'guide_g01_inline', 'Check Art3d Kit price & box contents on Amazon (paid link)')}</p>
    `,
    faqRows: [
      {
        q: 'What are the verified physical dimensions and weight?',
        a: '7.72 × 4.33 × 0.79 inches and 3.52 ounces; handle and body material listed as plastic.',
        sourceUrl: 'https://www.amazon.com/dp/B08FKW9JRM',
        sourceLabel: 'Amazon B08FKW9JRM'
      },
      {
        q: 'Why is the live price not printed in this guide?',
        a: 'Amazon Associates Program Policies prohibit displaying static scraped prices without dynamic Creators API integration.',
        sourceUrl: 'https://affiliate-program.amazon.com/help/operating/policies',
        sourceLabel: 'Amazon Associates Policies (S02)'
      }
    ]
  });

  // Guide 2: Adhesive vs Screw Paper Towel Holder
  writeGuide({
    guide: editorialData.published_guides[1],
    productCards: renderProductCard(prod2, '../', 'guide_g02_sidebar'),
    contentHtml: `
      <h2>The Core Trade-Off: Renter Reversibility vs. Long-Term Pull Force</h2>
      <p>Every time you tear off a paper towel sheet with one hand, you apply a downward and outward shear force to the mounting plate. Mounting an under-cabinet holder frees valuable countertop prep space, but choosing the wrong mounting method for your cabinet finish is the #1 reason adhesive holders fall off after a few weeks.</p>

      <h2>When Self-Adhesive Mounting Works—and When You Must Drill</h2>
      <div class="table-wrap">
        <table>
          <thead>
            <tr><th>Cabinet / Wall Surface</th><th>Recommended Method</th><th>Why It Matters</th></tr>
          </thead>
          <tbody>
            <tr><td>Smooth glazed ceramic tile, glass, sealed metal, flat laminate</td><td>Self-adhesive (after degreasing &amp; full cure wait)</td><td>Non-porous flat surfaces maximize contact area for adhesive pads.</td></tr>
            <tr><td>Painted drywall, wallpaper, unfinished wood, textured plaster</td><td>Screw-drilling with wall anchors if hollow</td><td>Adhesive bonds only to paint or paper fiber and can peel the surface layer off under load.</td></tr>
            <tr><td>Solid wood under-cabinet frame (homeowners)</td><td>Short wood screws matched to frame thickness</td><td>Zero sag over years of daily tugging; verify cabinet bottom thickness so screws do not poke through inside shelves.</td></tr>
          </tbody>
        </table>
      </div>

      <h2>Verified Dimensions &amp; Specs: niffgaff Aluminum Holder (Observed ASIN B0BSKQW2T2)</h2>
      <p>The <strong>niffgaff Matte Black Under-Cabinet Paper Towel Holder (Model TN2200-BLK-NA 01)</strong> verified on ${esc(VERIFIED_DATE)} is constructed from <strong>aluminum alloy</strong> weighing <strong>5 ounces</strong>, with an overall footprint of <strong>2.56"L × 12.2"W</strong> (a 12.2-inch rail). It supports both <strong>self-adhesive and screw-drilled installation</strong>, in either horizontal under-cabinet or vertical wall-mounted orientations.</p>
      <ul>
        <li><strong>Check roll diameter clearance:</strong> Standard paper towel rolls are roughly 11 inches wide, so a 12.2-inch rail gives room to slide rolls on and off—measure at least 13+ inches of unobstructed side clearance so you can reload rolls without hitting a wall or microwave.</li>
        <li><strong>Check door lip depth:</strong> Many framed upper cabinets have a bottom recess behind the face frame. Measure whether the 2.56-inch bracket sits flush on the underside or requires a shim/spacer strip.</li>
        <li><strong>Why aluminum instead of heavy steel?</strong> At 5 ounces, a lighter bracket reduces baseline downward load when using adhesive on smooth vertical tiles or cabinet sides.</li>
      </ul>
      <p>${renderAffiliateButton(prod2, 'guide_g02_inline', 'Check niffgaff Holder price & color variants on Amazon (paid link)')}</p>
    `,
    faqRows: [
      {
        q: 'What are the verified rail length, material, and weight?',
        a: '12.2 inches wide × 2.56 inches deep (2.56"L × 12.2"W), matte black aluminum, 5 ounces.',
        sourceUrl: 'https://www.amazon.com/dp/B0BSKQW2T2',
        sourceLabel: 'Amazon B0BSKQW2T2'
      },
      {
        q: 'Does it support both adhesive and screw installation?',
        a: 'Yes—the official Amazon listing specifies dual self-adhesive or drilling installation and vertical or horizontal placement.',
        sourceUrl: 'https://www.amazon.com/dp/B0BSKQW2T2',
        sourceLabel: 'Amazon B0BSKQW2T2'
      }
    ]
  });

  // Guide 3: Measure Cabinet for 8-Tier Pot & Pan Organizer
  writeGuide({
    guide: editorialData.published_guides[2],
    productCards: renderProductCard(prod3, '../', 'guide_g03_sidebar'),
    contentHtml: `
      <h2>Why Most Cabinet Pot Organizers Get Returned</h2>
      <p>Tiered cookware racks solve the loudest annoyance in a kitchen—unstacking five pans to grab the skillet on the bottom—but only when they fit inside your actual cabinet opening <em>with the cookware loaded</em>. Buyers routinely measure the rack frame alone and forget to add handle overhang, lid knobs, center stiles, and shelf weight capacity.</p>

      <h2>Step 1: Match Your Cabinet to the Three Verified DIY Layouts</h2>
      <p>On the official listing verified ${esc(VERIFIED_DATE)}, the <strong>ORDORA 8-Tier Adjustable Rack (Model ODR8Tier, Observed ASIN B08DY9HRWD)</strong> supports three tool-free assembly modes using six M-shaped rubber-dipped iron dividers:</p>
      <div class="table-wrap">
        <table>
          <thead>
            <tr><th>DIY Layout Mode</th><th>Verified Rack Footprint (L × W × H)</th><th>Best Cabinet Fit</th></tr>
          </thead>
          <tbody>
            <tr><td><strong>Mode 1: Vertical (Both Sides)</strong></td><td class="mono">21.31" × 9.17" × 16.61"</td><td>Wide base cabinets without a fixed half-shelf. Listing specifies minimum cabinet interior <strong>Width &ge; 24.31"</strong> and <strong>Height &ge; 18.61"</strong>.</td></tr>
            <tr><td><strong>Mode 2: Vertical (One Side)</strong></td><td class="mono">11.75" × 9.17" × 16.61"</td><td>Narrow base cabinets next to a stove or dishwasher where vertical clearance exceeds 18.5".</td></tr>
            <tr><td><strong>Mode 3: Horizontal (One Side)</strong></td><td class="mono">16.61" × 9.17" × 11.75"</td><td>Cabinets with a middle shelf (12"–14" vertical clearance) storing lids, baking sheets, or shallow skillets upright.</td></tr>
          </tbody>
        </table>
      </div>

      <h2>Step 2: Respect the Verified Light-Duty Weight Limit (10 lb per Tier)</h2>
      <div class="callout callout-warn">
        <strong>Critical Buyer Check (<a href="../flagged.html#FLG-06">FLG-06</a>):</strong>
        <ul>
          <li><strong>Light-Duty Rating:</strong> The listing specifies Style <span class="mono">M-16.61"H-LightDuty</span> and <strong>Shelf Weight Capacity: 10 pounds per tier</strong>. It is designed for lightweight aluminum, nonstick, or stainless skillets—not heavy enameled Dutch ovens or stacked cast iron.</li>
          <li><strong>Diameter Spec Mismatch:</strong> The product title says <em>"Fits Lightweight Cookware Up to 11""</em> while Bullet 4 says <em>"up to 12 inches"</em>. Measure your largest skillet rim-to-rim before committing.</li>
          <li><strong>Newer Heavy-Duty Model Noted on Amazon:</strong> Amazon displays a banner pointing to a newer heavy-duty ORDORA model (<span class="mono">B0BYYTQMTR</span>, 20.8"H, rated 120 lbs total) if you own heavy cast iron.</li>
          <li><strong>California Prop 65 Notice:</strong> Present on the official listing.</li>
        </ul>
      </div>

      <h2>Step 3: Check Door Swing and Handle Protrusion</h2>
      <ul>
        <li>Measure from the back wall to the <em>inside face of the closed cabinet door</em>, not the front cabinet edge.</li>
        <li>Add your longest frying-pan handle (typically 6–8 inches beyond the pan rim) and verify handles can angle diagonally without blocking door closure.</li>
        <li>Place heavier sauté pans on the lowest tier to keep the center of gravity anchored.</li>
      </ul>
      <p>${renderAffiliateButton(prod3, 'guide_g03_inline', 'Check ORDORA 8-Tier Organizer price & size options on Amazon (paid link)')}</p>
    `,
    faqRows: [
      {
        q: 'What cabinet interior size does the two-sided vertical layout require?',
        a: 'The official listing specifies cabinet Width >= 24.31 inches and Height >= 18.61 inches for the 21.31"W × 9.17"D × 16.61"H configuration.',
        sourceUrl: 'https://www.amazon.com/dp/B08DY9HRWD',
        sourceLabel: 'Amazon B08DY9HRWD'
      },
      {
        q: 'Can this specific ASIN hold heavy cast-iron Dutch ovens?',
        a: 'Verified listing specs classify B08DY9HRWD as Light-Duty (M-16.61"H-LightDuty) with a 10 lb shelf weight capacity per tier; evaluate heavy-duty alternatives for cast iron.',
        sourceUrl: 'https://www.amazon.com/dp/B08DY9HRWD',
        sourceLabel: 'Amazon B08DY9HRWD'
      }
    ]
  });

  // Guide 4: Renter-Friendly Weekend Kitchen Upgrade Checklist
  writeGuide({
    guide: editorialData.published_guides[3],
    productCards: [prod1, prod2, prod3].map((pr) => renderProductCard(pr, '../', 'guide_g04_sidebar')).join('\n'),
    contentHtml: `
      <h2>Why Sequencing Matters on a Renter-Friendly Weekend Project</h2>
      <p>When upgrading a rental kitchen in a single weekend, doing tasks in the wrong order creates avoidable rework—like sticking an under-cabinet paper towel holder onto a wall you later want to cover with peel-and-stick backsplash tile, or buying a cookware rack before measuring cabinet hinges.</p>

      <h2>The Three-Stage Reversibility Sequence</h2>
      <ol>
        <li><strong>Stage 1 — Wall &amp; Backsplash Surface Prep First:</strong> Clean, degrease, and apply any removable peel-and-stick backsplash or contact paper before mounting hardware. A dedicated basic smoothing kit like the <strong>Art3d Smoothing Tool Kit (B08FKW9JRM)</strong> helps sweep air pockets flat and trim clean edges around outlets.</li>
        <li><strong>Stage 2 — Under-Cabinet Countertop Clearing:</strong> Once wall surfaces are finished and dry, install a lightweight under-cabinet roll holder like the <strong>niffgaff Matte Black Aluminum Holder (B0BSKQW2T2)</strong>. Use self-adhesive only on smooth, clean non-porous surfaces (glazed tile, laminate, metal) and allow full curing time before loading a full roll; skip adhesive on fragile painted drywall.</li>
        <li><strong>Stage 3 — Zero-Drill Lower Cabinet Storage:</strong> Reorganize base cabinets using a freestanding, tool-free rack such as the <strong>ORDORA 8-Tier Adjustable Organizer (B08DY9HRWD)</strong>. Because it requires zero screws or adhesive, it lifts straight out on move-out day—just match your pan weights to its verified 10 lb/tier light-duty ceiling.</li>
      </ol>

      <h2>Pre-Order Measurement Worksheet</h2>
      <div class="table-wrap">
        <table>
          <thead>
            <tr><th>Zone</th><th>Measurements to Take First</th><th>Verified Hardware Reference</th></tr>
          </thead>
          <tbody>
            <tr><td>Backsplash / Wall</td><td>Total linear width, height under upper cabinets, outlet cutout count</td><td>Art3d Smoothing Kit (7.72" × 4.33" × 0.79", 3.52 oz)</td></tr>
            <tr><td>Under-Cabinet Underside</td><td>Flat mounting strip depth (&ge; 2.6"), side clearance (&ge; 13" for reloading 12.2" rail)</td><td>niffgaff Paper Towel Holder (2.56"L × 12.2"W, 5 oz)</td></tr>
            <tr><td>Lower Base Cabinet</td><td>Interior width, usable height below shelf/drawers, closed-door depth, heaviest pan weight</td><td>ORDORA 8-Tier Rack (3 modes; 24.31"W × 18.61"H min for 2-sided vertical; 10 lb/tier)</td></tr>
          </tbody>
        </table>
      </div>
    `,
    faqRows: [
      {
        q: 'Are all three products completely reversible for renters?',
        a: 'The smoothing kit is an installation tool, the ORDORA rack is freestanding/tool-free, and the niffgaff holder offers a no-drill self-adhesive option for smooth surfaces (though test removal on painted wood carefully).',
        sourceUrl: 'https://www.amazon.com/dp/B0BSKQW2T2',
        sourceLabel: 'Amazon B0BSKQW2T2'
      },
      {
        q: 'How do we handle affiliate links across multi-product guides?',
        a: 'Every outbound product link is labeled (paid link) and carries rel="sponsored" per FTC Endorsement Guides and Google Search Central policies.',
        sourceUrl: 'https://developers.google.com/search/docs/crawling-indexing/qualify-outbound-links',
        sourceLabel: 'Google Search Central (S11)'
      }
    ]
  });
}

// ============================================================================
// 4. EXECUTIVE SUMMARY (summary.html)
// ============================================================================
function buildSummaryPage() {
  const subRows = productsData.submitted_links
    .map((s) => {
      const prod = PRODUCTS_BY_ID[s.mapped_product_id];
      const dupBadge = s.duplicate_of
        ? `<span class="pill pill-danger">Duplicate of ${esc(s.duplicate_of)}</span>`
        : `<span class="pill pill-forest">Unique (${esc(s.mapped_product_id)})</span>`;
      return `
        <tr>
          <td class="mono">${esc(s.submission_id)} (Line ${s.line_number})</td>
          <td class="mono">${esc(s.submitted_url)}</td>
          <td>${dupBadge}</td>
          <td class="mono">${esc(s.observed_redirect_asin)}</td>
          <td><span class="blank-cell">Blank — Pending intent confirmation</span></td>
          <td>${esc(prod.editorial_short_name)}</td>
          <td><a href="${esc(s.official_source_url)}" target="_blank" rel="sponsored noopener noreferrer">Amazon ${esc(s.observed_redirect_asin)}</a></td>
        </tr>`;
    })
    .join('\n');

  const bodyHtml = `
    <section class="section">
      <div class="container">
        <nav class="breadcrumbs" aria-label="Breadcrumb"><a href="index.html">Home</a> &rsaquo; Dashboard &amp; Ops &rsaquo; Executive Summary</nav>
        <span class="eyebrow">Executive Summary · Verified ${esc(VERIFIED_DATE)}</span>
        <h1>DIYHOME2 Executive Summary</h1>
        <p class="lead">High-level findings from line-by-line product verification, Amazon Associates 2026 policy compliance, privacy-preserving measurement setup, and manual review gates.</p>

        <div class="grid-4" style="margin: 1.5rem 0;">
          <div class="kpi-card">
            <div class="kpi-label">Submitted Links</div>
            <div class="kpi-value">4</div>
            <div class="kpi-sub">3 unique products + 1 exact duplicate (SUB-03)</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-label">Official Sources Verified</div>
            <div class="kpi-value">${sourcesData.sources.length}</div>
            <div class="kpi-sub">Amazon Associates, FTC, Google &amp; 3 listings</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-label">Flagged for Review</div>
            <div class="kpi-value">${flaggedData.flags.length}</div>
            <div class="kpi-sub"><a href="flagged.html">All published transparently &rarr;</a></div>
          </div>
          <div class="kpi-card">
            <div class="kpi-label">Fabricated Forecasts</div>
            <div class="kpi-value">0</div>
            <div class="kpi-sub">Campaign ledger initialized empty (Priority 4)</div>
          </div>
        </div>

        <h2>1. Submitted Product Links Audit</h2>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Submission</th>
                <th>Submitted Short Link</th>
                <th>Deduplication</th>
                <th>Observed Redirect ASIN</th>
                <th>Intended ASIN</th>
                <th>Observed Product</th>
                <th>Official Source</th>
              </tr>
            </thead>
            <tbody>${subRows}</tbody>
          </table>
        </div>

        <h2 style="margin-top: 2rem;">2. Core Platform Findings &amp; Compliance Posture</h2>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Area</th><th>Verified Finding</th><th>Action Implemented</th><th>Official Source</th></tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Product-Intent Governance</strong></td>
                <td>Submitted <code class="mono">link.amazon</code> tokens are 9-character short tokens, not 10-character ASINs; observed redirects lack <code class="mono">tag=${esc(TRACKING_ID)}</code>.</td>
                <td>Stored observed redirects separately from blank <code class="mono">intended_asin</code> fields; do not claim supplied short links invalid; flagged for Associates Central test.</td>
                <td><a href="https://sell.amazon.com/blog/fba-new-selection-program" target="_blank" rel="noopener noreferrer">Amazon ASIN Definition (S10)</a></td>
              </tr>
              <tr>
                <td><strong>PA-API 5 Deprecation &amp; Price Gate</strong></td>
                <td>PA-API 5.0 is deprecated (HTTP 403) and replaced by <strong>Amazon Creators API</strong>. Static scraped prices, ratings, and images violate Program Policies.</td>
                <td>Left live price, availability, star ratings, and Amazon image URLs blank; built original editorial SVGs and "Check current price on Amazon (paid link)" CTAs.</td>
                <td><a href="https://affiliate-program.amazon.com/creatorsapi/docs/en-us/paapiv5-deprecation" target="_blank" rel="noopener noreferrer">Creators API Notice (S06)</a></td>
              </tr>
              <tr>
                <td><strong>Disclosures &amp; rel="sponsored"</strong></td>
                <td>Amazon Operating Agreement §5 requires verbatim disclosure; FTC requires clear/conspicuous placement; Google requires <code class="mono">rel="sponsored"</code>.</td>
                <td>Added above-the-fold masthead strip + footer disclosure on every page, <code class="mono">(paid link)</code> labels, and automated CI checks in <code class="mono">scripts/verify_site.mjs</code>.</td>
                <td><a href="https://affiliate-program.amazon.com/help/operating/agreement" target="_blank" rel="noopener noreferrer">Operating Agreement (S01)</a></td>
              </tr>
              <tr>
                <td><strong>Commission Schedule (No Forecasts)</strong></td>
                <td>Official Table 1 fixed rates: <strong>Tools / Home Improvement = 3.00%</strong>; <strong>Kitchen = 4.50%</strong>; <strong>Home = 3.00%</strong>. Exact SKU attribution requires first-party report.</td>
                <td>Documented verified schedule rates only; zero invented EPC, conversion rate, or revenue projections.</td>
                <td><a href="https://affiliate-program.amazon.com/help/node/topic/GRXPHT8U84RAYDXZ" target="_blank" rel="noopener noreferrer">Commission Rates Table 1 (S04)</a></td>
              </tr>
              <tr>
                <td><strong>April 2026 Original Content &amp; Review Gate</strong></td>
                <td>Effective April 14, 2026, Amazon mandates original value-added commentary/analysis; Associates review requires &ge;3 qualified sales in 180 days &amp; ~10 original posts.</td>
                <td>Published 4 substantive question-shaped DIY guides + RSS feed + sitemap + biweekly cadence driven by measured queries.</td>
                <td><a href="https://affiliate-program.amazon.com/help/operating/compare" target="_blank" rel="noopener noreferrer">Apr 2026 Changes (S03)</a></td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 style="margin-top: 2rem;">3. Recommended Next Steps (Human-Gated)</h2>
        <div class="card">
          <ol>
            <li>Review <a href="flagged.html">Flagged for Review (${flaggedData.flags.length} items)</a> — confirm intended ASINs and resolve duplicate line 3 (<code class="mono">SUB-03</code>).</li>
            <li>Generate and test one Special Link per product inside Amazon Associates Central / SiteStripe under tracking ID <code class="mono">${esc(TRACKING_ID)}</code> and verify click reporting before scaling.</li>
            <li>Deploy <code class="mono">analytics/endpoint/server.mjs</code>, set the endpoint URL in <code class="mono">&lt;meta name="diyhome-analytics-endpoint"&gt;</code>, and verify the live site in Google Search Console.</li>
            <li>Record authorized first-party metrics into <code class="mono">data/campaign-ledger.json</code> once real traffic arrives, and enroll in Amazon Creators API once eligible.</li>
          </ol>
          <p><a class="btn btn-secondary btn-sm" href="EXECUTIVE_SUMMARY.md">View Raw Markdown (EXECUTIVE_SUMMARY.md)</a></p>
        </div>
      </div>
    </section>
  `;

  writeOut(
    'summary.html',
    renderLayout({
      pagePath: 'summary.html',
      title: 'Executive Summary',
      description: 'Executive summary of verified DIY Home Upgrades products, Amazon Associates 2026 compliance checks, analytics setup, and manual review items.',
      pageType: 'dashboard',
      bodyHtml
    })
  );
}

// ============================================================================
// 5. PRODUCT REGISTER & VERIFICATION DASHBOARD (dashboard.html)
// ============================================================================
function buildDashboardPage() {
  const intentRows = productsData.products
    .map((p) => {
      const obs = p.observed_redirect_target;
      const intent = p.product_intent_confirmation;
      return `
        <tr data-filter-value="${esc(p.category_slug)}">
          <td class="mono"><strong>${esc(p.product_id)}</strong></td>
          <td class="mono">${esc(p.submitted_links.join(', '))}</td>
          <td><span class="blank-cell">${intent.intended_asin ? esc(intent.intended_asin) : 'Blank — Pending confirmation'}</span></td>
          <td><span class="blank-cell">${intent.official_listing_url ? esc(intent.official_listing_url) : 'Blank — Pending confirmation'}</span></td>
          <td><span class="blank-cell">${intent.confirmation_date ? esc(intent.confirmation_date) : 'Blank'}</span></td>
          <td class="mono"><strong>${esc(obs.observed_asin)}</strong><br><span class="paid-hint">Observed ${esc(obs.observed_date_utc)}</span></td>
          <td>${obs.tracking_id_present_in_redirect ? 'Yes' : '<span class="pill pill-warn">No tag in redirect</span>'}</td>
          <td><a href="${esc(obs.observed_canonical_url)}" target="_blank" rel="sponsored noopener noreferrer">Official Listing</a></td>
        </tr>`;
    })
    .join('\n');

  const specRows = productsData.products
    .map((p) => {
      const s = p.verified_listing_specs;
      return `
        <tr data-filter-value="${esc(p.category_slug)}">
          <td><strong>${esc(p.editorial_short_name)}</strong><br><span class="pill">${esc(p.category_label)}</span></td>
          <td>${esc(s.brand)}<br><span class="paid-hint">Seller: ${esc(s.seller_observed)}</span></td>
          <td class="mono">Model: ${esc(s.model_number)}<br>Part: ${esc(s.part_number)}<br>UPC: ${s.upc ? esc(s.upc) : '<span class="blank-cell">Blank</span>'}</td>
          <td>${esc(s.dimensions)}<br><strong>Weight:</strong> ${esc(s.item_weight)}<br><strong>Material:</strong> ${esc(s.material)}</td>
          <td><span class="blank-cell">Blank — Creators API gated</span><br><span class="paid-hint">Price, stock &amp; star rating omitted per S02</span></td>
          <td>${esc(p.commission_schedule_reference.published_schedule_rate)}</td>
          <td><a href="${esc(s.official_source_url)}" target="_blank" rel="sponsored noopener noreferrer">Amazon ${esc(p.observed_redirect_target.observed_asin)}</a><br><a href="${esc(p.commission_schedule_reference.official_source_url)}" target="_blank" rel="noopener noreferrer">Fee Schedule (S04)</a></td>
        </tr>`;
    })
    .join('\n');

  const bodyHtml = `
    <section class="section">
      <div class="container">
        <nav class="breadcrumbs" aria-label="Breadcrumb"><a href="index.html">Home</a> &rsaquo; Dashboard &amp; Ops &rsaquo; Product Register</nav>
        <span class="eyebrow">Verification Dashboard · Line-by-Line Register</span>
        <h1>Product-Intent Confirmation Record &amp; Verified Spec Dashboard</h1>
        <p class="lead">Every submitted link, observed redirect target, verified product specification, and Creators API gated field in clean, filterable tables. Every row cites an official source URL.</p>

        <div class="callout callout-warn">
          <strong>Strict Governance Rule — Do Not Merge Fields:</strong> Product-intent confirmation columns (<em>Intended ASIN, Official Listing URL, Confirmation Date</em>) are intentionally kept separate from <em>Observed Redirect Target</em> columns until confirmed in writing by the site owner.
        </div>

        <h2>Table 1 — Product-Intent Confirmation Record (Separated from Observed Redirects)</h2>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Submitted Short Link(s)</th>
                <th>Intended ASIN</th>
                <th>Confirmed Official URL</th>
                <th>Confirm Date</th>
                <th>Observed Redirect ASIN</th>
                <th>Tag in Redirect?</th>
                <th>Official Source</th>
              </tr>
            </thead>
            <tbody>${intentRows}</tbody>
          </table>
        </div>

        <h2 style="margin-top: 2.25rem;">Table 2 — Verified Product Specifications &amp; API-Gated Fields</h2>
        <div class="table-toolbar">
          <div style="display:flex; flex-wrap:wrap; gap:0.6rem; align-items:center;">
            <label class="sr-only" for="spec-search">Filter products</label>
            <input class="input" id="spec-search" type="search" placeholder="Search brand, ASIN, material..." data-table-filter="spec-table">
            <label class="sr-only" for="spec-cat">Category filter</label>
            <select class="select" id="spec-cat" data-table-select="spec-table">
              <option value="">All categories</option>
              <option value="wall-backsplash-tools">Wall &amp; Backsplash Tools</option>
              <option value="kitchen-organization">Kitchen Storage &amp; Organization</option>
            </select>
          </div>
          <span class="paid-hint" data-table-count="spec-table"></span>
        </div>

        <div class="table-wrap">
          <table id="spec-table">
            <thead>
              <tr>
                <th>Product &amp; Category</th>
                <th>Brand &amp; Observed Seller</th>
                <th>Verified Identifiers</th>
                <th>Verified Specs</th>
                <th>Live Price &amp; Ratings</th>
                <th>Published Fee Schedule</th>
                <th>Official Sources</th>
              </tr>
            </thead>
            <tbody>${specRows}</tbody>
          </table>
        </div>
      </div>
    </section>
  `;

  writeOut(
    'dashboard.html',
    renderLayout({
      pagePath: 'dashboard.html',
      title: 'Product Register & Verification Dashboard',
      description: 'Searchable verification tables separating product-intent confirmation records from observed redirect targets and official product specifications.',
      pageType: 'dashboard',
      bodyHtml
    })
  );
}

// ============================================================================
// 6. COMPLIANCE GATE & OFFICIAL SOURCES (compliance.html)
// ============================================================================
function buildCompliancePage() {
  const sourceRows = sourcesData.sources
    .map(
      (s) => `
      <tr data-filter-value="${esc(s.category)}">
        <td class="mono"><strong>${esc(s.source_id)}</strong></td>
        <td><span class="pill">${esc(s.category)}</span></td>
        <td><strong>${esc(s.title)}</strong><br><span class="paid-hint">${esc(s.publisher)}</span></td>
        <td>${esc(s.key_requirement_verified)}</td>
        <td class="mono">${esc(s.verified_date_utc)}</td>
        <td><a href="${esc(s.url)}" target="_blank" rel="${externalRelFor(s.url)}">Official Link &nearr;</a></td>
      </tr>`
    )
    .join('\n');

  const bodyHtml = `
    <section class="section">
      <div class="container">
        <nav class="breadcrumbs" aria-label="Breadcrumb"><a href="index.html">Home</a> &rsaquo; Dashboard &amp; Ops &rsaquo; Compliance &amp; Sources</nav>
        <span class="eyebrow">Priority 5 · Compliance Gate &amp; Trustworthy Machinery</span>
        <h1>Compliance Policy Register &amp; Official Sources</h1>
        <p class="lead">Automate the checks that can be verified programmatically, and put an explicit human approval gate in front of every policy or commercial decision that cannot.</p>

        <h2 id="api-gate">Automated Compliance Gate vs. Human-Gated Controls</h2>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Control</th><th>Automation Mode</th><th>Enforcement Mechanism</th><th>Official Policy Basis</th></tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Above-the-fold &amp; footer disclosure</strong></td>
                <td><span class="pill pill-forest">Automated CI Gate</span></td>
                <td><code class="mono">scripts/verify_site.mjs</code> fails build if verbatim statement is missing from masthead or footer of any HTML page.</td>
                <td><a href="https://affiliate-program.amazon.com/help/operating/agreement" target="_blank" rel="noopener noreferrer">Operating Agreement §5 (S01)</a></td>
              </tr>
              <tr>
                <td><strong>Sponsored outbound links</strong></td>
                <td><span class="pill pill-forest">Automated CI Gate</span></td>
                <td>Checks every <code class="mono">amazon.com</code> / <code class="mono">link.amazon</code> link for <code class="mono">rel="sponsored"</code> and non-cloaked Amazon URLs.</td>
                <td><a href="https://developers.google.com/search/docs/crawling-indexing/qualify-outbound-links" target="_blank" rel="noopener noreferrer">Google Search Central (S11)</a></td>
              </tr>
              <tr>
                <td><strong>No static prices, ratings, or scraped images</strong></td>
                <td><span class="pill pill-forest">Automated CI Gate</span></td>
                <td>Blocks hotlinked Amazon CDN image URLs and static price/star-rating strings until Amazon Creators API is enrolled.</td>
                <td><a href="https://affiliate-program.amazon.com/help/operating/policies" target="_blank" rel="noopener noreferrer">Program Policies (S02)</a> · <a href="https://affiliate-program.amazon.com/creatorsapi/docs/en-us/paapiv5-deprecation" target="_blank" rel="noopener noreferrer">Creators API (S06)</a></td>
              </tr>
              <tr>
                <td><strong>Product-intent separation</strong></td>
                <td><span class="pill pill-forest">Automated CI Gate</span></td>
                <td>Asserts <code class="mono">intended_asin</code> and <code class="mono">observed_redirect_target</code> remain distinct fields in <code class="mono">data/products.json</code>.</td>
                <td><a href="https://sell.amazon.com/blog/fba-new-selection-program" target="_blank" rel="noopener noreferrer">ASIN Definition (S10)</a></td>
              </tr>
              <tr>
                <td><strong>Special Link test &amp; tracking confirmation</strong></td>
                <td><span class="pill pill-warn">Human-Gated</span></td>
                <td>Site owner tests 1 link per product inside Amazon Associates Central (<code class="mono">${esc(TRACKING_ID)}</code>) and confirms clicks in first-party reports.</td>
                <td><a href="https://affiliate-program.amazon.com/help/node/topic/G8TW5AE9XL2VX9VM" target="_blank" rel="noopener noreferrer">Associates Review (S09)</a></td>
              </tr>
              <tr>
                <td><strong>Original editorial value (no thin affiliation)</strong></td>
                <td><span class="pill pill-warn">Human + Editorial Review</span></td>
                <td>Question-shaped guides provide measurement checklists, surface trade-offs, and honest caveats rather than copied merchant blurbs.</td>
                <td><a href="https://affiliate-program.amazon.com/help/operating/compare" target="_blank" rel="noopener noreferrer">Apr 2026 Policy Update (S03)</a> · <a href="https://developers.google.com/search/docs/essentials/spam-policies" target="_blank" rel="noopener noreferrer">Google Spam Policies (S12)</a></td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 style="margin-top: 2.25rem;">Official Trusted Source Register (${sourcesData.sources.length} Verified Sources)</h2>
        <div class="table-toolbar">
          <div style="display:flex; flex-wrap:wrap; gap:0.6rem; align-items:center;">
            <label class="sr-only" for="source-search">Search sources</label>
            <input class="input" id="source-search" type="search" placeholder="Search source ID, policy, publisher..." data-table-filter="source-table">
          </div>
          <span class="paid-hint" data-table-count="source-table"></span>
        </div>
        <div class="table-wrap">
          <table id="source-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Category</th>
                <th>Document &amp; Publisher</th>
                <th>Verified Requirement / Fact</th>
                <th>Verified</th>
                <th>Official Source</th>
              </tr>
            </thead>
            <tbody>${sourceRows}</tbody>
          </table>
        </div>
      </div>
    </section>
  `;

  writeOut(
    'compliance.html',
    renderLayout({
      pagePath: 'compliance.html',
      title: 'Compliance Gate & Official Sources',
      description: 'Verified Amazon Associates 2026 policy register, FTC Endorsement Guides, Google rel=sponsored rules, and automated compliance gates.',
      pageType: 'dashboard',
      bodyHtml
    })
  );
}

// ============================================================================
// 7. ANALYTICS & EMPTY CAMPAIGN LEDGER (analytics.html)
// ============================================================================
function buildAnalyticsPage() {
  const cadenceRows = editorialData.planned_cadence_backlog
    .map(
      (c) => `
      <tr>
        <td class="mono">${esc(c.target_window)}</td>
        <td><strong>${esc(c.working_title)}</strong></td>
        <td>${esc(c.selection_gate)}</td>
        <td><a href="https://developers.google.com/search/docs/essentials/spam-policies" target="_blank" rel="noopener noreferrer">Google Helpful Content / Spam Policy (S12)</a></td>
      </tr>`
    )
    .join('\n');

  const bodyHtml = `
    <section class="section">
      <div class="container">
        <nav class="breadcrumbs" aria-label="Breadcrumb"><a href="index.html">Home</a> &rsaquo; Dashboard &amp; Ops &rsaquo; Analytics &amp; Ledger</nav>
        <span class="eyebrow">Priority 4 · Evidence-Based Iteration</span>
        <h1>Privacy-Preserving Analytics &amp; Campaign Ledger</h1>
        <p class="lead">Click and engagement measurement is active on every page with zero cookies and zero PII. The campaign ledger starts strictly empty until authorized first-party reports arrive.</p>

        <h2>Live Browser Instrumentation — The Five Defined Events</h2>
        <p>The counts below show real events captured in <em>your current browser session</em> by <code class="mono">assets/js/analytics.js</code>. Zero synthetic or fabricated traffic numbers are shown.</p>

        <div class="grid-4" id="live-event-counts" style="margin-bottom: 1rem;">
          <div class="kpi-card"><div class="kpi-label">page_view</div><div class="kpi-value" data-event-count="page_view">0</div><div class="kpi-sub">Guide &amp; catalog visits</div></div>
          <div class="kpi-card"><div class="kpi-label">disclosure_viewed</div><div class="kpi-value" data-event-count="disclosure_viewed">0</div><div class="kpi-sub">Masthead &amp; footer visibility</div></div>
          <div class="kpi-card"><div class="kpi-label">outbound_affiliate_click</div><div class="kpi-value" data-event-count="outbound_affiliate_click">0</div><div class="kpi-sub">Tracked Amazon CTA clicks</div></div>
          <div class="kpi-card"><div class="kpi-label">guide_scroll_depth / capture</div><div class="kpi-value"><span data-event-count="guide_scroll_depth">0</span> / <span data-event-count="reader_capture_intent">0</span></div><div class="kpi-sub">Scroll milestones / RSS &amp; questions</div></div>
        </div>

        <div class="card" style="margin-bottom: 1.25rem;">
          <h3>Self-Hosted Analytics Collector Endpoint</h3>
          <p>GitHub Pages serves static assets only. Deploy the included zero-dependency collector (<code class="mono">analytics/endpoint/server.mjs</code>) on your preferred host, then set its <code class="mono">POST /events</code> URL below for testing or permanently inside <code class="mono">&lt;meta name="diyhome-analytics-endpoint"&gt;</code>. See <a href="analytics/collector-spec.json">analytics/collector-spec.json</a>.</p>
          <form id="analytics-endpoint-form" class="capture-form">
            <label class="sr-only" for="analytics-endpoint-input">Self-hosted analytics endpoint URL</label>
            <input class="input" id="analytics-endpoint-input" type="url" placeholder="https://analytics.yourdomain.example/events">
            <button class="btn btn-forest btn-sm" type="submit">Save Browser Endpoint</button>
            <button class="btn btn-secondary btn-sm" type="button" id="export-local-events">Export Local NDJSON</button>
            <button class="btn btn-secondary btn-sm" type="button" id="clear-local-events">Clear Local Log</button>
          </form>
          <p class="paid-hint" id="analytics-endpoint-status" style="margin-top:0.5rem;"></p>
        </div>

        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Timestamp (UTC)</th><th>Event</th><th>Path</th><th>Non-PII Payload</th></tr>
            </thead>
            <tbody id="live-events-tbody">
              <tr><td colspan="4"><em>Loading local browser telemetry...</em></td></tr>
            </tbody>
          </table>
        </div>

        <h2 style="margin-top: 2.25rem;">Campaign Ledger (Authorized First-Party Provenance Only)</h2>
        <div class="callout callout-forest">
          <strong>Strict Evidence Policy:</strong> ${esc(ledgerData.governance_policy)} Source file: <a href="data/campaign-ledger.json">data/campaign-ledger.json</a>.
        </div>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Timestamp (UTC)</th>
                <th>Source</th>
                <th>Channel</th>
                <th>Eligible Sessions</th>
                <th>Outbound Clicks</th>
                <th>Reported Orders</th>
                <th>Authorized Report Ref</th>
                <th>Provenance Note</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colspan="8">
                  <span class="blank-cell">0 authorized first-party report rows recorded</span>
                  — Add entries only from verified self-hosted analytics exports and <a href="https://affiliate-program.amazon.com/help/operating/policies" target="_blank" rel="noopener noreferrer">Amazon Associates Central earnings/tracking reports (S02)</a>. No conversion score or revenue forecast is presented.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 style="margin-top: 2.25rem;">Search Console &amp; Question-Driven Publishing Cadence</h2>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Cadence Window</th><th>Working Editorial Hypothesis</th><th>Measurement Selection Gate</th><th>Official Guidance</th></tr>
            </thead>
            <tbody>${cadenceRows}</tbody>
          </table>
        </div>
      </div>
    </section>
  `;

  writeOut(
    'analytics.html',
    renderLayout({
      pagePath: 'analytics.html',
      title: 'Analytics & Campaign Ledger',
      description: 'Privacy-preserving 5-event click counter, self-hosted collector specification, and empty provenance-tracked campaign ledger.',
      pageType: 'dashboard',
      bodyHtml
    })
  );
}

// ============================================================================
// 8. FLAGGED FOR REVIEW (flagged.html)
// ============================================================================
function buildFlaggedPage() {
  const rows = flaggedData.flags
    .map((f) => {
      const sevClass = f.severity === 'High' ? 'pill-danger' : f.severity === 'Medium' ? 'pill-warn' : 'pill';
      return `
        <tr id="${esc(f.flag_id)}" data-filter-value="${esc(f.severity)}">
          <td class="mono"><strong>${esc(f.flag_id)}</strong><br><span class="pill ${sevClass}">${esc(f.severity)}</span></td>
          <td><strong>${esc(f.category)}</strong><br><span class="paid-hint">${esc(f.item_ref)}</span></td>
          <td><strong>${esc(f.issue)}</strong><br>${esc(f.observed_evidence)}</td>
          <td>${esc(f.action_taken_on_site)}</td>
          <td>${esc(f.required_manual_action)}</td>
          <td><a href="${esc(f.official_source_url)}" target="_blank" rel="${externalRelFor(f.official_source_url)}">Official Source &nearr;</a><br><span class="pill pill-warn">${esc(f.status)}</span></td>
        </tr>`;
    })
    .join('\n');

  const bodyHtml = `
    <section class="section">
      <div class="container">
        <nav class="breadcrumbs" aria-label="Breadcrumb"><a href="index.html">Home</a> &rsaquo; Dashboard &amp; Ops &rsaquo; Flagged for Review</nav>
        <span class="eyebrow">Manual Review Queue · Zero Hallucinations Policy</span>
        <h1>Flagged for Review (${flaggedData.flags.length} Items)</h1>
        <p class="lead">${esc(flaggedData.policy_note)}</p>

        <div class="table-toolbar">
          <div style="display:flex; flex-wrap:wrap; gap:0.6rem; align-items:center;">
            <label class="sr-only" for="flag-search">Search flagged items</label>
            <input class="input" id="flag-search" type="search" placeholder="Search flag ID, ASIN, issue..." data-table-filter="flagged-table">
            <label class="sr-only" for="flag-sev">Filter severity</label>
            <select class="select" id="flag-sev" data-table-select="flagged-table">
              <option value="">All severities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <span class="paid-hint" data-table-count="flagged-table"></span>
        </div>

        <div class="table-wrap">
          <table id="flagged-table">
            <thead>
              <tr>
                <th>Flag ID</th>
                <th>Category &amp; Item</th>
                <th>Issue &amp; Observed Evidence</th>
                <th>How Handled on Live Site</th>
                <th>Required Manual Action</th>
                <th>Official Source &amp; Status</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </div>
    </section>
  `;

  writeOut(
    'flagged.html',
    renderLayout({
      pagePath: 'flagged.html',
      title: 'Flagged for Review',
      description: 'Transparent manual review register listing duplicate submissions, unconfirmed product-intent ASINs, spec discrepancies, and Creators API gates with official sources.',
      pageType: 'dashboard',
      bodyHtml
    })
  );
}

// ============================================================================
// 9. ABOUT / EDITORIAL STANDARDS (about.html)
// ============================================================================
function buildAboutPage() {
  const bodyHtml = `
    <section class="section">
      <div class="container">
        <nav class="breadcrumbs" aria-label="Breadcrumb"><a href="index.html">Home</a> &rsaquo; Editorial Standards</nav>
        <span class="eyebrow">Authorship, Transparency &amp; Methodology</span>
        <h1>How DIY Home Upgrades Journal Researches &amp; Verifies Products</h1>
        <p class="lead">Readers deserve to know who wrote a guide, where every dimension came from, and how affiliate commissions work—without hunting through fine print.</p>

        <div class="grid-2" style="margin-top: 1.5rem;">
          <div class="card">
            <h2>Editorial Desk &amp; Authorship</h2>
            <p>All buying guides on this site are authored and maintained by the <strong>DIYHOME2 Editorial Desk</strong> using a measurement-first editorial standard: we lead with homeowner and renter trade-offs—cabinet clearances, mounting surfaces, and load ceilings—before recommending hardware.</p>
            <p>We do not invent hands-on test results we have not performed, we do not copy merchant descriptions verbatim, and we explicitly flag internal listing contradictions whenever official product pages disagree with themselves.</p>
          </div>
          <div class="card">
            <h2>Affiliate Disclosure &amp; Independence</h2>
            <p><strong>${esc(VERBATIM_DISCLOSURE)}</strong> Every outbound product link is tagged with <code class="mono">rel="sponsored"</code> and labeled <code class="mono">(paid link)</code>.</p>
            <p>We never display static scraped prices or star ratings in violation of Amazon Associates Program Policies, and we never fabricate conversion scores or revenue projections. Inspect our full audit trail in the <a href="compliance.html">Compliance &amp; Sources Register</a> and <a href="flagged.html">Flagged for Review</a>.</p>
          </div>
        </div>
      </div>
    </section>
  `;

  writeOut(
    'about.html',
    renderLayout({
      pagePath: 'about.html',
      title: 'Editorial Standards & Authorship',
      description: 'Authorship, measurement-first methodology, affiliate disclosure standards, and zero-hallucination verification policy.',
      activeNav: 'about',
      pageType: 'about',
      bodyHtml
    })
  );
}

// ============================================================================
// 10. FINDABILITY: sitemap.xml, feed.xml, robots.txt, .nojekyll
// ============================================================================
function buildFindabilityFiles() {
  const allPages = [
    'index.html',
    'categories/wall-backsplash-tools.html',
    'categories/kitchen-organization.html',
    'guides/index.html',
    ...editorialData.published_guides.map((g) => g.url),
    'about.html',
    'summary.html',
    'dashboard.html',
    'compliance.html',
    'analytics.html',
    'flagged.html'
  ];

  const sitemapUrls = allPages
    .map((p) => {
      const loc = p === 'index.html' ? BASE_URL : BASE_URL + p;
      const priority = p === 'index.html' ? '1.0' : p.startsWith('guides/') || p.startsWith('categories/') ? '0.8' : '0.6';
      return `  <url>
    <loc>${xmlEsc(loc)}</loc>
    <lastmod>${VERIFIED_DATE}</lastmod>
    <priority>${priority}</priority>
  </url>`;
    })
    .join('\n');

  writeOut(
    'sitemap.xml',
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls}
</urlset>
`
  );

  const rfc822Date = 'Fri, 20 Nov 2026 12:00:00 GMT';
  const feedItems = editorialData.published_guides
    .map(
      (g) => `    <item>
      <title>${xmlEsc(g.title)}</title>
      <link>${xmlEsc(BASE_URL + g.url)}</link>
      <guid isPermaLink="true">${xmlEsc(BASE_URL + g.url)}</guid>
      <pubDate>${rfc822Date}</pubDate>
      <category>${xmlEsc(g.category)}</category>
      <description>${xmlEsc(g.excerpt + ' (Affiliate disclosure: ' + VERBATIM_DISCLOSURE + ')')}</description>
    </item>`
    )
    .join('\n');

  writeOut(
    'feed.xml',
    `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${xmlEsc(SITE_NAME)}</title>
    <link>${xmlEsc(BASE_URL)}</link>
    <description>${xmlEsc('Measurement-first DIY Home Upgrades buyer guides and verified hardware picks. ' + VERBATIM_DISCLOSURE)}</description>
    <language>en-us</language>
    <lastBuildDate>${rfc822Date}</lastBuildDate>
    <atom:link href="${xmlEsc(BASE_URL + 'feed.xml')}" rel="self" type="application/rss+xml" />
${feedItems}
  </channel>
</rss>
`
  );

  writeOut(
    'robots.txt',
    `User-agent: *
Allow: /

Sitemap: ${BASE_URL}sitemap.xml
`
  );

  writeOut('.nojekyll', '');
}

buildIndexPage();
buildCategoryPages();
buildGuides();
buildSummaryPage();
buildDashboardPage();
buildCompliancePage();
buildAnalyticsPage();
buildFlaggedPage();
buildAboutPage();
buildFindabilityFiles();

console.log('Built all DIYHOME2 static HTML pages, sitemap.xml, feed.xml, robots.txt, and .nojekyll successfully.');
