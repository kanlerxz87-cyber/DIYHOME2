import { createServer as createHttpServer } from 'node:http';
import { appendFile, mkdir, readFile, realpath, rename, stat, writeFile } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import { dirname, extname, join, resolve, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { timingSafeEqual } from 'node:crypto';

const REPO_ROOT = dirname(fileURLToPath(import.meta.url));
const PUBLIC_EVENTS = new Set(['page_view', 'guide_view', 'outbound_click', 'product_link_click']);
const ALL_EVENTS = new Set([...PUBLIC_EVENTS, 'reported_order']);
const REPORT_CHANNELS = new Set(['website', 'social', 'email', 'other']);
const MIME_TYPES = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.csv', 'text/csv; charset=utf-8'],
  ['.html', 'text/html; charset=utf-8'],
  ['.ico', 'image/x-icon'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.mjs', 'text/javascript; charset=utf-8'],
  ['.png', 'image/png'],
  ['.svg', 'image/svg+xml'],
  ['.txt', 'text/plain; charset=utf-8'],
  ['.xml', 'application/xml; charset=utf-8']
]);
const MAX_BODY_BYTES = 4_096;

function sendJson(response, status, value) {
  const body = JSON.stringify(value);
  response.writeHead(status, {
    'Cache-Control': 'no-store',
    'Content-Length': Buffer.byteLength(body),
    'Content-Type': 'application/json; charset=utf-8',
    'X-Content-Type-Options': 'nosniff'
  });
  response.end(body);
}

function sendText(response, status, value) {
  response.writeHead(status, {
    'Cache-Control': 'no-store',
    'Content-Length': Buffer.byteLength(value),
    'Content-Type': 'text/plain; charset=utf-8',
    'X-Content-Type-Options': 'nosniff'
  });
  response.end(value);
}

function validOrigin(request) {
  const origin = request.headers.origin;
  if (typeof origin !== 'string' || typeof request.headers.host !== 'string') return false;
  try {
    return new URL(origin).host === request.headers.host;
  } catch {
    return false;
  }
}

async function readJsonBody(request) {
  const contentType = String(request.headers['content-type'] || '').split(';', 1)[0].trim().toLowerCase();
  if (contentType !== 'application/json') {
    const error = new Error('unsupported_content_type');
    error.statusCode = 415;
    throw error;
  }

  const declaredLength = Number(request.headers['content-length'] || 0);
  if (declaredLength > MAX_BODY_BYTES) {
    const error = new Error('payload_too_large');
    error.statusCode = 413;
    throw error;
  }

  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) {
      const error = new Error('payload_too_large');
      error.statusCode = 413;
      throw error;
    }
    chunks.push(chunk);
  }

  try {
    const value = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('not_an_object');
    return value;
  } catch {
    const error = new Error('invalid_json');
    error.statusCode = 400;
    throw error;
  }
}

