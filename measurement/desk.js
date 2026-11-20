const events = {page_view:'Page views',guide_view:'Guide views',listing_reference_click:'Listing references',affiliate_click:'Affiliate clicks',feed_click:'Feed opens'};
const cards=document.querySelector('#metrics');
async function refresh(){
 let counts=null;
 try{if(!deskPrivacy.live)throw 0;const r=await fetch('api/summary',{credentials:'omit'});if(r.ok){const d=await r.json();if(d.events && typeof d.events==='object')counts=d.events}}catch{}
 document.querySelector('#mode').textContent=counts?'Counter connected · All-time, opted-in events on this host.':'Static edition · No live counter connected. Unavailable values are not zero.';
 cards.replaceChildren();Object.entries(events).forEach(([key,title],i)=>{const card=document.createElement('div');card.className='metric';for(const [tag,text] of [['small',`SIGNAL / 0${i+1}`],['strong',counts?(counts[key]??0).toLocaleString():'—'],['b',title]]){const el=document.createElement(tag);el.textContent=text;card.append(el)}cards.append(card)});
 const box=document.querySelector('#consent');box.checked=deskPrivacy.enabled();box.disabled=!counts || deskPrivacy.blocked;
 document.querySelector('#privacy-note').textContent=deskPrivacy.blocked?'Your browser privacy signal disables collection.':counts?'Off unless you opt in.':'Collection is unavailable on this static edition.';
}
document.querySelector('#refresh').addEventListener('click',refresh);document.querySelector('#consent').addEventListener('change',e=>{deskPrivacy.set(e.target.checked);setTimeout(refresh,250)});refresh();
