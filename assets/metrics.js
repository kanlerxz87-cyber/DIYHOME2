// Only the optional same-origin server injects this opt-in deployment flag.
if (document.querySelector('meta[name="aggregate-metrics"]') && navigator.doNotTrack !== '1' && !navigator.globalPrivacyControl) {
  const page = document.querySelector('main').dataset.page;
  const record = event => fetch('events', {method:'POST', body:JSON.stringify({page,event}), credentials:'omit', referrerPolicy:'no-referrer', keepalive:true}).catch(() => {});
  record('page_view');
  if (document.querySelector('article.prose')) record('guide_view');
  document.addEventListener('click', ({target}) => {
    const link = target.closest('a');
    if (!link) return;
    if (link.relList.contains('sponsored')) record(link.dataset.paid === 'true' ? 'affiliate_click' : 'listing_reference_click');
    if (link.getAttribute('href') === 'feed.xml') record('feed_click');
  });
}
