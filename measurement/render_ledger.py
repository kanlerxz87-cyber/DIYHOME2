"""Run after an authorized report import. Reject unsourced values before rendering."""
import csv
import re
from datetime import datetime
from html import escape
from pathlib import Path
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parent
FIELDS = 'timestamp source channel eligible_sessions clicks reported_orders provenance'.split()

def render(source):
    reader = csv.DictReader(source)
    if reader.fieldnames != FIELDS:
        raise ValueError('Unexpected report schema')
    rows = []
    for n, record in enumerate(reader,2):
        date = datetime.fromisoformat(record['timestamp'].replace('Z','+00:00'))
        url = urlsplit(record['source'])
        if date.utcoffset() is None or date.utcoffset().total_seconds() or url.scheme != 'https' or url.hostname != 'affiliate-program.amazon.com' or url.username or url.password or url.query or not record['channel'] or not record['provenance']:
            raise ValueError(f'Row {n}: UTC timestamp, official public source and provenance required')
        for key in FIELDS[3:6]:
            if record[key] and not re.fullmatch('[0-9]+',record[key]):
                raise ValueError(f'Row {n}: invalid {key}')
        cells = [escape(record['timestamp']), f'<a href="{escape(record["source"])}">{escape(record["provenance"])}</a>', *[escape(record[key]) for key in FIELDS[2:6]]]
        rows.append('<tr>'+''.join('<td>'+cell+'</td>' for cell in cells)+'</tr>')
    return ''.join(rows)

if __name__ == '__main__':
    with (ROOT.parent / 'campaign-ledger.csv').open(newline='') as f:
        rows = render(f)
    p = ROOT/'index.html'
    html = re.sub(r'<tbody id="rows">.*?</tbody>',lambda _:f'<tbody id="rows">{rows}</tbody>',p.read_text(),flags=re.S)
    p.write_text(re.sub(r'(<p class="empty" id="ledger-status">).*?(</p>)',lambda m:m[1]+('Source: authorized first-party reports.' if rows else 'No reports recorded. No conversion rate or revenue forecast.')+m[2],html))
