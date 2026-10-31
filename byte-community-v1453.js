/* Community aggregates only. No personal/local ratings are presented as community data.
   Optional deployment setting: window.HANGRY_COMMUNITY_RATINGS_URL is an HTTPS
   read endpoint returning {average: number|null, count: integer} for ?restaurant=OSM_ID.
   No service is configured by this static GitHub Pages repository. */
(()=>{
 'use strict';
 const cache=new Map();
 function summary(data){
  const average=Number(data?.average),count=Number(data?.count);
  if(data?.average==null||!Number.isFinite(average)||average<1||average>5||!Number.isInteger(count)||count<1)return null;
  const displayed=average.toFixed(1);
  return {average:displayed,expression:Math.max(1,Math.min(5,Math.trunc(Number(displayed)))),count};
 }
 function markup(data,state='unavailable'){
  const r=summary(data);
  return `<div class="byte-community" aria-label="Byte-O-Meter community rating"><img src="byte-o-meter-${r?.expression||3}.webp" alt="${r?'Byte expression '+r.expression:'Byte awaiting community ratings'}" width="64" height="64"><div><strong>BYTE-O-METER</strong><span>${r?`${r.average} / 5 · ${r.count} community rating${r.count===1?'':'s'}`:state==='loading'?'Loading community rating…':state==='empty'?'No community ratings yet':'Community ratings unavailable'}</span>${r?'':`<small>${state==='loading'?'Checking for community ratings.':'A community score will appear here when available.'}</small>`}</div></div>`;
 }
 async function populate(slot,id){
  slot.dataset.restaurantId=id;
  let base;try{base=new URL(window.HANGRY_COMMUNITY_RATINGS_URL);if(base.protocol!=='https:')throw Error();}catch{slot.innerHTML=markup(null);return;}
  slot.innerHTML=markup(null,'loading');
  if(!cache.has(id)){
   base.searchParams.set('restaurant',id);
   cache.set(id,fetch(base.href,{credentials:'omit'}).then(r=>{if(!r.ok)throw Error('Rating service unavailable');return r.json();}).then(data=>({data,state:summary(data)?'ready':'empty'})).catch(()=>({data:null,state:'unavailable'})));
  }
  const result=await cache.get(id);
  if(slot.isConnected&&slot.dataset.restaurantId===id)slot.innerHTML=markup(result.data,result.state);
 }
 document.addEventListener('hangry:results-rendered',()=>document.querySelectorAll('.community-rating-slot').forEach(slot=>void populate(slot,slot.dataset.restaurantId)));
 document.addEventListener('hangry:winner',e=>{
  let slot=document.getElementById('winner-community-rating');
  if(!slot){slot=document.createElement('div');slot.id='winner-community-rating';document.getElementById('winner-details').after(slot);}
  void populate(slot,String(e.detail.restaurant.id));
 });
})();
