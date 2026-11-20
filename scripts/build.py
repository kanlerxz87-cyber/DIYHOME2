from pathlib import Path
from html import escape as e
from xml.etree import ElementTree as ET

ROOT = 'https://kanlerxz87-cyber.github.io/DIYHOME2/'
AMZ = 'https://affiliate-program.amazon.com/help/operating/agreement'
POL = 'https://affiliate-program.amazon.com/help/operating/policies'
FTC = 'https://www.ftc.gov/business-guidance/resources/disclosures-101-social-media-influencers'
REPORT = 'https://affiliate-program.amazon.com/home/reports'
DATE = '2026-11-20'
DISC = 'As an Amazon Associate I earn from qualifying purchases.'
items = [
 ('walls','01','WALLS & FINISHES','Wallpaper smoothing kit','B08FKW9JRM','B0hmGG4m2','A small toolkit to consider before tackling a peel-and-stick wall.','How do you smooth peel-and-stick wallpaper?','Before you commit to a whole wall, use an offcut to check how the paper handles. Compare the edge of the smoothing tool with the finish of your wallpaper. Check the wallpaper maker’s instructions for which tools and surfaces are compatible.'),
 ('counter','02','COUNTER SPACE','Under-cabinet paper towel holder','B0BSKQW2T2','B03QDuGdo','Move the paper towel roll off the worktop and keep it within reach.','Will an under-cabinet towel holder fit?','Measure a full roll, not just the cardboard core. Mock up the holder with tape and check whether the roll can slide on without hitting a wall. Compare adhesive and screw mounting against the cabinet maker’s instructions; check cabinet thickness before drilling.'),
 ('cabinet','03','KITCHEN STORAGE','Adjustable pan organizer','B08DY9HRWD','B0hpD2JGQ','Give frequently used pans a spot you can reach without unstacking them.','How do you choose a pan organizer?','Measure the widest pan including handles, the shelf depth, and the opening between the hinges. Check the listing’s configuration and load limits against your heaviest pan. Leave enough room to lift cookware out without moving the rack.')]

def link(url, text, product=False):
    return f'<a href="{e(url, quote=True)}"'+ (' rel="sponsored noopener"' if product else '') + f'>{e(text)}</a>'

def listing(asin):
    return f'https://www.amazon.com/dp/{asin}'

pages = {}
def page(path,title,desc,body):
    pages[path] = (title,desc,body)

cards = ''.join(f'''<article class="card"><a href="{slug}.html"><img src="site/{slug}.jpg" alt="Illustration of {e(name.lower())}" width="600" height="400"></a><div class="cardbody"><div class="eyebrow"><span>{num} /</span> {cat}</div><h3>{name}</h3><p>{desc}</p><a class="textlink" href="{slug}.html">Explore upgrade <span>↗</span></a></div></article>''' for slug,num,cat,name,asin,short,desc,q,advice in items)
page('index.html','Small upgrades. Better everyday.','Practical upgrades and buying guides for your walls, counters, and cabinets.',f'''
<section class="hero"><img src="site/hero.jpg" alt="Illustrative olive-green kitchen with warm oak counters" fetchpriority="high"><div class="herocopy"><div class="eyebrow">THE PRACTICAL HOME JOURNAL <span>—</span> VOL. 01</div><h1>Small upgrades.<br><em>Better everyday.</em></h1><p>Thoughtful finds for the places you use most.<br>Start with the walls, counters, and cabinets.</p><a class="button" href="#edits">Explore the edit <span>↘</span></a></div></section>
<section class="section" id="edits"><div class="sectionhead"><div><div class="eyebrow green">01 / THE HOME EDIT</div><h2>Three places to start.</h2></div><a class="textlink" href="guides.html">Browse all guides ↗</a></div><div class="grid">{cards}</div></section>
<section class="note"><div class="eyebrow">02 / THE WEEKEND PROJECT</div><h2>Make room for what you use.</h2><p>Before buying another organizer, take out the pans you reach for every week. Fit the cabinet around those first.</p><a class="textlink" href="cabinet.html">Read the cabinet guide ↗</a></section>''')
for slug,num,cat,name,asin,short,desc,q,advice in items:
    page(f'{slug}.html',q,desc,f'''<article class="reading"><div class="eyebrow green">{cat} / BUYING GUIDE</div><h1>{q}</h1><p class="byline">DIY Home Upgrades editorial desk · November 20, 2026</p><img class="feature" src="site/{slug}.jpg" alt="Category illustration, not a photograph of the listing"><p>{advice}</p><h2>A listing to compare</h2><p>{name}. The submitted link resolved to this listing in our check. It has not been confirmed as the intended product or validated for Associates tracking. This is not a hands-on review.</p><p>{link(listing(asin),'View Amazon listing ↗ (not an affiliate link)',True)}</p><p><small>Images are generated category illustrations. Check current specifications and price on the listing.</small></p><a class="textlink" href="guides.html">All buying guides ↗</a></article>''')