function cleanPagePath(value) {
  if (typeof value !== 'string' || value.length > 300) return '/';
  const pathOnly = value.split(/[?#]/, 1)[0];
  if (!pathOnly.startsWith('/') || pathOnly.startsWith('//') || /[\u0000-\u001f]/.test(pathOnly)) return '/';
  const normalized = pathOnly.replace(/\/{2,}/g, '/');
  if (normalized.split('/').includes('..')) return '/';
  return normalized || '/';
}

function cleanLinkKey(value, eventName) {
  if (value === undefined || value === null || value === '') return '';
  if (typeof value !== 'string' || value.length > 48 || !/^[a-zA-Z0-9_-]+$/.test(value)) return null;
  if (eventName === 'product_link_click' && !/^product_[a-zA-Z0-9_-]{1,36}$/.test(value)) return null;
  return value;
}

function safeCount(value) {
  return Number.isSafeInteger(value) && value >= 0 && value <= 1_000_000_000;
}

function safeReportDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
}

function tokenMatches(request, expectedToken) {
  if (!expectedToken) return false;
  const header = request.headers.authorization;
  if (typeof header !== 'string' || !header.startsWith('Bearer ')) return false;
  const supplied = Buffer.from(header.slice(7));
  const expected = Buffer.from(expectedToken);
  return supplied.length === expected.length && timingSafeEqual(supplied, expected);
}

async function loadAggregate(filePath) {
  try {
    const parsed = JSON.parse(await readFile(filePath, 'utf8'));
    if (parsed?.schemaVersion !== 1 || !Array.isArray(parsed.counts)) return { schemaVersion: 1, counts: [] };
    return parsed;
  } catch (error) {
    if (error.code === 'ENOENT') return { schemaVersion: 1, counts: [] };
    throw error;
  }
}

async function loadReports(filePath) {
  try {
    const text = await readFile(filePath, 'utf8');
    return text.split('\n').filter(Boolean).map((line) => JSON.parse(line));
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
}

async function resolveStaticFile(staticRoot, requestPath) {
  let decoded;
  try {
    decoded = decodeURIComponent(requestPath);
  } catch {
    return null;
  }
  if (decoded.includes('\0')) return null;
  const root = await realpath(staticRoot);
  const candidate = resolve(root, `.${decoded}`);
  if (candidate !== root && !candidate.startsWith(`${root}${sep}`)) return null;

  let finalPath = candidate;
  try {
    const info = await stat(finalPath);
    if (info.isDirectory()) finalPath = join(finalPath, 'index.html');
    const finalRealPath = await realpath(finalPath);
    if (finalRealPath !== root && !finalRealPath.startsWith(`${root}${sep}`)) return null;
    const finalInfo = await stat(finalRealPath);
    if (!finalInfo.isFile()) return null;
    return { path: finalRealPath, size: finalInfo.size };
  } catch {
    return null;
  }
}

function applySecurityHeaders(response) {
  response.setHeader('Referrer-Policy', 'no-referrer');
  response.setHeader('X-Content-Type-Options', 'nosniff');
  response.setHeader('X-Frame-Options', 'DENY');
  response.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.setHeader('Content-Security-Policy', "default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; connect-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'");
}

export function createAppServer({
  staticRoot = join(REPO_ROOT, 'dist'),
  dataDir = process.env.ANALYTICS_DATA_DIR || join(REPO_ROOT, '.analytics-data'),
  ingestToken = process.env.ANALYTICS_INGEST_TOKEN || ''
} = {}) {
  const aggregatePath = join(dataDir, 'daily-aggregates.json');
  const reportsPath = join(dataDir, 'campaign-reports.jsonl');
  let writeQueue = Promise.resolve();

  function serializeWrite(operation) {
    writeQueue = writeQueue.then(operation);
    return writeQueue;
  }

  function incrementAggregate({ eventName, pagePath, linkKey, count = 1, date = new Date().toISOString().slice(0, 10) }) {
    return serializeWrite(async () => {
      await mkdir(dataDir, { recursive: true });
      const aggregate = await loadAggregate(aggregatePath);
      const existing = aggregate.counts.find((row) => row.date === date
        && row.eventName === eventName
        && row.pagePath === pagePath
        && row.linkKey === linkKey);
      if (existing) existing.count += count;
      else aggregate.counts.push({ date, eventName, pagePath, linkKey, count });
      aggregate.updatedAt = new Date().toISOString();
      const temporaryPath = `${aggregatePath}.${process.pid}.tmp`;
      await writeFile(temporaryPath, `${JSON.stringify(aggregate, null, 2)}\n`, { mode: 0o600 });
      await rename(temporaryPath, aggregatePath);
    });
  }

  function appendReport(report) {
    return serializeWrite(async () => {
      await mkdir(dataDir, { recursive: true });
      await appendFile(reportsPath, `${JSON.stringify(report)}\n`, { mode: 0o600 });
    });
  }

  return createHttpServer(async (request, response) => {
    applySecurityHeaders(response);
    const requestUrl = new URL(request.url || '/', `http://${request.headers.host || 'localhost'}`);

    try {
      if (requestUrl.pathname === '/api/health') {
        if (request.method !== 'GET') return sendJson(response, 405, { error: 'method_not_allowed' });
        return sendJson(response, 200, {
          ok: true,
          storage: 'aggregate_only',
          events: [...ALL_EVENTS],
          reportIngestionConfigured: Boolean(ingestToken)
        });
      }

      if (requestUrl.pathname === '/api/events') {
        if (request.method !== 'POST') return sendJson(response, 405, { error: 'method_not_allowed' });
        if (!validOrigin(request)) return sendJson(response, 403, { error: 'same_origin_required' });
        const body = await readJsonBody(request);
        const eventName = body.eventName;
        if (typeof eventName !== 'string' || !PUBLIC_EVENTS.has(eventName)) {
          return sendJson(response, 400, { error: 'unsupported_or_server_only_event' });
        }
        const linkKey = cleanLinkKey(body.linkKey, eventName);
        if (linkKey === null) return sendJson(response, 400, { error: 'invalid_link_key' });
        const pagePath = cleanPagePath(body.pagePath);
        await incrementAggregate({ eventName, pagePath, linkKey });
        return sendJson(response, 202, { accepted: true });
      }

      if (requestUrl.pathname === '/api/reports') {
        if (request.method !== 'POST') return sendJson(response, 405, { error: 'method_not_allowed' });
        if (!ingestToken) return sendJson(response, 503, { error: 'report_ingestion_not_configured' });
        if (!tokenMatches(request, ingestToken)) return sendJson(response, 403, { error: 'authorized_report_token_required' });
        const body = await readJsonBody(request);
        const valid = safeReportDate(body.reportDate)
          && REPORT_CHANNELS.has(body.channel)
          && ['eligibleSessions', 'clicks', 'reportedOrders'].every((key) => safeCount(body[key]))
          && typeof body.sourceReference === 'string'
          && /^[a-zA-Z0-9._-]{1,80}$/.test(body.sourceReference);
        if (!valid) return sendJson(response, 400, { error: 'invalid_aggregate_report' });

        const report = {
          reportDate: body.reportDate,
          recordedAt: new Date().toISOString(),
          source: 'amazon_associates_first_party_report',
          sourceReference: body.sourceReference,
          channel: body.channel,
          eligibleSessions: body.eligibleSessions,
          clicks: body.clicks,
          reportedOrders: body.reportedOrders
        };
        await appendReport(report);
        if (body.reportedOrders > 0) {
          await incrementAggregate({
            eventName: 'reported_order',
            pagePath: '/authorized-report',
            linkKey: body.channel,
            count: body.reportedOrders,
            date: body.reportDate
          });
        }
        return sendJson(response, 202, { accepted: true, recordedAt: report.recordedAt });
      }

      if (requestUrl.pathname === '/api/summary') {
        if (request.method !== 'GET') return sendJson(response, 405, { error: 'method_not_allowed' });
        const aggregate = await loadAggregate(aggregatePath);
        const reports = await loadReports(reportsPath);
        return sendJson(response, 200, {
          updatedAt: aggregate.updatedAt || null,
          counts: aggregate.counts.filter((row) => ALL_EVENTS.has(row.eventName)),
          reports
        });
      }

      if (request.method !== 'GET' && request.method !== 'HEAD') {
        return sendJson(response, 405, { error: 'method_not_allowed' });
      }

      const file = await resolveStaticFile(staticRoot, requestUrl.pathname);
      if (!file) return sendText(response, 404, 'Not found');
      const mimeType = MIME_TYPES.get(extname(file.path).toLowerCase()) || 'application/octet-stream';
      response.writeHead(200, {
        'Cache-Control': mimeType.startsWith('text/html') ? 'no-cache' : 'public, max-age=300',
        'Content-Length': file.size,
        'Content-Type': mimeType
      });
      if (request.method === 'HEAD') return response.end();
      return createReadStream(file.path).pipe(response);
    } catch (error) {
      if (error.statusCode) return sendJson(response, error.statusCode, { error: error.message });
      console.error('Request failed:', error.message);
      return sendJson(response, 500, { error: 'internal_error' });
    }
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const host = process.env.HOST || '0.0.0.0';
  const port = Number(process.env.PORT || 4173);
  const server = createAppServer();
  server.listen(port, host, () => {
    console.log(`DIY Home site and analytics endpoint listening on http://${host}:${port}`);
    console.log('Analytics stores daily aggregates only; report import is disabled unless ANALYTICS_INGEST_TOKEN is configured.');
  });
}
