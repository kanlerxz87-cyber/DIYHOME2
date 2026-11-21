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
# --- Question-shaped method checklists (arena/a0e07843-diyhome2) ------------
# These are the three remaining working titles supplied in the brief and
# recorded on this site as flag F06. They are published as method rather than as
# review: no air fryer or multi-function appliance listing has been verified for
# this publication, so the copy asserts no model, specification, price or star
# rating. Every line is a question the reader puts to the manual, the listing or
# the seller in front of them. Shape is (heading, lede, [questions]).
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
            'What happens to the result when the basket is full rather than half full? Ask the seller, or read the questions on the listing.']),
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
ops = [('faq','Buyer questions'),('review','Flagged for Review'),('summary','Executive summary'),('measurement','Measurement'),('measurement/index','Campaign desk'),('sources','Citation register'),('standards','Editorial standards'),('audit/index','Spec & policy audit')]
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

add('index','DIY Home Upgrades','Practical shopping guides for kitchens, walls, and the spaces in between.', '''<section class="hero"><div class="hero-copy"><div class="eyebrow">The practical home edit</div><h1>Small upgrades.<br>Better everyday.</h1><p>Find the right tools for a smoother wall, a clearer counter, and a cabinet that finally works for you.</p><a class="button" href="#edits">Explore the upgrades →</a></div><img src="assets/hero.jpg" alt="Sunlit kitchen with oak cabinets and a warm cream wall"></section><section id="edits"><div class="sectionhead"><div><div class="eyebrow">The shopping edit</div><h2>Three upgrades to start with</h2></div><a href="guides.html">All buying guides →</a></div>'''+cards(guides[:3], shopping=True)+'''</section><section class="card"><div class="eyebrow">In the kitchen</div><h2>Shopping for an air fryer?</h2><p>Compare usable capacity, cleanup and the space you’ll need before choosing a format.</p><a href="air-fryers.html">Read the air fryer guide →</a><p>Three more buyer checklists: <a href="air-fryer-capacity.html">comparing capacity</a>, <a href="air-fryer-cleanup.html">cleanup and counter space</a>, and <a href="multi-function-appliances.html">multi-function appliances</a>.</p></section><section class="card"><div class="eyebrow">Before you click</div><h2>Why there are no prices or star ratings here</h2><p>Six questions buyers ask about paid links — prices, ratings, testing and tracking — each answered by the policy or listing that settles it.</p><a href="faq.html">Read the buyer questions →</a></section><section class="sectionhead"><div><div class="eyebrow">The shop floor</div><h2>Every product, by room</h2></div><a href="shop.html">Open the shop →</a></section><div class="grid"><article class="card"><div class="eyebrow">Room refresh</div><h3><a href="category/wallpaper-tools.html">Wallpaper &amp; peel-and-stick tools</a></h3><p>What decides whether a peel-and-stick job looks flat.</p></article><article class="card"><div class="eyebrow">Kitchen counters</div><h3><a href="category/paper-towel-holders.html">Paper towel holders</a></h3><p>Get the roll off the counter without drilling.</p></article><article class="card"><div class="eyebrow">Cabinet interiors</div><h3><a href="category/pot-racks.html">Pot racks &amp; cookware organizers</a></h3><p>Turn a leaning stack of pans into a drawer you can read.</p></article></div>''')
_working_titles = [
    ('Basket or oven-style air fryer: what should you compare?', 'Published as a format comparison — method only, no specifications.', link('air-fryers','Read the guide')),
    ('A no-hype checklist for comparing air fryer capacity', 'Published as a method checklist — no specifications, no model, no price.', link('air-fryer-capacity','Read the checklist')),
    ('How to assess cleanup and counter-space trade-offs', 'Published as a method checklist — no specifications, no model, no price.', link('air-fryer-cleanup','Read the checklist')),
    ('Questions to ask before buying a multi-function kitchen appliance', 'Published as a method checklist — no specifications, no model, no price.', link('multi-function-appliances','Read the checklist')),
]
_working_rows = ''.join(f'<tr><td>{e(t)}</td><td>{e(s)}</td><td>{l}</td></tr>' for t,s,l in _working_titles)
_working_html = '<div class="prose"><h2>Working titles from the brief</h2><p>These four working titles came from the brief. They are not claims about popularity, search volume or product superiority, and none is presented as one. All four are now published. Because no air fryer or multi-function appliance listing is in the supplied catalogue, each is published as a checklist of questions rather than as a product review: no specification, price or star rating is quoted, no model is recommended, and none carries a buying link. If verified appliance listings are supplied, these pages are where researched specifications would go.</p></div><div class="scroll"><table><thead><tr><th scope="col">Working title</th><th scope="col">How it is published</th><th scope="col">Link</th></tr></thead><tbody>'+_working_rows+'</tbody></table></div>'
_guide_clusters = [
    ('Product-led', 'The shopping edit', 'Three guides, each tied to a listing this site has checked.', guides[:3], '', True),
    ('Buyer checklists', 'Kitchen appliances', 'Question-shaped checklists for countertop appliances. Method, not testing: no model is recommended and no specification is quoted.', guides[3:], worksheet_card, False),
]
add('guides','Buying guides','Buyer checklists for kitchen storage, walls and countertop appliances.',intro('The buying desk','Buying guides','Start with a question, then check the details that matter in your home.')+''.join(f'<section><div class="sectionhead"><div><div class="eyebrow">{e(eyebrow)}</div><h2>{e(h)}</h2><p class="lede">{e(b)}</p></div><a href="feed.xml">Subscribe to the feed →</a></div>{cards(items,shopping)}{extra}</section>' for eyebrow,h,b,items,extra,shopping in _guide_clusters)+_working_html)
def cite_anchor(sid):
    return f'<a href="sources.html#src-{e(sid)}">{e(sid)}</a>'

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

