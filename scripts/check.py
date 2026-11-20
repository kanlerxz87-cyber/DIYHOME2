from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit
from xml.etree import ElementTree as ET


class Check(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = set()
        self.refs = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if 'id' in attrs:
            assert attrs['id'] not in self.ids
            self.ids.add(attrs['id'])
        for key in ('href','src'):
            if key in attrs:
                url = urlsplit(attrs[key])
                if not url.netloc:
                    self.refs.append(url)
                elif url.hostname == 'link.amazon' or (url.hostname == 'www.amazon.com' and url.path.startswith('/dp/')):
                    assert 'sponsored' in attrs.get('rel','').split(), attrs


parsed = {}
for file in Path('.').glob('*.html'):
    text = file.read_text()
    assert text.count('As an Amazon Associate I earn from qualifying purchases.') == 2, file
    assert text.count('rel="canonical"') == 1, file
    assert '?tag=' not in text, file
    parser = parsed[file.name] = Check()
    parser.feed(text)
for file, parser in parsed.items():
    for url in parser.refs:
        target = url.path or file
        assert Path(target).is_file(), (file,url)
        if url.fragment:
            assert url.fragment in parsed[target].ids, (file,url)
for feed in ('feed.xml','sitemap.xml'):
    root = ET.parse(feed).getroot()
    for node in root.findall('.//link') + root.findall('.//{*}loc'):
        assert (node.text.rsplit('/',1)[-1] or 'index.html') in parsed
assert len(parsed) == 9
print('Checked nine pages, internal links, disclosures, sponsored links, sitemap and RSS.')
