from pathlib import Path
from html import escape as e
from xml.etree import ElementTree as ET

BASE = 'https://kanlerxz87-cyber.github.io/DIYHOME2/'
DATE = '2026-11-20'
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

add('index','DIY Home Upgrades','Practical shopping guides for kitchens, walls, and the spaces in between.', '''<section class="hero"><div class="hero-copy"><div class="eyebrow">The practical home edit</div><h1>Small upgrades.<br>Better everyday.</h1><p>Find the right tools for a smoother wall, a clearer counter, and a cabinet that finally works for you.</p><a class="button" href="#edits">Explore the upgrades →</a></div><img src="assets/hero.jpg" alt="Sunlit kitchen with oak cabinets and a warm cream wall"></section><section id="edits"><div class="sectionhead"><div><div class="eyebrow">The shopping edit</div><h2>Three upgrades to start with</h2></div><a href="guides.html">All buying guides →</a></div>'''+cards(guides[:3], shopping=True)+'''</section><section class="card"><div class="eyebrow">In the kitchen</div><h2>Shopping for an air fryer?</h2><p>Compare usable capacity, cleanup and the space you’ll need before choosing a format.</p><a href="air-fryers.html">Read the air fryer guide →</a></section>''')
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
add('review','Flagged for Review','Product intent and observed redirect evidence.',intro('Site records','Flagged for Review','Blank fields have not been verified. A redirect observation is not product intent or a tracking test.')+table(['Entry','Submitted URL','Observed listing title (shortened)','Observed target · Amazon source','Observed date','Intended ASIN','Intended official listing','Confirmation date','Confirmation source','Status'],register)+f'<p>Selected tracking ID: <code>shopnow047c-20</code> (submitted, not validated). The short links’ compliance is unresolved; they are not declared invalid. See {source(AMAZON,"Amazon’s Special Link requirements")} and the {_cite_link} for the ASIN definition these codes were measured against.</p>')
_summary_products = []
for _n,(_short,_asin,_name,_note) in enumerate(rows,1):
    _summary_products.append((f'{_n:02}', e(_name), source('https://www.amazon.com/dp/'+_asin,_asin,True), DATE, '', _note+'Unverified intent and tracking.'))
