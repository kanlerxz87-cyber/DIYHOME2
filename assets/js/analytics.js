/**
 * DIYHOME2 Privacy-Preserving First-Party Analytics & Outbound Click Counter
 * Zero cookies. Zero PII. Zero third-party scripts.
 *
 * Records the five defined events:
 *  1. page_view
 *  2. guide_scroll_depth
 *  3. disclosure_viewed
 *  4. outbound_affiliate_click
 *  5. reader_capture_intent
 */
(function () {
  'use strict';

  const STORAGE_KEY = 'diyhome2_analytics_events_v1';
  const ENDPOINT_KEY = 'diyhome2_analytics_endpoint_v1';
  const MAX_LOCAL_EVENTS = 250;
  const ALLOWED_EVENTS = new Set([
    'page_view',
    'guide_scroll_depth',
    'disclosure_viewed',
    'outbound_affiliate_click',
    'reader_capture_intent'
  ]);

  function getConfiguredEndpoint() {
    if (window.DIYHOME_ANALYTICS_ENDPOINT) {
      return String(window.DIYHOME_ANALYTICS_ENDPOINT).trim();
    }
    const meta = document.querySelector('meta[name="diyhome-analytics-endpoint"]');
    if (meta && meta.content && meta.content.trim()) {
      return meta.content.trim();
    }
    try {
      const saved = window.localStorage.getItem(ENDPOINT_KEY);
      if (saved && saved.trim()) return saved.trim();
    } catch (_) {
      // storage blocked
    }
    return '';
  }

  function getViewportBucket() {
    const w = window.innerWidth || 0;
    if (w < 640) return 'mobile';
    if (w < 1024) return 'tablet';
    return 'desktop';
  }

  function getReferrerHost() {
    if (!document.referrer) return 'direct';
    try {
      const host = new URL(document.referrer).hostname;
      return host === window.location.hostname ? 'internal' : host;
    } catch (_) {
      return 'unknown';
    }
  }

  function readLocalEvents() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (_) {
      return [];
    }
  }

  function writeLocalEvent(record) {
    try {
      const list = readLocalEvents();
      list.push(record);
      if (list.length > MAX_LOCAL_EVENTS) {
        list.splice(0, list.length - MAX_LOCAL_EVENTS);
      }
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (_) {
      // Ignore storage quota / private mode restrictions
    }
  }

  function dispatchEvent(eventName, payload) {
    if (!ALLOWED_EVENTS.has(eventName)) return;

    const record = {
      event: eventName,
      timestamp_utc: new Date().toISOString(),
      path: window.location.pathname || '/',
      viewport_bucket: getViewportBucket(),
      dnt_enabled: navigator.doNotTrack === '1',
      data: payload || {}
    };

    writeLocalEvent(record);

    const endpoint = getConfiguredEndpoint();
    if (endpoint && navigator.doNotTrack !== '1') {
      try {
        const body = JSON.stringify(record);
        if (navigator.sendBeacon) {
          const blob = new Blob([body], { type: 'application/json' });
          navigator.sendBeacon(endpoint, blob);
        } else {
          fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body,
            keepalive: true
          }).catch(function () {});
        }
      } catch (_) {
        // Non-blocking telemetry failure
      }
    }

    window.dispatchEvent(new CustomEvent('diyhome2:analytics', { detail: record }));
  }

  function initScrollDepth() {
    const article = document.querySelector('[data-track-scroll="guide"]');
    if (!article) return;

    const milestones = [25, 50, 75, 100];
    const reached = new Set();

    function checkDepth() {
      const rect = article.getBoundingClientRect();
      const articleTop = rect.top + window.scrollY;
      const articleHeight = Math.max(article.scrollHeight, 1);
      const viewedBottom = window.scrollY + window.innerHeight;
      const pct = Math.min(100, Math.max(0, Math.round(((viewedBottom - articleTop) / articleHeight) * 100)));

      milestones.forEach(function (m) {
        if (pct >= m && !reached.has(m)) {
          reached.add(m);
          dispatchEvent('guide_scroll_depth', {
            milestone_pct: m,
            guide_id: article.getAttribute('data-guide-id') || ''
          });
        }
      });
    }

    window.addEventListener('scroll', checkDepth, { passive: true });
    checkDepth();
  }

  function initDisclosureObserver() {
    const nodes = document.querySelectorAll('[data-disclosure-placement]');
    if (!nodes.length) return;

    const seen = new Set();
    if ('IntersectionObserver' in window) {
      const obs = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            const placement = entry.target.getAttribute('data-disclosure-placement') || 'unknown';
            if (seen.has(placement)) return;
            seen.add(placement);
            dispatchEvent('disclosure_viewed', { placement: placement });
          });
        },
        { threshold: 0.25 }
      );
      nodes.forEach(function (n) {
        obs.observe(n);
      });
    } else {
      dispatchEvent('disclosure_viewed', { placement: 'masthead' });
    }
  }

  function initOutboundAffiliateTracking() {
    document.addEventListener('click', function (ev) {
      const link = ev.target && ev.target.closest ? ev.target.closest('a[data-affiliate-product]') : null;
      if (!link) return;

      let destHost = '';
      try {
        destHost = new URL(link.href).hostname;
      } catch (_) {
        destHost = 'unknown';
      }

      dispatchEvent('outbound_affiliate_click', {
        product_id: link.getAttribute('data-affiliate-product') || '',
        observed_asin: link.getAttribute('data-observed-asin') || '',
        tracking_id: link.getAttribute('data-tracking-id') || 'shopnow047c-20',
        placement: link.getAttribute('data-placement') || 'inline',
        destination_host: destHost,
        rel: link.getAttribute('rel') || ''
      });
    });
  }

  function initReaderCaptureTracking() {
    document.addEventListener('click', function (ev) {
      const rssTrigger = ev.target && ev.target.closest ? ev.target.closest('[data-reader-capture]') : null;
      if (!rssTrigger) return;
      dispatchEvent('reader_capture_intent', {
        channel: rssTrigger.getAttribute('data-reader-capture') || 'rss',
        label: rssTrigger.getAttribute('data-capture-label') || ''
      });
    });

    document.addEventListener('submit', function (ev) {
      const form = ev.target;
      if (!form || !form.matches || !form.matches('[data-reader-capture-form]')) return;
      ev.preventDefault();
      const topicInput = form.querySelector('[name="topic"]');
      const channel = form.getAttribute('data-reader-capture-form') || 'topic_request';
      const topicText = topicInput ? String(topicInput.value || '').trim().slice(0, 140) : '';

      dispatchEvent('reader_capture_intent', {
        channel: channel,
        topic_preview: topicText ? 'submitted' : 'empty'
      });

      const status = form.querySelector('[data-capture-status]');
      if (status) {
        status.textContent =
          'Recorded locally in the privacy-preserving event log (zero PII stored). Connect your self-hosted analytics endpoint in Analytics & Ledger to collect submissions server-side.';
        status.hidden = false;
      }
      if (topicInput) topicInput.value = '';
    });
  }

  window.DIYHOME2Analytics = {
    ALLOWED_EVENTS: Array.from(ALLOWED_EVENTS),
    dispatch: dispatchEvent,
    getEvents: readLocalEvents,
    getEndpoint: getConfiguredEndpoint,
    setEndpoint: function (url) {
      try {
        window.localStorage.setItem(ENDPOINT_KEY, String(url || '').trim());
      } catch (_) {}
    },
    clearLocalEvents: function () {
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch (_) {}
    }
  };

  document.addEventListener('DOMContentLoaded', function () {
    dispatchEvent('page_view', {
      referrer_host: getReferrerHost(),
      page_type: document.body.getAttribute('data-page-type') || 'page'
    });
    initScrollDepth();
    initDisclosureObserver();
    initOutboundAffiliateTracking();
    initReaderCaptureTracking();
  });
})();
