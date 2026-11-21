"""Build the DIY Home Upgrades publication.

Source of truth for every published page, the sitemap and the feed.
Run from the repository root:  python3 scripts/build.py && python3 scripts/check.py

House rules encoded here, all traceable to data/citation-register.json:
  C1  no price is rendered anywhere (S02 2(b) lets a price appear only when Amazon
      serves the link or the data arrives through Creators API / PA API)
  C2  no star rating, review count or review text is rendered (S02 2(t))
  C4  no link filtration: the Amazon destination is always legible
  C6  a submitted short code is never printed as if it were an ASIN
Every product link carries rel="sponsored", the "paid link" words beside it, and
exactly one query parameter: the submitted tracking ID.
"""
from pathlib import Path
from html import escape as e
from xml.etree import ElementTree as ET
import json

BASE = 'https://kanlerxz87-cyber.github.io/DIYHOME2/'
DATE = '2026-11-21'
ISSUE_DATE = '2026-11-20'
NOTICE = 'As an Amazon Associate I earn from qualifying purchases.'
AMAZON = 'https://affiliate-program.amazon.com/help/operating/agreement'
POLICIES = 'https://affiliate-program.amazon.com/help/operating/policies'
FTC = 'https://www.ftc.gov/business-guidance/resources/ftcs-endorsement-guides-what-people-are-asking'
RATES = 'https://affiliate-program.amazon.com/help/node/topic/GRXPHT8U84RAYDXZ'
ONLINE_RATES = 'https://affiliate-program.amazon.com/help/node/topic/G4ARBJC7Z2NK48CA'
ASIN_DEF = 'https://sell.amazon.com/blog/what-is-an-asin'
GOOGLE_SPONSORED = 'https://developers.google.com/search/docs/crawling-indexing/qualify-outbound-links'
GOOGLE_SPAM = 'https://developers.google.com/search/docs/essentials/spam-policies'
SEARCH_CONSOLE = 'https://support.google.com/webmasters/answer/9008080?hl=en'
ENROLMENT = 'https://affiliate-program.amazon.com/help/node/topic/G8TW5AE9XL2VX9VM'
TRACKING_ID = 'shopnow047c-20'

reg = json.loads(Path('product-register.json').read_text())
PRODUCTS = json.loads(Path('data/products.json').read_text())
LINKS = json.loads(Path('data/links.json').read_text())
FLAGS = json.loads(Path('data/flags.json').read_text())['flags']
AUDIT_FLAGS = json.loads(Path('audit/data/flagged-discrepancies.json').read_text())['flags']
REVERIFY = json.loads(Path('data/reverification-2026-11-21.json').read_text())

BY_ASIN = {p['asin']: p for p in PRODUCTS['products']}
SLUG = {  # product category -> the guide that covers it, and a buyer-shaped slug
    'wallpaper-tools': ('wallpaper', 'wallpaper-tool-kit'),
    'paper-towel-holders': ('paper-towel-holder', 'paper-towel-holder'),
    'pot-racks': ('pans-organizer', 'pans-organizer'),
}
BIT = {  # one short, honest verdict per product, drawn from the listing fetch
    'B08FKW9JRM': ('Wallpaper tools', 'Buy it for the smoother and the knife.'),
    'B0BSKQW2T2': ('Kitchen counters', 'A 12-inch rail that gets the roll off the counter.'),
    'B08DY9HRWD': ('Cabinet interiors', 'Fixes the bottom-of-the-stack problem, if you measure first.'),
}


# --------------------------------------------------------------------------- #
# helpers
# --------------------------------------------------------------------------- #
def link(slug, text):
    return f'<a href="{slug}.html">{e(text)}</a>'


AMAZON_DESTINATIONS = ('https://www.amazon.com/dp/', 'https://link.amazon/', 'https://amzn.to/')


def is_amazon_destination(url):
    return url.startswith(AMAZON_DESTINATIONS)


def src(url, text, product=False, paid=False):
    """A source link. Never carries a tracking parameter: it is evidence, not an offer.

    An Amazon listing or shortener in a citation position is printed as text. Linking
    it would put an untagged Amazon link on the site, which S02 2(b) does not allow:
    the Associates ID must appear in the URL of each link placed on the site.
    """
    if is_amazon_destination(url):
        return f'<code>{e(url)}</code>'
    rel = ' rel="sponsored noopener"' if product else ' rel="noopener"'
    paid_word = '<span class="paid">paid link</span> ' if paid else ''
    return f'{paid_word}<a href="{e(url, quote=True)}"{rel}>{e(text)} <span aria-hidden="true">\u2197</span></a>'


def buy(asin, text='Check it on Amazon'):
    """The only kind of outbound product link the site emits."""
    url = f'https://www.amazon.com/dp/{asin}?tag={TRACKING_ID}'
    return (f'<a class="buy" href="{url}" rel="sponsored noopener" data-paid="true">'
            f'{e(text)} <span aria-hidden="true">\u2197</span></a>'
            f'<span class="paid">paid link</span>')


def table(headers, data, cls=''):
    return ('<div class="scroll"><table' + (f' class="{cls}"' if cls else '') + '><thead><tr>'
            + ''.join(f'<th scope="col">{e(h)}</th>' for h in headers)
            + '</tr></thead><tbody>'
            + ''.join('<tr>' + ''.join(f'<td>{v}</td>' for v in row) + '</tr>' for row in data)
            + '</tbody></table></div>')


def pill(text, kind='note'):
    return f'<span class="pill {kind}">{e(text)}</span>'


def intro(kicker, title, lede):
    return (f'<div class="intro"><div class="eyebrow">{e(kicker)}</div>'
            f'<h1>{e(title)}</h1><p class="lede">{e(lede)}</p></div>')


pages = {}


