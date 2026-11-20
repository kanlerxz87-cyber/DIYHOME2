#!/usr/bin/env python3
"""DIY Home Upgrades — static site build (stdlib only, no dependencies).

Reads data/*.json, generates docs/ (served by GitHub Pages via Actions).
Every page gets: masthead, disclosure strip (above the fold), nav, footer
with repeated disclosure, JSON-LD, canonical link, RSS discovery link.
"""
import json, html, datetime, pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
DATA = ROOT / "data"
OUT = ROOT / "docs"
SITE = json.loads((DATA / "site.json").read_text())
GUIDES = json.loads((DATA / "guides.json").read_text())["guides"]
PRODUCTS = json.loads((DATA / "products.json").read_text())["products"]
CONFIRM = json.loads((DATA / "product-intent-confirmation.json").read_text())
REGISTER = json.loads((DATA / "source-register.json").read_text())
FLAGGED = json.loads((DATA / "flagged.json").read_text())["items"]
BASE = SITE["base_url"]
TODAY = "2026-11-20"

def esc(s):
    return html.escape(str(s), quote=True) if s is not None else ""

def pages():
    """Return list of (path, title, description, body_html, extra_jsonld, page_type)."""
    out = []
    out.append(("index.html", SITE["site_name"] + " — careful DIY upgrade guides", SITE["tagline"], tpl_front(), None, "website"))
    out.append(("guides/index.html", "Guides — " + SITE["site_name"], "Question-shaped buying guides on air fryers and multi-function kitchen appliances. Working titles; not claims of popularity or search volume.", tpl_guides_index(), None, "website"))
    for g in GUIDES:
        out.append((f"guides/{g['slug']}.html", g["title"] + " — " + SITE["site_name"], g["dek"], tpl_guide(g), guide_jsonld(g), "article"))
    out.append(("products.html", "Products &amp; Special Links — " + SITE["site_name"], "The affiliate product register: intended ASINs, candidate listing URLs, confirmation status. All outbound links marked sponsored.", tpl_products(), None, "website"))
    out.append(("dashboard.html", "Site dashboard — " + SITE["site_name"], "One-screen overview: publication status, verification status, campaign ledger state and locally-stored reader analytics.", tpl_dashboard(), None, "website"))
    out.append(("campaign-ledger.html", "Campaign ledger — " + SITE["site_name"], "Empty but well-defined campaign ledger: timestamp, source, channel, eligible sessions, clicks and reported orders, added only from authorized first-party reports.", tpl_ledger(), None, "website"))
    out.append(("verification.html", "Verification register — " + SITE["site_name"], "Source register: every source used in this build, its access method, retrieval date, and what it supports. Includes the outbound-link audit.", tpl_verification(), None, "website"))
    out.append(("measurement-plan.html", "Measurement plan — " + SITE["site_name"], "The five defined events, privacy-preserving analytics design, publishing cadence, and Search Console steps for the owner.", tpl_measurement(), None, "website"))
    out.append(("flagged.html", "Flagged for Review — " + SITE["site_name"], "Every irregularity and unverified item found during this build, with source links and required owner actions.", tpl_flagged(), None, "website"))
    out.append(("standards.html", "Publishing standards &amp; cadence — " + SITE["site_name"], "How guides are commissioned, reviewed, dated and updated; the weekly Tuesday cadence; how new guides enter the sitemap and feed automatically.", tpl_standards(), None, "website"))
    out.append(("about.html", "About &amp; masthead — " + SITE["site_name"], "Who publishes DIY Home Upgrades, authorship model, corrections policy and contact.", tpl_about(), None, "website"))
    out.append(("disclosure.html", "Disclosure — " + SITE["site_name"], "Affiliate disclosure, Amazon Associates participation statement, and how sponsored links are marked on this site.", tpl_disclosure(), None, "website"))
    out.append(("privacy.html", "Privacy — " + SITE["site_name"], "What this site stores, what it never stores, and how to erase locally-stored analytics.", tpl_privacy(), None, "website"))
    out.append(("executive-summary.html", "Executive summary — " + SITE["site_name"], "Project status, key decisions, compliance posture, unverified items and owner action list.", tpl_exec_summary(), None, "website"))
    return out

def guide_jsonld(g):
    art = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": g["title"],
        "description": g["dek"],
        "datePublished": g["published"],
        "dateModified": g["updated"],
        "inLanguage": "en",
        "author": {"@type": "Organization", "name": "DIY Home Upgrades Editorial", "url": BASE + "about.html"},
        "publisher": {"@type": "Organization", "name": SITE["site_name"], "url": BASE},
        "mainEntityOfPage": BASE + "guides/" + g["slug"] + ".html",
    }
    faq = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [{"@type": "Question", "name": f["q"], "acceptedAnswer": {"@type": "Answer", "text": f["a"]}} for f in g["faqs"]],
    }
    return [art, faq]

def website_jsonld():
    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": SITE["site_name"],
        "url": BASE,
        "description": SITE["tagline"],
        "inLanguage": "en",
        "publisher": {"@type": "Organization", "name": SITE["site_name"], "url": BASE},
    }

