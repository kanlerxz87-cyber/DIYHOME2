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
# --- Question-shaped method checklists (arena/a0e07843-diyhome2) ------------
# These are the three remaining working titles supplied in the brief and
# recorded on this site as flag F06. They are published as method rather than as
# review: no air fryer or multi-function appliance listing has been verified for
# this publication, so the copy asserts no model, specification, price or star
# rating. Every line is a question the reader puts to the manual, the listing or
# the seller in front of them. Shape is (heading, lede, [questions]).
ISSUE2 = '2026-11-21'
method_slugs = ('air-fryer-capacity', 'air-fryer-cleanup', 'multi-function-appliances')
methods = [
    ('air-fryer-capacity', 'Kitchen', 'A no-hype checklist for comparing air fryer capacity', 'Compare the number that matters for the meal you actually cook, not the biggest one on the box.', [
        ('Which capacity number are you comparing?', 'Size gets described several different ways, so two appliances can carry the same headline figure and hold different amounts. Ask what a figure refers to before you line two listings up.', [
            'Is the figure a basket volume, a tray area, or a stated portion count?',
            'Is it measured with or without the accessories the modes you want require?',
            'Is the same unit used on both listings you are comparing?',
            'Does the listing give interior dimensions as well as exterior ones? Exterior size describes your counter, not your food.',
            'If the figure is a serving count, whose servings? Ask what portion size the claim assumes.']),
        ('Test it against one meal you actually cook', 'A capacity figure becomes useful the moment you put a real meal next to it.', [
            'Pick the meal you cook most often. What is its footprint, and how much of it fits in a single batch?',
            'If it does not fit, does the second batch cook while the first one waits, or does everything wait?',
            'Will the tallest thing you cook clear the element or the lid with room to spare?',
            'Does the method need a shake, a flip or a rotation partway through, and does that change how much fits at once?',
            'What happens to the result when the basket is full rather than half full? Ask the seller, or check the questions on the listing.']),
        ('What the listing will not tell you', 'Some answers only appear in the manual, in the questions section, or after delivery.', [
            'Does the manual state a maximum fill line or a maximum load for the basket or tray?',
            'Which accessories are included, and which are sold separately for the modes you want?',
            'What is the stated rated power, and does your kitchen circuit have room for it alongside the kettle and the oven?',
            'Is a preheat time stated, and was it measured empty or loaded?',
            'What does the warranty exclude, and who handles a claim where you live?'])]),
    ('air-fryer-cleanup', 'Kitchen', 'How do you assess cleanup and counter-space trade-offs?', 'The two costs that arrive after the purchase: washing it, and finding somewhere to put it.', [
        ('Start with cleanup, because it decides whether you keep using it', 'An appliance that is awkward to wash gets used three times and then stored. Check the manual, not only the bullet points.', [
            'Which parts are dishwasher safe, and which does the manual say to wash by hand? Listings and manuals disagree often enough to check both.',
            'What does the manual say about the coating, and which utensils does it allow?',
            'How many separate pieces have to come apart to be cleaned, and how many have to be dried by hand?',
            'Is the basket or tray one piece, or does it have a seam or a corner where residue collects?',
            'How heavy is it when full? A pan you cannot lift with one hand gets washed less often.',
            'Are the parts most likely to wear — basket, tray, rack, gasket — listed as available spares, and from whom?']),
        ('Then measure the space it needs in use, not only in storage', 'The footprint on the listing is the smallest number involved.', [
            'How much room does the door or the basket need to open fully? Add that to the footprint.',
            'What clearance does the manual require above and behind the appliance, and from what surfaces?',
            'Where is the nearest outlet, and does the cord reach it without an extension lead?',
            'Is a ventilation or exhaust requirement stated anywhere in the manual?',
            'Will it live on the counter, or come out of a cupboard each time? If it comes out, where does it go while it cools?',
            'Can you still use the counter space it occupies for the rest of the meal?']),
        ('Decide the trade-off in writing', 'Both costs are real. Write down which one you are choosing.', [
            'What does this appliance replace? If it replaces nothing, you are adding another thing to store.',
            'Which matters more to you: a few extra minutes of washing up, or a permanently occupied stretch of counter?',
            'Who does the washing up in your household, and have you asked them?',
            'If you already own an oven and a hob, which of those fails for the meal you have in mind?'])]),
    ('multi-function-appliances', 'Kitchen', 'Questions to ask before buying a multi-function kitchen appliance', 'One box, eight promises. Work out which three you will actually use.', [
        ('Name the functions you would use this month', 'Modes you never switch on are decoration, and they are usually the reason the box is bigger.', [
            'Write down three meals you would make in it this month. If you cannot, the extra modes are not doing anything for you.',
            'Which mode does each of those meals actually use, and does that mode need an accessory that is sold separately?',
            'Which functions duplicate an appliance you already own and already use?',
            'If one mode stops working, do you lose the appliance or only that mode?',
            'How much of the counter or cupboard does it occupy for the three functions you would use?']),
        ('Ask what each claim rests on', 'Multi-function listings stack claims. Separate the ones you can check from the ones you cannot.', [
            'Is the claim about the appliance, or about one accessory in one configuration?',
            'Is a stated result measured empty, loaded, or at a specific setting? Ask which.',
            'What temperature range is stated, and how is it held?',
            'Who wrote the review you are reading, and were they paid or given the product? A material connection should be disclosed clearly and conspicuously.',
            'Does the review describe what most people get, or an exceptional result?']),
        ('Check the boring parts before you commit', 'None of this is exciting, and all of it decides whether you keep the thing.', [
            'What does the warranty cover, what does it exclude, and who handles a claim in your country?',
            'Are the parts you would most likely need sold as spares?',
            'What is the stated rated power, and can your kitchen circuit take it alongside the kettle and the oven?',
            'What does the manual say about cleaning each mode? A mode that cannot go in the dishwasher is something you will notice every week.',
            'How big is the box it ships in, and will it fit through your door and into the cupboard you planned?',
            'What is the return window if it turns out to be the wrong size?'])]),
]
guides += [(slug, cat, title, desc, None) for slug, cat, title, desc, _ in methods]
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

