(function () {
  'use strict';

  function initNavigation() {
    const mobileBtn = document.querySelector('[data-mobile-toggle]');
    const nav = document.querySelector('[data-primary-nav]');
    if (mobileBtn && nav) {
      mobileBtn.addEventListener('click', function () {
        const open = nav.getAttribute('data-mobile-open') === 'true';
        nav.setAttribute('data-mobile-open', String(!open));
        mobileBtn.setAttribute('aria-expanded', String(!open));
      });
    }

    const groups = document.querySelectorAll('[data-nav-group]');
    groups.forEach(function (group) {
      const btn = group.querySelector('[data-nav-group-btn]');
      if (!btn) return;
      btn.addEventListener('click', function (ev) {
        ev.stopPropagation();
        const isOpen = group.getAttribute('data-open') === 'true';
        groups.forEach(function (g) {
          g.setAttribute('data-open', 'false');
          const b = g.querySelector('[data-nav-group-btn]');
          if (b) b.setAttribute('aria-expanded', 'false');
        });
        group.setAttribute('data-open', String(!isOpen));
        btn.setAttribute('aria-expanded', String(!isOpen));
      });
    });

    document.addEventListener('click', function () {
      groups.forEach(function (g) {
        g.setAttribute('data-open', 'false');
        const b = g.querySelector('[data-nav-group-btn]');
        if (b) b.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape') {
        groups.forEach(function (g) {
          g.setAttribute('data-open', 'false');
          const b = g.querySelector('[data-nav-group-btn]');
          if (b) b.setAttribute('aria-expanded', 'false');
        });
      }
    });
  }

  function initTableFilters() {
    const filterInputs = document.querySelectorAll('[data-table-filter]');
    filterInputs.forEach(function (input) {
      const targetId = input.getAttribute('data-table-filter');
      const table = document.getElementById(targetId);
      if (!table) return;

      const select = document.querySelector('[data-table-select="' + targetId + '"]');
      const countEl = document.querySelector('[data-table-count="' + targetId + '"]');

      function applyFilter() {
        const q = String(input.value || '').trim().toLowerCase();
        const cat = select ? String(select.value || '').trim().toLowerCase() : '';
        const rows = table.querySelectorAll('tbody tr');
        let visible = 0;

        rows.forEach(function (row) {
          const text = row.textContent.toLowerCase();
          const rowCat = (row.getAttribute('data-filter-value') || '').toLowerCase();
          const matchesQuery = !q || text.indexOf(q) !== -1;
          const matchesCat = !cat || rowCat === cat || text.indexOf(cat) !== -1;
          const show = matchesQuery && matchesCat;
          row.style.display = show ? '' : 'none';
          if (show) visible += 1;
        });

        if (countEl) {
          countEl.textContent = 'Showing ' + visible + ' of ' + rows.length + ' rows';
        }
      }

      input.addEventListener('input', applyFilter);
      if (select) select.addEventListener('change', applyFilter);
      applyFilter();
    });
  }

  function initAnalyticsConsole() {
    const tbody = document.getElementById('live-events-tbody');
    if (!tbody || !window.DIYHOME2Analytics) return;

    const countsRoot = document.getElementById('live-event-counts');
    const endpointInput = document.getElementById('analytics-endpoint-input');
    const endpointForm = document.getElementById('analytics-endpoint-form');
    const endpointStatus = document.getElementById('analytics-endpoint-status');
    const clearBtn = document.getElementById('clear-local-events');
    const exportBtn = document.getElementById('export-local-events');

    if (endpointInput) {
      endpointInput.value = window.DIYHOME2Analytics.getEndpoint() || '';
    }

    function escapeHtml(str) {
      return String(str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    }

    function render() {
      const events = window.DIYHOME2Analytics.getEvents();
      const counts = {
        page_view: 0,
        guide_scroll_depth: 0,
        disclosure_viewed: 0,
        outbound_affiliate_click: 0,
        reader_capture_intent: 0
      };

      events.forEach(function (ev) {
        if (ev.event in counts) counts[ev.event] += 1;
      });

      if (countsRoot) {
        Object.keys(counts).forEach(function (key) {
          const el = countsRoot.querySelector('[data-event-count="' + key + '"]');
          if (el) el.textContent = String(counts[key]);
        });
      }

      if (!events.length) {
        tbody.innerHTML =
          '<tr><td colspan="4"><em>No local browser events recorded yet. Navigate across pages or test an outbound link to observe live event logging.</em></td></tr>';
        return;
      }

      const recent = events.slice(-25).reverse();
      tbody.innerHTML = recent
        .map(function (ev) {
          return (
            '<tr>' +
            '<td class="mono">' + escapeHtml(ev.timestamp_utc) + '</td>' +
            '<td><span class="pill pill-forest">' + escapeHtml(ev.event) + '</span></td>' +
            '<td class="mono">' + escapeHtml(ev.path) + '</td>' +
            '<td class="mono">' + escapeHtml(JSON.stringify(ev.data || {})) + '</td>' +
            '</tr>'
          );
        })
        .join('');
    }

    if (endpointForm && endpointInput) {
      endpointForm.addEventListener('submit', function (ev) {
        ev.preventDefault();
        const val = endpointInput.value.trim();
        window.DIYHOME2Analytics.setEndpoint(val);
        if (endpointStatus) {
          endpointStatus.textContent = val
            ? 'Saved browser endpoint: ' + val + ' (events will send via navigator.sendBeacon when DNT is off).'
            : 'Cleared external endpoint. Events stay local to this browser.';
        }
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        window.DIYHOME2Analytics.clearLocalEvents();
        render();
      });
    }

    if (exportBtn) {
      exportBtn.addEventListener('click', function () {
        const events = window.DIYHOME2Analytics.getEvents();
        const ndjson = events.map(function (e) { return JSON.stringify(e); }).join('\n');
        const blob = new Blob([ndjson || ''], { type: 'application/x-ndjson' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'diyhome2-local-events.ndjson';
        a.click();
        URL.revokeObjectURL(url);
      });
    }

    window.addEventListener('diyhome2:analytics', render);
    render();
  }

  document.addEventListener('DOMContentLoaded', function () {
    initNavigation();
    initTableFilters();
    initAnalyticsConsole();
  });
})();
