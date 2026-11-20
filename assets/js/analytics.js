/*
 * DIY Home Upgrades — privacy-preserving analytics.
 * Five defined events: page_view, guide_read, affiliate_outbound_click,
 * feed_subscribe_click, reader_capture_submit.
 * No cookies. No fingerprinting. No persistent ID. No PII in payloads.
 * Delivery: localStorage only unless window.DIYHOME_ENDPOINT is configured,
 * in which case navigator.sendBeacon delivers a JSON row per event.
 */
(function () {
  "use strict";
  var KEY = "dh_events_v1";

  function pathOnly() { return location.pathname; }
  function referrerHost() {
    try { return document.referrer ? new URL(document.referrer).host : null; }
    catch (e) { return null; }
  }
  function load() {
    try { return JSON.parse(localStorage.getItem(KEY) || "[]"); }
    catch (e) { return []; }
  }
  function store(evt) {
    var rows = load();
    rows.push(evt);
    if (rows.length > 500) rows = rows.slice(-500);
    try { localStorage.setItem(KEY, JSON.stringify(rows)); } catch (e) { /* storage full/blocked: fail silent */ }
  }
  function beacon(evt) {
    var url = window.DIYHOME_ENDPOINT;
    if (!url) return;
    try {
      var body = JSON.stringify(evt);
      if (navigator.sendBeacon) { navigator.sendBeacon(url, new Blob([body], { type: "application/json" })); }
      else { fetch(url, { method: "POST", body: body, headers: { "Content-Type": "application/json" }, keepalive: true }).catch(function(){}); }
    } catch (e) { /* never break the page for analytics */ }
  }
  function track(name, props) {
    var evt = { e: name, t: Date.now(), p: pathOnly() };
    if (props) { for (var k in props) evt[k] = props[k]; }
    store(evt);
    beacon(evt);
  }
  window.DIYHOME = { track: track, KEY: KEY };

  // 1) page_view
  var ref = referrerHost();
  track("page_view", ref ? { ref: ref } : {});

  // 2) guide_read — fire once when the visitor reaches 70% scroll depth on a guide
  var article = document.querySelector(".article");
  if (article) {
    var fired = false;
    var onScroll = function () {
      if (fired) return;
      var doc = document.documentElement;
      var max = doc.scrollHeight - doc.clientHeight;
      if (max > 0 && (doc.scrollTop / max) >= 0.7) {
        fired = true;
        track("guide_read", { guide: location.pathname.split("/").pop().replace(/\.html$/, "") });
        window.removeEventListener("scroll", onScroll);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // 3) affiliate_outbound_click and 4) feed_subscribe_click — delegated
  document.addEventListener("click", function (ev) {
    var t = ev.target;
    var a = t.closest ? t.closest("a[data-affiliate]") : null;
    if (a) {
      var host = null;
      try { host = new URL(a.href, location.href).host; } catch (e) {}
      track("affiliate_outbound_click", { host: host });
    }
    var feed = t.closest ? t.closest("a[data-feed-subscribe]") : null;
    if (feed) { track("feed_subscribe_click", {}); }
  }, { passive: true });
})();