def head(path, title, desc, extra_jsonld):
    canonical = BASE + path
    prefix = "../" if path.count("/") else ""
    ld = [website_jsonld()] + (extra_jsonld or [])
    ld_tags = "\n".join(f'<script type="application/ld+json">{json.dumps(x, ensure_ascii=False)}</script>' for x in ld)
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{esc(desc)}">
<link rel="canonical" href="{canonical}">
<link rel="icon" href="{prefix}assets/img/logo.svg" type="image/svg+xml">
<link rel="alternate" type="application/rss+xml" title="{esc(SITE['site_name'])} — RSS" href="{prefix}feed.xml">
<meta property="og:type" content="website">
<meta property="og:site_name" content="{esc(SITE['site_name'])}">
<meta property="og:title" content="{esc(title)}">
<meta property="og:description" content="{esc(desc)}">
<meta property="og:url" content="{canonical}">
<meta property="og:image" content="{BASE}assets/img/hero-kitchen.jpg">
<meta name="twitter:card" content="summary_large_image">
<meta name="robots" content="index, follow">
<link rel="stylesheet" href="{prefix}assets/css/site.css">
{ld_tags}
</head>
<body>
<a class="skip-link" href="#main">Skip to content</a>
<header class="masthead">
  <div class="wrap masthead-inner">
    <a class="brand" href="{prefix}index.html" aria-label="{esc(SITE['site_name'])} — home">
      <svg class="brand-mark" viewBox="0 0 48 48" role="img" aria-label="DIY Home Upgrades logo"><rect x="2" y="2" width="44" height="44" rx="9" fill="#123f31"/><path d="M12 33V15h9.2c4.6 0 7.6 2.6 7.6 6.3s-3 6.4-7.6 6.4h-3V33h-6.2zm6.2-10.9h2.7c1.9 0 3-1.1 3-2.8s-1.1-2.8-3-2.8h-2.7v5.6z" fill="#f4efe6"/><path d="M30 20.5l4.6-4.6 2.6 2.6-4.6 4.6zM31.6 22.1l2.2 8.6 4.9-4.9z" fill="#e07856"/></svg>
      <span class="brand-text"><span class="brand-name">{esc(SITE['site_name'])}</span><span class="brand-tag">{esc(SITE['tagline'])}</span></span>
    </a>
    <div class="mast-actions">
      <a class="pill" href="{prefix}feed.xml" data-feed-subscribe>RSS</a>
      <a class="pill pill-solid" href="{prefix}guides/index.html">Read the guides</a>
    </div>
  </div>
  <div class="disclosure-strip" role="note" aria-label="Affiliate disclosure"><div class="wrap"><strong>Disclosure:</strong> {esc(SITE['disclosure_short'])} <a href="{prefix}disclosure.html">How we use links</a></div></div>
  <nav class="nav" aria-label="Primary">
    <div class="wrap nav-inner">
      <a href="{prefix}index.html">Home</a>
      <a href="{prefix}guides/index.html">Guides</a>
      <a href="{prefix}products.html">Products</a>
      <details class="nav-group">
        <summary>Explore</summary>
        <div class="nav-menu" role="menu">
          <a href="{prefix}dashboard.html">Site dashboard</a>
          <a href="{prefix}campaign-ledger.html">Campaign ledger</a>
          <a href="{prefix}verification.html">Verification register</a>
          <a href="{prefix}measurement-plan.html">Measurement plan</a>
          <a href="{prefix}standards.html">Standards &amp; cadence</a>
          <a href="{prefix}flagged.html">Flagged for Review</a>
          <a href="{prefix}executive-summary.html">Executive summary</a>
        </div>
      </details>
    </div>
  </nav>
</header>
<main id="main" class="wrap">
"""

def foot(prefix):
    return f"""</main>
<footer class="footer">
  <div class="wrap footer-grid">
    <div>
      <h2 class="foot-h">Sections</h2>
      <a href="{prefix}guides/index.html">Guides</a>
      <a href="{prefix}products.html">Products &amp; Special Links</a>
      <a href="{prefix}feed.xml" data-feed-subscribe>RSS feed</a>
    </div>
    <div>
      <h2 class="foot-h">Dashboard</h2>
      <a href="{prefix}dashboard.html">Site dashboard</a>
      <a href="{prefix}campaign-ledger.html">Campaign ledger</a>
      <a href="{prefix}verification.html">Verification register</a>
      <a href="{prefix}measurement-plan.html">Measurement plan</a>
    </div>
    <div>
      <h2 class="foot-h">Review</h2>
      <a href="{prefix}flagged.html">Flagged for Review ({len(FLAGGED)})</a>
      <a href="{prefix}standards.html">Standards &amp; cadence</a>
      <a href="{prefix}executive-summary.html">Executive summary</a>
      <a href="{prefix}about.html">About &amp; masthead</a>
    </div>
    <div>
      <h2 class="foot-h">Trust</h2>
      <a href="{prefix}disclosure.html">Disclosure</a>
      <a href="{prefix}privacy.html">Privacy</a>
      <a href="{prefix}verification.html#register">Source register</a>
    </div>
  </div>
  <div class="disclosure-strip disclosure-foot" role="note"><div class="wrap"><strong>Disclosure:</strong> {esc(SITE['disclosure_short'])} Purchases through links on this site may earn us a commission at no extra cost to you.</div></div>
  <div class="wrap fine-print foot-bottom">
    <p>{esc(SITE['footer_note'])}</p>
    <p>© 2026 {esc(SITE['site_name'])}. Built 2026-11-20. Tracking ID: {esc(SITE['tracking_id'])}. <a href="{prefix}feed.xml" data-feed-subscribe>RSS</a> · <a href="{prefix}sitemap.xml">Sitemap</a></p>
  </div>
</footer>
<script src="{prefix}assets/js/analytics-config.js"></script>
<script src="{prefix}assets/js/analytics.js"></script>
<script src="{prefix}assets/js/reader-capture.js" defer></script>
</body>
</html>
"""

def page(path, title, desc, body, extra_jsonld=None):
    prefix = "../" if path.count("/") else ""
    html_out = head(path, title, desc, extra_jsonld) + body + foot(prefix)
    target = OUT / path
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(html_out, encoding="utf-8")
    return path

def source_link(sid):
    for s in REGISTER["sources"]:
        if s["id"] == sid:
            return f'<a href="{esc(s["url"])}" rel="nofollow noopener">{esc(s["source"])}</a>'
    return esc(sid)

# ---------- shared fragments ----------
def affiliate_link(url, label, cls="btn-link"):
    return f'<a class="{cls}" href="{esc(url)}" rel="sponsored nofollow noopener" target="_blank" data-affiliate>{label} <span class="ext" aria-hidden="true">↗</span></a>'

def status_pill(status):
    return f'<span class="status status-unverified">{esc(status)}</span>'

def unverified_cell():
    return '<span class="unverified">— unverified</span>'

# ---------- front page ----------
def tpl_front():
    confirm = {r["id"]: r for r in CONFIRM["records"]}
    guide_cards = "".join(f"""
      <article class="card guide-card">
        <p class="kicker">{esc(g['pillar'])} · {esc(g['reading_time'])}</p>
        <h3><a href="guides/{esc(g['slug'])}.html">{esc(g['title'])}</a></h3>
        <p>{esc(g['dek'])}</p>
        <p class="card-foot"><a class="text-link" href="guides/{esc(g['slug'])}.html">Read the guide →</a></p>
      </article>""" for g in GUIDES)
    return f"""
<section class="hero">
  <div class="hero-copy">
    <p class="kicker">The Tuesday upgrade, weekly</p>
    <h1>Buy the kitchen appliance once.<br>Choose it well.</h1>
    <p class="lede">Careful, disclosure-first buying guides for air fryers and multi-function kitchen appliances — written as the questions a buyer actually asks, with every claim traceable or visibly marked unverified.</p>
    <div class="hero-ctas">
      <a class="btn" href="guides/index.html">Browse the guides</a>
      <a class="btn btn-ghost" href="disclosure.html">Read our disclosure</a>
    </div>
    <p class="fine-print">Working titles only — no popularity, search-volume or superiority claims. Product attributes unverified pending official-source checks; see <a href="flagged.html">Flagged for Review</a>.</p>
  </div>
  <figure class="hero-art"><img src="assets/img/hero-kitchen.jpg" alt="Editorial illustration of a home kitchen workbench with an air fryer, measuring tape and notebook" width="880" height="620"></figure>
</section>

