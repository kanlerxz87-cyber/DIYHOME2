#!/usr/bin/env node
/**
 * DIY Home Upgrades — static site generator.
 *
 * No dependencies. Reads data/*.json and writes a complete static site to
 * the repository root, which is served directly by GitHub Pages on `main`.
 *
 * Build:  node scripts/build.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const read = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), "utf8"));
const productsData = read("data/products.json");
const linksData = read("data/links.json");
const sourcesData = read("data/sources.json");
const ledgerData = read("data/campaign-ledger.json");
const guidesData = read("data/guides.json");
const flagsData = read("data/flags.json");

const SITE = productsData.site;
const SOURCES = Object.fromEntries(sourcesData.sources.map((s) => [s.id, s]));
const PRODUCTS = productsData.products;
const CATEGORIES = productsData.categories;

/* ------------------------------------------------------------------ */
/* helpers                                                             */
/* ------------------------------------------------------------------ */

const esc = (s = "") =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const attr = esc;

/** Relative-prefix aware URL. Pages are always written as directory/index.html. */
const url = (p) => `${SITE.base_url}/${p}`.replace(/\/+$/, "/");

/**
 * Source citation.
 *
 * Two kinds of source URL are treated differently, deliberately:
 *
 *  - Policy, guidance and standards documents (affiliate-program.amazon.com,
 *    ftc.gov, ecfr.gov, sell.amazon.com) are ordinary hyperlinks. They are not
 *    product pages and are not affiliate links, so no tag is involved.
 *
 *  - Amazon PRODUCT pages and link.amazon redirectors are rendered as plain
 *    text URLs, not anchors. A citation is evidence, not an offer, so styling it
 *    as a sponsored affiliate link would misrepresent it to the reader. Leaving
 *    it unlinked also means the site contains no untagged Amazon product link at
 *    all, which keeps it clear of the requirement that every Amazon link placed
 *    on a site must be a properly tagged Special Link. The full URL is still
 *    printed, so it can be copied and checked by hand.
 */
function cite(id, label) {
  const s = SOURCES[id];
  if (!s) throw new Error(`Unknown source id: ${id}`);
  const text = label || id;
  const title = `${s.title} — ${s.publisher}${s.access === "restricted" ? " (sign-in required; establishes nothing)" : ""}`;
  const isProductUrl = /^https:\/\/(www\.)?amazon\.com\/dp\/|^https:\/\/link\.amazon\//.test(s.url);

  if (isProductUrl) {
    return `<span class="src"><span title="${attr(title)}">${esc(text)}</span> <code style="font-size:10.5px;word-break:break-all">${esc(s.url)}</code></span>`;
  }
  return `<span class="src"><a href="${attr(s.url)}" title="${attr(title)}" rel="noopener">${esc(text)}</a></span>`;
}

/** Renders a value cell. Nothing is ever invented: blank stays blank and is flagged. */
function valueCell(value, { source, mono = false } = {}) {
  const inner =
    value === undefined || value === null || value === ""
      ? `<span class="empty-value">not verifiable</span> <span class="pill pill-gap">unverified</span>`
      : esc(value);
  const cls = mono && value ? ' class="num"' : "";
  const src = source ? ` ${cite(source)}` : "";
  return `<td${cls}>${inner}${src}</td>`;
}

function statusPill(status) {
  const map = {
    verified: ["pill-ok", "verified"],
    "needs review": ["pill-review", "needs review"],
    unverified: ["pill-gap", "unverified"],
    gap: ["pill-gap", "gap"],
    "not verifiable": ["pill-gap", "not verifiable"],
    empty: ["pill-neutral", "empty by design"],
    "empty by design": ["pill-neutral", "empty by design"],
    confirmed: ["pill-ok", "confirmed"],
    blocked: ["pill-gap", "blocked"],
  };
  const [cls, text] = map[status] || ["pill-neutral", status];
  return `<span class="pill ${cls}">${esc(text)}</span>`;
}

/* ------------------------------------------------------------------ */
/* shared chrome                                                       */
/* ------------------------------------------------------------------ */

const NAV = [
  ["shop/", "Shop"],
  ["guides/", "Guides"],
  ["register/", "Register"],
  ["how-we-verify/", "How we verify"],
];

function masthead(current) {
  const links = NAV.map(
    ([href, label]) =>
      `<a href="${url(href)}"${current === href ? ' aria-current="page"' : ""}>${esc(label)}</a>`
  ).join("");
  return `
<header class="masthead">
  <div class="wrap masthead-inner">
    <p class="wordmark">
      <a href="${url("")}">DIY Home Upgrades</a>
      <span class="tm">An independently published product journal</span>
    </p>
    <nav class="nav" aria-label="Primary">${links}</nav>
  </div>
</header>
<div class="disclosure-strip" role="note" aria-label="Affiliate disclosure">
  <div class="wrap">
    <strong>${esc(SITE.disclosure)}</strong>
    <span>Every product link is a sponsored link and opens Amazon.com. We are paid a commission, never paid for a review.</span>
    <a href="${url("disclosure/")}">Read the full disclosure</a>
  </div>
</div>`;
}

function footer() {
  const cats = CATEGORIES.map(
    (c) => `<li><a href="${url(`categories/${c.slug}/`)}">${esc(c.name)}</a></li>`
  ).join("");
  const guides = guidesData.guides
    .map((g) => `<li><a href="${url(`guides/${g.slug}/`)}">${esc(g.short_title)}</a></li>`)
    .join("");

  return `
<div class="foot-disclosure">
  <div class="wrap">
    <strong>${esc(SITE.disclosure)}</strong>
    &nbsp;This statement appears on every page of this site, as required by §5 of the Amazon Associates Program Operating Agreement, and is repeated here in the footer.
    <a href="${url("disclosure/")}">Disclosure</a> ·
    <a href="${url("how-we-verify/")}">How we verify</a>
  </div>
</div>
<footer class="foot">
  <div class="wrap">
    <div class="foot-main">
      <div>
        <p class="about"><strong>DIY Home Upgrades</strong> is an independently published product journal about small, practical home improvements. We publish fewer products than a shopping site, and we show our working.</p>
        <p class="about" style="margin-top:12px"><a href="${url("feed.xml")}" class="rss-link">Subscribe to the feed</a></p>
      </div>
      <div>
        <h4>Shop</h4>
        <ul>${cats}<li><a href="${url("shop/")}">All products</a></li><li><a href="${url("register/")}">Full register</a></li></ul>
      </div>
      <div>
        <h4>Editorial</h4>
        <ul>${guides}<li><a href="${url("guides/")}">All guides</a></li></ul>
      </div>
      <div>
        <h4>Transparency</h4>
        <ul>
          <li><a href="${url("how-we-verify/")}">How we verify</a></li>
          <li><a href="${url("sources/")}">Source library</a></li>
          <li><a href="${url("flagged/")}">Flagged for review</a></li>
          <li><a href="${url("signals/")}">Measurement</a></li>
          <li><a href="${url("ledger/")}">Campaign ledger</a></li>
          <li><a href="${url("media-kit/")}">About &amp; media kit</a></li>
          <li><a href="${url("privacy/")}">Privacy</a></li>
          <li><a href="${url("terms/")}">Terms</a></li>
          <li><a href="${url("colophon/")}">Colophon</a></li>
          <li><a href="${url("search/")}">Search</a></li>
          <li><a href="${url("index.xml")}">Sitemap index</a></li>
        </ul>
      </div>
    </div>
    <div class="foot-bottom">
      <span>© 2026 DIY Home Upgrades. Published 20 November 2026.</span>
      <span>Amazon and the Amazon logo are trademarks of Amazon.com, Inc. or its affiliates. This site is not endorsed by Amazon.</span>
    </div>
  </div>
</footer>`;
}