add('index','DIY Home Upgrades','Practical shopping guides for kitchens, walls, and the spaces in between.', '''<section class="hero"><div class="hero-copy"><div class="eyebrow">The practical home edit</div><h1>Small upgrades.<br>Better everyday.</h1><p>Find the right tools for a smoother wall, a clearer counter, and a cabinet that finally works for you.</p><a class="button" href="#edits">Explore the upgrades →</a></div><img src="assets/hero.jpg" alt="Sunlit kitchen with oak cabinets and a warm cream wall"></section><section id="edits"><div class="sectionhead"><div><div class="eyebrow">The shopping edit</div><h2>Three upgrades to start with</h2></div><a href="guides.html">All buying guides →</a></div>'''+cards(guides[:3], shopping=True)+'''</section><section class="card"><div class="eyebrow">In the kitchen</div><h2>Shopping for an air fryer?</h2><p>Compare usable capacity, cleanup and the space you’ll need before choosing a format.</p><a href="air-fryers.html">Read the air fryer guide →</a><p>Three more buyer checklists: <a href="air-fryer-capacity.html">comparing capacity</a>, <a href="air-fryer-cleanup.html">cleanup and counter space</a>, and <a href="multi-function-appliances.html">multi-function appliances</a>.</p></section>''')
_guide_clusters = [
    ('Product-led', 'The shopping edit', 'Three guides, each tied to a listing this site has checked.', guides[:3], '', True),
    ('Buyer checklists', 'Kitchen appliances', 'Question-shaped checklists for countertop appliances. Method, not testing: no model is recommended and no specification is quoted.', guides[3:], worksheet_card, False),
]
add('guides','Buying guides','Buyer checklists for kitchen storage, walls and countertop appliances.',intro('The buying desk','Buying guides','Start with a question, then check the details that matter in your home.')+''.join(f'<section><div class="sectionhead"><div><div class="eyebrow">{e(eyebrow)}</div><h2>{e(h)}</h2><p class="lede">{e(b)}</p></div><a href="feed.xml">Subscribe to the feed →</a></div>{cards(items,shopping)}{extra}</section>' for eyebrow,h,b,items,extra,shopping in _guide_clusters))
for i,(slug,cat,title,desc,sections) in enumerate(guides):
    if slug in method_slugs:
        continue
    body = ''.join(f'<h2>{e(h)}</h2><p>{e(p)}</p>' for h,p in sections)
    if slug == 'air-fryers':
        body += worksheet_card
    if i < 3:
        _,asin,name,_ = rows[[0,1,3][i]]
        body += f'<aside class="card"><div class="eyebrow">Product to research</div><h3>{e(name)}</h3><p>Observed in an Amazon redirect check on {DATE}. This isn’t a confirmed recommendation or a paid link.</p>{source("https://www.amazon.com/dp/"+asin,"Amazon listing · reference only",True)}</aside>'
    add(slug,title,desc,intro(cat,title,desc)+f'<article class="prose"><p class="eyebrow">DIY Home Upgrades editorial desk · {DATE}</p>{body}<p>{link("guides","Back to all guides →")}</p></article>')