for slug,cat,title,desc,sections in methods:
    body = ''.join(f'<h2>{e(h)}</h2><p>{e(lede)}</p><ul>'+''.join(f'<li>{e(q)}</li>' for q in qs)+'</ul>' for h,lede,qs in sections)
    note = f'<aside class="card"><div class="eyebrow">What this checklist is not</div><p>A method, not a test. No model is recommended here, and no specification, price or star rating is quoted: {link("review","the evidence register")} records that no air fryer or multi-function appliance listing has been verified for this publication. Prices and star ratings are also outside what this site may display — see {cite_anchor("S02")} and constraints C1 to C3 in the {link("sources","citation register")}.</p></aside>'
    if slug == 'air-fryer-cleanup':
        note += worksheet_card
    tail = f'<p>Every question above is one you can put to the manual, the listing or the seller. Where a claim matters, ask for the document behind it: {source(FTC,"the FTC’s endorsement guidance")} explains why an undisclosed connection between a reviewer and a seller, and a result that is not typical, both deserve less weight.</p><p>{link("guides","Back to all guides →")}</p>'
    add(slug,title,desc,intro(f'{cat} · Buyer checklist',title,desc)+f'<article class="prose"><p class="eyebrow">DIY Home Upgrades editorial desk · {RECHECK}</p>{body}{note}{tail}</article>')

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
from summary import register_summary
register_summary(add, table, link, source, intro, RECHECK, DATE)
_issue_rows = [
    ('Issue 01', DATE, 'Four guides — ' + ', '.join(link(s, x) for s, x in [('wallpaper', 'wallpaper tools'), ('paper-towels', 'paper towel holder placement'), ('cookware', 'pan organizer fit'), ('air-fryers', 'air fryer format')]) + f' — plus the <a href="{worksheet}">counter-fit worksheet</a>.', cite_anchor('S07') + ', ' + cite_anchor('S08') + ', ' + cite_anchor('S09') + ' (listings observed ' + DATE + '); disclosure rules ' + cite_anchor('S01') + ', ' + cite_anchor('S04')),
    ('Issue 02', RECHECK, 'Three method checklists — ' + ', '.join(link(s, x) for s, x in [('air-fryer-capacity', 'comparing capacity'), ('air-fryer-cleanup', 'cleanup and counter space'), ('multi-function-appliances', 'multi-function appliances')]) + '.', 'No product asserted. Display limits ' + cite_anchor('S02') + ' (constraints C1 to C3); handling of claims and reviews ' + cite_anchor('S04') + '.'),
]
_issue_log_html = '<div class="prose"><h2>Publication log</h2><p>What has actually shipped, and the official documents behind each issue. The <a href="feed.xml">RSS feed</a> carries the same dates in machine-readable form.</p></div>' + table(['Issue', 'Published (UTC)', 'What shipped', 'Evidence basis (official sources)'], _issue_rows)
add('standards','Editorial standards' ,'How guides are written, checked and published.',intro('Site records','Editorial standards','By the DIY Home Upgrades editorial desk. Buying checklists, not hands-on reviews.')+f'''<div class="prose"><h2>Publication gate</h2><p>Confirm product intent against an official listing and save the date and source separately from the redirect. Generate a Special Link through enrolled Associates tools, then verify the destination and authorized tracking report before publishing it. Keep a paid-link notice next to each approved link and the Associates notice on every page.</p><p>Review {source(AMAZON,'the Operating Agreement')}, {source('https://affiliate-program.amazon.com/help/operating/policies','Amazon’s Program Policies')} and {source(FTC,'FTC endorsement guidance')} before publishing. Every document behind every claim, with the date it states and the constraint it imposes, is kept in the {link('sources','citation register')}. Do not scrape Amazon or use product images, ratings, prices or API content without confirming rights, sourcing and freshness requirements. The masthead photograph is AI-generated editorial imagery, not a product depiction.</p><h2>Publishing rhythm</h2><p>Target rhythm: a question-led guide roughly every two weeks, with a monthly evidence and link review. The log below is the record of what has actually shipped, and nothing on this site claims a frequency that has been sustained. Start with walls and kitchen storage; revisit seasonal topics only when they fit reader needs. Every new entry in the guide register updates the sitemap and RSS feed on build.</p></div>'''+_issue_log_html)
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