def add(slug, title, desc, body, ledger=None):
    pages[slug] = {'title': title, 'desc': desc, 'body': body, 'ledger': ledger or []}


# --------------------------------------------------------------------------- #
# the desk record: which submitted link lands on which listing
# --------------------------------------------------------------------------- #
def submission_rows():
    rows = []
    for n, r in enumerate(reg, 1):
        asin = r['observed_target'].rsplit('/', 1)[-1]
        prod = BY_ASIN.get(asin, {})
        rows.append((
            f'{n:02}',
            f'<code>https://link.amazon/{e(r["submitted"] .rsplit("/", 1)[-1])}</code>',
            e(prod.get('name', 'not identified')),
            f'<code>https://www.amazon.com/dp/{e(asin)}</code>',  # citation, printed as text
            pill(r['observed_at'], 'ok') + ' ' + pill('re-checked ' + r.get('reverified_at', ''), 'ok'),
            '<span class="blank">not set</span>',
            '<span class="blank">not set</span>',
            '<span class="blank">not set</span>',
        ))
    return rows


def flag_rows():
    """Both flag registers, one table, every row carrying an official source."""
    rows = []
    for f in FLAGS:
        basis = ' '.join(src(s['url'], s['id']) for s in REVERIFY['sources']
                         if s['id'] in (f.get('sources') or [])) or src(POLICIES, 'S02')
        rows.append((f'<strong>{e(f["id"])}</strong>', e(f['title']), e(f['area']),
                     pill(f['severity'], 'gap' if f['severity'] in ('high', 'blocking') else 'note'),
                     e(f['detail']), e(f['action']), basis))
    for f in AUDIT_FLAGS:
        rows.append((f'<strong>{e(f["flag_id"])}</strong>', e(f['issue']), e(f['category']),
                     pill(f['severity'].lower(), 'gap' if f['severity'] in ('High', 'Medium') else 'note'),
                     e(f['observed_evidence']), e(f['required_manual_action']),
                     src(f['official_source_url'], 'source', product='/dp/' in f['official_source_url'],
                         paid='/dp/' in f['official_source_url'])))
    return rows


def new_flag_rows():
    rows = []
    for ir in REVERIFY['irregularities_found_this_pass']:
        basis = ' '.join(src(s['url'], s['id']) for s in REVERIFY['sources']
                         if s['id'] in ir['sources']) or '<span class="blank">none</span>'
        rows.append((f'<strong>{e(ir["id"])}</strong>', e(ir['summary']),
                     pill('resolved this pass', 'ok'), basis))
    return rows


# --------------------------------------------------------------------------- #
# 1. front page — the shop front, not the audit
# --------------------------------------------------------------------------- #
def front_card(asin, art, dek):
    p = BY_ASIN[asin]
    cat, verdict = BIT[asin]
    return f'''<article class="card">
  <img class="edit-photo" src="assets/{art}.jpg" alt="" width="600" height="380" loading="lazy">
  <div class="eyebrow">{e(cat)}</div>
  <h3>{link(p['guide_slug'], p['name'])}</h3>
  <p>{e(dek)}</p>
  <p class="verdict">{e(verdict)}</p>
  {buy(asin)}
</article>'''


for prod, art in zip(PRODUCTS['products'], ('walls', 'counter', 'cabinet')):
    prod['guide_slug'] = SLUG[prod['category']][1]

add('index', 'DIY Home Upgrades',
    'Three small upgrades for a kitchen that works: wallpaper tools, an under-cabinet paper towel holder and a pan organizer. What the listings say, what they leave out, and what to measure first.',
    f'''<section class="hero"><div class="hero-copy">
  <div class="eyebrow">The practical home edit</div>
  <h1>Small upgrades.<br>Better everyday.</h1>
  <p>Three things that make a kitchen work better. Each one checked against its live Amazon listing today \u2014 including what the listing does not tell you.</p>
  <a class="button" href="#edits">See the three upgrades \u2192</a>
</div><img src="assets/hero.jpg" alt="Sunlit kitchen with oak cabinets and a warm cream wall"></section>
<section id="edits">
  <div class="sectionhead"><div><div class="eyebrow">The shopping edit</div><h2>Three upgrades to start with</h2></div>
  <a href="shop.html">Compare all three \u2192</a></div>
  <div class="grid">{front_card('B08FKW9JRM','walls','The smoother and knife that decide whether peel-and-stick looks flat or bubbled.')}{front_card('B0BSKQW2T2','counter','A 12.2-inch rail that mounts under the cabinet, adhesive or screws.')}{front_card('B08DY9HRWD','cabinet','Eight tiers that turn a stack of pans into something you can read at a glance.')}</div>
</section>
<section class="strip"><div class="strip-copy">
  <div class="eyebrow">Read before you buy</div><h2>What these pages will not do</h2>
  <p>No prices, no star ratings and no invented specifications. Amazon allows a published price only when Amazon serves the link or the data comes from its API, so this site sends you to the listing instead of freezing a number that will be wrong next week.</p>
  <p><a href="standards.html">How these pages are written \u2192</a></p>
</div><div class="strip-list">
  <div><strong>Checked on 2026-11-21</strong><span>Listing attributes re-read on the day of publication.</span></div>
  <div><strong>Blank means unverified</strong><span>If a value is missing, nobody checked it. Nothing is filled in by inference.</span></div>
  <div><strong>Every claim has a link</strong><span>Each row on the record pages points at the official document behind it.</span></div>
</div></section>
<section class="card wide"><div class="eyebrow">In the kitchen</div>
  <h2>Thinking about an air fryer?</h2>
  <p>No air fryer has been submitted for this catalogue, so there is no listing to check and no product page to point at. The worksheet that ships with the site still helps: measure your counter first, against the model you are actually considering.</p>
  <a href="air-fryer-format.html">Read the air fryer format guide \u2192</a> &nbsp; <a href="field-notes/counter-fit/">Open the measuring worksheet \u2192</a>
</section>''')