def cite_anchor(sid):
    return f'<a href="sources.html#src-{e(sid)}">{e(sid)}</a>'

for slug,cat,title,desc,sections in methods:
    body = ''.join(f'<h2>{e(h)}</h2><p>{e(lede)}</p><ul>'+''.join(f'<li>{e(q)}</li>' for q in qs)+'</ul>' for h,lede,qs in sections)
    note = f'<aside class="card"><div class="eyebrow">What this checklist is not</div><p>A method, not a test. No model is recommended here, and no specification, price or star rating is quoted: {link("review","the evidence register")} records that no air fryer or multi-function appliance listing has been verified for this publication. Prices and star ratings are also outside what this site may display — see {cite_anchor("S02")} and constraints C1 to C3 in the {link("sources","citation register")}.</p></aside>'
    if slug == 'air-fryer-cleanup':
        note += f'<aside class="card"><div class="eyebrow">Kitchen field notes · Interactive</div><h3><a href="{worksheet}">{worksheet_title}</a></h3><p>{worksheet_desc}</p><a href="{worksheet}">Check your counter →</a></aside>'
    tail = f'<p>Every question above is one you can put to the manual, the listing or the seller. Where a claim matters, ask for the document behind it: {source(FTC,"the FTC’s endorsement guidance")} explains why an undisclosed connection between a reviewer and a seller, and a result that is not typical, both deserve less weight.</p><p>{link("guides","Back to all guides →")}</p>'
    add(slug,title,desc,intro(f'{cat} · Buyer checklist',title,desc)+f'<article class="prose"><p class="eyebrow">DIY Home Upgrades editorial desk · {ISSUE2}</p>{body}{note}{tail}</article>')

def table(headers, data):
    return '<div class="scroll"><table><thead><tr>'+''.join(f'<th scope="col">{e(h)}</th>' for h in headers)+'</tr></thead><tbody>'+''.join('<tr>'+''.join(f'<td>{v}</td>' for v in row)+'</tr>' for row in data)+'</tbody></table></div>'

_cite_link = link('sources','citation register')
register = []
for n,(short,asin,name,note) in enumerate(rows,1):
    register.append((f'{n:02}',f'<code>https://link.amazon/{short}</code>', e(name),source('https://www.amazon.com/dp/'+asin,asin,True),DATE,'','','','',note+'Unverified intent and tracking.'))
# --- Recorded irregularities (arena/a0e07843-diyhome2) ---------------------
# data/flags.json existed but nothing rendered it: the recorded irregularities
# were invisible to any reader, including on the page labelled "Flagged for
# Review". Each source id below resolves to a row in the citation register, and
# that row links the official document itself.
_flags_doc = __import__('json').loads(Path('data/flags.json').read_text())
_flag_rows = []
for _f in _flags_doc['flags']:
    _src = ', '.join(cite_anchor(_s) for _s in _f.get('sources', [])) or 'none recorded'
    _flag_rows.append((f'<strong>{e(_f["id"])}</strong>', e(_f['title']), e(_f.get('area', '')), f'<strong>{e(_f.get("severity", ""))}</strong>', e(_f.get('detail', '')), e(_f.get('action', '')), _src))