function layout({ title, description, path: p, body, jsonLd = [], current = "", ogType = "website" }) {
  const canonical = url(p);
  const ld = jsonLd
    .map((o) => `<script type="application/ld+json">${JSON.stringify(o)}</script>`)
    .join("\n");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${attr(description)}">
<link rel="canonical" href="${attr(canonical)}">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta property="og:type" content="${attr(ogType)}">
<meta property="og:site_name" content="${attr(SITE.name)}">
<meta property="og:title" content="${attr(title)}">
<meta property="og:description" content="${attr(description)}">
<meta property="og:url" content="${attr(canonical)}">
<meta name="twitter:card" content="summary">
<meta name="theme-color" content="#faf8f4">
<link rel="stylesheet" href="${url("assets/site.css")}">
<link rel="alternate" type="application/rss+xml" title="${attr(SITE.name)}" href="${url("feed.xml")}">
<link rel="sitemap" type="application/xml" href="${url("sitemap.xml")}">
${ld}
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
${masthead(current)}
<main id="main">
${body}
</main>
${footer()}
<script src="${url("assets/js/analytics.js")}" data-endpoint="" defer></script>
</body>
</html>
`;
}

function write(p, html) {
  const full = path.join(ROOT, p);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, html);
  return p;
}

/* ------------------------------------------------------------------ */
/* structured data                                                     */
/* ------------------------------------------------------------------ */

const orgLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE.name,
  url: url(""),
  description: SITE.tagline,
};
const siteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE.name,
  url: url(""),
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", urlTemplate: url("search/?q={search_term_string}") },
    "query-input": "required name=search_term_string",
  },
};

/* ------------------------------------------------------------------ */
/* pages                                                               */
/* ------------------------------------------------------------------ */

const written = [];

/* ---------- home ---------- */
function homePage() {
  const cards = PRODUCTS.map((prod) => {
    const cat = CATEGORIES.find((c) => c.slug === prod.category);
    return `
    <article class="card">
      <span class="kicker">${esc(cat.name)}</span>
      <h3><a href="${url(`products/${prod.slug}/`)}">${esc(prod.name)}</a></h3>
      <p class="lead">${esc(prod.lead)}</p>
      <div class="card-foot">
        <span class="asin">ASIN ${esc(prod.asin)}</span>
        <a href="${url(`products/${prod.slug}/`)}" aria-label="Read the ${esc(prod.name)} entry">Read →</a>
      </div>
    </article>`;
  }).join("");

  const catLinks = CATEGORIES.map(
    (c) => `
    <article class="card">
      <span class="kicker">${esc(c.kicker)}</span>
      <h3><a href="${url(`categories/${c.slug}/`)}">${esc(c.name)}</a></h3>
      <p class="lead">${esc(c.blurb)}</p>
      <div class="card-foot">
        <span class="asin">browse node ${esc(c.browse_node)}</span>
        <a href="${url(`categories/${c.slug}/`)}">Browse →</a>
      </div>
    </article>`
  ).join("");

  const guideLinks = guidesData.guides
    .map(
      (g) => `
    <article class="card">
      <span class="kicker">${esc(g.kicker)}</span>
      <h3><a href="${url(`guides/${g.slug}/`)}">${esc(g.title)}</a></h3>
      <p class="lead">${esc(g.standfirst)}</p>
      <div class="card-foot">
        <span class="asin">${g.reading_minutes} min read</span>
        <a href="${url(`guides/${g.slug}/`)}">Read →</a>
      </div>
    </article>`
    )
    .join("");

  const verified = PRODUCTS.length;
  const body = `
<section class="hero">
  <div class="wrap">
    <p class="eyebrow">Issue one · November 2026</p>
    <h1>Small upgrades that make a room feel finished.</h1>
    <p class="standfirst">We started with three things we could actually check: a kit that makes peel-and-stick wallpaper behave, a paper towel rail that installs without drilling, and a pots-and-pans rack that gives you your cabinet back. Each entry names what we verified, what we could not, and where the source lives.</p>
    <div class="cta-row">
      <a class="btn" href="${url("shop/")}">Browse the three products</a>
      <a class="btn btn-ghost" href="${url("guides/")}">Read the buying guides</a>
    </div>
    <div class="hero-meta">
      <div><b>${verified}</b><span>products, each with a source</span></div>
      <div><b>${sourcesData.sources.filter((s) => s.access === "public").length}</b><span>official sources read</span></div>
      <div><b>0</b><span>prices shown &mdash; see why</span></div>
      <div><b>1</b><span>required disclosure, on every page</span></div>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="section-head">
      <h2>On the workbench</h2>
      <p>Three products. No padding, no affiliate-farm filler. Every specification is linked to the page it came from.</p>
    </div>
    <div class="grid grid-3">${cards}</div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="section-head">
      <h2>Shop by room</h2>
      <a href="${url("shop/")}">All products →</a>
    </div>
    <div class="grid grid-3">${catLinks}</div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="section-head">
      <h2>Buying guides</h2>
      <p>Question-shaped, answerable, and written before any product was chosen.</p>
      <a href="${url("guides/")}">All guides →</a>
    </div>
    <div class="grid grid-2">${guideLinks}</div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="lede-split">
      <div>
        <p class="eyebrow">What this site is</p>
        <h2 style="font-family:var(--serif);font-size:30px;line-height:1.15;margin:0 0 16px;font-weight:600;letter-spacing:-0.01em">A shop with its receipts attached.</h2>
        <p>Most affiliate sites ask you to trust a star rating. We cannot legally reproduce Amazon star ratings without API access, and we will not quote prices we cannot keep current. So the pages look different: a specification table you can audit, a plain statement of what the product is for, and an equally plain statement of what we were unable to check.</p>
        <p><a href="${url("how-we-verify/")}">How verification works on this site →</a></p>
      </div>
      <div>
        <div class="stat-row">
          <div class="stat"><b>3</b><span>unique products</span></div>
          <div class="stat"><b>4</b><span>links submitted</span></div>
          <div class="stat"><b>0</b><span>verified ASIN intentions</span></div>
          <div class="stat"><b>3</b><span>items flagged for review</span></div>
        </div>
        <div class="note note-warn" style="margin-top:20px">
          <h4>Open item</h4>
          <p>None of the three submitted short links could be confirmed inside the enrolled Associates workflow, so no link is recorded as a validated Special Link yet. The destinations below are recorded as <em>observed</em>, not as intended. <a href="${url("flagged/")}">See the flags →</a></p>
        </div>
      </div>
    </div>
  </div>
</section>
`;
  return layout({
    title: `${SITE.name} — small, verified upgrades for the rooms you live in`,
    description:
      "An independently published product journal about practical home improvements. Three products, each with a sourced specification table, plain-spoken buying guides, and the affiliate disclosure on every page.",
    path: "",
    body,
    jsonLd: [orgLd, siteLd],
  });
}

/* ---------- shop ---------- */
function shopPage() {
  const rows = PRODUCTS.map((prod) => {
    const cat = CATEGORIES.find((c) => c.slug === prod.category);
    return `
      <tr data-name="${attr((prod.name + " " + prod.brand + " " + cat.name).toLowerCase())}">
        <td><a href="${url(`products/${prod.slug}/`)}">${esc(prod.name)}</a><span class="sub">${esc(prod.brand)}</span></td>
        <td>${esc(cat.name)}</td>
        ${valueCell(prod.asin, { source: prod.listing_source, mono: true })}
        <td>${esc(prod.lead)}</td>
        <td><a class="btn btn-sm btn-ghost" href="${url(`products/${prod.slug}/`)}">Read</a></td>
      </tr>`;
  }).join("");

  const body = `
<section class="hero" style="padding-bottom:32px">
  <div class="wrap">
    <p class="eyebrow">The shop</p>
    <h1>Three products, chosen slowly.</h1>
    <p class="standfirst">Everything we currently cover. Filtering happens in your browser — nothing is sent anywhere. Each row links to its own sourced page.</p>
  </div>
</section>
<section class="section">
  <div class="wrap">
    <div class="filter">
      <label for="q" class="sr-only" style="position:absolute;left:-9999px">Filter products</label>
      <input id="q" type="search" placeholder="Filter by name, brand or room…" autocomplete="off">
      <span class="count" id="count">${PRODUCTS.length} products</span>
    </div>
    <div class="table-wrap">
      <table id="shop-table">
        <caption>All products on this site. Specification sources are on each product page.</caption>
        <thead>
          <tr><th scope="col">Product</th><th scope="col">Room</th><th scope="col">ASIN</th><th scope="col">What it is for</th><th scope="col"></th></tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
    <p style="font-size:13px;color:var(--ink-3);margin-top:14px">No prices are shown. Associates Program Participation Requirements §2(b) only permit price display when Amazon serves the link or the data comes from the Product Advertising API. Neither is true here, so the price you see at Amazon is the price that applies. ${cite("S02")}</p>
  </div>
</section>
`;
  return layout({
    title: `Shop — every product we cover | ${SITE.name}`,
    description: "Three hand-checked home improvement products with sourced specification tables. No prices, no star ratings, no filler.",
    path: "shop/",
    body,
    current: "shop/",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Products covered by DIY Home Upgrades",
        itemListElement: PRODUCTS.map((prod, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: url(`products/${prod.slug}/`),
          name: prod.name,
        })),
      },
    ],
  });
}

/* ---------- category ---------- */
function categoryPage(cat) {
  const items = PRODUCTS.filter((p) => p.category === cat.slug);
  const cards = items
    .map(
      (prod) => `
    <article class="card">
      <span class="kicker">${esc(prod.brand)}</span>
      <h3><a href="${url(`products/${prod.slug}/`)}">${esc(prod.name)}</a></h3>
      <p class="lead">${esc(prod.dek)}</p>
      <div class="card-foot">
        <span class="asin">ASIN ${esc(prod.asin)}</span>
        <a href="${url(`products/${prod.slug}/`)}">Read →</a>
      </div>
    </article>`
    )
    .join("");

  const related = guidesData.guides.filter((g) => g.category === cat.slug);

  const body = `
<section class="hero" style="padding-bottom:34px">
  <div class="wrap">
    <p class="breadcrumb"><a href="${url("")}">Home</a><span>/</span><a href="${url("shop/")}">Shop</a><span>/</span>${esc(cat.name)}</p>
    <p class="eyebrow">${esc(cat.kicker)}</p>
    <h1>${esc(cat.name)}</h1>
    <p class="standfirst">${esc(cat.blurb)}</p>
    <p style="font-size:13px;color:var(--ink-3);margin:0">Amazon category: ${esc(cat.browse_path)} &nbsp;${cite(cat.source)}</p>
  </div>
</section>
<section class="section">
  <div class="wrap">
    <div class="grid grid-3">${cards}</div>
    ${
      related.length
        ? `<div class="section-head" style="margin-top:40px"><h2 style="font-size:22px">Related guides</h2></div>
           <ul>${related.map((g) => `<li><a href="${url(`guides/${g.slug}/`)}">${esc(g.title)}</a></li>`).join("")}</ul>`
        : ""
    }
  </div>
</section>
`;
  return layout({
    title: `${cat.name} — sourced product entries | ${SITE.name}`,
    description: cat.blurb,
    path: `categories/${cat.slug}/`,
    body,
    current: "shop/",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: cat.name,
        description: cat.blurb,
        url: url(`categories/${cat.slug}/`),
      },
    ],
  });
}

/* ---------- product ---------- */
function productPage(prod) {
  const cat = CATEGORIES.find((c) => c.slug === prod.category);
  const link = linksData.links.find((l) => l.id === prod.submitted_link_id);

  const specRows = prod.specs
    .map((s) => {
      const src = s.label === "ASIN" || s.label === "Brand" ? prod.listing_source : prod.listing_source;
      return `<div class="spec-row"><dt>${esc(s.label)}</dt><dd class="${s.label === "ASIN" ? "mono" : ""}">${esc(s.value)}</dd></div>`;
    })
    .join("");

  const goodFor = prod.good_for.map((x) => `<li>${esc(x)}</li>`).join("");
  const thinkAbout = prod.think_about.map((x) => `<li>${esc(x)}</li>`).join("");

  const body = `
<section class="product-head">
  <div class="wrap">
    <p class="breadcrumb"><a href="${url("")}">Home</a><span>/</span><a href="${url(`categories/${cat.slug}/`)}">${esc(cat.name)}</a><span>/</span>${esc(prod.brand)}</p>
    <p class="eyebrow">${esc(prod.kicker)}</p>
    <h1>${esc(prod.name)}</h1>
    <p class="dek">${esc(prod.dek)}</p>
    <div class="cta-row">
      <a class="btn" href="${attr(prod.listing_url)}" rel="sponsored nofollow noopener" target="_blank" data-asin="${attr(prod.asin)}" data-position="product-hero">Check the current price at Amazon <span aria-hidden="true">↗</span></a>
      <a class="btn btn-ghost" href="#specs">Jump to specifications</a>
    </div>
    <p style="font-size:12px;color:var(--ink-3);margin:12px 0 0;max-width:70ch">Sponsored link. Opens Amazon.com in a new tab. ${esc(SITE.disclosure)}</p>
  </div>
</section>

<div class="wrap">
  <div class="columns">
    <div class="prose">
      <p style="font-size:18px;color:var(--ink-2)">${esc(prod.lead)}</p>

      <h2 id="specs">What the listing actually says</h2>
      <p>These values are transcribed from the Amazon product detail page, not paraphrased. Where the listing does not state something, the row says so rather than guessing.</p>
      <div class="table-wrap">
        <table>
          <caption>Specifications for ASIN ${esc(prod.asin)} — source: the Amazon detail page itself ${cite(prod.listing_source)}</caption>
          <thead><tr><th scope="col">Field</th><th scope="col">Value</th><th scope="col">Source</th></tr></thead>
          <tbody>
            ${prod.specs
              .map(
                (s) => `<tr><th scope="row" style="font-weight:500;color:var(--ink-3)">${esc(s.label)}</th>${valueCell(
                  s.value,
                  { source: prod.listing_source, mono: s.label === "ASIN" }
                )}<td>${cite(prod.listing_source, "Amazon listing")}</td></tr>`
              )
              .join("")}
          </tbody>
        </table>
      </div>

      ${
        prod.kit_contents
          ? `<h2>What is in the box</h2><ul>${prod.kit_contents.map((k) => `<li>${esc(k)}</li>`).join("")}</ul><p style="font-size:13px;color:var(--ink-3)">Bundled contents quoted from the listing. ${cite(prod.listing_source)}</p>`
          : ""
      }

      <h2>Who it suits</h2>
      <ul>${goodFor}</ul>

      <h2>What to think about first</h2>
      <ul>${thinkAbout}</ul>

      <h2>What we could not verify</h2>
      <div class="note note-gap">
        <h4>Stated plainly</h4>
        <p>${esc(prod.cant_tell)}</p>
        <p style="margin-top:8px">We did not test this product. Nothing on this page is a hands-on measurement, and no durability, longevity or performance claim is made anywhere on the site.</p>
      </div>

      <h2>How to read the price</h2>
      <p>There is no price on this page, and that is deliberate. Amazon's Participation Requirements §2(b) allow a site to show prices only when Amazon serves the link carrying that data, or when the data is pulled through the Product Advertising API. This site does neither, so the listing is the only place to see the number that will actually apply. The same rules bar price tracking and price alerting (§2(y)). ${cite("S02")}</p>

      <h2>Link provenance</h2>
      <p>This entry was supplied as a shortened link. The code and the destination did not match, so both are published side by side and neither is treated as the other.</p>
      <div class="table-wrap">
        <table>
          <caption>Intent and observation are recorded in separate fields and are never merged.</caption>
          <thead><tr><th scope="col">Field</th><th scope="col">Value</th><th scope="col">Source</th></tr></thead>
          <tbody>
            <tr><th scope="row" style="font-weight:500;color:var(--ink-3)">Submitted link</th><td class="num">${esc(link.submitted_url)}</td><td>${cite(link.observed_source, "resolution test")}</td></tr>
            <tr><th scope="row" style="font-weight:500;color:var(--ink-3)">Submitted code</th><td class="num">${esc(link.submitted_code)} <span class="sub">${link.submitted_code_length} characters — an ASIN is 10 ${cite("S06")}</span></td><td>${cite("S06")}</td></tr>
            <tr><th scope="row" style="font-weight:500;color:var(--ink-3)">Intended ASIN</th>${valueCell(link.intended_asin, { mono: true })}<td><span class="pill pill-gap">not confirmed</span></td></tr>
            <tr><th scope="row" style="font-weight:500;color:var(--ink-3)">Confirmation date</th>${valueCell(link.confirmation_date)}<td><span class="pill pill-gap">not confirmed</span></td></tr>
            <tr><th scope="row" style="font-weight:500;color:var(--ink-3)">Observed destination</th><td class="num">${esc(link.observed_redirect_target)}</td><td>${cite(link.observed_source)}</td></tr>
            <tr><th scope="row" style="font-weight:500;color:var(--ink-3)">Observed ASIN</th><td class="num">${esc(link.observed_asin)}</td><td>${cite(link.observed_source)}</td></tr>
            <tr><th scope="row" style="font-weight:500;color:var(--ink-3)">Observed date</th><td class="num">${esc(link.observed_on)}</td><td>${cite(link.observed_source)}</td></tr>
            <tr><th scope="row" style="font-weight:500;color:var(--ink-3)">Tracking tag seen</th><td>None observed</td><td>${cite(link.observed_source)}</td></tr>
          </tbody>
        </table>
      </div>
      <p><a href="${url("flagged/")}">This link is on the Flagged for Review page →</a></p>
    </div>

    <aside>
      <div class="spec-box">
        <h3>At a glance</h3>
        <dl>
          <div class="spec-row"><dt>Brand</dt><dd>${esc(prod.brand)}</dd></div>
          <div class="spec-row"><dt>ASIN</dt><dd class="mono">${esc(prod.asin)}</dd></div>
          <div class="spec-row"><dt>Category</dt><dd>${esc(cat.kicker)}</dd></div>
          <div class="spec-row"><dt>Sold by</dt><dd>${esc(prod.seller)}</dd></div>
          <div class="spec-row"><dt>Fulfilment</dt><dd>${esc(prod.fulfilment)}</dd></div>
          <div class="spec-row"><dt>Rating shown</dt><dd>None <span class="pill pill-neutral" style="margin-left:4px">by policy</span></dd></div>
          <div class="spec-row"><dt>Price shown</dt><dd>None <span class="pill pill-neutral" style="margin-left:4px">by policy</span></dd></div>
        </dl>
      </div>
      <div class="buy-box">
        <p class="meta">Listed by <b>${esc(prod.seller)}</b>, shipped by <b>${esc(prod.fulfilment)}</b>.</p>
        <a class="btn" href="${attr(prod.listing_url)}" rel="sponsored nofollow noopener" target="_blank" data-asin="${attr(prod.asin)}" data-position="product-sidebar">View at Amazon <span aria-hidden="true">↗</span></a>
        <p class="fine"><strong>${esc(SITE.disclosure)}</strong> Sponsored link. We earn a commission if you buy, at no extra cost to you. Price and availability change constantly — the listing is authoritative.</p>
      </div>
      <div class="note" style="font-size:13px">
        <h4>Why no star rating?</h4>
        <p>Participation Requirements §2(t) prohibit displaying Amazon customer reviews or star ratings unless they were obtained through the Creators API or Product Advertising API. This site has no API enrolment, so it shows none. ${cite("S02")}</p>
      </div>
    </aside>
  </div>
</div>
`;
  return layout({
    title: `${prod.name} — ${prod.brand} ${prod.asin} | ${SITE.name}`,
    description: prod.lead,
    path: `products/${prod.slug}/`,
    ogType: "article",
    body,
    current: "shop/",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "Product",
        name: prod.name,
        sku: prod.asin,
        brand: { "@type": "Brand", name: prod.brand },
        category: cat.name,
        description: prod.lead,
        url: url(`products/${prod.slug}/`),
        offers: {
          "@type": "Offer",
          url: prod.listing_url,
          availability: "https://schema.org/InStock",
          // Price deliberately omitted: it cannot be kept accurate, and the
          // Associates policies restrict showing it. An empty price is honest;
          // an invented one would not be.
        },
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: url("") },
          { "@type": "ListItem", position: 2, name: cat.name, item: url(`categories/${cat.slug}/`) },
          { "@type": "ListItem", position: 3, name: prod.name, item: url(`products/${prod.slug}/`) },
        ],
      },
    ],
  });
}

/* ---------- guides ---------- */
function guidesIndex() {
  const cards = guidesData.guides
    .map(
      (g) => `
    <article class="card">
      <span class="kicker">${esc(g.kicker)}</span>
      <h3><a href="${url(`guides/${g.slug}/`)}">${esc(g.title)}</a></h3>
      <p class="lead">${esc(g.standfirst)}</p>
      <div class="card-foot">
        <span class="asin">${g.reading_minutes} min read</span>
        <a href="${url(`guides/${g.slug}/`)}">Read →</a>
      </div>
    </article>`
    )
    .join("");

  const hypotheses = guidesData.hypotheses
    .map(
      (h) => `
      <tr>
        <td>${esc(h.title)}<span class="sub">${esc(h.note)}</span></td>
        <td>${statusPill(h.status)}</td>
        <td>${esc(h.reason)}</td>
      </tr>`
    )
    .join("");

  const body = `
<section class="hero" style="padding-bottom:34px">
  <div class="wrap">
    <p class="eyebrow">Guides</p>
    <h1>Questions first, products second.</h1>
    <p class="standfirst">Each guide starts from a question a person would actually type. The four below are grounded in the three products this site has verified. Four further titles were proposed earlier; they are listed honestly at the bottom because we could not write them without inventing product facts.</p>
  </div>
</section>
<section class="section">
  <div class="wrap">
    <div class="grid grid-2">${cards}</div>
  </div>
</section>
<section class="section">
  <div class="wrap">
    <div class="section-head">
      <h2 style="font-size:22px">Editorial hypotheses we set aside</h2>
      <p>Working titles, not claims about popularity, search volume or product quality.</p>
    </div>
    <div class="table-wrap">
      <table>
        <caption>Proposed titles that cannot be published honestly with the current catalogue.</caption>
        <thead><tr><th scope="col">Proposed working title</th><th scope="col">Status</th><th scope="col">Why</th></tr></thead>
        <tbody>${hypotheses}</tbody>
      </table>
    </div>
  </div>
</section>
`;
  return layout({
    title: `Buying guides — question-shaped, sourced | ${SITE.name}`,
    description: "Four question-shaped buying guides on wallpaper tools, paper towel holders and pots and pans organizers, each linked to an official source.",
    path: "guides/",
    body,
    current: "guides/",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Buying guides",
        url: url("guides/"),
      },
    ],
  });
}

function guidePage(g) {
  const prod = PRODUCTS.find((p) => p.slug === g.featured_product);
  const sections = g.sections
    .map(
      (s) => `
      <h2 id="${attr(s.id)}">${esc(s.heading)}</h2>
      ${s.paragraphs.map((p) => `<p>${p}</p>`).join("")}
      ${s.list ? `<ul>${s.list.map((l) => `<li>${l}</li>`).join("")}</ul>` : ""}
      ${s.note ? `<div class="note"><h4>${esc(s.note.heading)}</h4><p>${s.note.body}</p></div>` : ""}
    `
    )
    .join("");

  const toc = g.sections
    .map((s) => `<li><a href="#${attr(s.id)}">${esc(s.heading)}</a></li>`)
    .join("");

  const body = `
<section class="guide-head">
  <div class="wrap">
    <p class="breadcrumb"><a href="${url("")}">Home</a><span>/</span><a href="${url("guides/")}">Guides</a><span>/</span>${esc(g.kicker)}</p>
    <p class="eyebrow">${esc(g.kicker)}</p>
    <h1>${esc(g.title)}</h1>
    <p class="standfirst">${esc(g.standfirst)}</p>
    <p class="byline"><span>Published ${esc(g.published)}</span><span>${g.reading_minutes} min read</span><span>Reviewed against official sources</span></p>
    <p style="font-size:12px;color:var(--ink-3);margin:0">${esc(SITE.disclosure)}</p>
  </div>
</section>
<div class="wrap">
  <div class="columns">
    <div class="prose">
      <div class="note" style="margin-top:0">
        <h4>What this guide is</h4>
        <p>${esc(g.summary)}</p>
      </div>
      ${sections}

      ${
        prod
          ? `<h2>Where this leaves you</h2>
             <p>The only product this site has verified in this category is the <a href="${url(`products/${prod.slug}/`)}">${esc(prod.name)}</a>. It is one option, not a recommendation against everything else — we have not tested the alternatives.</p>`
          : ""
      }

      <h2>Sources for this guide</h2>
      <ul>${g.sources.map((id) => `<li>${cite(id, SOURCES[id].title)} — ${esc(SOURCES[id].publisher)}</li>`).join("")}</ul>

      <hr class="rule">
      <p style="font-size:13px;color:var(--ink-3)">${esc(SITE.disclosure)} This guide contains no paid placement. Products are linked because they are on this site's register, not because a brand paid for the mention.</p>
    </div>
    <aside>
      <div class="spec-box">
        <h3>In this guide</h3>
        <ul style="margin:0;padding:12px 16px 16px;list-style:none;display:grid;gap:9px;font-size:14px">
          ${toc}
        </ul>
      </div>
      ${
        prod
          ? `<div class="buy-box">
               <p class="meta">Product in this guide</p>
               <p style="margin:0 0 12px;font-weight:600;font-size:15px"><a href="${url(`products/${prod.slug}/`)}">${esc(prod.name)}</a></p>
               <a class="btn" href="${attr(prod.listing_url)}" rel="sponsored nofollow noopener" target="_blank" data-asin="${attr(prod.asin)}" data-position="guide-sidebar">View at Amazon <span aria-hidden="true">↗</span></a>
               <p class="fine"><strong>${esc(SITE.disclosure)}</strong> Sponsored link.</p>
             </div>`
          : ""
      }
      <div class="note" style="font-size:13px">
        <h4>Measurement</h4>
        <p>This page records five defined events so we can tell whether the guide answered the question. Nothing identifies you. <a href="${url("signals/")}">What is measured →</a></p>
      </div>
    </aside>
  </div>
</div>
`;
  return layout({
    title: `${g.title} | ${SITE.name}`,
    description: g.standfirst,
    path: `guides/${g.slug}/`,
    ogType: "article",
    body,
    current: "guides/",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: g.title,
        description: g.standfirst,
        datePublished: g.published,
        dateModified: g.published,
        author: { "@type": "Organization", name: SITE.name, url: url("") },
        publisher: { "@type": "Organization", name: SITE.name, url: url("") },
        mainEntityOfPage: url(`guides/${g.slug}/`),
        about: g.kicker,
      },
    ],
  });
}

/* ---------- register (master table) ---------- */
function registerPage() {
  const rows = PRODUCTS.map((prod) => {
    const cat = CATEGORIES.find((c) => c.slug === prod.category);
    return `
      <tr>
        <td><a href="${url(`products/${prod.slug}/`)}">${esc(prod.name)}</a></td>
        <td>${esc(prod.brand)}</td>
        ${valueCell(prod.asin, { mono: true })}
        <td>${cite(prod.listing_source)}</td>
        <td>${esc(cat.name)}</td>
        <td>${statusPill("needs review")}</td>
        <td>${statusPill("unverified")}</td>
        <td>${statusPill("unverified")}</td>
        <td><a href="${url(`products/${prod.slug}/`)}">Entry</a></td>
      </tr>`;
  }).join("");

  const body = `
<section class="hero" style="padding-bottom:30px">
  <div class="wrap">
    <p class="eyebrow">The register</p>
    <h1>Every row, every gap.</h1>
    <p class="standfirst">This is the whole site in one table. A blank cell means the value could not be confirmed from an official source — it is never filled in from inference.</p>
  </div>
</section>
<section class="section">
  <div class="wrap">
    <div class="table-wrap">
      <table>
        <caption>Product register — 20 November 2026. Source column links to the official page each ASIN was read from.</caption>
        <thead>
          <tr>
            <th scope="col">Product</th>
            <th scope="col">Brand</th>
            <th scope="col">ASIN</th>
            <th scope="col">Source</th>
            <th scope="col">Category</th>
            <th scope="col">Special Link validated</th>
            <th scope="col">Price verified</th>
            <th scope="col">Rating verified</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
    <div class="note note-warn" style="margin-top:24px">
      <h4>Why three columns say unverified</h4>
      <p><strong>Special Link validated</strong> requires confirming the destination and the tracking report inside the enrolled Associates workflow. That requires account access this build does not have. <strong>Price verified</strong> and <strong>Rating verified</strong> are blocked by the same access gap and, for ratings, by §2(t) of the Participation Requirements. ${cite("S02")}</p>
    </div>
    <p style="font-size:13px;color:var(--ink-3)">Machine-readable copy of this table: <a href="${url("data/register.json")}">register.json</a>, <a href="${url("data/register.csv")}">register.csv</a>.</p>
  </div>
</section>
`;
  return layout({
    title: `Product register — every row, every gap | ${SITE.name}`,
    description: "The complete product register with an official source on every row. Unconfirmed values are left blank and flagged, never inferred.",
    path: "register/",
    body,
    current: "register/",
  });
}

/* ---------- sources ---------- */
function sourcesPage() {
  const rows = sourcesData.sources
    .map((s) => {
      const isProductUrl = /^https:\/\/(www\.)?amazon\.com\/dp\/|^https:\/\/link\.amazon\//.test(s.url);
      const doc = isProductUrl
        ? `${esc(s.title)}<span class="sub" style="word-break:break-all"><code style="font-size:11px">${esc(s.url)}</code> — plain-text URL, not linked (see note below)</span>`
        : `<a href="${attr(s.url)}" rel="noopener">${esc(s.title)}</a><span class="sub">${esc(s.section)}</span>`;
      return `
      <tr>
        <td class="num"><strong>${esc(s.id)}</strong></td>
        <td>${doc}</td>
        <td>${esc(s.publisher)}</td>
        <td>${esc(s.updated_on_page)}</td>
        <td>${statusPill(s.access === "public" ? "verified" : "blocked")}</td>
        <td>${s.establishes.startsWith("NOTHING") ? '<span class="empty-value">establishes nothing</span>' : esc(s.establishes)}</td>
      </tr>`;
    })
    .join("");

  const body = `
<section class="hero" style="padding-bottom:30px">
  <div class="wrap">
    <p class="eyebrow">Source library</p>
    <h1>The receipts.</h1>
    <p class="standfirst">Every factual claim on this site resolves to one of these pages. Sources marked blocked were attempted and could not be read; they establish nothing and are listed so the gap is visible rather than hidden.</p>
    <p style="font-size:13px;color:var(--ink-3);margin:0">All sources retrieved ${esc(sourcesData.checked_at)}.</p>
  </div>
</section>
<section class="section">
  <div class="wrap">
    <div class="table-wrap">
      <table>
        <caption>Official sources read for this build. Links open the publisher's own page.</caption>
        <thead><tr><th scope="col">ID</th><th scope="col">Document</th><th scope="col">Publisher</th><th scope="col">Dated on page</th><th scope="col">Access</th><th scope="col">What it establishes</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
    <div class="note" style="margin-top:26px">
      <h4>Why some source URLs are printed instead of linked</h4>
      <p>Policy, guidance and standards documents are ordinary hyperlinks — they are not product pages and involve no affiliate tag. Amazon <em>product</em> pages and the <code>link.amazon</code> redirectors are printed as plain text so they can be copied into a browser for manual review.</p>
      <p>That choice is not cosmetic. Linking an untagged Amazon product URL would place an Amazon link on the site that is not a Special Link, and the Participation Requirements require the Associates ID to appear in the URL of every link placed on the site. Printing the URL keeps the evidence intact while keeping the site clear of that rule. Product pages that the reader is invited to visit appear elsewhere, and every one of those is tagged <code>rel="sponsored"</code>. ${cite("S02")}</p>
    </div>
  </div>
</section>
`;
  return layout({
    title: `Source library — every claim, receipted | ${SITE.name}`,
    description: "The official Amazon, FTC and eCFR documents behind every factual claim on this site, including the ones that could not be read.",
    path: "sources/",
    body,
  });
}

/* ---------- how we verify ---------- */
function howWeVerifyPage() {
  const body = `
<section class="hero" style="padding-bottom:30px">
  <div class="wrap">
    <p class="eyebrow">Method</p>
    <h1>How verification works here.</h1>
    <p class="standfirst">Five rules, applied to every row on the site. They are the reason some cells are empty.</p>
  </div>
</section>
<section class="section">
  <div class="wrap">
    <div class="prose">
      <h2>1. A claim needs a document, not a memory</h2>
      <p>Every fact in a specification table was read on the page named in the source column. Product facts come from the Amazon detail page for that ASIN. Policy facts come from Amazon's Associates pages, the FTC's guidance or the eCFR. If a document could not be opened, the claim is not made.</p>

      <h2>2. Blank beats plausible</h2>
      <p>If a value cannot be confirmed, the cell is left empty and marked <span class="pill pill-gap">unverified</span>. Filling a gap with what a similar product usually costs, weighs or measures would be a fabrication, and it is the failure mode this project exists to avoid.</p>

      <h2>3. Intended and observed are never merged</h2>
      <p>A short link tells you what someone meant to send. It does not tell you where the link goes, and those two things can disagree. Each submitted link therefore gets two separate sets of fields — intended ASIN, official listing URL, confirmation date and source; and observed redirect target, observed ASIN and observation date. Neither set is ever used to fill the other. ${cite("S06")}</p>

      <h2>4. Policy is quoted, not summarised from memory</h2>
      <p>Where a rule drives a design decision — no prices, no star ratings, disclosure on every page, links not routed through this domain — the rule is quoted and linked. The <a href="${url("sources/")}">source library</a> holds the full list with the date each page states.</p>

      <h2>5. What we do not do</h2>
      <ul>
        <li>We do not claim to have tested a product. Nothing here is a hands-on measurement.</li>
        <li>We do not reproduce amazon star ratings or review text. ${cite("S02")}</li>
        <li>We do not display prices or offer price alerts. ${cite("S02")}</li>
        <li>We do not publish traffic, conversion or earnings figures we cannot source to a first-party report. ${cite("S02")}</li>
        <li>We do not route outbound links through this domain. There is no cloaking, no redirect hop, and no JavaScript interstitial. ${cite("S02")}</li>
      </ul>

      <blockquote>“All Special Links must be accessed directly from your Site.” — Amazon Associates Program Policies, Participation Requirements §2(b)</blockquote>

      <h2>What a validated Special Link would require</h2>
      <p>Amazon's own definition is mechanical: a Special Link is a link that “properly use[s] the special ‘tagged' link formats we provide”. Validation therefore needs two things that cannot be done from outside an account: confirming the destination resolves to the intended product, and confirming the click appears in the Associates tracking report. ${cite("S01")} Neither is claimed here.</p>
    </div>
  </div>
</section>
`;
  return layout({
    title: `How we verify — method and limits | ${SITE.name}`,
    description: "Five verification rules: a claim needs a document, blank beats plausible, intended and observed stay separate, policy is quoted, and limits are stated.",
    path: "how-we-verify/",
    body,
    current: "how-we-verify/",
  });
}

/* ---------- signals / measurement ---------- */
function signalsPage() {
  const events = productsData.analytics_events
    .map(
      (e) => `
      <tr>
        <td><code>${esc(e.name)}</code></td>
        <td>${esc(e.fires)}</td>
        <td>${e.fields.map((f) => `<code>${esc(f)}</code>`).join(" ")}</td>
        <td>${esc(e.why)}</td>
      </tr>`
    )
    .join("");

  const body = `
<section class="hero" style="padding-bottom:30px">
  <div class="wrap">
    <p class="eyebrow">Measurement</p>
    <h1>Five events, no cookies.</h1>
    <p class="standfirst">The site measures five things and nothing else. There is no third-party tag, no cookie banner because there are no cookies, and no user identifier. The endpoint ships empty: it is yours to self-host.</p>
  </div>
</section>
<section class="section">
  <div class="wrap">
    <div class="table-wrap">
      <table>
        <caption>The five defined events. Field names are the exact keys sent in the payload.</caption>
        <thead><tr><th scope="col">Event</th><th scope="col">Fires when</th><th scope="col">Fields</th><th scope="col">Why</th></tr></thead>
        <tbody>${events}</tbody>
      </table>
    </div>

    <div class="prose" style="margin-top:40px">
      <h2>What the counter does and does not do</h2>
      <p>The outbound counter sends a single <code>POST</code> to the endpoint with a JSON body, then lets your browser navigate straight to Amazon. The click is never routed through this domain, which matters twice over: cloaking a Special Link is prohibited, and a redirect hop on this domain could be read as an intermediate site. ${cite("S02")}</p>
      <p>Why a beacon rather than an image pixel: the payload survives navigation, and the browser has no opportunity to cancel it. The request is sent with <code>keepalive</code>, credentials omitted, and no referrer beyond the origin.</p>

      <h2>Honest status</h2>
      <div class="note note-warn">
        <h4>No endpoint is configured</h4>
        <p>The analytics script ships with an empty <code>data-endpoint</code>. Until you point it at a collector you host, the five events are emitted to the console and discarded. The site therefore reports <strong>no</strong> measurement today, and claims none.</p>
      </div>

      <h2>What this measurement cannot tell you</h2>
      <ul>
        <li>It cannot tell you whether a click became a sale. Only Amazon's Associates reports can, and those require account access.</li>
        <li>Its click count is a different measurement from Amazon's reported clicks and must never be added to it.</li>
        <li>It cannot support a conversion rate, an earnings estimate or a revenue forecast. The <a href="${url("ledger/")}">campaign ledger</a> explains how reported figures are to be recorded when they arrive.</li>
      </ul>

      <h2>Respecting the visitor</h2>
      <ul>
        <li>No cookies, no localStorage, no fingerprinting, no cross-site identifiers.</li>
        <li><code>Do Not Track</code> and <code>Global Privacy Control</code> are honoured; when either is set, nothing is sent.</li>
        <li>IP addresses are not stored by the reference collector.</li>
        <li>No data is shared with, or sold to, anyone.</li>
      </ul>
    </div>
  </div>
</section>
`;
  return layout({
    title: `Measurement — five events, no cookies | ${SITE.name}`,
    description: "A privacy-preserving outbound click counter and four supporting events, with a self-hosted endpoint and no cookies or user identifiers.",
    path: "signals/",
    body,
  });
}

/* ---------- ledger ---------- */
function ledgerPage() {
  const cols = ledgerData.columns
    .map(
      (c) => `
      <tr>
        <td class="num"><code>${esc(c.key)}</code></td>
        <td>${esc(c.label)}</td>
        <td>${esc(c.type)}</td>
        <td>${c.required ? "Required" : "Optional"}</td>
        <td>${esc(c.note)}</td>
      </tr>`
    )
    .join("");

  const body = `
<section class="hero" style="padding-bottom:30px">
  <div class="wrap">
    <p class="eyebrow">Campaign ledger</p>
    <h1>An empty ledger, fully defined.</h1>
    <p class="standfirst">Six columns, strict provenance, zero rows. No conversion score and no revenue forecast is presented anywhere on this site, because no authorised first-party report has been supplied.</p>
    <div class="stat-row" style="margin-top:26px">
      <div class="stat"><b>0</b><span>rows recorded</span></div>
      <div class="stat"><b>6</b><span>defined columns</span></div>
      <div class="stat"><b>0</b><span>conversion scores</span></div>
      <div class="stat"><b>0</b><span>revenue forecasts</span></div>
    </div>
  </div>
</section>
<section class="section">
  <div class="wrap">
    <div class="table-wrap">
      <table>
        <caption>Ledger schema. Timestamp, source, channel, eligible sessions, clicks and reported orders — added only from an authorised report.</caption>
        <thead><tr><th scope="col">Key</th><th scope="col">Column</th><th scope="col">Type</th><th scope="col">Required</th><th scope="col">Note</th></tr></thead>
        <tbody>${cols}</tbody>
      </table>
    </div>

    <h2 style="font-family:var(--serif);font-size:24px;margin:36px 0 12px">The ledger, as it stands</h2>
    <div class="table-wrap">
      <table>
        <caption>Current contents of data/campaign-ledger.json</caption>
        <thead>${ledgerData.columns.map((c) => `<th scope="col">${esc(c.label)}</th>`).join("")}</thead>
        <tbody>
          <tr><td colspan="${ledgerData.columns.length}" style="text-align:center;padding:32px;color:var(--ink-3);font-style:italic">No rows. No authorised first-party report has been provided.</td></tr>
        </tbody>
      </table>
    </div>

    <div class="prose" style="margin-top:34px">
      <h2>Provenance rules</h2>
      <ul>${ledgerData.prohibitions.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>
      <h2>Why this is the right way round</h2>
      <p>It is easy to publish a dashboard that looks like it is working: a rising line, a conversion percentage, an earnings projection. Every one of those numbers would be invented, because the underlying reports sit behind an Associates sign-in. An empty table with a strict schema is less exciting and it is true.</p>
      <h2>Where the numbers will come from</h2>
      <p>Two authorised Amazon reports and the site's own counter, kept apart on purpose:</p>
      <ul>
        <li><strong>Associates click report</strong> — supplies <code>clicks</code>, per link and per day.</li>
        <li><strong>Associates earnings report</strong> — supplies <code>reported_orders</code>.</li>
        <li><strong>This site's counter</strong> — supplies outbound intent only. It is recorded in a different place and never summed with Amazon's numbers.</li>
      </ul>
      <p style="font-size:13px;color:var(--ink-3)">Schema also available as <a href="${url("data/campaign-ledger.json")}">campaign-ledger.json</a>.</p>
    </div>
  </div>
</section>
`;
  return layout({
    title: `Campaign ledger — empty by design | ${SITE.name}`,
    description: "A defined, empty campaign ledger: timestamp, source, channel, eligible sessions, clicks and reported orders, added only from authorised first-party reports.",
    path: "ledger/",
    body,
  });
}

/* ---------- flagged for review ---------- */
function flaggedPage() {
  const rows = flagsData.flags
    .map(
      (f) => `
      <tr id="${attr(f.id)}">
        <td class="num"><strong>${esc(f.id)}</strong></td>
        <td>${esc(f.title)}<span class="sub">${esc(f.area)}</span></td>
        <td>${statusPill(f.severity === "high" ? "needs review" : f.severity === "blocking" ? "blocked" : "needs review")}</td>
        <td>${esc(f.detail)}</td>
        <td>${esc(f.action)}</td>
        <td>${f.sources.map((s) => cite(s)).join(" ")}</td>
      </tr>`
    )
    .join("");

  const body = `
<section class="hero" style="padding-bottom:30px">
  <div class="wrap">
    <p class="eyebrow">Flagged for review</p>
    <h1>Things that are not settled.</h1>
    <p class="standfirst">${flagsData.flags.length} open items. None of them blocked publication, and none of them are hidden. Each says what was observed, what is missing, and what would close it.</p>
  </div>
</section>
<section class="section">
  <div class="wrap">
    <div class="table-wrap">
      <table>
        <caption>Open irregularities, checked ${esc(sourcesData.checked_at)}. Source links point at the official page or the observed destination.</caption>
        <thead><tr><th scope="col">ID</th><th scope="col">Item</th><th scope="col">Status</th><th scope="col">What we found</th><th scope="col">What would close it</th><th scope="col">Sources</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
    <div class="note" style="margin-top:26px">
      <h4>How to read a flag</h4>
      <p><span class="pill pill-review">needs review</span> means the item is published on this page and does not block anything. <span class="pill pill-gap">blocked</span> means an official source exists but could not be read without account access. Neither status ever means “probably fine”.</p>
    </div>
  </div>
</section>
`;
  return layout({
    title: `Flagged for review — open items | ${SITE.name}`,
    description: "Every unresolved irregularity on this site, with the source link and what would close it. Published rather than hidden.",
    path: "flagged/",
    body,
  });
}

/* ---------- disclosure ---------- */
function disclosurePage() {
  const body = `
<section class="hero" style="padding-bottom:30px">
  <div class="wrap">
    <p class="eyebrow">Disclosure</p>
    <h1>How this site makes money.</h1>
    <p class="standfirst">Plainly: through the Amazon Associates programme. You pay the same price whether you use our links or not, and no brand has paid for a mention on this site.</p>
  </div>
</section>
<section class="section">
  <div class="wrap">
    <div class="prose">
      <div class="note" style="margin-top:0">
        <h4>The required statement</h4>
        <p><strong>${esc(SITE.disclosure)}</strong></p>
        <p style="font-size:13px">Quoted verbatim from §5 of the Associates Program Operating Agreement, which requires it to appear clearly and prominently on the site. ${cite("S01")}</p>
      </div>

      <h2>What that means in practice</h2>
      <ul>
        <li>When you follow a product link and buy something, Amazon pays this site a commission. The commission comes out of Amazon's margin, not out of your price.</li>
        <li>Every outbound product link is marked <code>rel="sponsored"</code> and announces itself as sponsored in the surrounding text.</li>
        <li>No retailer, brand or agency has paid for coverage, ranking or a favourable sentence. There is no sponsored content on this site.</li>
        <li>Affiliate status never buys a product a place on the register. Being on the register means we could verify the listing.</li>
      </ul>

      <h2>Where the statement appears</h2>
      <p>On every page, twice: in the strip directly beneath the masthead, and again in the footer. This is a deliberate reading of the FTC's placement guidance, which says a disclosure should be where it “easily catches consumers' attention and is difficult to miss”, and warns that a disclosure at the bottom of a page may be missed. A strip under the masthead is early enough to be read before the content; the footer repeat is redundancy, not a substitute. ${cite("S04")}</p>
      <p>The operative rule sits at 16 CFR §255.5, which requires disclosure of material connections between an endorser and the seller. ${cite("S05")}</p>

      <h2>What we do not do</h2>
      <ul>
        <li>We do not cloak, shorten or reroute our outbound links. They point directly at Amazon. ${cite("S02")}</li>
        <li>We do not ask you to bookmark a Special Link. ${cite("S02")}</li>
        <li>We do not offer rewards, rebates or incentives for clicking. ${cite("S02")}</li>
        <li>We do not buy search ads against Amazon trademarks. ${cite("S02")}</li>
        <li>We do not publish prices, price alerts or star ratings. ${cite("S02")}</li>
        <li>We do not claim to have tested anything we have not tested.</li>
      </ul>

      <h2>Independence</h2>
      <p>This site is not owned by, endorsed by or affiliated with Amazon.com, Inc. beyond participation in the Associates programme. Amazon and the Amazon logo are trademarks of Amazon.com, Inc. or its affiliates. Nothing here implies that Amazon sponsors or approves this site — §5 of the Operating Agreement forbids exactly that implication. ${cite("S01")}</p>

      <h2>Questions</h2>
      <p>Corrections are welcome and are logged on the <a href="${url("flagged/")}">Flagged for review</a> page until they are closed.</p>
    </div>
  </div>
</section>
`;
  return layout({
    title: `Affiliate disclosure | ${SITE.name}`,
    description: "How DIY Home Upgrades earns money: the Amazon Associates programme, the required disclosure statement, and what we do and do not do.",
    path: "disclosure/",
    body,
  });
}

/* ---------- privacy ---------- */
function privacyPage() {
  const body = `
<section class="hero" style="padding-bottom:30px">
  <div class="wrap">
    <p class="eyebrow">Privacy</p>
    <h1>Nothing follows you here.</h1>
    <p class="standfirst">No cookies, no third-party tags, no advertising identifiers, no profile. The site is a set of static files.</p>
  </div>
</section>
<section class="section">
  <div class="wrap">
    <div class="prose">
      <h2>What this site stores on your device</h2>
      <p>Nothing. There are no cookies, no <code>localStorage</code> entries, no session identifiers and no fingerprinting scripts. Filtering in the shop happens in memory and is discarded when you leave the page.</p>

      <h2>What is measured</h2>
      <p>Five events, described in full on the <a href="${url("signals/")}">measurement page</a>. When an endpoint is configured, a beacon carries the page path, the product identifier and, for outbound clicks, the destination host. It carries no IP address, no cookie and no identifier that could link two visits. <code>Do Not Track</code> and <code>Global Privacy Control</code> are honoured and suppress everything.</p>

      <h2>Amazon's own collection</h2>
      <p>Following a product link takes you to Amazon.com, which is governed by Amazon's privacy notice, not ours. Amazon sets its own cookies and records the referral. Their privacy notice is at <a href="https://www.amazon.com/gp/help/customer/display.html?nodeId=468496" rel="noopener">amazon.com</a>.</p>
      <p>Amazon's Participation Requirements ask associates to disclose the use of cookies by third parties on their site. ${cite("S02")} This site sets none of its own; the third party is Amazon, and it acts after you leave.</p>

      <h2>Email</h2>
      <p>There is no email capture running on this site. A subscribe form exists as a placeholder and is not connected to a list; it says so on the page. If that changes, this page changes first.</p>

      <h2>Your rights</h2>
      <p>Because no personal data is collected by this site, there is nothing to export or erase. If you believe otherwise, or you are a controller with a question, the correction route is the <a href="${url("flagged/")}">Flagged for review</a> page.</p>

      <h2>Children</h2>
      <p>This site is not directed at children and collects no data from anyone, of any age.</p>
    </div>
  </div>
</section>
`;
  return layout({
    title: `Privacy — no cookies, no tracking | ${SITE.name}`,
    description: "Privacy policy for a static site: no cookies, no third-party tags, no identifiers. What the five measurement events contain, and what they do not.",
    path: "privacy/",
    body,
  });
}

/* ---------- terms ---------- */
function termsPage() {
  const body = `
<section class="hero" style="padding-bottom:30px">
  <div class="wrap">
    <p class="eyebrow">Terms</p>
    <h1>What you can rely on.</h1>
    <p class="standfirst">This is a product journal, not a retailer. Orders, delivery, returns and warranties are Amazon's, and the brand's — not ours.</p>
  </div>
</section>
<section class="section">
  <div class="wrap">
    <div class="prose">
      <h2>No purchase happens here</h2>
      <p>Every product link leaves this site for Amazon.com. The contract of sale is between you and Amazon, or between you and the third-party seller named on the listing. This site is not a party to it and cannot accept a return, cancel an order or honour a warranty.</p>
      <p>Amazon's own rule is explicit that their customers are not our customers and that customer service questions must go to Amazon. ${cite("S01")}</p>

      <h2>Accuracy</h2>
      <p>Specifications are transcribed from the listing on the date shown and can change without notice. Prices and availability are deliberately not shown because they cannot be kept current here. Check the listing before you buy.</p>

      <h2>No professional advice</h2>
      <p>Nothing here is electrical, plumbing, structural or safety advice. Some products involve sharp blades, adhesives and wall fixings; follow the manufacturer's instructions and local building rules.</p>

      <h2>No performance claims</h2>
      <p>We make no claim about star ratings, review scores, bestseller status, savings or results. Where a listing displays a badge such as “Amazon's Choice”, the register records it as a badge the listing shows — not as a judgement we endorse.</p>

      <h2>Independence and trademarks</h2>
      <p>Amazon and the Amazon logo are trademarks of Amazon.com, Inc. or its affiliates. This site is not endorsed by Amazon. ${cite("S01")}</p>

      <h2>Corrections</h2>
      <p>If a row is wrong, it gets corrected and logged on the <a href="${url("flagged/")}">Flagged for review</a> page rather than quietly edited.</p>
    </div>
  </div>
</section>
`;
  return layout({
    title: `Terms of use | ${SITE.name}`,
    description: "Terms for a product journal: no purchase happens here, specifications can change, no professional advice, and no performance claims.",
    path: "terms/",
    body,
  });
}

/* ---------- media kit / about ---------- */
function mediaKitPage() {
  const body = `
<section class="hero" style="padding-bottom:30px">
  <div class="wrap">
    <p class="eyebrow">About &amp; media kit</p>
    <h1>A small publication with a short shelf.</h1>
    <p class="standfirst">DIY Home Upgrades covers home improvements that cost less than a weekend and fit in a cabinet. It publishes rarely and verifies heavily.</p>
  </div>
</section>
<section class="section">
  <div class="wrap">
    <div class="lede-split">
      <div class="prose">
        <h2 style="margin-top:0">What the site is</h2>
        <p>An independently published product journal. Each entry is a single product, a specification table transcribed from the manufacturer's listing, a plain statement of who it suits, and a plain statement of what could not be verified.</p>
        <h2>What the site is not</h2>
        <p>A review site. No product here has been handled, installed or measured by this publication. Calling an entry a review would misrepresent what it is, so they are called entries.</p>
        <h2>Authorship</h2>
        <p>Published by the site owner and maintained as an open repository. Every change is a commit, and the <a href="${SITE.repo_url}" rel="noopener">repository</a> is public — including the data files behind every table.</p>
      </div>
      <div>
        <div class="spec-box">
          <h3>Fact sheet</h3>
          <dl>
            <div class="spec-row"><dt>Launched</dt><dd>20 November 2026</dd></div>
            <div class="spec-row"><dt>Products covered</dt><dd>3</dd></div>
            <div class="spec-row"><dt>Categories</dt><dd>3</dd></div>
            <div class="spec-row"><dt>Guides</dt><dd>${guidesData.guides.length}</dd></div>
            <div class="spec-row"><dt>Affiliate programme</dt><dd>Amazon Associates (US)</dd></div>
            <div class="spec-row"><dt>Tracking ID</dt><dd class="mono">${esc(SITE.tracking_id)}</dd></div>
            <div class="spec-row"><dt>Editorial cadence</dt><dd>Monthly</dd></div>
            <div class="spec-row"><dt>Prices shown</dt><dd>None</dd></div>
            <div class="spec-row"><dt>Star ratings shown</dt><dd>None</dd></div>
            <div class="spec-row"><dt>Cookies set</dt><dd>None</dd></div>
          </dl>
        </div>
        <div class="note" style="margin-top:20px;font-size:13.5px">
          <h4>For brands</h4>
          <p>There is no paid placement and no sponsored content. A product enters the register only if its listing can be verified and it fits a category the site already covers. Approval never buys a sentence.</p>
        </div>
      </div>
    </div>
  </div>
</section>
`;
  return layout({
    title: `About & media kit | ${SITE.name}`,
    description: "Who publishes DIY Home Upgrades, what it covers, and the fact sheet: three products, no prices, no star ratings, no cookies.",
    path: "media-kit/",
    body,
  });
}

/* ---------- colophon ---------- */
function colophonPage() {
  const body = `
<section class="hero" style="padding-bottom:30px">
  <div class="wrap">
    <p class="eyebrow">Colophon</p>
    <h1>How the pages are made.</h1>
    <p class="standfirst">Static HTML, generated from JSON, published from a public repository. No CMS, no database, no framework, no third-party scripts.</p>
  </div>
</section>
<section class="section">
  <div class="wrap">
    <div class="prose">
      <h2>Stack</h2>
      <ul>
        <li>Pages generated by <code>scripts/build.mjs</code> — a single Node script with no dependencies.</li>
        <li>Data lives in <code>data/*.json</code>: products, links, sources, flags, guides, ledger schema.</li>
        <li>Type: the reader's system serif for headings, system sans for text. No web fonts are downloaded.</li>
        <li>No analytics library, no tag manager, no CDN. One CSS file, one small script.</li>
      </ul>
      <h2>Checks before publish</h2>
      <ul>
        <li><code>scripts/audit.mjs</code> walks every generated page and fails the build on a broken internal link, a missing disclosure strip, an outbound link without <code>rel="sponsored"</code>, or a table row with no source.</li>
        <li>The feed and sitemap are generated from the same data as the pages, so a page cannot exist in one and not the other.</li>
      </ul>
      <h2>Accessibility</h2>
      <ul>
        <li>Semantic landmarks, one <code>h1</code> per page, labelled tables with captions and row headers.</li>
        <li>Skip link, visible focus rings, and a reduced-motion preference that removes all transitions.</li>
        <li>Colour pairings chosen to keep body text above 4.5:1 contrast in both light and dark schemes.</li>
      </ul>
      <h2>Reproducing this site</h2>
      <p>Clone the repository, run <code>node scripts/build.mjs</code>, then <code>node scripts/audit.mjs</code>. The build is deterministic: the same data produces byte-identical pages.</p>
    </div>
  </div>
</section>
`;
  return layout({
    title: `Colophon | ${SITE.name}`,
    description: "How the site is generated: static HTML from JSON, no dependencies, no third-party scripts, audited for broken links before publish.",
    path: "colophon/",
    body,
  });
}

/* ---------- search ---------- */
function searchPage() {
  const body = `
<section class="hero" style="padding-bottom:30px">
  <div class="wrap">
    <p class="eyebrow">Search</p>
    <h1>Find a page.</h1>
    <p class="standfirst">Everything on the site is indexed below. The list filters as you type and works without an account or a cookie.</p>
  </div>
</section>
<section class="section">
  <div class="wrap">
    <div class="filter">
      <label for="sq" style="position:absolute;left:-9999px">Search this site</label>
      <input id="sq" type="search" placeholder="Search products, guides and pages…" autocomplete="off">
      <span class="count" id="scount"></span>
    </div>
    <div class="table-wrap">
      <table id="search-table">
        <caption>Every indexable page on this site.</caption>
        <thead><tr><th scope="col">Page</th><th scope="col">Type</th><th scope="col">Summary</th></tr></thead>
        <tbody>${written
          .filter((w) => w.searchable !== false && w.title)
          .map(
            (w) => `<tr data-text="${attr((w.title + " " + (w.summary || "") + " " + w.type).toLowerCase())}">
              <td><a href="${attr(w.href)}">${esc(w.title)}</a></td>
              <td><span class="pill pill-neutral">${esc(w.type)}</span></td>
              <td>${esc(w.summary || "")}</td>
            </tr>`
          )
          .join("")}</tbody>
      </table>
    </div>
  </div>
</section>
`;
  return layout({
    title: `Search | ${SITE.name}`,
    description: "Search every product entry, guide and page on DIY Home Upgrades.",
    path: "search/",
    body,
  });
}

/* ---------- 404 ---------- */
function notFoundPage() {
  const body = `
<section class="hero">
  <div class="wrap">
    <p class="eyebrow">404</p>
    <h1>That page is not on the register.</h1>
    <p class="standfirst">The link may be old, or the page may never have existed. Both are possible; the second is more likely.</p>
    <div class="cta-row" style="margin-top:22px">
      <a class="btn" href="${url("shop/")}">Browse the shop</a>
      <a class="btn btn-ghost" href="${url("register/")}">See the register</a>
    </div>
  </div>
</section>
`;
  return layout({
    title: `Page not found | ${SITE.name}`,
    description: "That page does not exist on DIY Home Upgrades.",
    path: "404.html",
    body,
  });
}

/* ------------------------------------------------------------------ */
/* feeds & machine-readable files                                      */
/* ------------------------------------------------------------------ */

function sitemap() {
  const urls = written
    .filter((w) => w.searchable !== false && w.path !== "404.html")
    .map(
      (w) => `  <url>
    <loc>${url(w.path)}</loc>
    <lastmod>${SITE.published}</lastmod>
    <changefreq>${w.changefreq || "monthly"}</changefreq>
    <priority>${w.priority || "0.6"}</priority>
  </url>`
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

function feed() {
  const items = [
    ...guidesData.guides.map((g) => ({
      title: g.title,
      link: url(`guides/${g.slug}/`),
      date: g.published,
      desc: g.standfirst,
      cat: g.kicker,
    })),
    ...PRODUCTS.map((p) => ({
      title: `New entry: ${p.name}`,
      link: url(`products/${p.slug}/`),
      date: SITE.published,
      desc: p.lead,
      cat: "Product entry",
    })),
  ].sort((a, b) => (a.date < b.date ? 1 : -1));

  const itemXml = items
    .map(
      (i) => `    <item>
      <title>${esc(i.title)}</title>
      <link>${i.link}</link>
      <guid isPermaLink="true">${i.link}</guid>
      <pubDate>${new Date(i.date + "T09:00:00Z").toUTCString()}</pubDate>
      <category>${esc(i.cat)}</category>
      <description>${esc(i.desc)}</description>
    </item>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(SITE.name)}</title>
    <link>${url("")}</link>
    <atom:link href="${url("feed.xml")}" rel="self" type="application/rss+xml"/>
    <description>${esc(SITE.tagline)}</description>
    <language>en-us</language>
    <copyright>© 2026 ${esc(SITE.name)}</copyright>
    <lastBuildDate>${new Date(SITE.published + "T09:00:00Z").toUTCString()}</lastBuildDate>
    <generator>scripts/build.mjs</generator>
${itemXml}
  </channel>
</rss>
`;
}

function sitemapIndex() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${url("sitemap.xml")}</loc>
    <lastmod>${SITE.published}</lastmod>
  </sitemap>
</sitemapindex>
`;
}

function robots() {
  return `# ${SITE.name}
# One canonical site, one sitemap. No duplicate hosts, no staging copies indexed.

User-agent: *
Allow: /
Disallow: /404.html

Sitemap: ${url("sitemap.xml")}
`;
}

function registerJson() {
  return (
    JSON.stringify(
      {
        generated: SITE.published,
        note: "Machine-readable copy of the public register. Blank values are blank because they could not be confirmed from an official source.",
        columns: [
          "product",
          "brand",
          "asin",
          "source_url",
          "category",
          "special_link_validated",
          "price_verified",
          "rating_verified",
        ],
        rows: PRODUCTS.map((p) => ({
          product: p.name,
          brand: p.brand,
          asin: p.asin,
          source_url: SOURCES[p.listing_source].url,
          category: CATEGORIES.find((c) => c.slug === p.category).name,
          special_link_validated: null,
          price_verified: null,
          rating_verified: null,
        })),
      },
      null,
      2
    ) + "\n"
  );
}

function registerCsv() {
  const head = "product,brand,asin,source_url,category,special_link_validated,price_verified,rating_verified";
  const q = (v) => `"${String(v).replace(/"/g, '""')}"`;
  const rows = PRODUCTS.map((p) =>
    [
      q(p.name),
      q(p.brand),
      q(p.asin),
      q(SOURCES[p.listing_source].url),
      q(CATEGORIES.find((c) => c.slug === p.category).name),
      "",
      "",
      "",
    ].join(",")
  );
  return [head, ...rows].join("\n") + "\n";
}

/* ------------------------------------------------------------------ */
/* run                                                                 */
/* ------------------------------------------------------------------ */

function clean() {
  const targets = [
    "index.html",
    "shop",
    "categories",
    "products",
    "guides",
    "register",
    "sources",
    "how-we-verify",
    "signals",
    "ledger",
    "flagged",
    "disclosure",
    "privacy",
    "terms",
    "media-kit",
    "colophon",
    "search",
    "404.html",
    "sitemap.xml",
    "feed.xml",
    "index.xml",
    "robots.txt",
  ];
  for (const t of targets) {
    const p = path.join(ROOT, t);
    if (fs.existsSync(p)) fs.rmSync(p, { recursive: true, force: true });
  }
  fs.rmSync(path.join(ROOT, "data/register.json"), { force: true });
  fs.rmSync(path.join(ROOT, "data/register.csv"), { force: true });
}

function track(p, meta) {
  written.push({ path: p, href: url(p.endsWith("/") ? p : p.replace(/\.html$/, "")), ...meta });
  return p;
}

clean();

// Home
write("index.html", homePage());
track("", { title: "DIY Home Upgrades", type: "Front page", summary: SITE.tagline, priority: "1.0", changefreq: "weekly" });

// Shop
write("shop/index.html", shopPage());
track("shop/", { title: "Shop — every product we cover", type: "Index", summary: "All products on the site in one filterable table.", priority: "0.9", changefreq: "weekly" });

// Categories
for (const c of CATEGORIES) {
  write(`categories/${c.slug}/index.html`, categoryPage(c));
  track(`categories/${c.slug}/`, { title: c.name, type: "Category", summary: c.blurb });
}

// Products
for (const p of PRODUCTS) {
  write(`products/${p.slug}/index.html`, productPage(p));
  track(`products/${p.slug}/`, { title: p.name, type: "Product entry", summary: p.lead, priority: "0.8" });
}

// Guides
write("guides/index.html", guidesIndex());
track("guides/", { title: "Buying guides", type: "Index", summary: "Question-shaped guides, each with its sources.", priority: "0.9", changefreq: "weekly" });
for (const g of guidesData.guides) {
  write(`guides/${g.slug}/index.html`, guidePage(g));
  track(`guides/${g.slug}/`, { title: g.title, type: "Guide", summary: g.standfirst, priority: "0.8" });
}

// Static pages
const statics = [
  ["register/", registerPage, "Product register — every row, every gap", "Register", "The whole site in one table, with an official source on every row."],
  ["sources/", sourcesPage, "Source library", "Reference", "Every official document behind every claim."],
  ["how-we-verify/", howWeVerifyPage, "How we verify", "Method", "Five verification rules and their limits."],
  ["signals/", signalsPage, "Measurement", "Reference", "The five events, and what they cannot tell you."],
  ["ledger/", ledgerPage, "Campaign ledger", "Reference", "An empty ledger with a strict schema."],
  ["flagged/", flaggedPage, "Flagged for review", "Reference", "Every unresolved irregularity, in public."],
  ["disclosure/", disclosurePage, "Affiliate disclosure", "Reference", "How the site earns money."],
  ["privacy/", privacyPage, "Privacy", "Reference", "No cookies, no identifiers."],
  ["terms/", termsPage, "Terms of use", "Reference", "What you can rely on."],
  ["media-kit/", mediaKitPage, "About & media kit", "Reference", "What the site is, and its fact sheet."],
  ["colophon/", colophonPage, "Colophon", "Reference", "How the pages are made."],
];
for (const [p, fn, title, type, summary] of statics) {
  write(`${p}index.html`, fn());
  track(p, { title, type, summary });
}

// Search last so it can index everything above
write("search/index.html", searchPage());
track("search/", { title: "Search", type: "Utility", summary: "Filter every page.", searchable: false });

// 404
write("404.html", notFoundPage());
track("404.html", { title: "Page not found", type: "Utility", searchable: false, href: url("404.html") });

// Feeds & machine files
fs.writeFileSync(path.join(ROOT, "sitemap.xml"), sitemap());
fs.writeFileSync(path.join(ROOT, "feed.xml"), feed());
fs.writeFileSync(path.join(ROOT, "index.xml"), sitemapIndex());
fs.writeFileSync(path.join(ROOT, "robots.txt"), robots());
fs.mkdirSync(path.join(ROOT, "data"), { recursive: true });
fs.writeFileSync(path.join(ROOT, "data/register.json"), registerJson());
fs.writeFileSync(path.join(ROOT, "data/register.csv"), registerCsv());

// Machine-readable mirror of the public data
fs.writeFileSync(
  path.join(ROOT, "data/site-index.json"),
  JSON.stringify(
    written.map((w) => ({ path: w.path, url: w.href, title: w.title, type: w.type, summary: w.summary || "" })),
    null,
    2
  ) + "\n"
);

console.log(`Built ${written.length} pages + sitemap, feed, robots, and 3 data files.`);
console.log(`Products: ${PRODUCTS.length} · Guides: ${guidesData.guides.length} · Sources: ${sourcesData.sources.length} · Flags: ${flagsData.flags.length}`);