# --- Independent re-check, 2026-11-21 (arena/ff38bd99-diyhome2) --------------
# data/verification-2026-11-21.json answers a different question from the flag
# re-check log: not "was this irregularity re-examined" but "is this document
# still retrievable, does the quote still appear, and did the live listing
# contradict what we publish". Restricted sources stay visible as restricted
# rather than being quietly dropped.
_verify_doc = __import__('json').loads(Path('data/verification-2026-11-21.json').read_text())
_verify_by_id = {_r['id']: _r for _r in _verify_doc['sources']}
_verify_rows = []
for _r in _verify_doc['sources']:
    _state = ('<span class="pill gap">sign-in required</span>' if not _r['reachable']
              else '<span class="pill ok">live</span>')
    _verify_rows.append((
        f'<strong>{e(_r["id"])}</strong>',
        _state,
        e(_r['dated_on_page']) if _r['dated_on_page'] else '<span class="pill">no date shown</span>',
        'yes' if _r['quote_confirmed'] else 'no',
        e(_r['what_the_fetch_showed']),
        e(_r['result']),
    ))
_vt, _vd, _vb = pages['sources']
_vb += ('<div class="prose"><h2>Independent re-check, ' + e(_verify_doc['checked_on']) + '</h2>'
        '<p>Every document above was fetched again on that date in a clean session, and each quote was compared '
        'against the fetched text rather than against an earlier note. This is a separate pass from the flag '
        're-check log: that one records whether an irregularity was re-examined, this one records whether the '
        'document still says what the site claims it says. The three listing pages were also re-read to see whether '
        'anything we publish had been contradicted. Restricted sources are shown as restricted; they are not summarised.</p></div>'
        + table(['ID', 'Fetch', 'Dated on page', 'Quote still present', 'What the fetch showed', 'Result'], _verify_rows)
        + '<div class="prose"><h2>What this pass did not record, on purpose</h2><p>'
        + ''.join(f'<br>{e(x)}' for x in _verify_doc['listing_checks'])
        + '</p><p>Prices, star ratings, review counts and customer review text were visible on all three listing pages. '
          'None of them appears anywhere in the repository. The register constrains them (C1, C2), and the constraint '
          'is not a stylistic preference: Amazon permits them on an affiliate page only when Amazon serves the data '
          'or it arrives through Creators API or PA API.</p>'
          '<h2>Three questions only the account holder can answer</h2><ol>'
        + ''.join(f'<li>{e(q)}</li>' for q in _verify_doc['questions_for_the_owner'])
        + '</ol></div>')
