import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createAppServer } from '../server.mjs';

const staticRoot = new URL('../dist/', import.meta.url).pathname;

async function withServer(run) {
  const dataDir = await mkdtemp(join(tmpdir(), 'diyhome-analytics-'));
  const server = createAppServer({ staticRoot, dataDir, ingestToken: 'test-only-secret' });
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  const address = server.address();
  const origin = `http://127.0.0.1:${address.port}`;
  try {
    await run({ origin, dataDir });
  } finally {
    await new Promise((resolve) => server.close(resolve));
    await rm(dataDir, { recursive: true, force: true });
  }
}

test('analytics API aggregates public events and gates first-party report imports', async () => {
  await withServer(async ({ origin, dataDir }) => {
    const healthResponse = await fetch(`${origin}/api/health`);
    assert.equal(healthResponse.status, 200);
    const health = await healthResponse.json();
    assert.equal(health.ok, true);
    assert.equal(health.storage, 'aggregate_only');
    assert.deepEqual(health.events, ['page_view', 'guide_view', 'outbound_click', 'product_link_click', 'reported_order']);

    const publicHeaders = {
      'content-type': 'application/json',
      origin
    };
    const pageView = await fetch(`${origin}/api/events`, {
      method: 'POST',
      headers: publicHeaders,
      body: JSON.stringify({ eventName: 'page_view', pagePath: '/guides/air-fryer.html?email=not-stored', linkKey: '' })
    });
    assert.equal(pageView.status, 202);

    const forbiddenConversion = await fetch(`${origin}/api/events`, {
      method: 'POST',
      headers: publicHeaders,
      body: JSON.stringify({ eventName: 'reported_order', pagePath: '/fake', linkKey: 'website' })
    });
    assert.equal(forbiddenConversion.status, 400);

    const untrustedOrigin = await fetch(`${origin}/api/events`, {
      method: 'POST',
      headers: { ...publicHeaders, origin: 'https://attacker.invalid' },
      body: JSON.stringify({ eventName: 'outbound_click', pagePath: '/', linkKey: 'reference' })
    });
    assert.equal(untrustedOrigin.status, 403);

    const missingToken = await fetch(`${origin}/api/reports`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        reportDate: '2026-11-20',
        sourceReference: 'weekly-report-01',
        channel: 'website',
        eligibleSessions: 10,
        clicks: 3,
        reportedOrders: 1
      })
    });
    assert.equal(missingToken.status, 403);

    const authorizedImport = await fetch(`${origin}/api/reports`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: 'Bearer test-only-secret'
      },
      body: JSON.stringify({
        reportDate: '2026-11-20',
        sourceReference: 'weekly-report-01',
        channel: 'website',
        eligibleSessions: 10,
        clicks: 3,
        reportedOrders: 1
      })
    });
    assert.equal(authorizedImport.status, 202);

    const summaryResponse = await fetch(`${origin}/api/summary`);
    assert.equal(summaryResponse.status, 200);
    const summary = await summaryResponse.json();
    assert.equal(summary.counts.find((row) => row.eventName === 'page_view').count, 1);
    assert.equal(summary.counts.find((row) => row.eventName === 'reported_order').count, 1);
    assert.equal(summary.reports.length, 1);
    assert.equal(summary.reports[0].sourceReference, 'weekly-report-01');

    const aggregateText = await readFile(join(dataDir, 'daily-aggregates.json'), 'utf8');
    assert.match(aggregateText, /\/guides\/air-fryer\.html/);
    assert.doesNotMatch(aggregateText, /email=not-stored|user-agent|attacker\.invalid/i);
    assert.doesNotMatch(aggregateText, /test-only-secret/);
  });
});

test('static server serves the built home page and rejects traversal paths', async () => {
  await withServer(async ({ origin }) => {
    const home = await fetch(`${origin}/`);
    assert.equal(home.status, 200);
    assert.match(await home.text(), /DIY HOME/);

    const traversal = await fetch(`${origin}/%2e%2e/%2e%2e/etc/passwd`);
    assert.equal(traversal.status, 404);
  });
});
