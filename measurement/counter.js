/* Load with defer. Only same-origin deployments with explicit visitor opt-in send events. */
(() => {
 const endpoint = new URL('api/event', document.currentScript.src);
 const key = 'diyhome-count-consent';
 const blocked = navigator.doNotTrack === '1' || navigator.globalPrivacyControl === true;
 function enabled(){try{return !blocked && localStorage.getItem(key)==='yes'}catch{return false}}
 function record(event){if(enabled() && endpoint.origin===location.origin) fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({event}),keepalive:true,credentials:'omit',referrerPolicy:'no-referrer'}).catch(()=>{});}
 window.deskPrivacy={blocked,enabled,set(value){try{value ? localStorage.setItem(key,'yes') : localStorage.removeItem(key)}catch{} if(value) record('page_view')}};
 record('page_view');
 document.addEventListener('click', e=>{const a=e.target.closest('a');if(!a)return;
 if(a.relList.contains('sponsored') && a.origin!==location.origin)record('outbound_click');
 else if(['guide_open','comparison_open','feed_open'].includes(a.dataset.event))record(a.dataset.event);
 });
})();
