/* Renders this browser's local event counts on the dashboard. Nothing is transmitted. */
(function () {
  "use strict";
  var KEY = "dh_events_v1";
  var box = document.getElementById("local-events");
  var btn = document.getElementById("clear-local");
  function render() {
    if (!box) return;
    var rows = [];
    try { rows = JSON.parse(localStorage.getItem(KEY) || "[]"); } catch (e) {}
    if (!rows.length) { box.innerHTML = '<p class="fine-print">No local events yet. Browse the site — this page counts page_view and guide_read locally, plus clicks on sponsored links and RSS links.</p>'; return; }
    var counts = {};
    rows.forEach(function (r) { counts[r.e] = (counts[r.e] || 0) + 1; });
    var order = ["page_view", "guide_read", "affiliate_outbound_click", "feed_subscribe_click", "reader_capture_submit"];
    box.innerHTML = order.map(function (k) { return '<span class="ev"><b>' + (counts[k] || 0) + '</b><br>' + k + '</span>'; }).join("");
  }
  if (btn) btn.addEventListener("click", function () {
    if (window.confirm("Erase all locally stored analytics events in this browser?")) {
      try { localStorage.removeItem(KEY); } catch (e) {}
      render();
    }
  });
  render();
})();
