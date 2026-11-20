"""Aggregate-only collector. Run behind HTTPS; do not enable proxy access logs."""
import hmac
import json
import os
import sqlite3
from datetime import date, datetime, timezone
from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path

EVENTS = {'page_view', 'guide_view', 'outbound_click', 'rss_click'}
PAGES = {p.name for p in Path(__file__).resolve().parent.parent.glob('*.html')}
DB = os.environ.get('METRICS_DB', 'metrics.sqlite3')
ORIGIN = os.environ.get('SITE_ORIGIN', 'https://kanlerxz87-cyber.github.io')

def store(day, event, page, count):
    with sqlite3.connect(DB) as db:
        db.execute('CREATE TABLE IF NOT EXISTS totals(day TEXT,event TEXT,page TEXT,count INTEGER,PRIMARY KEY(day,event,page))')
        db.execute('INSERT INTO totals VALUES(?,?,?,?) ON CONFLICT(day,event,page) DO UPDATE SET count=count+excluded.count', (day,event,page,count))

class Handler(BaseHTTPRequestHandler):
    def log_message(self, *_): pass

    def reply(self, status, cors=False):
        self.send_response(status)
        if cors:
            self.send_header('Access-Control-Allow-Origin', ORIGIN)
            self.send_header('Vary', 'Origin')
        self.end_headers()

    def do_POST(self):
        public = self.path == '/events' and self.headers.get('Origin') == ORIGIN
        token = os.environ.get('REPORT_TOKEN')
        report = self.path == '/reports' and token and hmac.compare_digest(self.headers.get('Authorization','').encode(), ('Bearer '+token).encode())
        if not (public or report):
            return self.reply(403)
        try:
            size = int(self.headers.get('Content-Length', '0'))
            if not 0 < size <= 512: raise ValueError
            data = json.loads(self.rfile.read(size))
            if public:
                if set(data) != {'event','page'} or data['event'] not in EVENTS or data['page'] not in PAGES: raise ValueError
                store(datetime.now(timezone.utc).date().isoformat(), data['event'], data['page'], 1)
            else:
                if set(data) != {'date','count'} or type(data['count']) is not int or not 0 < data['count'] <= 1000000: raise ValueError
                day = date.fromisoformat(data['date'])
                if day > datetime.now(timezone.utc).date(): raise ValueError
                store(day.isoformat(), 'reported_order', '', data['count'])
        except (ValueError, TypeError, UnicodeError):
            return self.reply(400, public)
        self.reply(204, public)

if __name__ == '__main__':
    HTTPServer(('0.0.0.0', int(os.environ.get('PORT', '8080'))), Handler).serve_forever()
