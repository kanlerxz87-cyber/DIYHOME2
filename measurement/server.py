"""Same-origin, aggregate-only counter and static desk. Python 3.10+, stdlib only."""
import json
import os
import sqlite3
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit

ROOT = Path(__file__).parent
DB = os.getenv('COUNTER_DB', '/tmp/diyhome-counter.sqlite')
EVENTS = ('page_view', 'guide_open', 'comparison_open', 'outbound_click', 'feed_open')
ASSETS = {'index.html': 'text/html', 'desk.css': 'text/css', 'desk.js': 'text/javascript', 'counter.js': 'text/javascript', 'campaign.csv': 'text/csv', 'media/studio.jpg': 'image/jpeg'}


def connect():
    db = sqlite3.connect(DB)
    db.execute('CREATE TABLE IF NOT EXISTS counts(day TEXT, event TEXT, n INTEGER, PRIMARY KEY(day,event))')
    return db


class Handler(BaseHTTPRequestHandler):
    def log_message(self, *args):
        pass  # Never write addresses, request paths, referrers or user agents.

    def send(self, status, data=b'', mime='application/json'):
        self.send_response(status)
        self.send_header('Content-Type', mime)
        self.send_header('Content-Length', str(len(data)))
        self.send_header('Referrer-Policy', 'no-referrer')
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.send_header('Cache-Control', 'no-store')
        self.end_headers()
        self.wfile.write(data)

    def do_GET(self):
        path = self.path.removeprefix('/measurement/').lstrip('/') or 'index.html'
        if path == 'api/summary':
            with connect() as db:
                counts = dict(db.execute('SELECT event,sum(n) FROM counts GROUP BY event'))
            return self.send(200, json.dumps({'events': counts}).encode())
        if path in ASSETS:
            return self.send(200, (ROOT / path).read_bytes(), ASSETS[path])
        self.send(404)

    def do_POST(self):
        if self.path not in ('/api/event', '/measurement/api/event'):
            return self.send(404)
        if urlsplit(self.headers.get('Origin', '')).netloc != self.headers.get('Host'):
            return self.send(403)
        if self.headers.get('DNT') == '1' or self.headers.get('Sec-GPC') == '1':
            return self.send(204)
        try:
            size = int(self.headers.get('Content-Length', '0'))
            if not 0 < size <= 64 or self.headers.get_content_type() != 'application/json':
                return self.send(400)
            payload = json.loads(self.rfile.read(size))
            if not isinstance(payload, dict) or set(payload) != {'event'} or payload['event'] not in EVENTS:
                return self.send(400)
        except (ValueError, UnicodeError):
            return self.send(400)
        with connect() as db:
            db.execute('INSERT INTO counts VALUES(?,?,1) ON CONFLICT(day,event) DO UPDATE SET n=n+1', (datetime.now(timezone.utc).date().isoformat(), payload['event']))
        self.send(204)


if __name__ == '__main__':
    ThreadingHTTPServer(('0.0.0.0', int(os.getenv('PORT', '8080'))), Handler).serve_forever()