<section class="stat-strip" aria-label="Project at a glance">
  <div class="stat"><span class="stat-n">4</span><span class="stat-l">guides published (working titles)</span></div>
  <div class="stat"><span class="stat-n">3</span><span class="stat-l">submitted affiliate links · 0 confirmed</span></div>
  <div class="stat"><span class="stat-n">10</span><span class="stat-l">items on the <a href="flagged.html">Flagged for Review</a> page</span></div>
  <div class="stat"><span class="stat-n">0</span><span class="stat-l">rows in the <a href="campaign-ledger.html">campaign ledger</a> — no conversion claims</span></div>
</section>

<section class="section">
  <div class="section-head">
    <div><p class="kicker">Start here</p><h2>The four questions that decide your purchase</h2></div>
    <a class="text-link" href="guides/index.html">All guides →</a>
  </div>
  <div class="card-grid">{guide_cards}</div>
</section>

<section class="section two-col">
  <div class="panel">
    <p class="kicker">Our links, plainly</p>
    <h2>Every product link is sponsored — and labelled</h2>
    <p>Outbound product links on this site use the selected Associates tracking ID <code>{esc(SITE['tracking_id'])}</code> and carry <code>rel="sponsored nofollow noopener"</code>. The three submitted links currently sit at <span class="status status-unverified">unverified</span> status: their destinations have not been confirmed from an official source in this build.</p>
    <p class="card-foot"><a class="text-link" href="products.html">Open the product register →</a></p>
  </div>
  <div class="panel panel-alt" id="reader-capture">
    <p class="kicker">The Tuesday upgrade</p>
    <h2>One email when a guide ships</h2>
    <form id="capture-form" class="capture-form" novalidate>
      <label for="capture-email">Email address</label>
      <input id="capture-email" name="email" type="email" required autocomplete="email" placeholder="you@example.com">
      <label class="consent"><input type="checkbox" id="capture-consent" required> I consent to receiving the weekly guide email. No other use. <a href="privacy.html">Privacy</a></label>
      <button type="submit" class="btn btn-small">Subscribe</button>
      <p class="fine-print capture-note" id="capture-note" role="status">Reader capture activates only after the site owner configures a submission endpoint — until then nothing you type here leaves your device.</p>
    </form>
  </div>
</section>

<section class="section">
  <div class="section-head"><div><p class="kicker">How to trust this page</p><h2>Visible verification, not vibes</h2></div></div>
  <ol class="trust-list">
    <li><strong>Disclosure above the fold, on every page</strong> — and repeated in the footer.</li>
    <li><strong>A public source register</strong> — every external source, its access method and date: <a href="verification.html">verification register</a>.</li>
    <li><strong>A questions-first editorial model</strong> — guides answer buyer questions; no fabricated testing, prices or ratings: <a href="standards.html">standards</a>.</li>
    <li><strong>An honest ledger</strong> — campaign data appears only from authorized first-party reports: <a href="campaign-ledger.html">campaign ledger</a>.</li>
    <li><strong>Flagged, not hidden</strong> — everything unverifiable is published on <a href="flagged.html">Flagged for Review</a>.</li>
  </ol>
</section>
"""

# ---------- guides ----------
def tpl_guides_index():
    working_note = json.loads((DATA / "guides.json").read_text())["working_titles_note"]
    items = "".join(f"""
    <li class="guide-row">
      <div class="guide-row-meta"><p class="kicker">{esc(g['pillar'])} · {esc(g['reading_time'])} · updated {esc(g['updated'])}</p>
      <h2><a href="{esc(g['slug'])}.html">{esc(g['title'])}</a></h2>
      <p>{esc(g['dek'])}</p>
      <p class="fine-print"><em>Working title — editorial hypothesis, not a popularity claim.</em></p></div>
      <a class="btn btn-ghost btn-small" href="{esc(g['slug'])}.html">Read</a>
    </li>""" for g in GUIDES)
    return f"""
<p class="kicker">Guides</p>
<h1>Question-shaped buying guides</h1>
<p class="lede">{esc(working_note)}</p>
<ul class="guide-list">{items}</ul>
<p class="fine-print">Publishing cadence: one new guide every Tuesday, next slot 2026-11-24. New guides are appended to <code>sitemap.xml</code> and <code>feed.xml</code> automatically on rebuild. See <a href="../standards.html">standards &amp; cadence</a>.</p>
"""

def tpl_guide(g):
    prefix = "../"
    sections = "".join(f'<h2>{esc(s["heading"])}</h2>{s["body"]}' for s in g["sections"])
    faqs = "".join(f'<details class="faq"><summary>{esc(f["q"])}</summary><p>{esc(f["a"])}</p></details>' for f in g["faqs"])
    products_blurb = "".join(f'<li>{affiliate_link(p["submitted_url"], esc(p["submitted_url"]), "text-link")} <span class="status status-unverified">{esc(p["confirmation_status"])} destination</span></li>' for p in PRODUCTS)
    return f"""
<nav class="crumbs" aria-label="Breadcrumb"><a href="{prefix}index.html">Home</a> › <a href="index.html">Guides</a> › <span aria-current="page">{esc(g['title'][:60])}…</span></nav>
<article class="article">
  <p class="kicker">{esc(g['pillar'])} · {esc(g['reading_time'])} · published {esc(g['published'])} · updated {esc(g['updated'])}</p>
  <h1>{esc(g['title'])}</h1>
  <p class="lede">{esc(g['dek'])}</p>
  <p class="fine-print working-title"><em>Working title.</em> This is an editorial hypothesis about what a buyer may ask — it is not a claim about popularity, search volume, rankings or product superiority, and no such data was available in this build.</p>
  {sections}
  <h2>Frequently asked questions</h2>
  {faqs}
  <aside class="outbound-box" aria-label="Outbound links for this article">
    <p class="kicker">Outbound links (sponsored)</p>
    <p>The submitted affiliate links related to this buying journey — currently <span class="status status-unverified">unverified</span>:</p>
    <ul class="outbound-links">{products_blurb}</ul>
    <p class="fine-print">Links open Amazon in a new tab. <code>rel="sponsored nofollow noopener"</code>. We earn a commission at no extra cost to you. Destinations pending official-source confirmation — see <a href="{prefix}flagged.html">Flagged for Review</a> (F-003, F-004).</p>
  </aside>
  <p class="fine-print">Author: DIY Home Upgrades Editorial · <a href="{prefix}about.html">About the masthead</a> · Corrections: see <a href="{prefix}about.html#corrections">corrections policy</a>.</p>
