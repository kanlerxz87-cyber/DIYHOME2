from pathlib import Path
from html import escape as e
from xml.etree import ElementTree as ET

BASE = 'https://kanlerxz87-cyber.github.io/DIYHOME2/'
DATE = '2026-11-20'      # date the listings were first observed and the redirects read
RECHECK = '2026-11-21'   # date of the independent re-verification pass
NOTICE = 'As an Amazon Associate I earn from qualifying purchases.'
AMAZON = 'https://affiliate-program.amazon.com/help/operating/agreement'
FTC = 'https://www.ftc.gov/business-guidance/resources/ftcs-endorsement-guides-what-people-are-asking'
rows = [
    ('B0hmGG4m2', 'B08FKW9JRM', 'Art3d wallpaper smoothing kit', ''),
    ('B03QDuGdo', 'B0BSKQW2T2', 'Under-cabinet paper towel holder', ''),
    ('B03QDuGdo', 'B0BSKQW2T2', 'Under-cabinet paper towel holder', 'Duplicate of submission 02. '),
    ('B0hpD2JGQ', 'B08DY9HRWD', 'ORDORA pots and pans organizer', ''),
]
guides = [
    ('wallpaper', 'Walls', 'What tools do you need for peel-and-stick wallpaper?', 'Start with the wall, not the tool kit.', [
        ('Check the surface first', 'Read the wallpaper maker’s instructions for surface prep and paint cure time. Try a sample in an inconspicuous area before committing to a whole wall.'),
        ('Plan the tricky cuts', 'Sketch where seams, corners and trim land. Before buying a bundle, check whether you already own a straightedge, a suitable cutting tool and something the wallpaper maker recommends for smoothing.')]),
    ('paper-towels', 'Kitchen', 'Where should an under-cabinet paper towel holder go?', 'Find a spot that works with a full roll.', [
        ('Try the reach', 'Hold a full roll where you’d mount the holder. Check whether you can reach it with one hand without bumping cabinet doors or blocking the counter.'),
        ('Compare mounting options', 'Check the maker’s surface requirements before choosing adhesive. If you’re considering screws, confirm cabinet thickness and whether you have permission to drill.')]),
    ('cookware', 'Storage', 'Will a pan organizer fit your cabinet?', 'Measure with the pans and lids you already use.', [
        ('Measure the opening', 'Record the usable height, width and depth, including any hinges or face frame that narrow the entry. Measure your widest pan with its handle and tallest lid.'),
        ('Check the everyday fit', 'Compare the maker’s shelf spacing and weight limits with the pieces you actually use. Sketch where handles will sit and make sure you can remove one pan without unloading the cabinet.')]),
    ('air-fryers', 'Kitchen', 'Basket or oven-style air fryer: what should you compare?', 'Compare the space, cleanup and batch size before choosing a format.', [
        ('Compare usable space, not just capacity', 'Pick a meal you cook often. Check the tray or basket dimensions and compare how much of that meal fits in a single batch. For a multi-function appliance, check which accessories are needed for the modes you expect to use.'),
        ('Make room for use and cleanup', 'Measure the space needed to open the door or pull the basket out. Check the manual for clearance requirements and which parts can go in the dishwasher.')]),
]
ops = [('review','Flagged for Review'),('summary','Executive summary'),('measurement','Measurement'),('measurement/index','Campaign desk'),('sources','Citation register'),('standards','Editorial standards'),('audit/index','Spec & policy audit')]
worksheet = 'field-notes/counter-fit/'
worksheet_title = 'Will an air fryer fit on your counter?'
worksheet_desc = 'Measure your counter against the exact model and clearance requirements in a private worksheet.'
worksheet_card = f'<aside class="card"><div class="eyebrow">Kitchen field notes · Interactive</div><h3><a href="{worksheet}">{worksheet_title}</a></h3><p>{worksheet_desc}</p><a href="{worksheet}">Check your counter →</a></aside>'
pages = {}
def link(slug, text):
    return f'<a href="{slug}.html">{e(text)}</a>'

def source(url, text, product=False):
    rel = ' rel="sponsored noopener"' if product else ''
    return f'<a href="{e(url, quote=True)}"{rel}>{e(text)}</a>'

def add(slug, title, desc, content):
    pages[slug] = (title, desc, content)

