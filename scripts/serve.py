"""Optional aggregate collector; serve behind an HTTPS reverse proxy in production."""
import argparse
import datetime as dt
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import json
from pathlib import Path
import sqlite3
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]
PAGES = {p.stem for p in ROOT.glob('*.html')}
ASSETS = {f'/site/{p.name}':p for p in (ROOT/'site').iterdir() if p.suffix in {'.css','.js','.jpg'}}
FILES = {f'/{p}.html':ROOT/f'{p}.html' for p in PAGES} | ASSETS | {'/':ROOT/'index.html', '/feed.xml':ROOT/'feed.xml', '/sitemap.xml':ROOT/'sitemap.xml'}
EVENTS = {'page_view','guide_view','product_view','outbound_click'}


def increment(db, day, event, page, count=1):
    with sqlite3.connect(db) as conn:
        conn.execute('CREATE TABLE IF NOT EXISTS counts(day TEXT,event TEXT,page TEXT,count INTEGER,PRIMARY KEY(day,event,page))')
        conn.execute('INSERT INTO counts VALUES(?,?,?,?) ON CONFLICT(day,event,page) DO UPDATE SET count=count+excluded.count', (day,event,page,count))


def record_report(db, path):
    """Import one normalized, authorized report row. Source is a private report ID."""
    row = json.loads(Path(path).read_text())
    fields = ('timestamp','source','channel','eligible_sessions','clicks','reported_orders')
    if set(row) != set(fields):
        raise ValueError('Report schema mismatch')
    stamp = dt.datetime.fromisoformat(row['timestamp'])
    if stamp.utcoffset() is None or not all(isinstance(row[k],str) and row[k].strip() for k in fields[1:3]):
        raise ValueError('Dated provenance is required')
    for key in fields[3:]:
        value = row[key]
        if value is not None and (type(value) is not int or value < 0):
            raise ValueError('Metrics must be nonnegative integers or null')
    with sqlite3.connect(db) as conn:
        conn.execute('CREATE TABLE IF NOT EXISTS reports(timestamp TEXT,source TEXT,channel TEXT,eligible_sessions INTEGER,clicks INTEGER,reported_orders INTEGER, UNIQUE(source,channel))')
        conn.execute('INSERT INTO reports VALUES(?,?,?,?,?,?)', tuple(row[k] for k in fields))


class Handler(BaseHTTPRequestHandler):
    def log_message(self, *_):
        pass

    def reply(self, code, data=b'', mime='text/plain'):
        self.send_response(code)
        self.send_header('Content-Type', mime)
        self.send_header('Content-Length', str(len(data)))
        self.send_header('Cache-Control', 'no-store')
        self.send_header('X-Content-Type-Options','nosniff')
        self.end_headers()
        self.wfile.write(data)

    def route(self):
        path = urlsplit(self.path).path
        return path.removeprefix('/DIYHOME2') if path.startswith('/DIYHOME2/') else path

    def do_GET(self):
        path = self.route()
        if path == '/_events':
            return self.reply(200,b'aggregate-events-v1')
        if path not in FILES:
            return self.reply(404)
        file = FILES[path]
        mime = {'.html':'text/html; charset=utf-8','.xml':'application/xml','.css':'text/css','.js':'text/javascript','.jpg':'image/jpeg'}[file.suffix]
        self.reply(200,file.read_bytes(),mime)

    def do_POST(self):
        if self.route() != '/_events':
            return self.reply(404)
        if self.headers.get('Sec-Fetch-Site') not in ('same-origin', None):
            return self.reply(403)
        if self.headers.get('Sec-GPC') == '1' or self.headers.get('DNT') == '1':
            return self.reply(204)
        if self.headers.get_content_type() != 'application/json':
            return self.reply(415)
        try:
            size = int(self.headers.get('Content-Length', '0'))
            if not 0 < size <= 256:
                return self.reply(413)
            payload = json.loads(self.rfile.read(size))
            event, page = payload['event'],payload['page']
            if set(payload) != {'event','page'} or event not in EVENTS or page not in PAGES:
                return self.reply(400)
        except (ValueError, TypeError, KeyError):
            return self.reply(400)
        increment(self.server.db, dt.datetime.now(dt.timezone.utc).date().isoformat(), event, page)
        self.reply(204)


if __name__ == '__main__':
    cli = argparse.ArgumentParser()
    cli.add_argument('--port',type=int,default=8000)
    cli.add_argument('--db',default='analytics.sqlite3')
    cli.add_argument('--bind',default='0.0.0.0')
    cli.add_argument('--authorized-report', help='Import a private normalized report JSON and exit')
    args = cli.parse_args()
    if args.authorized_report:
        record_report(args.db, args.authorized_report)
        raise SystemExit(0)
    server = ThreadingHTTPServer((args.bind,args.port), Handler)
    server.db = args.db
    server.serve_forever()