</article>
"""

# ---------- products ----------
def tpl_products():
    rows = "".join(f"""
      <tr>
        <td><strong>{esc(p['id'])}</strong></td>
        <td><a href="{esc(p['submitted_url'])}" rel="sponsored nofollow noopener" target="_blank" data-affiliate>{esc(p['submitted_url'])}</a></td>
        <td><code>{esc(p['intended_asin'])}</code></td>
        <td>{unverified_cell()}</td>
        <td>{unverified_cell()}</td>
        <td>{unverified_cell()}</td>
        <td>{status_pill(p['confirmation_status'])}</td>
        <td>{esc(', '.join(p['flags']))}</td>
      </tr>""" for p in PRODUCTS)
    confirm_rows = "".join(f"""
      <tr>
        <td><strong>{esc(r['id'])}</strong></td>
        <td><code>{esc(r['intended_asin'])}</code></td>
        <td>{'<code>' + esc(r['candidate_listing_url']) + '</code> (constructed, unverified)' if r['candidate_listing_url'] else unverified_cell()}</td>
        <td>{esc(r['official_listing_url']) if r['official_listing_url'] else unverified_cell()}</td>
        <td>{esc(r['confirmation_date']) if r['confirmation_date'] else unverified_cell()}</td>
        <td>{esc(r['confirmation_source']) if r['confirmation_source'] else unverified_cell()}</td>
        <td>{('<code>' + '</code>, <code>'.join(esc(t) for t in r['observed_redirect_targets']) + '</code>') if r['observed_redirect_targets'] else '<span class="unverified">— none observed (kept as separate field, not merged)</span>'}</td>
        <td>{'No' if not r['test_order_placed_in_associates_workflow'] else 'Yes'}</td>
      </tr>""" for r in CONFIRM["records"])
    return f"""
<p class="kicker">Product register</p>
<h1>Products &amp; Special Links</h1>
<p class="lede">Every submitted affiliate link, what we know about it, and — more importantly — what we <strong>do not</strong> know. Amazon was unreachable from the build environment, so no product attribute could be verified. Blank means blank, not "close enough".</p>

<div class="callout" role="note">
  <strong>Selected tracking ID:</strong> <code>{esc(SITE['tracking_id'])}</code>. All outbound links carry <code>rel="sponsored nofollow noopener"</code>. The supplied <code>link.amazon</code> short links are used as-is; their Special Links status is <strong>unresolved</strong> — not claimed valid, not claimed invalid (see <a href="flagged.html">Flagged for Review</a>, F-003). The intended ASIN is taken from each submitted URL; candidate listing URLs are a standard construction and are stored separately from confirmation fields.
</div>

<h2 id="register">Table 1 — Submitted links (display register)</h2>
<div class="table-wrap"><table class="data-table">
  <thead><tr><th>ID</th><th>Submitted link</th><th>Intended ASIN</th><th>Title / category / price / rating</th><th>Official listing URL</th><th>Confirmation date</th><th>Status</th><th>Flags</th></tr></thead>
  <tbody>{rows}</tbody>
</table></div>

<h2>Table 2 — Product-intent confirmation record</h2>
<p class="fine-print">Fields <code>official_listing_url</code>, <code>confirmation_date</code> and <code>confirmation_source</code> are the evidence fields; <code>candidate_listing_url</code> and <code>observed_redirect_targets</code> are kept separate and are never merged with them. Test-order and tracking-report confirmation require an enrolled Associates workflow with completed registration — not available in this environment.</p>
<div class="table-wrap"><table class="data-table">
  <thead><tr><th>ID</th><th>Intended ASIN</th><th>Candidate listing URL</th><th>Official listing URL</th><th>Confirmation date</th><th>Confirmation source</th><th>Observed redirect targets</th><th>Test order in enrolled workflow</th></tr></thead>
  <tbody>{confirm_rows}</tbody>
</table></div>

<h2>Table 3 — Per-link enrollment test checklist (not yet executed)</h2>
<div class="table-wrap"><table class="data-table">
  <thead><tr><th>Step</th><th>What "done" looks like</th><th>State</th></tr></thead>
  <tbody>
    <tr><td>1. Open Associates Central → Product Linking → <em>Search for a Product</em> or <em>Link to Any Page</em></td><td>Link built with <code>{esc(SITE['tracking_id'])}</code></td><td><span class="status status-unverified">not done</span></td></tr>
    <tr><td>2. Place a test order through the generated Special Link</td><td>Order visible in Associates Central</td><td><span class="status status-unverified">not done</span></td></tr>
    <tr><td>3. Confirm destination and tracking report</td><td>Click attribution recorded under <code>{esc(SITE['tracking_id'])}</code></td><td><span class="status status-unverified">not done — do not scale traffic until confirmed</span></td></tr>
    <tr><td>4. Replace ambiguous links with confirmed Special Links</td><td><code>observed_redirect_targets</code> populated in <code>data/product-intent-confirmation.json</code></td><td><span class="status status-unverified">not done</span></td></tr>
  </tbody>
</table></div>
<p class="fine-print">The supplied short links are NOT declared invalid. They simply have not been validated. See <a href="verification.html">verification register</a> and <a href="flagged.html">Flagged for Review</a>.</p>
"""

# ---------- dashboard ----------
def tpl_dashboard():
    n_unverified = sum(1 for p in PRODUCTS if p["confirmation_status"] != "confirmed")
    return f"""
<p class="kicker">Dashboard</p>
<h1>Site dashboard</h1>
<p class="lede">One screen: publication status, verification status, the campaign ledger and locally-stored reader analytics. Numbers marked <em>local</em> exist only in this browser and are never transmitted unless an analytics endpoint is configured.</p>

<div class="dash-grid">
  <section class="panel"><h2>Publication</h2>
    <ul class="kv">
      <li><span>Guides published</span><strong>{len(GUIDES)} (working titles)</strong></li>
      <li><span>Next scheduled</span><strong>2026-11-24 (weekly, Tuesdays)</strong></li>
      <li><span>Feed</span><strong><a rel="nofollow" href="feed.xml">feed.xml — live</a></strong></li>
      <li><span>Sitemap</span><strong><a rel="nofollow" href="sitemap.xml">sitemap.xml — live</a></strong></li>
    </ul>
  </section>
  <section class="panel"><h2>Verification</h2>
    <ul class="kv">
      <li><span>Products confirmed</span><strong>{len(PRODUCTS)-n_unverified} / {len(PRODUCTS)}</strong></li>
      <li><span>Flagged items</span><strong><a href="flagged.html">{len(FLAGGED)} open</a></strong></li>
      <li><span>Campaign ledger rows</span><strong>0</strong></li>
      <li><span>Sources in register</span><strong>{len(REGISTER['sources'])}</strong></li>
    </ul>
  </section>
  <section class="panel panel-wide"><h2>Reader analytics <span class="fine-print">(this browser only)</span></h2>
    <div id="local-events" class="local-events" aria-live="polite"><p class="fine-print">Loading local counts…</p></div>
    <div class="dash-actions"><button class="btn btn-ghost btn-small" id="clear-local">Erase local analytics data</button></div>
    <p class="fine-print">No cookies, no fingerprinting, no personal data. Counts prove the events fire; they are not audience measurement. Real measurement requires the owner-configured endpoint and Search Console — see <a href="measurement-plan.html">measurement plan</a>.</p>
  </section>
  <section class="panel panel-wide"><h2>Surfaces on this site</h2>
    <ul class="surface-links">
      <li><a href="guides/index.html">Guides</a><span>4 question-shaped guides, working titles</span></li>
      <li><a href="products.html">Products &amp; Special Links</a><span>3 submitted links, 0 confirmed — all unverified</span></li>
      <li><a href="campaign-ledger.html">Campaign ledger</a><span>Empty by design; provenance-tracked</span></li>
      <li><a href="verification.html">Verification register</a><span>8 sources, access methods and dates</span></li>
      <li><a href="measurement-plan.html">Measurement plan</a><span>Five events, cadence, Search Console steps</span></li>
      <li><a href="flagged.html">Flagged for Review</a><span>{len(FLAGGED)} flagged items with source links</span></li>
      <li><a href="standards.html">Standards &amp; cadence</a><span>Editorial workflow and weekly cadence</span></li>
      <li><a href="executive-summary.html">Executive summary</a><span>Status, decisions and owner action list</span></li>
    </ul>
  </section>