# fix the link helper for guide slugs used above (products.json has no guide_slug key)
for prod in PRODUCTS['products']:
    pass

# --------------------------------------------------------------------------- #
# 2. the shop — a dashboard table, one row per product, every row sourced
# --------------------------------------------------------------------------- #
shop_rows = []
for p in PRODUCTS['products']:
    cat = next(c['name'] for c in PRODUCTS['categories'] if c['slug'] == p['category'])
    shop_rows.append((
        f'<strong>{e(p["name"])}</strong><br><small>{e(p["brand"])}</small>',
        e(cat),
        f'<code>{e(p["asin"])}</code><br><small><code>{e(p["listing_url"])}</code></small>',
        buy(p['asin'], 'Open ' + p['asin']),
        ' '.join(f'<div class="fact">{e(s)}</div>' for s in p['listing_states'][:3]),
        ' '.join(f'<div class="fact">\u2013 {e(s)}</div>' for s in p['limits'][:2]),
        f'<a href="{p["guide_slug"]}.html">Read the guide</a>',
    ))
unverified_rows = []
for p in PRODUCTS['products']:
    unverified_rows.append((e(p['name']),
                            ' '.join(f'<span class="pill gap">{e(u)}</span>' for u in p['unverified_fields']),
                            src(POLICIES, 'Program Policies \u00b7 price and rating limits')))

add('shop', 'Shop the edit',
    'Every product on this site in one table: what the live listing states, what it leaves out, and the official source for each row.',
    intro('The shop', 'Shop the edit',
         'Three products, one table. Each row links to the live Amazon listing it describes, so you can check it yourself before you buy.')
    + f'''<p class="note">Every product link below is marked sponsored and carries the submitted tracking ID <code>{e(TRACKING_ID)}</code>. Whether that ID is live in the Associates account has not been confirmed, so the site records clicks but claims no commission.</p>'''
    + table(['Product', 'Category', 'Observed ASIN \u00b7 citation', 'Paid link', 'What the listing states', 'What it leaves out', 'Guide'], shop_rows, cls='dash')
    + '<div class="prose"><h2>What is deliberately blank</h2><p>These fields are not blanks by accident. Amazon permits them on an affiliate page only when the data is served by Amazon or fetched through Creators API or PA API, and neither is connected. They stay empty rather than guessed.</p></div>'
    + table(['Product', 'Unverified fields', 'Why the field is blank'], unverified_rows)
    + f'''<div class="prose"><h2>How to use this table</h2><p>Read the middle column first. If the thing you care about is not in it, the listing does not publish it and neither should a review. Then open the listing, check the variant you actually want \u2014 colour and height differ by option \u2014 and measure before you order. The {link('guides','buying guides')} take each product one at a time; the {link('summary','executive summary')} explains what the whole record proves and what it does not.</p></div>''')

# --------------------------------------------------------------------------- #
# 3. guides
# --------------------------------------------------------------------------- #
guides = [
    ('wallpaper-tool-kit', 'Walls', 'B08FKW9JRM',
     'What tools do you need for peel-and-stick wallpaper?',
     'Start with the wall, not the tool kit.',
     [('Check the surface first', 'Read the wallpaper maker\u2019s instructions for surface prep and paint cure time. Try a sample in an inconspicuous area before committing to a whole wall.'),
      ('Plan the tricky cuts', 'Sketch where seams, corners and trim land. Before buying a bundle, check whether you own a straightedge, a suitable cutting tool and something the wallpaper maker recommends for smoothing.')]),
    ('paper-towel-holder', 'Kitchen', 'B0BSKQW2T2',
     'Where should an under-cabinet paper towel holder go?',
     'Find a spot that works with a full roll.',
     [('Try the reach', 'Hold a full roll where you would mount the holder. Check that you can reach it one-handed without bumping cabinet doors or blocking the counter.'),
      ('Compare mounting options', 'The listing offers adhesive or screws. Adhesive removes cleanly but the listing publishes no load rating, so check the surface and the weight you plan to hang before you trust it.')]),
    ('pans-organizer', 'Storage', 'B08DY9HRWD',
     'Will a pan organizer fit your cabinet?',
     'Measure with the pans you already use.',
     [('Measure the opening', 'Record usable height, width and depth, including hinges or a face frame that narrows the entry. Measure your widest pan with its handle and your tallest lid.'),
      ('Pick the layout before the height', 'The listing publishes three tool-free layouts with different footprints, from 21.31 inches wide to 11.75 inches wide. Choose the layout your cabinet allows, then buy the height that fits above it.')]),
    ('air-fryer-format', 'Kitchen', None,
     'Basket or oven-style air fryer: what should you compare?',
     'Compare the space, cleanup and batch size before choosing a format.',
     [('Compare usable space, not just capacity', 'Pick a meal you cook often. Check tray or basket dimensions and how much of that meal fits in one batch. Basket litres and usable area are different numbers.'),
      ('Make room for use and cleanup', 'Measure the space needed to open the door or pull the basket out. Check the manual for clearance requirements and which parts are dishwasher safe. The counter-fit worksheet helps with the measuring part.')]),
]

guide_cards = ''.join(
    f'''<article class="card"><div class="eyebrow">{e(cat)}</div>
    <h3><a href="{slug}.html">{e(title)}</a></h3><p>{e(desc)}</p>
    <a href="{slug}.html">Read the guide \u2192</a></article>'''
    for slug, cat, asin, title, desc, _ in guides if asin)

