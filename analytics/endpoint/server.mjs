#!/usr/bin/env node
/**
 * DIYHOME2 Self-Hosted Privacy-Preserving Analytics Endpoint
 * Zero external dependencies. Stores only the 5 defined event types as NDJSON.
 * Strips IP addresses, cookies, and raw user-agent strings before writing.
 *
 * Usage:
 *   PORT=8787 ALLOWED_ORIGIN=https://kanlerxz87-cyber.github.io node analytics/endpoint/server.mjs
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT || 8787);
const HOST = process.env.HOST || '0.0.0.0';
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || 'https://kanlerxz87-cyber.github.io';
const LOG_DIR = process.env.LOG_DIR || path.resolve(__dirname, '../logs');

const ALLOWED_EVENTS = new Set([
  'page_view',
  'guide_scroll_depth',
  'disclosure_viewed',
  'outbound_affiliate_click',
  'reader_capture_intent'
]);

fs.mkdirSync(LOG_DIR, { recursive: true });

function setCors(res, origin) {
  const allow = origin === ALLOWED_ORIGIN || ALLOWED_ORIGIN === '*' ? origin || '*' : ALLOWED_ORIGIN;
  res.setHeader('Access-Control-Allow-Origin', allow);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store');
}

function getTodayLogPath() {
  const day = new Date().toISOString().slice(0, 10);
  return path.join(LOG_DIR, `events-${day}.ndjson`);
}

function sanitizeEvent(raw) {
  if (!raw || typeof raw !== 'object') return null;
  if (!ALLOWED_EVENTS.has(raw.event)) return null;

  return {
    event: String(raw.event),
    timestamp_utc: new Date().toISOString(),
    path: String(raw.path || '/').slice(0, 200),
    viewport_bucket: ['mobile', 'tablet', 'desktop'].includes(raw.viewport_bucket)
      ? raw.viewport_bucket
      : 'unknown',
    data: raw.data && typeof raw.data === 'object' ? raw.data : {}
  };
}

function summarizeToday() {
  const logPath = getTodayLogPath();
  const counts = {};
  for (const name of ALLOWED_EVENTS) counts[name] = 0;

  if (!fs.existsSync(logPath)) {
    return { date_utc: new Date().toISOString().slice(0, 10), total_events: 0, counts };
  }

  const lines = fs.readFileSync(logPath, 'utf8').split('\n').filter(Boolean);
  for (const line of lines) {
    try {
      const parsed = JSON.parse(line);
      if (parsed.event in counts) counts[parsed.event] += 1;
    } catch (_) {
      // skip malformed line
    }
  }
  return {
    date_utc: new Date().toISOString().slice(0, 10),
    total_events: lines.length,
    counts
  };
}

const server = http.createServer((req, res) => {
  setCors(res, req.headers.origin);

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', allowed_events: Array.from(ALLOWED_EVENTS) }));
    return;
  }

  if (req.method === 'GET' && req.url === '/summary') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(summarizeToday(), null, 2));
    return;
  }

  if (req.method === 'POST' && req.url === '/events') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 16_384) {
        res.writeHead(413, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Payload too large' }));
        req.destroy();
      }
    });
    req.on('end', () => {
      try {
        const parsed = JSON.parse(body || '{}');
        const sanitized = sanitizeEvent(parsed);
        if (!sanitized) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid or disallowed event type' }));
          return;
        }
        fs.appendFileSync(getTodayLogPath(), JSON.stringify(sanitized) + '\n', 'utf8');
        res.writeHead(202, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ accepted: true, event: sanitized.event }));
      } catch (_) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Malformed JSON' }));
      }
    });
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, HOST, () => {
  console.log(`DIYHOME2 analytics collector listening on http://${HOST}:${PORT}`);
});