_summary_verify = [
    ('Affiliate disclosure wording', 'Verified — required statement, clearly and prominently placed', link('sources','S01 · Operating Agreement §5')),
    ('ASIN definition (10 characters)', 'Verified — short codes are 9 characters and cannot be ASINs', link('sources','S06 · ASIN guide')),
    ('Price display', 'Prohibited without API access — no price published', link('sources','S02 · Program Policies')),
    ('Star ratings / review counts', 'Prohibited without API access — none published', link('sources','S02 · Program Policies')),
    ('Commission rates', 'Category rates are public (Table 1); this account’s rate card and each item’s category are unverified — no per-product rate or earnings published', link('sources','S13 · Table 1 · S03 · rate card (restricted)')),
    ('Tracking ID shopnow047c-20', 'Unverified — no tag observed; Special Link test pending', link('review','Flagged for Review')),
    ('Campaign ledger', 'Empty by design — no authorized first-party report supplied', link('measurement','Measurement')),
]
add('summary','Executive summary','Launch scope, findings, and next decisions.',intro('Site records','Executive summary','A buyer-first publication with a separate evidence register. All figures are reported or blank; nothing is estimated.')+f'''<div class="prose"><h2>What was submitted</h2><p>Selected tracking ID: <code>shopnow047c-20</code> (submitted, not validated). Four link lines were submitted: <code>https://link.amazon/B0hmGG4m2</code>, <code>https://link.amazon/B03QDuGdo</code> (submitted twice) and <code>https://link.amazon/B0hpD2JGQ</code>. That is three unique short URLs, not four products; the duplicate is recorded and flagged on the evidence register.</p><h2>What the evidence supports</h2><p>Each short link was followed and resolved to a live Amazon listing: B08FKW9JRM (wallpaper smoothing kit), B0BSKQW2T2 (under-cabinet paper towel holder) and B08DY9HRWD (ORDORA pots and pans organizer). A redirect observation establishes what a link lands on — it does not confirm product intent, a tracking tag, or commission eligibility. No submitted item was an air fryer; the air fryer guide is a separate editorial topic.</p><h2>What remains unknown</h2><p>The intended ASIN, intended official listing URL, confirmation date and confirmation source are blank for every entry and will stay blank until confirmed inside the enrolled Associates workflow. No short link's Special Link compliance is observable from outside the account, and none is declared invalid. No conversion score, revenue forecast, price or review figure is published anywhere on the site.</p><h2>Compliance posture</h2><p>The Amazon Associate disclosure appears above the fold and again in the footer on every page. Every outbound Amazon product link carries <code>rel="sponsored"</code>, has no query string, and is never a shortener. No prices or star ratings are rendered. The campaign ledger is empty by design, with headers only, pending an authorized first-party report.</p><h2>Measurement status</h2><p>Five events are defined (<code>page_view</code>, <code>guide_view</code>, <code>listing_reference_click</code>, <code>affiliate_click</code>, <code>feed_click</code>) and the outbound counter is a privacy-preserving beacon that never routes through this domain. The collector endpoint is not deployed on GitHub Pages, so no events are collected today and none are claimed.</p><h2>Next decision</h2><p>Verify one Special Link per product in the enrolled workflow and confirm destination and tracking report before scaling. Once authorized reporting is available, use measured queries and buyer engagement to choose the next guide. See {link('review','the evidence register')} and {link('measurement','measurement status')}.</p></div>'''+table(['Entry','Observed listing','Observed ASIN · Amazon source','Observed date','Intended ASIN','Status'],_summary_products)+table(['Area','Status','Source'],_summary_verify))
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
add('sources','Citation register','Official documents behind every claim, and the constraints they impose.',intro('Site records','Citation register',f'{len(_cite_doc["sources"])} documents behind every claim on this site, plus the rules they impose on it.')+table(['ID','Document','Publisher','Dated on page','Access','What it establishes'],_cite_rows)+'<div class="prose"><h2>What these documents constrain</h2><p>Six rules follow directly from the sources above. They are the reason this site shows no prices, no star ratings and no price alerts, and the reason links are plain rather than shortened.</p></div>'+table(['ID','Constraint','Basis','Effect on this site'],_cite_cons)+'<div class="prose"><p><small>Amazon listing and redirector URLs are printed as plain text so they can be copied and checked by hand. A citation is evidence, not a product offer, so citations are never made into Amazon links. The three buying guides do carry one untagged, reference-only Amazon link each, marked sponsored; that sits in tension with the tag-in-every-link rule (C7) and is published as flag F12 rather than hidden.</small></p></div>')

# --- Flagged for Review: every open flag and the re-check log (added by arena/bd0ba155-diyhome2) ---
# data/flags.json was previously validated but never rendered, so the page named
# "Flagged for Review" listed only the four-row intent table. Every flag is now
# published with its official source links; product and short-link sources are
# shown as text pointing at the citation register, never as untagged Amazon links.
_flag_doc = __import__('json').loads(Path('data/flags.json').read_text())
def _src_links(ids):
    out = []
    for i in ids:
        s = _cite_by_id.get(i)
        if not s:
            continue
        if s['url'].startswith('https://www.amazon.com/dp/') or 'link.amazon' in s['url']:
            out.append(f'<a href="sources.html#src-{e(i)}">{e(i)}</a> <small>(listing, see register)</small>')
        else:
            out.append(source(s['url'], i) + f' <small><a href="sources.html#src-{e(i)}">register</a></small>')
    return '<br>'.join(out)
_sev = {'blocking':'gap','high':'gap','medium':'warn','low':'ok'}
_flag_rows = []
for _f in _flag_doc['flags']:
    _flag_rows.append((f'<strong id="flag-{e(_f["id"])}">{e(_f["id"])}</strong>',
        f'<span class="pill {_sev.get(_f["severity"],"warn")}">{e(_f["severity"])}</span>',
        f'<strong>{e(_f["title"])}</strong><br><small>{e(_f["area"])}</small>',
        e(_f['detail']), e(_f['action']), _src_links(_f['sources'])))