page('guides.html','Buying guides','Question-led guides for practical home upgrades.',f'<section class="section"><div class="eyebrow green">THE READING ROOM</div><h1>Buying guides</h1><div class="grid">{cards}</div></section>')

def table(headers, rows):
    return '<div class="tablewrap"><table><thead><tr>'+''.join(f'<th scope="col">{x}</th>' for x in headers)+'</tr></thead><tbody>'+''.join('<tr>'+''.join(f'<td>{x}</td>' for x in r)+'</tr>' for r in rows)+'</tbody></table></div>'

rows=[]
for i,item in enumerate([items[0],items[1],items[1],items[2]],1):
    slug,num,cat,name,asin,short,*_ = item
    rows.append((str(i),link('https://link.amazon/'+short,short,True),link(listing(asin),asin+' · '+name,True),DATE,'','','','','Unverified'+ (' · duplicate of row 2' if i==3 else '')))
page('register.html','Product register','Submitted links and independently observed Amazon listing destinations.', '<section class="section"><h1>Product register</h1><p>Blank confirmation fields mean no evidence was available. Observations link to the Amazon listing without incidental redirect parameters.</p>'+table(['Row','Submitted source','Observed destination · Amazon','Observation date','Intended ASIN','Official intended listing','Confirmation date','Confirmation source','Intent status'],rows)+'</section>')
flags=[('Duplicate input','Rows 2 and 3 are identical; retained in the register, not duplicated in the shop.',listing(items[1][4])),('Product intent','Three listing destinations observed; intended ASINs unverified.',AMZ),('Special Links','Requested ID shopnow047c-20 is unverified. No link validity judgment or report test was possible.',AMZ),('Air fryer mismatch','None of the observed listings is an air fryer; topic ideas are not evidence of submitted product intent.',listing(items[2][4])),('Product data and AI','No authorized catalog integration, price or review feed, commission validation, or automated profitability ranking.',POL),('Conversions','No authorized report has been imported. Unknown does not mean zero.',REPORT),('Search Console','Ownership and query reporting not confirmed.', 'https://search.google.com/search-console/about'),('Analytics hosting','The companion collector requires a persistent runtime; GitHub Pages serves static files.', 'https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages')]
page('review.html','Flagged for Review','Unverified evidence and operational dependencies.', '<section class="section"><h1>Flagged for Review</h1>'+table(['Item','Finding','Official review source'],[(a,b,link(c,'Open source ↗','amazon.com/dp/' in c)) for a,b,c in flags])+'</section>')
page('summary.html','Executive summary','What was checked, what shipped, and what is still unverified.',f'''<article class="reading"><div class="eyebrow green">PUBLICATION NOTES</div><h1>Executive summary</h1><p>Four inputs yielded three distinct Amazon listing observations: a wallpaper smoothing kit, an under-cabinet towel holder, and an adjustable pan organizer. See the <a href="register.html">product register</a> for the dated observations and blank intent fields.</p><h2>Launch without guessing</h2><p>Publish category advice and clearly labeled source links. Keep affiliate buying links off until intent, enrollment, destination, tracking report, disclosures, and applicable API terms are confirmed. See the {link(AMZ,'Associates Operating Agreement')}, {link(POL,'Program Policies')}, and {link(FTC,'FTC disclosure guidance')}.</p><h2>Editorial cadence</h2><p>Review query and outbound data monthly when available. Aim for one sourced guide per month; first prioritize questions about wall preparation and kitchen storage. Air-fryer topics are hypotheses, not demand findings. Add approved guides to the build manifest so both the sitemap and RSS update together.</p><h2>Measure before scaling</h2><p>Use aggregate reader events and authorized Associates reports separately. No conversion score or revenue forecast is published. <a href="measurement.html">Open the campaign ledger</a> or <a href="review.html">review outstanding evidence</a>.</p></article>''')
page('measurement.html','Campaign ledger','Measurement status and a blank first-party reporting ledger.', '<section class="section"><h1>Campaign ledger</h1><p>No authorized report rows are available. Browser counts are not attributed Amazon orders.</p>'+table(['Timestamp','Source','Channel','Eligible sessions','Clicks','Reported orders'],[])+f'<p>{link(REPORT,"Authorized report source: Associates Central ↗")}</p><h2>Measurement</h2><p>The companion collector supports page views, guide views, product views, outbound clicks, and authorized reported orders. The public Pages site does not send events unless deployed behind the collector. It uses no analytics cookies or browser identifiers.</p><p>Follow the <a href="feed.xml">RSS feed</a> without sharing an email address.</p></section>')