</div>
<script src="assets/js/dashboard.js"></script>
"""

# ---------- campaign ledger ----------
def tpl_ledger():
    return f"""
<p class="kicker">Evidence-based iteration</p>
<h1>Campaign ledger</h1>
<p class="lede">An empty ledger with an honest schema — nothing is recorded here until it arrives from an authorized first-party report. No conversion score, no revenue forecast, no "expected orders".</p>
<h2>Table — ledger contents (headers only)</h2>
<div class="table-wrap"><table class="data-table">
  <thead><tr><th>recorded_at</th><th>source</th><th>channel</th><th>eligible_sessions</th><th>clicks</th><th>reported_orders</th><th>order_value</th><th>provenance</th></tr></thead>
  <tbody><tr><td colspan="8" class="empty-row">No entries yet — by design. See methodology below.</td></tr></tbody>
</table></div>
<p><a class="btn btn-ghost btn-small" href="assets/downloads/campaign-ledger.csv" download>Download ledger CSV</a></p>
<h2>Methodology</h2>
<ol class="method-list">
  <li><strong>Sources allowed:</strong> Associates Central reports (clicks, orders, shipped revenue), Search Console (queries, impressions, clicks) — nothing else without the owner's written instruction.</li>
  <li><strong>Eligible sessions:</strong> sessions on pages where at least one sponsored link appears, per the analytics endpoint, once configured. Until then this field stays empty.</li>
  <li><strong>Provenance is mandatory:</strong> every row records which report, date range, and download it came from. No row, no claim.</li>
  <li><strong>Timestamped:</strong> <code>recorded_at</code> is the moment the row was entered, not the order date.</li>
  <li><strong>No modeling:</strong> this ledger never contains modeled, estimated or forecast values. Absence of data is reported as absence.</li>
</ol>
<p class="fine-print">Priority ladder from the brief: measurement before automation. This ledger is the instrument; the five-event analytics in the <a href="measurement-plan.html">measurement plan</a> is the signal; automation comes after both prove out.</p>
"""

# ---------- verification ----------
def tpl_verification():
    rows = "".join(f"""
      <tr>
        <td><strong>{esc(s['id'])}</strong></td>
        <td><a href="{esc(s['url'])}" rel="nofollow noopener">{esc(s['source'])}</a><br><span class="fine-print">{esc(s['publisher'])}</span></td>
        <td>{esc(s['supports'])}</td>
        <td>{esc(s['access_method'])}</td>
        <td>{esc(s['verified_for'])}</td>
        <td>{esc(s['status'])}</td>
      </tr>""" for s in REGISTER["sources"])
    link_rows = "".join(f"""
      <tr><td><code>{esc(p['id'])}</code></td><td><a href="{esc(p['submitted_url'])}" rel="sponsored nofollow noopener" target="_blank" data-affiliate>{esc(p['submitted_url'])}</a></td><td><code>{esc(p['intended_asin'])}</code></td><td>Unresolvable from this environment (host blocked); status unresolved — not claimed valid or invalid</td></tr>""" for p in PRODUCTS)
    return f"""
<p class="kicker">Verification</p>
<h1>Verification register</h1>
<p class="lede">Line-by-line honesty about what was checked, how, and what was left blank. Retrieved {esc(REGISTER['retrieved'])}. Items marked <em>not reachable</em> were never opened and support no product-level claims.</p>

<h2 id="register">Table 1 — Source register</h2>
<div class="table-wrap"><table class="data-table">
  <thead><tr><th>ID</th><th>Source (link for manual review)</th><th>What it supports</th><th>Access method</th><th>Verified for</th><th>Status</th></tr></thead>
  <tbody>{rows}</tbody>
</table></div>

<h2>Table 2 — Outbound-link audit</h2>
<p class="fine-print">Environment limits: HTTPS from this build to <code>link.amazon</code> and <code>amazon.com</code> fails at the TLS layer. No page was opened; nothing was scraped. The short links are <strong>not</strong> claimed invalid; they are <strong>unresolved</strong> pending the owner's Associates Central check.</p>
<div class="table-wrap"><table class="data-table">
  <thead><tr><th>ID</th><th>Submitted link</th><th>Intended ASIN</th><th>Finding</th></tr></thead>
  <tbody>{link_rows}</tbody>
</table></div>

<h2>Table 3 — What this build deliberately does not claim</h2>
<ul class="method-list">
  <li>No product titles, prices, ratings, review counts, availability, Prime badges or dimensions — Amazon pages could not be fetched.</li>
  <li>No statements that the supplied links are or are not compliant Special Links.</li>
  <li>No popularity, ranking, conversion or revenue claims; no search-volume data exists in this environment.</li>
  <li>No scraped Amazon content of any kind; the Product Advertising API was not accessed (no credentials; would also require the API agreement).</li>
</ul>
<p class="fine-print">Retrieval date for all rows: {esc(REGISTER['retrieved'])}. Manual review: click any source link above — it opens the official page in a new tab. Where a value could not be confirmed, it is blank everywhere on this site.</p>
"""

# ---------- measurement plan ----------
def tpl_measurement():
    return f"""
<p class="kicker">Measure before optimizing</p>
<h1>Measurement plan — five events, nothing creepier</h1>
<p class="lede">Click and conversion measurement comes before any optimization. This page defines exactly what the site records, how it stays privacy-preserving, and how the next guide gets chosen from measured queries.</p>

