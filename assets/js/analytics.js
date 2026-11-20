/* DIY Home Upgrades — measurement.
 *
 * Five defined events. No cookies, no localStorage, no identifiers, no third party.
 *
 * The endpoint is deliberately empty in this repository. Set it to a collector
 * you host (see /signals/) and the events start arriving. Until then they are
 * logged to the console and discarded, which is why the site claims no
 * measurement today.
 *
 * Design note, and it matters legally: an outbound click is sent as a
 * non-blocking beacon and the browser is then allowed to follow the link
 * normally. We never route the visitor through this domain on the way to
 * Amazon. Amazon disqualifies purchases made through a link that passes an
 * intermediate site without an affirmative action there (a "Redirecting
 * Link"), so a redirect hop on this domain could cost the commission and
 * risks breaching the direct-access requirement.
 */
(function () {
  "use strict";

  var script = document.currentScript;
  var ENDPOINT = (script && script.getAttribute("data-endpoint")) || "";
  var EVENTS = ["page_view", "product_view", "outbound_click", "guide_complete", "subscribe"];

  var dnt =
    navigator.doNotTrack === "1" ||
    window.doNotTrack === "1" ||
    navigator.msDoNotTrack === "1" ||
    (navigator.globalPrivacyControl === true);
  if (dnt) return;

  function path() {
    return location.pathname
      .replace(/^\/DIYHOME2/, "")
      .replace(/index\.html$/, "")
      .replace(/\.html$/, "") || "/";
  }

  function pageType() {
    var p = path();
    if (p === "/") return "front";
    if (p.indexOf("/products/") === 0) return "product";
    if (p.indexOf("/guides/") === 0) return "guide";
    if (p.indexOf("/categories/") === 0) return "category";
    return "page";
  }

  function send(name, data) {
    if (EVENTS.indexOf(name) === -1) return null; // only the five defined events exist
    var payload = {
      e: name,
      p: path(),
      t: pageType(),
      d: data || {},
    };

    if (!ENDPOINT) {
      if (window.console && console.info) {
        console.info("[analytics] no endpoint configured:", payload);
      }
      return payload;
    }

    var body = JSON.stringify(payload);
    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon(ENDPOINT, new Blob([body], { type: "application/json" }));
      } else {
        fetch(ENDPOINT, {
          method: "POST",
          body: body,
          headers: { "Content-Type": "application/json" },
          keepalive: true,
          credentials: "omit",
          referrerPolicy: "origin",
        }).catch(function () {});
      }
    } catch (err) {
      /* measurement must never break navigation */
    }
    return payload;
  }

  /* 1. page_view ------------------------------------------------------- */
  send("page_view", { rh: document.referrer ? new URL(document.referrer).host : "" });

  /* 2. product_view ---------------------------------------------------- */
  var specTable = document.querySelector("#specs");
  if (specTable && "IntersectionObserver" in window) {
    var pv = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var asin = document.querySelector("[data-asin]");
          send("product_view", { asin: asin ? asin.getAttribute("data-asin") : "" });
          pv.disconnect();
        }
      });
    }, { threshold: 0.25 });
    pv.observe(specTable);
  }

  /* 3. outbound_click -------------------------------------------------- */
  document.addEventListener(
    "click",
    function (ev) {
      var a = ev.target && ev.target.closest ? ev.target.closest('a[rel~="sponsored"]') : null;
      if (!a) return;
      var host = "";
      try { host = new URL(a.href).host; } catch (e) { host = ""; }
      send("outbound_click", {
        asin: a.getAttribute("data-asin") || "",
        dh: host,
        lp: a.getAttribute("data-position") || "",
      });
      /* No preventDefault. No setTimeout navigation. The browser follows the
         link immediately; the beacon above is fire-and-forget. */
    },
    { capture: true }
  );

  /* 4. guide_complete -------------------------------------------------- */
  if (pageType() === "guide") {
    var started = Date.now();
    var done = false;
    window.addEventListener(
      "scroll",
      function () {
        if (done) return;
        var doc = document.documentElement;
        var seen = (window.scrollY + window.innerHeight) / doc.scrollHeight;
        var secs = Math.round((Date.now() - started) / 1000);
        if (seen >= 0.9 && secs >= 20) {
          done = true;
          send("guide_complete", {
            g: path().replace(/^\/guides\//, "").replace(/\/$/, ""),
            sb: secs < 60 ? "<60s" : secs < 180 ? "1-3m" : secs < 600 ? "3-10m" : "10m+",
          });
        }
      },
      { passive: true }
    );
  }

  /* 5. subscribe ------------------------------------------------------- */
  var form = document.querySelector("[data-capture]");
  if (form) {
    form.addEventListener("submit", function (ev) {
      /* No list is wired up yet, so nothing is transmitted anywhere. */
      ev.preventDefault();
      var status = form.querySelector("[data-capture-status]");
      if (status) {
        status.textContent =
          "Not connected yet. There is no mailing list behind this form, so nothing was sent anywhere.";
      }
      send("subscribe", { cs: "not_connected" });
    });
  }

  /* Small progressive enhancement: client-side filtering for the shop and
     search tables. Runs entirely in memory; nothing is transmitted. */
  function wireFilter(inputId, rowSelector, countId, noun) {
    var input = document.getElementById(inputId);
    if (!input) return;
    var rows = Array.prototype.slice.call(document.querySelectorAll(rowSelector));
    var count = countId ? document.getElementById(countId) : null;
    function apply() {
      var q = input.value.trim().toLowerCase();
      var shown = 0;
      rows.forEach(function (row) {
        var text = row.getAttribute("data-text") || row.getAttribute("data-name") || row.textContent.toLowerCase();
        var hit = !q || text.indexOf(q) !== -1;
        row.hidden = !hit;
        if (hit) shown += 1;
      });
      if (count) count.textContent = shown + " " + noun + (shown === 1 ? "" : "s");
    }
    input.addEventListener("input", apply);
    apply();
  }
  wireFilter("q", "#shop-table tbody tr", "count", "product");
  wireFilter("sq", "#search-table tbody tr", "scount", "page");
})();