def intro(label, title, desc):
    return f'<div class="intro"><div class="eyebrow">{e(label)}</div><h1>{e(title)}</h1><p class="lede">{e(desc)}</p></div>'

def cards(items, shopping=False):
    art = {'wallpaper': ('walls','Wallpaper smoothing kit'),
           'paper-towels': ('counter','Under-cabinet paper towel holder'),
           'cookware': ('cabinet','Adjustable pan organizer')}
    result = []
    for slug,cat,title,desc,_ in items:
        image, product = art.get(slug, ('', title))
        photo = f'<img class="edit-photo" src="assets/{image}.jpg" alt="" width="600" height="380" loading="lazy">' if image else ''
        heading = product if shopping else title
        result.append(f'<article class="card">{photo}<div class="eyebrow">{e(cat)}</div><h3>{link(slug,heading)}</h3><p>{e(desc)}</p>{link(slug,"Read the guide →")}</article>')
    return '<div class="grid">'+''.join(result)+'</div>'

add('index','DIY Home Upgrades','Practical shopping guides for kitchens, walls, and the spaces in between.', '''<section class="hero"><div class="hero-copy"><div class="eyebrow">The practical home edit</div><h1>Small upgrades.<br>Better everyday.</h1><p>Find the right tools for a smoother wall, a clearer counter, and a cabinet that finally works for you.</p><a class="button" href="#edits">Explore the upgrades →</a></div><img src="assets/hero.jpg" alt="Sunlit kitchen with oak cabinets and a warm cream wall"></section><section id="edits"><div class="sectionhead"><div><div class="eyebrow">The shopping edit</div><h2>Three upgrades to start with</h2></div><a href="guides.html">All buying guides →</a></div>'''+cards(guides[:3], shopping=True)+'''</section><section class="card"><div class="eyebrow">In the kitchen</div><h2>Shopping for an air fryer?</h2><p>Compare usable capacity, cleanup and the space you’ll need before choosing a format.</p><a href="air-fryers.html">Read the air fryer guide →</a></section><section class="sectionhead"><div><div class="eyebrow">The shop floor</div><h2>Every product, by room</h2></div><a href="shop.html">Open the shop →</a></section><div class="grid"><article class="card"><div class="eyebrow">Room refresh</div><h3><a href="category/wallpaper-tools.html">Wallpaper &amp; peel-and-stick tools</a></h3><p>What decides whether a peel-and-stick job looks flat.</p></article><article class="card"><div class="eyebrow">Kitchen counters</div><h3><a href="category/paper-towel-holders.html">Paper towel holders</a></h3><p>Get the roll off the counter without drilling.</p></article><article class="card"><div class="eyebrow">Cabinet interiors</div><h3><a href="category/pot-racks.html">Pot racks &amp; cookware organizers</a></h3><p>Turn a leaning stack of pans into a drawer you can read.</p></article></div>''')
_working_titles = [
    ('Basket or oven-style air fryer: what should you compare?', 'Published as the air fryer guide.', link('air-fryers','Read the guide')),
    ('A no-hype checklist for comparing air fryer capacity', 'Not yet publishable — no verified air fryer listing in the catalogue.', '—'),
    ('How to assess cleanup and counter-space trade-offs', 'Not yet publishable — no verified air fryer listing in the catalogue; the method is reused in the published air fryer guide.', '—'),
    ('Questions to ask before buying a multi-function kitchen appliance.', 'Not yet publishable — no verified appliance listing in the catalogue.', '—'),
]
_working_rows = ''.join(f'<tr><td>{e(t)}</td><td>{e(s)}</td><td>{l}</td></tr>' for t,s,l in _working_titles)
_working_html = '<div class="prose"><h2>Working titles — not yet publishable</h2><p>These are working titles — not claims about popularity, search volume or product superiority. They were set aside because writing them honestly would require specifications from a verified listing, and no air fryer or multi-function appliance listing is in the supplied catalogue. The underlying method was reused for the three product categories the site can support.</p></div><div class="scroll"><table><thead><tr><th scope="col">Working title</th><th scope="col">Status</th><th scope="col">Link</th></tr></thead><tbody>'+_working_rows+'</tbody></table></div>'
add('guides','Buying guides','Buyer checklists for kitchen storage, walls and countertop appliances.',intro('The buying desk','Buying guides','Start with a question, then check the details that matter in your home.')+cards(guides)+worksheet_card+_working_html)
for i,(slug,cat,title,desc,sections) in enumerate(guides):
    body = ''.join(f'<h2>{e(h)}</h2><p>{e(p)}</p>' for h,p in sections)
    if slug == 'air-fryers':
        body += worksheet_card
    if i < 3:
        _,asin,name,_ = rows[[0,1,3][i]]
        body += f'<aside class="card"><div class="eyebrow">Product to research</div><h3>{e(name)}</h3><p>Observed in an Amazon redirect check on {DATE}. This isn’t a confirmed recommendation or a paid link.</p>{source("https://www.amazon.com/dp/"+asin,"Amazon listing · reference only",True)}</aside>'
    add(slug,title,desc,intro(cat,title,desc)+f'<article class="prose"><p class="eyebrow">DIY Home Upgrades editorial desk · {DATE}</p>{body}<p>{link("guides","Back to all guides →")}</p></article>')