_recheck_rows = [(e(_r['date']), e(_r['session']), e(_r['item']), e(_r['result']), _src_links(_r['sources'])) for _r in _flag_doc.get('rechecks', [])]
_rt, _rd, _rb = pages['review']
_rb += ('<div class="prose"><h2>Open flags</h2><p>'+str(len(_flag_doc['flags']))+' irregularities, each with what was observed, what would close it and the official source. None blocks publication. A value that could not be confirmed is left blank and is not inferred. Spec-level listing findings (FLG-04 to FLG-08) are on the '+link('audit/index','Spec & policy audit')+'.</p></div>'
    + table(['ID','Severity','Irregularity','What was observed','What would close it','Official sources'], _flag_rows)
    + '<div class="prose"><h2>Re-verification log</h2><p>Independent re-reads, with the result of each. “Not re-verified” means exactly that.</p></div>'
    + table(['Date','Session','Item','Result','Official sources'], _recheck_rows))
pages['review'] = (_rt, _rd, _rb)

for slug,(title,desc,body) in pages.items():
    canonical = BASE + ('' if slug=='index' else slug+'.html')
    dashboard = ' '.join(link(s,t) for s,t in ops)
    # Findability meta (added by arena/175d82e7-diyhome2). Uses only verified
    # facts: site name, canonical URL, page description and the on-disk hero
    # image. No ratings, prices, popularity or revenue claims are emitted.
    _og_type = 'article' if slug in ('wallpaper','paper-towels','cookware','air-fryers','guides') else 'website'
    _og_title = title if slug=='index' else f'{title} | DIY Home Upgrades'
    _og_image = BASE + 'assets/hero.jpg'
    _jsonld = __import__('json').dumps({'@context':'https://schema.org','@type':'WebSite','name':'DIY Home Upgrades','url':BASE,'description':pages['index'][1],'inLanguage':'en','publisher':{'@type':'Organization','name':'DIY Home Upgrades','url':BASE}}, separators=(',',':'))
    html = f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{e(title)}{' | DIY Home Upgrades' if slug!='index' else ''}</title><meta name="description" content="{e(desc,quote=True)}"><meta name="author" content="DIY Home Upgrades editorial desk"><link rel="canonical" href="{canonical}"><meta property="og:site_name" content="DIY Home Upgrades"><meta property="og:title" content="{e(_og_title,quote=True)}"><meta property="og:description" content="{e(desc,quote=True)}"><meta property="og:url" content="{canonical}"><meta property="og:type" content="{_og_type}"><meta property="og:image" content="{_og_image}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="{e(_og_title,quote=True)}"><meta name="twitter:description" content="{e(desc,quote=True)}"><meta name="twitter:image" content="{_og_image}"><script type="application/ld+json">{_jsonld}</script><link rel="alternate" type="application/rss+xml" title="DIY Home Upgrades" href="feed.xml"><link rel="stylesheet" href="assets/style.css"><script src="assets/metrics.js" defer></script></head><body><header><div class="wrap mast"><a class="brand" href="./">DIY Home<span> Upgrades</span></a><nav aria-label="Main navigation"><a href="guides.html">Buying guides</a><a href="feed.xml">RSS</a><details><summary>Site records</summary><div class="dropdown">{dashboard}</div></details></nav></div></header><div class="disclosure">{NOTICE}</div><main class="wrap" data-page="{slug}">{body}</main><footer><div class="wrap"><strong>DIY Home Upgrades</strong><p>{NOTICE}</p><nav aria-label="Site records and feed" style="display:block">{dashboard} <a href="feed.xml">RSS feed</a></nav></div></footer></body></html>'''
    Path(slug+'.html').write_text(html+'\n')

sitemap = ET.Element('urlset',xmlns='http://www.sitemaps.org/schemas/sitemap/0.9')
for slug in pages:
    ET.SubElement(ET.SubElement(sitemap,'url'),'loc').text = BASE+('' if slug=='index' else slug+'.html')
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
                      ('guid',BASE+path),('pubDate','Fri, 20 Nov 2026 00:00:00 GMT'),
                      ('category',cat)]:
        ET.SubElement(item,tag).text=value
# The homepage is the channel link; give it an item too so the cover check is honest.
_home=ET.SubElement(channel,'item')
for tag,value in [('title','DIY Home Upgrades'),('description',pages['index'][1]),('link',BASE),
                  ('guid',BASE),('pubDate','Fri, 20 Nov 2026 00:00:00 GMT'),('category','Front page')]:
    ET.SubElement(_home,tag).text=value
ET.ElementTree(rss).write('feed.xml',encoding='utf-8',xml_declaration=True)
