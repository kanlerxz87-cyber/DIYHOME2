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
ops = [('review','Flagged for Review'),('summary','Executive summary'),('measurement','Measurement'),('measurement/index','Campaign desk'),('standards','Editorial standards'),('audit/index','Spec & policy audit')]
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
add('guides','Buying guides','Buyer checklists for kitchen storage, walls and countertop appliances.',intro('The buying desk','Buying guides','Start with a question, then check the details that matter in your home.')+cards(guides)+worksheet_card)
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

register = []
for n,(short,asin,name,note) in enumerate(rows,1):
    register.append((f'{n:02}',f'<code>https://link.amazon/{short}</code>', e(name),source('https://www.amazon.com/dp/'+asin,asin,True),DATE,'','','','',note+'Unverified intent and tracking.'))
add('review','Flagged for Review','Product intent and observed redirect evidence.',intro('Site records','Flagged for Review','Blank fields have not been verified. A redirect observation is not product intent or a tracking test.')+table(['Entry','Submitted URL','Observed listing title (shortened)','Observed target · Amazon source','Observed date','Intended ASIN','Intended official listing','Confirmation date','Confirmation source','Status'],register)+f'<p>Selected tracking ID: <code>shopnow047c-20</code> (submitted, not validated). The short links’ compliance is unresolved; they are not declared invalid. See {source(AMAZON,"Amazon’s Special Link requirements")}.</p>')
add('summary','Executive summary','Launch scope, findings, and next decisions.',intro('Site records','Executive summary','A buyer-first publication with a separate evidence register.')+f'''<div class="prose"><h2>What the evidence supports</h2><p>Four submissions represent three distinct short URLs. The observed destinations were a wallpaper smoothing kit, a paper towel holder and a cookware organizer, not air fryers. The air fryer guide is a separate editorial topic, not a claim about the submitted items.</p><h2>What remains unknown</h2><p>The intended products, tracking ownership, live commission eligibility and report attribution remain unverified. No conversion score, revenue forecast, price or review figure is published.</p><h2>Next decision</h2><p>Verify one Special Link per product in the enrolled workflow before scaling. Once authorized reporting is available, use measured queries and buyer engagement to choose the next guide. See {link('review','the evidence register')} and {link('measurement','measurement status')}.</p></div>''')
add('standards','Editorial standards','How guides are written, checked and published.',intro('Site records','Editorial standards','By the DIY Home Upgrades editorial desk. Buying checklists, not hands-on reviews.')+f'''<div class="prose"><h2>Publication gate</h2><p>Confirm product intent against an official listing and save the date and source separately from the redirect. Generate a Special Link through enrolled Associates tools, then verify the destination and authorized tracking report before publishing it. Keep a paid-link notice next to each approved link and the Associates notice on every page.</p><p>Review {source(AMAZON,'the Operating Agreement')}, {source('https://affiliate-program.amazon.com/help/operating/policies','Amazon’s Program Policies')} and {source(FTC,'FTC endorsement guidance')} before publishing. Do not scrape Amazon or use product images, ratings, prices or API content without confirming rights, sourcing and freshness requirements. The masthead photograph is AI-generated editorial imagery, not a product depiction.</p><h2>Publishing rhythm</h2><p>Proposed: one question-led guide every two weeks, with a monthly evidence and link review. Start with walls and kitchen storage; revisit seasonal topics only when they fit reader needs. Every new entry in the guide register updates the sitemap and RSS feed on build.</p></div>''')
add('measurement','Measurement','Campaign ledger and analytics status.',intro('Site records','Measurement','No campaign results have been imported.')+table(['Timestamp','Authorized source','Channel','Eligible sessions','Clicks','Reported orders'],[])+f'''<div class="prose"><p>The ledger is empty, not zero. Import only aggregate figures from authorized first-party reports and retain a dated provenance trail. Use {source('https://affiliate-program.amazon.com/','Associates Central')} for reported orders; outbound clicks are not conversions.</p><p>Production telemetry is not connected. GitHub Pages cannot execute the optional collector. Search Console ownership has not been verified; the sitemap is available for submission. Reader subscriptions use RSS without collecting email addresses.</p></div>''')

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
for path,title,desc in [(worksheet,worksheet_title,worksheet_desc)]+[(s+'.html',t,d) for s,_,t,d,_ in guides]:
    item=ET.SubElement(channel,'item')
    for tag,value in [('title',title),('description',desc),('link',BASE+path),('guid',BASE+path),('pubDate','Fri, 20 Nov 2026 00:00:00 GMT')]:
        ET.SubElement(item,tag).text=value
ET.ElementTree(rss).write('feed.xml',encoding='utf-8',xml_declaration=True)
