from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit
import xml.etree.ElementTree as ET
import json

class Check(HTMLParser):
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        for name in ('src','href'):
            if name not in attrs: continue
            url = urlsplit(attrs[name]); target = url.path
            if not url.netloc and target: assert Path(target).is_file(), target
            if url.netloc == 'www.amazon.com' and target.startswith('/dp/'):
                assert 'sponsored' in attrs.get('rel','').split()
for path in Path('.').glob('*.html'):
    text = path.read_text()
    assert text.count('As an Amazon Associate I earn from qualifying purchases.') == 2
    Check().feed(text)
for file in ('feed.xml','sitemap.xml'):
    for el in ET.parse(file).iter():
        if el.tag.endswith(('loc','link')):
            assert Path(el.text.split('/DIYHOME2/',1)[1] or 'index.html').is_file()
rows = json.loads(Path('product-register.json').read_text())
assert len(rows) == 4 and rows[1]['submitted'] == rows[2]['submitted']
assert all(r['observed_target'] and not r['intended_asin'] and not r['special_link'] for r in rows)
print('Static pages, product links, register, sitemap and feed passed.')