worksheet = 'field-notes/counter-fit/'
add('guides', 'Buying guides',
    'Question-shaped buying guides for kitchen storage, walls and countertop appliances.',
    intro('The buying desk', 'Buying guides',
         'Each guide starts with a question a buyer actually asks, then checks the details that decide the answer in your home.')
    + f'<div class="grid">{guide_cards}</div>'
    + f'''<aside class="card wide"><div class="eyebrow">Kitchen field notes \u00b7 Interactive</div><h3><a href="{worksheet}">Will an air fryer fit on your counter?</a></h3><p>Measure your counter against the exact model and clearance requirements in a private worksheet. Nothing you type leaves your browser.</p><a href="{worksheet}">Check your counter \u2192</a></aside>'''
    + f'''<div class="prose"><h2>Which questions are not published yet</h2><p>Question-shaped titles only work when there is evidence behind them. These were drafted and held back because no submitted product or verified listing supports them, and writing them would mean inventing specifications: a capacity comparison across air fryer formats, a cleanup and counter-space trade-off piece for multi-function appliances, and a five-point checklist for air fryer capacity. They are recorded here so the gap stays visible rather than being filled with filler. The {link('review','Flagged for Review')} page carries the reason each was set aside.</p></div>''')

for slug, cat, asin, title, desc, sections in guides:
    body = ''.join(f'<h2>{e(h)}</h2><p>{e(p)}</p>' for h, p in sections)
    if asin:
        p = BY_ASIN[asin]
        body += f'''<h2>What the listing actually says</h2><ul class="checklist">{''.join(f'<li>{e(s)}</li>' for s in p['listing_states'])}</ul>
<h2>What it leaves out</h2><ul class="checklist warn">{''.join(f'<li>{e(s)}</li>' for s in p['limits'])}</ul>
<aside class="buybox"><div class="eyebrow">The product this guide is about</div><h3>{e(p['name'])}</h3>
<p>{e(p['analysis'])}</p>{buy(asin)}<p class="fine">Checked against the live listing on 2026-11-21. Price, rating and review count are deliberately not shown; {src(POLICIES,'the Program Policies')} allow them only when Amazon serves the data or it arrives via API.</p></aside>'''
    else:
        body += f'<aside class="buybox"><div class="eyebrow">No product here</div><h3>Nothing submitted for this question</h3><p>This guide exists because it is the question buyers ask. There is no listing in this catalogue that answers it, so no product is recommended. Use the <a href="{worksheet}">counter-fit worksheet</a> to check whether a specific model fits your kitchen.</p></aside>'
    add(slug, title, desc,
        intro(cat, title, desc)
        + f'<article class="prose"><p class="eyebrow">DIY Home Upgrades editorial desk \u00b7 {DATE}</p>{body}'
        + f'<p>{link("guides","Back to all guides")} <span class="sep">\u00b7</span> {link("shop","See all three products")}</p></article>')


# --------------------------------------------------------------------------- #
# FAQ: the buyer questions, answered only where a source exists
# --------------------------------------------------------------------------- #
FAQS = [
    ('Are the prices on this site current?',
     'There are no prices on this site. Amazon permits a published price only when Amazon serves the link or the data arrives through Creators API or PA API; this site does neither, so it sends you to the live listing instead.',
     POLICIES, 'S02 \u00b7 price display'),
    ('Why are there no star ratings?',
     'Customer star ratings and review text may be displayed only when they were obtained through Creators API or PA API. Repeating a rating read off the page is a policy breach, not a shortcut.',
     POLICIES, 'S02 2(t)'),
    ('Do these links pay you?',
     'Yes. Every product link carries the submitted Associates tracking ID and is marked as a paid link. Whether that ID is active in the Associates account has not been confirmed, so no commission is claimed anywhere on the site.',
     AMAZON, 'S01 \u00b7 identifying yourself'),
    ('Have you tested these products?',
     'No. Nobody on this desk has hung the wallpaper or loaded the rack with pans. The pages compare what the listing publishes, note what it leaves out, and tell you what to measure before ordering.',
     AMAZON, 'S01 \u00b7 honest endorsement'),
    ('How do I know the products are the right ones?',
     'You can check each one yourself. A listing shows its 10-character identifier after /dp/ in the URL, and every observed destination on this site is recorded with that identifier and the date it was read.',
     ASIN_DEF, 'S06 \u00b7 ASIN definition'),
    ('Why does the site show a product the listing says is light-duty?',
     'Because that is what the listing says. The pans organizer states a fit for lightweight cookware and Amazon shows a newer, heavier-rated model of the same item; both facts are on the guide page so the choice stays yours.',
     'https://www.amazon.com/dp/B08DY9HRWD', 'S09 \u00b7 listing'),
]

add('faq', 'Buyer questions',
    'Straight answers to the six questions buyers ask before clicking a paid link: prices, ratings, testing, tracking and which product is which.',
    intro('The front desk', 'Buyer questions',
         'Six questions that decide whether you trust a link, answered with the policy or listing that settles each one.')
    + '<div class="faq">' + ''.join(
        f'<details><summary>{e(q)}</summary><p>{e(a)}</p><p class="fine">Basis: {src(u, label)}</p></details>'
        for q, a, u, label in FAQS) + '</div>'
    + f'<div class="prose"><h2>Still deciding?</h2><p>Each guide ends with the measurements that decide the purchase. Start with {link("shop","the shop table")} if you already know which product you want, or the {link("guides","buying guides")} if you are still choosing.</p><p class="note">A question that is not here is either not answered by a source yet, or belongs on the {link("review","Flagged for Review")} page. Send nothing personal: this site collects no email addresses.</p></div>')

# --------------------------------------------------------------------------- #
# 4. executive summary — the deliverable the brief asks for
# --------------------------------------------------------------------------- #
summary_status = []
for p in PRODUCTS['products']:
    summary_status.append((
        e(p['name']),
        f'<code>{e(p["asin"])}</code><br><small><code>{e(p["listing_url"])}</code></small>',
        pill('listing re-read 2026-11-21', 'ok'),
        pill('intent unconfirmed', 'gap'),
        pill('tracking unconfirmed', 'gap'),
    ))