_flag_section = f'<div class="prose"><h2>Irregularities recorded during this build</h2><p>{len(_flags_doc["flags"])} items were observed that could not be closed from outside an Associates account, or without putting a product in hand. None blocked publication and none is presented as a result. Each row states what was observed, what would close it, and the official documents behind it.</p></div>' + table(['ID', 'Irregularity', 'Area', 'Severity', 'What was observed', 'What would close it', 'Official sources'], _flag_rows)
add('review','Flagged for Review','Product intent, observed redirect evidence, and every irregularity recorded during this build.',intro('Site records','Flagged for Review','Blank fields have not been verified. A redirect observation is not product intent or a tracking test.')+table(['Entry','Submitted URL','Observed listing title (shortened)','Observed target · Amazon source','Observed date','Intended ASIN','Intended official listing','Confirmation date','Confirmation source','Status'],register)+f'<p>Selected tracking ID: <code>shopnow047c-20</code> (submitted, not validated). The short links’ compliance is unresolved; they are not declared invalid. See {source(AMAZON,"Amazon’s Special Link requirements")} and the {_cite_link} for the ASIN definition these codes were measured against.</p><p>Re-verified {ISSUE2}: all three short URLs were fetched again and resolved to the same three listings. Each arrived carrying Amazon’s own referral query string and no <code>tag=</code> parameter, so no Associates tracking ID was observed on any destination. The observation above is unchanged; intent, enrollment and attribution remain unverified.</p>'+_flag_section)
add('summary','Executive summary','Launch scope, findings, and next decisions.',intro('Site records','Executive summary','A buyer-first publication with a separate evidence register.')+f'''<div class="prose"><h2>What the evidence supports</h2><p>Four submissions represent three distinct short URLs. The observed destinations were a wallpaper smoothing kit, a paper towel holder and a cookware organizer, not air fryers. The air fryer guide is a separate editorial topic, not a claim about the submitted items.</p><h2>What remains unknown</h2><p>The intended products, tracking ownership, live commission eligibility and report attribution remain unverified. No conversion score, revenue forecast, price or review figure is published.</p><p>Issue 02 added three buyer checklists on {ISSUE2} — capacity, cleanup and counter space, and multi-function appliances — published as method only, with no model, specification or price behind them. Every irregularity this build could not close, {len(_flags_doc['flags'])} of them, is published in full on the {link('review','Flagged for Review')} page with the official documents behind each one.</p><h2>Next decision</h2><p>Verify one Special Link per product in the enrolled workflow before scaling. Once authorized reporting is available, use measured queries and buyer engagement to choose the next guide. See {link('review','the evidence register')} and {link('measurement','measurement status')}.</p></div>''')
_issue_rows = [
    ('Issue 01', '2026-11-20', 'Four guides — ' + ', '.join(link(s, x) for s, x in [('wallpaper', 'wallpaper tools'), ('paper-towels', 'paper towel holder placement'), ('cookware', 'pan organizer fit'), ('air-fryers', 'air fryer format')]) + f' — plus the <a href="{worksheet}">counter-fit worksheet</a>.', cite_anchor('S07') + ', ' + cite_anchor('S08') + ', ' + cite_anchor('S09') + ' (listings observed 2026-11-20); disclosure rules ' + cite_anchor('S01') + ', ' + cite_anchor('S04')),
    ('Issue 02', ISSUE2, 'Three method checklists — ' + ', '.join(link(s, x) for s, x in [('air-fryer-capacity', 'comparing capacity'), ('air-fryer-cleanup', 'cleanup and counter space'), ('multi-function-appliances', 'multi-function appliances')]) + '.', 'No product asserted. Display limits ' + cite_anchor('S02') + ' (constraints C1 to C3); handling of claims and reviews ' + cite_anchor('S04') + '.'),
]
_issue_log_html = '<div class="prose"><h2>Publication log</h2><p>What has actually shipped, and the official documents behind each issue. The <a href="feed.xml">RSS feed</a> carries the same dates in machine-readable form.</p></div>' + table(['Issue', 'Published (UTC)', 'What shipped', 'Evidence basis (official sources)'], _issue_rows)
add('standards','Editorial standards','How guides are written, checked and published.',intro('Site records','Editorial standards','By the DIY Home Upgrades editorial desk. Buying checklists, not hands-on reviews.')+f'''<div class="prose"><h2>Publication gate</h2><p>Confirm product intent against an official listing and save the date and source separately from the redirect. Generate a Special Link through enrolled Associates tools, then verify the destination and authorized tracking report before publishing it. Keep a paid-link notice next to each approved link and the Associates notice on every page.</p><p>Review {source(AMAZON,'the Operating Agreement')}, {source('https://affiliate-program.amazon.com/help/operating/policies','Amazon’s Program Policies')} and {source(FTC,'FTC endorsement guidance')} before publishing. Every document behind every claim, with the date it states and the constraint it imposes, is kept in the {link('sources','citation register')}. Do not scrape Amazon or use product images, ratings, prices or API content without confirming rights, sourcing and freshness requirements. The masthead photograph is AI-generated editorial imagery, not a product depiction.</p><h2>Publishing rhythm</h2><p>Target rhythm: a question-led guide roughly every two weeks, with a monthly evidence and link review. The log below is the record of what has actually shipped, and nothing on this site claims a frequency that has been sustained. Start with walls and kitchen storage; revisit seasonal topics only when they fit reader needs. Every new entry in the guide register updates the sitemap and RSS feed on build.</p></div>'''+_issue_log_html)
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

