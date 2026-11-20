import http.client
import io
import json
import os
import tempfile
import threading
import unittest
from pathlib import Path
from unittest.mock import patch
from http.server import ThreadingHTTPServer

import render_ledger
import server

class DeskTests(unittest.TestCase):
    def test_ledger(self):
        header = ','.join(render_ledger.FIELDS)+'\n'
        row = '2026-11-20T00:00:00Z,https://affiliate-program.amazon.com/,test,,1,,sample\n'
        self.assertEqual(render_ledger.render(io.StringIO(header)), '')
        self.assertIn('<td></td>', render_ledger.render(io.StringIO(header+row)))
        with self.assertRaises(ValueError):
            render_ledger.render(io.StringIO(header+row.replace('affiliate-program.amazon.com','unverified.example')))

    def test_counts(self):
        with tempfile.TemporaryDirectory() as tmp,patch.object(server.serve,'DB',str(Path(tmp)/'test.db')),patch.object(server.serve,'ENABLED',True),patch.dict(os.environ,METRICS_ORIGIN='https://desk.example'):
            with ThreadingHTTPServer(('127.0.0.1',0),server.Handler) as httpd:
                t=threading.Thread(target=httpd.serve_forever,daemon=True); t.start()
                def request(method,path,data=None,headers=None):
                    c=http.client.HTTPConnection(*httpd.server_address);c.request(method,path,data,headers or {});r=c.getresponse();status,body=r.status,r.read();c.close();return status,body
                try:
                    for e in server.serve.EVENTS:
                        body=json.dumps({'page':'measurement','event':e}); h={'Origin':'https://desk.example'}
                        self.assertEqual(request('POST','/events',body,h)[0],204)
                        self.assertEqual(request('POST','/events',body,{**h,'Sec-GPC':'1'})[0],204)
                    self.assertEqual(request('POST','/events',body,{})[0],403)
                    summary=json.loads(request('GET','/measurement/api/summary')[1]);self.assertEqual(summary['events'],dict.fromkeys(server.serve.EVENTS,1))
                    for path in ['/','/measurement/','/measurement/desk.css','/campaign-ledger.csv','/review.html']:
                        self.assertEqual(request('GET',path)[0],200,path)
                finally:
                    httpd.shutdown();t.join()