def table(headers, data):
    return '<div class="scroll"><table><thead><tr>'+''.join(f'<th scope="col">{e(h)}</th>' for h in headers)+'</tr></thead><tbody>'+''.join('<tr>'+''.join(f'<td>{v}</td>' for v in row)+'</tr>' for row in data)+'</tbody></table></div>'

_cite_link = link('sources','citation register')
register = []
for n,(short,asin,name,note) in enumerate(rows,1):
    register.append((f'{n:02}',f'<code>https://link.amazon/{short}</code>', e(name),source('https://www.amazon.com/dp/'+asin,asin,True),DATE,'','','','',note+'Unverified intent and tracking.'))
_recheck = table(['ASIN','Listing re-checked','What matched the published record','Source'], [
    ('B08FKW9JRM', RECHECK,
     'Title, brand Art3d, sold by Art3d\u00ae, ships from Amazon, browse node 164701011 Wallpaper Tools, five kit contents exactly as listed.',
     source('https://www.amazon.com/dp/B08FKW9JRM','Amazon listing',True)),
    ('B0BSKQW2T2', RECHECK,
     'Title, brand niffgaff, sold by YH Urban, Material Aluminum, Color Black, Mounting Type Under Cabinet Mount, Item Weight 5 ounces, Product Dimensions 2.56&quot;L x 12.2&quot;W, Size 12.2 inches, browse node 3744201.',
     source('https://www.amazon.com/dp/B0BSKQW2T2','Amazon listing',True)),
    ('B08DY9HRWD', RECHECK,
     'Title (16.6&quot;, 8-tier, lightweight cookware up to 11&quot;), brand ORDORA, sold by ORDORA Official, eight size options, four colours, browse node 289824 Pot Racks.',
     source('https://www.amazon.com/dp/B08DY9HRWD','Amazon listing',True)),
])
_review_body = (
    intro('Site records', 'Flagged for Review',
          'Blank fields have not been verified. A redirect observation is not product intent or a tracking test.')
    + table(['Entry','Submitted URL','Observed listing title (shortened)','Observed target \u00b7 Amazon source',
             'Observed date','Intended ASIN','Intended official listing','Confirmation date','Confirmation source','Status'], register)
    + f'<h2>Re-verification pass \u00b7 {RECHECK}</h2>'
      '<p>Each listing was fetched again from amazon.com and compared field by field with the records that '
      'render the shop tables. Prices, star ratings, review counts and bought-in-past-month figures were '
      'visible on those pages and are deliberately not published, per S02.</p>'
    + _recheck
    + '<p><small>The <code>link.amazon</code> redirector hosts were outside this build\u2019s network range, so the '
      'short links themselves were not re-fetched. The listing pages they were recorded as resolving to are '
      're-confirmed above. That redirect observation is dated 2026-11-20 and is not reasserted for today. '
      'An unobserved redirect is not evidence that a link is invalid.</small></p>'
    + f'<p>Selected tracking ID: <code>shopnow047c-20</code> (submitted, not validated). The short links\u2019 '
      'compliance is unresolved; they are not declared invalid. See '
    + source(AMAZON, 'Amazon\u2019s Special Link requirements')
    + f' and the {_cite_link} for the ASIN definition these codes were measured against.</p>'
)
add('review','Flagged for Review','Product intent and observed redirect evidence.', _review_body)
_summary_products = []
for _n,(_short,_asin,_name,_note) in enumerate(rows,1):
    _summary_products.append((f'{_n:02}', e(_name), source('https://www.amazon.com/dp/'+_asin,_asin,True), DATE, '', _note+'Unverified intent and tracking.'))