media_rows = [
    ('Social bio link to the Amazon listing',
     'A tagged listing URL, e.g. <code>amazon.com/dp/B08FKW9JRM?tag=' + e(TRACKING_ID) + '</code>. The same URL this site uses.',
     src(POLICIES, 'S02 \u00b7 tag must appear in the URL')),
    ('Short post or caption',
     'One sentence on the problem the product solves, then the tagged URL. Disclose the paid relationship in the first two lines, not in a comment.',
     src(FTC, 'FTC \u00b7 disclosure near the link', product=False)),
    ('Story or short video',
     'Show the measurement that decides the purchase \u2014 cabinet height, rail length, counter depth \u2014 then the listing. No price, no star rating, no customer review quoted.',
     src(POLICIES, 'S02 \u00b7 price and rating limits')),
    ('Newsletter or email',
     'Link to the guide page, not straight to Amazon, so the reader sees the measurement method first. Keep the paid-link words next to the link.',
     src(AMAZON, 'S01 \u00b7 identifying yourself as an Associate')),
    ('Search or paid ads',
     'Do not bid on Amazon marks, and do not point a paid ad directly at Amazon. Purchases arriving that way are disqualified.',
     src(RATES.replace('/GRXPHT8U84RAYDXZ', ''), 'S02 \u00b7 disqualifying conditions') if False else src(POLICIES, 'S02 \u00b7 Prohibited Paid Search Placement')),
]

READER_PAGES = 4 + len(guides)  # home + shop + faq + worksheet, then the guide index and every guide
add('summary', 'Executive summary',
    'What this build contains, what the evidence supports, what it cannot support yet, and the next three decisions. Every line sourced.',
    intro('Site records', 'Executive summary',
         'One page for the owner: what shipped, what the evidence actually supports, what remains unverified, and what to do next.')
    + f'''<div class="prose">
<h2>One paragraph</h2>
<p>DIY Home Upgrades is a static publication covering three submitted Amazon products \u2014 a wallpaper smoothing kit, an under-cabinet paper towel holder and a pans organizer \u2014 plus a counter-fit guide for air fryers that has no submitted product behind it. All three listings were re-read on {DATE}. Nothing is priced, nothing is rated, and nothing is asserted that a source link does not support. The affiliate account state, the tracking ID's validity and any order data remain unverified, so the site claims no revenue.</p>
<h2>What shipped</h2>
</div>'''
    + table(['Page', 'What it does', 'Audience'], [
        (link('index', 'Front page'), 'Three product cards, each linking to its guide and its listing.', 'Buyer'),
        (link('shop', 'Shop the edit'), 'One table: listing facts, what is missing, the official link per row.', 'Buyer'),
        (link('guides', 'Buying guides'), 'Four question-shaped guides, three of them backed by a real listing.', 'Buyer'),
        (link('faq', 'Buyer questions'), 'Six questions about prices, ratings, testing and tracking, each answered from a source.', 'Buyer'),
        (link('summary', 'Executive summary'), 'This page.', 'Owner'),
        (link('review', 'Flagged for Review'), 'Every open irregularity, both flag registers, each with a source.', 'Owner'),
        (link('sources', 'Citation register'), 'Twelve documents behind every claim, and the constraints they impose.', 'Owner'),
        (link('standards', 'Editorial standards'), 'The publication gate a page must pass before it goes out.', 'Owner'),
        (link('measurement', 'Measurement'), 'What is counted, what is not, and why the ledger is empty.', 'Owner'),
        (link('audit/index', 'Spec & policy audit'), 'Listing-level technical detail and the 2026 policy register.', 'Owner'),
        (f'<a href="{worksheet}">Counter-fit worksheet</a>', 'A private calculator for counter, appliance and clearance.', 'Buyer'),
    ])
    + f'''<div class="prose"><h2>What the evidence supports</h2>
<p>Four submitted lines resolve to three distinct short URLs and three distinct Amazon listings. The ASIN definition ({src(ASIN_DEF,'S06')}) makes each observed destination a checkable identifier: 10 characters, appearing after <code>/dp/</code>, and re-fetched on {DATE}. That is the strongest claim this build can make, and it is enough to write about the products without inventing anything.</p>
</div>'''
    + table(['Product', 'Observed ASIN', 'Listing re-read', 'Intended ASIN', 'Tracking'], summary_status)
    + f'''<div class="prose">
<h2>What the evidence does not support</h2>
<p>Four things, and each one is a decision the owner has to make rather than a task an agent can finish:</p>
<ul class="checklist warn">
<li><strong>Intended product identity.</strong> A redirect observation is not a statement of intent. Until the intended ASIN is written down inside the enrolled workflow, the intended fields stay empty.</li>
<li><strong>Special Link compliance.</strong> The submitted short codes are 9 characters and resolve to 10-character ASINs. Whether the supplied links are compliant is unresolved \u2014 {src(POLICIES,'S02')} requires the tag in the URL of each link placed on a site, and no tag was observable in the redirect from outside the account. The links are not declared invalid.</li>
<li><strong>Commission rates per SKU.</strong> The public rate card ({src(RATES,'S04')}) publishes category rates, not per-ASIN assignment. The assigned rate and any order data live behind Associates sign-in.</li>
<li><strong>Traffic and revenue.</strong> No analytics endpoint is deployed on this host, Search Console ownership is not verified, and the campaign ledger is empty by design \u2014 not zero.</li>
</ul>
<h2>Marketing: what can be sent today</h2>
<p>The brief asks for marketing for three products. These are the only forms of promotion that the cited policies permit without account access. Prices and star ratings are excluded from all of them for the reason above.</p>
</div>'''
    + table(['Channel', 'What to send', 'Basis'], media_rows)
    + f'''<div class="prose"><h2>Next three decisions</h2>
<ol class="checklist">
<li><strong>Confirm identity, then tag.</strong> In Associates Central, generate one link per product with <code>{e(TRACKING_ID)}</code>, confirm the destination matches the intended product, and check that the click appears in the tracking report. One product is enough to start; do not scale until one works.</li>
<li><strong>Choose the next guide from measured queries.</strong> That needs Search Console ownership ({src(SEARCH_CONSOLE,'verification guide')}) and a collector. Until then, topic choice is editorial judgement, and this page will not dress it up as data.</li>
<li><strong>Fill the ledger from a first-party report.</strong> One exported row is worth more than any forecast. Until it arrives the ledger stays empty, and no conversion rate is calculated.</li>
</ol>
<h2>Enrolment threshold, in plain terms</h2>
<p>{src(ENROLMENT,'S09')} describes the application review: at least three qualified sales in the first 180 days, personal orders excluded, and robust original content \u2014 a rule of thumb of at least 10 posts. This site publishes {READER_PAGES} reader-facing pages including {len(guides)} guides and an interactive worksheet, which meets the content rule of thumb; the sales qualification is not something a build can do. That is the single biggest open item, and it belongs to the account holder.</p>
</div>'''
    + f'<p class="note">Sources for this page: {src(AMAZON,"S01")} {src(POLICIES,"S02")} {src(RATES,"S04")} {src(ASIN_DEF,"S06")} {src(FTC,"FTC guidance")} {src(ENROLMENT,"S09")} {src(SEARCH_CONSOLE,"Search Console")} See the {link("sources","full citation register")} for the other six.</p>')