# Gate: an irregularity that is recorded but never published is worse than one
# that was never recorded. Fail the build if any flag is missing from the page.
for _f in _flags_doc['flags']:
    assert f'<strong>{_f["id"]}</strong>' in pages['review'][2], f'flag {_f["id"]} is not published on review.html'
    assert e(_f['title']) in pages['review'][2], f'flag {_f["id"]} title is not published on review.html'

for slug,(title,desc,body) in pages.items():
    canonical = BASE + ('' if slug=='index' else slug+'.html')
    dashboard = ' '.join(link(s,t) for s,t in ops)
    html = f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{e(title)}{' | DIY Home Upgrades' if slug!='index' else ''}</title><meta name="description" content="{e(desc,quote=True)}"><link rel="canonical" href="{canonical}"><link rel="alternate" type="application/rss+xml" title="DIY Home Upgrades" href="feed.xml"><link rel="stylesheet" href="assets/style.css"><script src="assets/metrics.js" defer></script></head><body><header><div class="wrap mast"><a class="brand" href="./">DIY Home<span> Upgrades</span></a><nav aria-label="Main navigation"><a href="guides.html">Buying guides</a><a href="feed.xml">RSS</a><details><summary>Site records</summary><div class="dropdown">{dashboard}</div></details></nav></div></header><div class="disclosure">{NOTICE}</div><main class="wrap" data-page="{slug}">{body}</main><footer><div class="wrap"><strong>DIY Home Upgrades</strong><p>{NOTICE}</p><nav aria-label="Site records and feed" style="display:block">{dashboard} <a href="feed.xml">RSS feed</a></nav></div></footer></body></html>'''
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
_feed_date = {slug: 'Sat, 21 Nov 2026 00:00:00 GMT' for slug in method_slugs}
for path,title,desc,pub in [(worksheet,worksheet_title,worksheet_desc,'Fri, 20 Nov 2026 00:00:00 GMT')]+[(s+'.html',t,d,_feed_date.get(s,'Fri, 20 Nov 2026 00:00:00 GMT')) for s,_,t,d,_ in guides]:
    item=ET.SubElement(channel,'item')
    for tag,value in [('title',title),('description',desc),('link',BASE+path),('guid',BASE+path),('pubDate',pub)]:
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