ops = [('summary.html','Executive summary'),('register.html','Product register'),('measurement.html','Campaign ledger'),('review.html','Flagged for Review')]
opslinks = ''.join(link(p,t) for p,t in ops)
for path,(title,desc,body) in pages.items():
    url = ROOT if path == 'index.html' else ROOT+path
    Path(path).write_text(f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>{e(title)} | DIY Home Upgrades</title><meta name="description" content="{e(desc)}"><link rel="canonical" href="{url}"><link rel="alternate" type="application/rss+xml" title="DIY Home Upgrades" href="feed.xml"><link rel="stylesheet" href="site/style.css"><script src="site/events.js" defer></script></head><body data-page="{path[:-5]}"><a class="skip" href="#main">Skip to content</a><header><div class="mast"><a class="brand" href="index.html"><span class="mark" aria-hidden="true">⌂</span><span>DIY Home <em>Upgrades</em><small>THE PRACTICAL HOME JOURNAL</small></span></a><nav aria-label="Main navigation"><a href="index.html#edits">The Edit</a><a href="guides.html">Buying Guides</a><details><summary>Behind the site</summary><div>{opslinks}</div></details></nav></div></header><aside class="disclosure" aria-label="Affiliate disclosure"><strong>AFFILIATE DISCLOSURE</strong> <span>{DISC}</span></aside><main id="main">{body}</main><footer><div><strong>DIY Home Upgrades</strong><p>{DISC}</p></div><nav aria-label="Site records">{opslinks}<a href="feed.xml">RSS</a></nav></footer></body></html>''',encoding='utf-8')
ns='http://www.sitemaps.org/schemas/sitemap/0.9'
sitemap=ET.Element('urlset',xmlns=ns)
for path in pages:
    ET.SubElement(ET.SubElement(sitemap,'url'),'loc').text=ROOT+('' if path=='index.html' else path)
ET.ElementTree(sitemap).write('sitemap.xml',encoding='utf-8',xml_declaration=True)
rss=ET.Element('rss',version='2.0'); channel=ET.SubElement(rss,'channel')
for key,value in [('title','DIY Home Upgrades'),('link',ROOT),('description','Question-led guides for practical home upgrades.')]: ET.SubElement(channel,key).text=value
for slug,*_ in items:
    item=ET.SubElement(channel,'item'); title,desc,_=pages[slug+'.html']
    for key,value in [('title',title),('link',ROOT+slug+'.html'),('guid',ROOT+slug+'.html'),('description',DISC+' '+desc),('pubDate','Fri, 20 Nov 2026 00:00:00 GMT')]: ET.SubElement(item,key).text=value
ET.ElementTree(rss).write('feed.xml',encoding='utf-8',xml_declaration=True)