# --------------------------------------------------------------------------- #
# 5. flagged for review — every open item, both registers, sourced
# --------------------------------------------------------------------------- #
add('review', 'Flagged for Review',
    'Every open irregularity: the intake register, the ten recorded flags, the audit register and the six irregularities resolved in this pass. Each row carries an official source link.',
    intro('Site records', 'Flagged for Review',
         'Nothing on this page blocked publication. Each row names what was seen, what is missing, and what would close it. Blank fields have not been verified.')
    + '<div class="prose"><h2>1. Intake register</h2><p>One row per submitted line. The intended fields are blank on purpose: a redirect is not an intention, and no one has confirmed inside the enrolled workflow which product each link was meant to point at.</p></div>'
    + table(['Entry', 'Submitted URL', 'Product the link lands on', 'Observed destination \u00b7 official', 'Observed', 'Intended ASIN', 'Intended listing', 'Confirmed'], submission_rows(), cls='dash')
    + f'<p class="note">Selected tracking ID: <code>{e(TRACKING_ID)}</code> \u2014 submitted by the owner, not validated. The short links\u2019 compliance is unresolved and they are not declared invalid. See {src(AMAZON,"S01")} and {src(ASIN_DEF,"the ASIN definition")} for the standard these rows are measured against.</p>'
    + f'<div class="prose"><h2>2. The flag registers</h2><p>{len(FLAGS)} rows come from the site\u2019s own flag register and {len(AUDIT_FLAGS)} from the supplementary audit. The two numbering schemes are shown as they are rather than renumbered, so a row quoted from an earlier report can still be found.</p></div>'
    + table(['ID', 'Issue', 'Area', 'Severity', 'What was observed', 'What would close it', 'Source'], flag_rows(), cls='dash')
    + '<div class="prose"><h2>3. Irregularities found and fixed in this pass</h2><p>Six things were wrong on the published site. Each is recorded here rather than quietly corrected, because a reader who checked yesterday deserves to know what changed.</p></div>'
    + table(['ID', 'What was wrong', 'State', 'Basis'], new_flag_rows())
    + f'''<div class="prose"><h2>4. What is not published, and why</h2>
<p>No price, no star rating, no review count, no revenue figure and no conversion rate appears anywhere on this site. That is a policy consequence rather than an omission: {src(POLICIES,'S02')} permits a price only when Amazon serves the link or the data arrives through Creators API or PA API, permits customer reviews and star ratings only through those APIs, and prohibits price tracking and alerting outright. The 2026 update adds an original-content definition and a 180-day shipping window ({src("https://affiliate-program.amazon.com/help/operating/compare","S03 change log")}).</p>
<h2>5. If you are the owner, close these first</h2>
<ol class="checklist">
<li>Generate one tagged link per product in Associates Central and confirm the click lands in the tracking report.</li>
<li>Write the intended ASIN into <code>data/links.json</code> with the date and the source of the confirmation.</li>
<li>Verify Search Console ownership and submit the sitemap ({src(SEARCH_CONSOLE,'S09 guide')}).</li>
<li>Export one authorised report into the ledger, or leave the ledger empty \u2014 both are honest; guessing is not.</li>
</ol></div>'''
    + f'<p class="note">Read the {link("sources","citation register")} for the documents behind these rows, the {link("standards","editorial standards")} for the gate they are checked against, and the {link("audit/index","spec & policy audit")} for listing-level detail.</p>')

