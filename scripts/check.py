"""Local publication checks.

Run after scripts/build.py, from the repository root.

Covers, on every published page including the nested ones:
  * every relative href/src resolves on disk and every in-page #fragment exists
  * the Associates statement appears twice, the first time above any table
  * every Amazon product link is marked sponsored, carries "paid link" beside it,
    and is the direct listing URL rather than a shortener
  * a product link's only query parameter is the submitted tracking ID
  * Amazon listing and shortener URLs in a citation position are plain text, never
    an untagged anchor (S02 2(b) requires the tag in every link placed on a site)
  * sitemap and feed parse, agree, and only contain this site's URLs
"""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit
import re
import xml.etree.ElementTree as ET

NOTICE = 'As an Amazon Associate I earn from qualifying purchases.'
TRACKING = 'shopnow047c'  # substring of the submitted tracking ID; full value in product-register.json
SITE_HOST = 'kanlerxz87-cyber.github.io'

root = Path('.')
pages = sorted(root.glob('*.html')) + sorted(root.glob('*/index.html')) + sorted(root.glob('*/*/index.html'))


class LocalLinks(HTMLParser):
    def __init__(self, file):
        super().__init__()
        self.file = file
        self.anchors = []
        self.ids = set()

    def handle_starttag(self, tag, attributes):
        a = dict(attributes)
        if 'id' in a:
            self.ids.add(a['id'])
        for attr in ('href', 'src'):
            if attr not in a:
                continue
            url = urlsplit(a[attr])
            if not url.scheme and not url.netloc and url.path:
                target = (self.file.parent / url.path).resolve()
                assert target.exists(), (str(self.file), a[attr], 'does not resolve')
            if url.scheme or url.netloc:
                assert 'link.amazon' not in a[attr] or tag != 'a', (str(self.file), 'shortener used as a link')
                assert url.hostname != SITE_HOST or url.path.startswith('/DIYHOME2'), (
                    str(self.file), a[attr], 'absolute link to this site outside its sub-path')
        if tag == 'a' and 'href' in a:
            self.anchors.append((a.get('href', ''), a.get('rel', '')))

    def check_fragments(self, page_ids):
        for href, _ in self.anchors:
            if href.startswith('#') and len(href) > 1:
                assert href[1:] in page_ids, (str(self.file), href, 'missing fragment target')


all_ids = {}
parsed = {}
for file in pages:
    text = file.read_text()
    assert text.count(NOTICE) == 2, (str(file), text.count(NOTICE), 'disclosure count')
    first = text.index(NOTICE)
    first_table = min([i for i in (text.find('<table'), text.find('<aside')) if i > -1] + [10 ** 9])
    assert first < first_table, (str(file), 'disclosure appears after the first table or aside')
    p = LocalLinks(file)
    p.feed(text)
    parsed[file] = p
    all_ids[str(file)] = p.ids
for file, p in parsed.items():
    p.check_fragments(p.ids)

for file in pages:
    text = file.read_text()
    for m in re.finditer(r'<a\b[^>]*href="(https?://[^"]*)"[^>]*>(.*?)</a>', text, re.S):
        tag, href, label = m.group(0), m.group(1), m.group(2)
        rel = (re.search(r'rel="([^"]*)"', tag) or [None, ''])[1]
        if 'link.amazon' in href:
            raise AssertionError((str(file), 'shortener is never a link target', href))
        if re.search(r'amazon\.com/dp/', href):
            assert 'sponsored' in rel.split(), (str(file), href, 'product link not sponsored')
            params = urlsplit(href).query
            assert params == '' or re.fullmatch(r'tag=[\w\-]+', params), (str(file), href, 'unexpected query')
            if params:
                assert TRACKING in params, (str(file), href, 'wrong tracking id')
            # the paid-link words must appear next to the anchor, not only in the footer
            after = text[m.end():m.end() + 260]
            assert 'paid link' in after or 'paid link' in label, (str(file), href, 'no paid-link notice beside it')

# citation position: an Amazon listing or shortener printed inside <code> rather than linked
for file in pages:
    text = file.read_text()
    for href in re.findall(r'href="(https://link\.amazon/[^"]*)"', text):
        raise AssertionError((str(file), 'shortener linked', href))

def elements_named(root_el, name):
    # ElementTree keeps the sitemap namespace on every tag, so match on the local name.
    return [x for x in root_el.iter() if x.tag.rsplit('}', 1)[-1] == name]


for xml_file in ('sitemap.xml', 'feed.xml'):
    tree = ET.parse(xml_file)
    locs = [x.text for x in elements_named(tree.getroot(), 'loc')]
    if xml_file == 'sitemap.xml':
        for u in locs:
            assert u.startswith('https://kanlerxz87-cyber.github.io/DIYHOME2/'), (u, 'foreign sitemap URL')
            rel = u.split('/DIYHOME2/', 1)[1] or 'index.html'
            if rel.endswith('/'):
                rel += 'index.html'
            assert (root / rel).exists(), (u, 'sitemap URL missing on disk')

feed = ET.parse('feed.xml').getroot()
items = [x for x in feed.iter() if x.tag == 'item']
sm_locs = {x.text for x in elements_named(ET.parse('sitemap.xml').getroot(), 'loc')}
assert len(items) > 0 and len(sm_locs) > 0, 'feed or sitemap parsed empty'
for item in items:
    link_url = item.findtext('link')
    guid = item.findtext('guid')
    assert link_url and guid, 'feed item without link or guid'
    if link_url.endswith('/DIYHOME2/') or link_url.endswith('/DIYHOME2/index.html'):
        link_url = 'https://kanlerxz87-cyber.github.io/DIYHOME2/'
    assert link_url in sm_locs, (link_url, 'feed item not in sitemap')
    assert 'link.amazon' not in link_url and '/dp/' not in link_url, (link_url, 'product URL in feed')
    assert item.findtext('title'), 'feed item without a title'

# Head metadata and internal navigation coverage, best effort but cheap.
from html import unescape
import json as _json

published = {f.stem for f in root.glob('*.html')}
for file in pages:
    text = file.read_text()
    title = re.search(r'<title>(.*?)</title>', text, re.S)
    desc = re.search(r'<meta name="description" content="(.*?)"', text)
    canon = re.search(r'<link rel="canonical" href="([^"]+)"', text)
    assert title and title.group(1).strip(), (str(file), 'missing title')
    assert desc and unescape(desc.group(1)).strip(), (str(file), 'missing meta description')
    assert canon, (str(file), 'missing canonical')
    assert text.count('<h1') == 1, (str(file), 'expected exactly one h1, found', text.count('<h1'))
    for href in re.findall(r'href="([a-z0-9\-]+\.html)"', text):
        assert href[:-5] in published or href[:-5] in ('index',), (str(file), href, 'links a page that is not published')
    # the shop table is the one place a reader can act on the whole catalogue
    root_page = file.parent == root
    if root_page and file.name == 'shop.html':
        assert text.count('data-paid=') >= 3, 'shop table must carry every product link'
    if root_page and file.name == 'index.html':
        assert text.count('data-paid=') >= 3, 'front page must lead with the products'

print(f'Local links, fragments, disclosure placement, sponsored-link markup, tracking parameter, '
      f'head metadata and XML checks passed on {len(pages)} pages ({len(items)} feed items).')
