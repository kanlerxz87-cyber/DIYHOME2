(async () => {
  if (navigator.globalPrivacyControl || navigator.doNotTrack === '1') return;
  const endpoint = new URL('../_events', document.currentScript?.src || new URL('site/events.js', location.href));
  try {
    const response = await fetch(endpoint, { credentials: 'omit', cache: 'no-store' });
    if (!response.ok || (await response.text()) !== 'aggregate-events-v1') return;
  } catch { return; }
  const page = document.body.dataset.page;
  const send = event => fetch(endpoint, {method:'POST', credentials:'omit', keepalive:true, headers:{'Content-Type':'application/json'}, body:JSON.stringify({event,page})}).catch(() => {});
  send('page_view');
  if (['walls','counter','cabinet','guides'].includes(page)) send('guide_view');
  if (['walls','counter','cabinet'].includes(page)) send('product_view');
  const outbound = e => {
    if (e.type === 'auxclick' && e.button !== 1) return;
    if (e.target.closest('a[rel~="sponsored"]')) send('outbound_click');
  };
  document.addEventListener('click', outbound);
  document.addEventListener('auxclick', outbound);
})();
