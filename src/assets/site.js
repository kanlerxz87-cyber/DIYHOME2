(() => {
  'use strict';

  const API_ROOT = '/api';
  const pendingEvents = [];
  let endpointReady = false;

  function postEvent(eventName, linkKey = '') {
    const payload = {
      eventName,
      pagePath: window.location.pathname,
      linkKey
    };
    if (!endpointReady) {
      if (pendingEvents.length < 20) pendingEvents.push(payload);
      return;
    }
    fetch(`${API_ROOT}/events`, {
      method: 'POST',
      mode: 'same-origin',
      credentials: 'omit',
      cache: 'no-store',
      keepalive: true,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).catch(() => {});
  }

  function formatCount(value) {
    return new Intl.NumberFormat('en').format(value);
  }

  function updateCounts(counts = [], updatedAt = null) {
    const totals = new Map();
    counts.forEach((row) => {
      if (!row || typeof row.eventName !== 'string' || !Number.isFinite(row.count)) return;
      totals.set(row.eventName, (totals.get(row.eventName) || 0) + row.count);
    });
    document.querySelectorAll('[data-event-count]').forEach((element) => {
      const name = element.getAttribute('data-event-count');
      element.textContent = formatCount(totals.get(name) || 0);
    });
    const lastUpdated = document.querySelector('[data-analytics-updated]');
    const updateValue = document.querySelector('[data-analytics-updated-value]');
    if (lastUpdated && updateValue) {
      updateValue.textContent = updatedAt ? new Date(updatedAt).toLocaleString() : 'No events recorded';
      lastUpdated.hidden = false;
    }
  }

  function addLedgerRows(reports = []) {
    const tableBody = document.querySelector('[data-live-ledger]');
    if (!tableBody || !Array.isArray(reports) || reports.length === 0) return;
    tableBody.replaceChildren();
    reports.slice().reverse().forEach((report) => {
      const row = document.createElement('tr');
      [
        report.recordedAt || '',
        report.source || '',
        report.channel || '',
        report.eligibleSessions,
        report.clicks,
        report.reportedOrders,
        report.sourceReference || ''
      ].forEach((value) => {
        const cell = document.createElement('td');
        cell.textContent = value === undefined || value === null ? '' : String(value);
        row.append(cell);
      });
      tableBody.append(row);
    });
  }

  function setEndpointStatus(connected) {
    document.querySelectorAll('[data-endpoint-status]').forEach((element) => {
      element.textContent = connected
        ? 'Connected to the self-hosted aggregate endpoint.'
        : 'Not connected on this static host; no events are being collected here.';
      element.classList.toggle('status-live', connected);
      element.classList.toggle('status-offline', !connected);
    });
    document.querySelectorAll('[data-endpoint-dot]').forEach((element) => {
      element.classList.toggle('is-live', connected);
      element.classList.toggle('is-offline', !connected);
    });
  }

  function initMeasurement() {
    const pageType = document.body.dataset.pageType;
    const initialStatus = document.querySelector('[data-endpoint-status]');
    if (initialStatus) initialStatus.textContent = 'Checking the same-origin analytics endpoint…';

    fetch(`${API_ROOT}/health`, {
      method: 'GET',
      mode: 'same-origin',
      credentials: 'omit',
      cache: 'no-store'
    }).then((response) => {
      if (!response.ok) throw new Error('endpoint_unavailable');
      return response.json();
    }).then((health) => {
      if (!health || health.ok !== true) throw new Error('endpoint_unavailable');
      endpointReady = true;
      setEndpointStatus(true);
      postEvent('page_view');
      if (pageType === 'guide') postEvent('guide_view');
      while (pendingEvents.length) {
        const event = pendingEvents.shift();
        postEvent(event.eventName, event.linkKey);
      }
      return fetch(`${API_ROOT}/summary`, {
        method: 'GET',
        mode: 'same-origin',
        credentials: 'omit',
        cache: 'no-store'
      });
    }).then((response) => {
      if (!response || !response.ok) return null;
      return response.json();
    }).then((summary) => {
      if (!summary) return;
      updateCounts(summary.counts, summary.updatedAt);
      addLedgerRows(summary.reports);
    }).catch(() => {
      endpointReady = false;
      pendingEvents.length = 0;
      setEndpointStatus(false);
    });
  }

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href]');
    if (!link) return;

    if (link.dataset.productLink === 'true') {
      const productKey = link.dataset.analyticsKey || '';
      postEvent('product_link_click', productKey);
      return;
    }

    try {
      const destination = new URL(link.href, window.location.href);
      if (destination.origin !== window.location.origin) {
        postEvent('outbound_click', link.dataset.analyticsKey || 'external_reference');
      }
    } catch {
      // Malformed URLs are ignored; they are never copied into analytics.
    }
  });

  document.addEventListener('click', (event) => {
    document.querySelectorAll('details.nav-group[open]').forEach((details) => {
      if (!details.contains(event.target)) details.open = false;
    });
  });

  initMeasurement();
})();