_summary_verify = [
    ('Affiliate disclosure wording', 'Verified — required statement, clearly and prominently placed', link('sources','S01 · Operating Agreement §5')),
    ('ASIN definition (10 characters)', 'Verified — short codes are 9 characters and cannot be ASINs', link('sources','S06 · ASIN guide')),
    ('Price display', 'Prohibited without API access — no price published', link('sources','S02 · Program Policies')),
    ('Star ratings / review counts', 'Prohibited without API access — none published', link('sources','S02 · Program Policies')),
    ('Commission rates', 'Unverified — rate card behind sign-in; no rate published', link('sources','S03 · Rate card (restricted)')),
    ('Tracking ID shopnow047c-20', 'Unverified — no tag observed; Special Link test pending', link('review','Flagged for Review')),
    ('Campaign ledger', 'Empty by design — no authorized first-party report supplied', link('measurement','Measurement')),
]
from summary import register_summary
register_summary(add, table, link, source, intro, RECHECK, DATE)
add('standards','Editorial standards','How guides are written, checked and published.',intro('Site records','Editorial standards','By the DIY Home Upgrades editorial desk. Buying checklists, not hands-on reviews.')+f'''<div class="prose"><h2>Publication gate</h2><p>Confirm product intent against an official listing and save the date and source separately from the redirect. Generate a Special Link through enrolled Associates tools, then verify the destination and authorized tracking report before publishing it. Keep a paid-link notice next to each approved link and the Associates notice on every page.</p><p>Review {source(AMAZON,'the Operating Agreement')}, {source('https://affiliate-program.amazon.com/help/operating/policies','Amazon’s Program Policies')} and {source(FTC,'FTC endorsement guidance')} before publishing. Every document behind every claim, with the date it states and the constraint it imposes, is kept in the {link('sources','citation register')}. Do not scrape Amazon or use product images, ratings, prices or API content without confirming rights, sourcing and freshness requirements. The masthead photograph is AI-generated editorial imagery, not a product depiction.</p><h2>Publishing rhythm</h2><p>Proposed: one question-led guide every two weeks, with a monthly evidence and link review. Start with walls and kitchen storage; revisit seasonal topics only when they fit reader needs. Every new entry in the guide register updates the sitemap and RSS feed on build.</p></div>''')
add('measurement','Measurement','Campaign ledger and analytics status.',intro('Site records','Measurement','No campaign results have been imported.')+table(['Timestamp','Authorized source','Channel','Eligible sessions','Clicks','Reported orders'],[])+f'''<div class="prose"><p>The ledger is empty, not zero. Import only aggregate figures from authorized first-party reports and retain a dated provenance trail. Use {source('https://affiliate-program.amazon.com/','Associates Central')} for reported orders; outbound clicks are not conversions.</p><p>Production telemetry is not connected. GitHub Pages cannot execute the optional collector. Search Console ownership has not been verified; the sitemap is available for submission. Reader subscriptions use RSS without collecting email addresses.</p></div>''')

# --- Citation register (added by arena/ecb1bfed-diyhome2; additive only) ---
# Every claim on the site resolves to one of these documents. Policy and guidance
# titles link straight to the publisher; Amazon listing and redirector URLs are
# printed as plain text, because a citation is evidence rather than an offer and
# an untagged Amazon product link is not a Special Link.
_cite_doc = __import__('json').loads(Path('data/citation-register.json').read_text())
_cite_by_id = {s['id']: s for s in _cite_doc['sources']}
_cite_rows = []
for _s in _cite_doc['sources']:
    # Anything shipping a product or a shortener is printed, never linked: a
    # citation must not become an untagged, untracked outbound Amazon click.
    _is_product = _s['url'].startswith('https://www.amazon.com/dp/') or _s['url'].startswith('https://link.amazon/') or 'link.amazon' in _s['url']
    _doc = f'<code>{e(_s["url"])}</code>' if _is_product else source(_s['url'], _s['title'])
    _state = '<span class="pill ok">read in full</span>' if _s['access'] == 'public' else '<span class="pill gap">sign-in required</span>'
    _cite_rows.append((f'<strong id="src-{e(_s["id"])}">{e(_s["id"])}</strong>', _doc + f'<br><small>{e(_s["section"])}</small>', e(_s['publisher']), e(_s['dated_on_page']), _state, e(_s['claim'])))
