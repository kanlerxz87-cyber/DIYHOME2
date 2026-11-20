"""Optional same-origin aggregate collector; deploy behind HTTPS in production."""
import json
import os
import sqlite3
from contextlib import closing
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]
DB = os.getenv('METRICS_DB', '/tmp/diyhome-metrics.sqlite3')
EVENTS = {'page_view','guide_view','affiliate_click','listing_reference_click','feed_click'}
PAGES = {p.stem for p in ROOT.glob('*.html')}
FILES = {'/': ROOT/'index.html', **{'/'+p.name:p for p in ROOT.glob('*.html')}}
FILES.update({'/'+p: ROOT/p for p in ('feed.xml','sitemap.xml','assets/style.css','assets/metrics.js','assets/hero.jpg')})
TYPES = {'.html':'text/html; charset=utf-8','.xml':'application/xml','.jpg':'image/jpeg','.css':'text/css','.js':'text/javascript'}
ENABLED = bool(os.getenv('METRICS_ORIGIN'))

class Handler(BaseHTTPRequestHandler):
    def log_message(self, *_):
        pass

    def reply(self, code, body=b'', mime='text/plain'):
        self.send_response(code)
        self.send_header('Content-Type', mime)
        self.send_header('Content-Length', str(len(body)))
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        file = FILES.get(urlsplit(self.path).path)
        if file is None:
            return self.reply(404)
        body = file.read_bytes()
        if ENABLED and file.suffix == '.html':
            body = body.replace(b'</head>', b'<meta name="aggregate-metrics" content="on"></head>',1)
        self.reply(200, body, TYPES[file.suffix])

    def do_POST(self):
        if not ENABLED or self.path != '/events':
            return self.reply(404)
        if self.headers.get('Origin') != os.environ['METRICS_ORIGIN']:
            return self.reply(403)
        try:
            size = int(self.headers['Content-Length'])
            if not 0 < size <= 256:
                return self.reply(413)
            data = json.loads(self.rfile.read(size))
            if not isinstance(data,dict) or set(data) != {'page','event'}:
                return self.reply(400)
            page,event = data['page'],data['event']
            if page not in PAGES or event not in EVENTS:
                return self.reply(400)
        except (TypeError, ValueError):
            return self.reply(400)
        with closing(sqlite3.connect(DB)) as db, db:
            db.execute('CREATE TABLE IF NOT EXISTS counts (day TEXT, page TEXT, event TEXT, n INTEGER, PRIMARY KEY(day,page,event))')
            db.execute('INSERT INTO counts VALUES (?,?,?,1) ON CONFLICT DO UPDATE SET n=n+1', (datetime.now(timezone.utc).date().isoformat(),page,event))
        self.reply(204)

if __name__ == '__main__':
    ThreadingHTTPServer(('0.0.0.0',int(os.getenv('PORT','8000'))),Handler).serve_forever()
