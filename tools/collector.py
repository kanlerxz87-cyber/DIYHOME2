#!/usr/bin/env python3
"""DIY Home Upgrades — optional self-hosted analytics collector (stdlib only).

Run it on any host YOU control (a small VPS, home server, Raspberry Pi) behind
HTTPS, then set window.DIYHOME_ENDPOINT in docs/assets/js/analytics-config.js.

Design:
  POST /events   JSON row from analytics.js (sendBeacon). No cookies, no IDs, no PII.
  POST /capture  {email, source, ts} — stored 0600 in captures.jsonl, never logged to stdout.
  GET  /health   liveness probe.  GET /events.jsonl  (only if --token provided) raw dump.
Rows are appended as JSON Lines: {"received_at":..., "row": {...}}
CORS is restricted to --allow-origin (default: the GitHub Pages origin).
"""
import argparse, json, datetime, sys, hmac
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

class H(BaseHTTPRequestHandler):
    allow_origin = "*"
    events_path = Path("events.jsonl")
    captures_path = Path("captures.jsonl")
    token = None

    def _cors(self):
        self.send_header("Access-Control-Allow-Origin", self.allow_origin)
        self.send_header("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Vary", "Origin")

    def _json(self, code, obj):
        body = json.dumps(obj).encode()
        self.send_response(code); self._cors()
        self.send_header("Content-Type", "application/json"); self.send_header("Content-Length", str(len(body))); self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(204); self._cors(); self.send_header("Content-Length", "0"); self.end_headers()

    def do_GET(self):
        if self.path == "/health": return self._json(200, {"ok": True, "service": "diyhome2-collector"})
        if self.path == "/events.jsonl":
            if not self.token: return self._json(403, {"error": "set --token to enable the dump"})
            auth = self.headers.get("Authorization", "")
            if not hmac.compare_digest(auth, f"Bearer {self.token}"): return self._json(401, {"error": "unauthorized"})
            body = self.events_path.read_bytes() if self.events_path.exists() else b""
            self.send_response(200); self._cors(); self.send_header("Content-Type", "application/x-ndjson"); self.send_header("Content-Length", str(len(body))); self.end_headers(); return self.wfile.write(body)
        return self._json(404, {"error": "not found"})

    def do_POST(self):
        try:
            length = min(int(self.headers.get("Content-Length", "0")), 65536)
            payload = json.loads(self.rfile.read(length) or b"{}")
        except Exception:
            return self._json(400, {"error": "bad json"})
        now = datetime.datetime.now(datetime.timezone.utc).isoformat()
        if self.path == "/events":
            with self.events_path.open("a", encoding="utf-8") as f:
                f.write(json.dumps({"received_at": now, "row": payload}) + "\n")
            return self._json(202, {"ok": True})
        if self.path == "/capture":
            email = str(payload.get("email", "")).strip()[:320]
            if "@" not in email or " " in email: return self._json(400, {"error": "invalid email"})
            with self.captures_path.open("a", encoding="utf-8") as f:
                f.write(json.dumps({"received_at": now, "email": email, "source": payload.get("source"), "ts": payload.get("ts")}) + "\n")
            try: self.captures_path.chmod(0o600)
            except OSError: pass
            return self._json(202, {"ok": True})
        return self._json(404, {"error": "not found"})

    def log_message(self, fmt, *args):  # never log request bodies (may carry emails)
        sys.stderr.write("collector: %s\n" % (fmt % args))

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--host", default="0.0.0.0")
    ap.add_argument("--port", type=int, default=8787)
    ap.add_argument("--out", default="events.jsonl")
    ap.add_argument("--captures", default="captures.jsonl")
    ap.add_argument("--allow-origin", default="https://kanlerxz87-cyber.github.io")
    ap.add_argument("--token", default=None, help="Bearer token required for GET /events.jsonl")
    a = ap.parse_args()
    H.allow_origin = a.allow_origin; H.events_path = Path(a.out); H.captures_path = Path(a.captures); H.token = a.token
    ThreadingHTTPServer((a.host, a.port), H).serve_forever()

if __name__ == "__main__":
    main()