_cite_cons = []
for _c in _cite_doc['constraints']:
    # Point each basis at its row in the table above rather than at the raw
    # source URL. That keeps every product and shortener URL as text, and it
    # reads better: the reader lands on the evidence, not on a bare redirect.
    _basis = ', '.join(f'<a href="#src-{e(i)}">{e(i)}</a>' for i in _c['basis'].split(', ') if i in _cite_by_id)
    _cite_cons.append((f'<strong>{e(_c["id"])}</strong>', e(_c['constraint']), _basis, e(_c['effect_on_site'])))
add('sources','Citation register','Official documents behind every claim, and the constraints they impose.',intro('Site records','Citation register',f'{len(_cite_doc["sources"])} documents behind every claim on this site, plus the rules they impose on it.')+table(['ID','Document','Publisher','Dated on page','Access','What it establishes'],_cite_rows)+'<div class="prose"><h2>What these documents constrain</h2><p>Six rules follow directly from the sources above. They are the reason this site shows no prices, no star ratings and no price alerts, and the reason links are plain rather than shortened.</p></div>'+table(['ID','Constraint','Basis','Effect on this site'],_cite_cons)+'<div class="prose"><p><small>Amazon listing and redirector URLs are printed as plain text so they can be copied and checked by hand. A citation is evidence, not a product offer; linking an untagged Amazon product page would put a non-Special link on the site, which the Participation Requirements do not allow. Product pages the reader is invited to visit appear on the buying guides, and every one carries a sponsored marker.</small></p></div>')

def page_shell(title, desc, body, canonical, page_id, prefix=''):
    """One HTML shell for every page, so navigation, disclosure, footer and the
    findability meta cannot drift between pages.

    `prefix` is '' for root pages and '../' for pages one directory deep. The open
    graph and JSON-LD tags come from the findability pass (arena/175d82e7); they
    use only verified facts - site name, canonical URL, page description and the
    on-disk hero image. No rating, price, popularity or revenue claim is emitted.
    """
    dashboard = ' '.join(f'<a href="{prefix}{s}.html">{e(t)}</a>' for s,t in ops)
    head_title = f'{e(title)}{" | DIY Home Upgrades" if page_id != "index" else ""}'
    og_title = title if page_id == 'index' else f'{title} | DIY Home Upgrades'
    og_type = 'article' if page_id in ('wallpaper','paper-towels','cookware','air-fryers','guides') else 'website'
    og_image = BASE + 'assets/hero.jpg'
    jsonld = __import__('json').dumps({'@context':'https://schema.org','@type':'WebSite','name':'DIY Home Upgrades','url':BASE,'description':pages['index'][1],'inLanguage':'en','publisher':{'@type':'Organization','name':'DIY Home Upgrades','url':BASE}}, separators=(',',':'))
    return f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{head_title}</title><meta name="description" content="{e(desc,quote=True)}"><meta name="author" content="DIY Home Upgrades editorial desk"><link rel="canonical" href="{canonical}"><meta property="og:site_name" content="DIY Home Upgrades"><meta property="og:title" content="{e(og_title,quote=True)}"><meta property="og:description" content="{e(desc,quote=True)}"><meta property="og:url" content="{canonical}"><meta property="og:type" content="{og_type}"><meta property="og:image" content="{og_image}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="{e(og_title,quote=True)}"><meta name="twitter:description" content="{e(desc,quote=True)}"><meta name="twitter:image" content="{og_image}"><script type="application/ld+json">{jsonld}</script><link rel="alternate" type="application/rss+xml" title="DIY Home Upgrades" href="{prefix}feed.xml"><link rel="stylesheet" href="{prefix}assets/style.css"><script src="{prefix}assets/metrics.js" defer></script></head><body><header><div class="wrap mast"><a class="brand" href="{prefix}./">DIY Home<span> Upgrades</span></a><nav aria-label="Main navigation"><a href="{prefix}shop.html">Shop</a><a href="{prefix}guides.html">Buying guides</a><a href="{prefix}feed.xml">RSS</a><details><summary>Site records</summary><div class="dropdown">{dashboard}</div></details></nav></div></header><div class="disclosure">{NOTICE}</div><main class="wrap" data-page="{page_id}">{body}</main><footer><div class="wrap"><strong>DIY Home Upgrades</strong><p>{NOTICE}</p><nav aria-label="Site records and feed" style="display:block">{dashboard} <a href="{prefix}feed.xml">RSS feed</a></nav></div></footer></body></html>'''