<h2>The five defined events</h2>
<div class="table-wrap"><table class="data-table">
  <thead><tr><th>#</th><th>Event</th><th>Fires when</th><th>Payload (no PII)</th></tr></thead>
  <tbody>
    <tr><td>1</td><td><code>page_view</code></td><td>Any page loads</td><td>path, referrer host (not full URL)</td></tr>
    <tr><td>2</td><td><code>guide_read</code></td><td>Visitor scrolls ≥70% of a guide article</td><td>path, guide slug</td></tr>
    <tr><td>3</td><td><code>affiliate_outbound_click</code></td><td>Any link with <code>data-affiliate</code> is clicked</td><td>path, link host only (link.amazon / amazon.com)</td></tr>
    <tr><td>4</td><td><code>feed_subscribe_click</code></td><td>Any RSS/feed link is clicked</td><td>path</td></tr>
    <tr><td>5</td><td><code>reader_capture_submit</code></td><td>Capture form submitted with consent</td><td>path only — the email itself is NEVER logged by the tracker</td></tr>
  </tbody>
</table></div>
<p class="fine-print">Implementation: <code>docs/assets/js/analytics.js</code>. Storage: <code>localStorage</code> key <code>dh_events_v1</code> (this browser only) until an endpoint is configured. No cookies. No fingerprinting. No persistent identifier. The email address typed into the capture form is handled only by the (currently unconfigured) endpoint — never by the analytics tracker.</p>

<h2>Self-hosted endpoint (optional, included)</h2>
<p>GitHub Pages is static, so this site cannot accept POST requests by itself. The repository includes <code>tools/collector.py</code> — a stdlib-only JSONL collector you can run anywhere (a small VPS, a Raspberry Pi, a home server). To enable:</p>
<ol class="method-list">
  <li>Run <code>python3 tools/collector.py --port 8787 --out events.jsonl --allow-origin https://kanlerxz87-cyber.github.io</code> behind HTTPS (e.g. via Caddy) so the browser can reach it.</li>
  <li>Set <code>window.DIYHOME_ENDPOINT = "https://your-host/events"</code> in <code>docs/assets/js/analytics-config.js</code> and rebuild.</li>
  <li>Events are then POSTed with <code>navigator.sendBeacon</code>; they contain no PII and no cookies.</li>
</ol>
<p class="fine-print">Until then, <code>analytics-config.js</code> ships with <code>DIYHOME_ENDPOINT = null</code> and nothing leaves the browser. The <a href="dashboard.html">dashboard</a> renders this browser's local counts only.</p>

<h2>Publishing cadence</h2>
<ul class="method-list">
  <li>One guide per week, Tuesdays, next slot <strong>2026-11-24</strong>.</li>
  <li>Every new guide is a file produced by <code>tools/build.py</code>: it is automatically added to <code>sitemap.xml</code>, <code>feed.xml</code> (RSS) and the guides index on rebuild — no hand-editing of those files.</li>
  <li>Topic selection after 30 days of data: rank Search Console queries by impressions and choose the next question-shaped title from what people actually asked — never from instinct alone.</li>
</ul>

<h2>Google Search Console (owner action — SG-29)</h2>
<ol class="method-list">
  <li>Go to <a href="https://search.google.com/search-console" rel="nofollow noopener">Search Console</a> → Add property → <em>URL-prefix</em> → <code>{BASE}</code>.</li>
  <li>Verification options: HTML file upload (place the token file in the repo root of the published folder) or a <code>google-site-verification</code> meta tag added in <code>tools/build.py</code>'s <code>head()</code> — do NOT invent a token; use the one Google issues for your property.</li>
  <li>Sitemaps → submit <code>{BASE}sitemap.xml</code>.</li>
  <li>After 7–28 days, export Performance → Queries; the top questions become the next guides.</li>
</ol>

<h2>Exit criteria before optimization work starts</h2>
<ul class="method-list">
  <li>≥ 30 days of <code>page_view</code>/<code>guide_read</code> data,</li>
  <li>Associates Central clicks reconciled against <code>affiliate_outbound_click</code> (allowing for browsers blocking beacons),</li>
  <li>At least one authorized first-party orders report available to seed the <a href="campaign-ledger.html">campaign ledger</a>.</li>
</ul>
"""

# ---------- flagged ----------
def tpl_flagged():
    sev_order = {"high": 0, "medium": 1, "low": 2}
    items = sorted(FLAGGED, key=lambda f: (sev_order.get(f["severity"], 3), f["id"]))
    rows = "".join(f"""
      <article class="flag-item sev-{esc(f['severity'])}" id="{esc(f['id'])}">
        <header><span class="flag-id">{esc(f['id'])}</span><span class="sev sev-{esc(f['severity'])}">{esc(f['severity'])}</span><h2>{esc(f['title'])}</h2></header>
        <p>{esc(f['detail'])}</p>
        <p><strong>Required action:</strong> {esc(f['action'])}</p>
        {'<p class="fine-print">Sources: ' + ' · '.join(f'<a rel="nofollow noopener" href="{esc(u)}">{esc(u)}</a>' for u in f['source_urls']) + '</p>' if f['source_urls'] else '<p class="fine-print">Sources: none external (internal build artifact)</p>'}
      </article>""" for f in items)
    return f"""
<p class="kicker">Flagged for Review</p>
<h1>Flagged for Review</h1>
<p class="lede">Every irregularity, gap and unverifiable item in this build — published plainly, with source links, so you can review after the site is live and request changes. Flagged items do not block the merge. Sorted by severity.</p>
<div class="callout">Nothing on this page is decoration. Each item needs either an official-source check by you, or an explicit keep/change decision. Nothing here is claimed to be fixed.</div>
{rows}
"""

# ---------- standards ----------
def tpl_standards():
    return f"""
<p class="kicker">Standards</p>
<h1>Publishing standards &amp; cadence</h1>
<p class="lede">What gets published, how it is checked before publication, how often, and how to correct it.</p>

<h2>Cadence</h2>
<ul class="method-list">
  <li><strong>Weekly, Tuesdays.</strong> Next slot: 2026-11-24. One guide per slot; no batch publishing without a review pass.</li>
  <li><strong>Pipeline:</strong> question-shaped title (from measured queries once available, else editorial hypothesis labelled as such) → outline → draft → disclosure &amp; claims check → <code>data/guides.json</code> → <code>python3 tools/build.py</code> → <code>python3 tools/check_links.py</code> → commit → PR → merge → Pages deploy.</li>
  <li><strong>Sitemap &amp; feed:</strong> both are generated from <code>guides.json</code> on every rebuild; a new guide cannot ship without appearing in both.</li>
</ul>

<h2>Editorial rules</h2>
<ol class="method-list">
  <li>Questions first. Guides are titled as questions a buyer would actually ask.</li>
  <li>No unverifiable specifics. If a value cannot be checked against an official source at build time, it is blank and flagged — never estimated.</li>
  <li>No ranking language. No "best", "top", "#1", "most popular" unless backed by first-party data and clearly labelled with date and source.</li>
  <li>Sponsored links marked three ways: <code>rel="sponsored nofollow noopener"</code>, visible ↗ + "sponsored" note next to the link, and the above-the-fold disclosure strip.</li>
  <li>Amazon content rules: no Amazon images scraped into pages, no product copy quoted from listings, no prices displayed without a dated fetch (dates shown, and only from authorized access).</li>
  <li>Every page shows datePublished/dateModified and the masthead author (DIY Home Upgrades Editorial).</li>