pages['sources'] = (_vt, _vd, _vb)

pages['review'] = (_rt, _rd, _rb)


# --- Buyer questions (arena/ff38bd99-diyhome2) ------------------------------
# Six questions a buyer asks before trusting a paid link. Each answer is tied to
# the document that settles it. No answer states a price, a rating, a review
# count or a personal experience, because none of those can be supported here:
# see citation-register constraints C1 and C2, and flag F02 for the untested
# tracking link. This page is the last pre-click surface, so the paid-link
# wording is repeated in the intro as well as beside each listing reference.
_FAQ = [
    ('Are the prices on this site current?',
     'There are no prices on this site. Amazon permits a published price only when Amazon serves the link or the data '
     'arrives through Creators API or PA API. Neither is connected here, so the site sends you to the live listing '
     'instead of freezing a number that will be wrong by the time you read it.',
     'https://affiliate-program.amazon.com/help/operating/policies', 'S02 \u00b7 price display'),
    ('Why are there no star ratings?',
     'Customer star ratings, review counts and review text may be shown only when they were obtained through Creators '
     'API or PA API. Copying a rating off the page into a review box is a policy breach, not a shortcut.',
     'https://affiliate-program.amazon.com/help/operating/policies', 'S02 \u00b7 reviews and ratings'),
    ('Do these product links pay you?',
     'Yes. Every Amazon link on this site is a paid link and is labelled as one. The submitted tracking ID '
     'shopnow047c-20 has not been confirmed as live in the Associates account, so no commission is claimed anywhere '
     'on the site, and nothing here should be read as a promise that a purchase will earn one.',
     'https://affiliate-program.amazon.com/help/operating/agreement', 'S01 \u00b7 identifying yourself'),
    ('Have you used these products?',
     'No. Nobody on this desk has hung the wallpaper, mounted the holder or loaded the rack with pans. The pages '
     'compare what the listing publishes, point out what it leaves out or contradicts, and tell you what to measure '
     'before you order. That is the whole method, and it is written on the editorial standards page.',
     'https://affiliate-program.amazon.com/help/operating/agreement', 'S01 \u00b7 fair and accurate statements'),
    ('How do I check that a product is the one you describe?',
     'Every Amazon product has a 10-character identifier in its URL, after /dp/. The entry table on the review page '
     'records the identifier each submitted link landed on, with the date it was read, so you can open the same page '
     'and compare it yourself.',
     'https://sell.amazon.com/blog/what-is-an-asin', 'S10 \u00b7 ASIN definition'),
    ('The pan organizer looks too small for my pans. What should I do?',
     'The listing itself is inconsistent: the title and style say lightweight cookware up to 11 inches, while bullet 4 '
     'says up to 12 inches. Measure the widest pan you actually own, including its handle, against the layout you plan '
     'to build, and check the newer-model banner Amazon shows at the top of the listing before you commit.',
     'https://www.amazon.com/dp/B08DY9HRWD', 'P03 \u00b7 live listing'),
]
add('faq','Buyer questions','The six questions to settle before you click a paid link: prices, ratings, testing, tracking and which product is which.',
    intro('The front desk','Buyer questions',
         'Six questions that decide whether to trust a link, each answered by the document or listing that settles it. '
         'Every Amazon link on this site is a paid link; none of them has earned a confirmed commission.')
    + '<div class="faq">' + ''.join(
        f'<details><summary>{e(q)}</summary><p>{e(a)}</p>'
        # A listing cited as evidence is printed, never linked: an untagged Amazon
        # anchor is the very tension flag F12 records. Policy sources stay linked.
        f'<p class="fine">Basis: {("<code>"+e(u)+"</code> (listing, printed as text)") if u.startswith("https://www.amazon.com/dp/") else source(u, label)}</p></details>'
        for q, a, u, label in _FAQ) + '</div>'
    + '<div class="prose"><h2>Still deciding?</h2><p>Open '+link('shop','the shop table')+' if you know which product you want, or '+link('guides','the buying guides')+' if you are still choosing. Each guide ends with the measurements that decide the purchase.</p>'
      '<p class="fine">A question that is not answered here is either not settled by a source yet, or is recorded on the '+link('review','Flagged for Review')+' page. This site collects no email addresses.</p></div>')

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
    og_type = 'article' if page_id in ('wallpaper','paper-towels','cookware','air-fryers','guides')+method_slugs else 'website'
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
            'permit them only through Creators API or Product Advertising API content, or an Amazon-served link, '
            'and this site has neither. '
            f'Blank or {_UNV} cells are fields that could not be confirmed from an official source. '
            f'One more thing a buyer should know: every Amazon product link on this site is <strong>untagged</strong>, '
            f'because a tag cannot be added honestly until a Special Link is validated inside the enrolled account. '
            f'These are preview links, not paid Special Links, and F12 on {link("review","Flagged for Review")} records the conflict.</p>')

