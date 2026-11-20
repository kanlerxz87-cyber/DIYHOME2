(() => {
  const endpoint = document.querySelector('meta[name="metrics-endpoint"]')?.content;
  if (!endpoint || navigator.globalPrivacyControl || navigator.doNotTrack === '1') return;
  const page = location.pathname.split('/').pop() || 'index.html';
  const send = event => fetch(endpoint, {method:'POST', credentials:'omit', referrerPolicy:'no-referrer', keepalive:true, body:JSON.stringify({page,event})}).catch(() => {});
  send('page_view');
  if (/^b[a-z0-9]{9}\.html$/.test(page)) send('guide_view');
  function click(e) {
    const a = e.target.closest('a');
    if (a?.relList.contains('sponsored')) send('outbound_click');
    else if (a?.getAttribute('href') === 'feed.xml') send('rss_click');
  }
  document.addEventListener('click', click);
  document.addEventListener('auxclick', e => { if(e.button === 1) click(e); });
})();
