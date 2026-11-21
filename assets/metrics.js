// Only the optional same-origin server injects this opt-in deployment flag.
(() => {
  if (!document.querySelector('meta[name="aggregate-metrics"]')) return;
  if (navigator.doNotTrack === '1' || navigator.globalPrivacyControl) return;
  const main = document.querySelector('main');
  // Resolve the endpoint from this script's own URL, so a page nested one or two
  // directories deep posts to the same collector as the root pages instead of a
  // path that does not exist. No identifier, cookie or query string is sent.
  const src = document.currentScript && document.currentScript.src;
  const endpoint = src ? src.replace(/assets\/metrics\.js(\?.*)?$/, 'events') : 'events';
  if (!/\/events$/.test(endpoint)) return;
  const page = (main && main.dataset.page) || 'unknown';
  const record = event => fetch(endpoint, {method:'POST', body:JSON.stringify({page,event}), credentials:'omit', referrerPolicy:'no-referrer', keepalive:true}).catch(() => {});
  record('page_view');
  if (document.querySelector('article.prose')) record('guide_view');
  document.addEventListener('click', ({target}) => {
    const link = target.closest('a');
    if (!link) return;
    if (link.relList.contains('sponsored')) record(link.dataset.paid === 'true' ? 'affiliate_click' : 'listing_reference_click');
    if (link.getAttribute('href') === 'feed.xml') record('feed_click');
  });
})();