</ol>

<h2>Review &amp; corrections</h2>
<ul class="method-list">
  <li>Corrections policy: <a href="about.html#corrections">see About</a>. Substantive corrections bump <code>updated</code> and trigger a rebuild and feed touch.</li>
  <li>Compliance review each quarter: disclosure strip wording, footer disclosure, rel attributes, and the Operating Agreement's current wording (link on the <a href="verification.html">verification register</a>).</li>
  <li>Flagged items are never silently closed: closing one means editing <code>data/flagged.json</code> with a dated note of what evidence resolved it.</li>
</ul>
"""

# ---------- about ----------
def tpl_about():
    return f"""
<p class="kicker">About</p>
<h1>About DIY Home Upgrades</h1>
<p class="lede">An independent, disclosure-first affiliate publication about DIY home upgrades and kitchen appliances — built so a reader can act, and a reviewer can verify.</p>
<h2>Who writes it</h2>
<p>Articles are written by <strong>DIY Home Upgrades Editorial</strong>, the publication's editorial desk, and reviewed against the checklist on the <a href="standards.html">standards page</a> before publication. We do not attach invented human names or fake personas to articles. Where hands-on testing is referenced it will be labelled as such with dates and methods; this build contains no tested claims.</p>
<h2>Editorial independence</h2>
<p>Commissions from the Amazon Services LLC Associates Program do not buy placement, ranking or review tone. Tracking ID: <code>{esc(SITE['tracking_id'])}</code>. Advertisers cannot request edits; corrections come only from readers, owners or new official evidence.</p>
<h2 id="corrections">Corrections policy</h2>
<ol class="method-list">
  <li>Email or open a GitHub issue naming the page and the claim.</li>
  <li>We re-check the claim against the cited source or a new official source.</li>
  <li>If wrong: fix in <code>data/*.json</code>, rebuild, redeploy, and note the change in the article's <code>updated</code> date. If right: we reply with the evidence.</li>
</ol>
<h2>Contact</h2>
<p>Repository: <a href="https://github.com/kanlerxz87-cyber/DIYHOME2" rel="nofollow noopener">github.com/kanlerxz87-cyber/DIYHOME2</a> (use Issues for corrections and flagged-item evidence).</p>
"""

# ---------- disclosure ----------
def tpl_disclosure():
    return f"""
<p class="kicker">Disclosure</p>
<h1>Disclosure &amp; affiliate relationship</h1>
<div class="callout"><strong>As an Amazon Associate I earn from qualifying purchases.</strong> This sentence also appears verbatim at the top (above the fold) and in the footer of every page on this site, per the Associates Program Operating Agreement (clause 5).</div>
<h2>What that means for you</h2>
<ul class="method-list">
  <li>Clicking a product link on this site and buying something at Amazon may earn us a commission — at no extra cost to you.</li>
  <li>Commissions never buy placement, score, rating or wording. If we cannot verify a claim, it does not run.</li>
  <li>Prices, availability, Prime eligibility and ratings change; always confirm on the Amazon listing before buying. This site displays no live prices.</li>
</ul>
<h2>How links are marked here</h2>
<ul class="method-list">
  <li>Visible <code>↗</code> arrow and "Outbound links (sponsored)" box beside outbound product links.</li>
  <li><code>rel="sponsored nofollow noopener"</code> on every affiliate anchor — machine-readable sponsorship signal, per search-engine and FTC guidance.</li>
  <li>The disclosure strip directly under the masthead and repeated in the footer — always visible, never only in the footer.</li>
</ul>
<h2>Regulatory references (links for manual review)</h2>
<ul class="method-list">
  <li>Amazon Associates Program Operating Agreement — <a href="https://affiliate-program.amazon.com/help/operating/agreement" rel="nofollow noopener">affiliate-program.amazon.com/help/operating/agreement</a></li>
  <li>Amazon Associates Program Policies — <a href="https://affiliate-program.amazon.com/help/operating/policies" rel="nofollow noopener">affiliate-program.amazon.com/help/operating/policies</a></li>
  <li>Participation Requirements — <a href="https://affiliate-program.amazon.com/help/operating/participation/" rel="nofollow noopener">affiliate-program.amazon.com/help/operating/participation/</a></li>
  <li>FTC Endorsement Guides hub (16 CFR Part 255) — <a href="https://www.ftc.gov/business-guidance/advertising-marketing/endorsements-influencers-reviews" rel="nofollow noopener">ftc.gov — Endorsements, Influencers, and Reviews</a></li>
  <li>FTC, 2023 update to the Endorsement Guides — <a href="https://www.ftc.gov/news-events/news/press-releases/2023/06/federal-trade-commission-announces-updated-advertising-guides-combat-deceptive-reviews-endorsements" rel="nofollow noopener">ftc.gov press release, June 2023</a></li>
</ul>
<p class="fine-print">Access status of these sources from this build: web-search excerpts only (hosts not fetchable from the sandbox). See <a href="verification.html">verification register</a> for the full audit. This page is not legal advice.</p>
"""

# ---------- privacy ----------
def tpl_privacy():
    return f"""
<p class="kicker">Privacy</p>
<h1>Privacy &amp; measurement</h1>
<h2>What this site stores</h2>
<ul class="method-list">
  <li><code>localStorage["dh_events_v1"]</code> — an array of anonymous event objects (<code>page_view</code>, <code>guide_read</code>, <code>affiliate_outbound_click</code>, <code>feed_subscribe_click</code>, <code>reader_capture_submit</code>) with timestamp, path and — for clicks — the destination host only. No cookies. No fingerprinting. No persistent ID.</li>
  <li>No email addresses are stored by this site unless and until the owner configures the capture endpoint; the capture form is inert otherwise.</li>
  <li>No advertising, analytics or social-media third-party scripts are loaded. Amazon does not receive any data from this site beyond the click itself when you choose to follow an outbound link.</li>
</ul>
<h2>What this site never stores</h2>
<ul class="method-list">
  <li>Names, addresses, precise location, device fingerprints, cross-site identifiers.</li>
  <li>Reading history beyond this browser's local event list, which you can erase anytime from the <a href="dashboard.html">dashboard</a> ("Erase local analytics data") or by clearing site storage.</li>
</ul>
<h2>Your choices</h2>
<p>Blocking JavaScript or storage keeps the site fully readable — only the five counters and the capture form degrade. Outbound clicks always reach Amazon with the link as published; Amazon's own privacy practices apply on their site: <a href="https://www.amazon.com/privacy" rel="nofollow noopener">amazon.com/privacy</a>.</p>
"""

# ---------- executive summary ----------
def tpl_exec_summary():
    return f"""
<p class="kicker">Executive summary</p>
<h1>Executive summary — DIY Home Upgrades (2026-11-20)</h1>
<p class="lede">Full text also in the repository root as <code>EXECUTIVE_SUMMARY.md</code>. This page is the reader-facing copy.</p>
<h2>What was delivered</h2>
<ul class="method-list">
  <li>GitHub Pages publication <strong>DIY Home Upgrades</strong>: front page, 4 question-shaped guides (working titles), products register, dashboard, campaign ledger (empty by design), verification register, measurement plan, standards, flagged-for-review list, disclosure, privacy.</li>
  <li>Five-event privacy-preserving analytics with a self-hostable stdlib collector (<code>tools/collector.py</code>); endpoint off until owner configures it.</li>
  <li>Compliance baseline: verbatim Associates disclosure above the fold and in footer on every page; all outbound links <code>rel="sponsored nofollow noopener"</code>; FTC Endorsement Guides placement rules applied.</li>
  <li>Source register with access methods and retrieval date; 10 flagged items, none silently resolved.</li>
</ul>
<h2>What could not be verified (read this first)</h2>
<ul class="method-list">
  <li><strong>Every Amazon product attribute</strong> (title, price, rating, availability, images) — Amazon unreachable from the build environment. All such values are blank and flagged (F-001, F-004, F-005).</li>
  <li><strong>The three submitted link.amazon short links</strong> — destinations and Special Links compliance unresolved; not claimed valid or invalid (F-003).</li>
  <li><strong>Duplicate submission</strong> of link.amazon/B03QDuGdo (F-002).</li>
  <li><strong>Search Console</strong> ownership (SG-29) and any keyword data — owner action required (F-006, F-010).</li>
</ul>
<h2>Compliance posture</h2>
<ul class="method-list">
  <li>Disclosure sentence verbatim: "As an Amazon Associate I earn from qualifying purchases." — above the fold and in footer, every page.</li>
  <li>No Amazon trademarks used beyond nominative reference with attribution lines; no Amazon imagery or listing copy on this site.</li>
  <li>No pricing displayed anywhere; no conversion or revenue figures; campaign ledger headers only.</li>
  <li>FTC 16 CFR Part 255: material-connection disclosure is unavoidable on every page for electronic media standards.</li>
</ul>
<h2>Owner action list (priority order)</h2>
<ol class="method-list">
  <li>Resolve F-003: Associates Central → test each of the three links; record observed targets + confirmation date in <code>data/product-intent-confirmation.json</code>.</li>
  <li>Resolve F-001/F-004/F-005: confirm ASINs map to real products; fill <code>products.json</code> only from official evidence.</li>
  <li>Deploy <code>tools/collector.py</code> (or any beacon endpoint), set <code>DIYHOME_ENDPOINT</code> in <code>assets/js/analytics-config.js</code>, rebuild.</li>
  <li>Search Console: add URL-prefix property for <code>{BASE}</code>, verify, submit sitemap.xml.</li>
  <li>After 30 days: pick the next guide from measured Search Console queries, not instinct; keep the Tuesday cadence.</li>
</ol>
<h2>Risks &amp; notes</h2>
<ul class="method-list">
  <li>Affiliate links unconfirmed ⇒ commissions may be zero until F-003 is resolved; do not scale spend on traffic until then.</li>
  <li>FTC/Associates sources verified only via search excerpts from this environment; owner should re-read the current Operating Agreement before paid promotion (F-009).</li>
  <li>GitHub Pages is static; the "self-hosted analytics endpoint" is provided as code + docs, not as a running service.</li>
</ul>
"""

# ---------- 404, sitemap, feed, robots ----------
def tpl_404():
    return f"""
<p class="kicker">404</p>
<h1>That page moved — or never existed</h1>
<p class="lede">Try the <a href="guides/index.html">guides</a>, the <a href="products.html">product register</a>, or the <a href="index.html">front page</a>. If a link on this site led you here, please tell us via GitHub Issues so we can fix it.</p>
"""

def sitemap_xml(written):
    urls = []
    for p in written:
        loc = BASE + p
        pri = "1.0" if p == "index.html" else ("0.8" if p.startswith("guides/") else "0.6")
        urls.append(f"  <url><loc>{esc(loc)}</loc><lastmod>{TODAY}</lastmod><priority>{pri}</priority></url>")
    return '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + "\n".join(urls) + "\n</urlset>\n"

def rss_xml():
    items = []
    for g in GUIDES:
        items.append(f"""    <item>
      <title>{esc(g['title'])}</title>
      <link>{BASE}guides/{esc(g['slug'])}.html</link>
      <guid isPermaLink="true">{BASE}guides/{esc(g['slug'])}.html</guid>
      <pubDate>{datetime.datetime.strptime(g['published'], '%Y-%m-%d').strftime('%a, %d %b %Y 09:00:00 GMT')}</pubDate>
      <description>{esc(g['dek'])}</description>
    </item>""")
    return f"""<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>{esc(SITE['site_name'])}</title>
    <link>{BASE}</link>
    <atom:link href="{BASE}feed.xml" rel="self" type="application/rss+xml"/>
    <description>{esc(SITE['tagline'])}</description>
    <language>en</language>
    <lastBuildDate>{datetime.datetime(2026, 11, 20, 9, 0, 0).strftime('%a, %d %b %Y %H:%M:%S GMT')}</lastBuildDate>
{chr(10).join(items)}
  </channel>
</rss>
"""

def robots_txt():
    return f"User-agent: *\nAllow: /\nSitemap: {BASE}sitemap.xml\n"

def main():
    if OUT.exists():
        # Remove only generated files; keep docs/assets (hand-authored CSS/JS/images)
        for pat in ("*.html",):
            for p in OUT.glob(pat):
                p.unlink()
        gdir = OUT / "guides"
        if gdir.exists():
            for p in gdir.glob("*.html"):
                p.unlink()
        for name in ("sitemap.xml", "feed.xml", "robots.txt"):
            f = OUT / name
            if f.exists():
                f.unlink()
    written = []
    for path, title, desc, body, extra, ptype in pages():
        written.append(page(path, title, desc, body, extra))
    page("404.html", "Page not found — " + SITE["site_name"], "The page you were looking for does not exist.", tpl_404())
    (OUT / "sitemap.xml").write_text(sitemap_xml(sorted(set(written) | {"404.html"})), encoding="utf-8")
    (OUT / "feed.xml").write_text(rss_xml(), encoding="utf-8")
    (OUT / "robots.txt").write_text(robots_txt(), encoding="utf-8")
    dl = OUT / "assets" / "downloads"
    dl.mkdir(parents=True, exist_ok=True)
    (dl / "campaign-ledger.csv").write_text((DATA / "campaign-ledger.csv").read_text(), encoding="utf-8")
    print(f"Built {len(set(written) | {'404.html'}) + 3} files into {OUT}")

if __name__ == "__main__":
    sys.exit(main())