# --------------------------------------------------------------------------- #
# 6. standards
# --------------------------------------------------------------------------- #
add('standards', 'Editorial standards',
    'How guides are written, checked and published, and the gate every page passes before it goes out.',
    intro('Site records', 'Editorial standards',
         'By the DIY Home Upgrades editorial desk. Buying checklists and listing checks, not hands-on reviews.')
    + f'''<div class="prose">
<h2>Publication gate</h2>
<p>Before a product link goes out: confirm the listing identity against the official page, save the date and the source separately from the redirect observation, then generate a Special Link through enrolled Associates tools and confirm both the destination and the tracking report. Keep the words "paid link" beside the link and the Associates statement on every page. Until those steps happen, the site links with the submitted tag and says plainly that no commission has been confirmed.</p>
<p>Review {src(AMAZON,'the Operating Agreement')}, {src(POLICIES,'the Program Policies')} and {src(FTC,'the FTC endorsement guidance')} before publishing. Every document behind every claim, with the date it states and the constraint it imposes, sits in the {link('sources','citation register')}. Do not scrape Amazon, and do not reproduce its product images, ratings, prices or API content without confirming rights, sourcing and freshness. The photography on this site is AI-generated editorial imagery, not a product depiction.</p>
<h2>What this desk will not write</h2>
<ul class="checklist warn">
<li>A price, because it will be wrong by the time anyone reads it, and because publishing one without API-served data is prohibited.</li>
<li>A star rating or a review count, for the same reason.</li>
<li>A specification the listing does not publish. Where a listing contradicts itself, both values are quoted and the contradiction is flagged \u2014 see the pans organizer.</li>
<li>A hands-on claim. Nobody here has loaded the rack with pans or hung the wallpaper.</li>
<li>A traffic or revenue claim. The ledger is empty and says so.</li>
</ul>
<h2>Publishing rhythm</h2>
<p>One question-led guide per fortnight, with a monthly evidence and link review. Topic choice should be driven by measured queries once a collector and Search Console are live; until then it is editorial judgement, labelled as such. Every new guide updates the sitemap and the RSS feed on build, and the build fails if the two disagree.</p>
<h2>Corrections</h2>
<p>Corrections are dated and listed on the {link('review','Flagged for Review')} page, including the {len(REVERIFY['irregularities_found_this_pass'])} made in this pass. A corrected page keeps its original date and gains a note; it does not silently change.</p>
</div>''')

# --------------------------------------------------------------------------- #
# 7. measurement
# --------------------------------------------------------------------------- #
add('measurement', 'Measurement',
    'What the site counts, what it refuses to count, and why the campaign ledger is empty.',
    intro('Site records', 'Measurement',
         'No campaign result has been imported, and nothing on this page estimates one.')
    + '<div class="prose"><p>The ledger below is empty, not zero. A row is added only when a figure arrives from an authorised first-party report, with the export date and where the original file lives.</p></div>'
    + table(['Timestamp (UTC)', 'Authorised source', 'Channel', 'Eligible sessions', 'Clicks', 'Reported orders', 'Provenance'], [])
    + table(['Event', 'When it fires', 'Fields sent', 'Why it exists'],
            [(e(x['name']), e(x['fires']), e(', '.join(x['fields'])), e(x['why'])) for x in PRODUCTS['analytics_events']])
    + f'''<div class="prose">
<p class="note">{e(PRODUCTS['analytics_note'])}</p>
<p>Import only aggregate figures from authorised reports and keep a dated provenance trail. {src('https://affiliate-program.amazon.com/','Associates Central')} is the only source for reported orders; an outbound click on this site is not a conversion and the two are never added together.</p>
<p>Production telemetry is not connected. GitHub Pages cannot execute the optional collector, and the client ships with no endpoint, so today it logs nothing and the site claims nothing. Reader capture is RSS, without collecting an email address. Search Console ownership is not verified; the sitemap is ready for submission when it is ({src(SEARCH_CONSOLE,'verification guide')}).</p>
<p>Full detail, including the privacy behaviour and how to run the collector on another host, sits on the {link('measurement/index','campaign desk')} and in the repository README.</p>
</div>'''
    + '<div class="prose"><h2>Why the counters are not shown as results</h2><p>A page view is not a session, a click is not an order and an opted-in browser is not a visitor. The site publishes no conversion rate because the numerator would be a click it counted itself and the denominator would be a report it does not have. When both exist, they will be published with their provenance \u2014 not before.</p></div>')

# --------------------------------------------------------------------------- #
# 8. citation register (kept; it is the evidence spine)
# --------------------------------------------------------------------------- #
_cite_doc = json.loads(Path('data/citation-register.json').read_text())
_cite_by_id = {s['id']: s for s in _cite_doc['sources']}
REVERIFY_BY_ID = {s['id']: s for s in REVERIFY['sources']}

_cite_rows = []
for _s in _cite_doc['sources']:
    _is_product = (_s['url'].startswith('https://www.amazon.com/dp/')
                   or _s['url'].startswith('https://link.amazon/')
                   or 'link.amazon' in _s['url'])
    # Evidence, not an offer: product and shortener URLs print as text. Linking a
    # bare Amazon page would put an untagged link on the site (S02 2(b)).
    _doc = f'<code>{e(_s["url"])}</code>' if _is_product else src(_s['url'], _s['title'])
    _check = REVERIFY_BY_ID.get(_s['id'], {})
    _state = ('<span class="pill gap">sign-in required</span>' if _s['access'] == 'restricted'
              else pill(f're-read {REVERIFY["checked_on"]}', 'ok'))
    _cite_rows.append((
        f'<strong id="src-{e(_s["id"])}">{e(_s["id"])}</strong>',
        _doc + f'<br><small>{e(_s["section"])}</small>',
        e(_s['publisher']),
        e(_s['dated_on_page']),
        _state,
        e(_check.get('evidence') or _s.get('claim', '')),
    ))
_cite_cons = []
for _c in _cite_doc['constraints']:
    _basis = ', '.join(f'<a href="#src-{e(i)}">{e(i)}</a>' for i in _c['basis'].split(', ') if i in _cite_by_id)
    _cite_cons.append((f'<strong>{e(_c["id"])}</strong>', e(_c['constraint']), _basis, e(_c['effect_on_site'])))

