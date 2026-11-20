"""Extend the publication server with a read-only aggregate report and opt-in gate."""
import json
import os
import sqlite3
import sys
from contextlib import closing
from http.server import ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT.parent / 'scripts'))
import serve

ASSETS = {'index.html':'text/html; charset=utf-8', 'desk.css':'text/css', 'desk.js':'text/javascript', 'counter.js':'text/javascript', 'campaign.csv':'text/csv', 'media/studio.jpg':'image/jpeg'}

class Handler(serve.Handler):
    def do_GET(self):
        path = urlsplit(self.path).path
        if path == '/measurement':
            self.send_response(301)
            self.send_header('Location','/measurement/')
            self.end_headers()
            return
        if path == '/measurement/api/summary':
            if not serve.ENABLED:
                return self.reply(404)
            with closing(sqlite3.connect(serve.DB)) as db:
                exists = db.execute("SELECT 1 FROM sqlite_master WHERE type='table' AND name='counts'").fetchone()
                counts = dict(db.execute('SELECT event,sum(n) FROM counts GROUP BY event')) if exists else {}
            return self.reply(200,json.dumps({'events':counts}).encode(),'application/json')
        if path.startswith('/measurement/'):
            name = path[len('/measurement/'):] or 'index.html'
            if name not in ASSETS:
                return self.reply(404)
            body = (ROOT / name).read_bytes()
            if name == 'index.html' and serve.ENABLED:
                body = body.replace(b'</head>',b'<meta name="aggregate-metrics" content="on"></head>')
            return self.reply(200,body,ASSETS[name])
        if path == '/assets/metrics.js':
            # This host uses the same consent preference across the desk and publication.
            script = serve.FILES[path].read_bytes()
            return self.reply(200,b"if(localStorage.getItem('diyhome-count-consent')==='yes'){\n"+script+b'\n}', 'text/javascript')
        super().do_GET()

    def do_POST(self):
        if self.headers.get('DNT') == '1' or self.headers.get('Sec-GPC') == '1':
            return self.reply(204)
        super().do_POST()

if __name__ == '__main__':
    ThreadingHTTPServer(('0.0.0.0', int(os.getenv('PORT','8080'))), Handler).serve_forever()
