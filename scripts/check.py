from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit
import xml.etree.ElementTree as ET

class Check(HTMLParser):
    def handle_starttag(self, tag, attributes):
        a = dict(attributes)
        for attr in ('href','src'):
            if attr not in a:
                continue
            url = urlsplit(a[attr])
            if not url.scheme and not url.netloc and url.path:
                assert Path(url.path).exists(), (file, a[attr])
            if url.hostname == 'www.amazon.com' and url.path.startswith('/dp/'):
                assert 'sponsored' in a.get('rel','').split()
                assert not url.query

for file in Path('.').glob('*.html'):
    text = file.read_text()
    assert text.count('As an Amazon Associate I earn from qualifying purchases.') == 2
    Check().feed(text)
for file in ('sitemap.xml','feed.xml'):
    ET.parse(file)
print('Local links, disclosure, Amazon reference markup and XML checks passed.')
