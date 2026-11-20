#!/usr/bin/env python3
"""Static checks for docs/: internal hrefs/srcs resolve to files; anchors exist."""
import re, sys, pathlib, html.parser, urllib.parse

OUT = pathlib.Path(__file__).resolve().parent.parent  # site at repo root
errors, files = [], list(OUT.rglob("*.html"))

class LinkParser(html.parser.HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.refs = []
        self.ids = set()
    def handle_starttag(self, tag, attrs):
        d = dict(attrs)
        if "id" in d: self.ids.add(d["id"])
        for attr in ("href", "src"):
            v = d.get(attr)
            if v: self.refs.append((attr, v))

parsed = {}
for f in files:
    p = LinkParser(); p.feed(f.read_text(encoding="utf-8")); parsed[f] = p

for f, p in parsed.items():
    for attr, ref in p.refs:
        if ref.startswith(("http://", "https://", "mailto:", "tel:", "data:")):
            continue
        path_part, _, frag = ref.partition("#")
        if not path_part:
            target = f
        else:
            target = (f.parent / urllib.parse.unquote(path_part)).resolve()
            try:
                target.relative_to(OUT.resolve())
            except ValueError:
                errors.append(f"{f.relative_to(OUT)}: escapes site root: {ref}"); continue
            if not target.exists():
                errors.append(f"{f.relative_to(OUT)}: missing {attr} target: {ref}"); continue
        if frag and target.suffix == ".html":
            ids = parsed.get(target, LinkParser()).ids if target in parsed else None
            if ids is None:
                tp = LinkParser(); tp.feed(target.read_text(encoding="utf-8")); ids = tp.ids
            if frag not in ids:
                errors.append(f"{f.relative_to(OUT)}: missing anchor #{frag} in {target.relative_to(OUT)}")

# XML sanity for feed and sitemap
import xml.etree.ElementTree as ET
for name in ("feed.xml", "sitemap.xml"):
    try: ET.parse(OUT / name)
    except Exception as e: errors.append(f"{name}: XML error: {e}")

if errors:
    print("LINK/XML CHECK FAILED"); [print(" -", e) for e in errors]; sys.exit(1)
print(f"OK: {len(files)} HTML files, feed.xml and sitemap.xml well-formed, all internal links/anchors resolve.")