def _cat_cards():
    out = []
    for c in _cat_doc['categories']:
        n = sum(1 for p in _cat_doc['products'] if p['category'] == c['slug'])
        art = {'wallpaper-tools':'walls','paper-towel-holders':'counter','pot-racks':'cabinet'}.get(c['slug'])
        photo = f'<img class="edit-photo" src="assets/{art}.jpg" alt="" width="600" height="380" loading="lazy">' if art else ''
        item_word = 'item' if n == 1 else 'items'
        out.append(f'<article class="card">{photo}<div class="eyebrow">{e(c["kicker"])}</div>'
                   f'<h3><a href="category/{c["slug"]}.html">{e(c["name"])}</a></h3>'
                   f'<p>{e(c["blurb"])}</p><p><small>{n} {item_word} covered · Amazon browse node <code>{e(c["browse_node"])}</code></small></p>'
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
    _cat_cols = {
        'wallpaper-tools':      ([('Kit contents','Kit contents')], 'Kit contents'),
        'paper-towel-holders':  ([('Material','Material'), ('Dimensions','Product dimensions')], 'Material'),
        'pot-racks':            ([('Heights offered','Heights offered'), ('Colours offered','Colours offered')], 'Heights offered'),
    }
    _extra, _lead = _cat_cols.get(_c['slug'], ([], None))
    _rows = [(
        f'<strong>{e(p["name"])}</strong><br><small>{e(p["dek"])}</small>',
        source(p['listing_url'], p['asin'], True),
        _spec(p,'Brand'), _spec(p,'Sold by'),
    ) + tuple(_spec(p, key) for _, key in _extra) + (
        _link_state(p),
        f'<a href="../{_GUIDE_FOR.get(p["category"], "guides")}.html">Guide →</a>',
    ) for p in _prods]
    _headers = ['Product','ASIN','Brand','Sold by'] + [label for label, _ in _extra] + ['Buying-link status','Guide']
    _body = intro(_c['kicker'], _c['name'], _c['blurb'])
    _body += (f'<p class="prose">Amazon browse path as listed: <code>{e(_c["browse_path"])}</code> '
              f'(browse node <code>{e(_c["browse_node"])}</code>). Every value below was read from the '
              f'listing itself; anything the record does not carry is marked unverified rather than guessed.</p>')
    _body += table(_headers, _rows)
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
# shell is written last, breadth-first. Writing it earlier left the nav pointing
# at a shop.html that did not exist yet - scripts/check.py caught it.
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
_feed_date = {slug: 'Sat, 21 Nov 2026 00:00:00 GMT' for slug in method_slugs}
for path,title,desc,pub in [(worksheet,worksheet_title,worksheet_desc,'Fri, 20 Nov 2026 00:00:00 GMT')]+[(s+'.html',t,d,_feed_date.get(s,'Fri, 20 Nov 2026 00:00:00 GMT')) for s,_,t,d,_ in guides]:
    item=ET.SubElement(channel,'item')
    for tag,value in [('title',title),('description',desc),('link',BASE+path),('guid',BASE+path),('pubDate',pub)]:
        ET.SubElement(item,tag).text=value
# Site records belong in the feed too. The sitemap already lists them, and a
# reader subscribed for the record pages had no way to see a new one. Added by
# arena/ecb1bfed-diyhome2 in response to the RSS coverage request on the board.
for path,title,desc,cat in [('guides.html','Buying guides',pages['guides'][1],'Index'),
                            ('faq.html','Buyer questions',pages['faq'][1],'Guide'),
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
# The shop surface is part of the reading experience, so a subscriber sees new
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