# --- Shop surface (added by arena/94688dd1-diyhome2; renders data/products.json) ---
# The reviewer asked for a shop, not an audit: a category index, a front-of-shop
# table a buyer can scan, and one page per category. Every cell comes from the
# already-verified records in data/products.json. Nothing here adds a price,
# rating, review count, availability claim or tracking assertion, and no field is
# inferred: where a record has no verified value the cell says so and links to the
# Flagged for Review page instead of guessing.
import json as _json

_cat_doc = _json.loads(Path('data/products.json').read_text())
_links_doc = _json.loads(Path('data/links.json').read_text())
_flags_doc = _json.loads(Path('data/flags.json').read_text())
_links_by_id = {l['id']: l for l in _links_doc['links']}

_SPEC_LABELS = [
    ('Brand', 'Brand'),
    ('Category', 'Amazon category'),
    ('Sold by', 'Sold by'),
    ('Material', 'Material'),
    ('Colour', 'Colour'),
    ('Product dimensions', 'Product dimensions'),
    ('Rail length', 'Rail length'),
    ('Item weight', 'Item weight'),
    ('Tiers', 'Tiers'),
    ('Colours offered', 'Colours offered'),
    ('Heights offered', 'Heights offered'),
    ('Kit contents', 'Kit contents'),
]
_UNV = '<span class="unv">unverified</span>'

def _spec(product, label):
    for s in product.get('specs', []):
        if s['label'] == label:
            return e(s['value'])
    return _UNV

_KEY_SPEC_ORDER = ['Product dimensions','Kit contents','Heights offered','Tiers','Rail length','Material']

def _key_spec(product):
    for label in _KEY_SPEC_ORDER:
        for sp in product.get('specs', []):
            if sp['label'] == label:
                return e(sp['value'])
    return _UNV

def _asin_cell(product):
    # The listing the reader is invited to visit carries a sponsored marker; the
    # buyer-intent confirmation record for the submitted short link is separate and
    # stays unpublished until it is confirmed.
    return f'{source(product["listing_url"], product["asin"], True)}<br><small><a href="category/{product["category"]}.html">{e(_cat_name(product["category"]))}</a></small>'

def _cat_name(slug):
    for c in _cat_doc['categories']:
        if c['slug'] == slug:
            return c['name']
    return slug

def _link_state(product):
    """Publish only what the intent record actually says, never a merged guess."""
    rec = _links_by_id.get(product['submitted_link_id'])
    if not rec:
        return _UNV + '<br><small>no intent record</small>'
    if rec.get('intended_asin'):
        return 'confirmed'
    target = e(rec.get('observed_redirect_target', ''))
    return f'Intended product {_UNV}<br><small>observed redirect<br><code>{target}</code></small>'

# The four published guides are the only honest reading targets; there is no
# per-product page yet, so map each product to the guide that actually covers it.
_GUIDE_FOR = {'wallpaper-tools':'wallpaper','paper-towel-holders':'paper-towels','pot-racks':'cookware'}

SHOP_ROWS = []
for _p in _cat_doc['products']:
    SHOP_ROWS.append((
        f'<strong>{e(_p["name"])}</strong><br><small>{e(_p["kicker"])}</small>',
        _asin_cell(_p),
        _spec(_p,'Brand'),
        _spec(_p,'Category'),
        _spec(_p,'Sold by'),
        _key_spec(_p),
        e(_p['dek']),
        _link_state(_p),
        f'<a href="{_GUIDE_FOR.get(_p["category"], "guides")}.html">Read the guide →</a>',
    ))
SHOP_HEADERS = ['Product','ASIN · category','Brand','Amazon category','Sold by','Key verified spec','What it is for','Buying-link status','Guide']

def _shop_intro_note():
    return ('<p class="prose">Every row below is rendered from a record first checked against the live Amazon '
            'listing on 2026-11-20 and re-checked on 2026-11-21. Prices, stock, star ratings and review counts are '
            '<strong>deliberately absent</strong>: '
            f'the Associates Program Policies ({source("https://affiliate-program.amazon.com/help/operating/policies","S02")}) '
            'the Program Policies permit them only through Creators API or Product Advertising API content, or an Amazon-served link, '
            'and this site has neither. '
            f'Blank or {_UNV} cells are fields that could not be confirmed from an official source. '
            f'See {link("review","Flagged for Review")} for the open items.</p>')