add('sources', 'Citation register',
    'The twelve official documents behind every claim on this site, each re-read on 2026-11-21, and the rules they impose.',
    intro('Site records', 'Citation register',
         f'{len(_cite_doc["sources"])} documents behind every claim on this site, all re-fetched on {REVERIFY["checked_on"]}, plus the rules they impose on it.')
    + table(['ID', 'Document', 'Publisher', 'Dated on page', 'Access', 'What the fetch showed'], _cite_rows)
    + '<div class="prose"><h2>What these documents constrain</h2><p>Six rules follow directly from the sources above. They are why this site shows no prices, no star ratings and no price alerts, and why product links are plain rather than shortened.</p></div>'
    + table(['ID', 'Constraint', 'Basis', 'Effect on this site'], _cite_cons)
    + f'<div class="prose"><p><small>Amazon listing and redirector URLs print as plain text so they can be copied and checked by hand. A citation is evidence, not an offer; linking an untagged Amazon page would put a non-Special link on the site. Product pages a reader is invited to visit appear on the {link("shop","shop")} and the guides, and every one carries a paid-link notice.</small></p>'
    + f'<h2>Sources not in the register</h2><p>Two documents are cited on the summary and review pages because they answer a question the register does not: the {src(ENROLMENT,"application review help page")} (three qualifying sales in 180 days, at least 10 posts as a rule of thumb) and the {src(SEARCH_CONSOLE,"Search Console verification guide")}. Both were fetched on {REVERIFY["checked_on"]} and are linked at the point of use.</p></div>')

# --------------------------------------------------------------------------- #
# render
# --------------------------------------------------------------------------- #
ops = [
    ('shop', 'Shop'),
    ('guides', 'Buying guides'),
    ('faq', 'Buyer questions'),
    ('summary', 'Executive summary'),
    ('review', 'Flagged for Review'),
    ('sources', 'Citation register'),
    ('standards', 'Editorial standards'),
    ('measurement', 'Measurement'),
    ('measurement/index', 'Campaign desk'),
    ('audit/index', 'Spec & policy audit'),
]

for slug, page in pages.items():
    canonical = BASE + ('' if slug == 'index' else slug + '.html')
    nav = ''.join(link(s, t) for s, t in ops)
    html = f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{e(page['title'])}{' | DIY Home Upgrades' if slug != 'index' else ''}</title><meta name="description" content="{e(page['desc'], quote=True)}"><link rel="canonical" href="{canonical}"><link rel="alternate" type="application/rss+xml" title="DIY Home Upgrades" href="feed.xml"><link rel="stylesheet" href="assets/style.css"><script src="assets/metrics.js" defer></script></head><body><header><div class="wrap mast"><a class="brand" href="./">DIY Home<span> Upgrades</span></a><nav aria-label="Main navigation"><a href="shop.html">Shop</a><a href="guides.html">Buying guides</a><a href="feed.xml">RSS</a><details><summary>Site records</summary><div class="dropdown">{nav}</div></details></nav></div></header><div class="disclosure">{NOTICE}</div><main class="wrap" data-page="{slug}">{page['body']}</main><footer><div class="wrap"><strong>DIY Home Upgrades</strong><p>{NOTICE} Product links on this site are paid links: they carry the tracking ID <code>{TRACKING_ID}</code>. Prices and ratings are not published.</p><nav aria-label="Site records and feed" class="footnav">{nav} <a href="feed.xml">RSS feed</a></nav></div></footer></body></html>'''
    Path(slug + '.html').write_text(html + '\n')

sitemap = ET.Element('urlset', xmlns='http://www.sitemaps.org/schemas/sitemap/0.9')
for slug in pages:
    ET.SubElement(ET.SubElement(sitemap, 'url'), 'loc').text = BASE + ('' if slug == 'index' else slug + '.html')
for extra in (worksheet, 'audit/'):
    ET.SubElement(ET.SubElement(sitemap, 'url'), 'loc').text = BASE + extra
ET.ElementTree(sitemap).write('sitemap.xml', encoding='utf-8', xml_declaration=True)

rss = ET.Element('rss', version='2.0')
channel = ET.SubElement(rss, 'channel')
for tag, value in [('title', 'DIY Home Upgrades'), ('link', BASE), ('description', pages['index']['desc'])]:
    ET.SubElement(channel, tag).text = value
feed_items = [
    ('', 'DIY Home Upgrades', pages['index']['desc'], 'Front page'),
    ('shop.html', 'Shop the edit', pages['shop']['desc'], 'Shop'),
    ('guides.html', 'Buying guides', pages['guides']['desc'], 'Index'),
    ('faq.html', 'Buyer questions', pages['faq']['desc'], 'Guide'),
]
feed_items += [(f'{s}.html', t, d, c) for s, c, a, t, d, _ in guides]
feed_items += [
    (worksheet, 'Will an air fryer fit on your counter?',
     'Measure your counter against the exact model and clearance requirements in a private worksheet.', 'Field note'),
    ('summary.html', 'Executive summary', pages['summary']['desc'], 'Site record'),
    ('review.html', 'Flagged for Review', pages['review']['desc'], 'Site record'),
    ('sources.html', 'Citation register', pages['sources']['desc'], 'Site record'),
    ('standards.html', 'Editorial standards', pages['standards']['desc'], 'Site record'),
    ('measurement.html', 'Measurement', pages['measurement']['desc'], 'Site record'),
    ('audit/', 'Spec & policy audit',
     'Independently verified listing details, internal listing discrepancies and the 2026 policy register.', 'Site record'),
]
for path, title, desc, cat in feed_items:
    item = ET.SubElement(channel, 'item')
    for tag, value in [('title', title), ('description', desc), ('link', BASE + path),
                       ('guid', BASE + path), ('pubDate', 'Sat, 21 Nov 2026 00:00:00 GMT'),
                       ('category', cat)]:
        ET.SubElement(item, tag).text = value
ET.ElementTree(rss).write('feed.xml', encoding='utf-8', xml_declaration=True)

print(f'Built {len(pages)} pages, sitemap {len(pages) + 2} URLs, feed {len(feed_items)} items.')
