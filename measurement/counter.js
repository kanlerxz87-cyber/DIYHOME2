(() => {
 const key='diyhome-count-consent', live=!!document.querySelector('meta[name="aggregate-metrics"]');
 const blocked = navigator.doNotTrack === '1' || navigator.globalPrivacyControl === true;
 function enabled(){try{return !blocked && localStorage.getItem(key)==='yes'}catch{return false}}
 function record(){if(live && enabled())fetch('../events',{method:'POST',body:JSON.stringify({page:'measurement',event:'page_view'}),keepalive:true,credentials:'omit',referrerPolicy:'no-referrer'}).catch(()=>{});}
 window.deskPrivacy={blocked,enabled,live,set(value){try{value ? localStorage.setItem(key,'yes') : localStorage.removeItem(key)}catch{} if(value)record()}};
 record();
})();