def _cat_cards():
    out = []
    for c in _cat_doc['categories']:
        n = sum(1 for p in _cat_doc['products'] if p['category'] == c['slug'])
        art = {'wallpaper-tools':'walls','paper-towel-holders':'counter','pot-racks':'cabinet'}.get(c['slug'])
        photo = f'<img class="edit-photo" src="assets/{art}.jpg" alt="" width="600" height="380" loading="lazy">' if art else ''
        item_word = 'item' if n == 1 else 'items'
        out.append(f'<article class="card">{photo}<div class="eyebrow">{e(c["kicker"])}</div>'
                   f'<h3><a href="category/{c["slug"]}.html">{e(c["name"])}</a></h3>'
                   f'<p>{e(c["blurb"])}</p><p><small>{n} {item_word} covered · Amazon browse node {source("https://www.amazon.com/b?node="+c["browse_node"], c["browse_node"])}</small></p>'
                   f'<a href="category/{c["slug"]}.html">Shop {e(c["name"].split("&")[0].strip().lower())} →</a></article>')
    return '<div class="grid">'+''.join(out)+'</div>'

add('shop','Shop the edit','Every product on this site in one place, by category.',intro('The shop floor','Shop the edit','Three verified products, organised by the room they fix. No prices, no star ratings, no stock claims — open a row to see what the listing actually says.')
    +_shop_intro_note()
    +'<div class="sectionhead"><div><div class="eyebrow">Browse by category</div><h2>Where the problem is</h2></div><a href="guides.html">Or read a buying guide →</a></div>'
    +_cat_cards()
    +'<div class="sectionhead"><div><div class="eyebrow">The whole shelf</div><h2>Every product, in one table</h2></div><a href="review.html">Unconfirmed fields →</a></div>'
    +table(SHOP_HEADERS, SHOP_ROWS)
    +f'<div class="prose"><h2>How to read the buying-link status column</h2><p>Each product arrived as a supplied <code>link.amazon</code> short address. That short address was observed to resolve to the listing shown on 2026-11-20, but the <em>intended</em> product and the paid Special Link are separate, unconfirmed facts, so the two are never merged into one field. A row reads “Intended product unverified” until the intended ASIN is confirmed inside the enrolled Associates workflow. That is a records gap, not a claim that any link is invalid.</p></div>')

for _c in _cat_doc['categories']:
    _prods = [p for p in _cat_doc['products'] if p['category'] == _c['slug']]
    _rows = [(
        f'<strong>{e(p["name"])}</strong><br><small>{e(p["dek"])}</small>',
        source(p['listing_url'], p['asin'], True),
        _spec(p,'Brand'), _spec(p,'Sold by'), _key_spec(p), _spec(p,'Material'),
        _link_state(p),
        f'<a href="../{_GUIDE_FOR.get(p["category"], "guides")}.html">Guide →</a>',
    ) for p in _prods]
    _body = intro(_c['kicker'], _c['name'], _c['blurb'])
    _body += (f'<p class="prose">Amazon browse path as listed: <code>{e(_c["browse_path"])}</code> '
              f'(<a href="https://www.amazon.com/b?node={_c["browse_node"]}">node {_c["browse_node"]}</a>). '
              f'{len(_prods)} verified {"item" if len(_prods)==1 else "items"} so far.</p>')
    _body += table(['Product','ASIN','Brand','Sold by','Key verified spec','Material','Buying-link status','Guide'], _rows)
    _body += f'<p><a href="../shop.html">← All categories</a> · <a href="../review.html">Flagged fields</a></p>'
    _path = Path('category/'+_c['slug']+'.html')
    _path.parent.mkdir(exist_ok=True)
    _path.write_text(page_shell(_c['name']+' — shop', _c['blurb'], _body,
                                f'{BASE}category/{_c["slug"]}.html', 'category/'+_c['slug'], prefix='../')+'\n')

# All pages are registered by this point (including the shop surface below), so the
# shell is written last. Writing earlier left the nav pointing at a shop.html that
# did not exist yet — scripts/check.py caught it.
for slug,(title,desc,body) in pages.items():
    canonical = BASE + ('' if slug=='index' else slug+'.html')
    Path(slug+'.html').write_text(page_shell(title,desc,body,canonical,slug)+'\n')

