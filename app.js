(function () {
  'use strict';
  var STORAGE_KEY = 'diyhome-local-events-v1';
  var pageName = (location.pathname.split('/').filter(Boolean).pop() || 'index').replace(/\.html$/, '') || 'index';
  var knownEvents = ['page_view', 'outbound_click', 'guide_open', 'review_register_open', 'disclosure_view'];

  function readCounts() {
    try {
      var stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      return stored && typeof stored === 'object' ? stored : {};
    } catch (_) {
      return {};
    }
  }

  function record(eventName, key) {
    if (knownEvents.indexOf(eventName) === -1) return;
    var id = eventName + ':' + String(key || 'all').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 50);
    var counts = readCounts();
    counts[id] = (Number(counts[id]) || 0) + 1;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(counts)); } catch (_) { /* Storage may be disabled; the site still works. */ }
    renderSummary();
  }

  function renderSummary() {
    var target = document.getElementById('click-summary');
    if (!target) return;
    var counts = readCounts();
    var rows = Object.keys(counts).sort().map(function (id) {
      var parts = id.split(':');
      return '<tr><td><code>' + escapeHtml(parts[0]) + '</code></td><td>' + escapeHtml(parts[1] || 'all') + '</td><td>' + (Number(counts[id]) || 0) + '</td></tr>';
    });
    target.innerHTML = '<table><thead><tr><th>Event</th><th>Local label</th><th>Count</th></tr></thead><tbody>' + (rows.length ? rows.join('') : '<tr><td colspan="3">No local interactions counted yet.</td></tr>') + '</tbody></table>';
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (char) {
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char];
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    record('page_view', pageName);
    document.querySelectorAll('a[rel~="sponsored"][data-affiliate-label]').forEach(function (link) {
      link.addEventListener('click', function () { record('outbound_click', link.getAttribute('data-affiliate-label')); });
    });
    document.querySelectorAll('a[href*="guides/"]').forEach(function (link) {
      link.addEventListener('click', function () { record('guide_open', 'air-fryer-checklist'); });
    });
    document.querySelectorAll('a[href*="review/"]').forEach(function (link) {
      link.addEventListener('click', function () { record('review_register_open', 'review'); });
    });
    var disclosure = document.querySelector('.disclosure');
    if (disclosure && 'IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        if (entries.some(function (entry) { return entry.isIntersecting; })) {
          record('disclosure_view', pageName);
          observer.disconnect();
        }
      });
      observer.observe(disclosure);
    }
    var reset = document.getElementById('reset-counts');
    if (reset) reset.addEventListener('click', function () {
      try { localStorage.removeItem(STORAGE_KEY); } catch (_) { /* no-op */ }
      renderSummary();
    });
    renderSummary();
  });
}());
