/*
 * Reader capture — inert until window.DIYHOME_ENDPOINT is configured.
 * The email itself is POSTed only to the configured endpoint and is never
 * written to localStorage by analytics.js. Client-side validation + consent required.
 */
(function () {
  "use strict";
  var form = document.getElementById("capture-form");
  if (!form) return;
  var note = document.getElementById("capture-note");
  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    var email = document.getElementById("capture-email");
    var consent = document.getElementById("capture-consent");
    var value = (email.value || "").trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(value)) { note.textContent = "Please enter a valid email address."; return; }
    if (!consent.checked) { note.textContent = "Please tick the consent box before subscribing."; return; }
    var endpoint = window.DIYHOME_ENDPOINT || null;
    if (window.DIYHOME && window.DIYHOME.track) window.DIYHOME.track("reader_capture_submit", {});
    if (!endpoint) {
      note.textContent = "Not sent: no submission endpoint is configured yet (owner action). Your email was not stored anywhere.";
      return;
    }
    fetch(endpoint.replace(/\/+$/, "") + "/capture", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: value, source: "diyhome2-front", ts: Date.now() })
    }).then(function (r) {
      note.textContent = r.ok ? "Thank you — you'll get the next guide by email." : "The endpoint rejected the submission (HTTP " + r.status + "). Nothing was subscribed.";
      if (r.ok) form.reset();
    }).catch(function () {
      note.textContent = "Could not reach the endpoint. Nothing was subscribed.";
    });
  });
})();