# All pages are registered by this point (including the shop surface), so the
# shell is written last. Writing earlier left the nav pointing at a shop.html
# that did not exist yet - scripts/check.py caught it.
for slug,(title,desc,body) in pages.items():
    canonical = BASE + ('' if slug=='index' else slug+'.html')
    Path(slug+'.html').write_text(page_shell(title,desc,body,canonical,slug)+'\n')

sitemap = ET.Element('urlset',xmlns='http://www.sitemaps.org/schemas/sitemap/0.9')
for slug in pages:
    ET.SubElement(ET.SubElement(sitemap,'url'),'loc').text = BASE+('' if slug=='index' else slug+'.html')
for _c in _cat_doc['categories']:
    ET.SubElement(ET.SubElement(sitemap,'url'),'loc').text = BASE+'category/'+_c['slug']+'.html'
ET.SubElement(ET.SubElement(sitemap,'url'),'loc').text = BASE+worksheet
ET.SubElement(ET.SubElement(sitemap,'url'),'loc').text = BASE+'audit/'
ET.ElementTree(sitemap).write('sitemap.xml',encoding='utf-8',xml_declaration=True)
rss = ET.Element('rss',version='2.0')
channel = ET.SubElement(rss,'channel')
for tag,value in [('title','DIY Home Upgrades'),('link',BASE),('description',pages['index'][1])]:
    ET.SubElement(channel,tag).text=value
for path,title,desc in [(worksheet,worksheet_title,worksheet_desc)]+[(s+'.html',t,d) for s,_,t,d,_ in guides]:
    item=ET.SubElement(channel,'item')
    for tag,value in [('title',title),('description',desc),('link',BASE+path),('guid',BASE+path),('pubDate','Fri, 20 Nov 2026 00:00:00 GMT')]:
        ET.SubElement(item,tag).text=value
# Site records belong in the feed too. The sitemap already lists them, and a
# reader subscribed for the record pages had no way to see a new one. Added by
# arena/ecb1bfed-diyhome2 in response to the RSS coverage request on the board.
for path,title,desc,cat in [('guides.html','Buying guides',pages['guides'][1],'Index'),
                            ('review.html','Flagged for Review',pages['review'][1],'Site record'),
                            ('sources.html','Citation register',pages['sources'][1],'Site record'),
                            ('summary.html','Executive summary',pages['summary'][1],'Site record'),
                            ('standards.html','Editorial standards',pages['standards'][1],'Site record'),
                            ('measurement.html','Measurement',pages['measurement'][1],'Site record'),
                            ('audit/','Spec & policy audit','Independently verified listing details, internal listing discrepancies and the 2026 policy register.','Site record')]:
    item=ET.SubElement(channel,'item')
    for tag,value in [('title',title),('description',desc),('link',BASE+path),
                      ('guid',BASE+path),('pubDate','Sat, 21 Nov 2026 00:00:00 GMT'),
                      ('category',cat)]:
        ET.SubElement(item,tag).text=value
# The shop surface is part of the reading experience, so subscribers see new
# categories and rows without reloading the site. arena/94688dd1-diyhome2.
for path,title,desc,cat in [('shop.html','Shop the edit',pages['shop'][1],'Shop')] + [
        (f'category/{c["slug"]}.html', c['name']+' \u2014 shop', c['blurb'], 'Shop') for c in _cat_doc['categories']]:
    item=ET.SubElement(channel,'item')
    for tag,value in [('title',title),('description',desc),('link',BASE+path),
                      ('guid',BASE+path),('pubDate','Sat, 21 Nov 2026 00:00:00 GMT'),
                      ('category',cat)]:
        ET.SubElement(item,tag).text=value
# The homepage is the channel link; give it an item too so the cover check is honest.
_home=ET.SubElement(channel,'item')
for tag,value in [('title','DIY Home Upgrades'),('description',pages['index'][1]),('link',BASE),
                  ('guid',BASE),('pubDate','Fri, 20 Nov 2026 00:00:00 GMT'),('category','Front page')]:
    ET.SubElement(_home,tag).text=value
ET.ElementTree(rss).write('feed.xml',encoding='utf-8',xml_declaration=True)
