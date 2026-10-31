/* One results controller for every experiment; no competing card observers. */
(()=>{
 'use strict';
 let filter='all',sort='match';
 const root=document.getElementById('all'),host=document.getElementById('all-list');
 const filters=[...root.querySelectorAll('[data-filter]')],select=document.getElementById('lab-results-sort');
 const themes=[['THE SNACK LAB REPORT','Byte found a few tasty possibilities!'],['THE CRAVING INVESTIGATION',"Bunsen’s nose has detected something delicious!"],['OPERATION: FEED BUNSEN!','The cravings are escalating. Results are in!'],['EMERGENCY FOOD DISPATCH','Byte has located your next meal. Move quickly!'],['HANGRY EMERGENCY: TARGETS ACQUIRED!','Bunsen has officially lost his patience. Food rescue is underway!']];
 function matches(r){
  if(filter==='all')return true;
  if(filter==='asian')return ['chinese','thai','japanese','korean','vietnamese'].includes(r.type);
  if(filter==='healthy')return r.type==='salad';
  if(filter==='dessert')return ['dessert','ice_cream','bakery'].includes(r.type);
  return r.type===filter;
 }
 function draw(reset=false){
  if(reset){filter='all';sort='match';select.value=sort;}
  filters.forEach(b=>{const active=b.dataset.filter===filter;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
  const data=restaurants.filter(matches);
  if(sort==='distance')data.sort((a,b)=>(a.manual?Infinity:a.miles)-(b.manual?Infinity:b.miles));
  if(sort==='name')data.sort((a,b)=>a.name.localeCompare(b.name));
  const hunger=window.hangryExperimentActive===true;
  const level=Math.max(1,Math.min(5,Number(document.getElementById('hangry-range').value)||3));
  const words=['light bite','snack','meal','quick meal','emergency food'];
  root.querySelector('.lab-matches-title').innerHTML=hunger?`Your shortlist: <span class="count-pill" id="all-count">${data.length}</span> ${words[level-1]} pick${data.length===1?'':'s'}`:`We found <span class="count-pill" id="all-count">${data.length}</span> delicious matches!`;
  root.querySelector('.lab-results-intro').textContent=hunger?[
   'Lighter bites and cafés, with fewer repeat chains.',
   'Snack-friendly options nearby, with fewer repeat chains.',
   'Substantial meals, narrowed down to an easier decision.',
   'A few nearby quick-food choices. Menus and wait times need confirmation.',
   'Your nearest quick-food shortlist. Live wait times are not available.'
  ][level-1]:'Here are the nearby restaurants discovered by Byte and Bunsen.';
  const i=Math.max(0,Math.min(4,(Number(document.body.dataset.hungerLevel)||3)-1));
  root.querySelector('.hunger-title').textContent=themes[i][0];
  root.querySelector('.hunger-subtitle').textContent=themes[i][1];
  document.getElementById('back-from-all').textContent=window.hangryExperimentActive?'← Start Over · Hangry Meter':'← Return to Experiment';
  host.innerHTML=data.map(r=>{
   const tags=r.tags||{},phone=tags.phone||tags['contact:phone']||'';
   return `<article class="v1450-row"><img width="70" height="70" src="${cuisineIcon(r.type)}" alt="" loading="lazy"><div class="v1450-row-info"><strong>${escapeHtml(r.name)}</strong><small>${r.manual?'Distance unverified':r.miles.toFixed(1)+' mi'} · ${escapeHtml(r.type.replaceAll('_',' '))} · ${escapeHtml(r.address)}</small><small>${tags.opening_hours?'Hours listed — verify before visiting':'Hours unconfirmed'} · ${escapeHtml(priceInfo(tags).label)}</small><div class="community-rating-slot" data-restaurant-id="${escapeHtml(r.id)}"></div></div><div class="v1450-links"><a href="${escapeHtml(mapUrl(r))}" target="_blank" rel="noopener noreferrer">Directions</a><a href="${escapeHtml(menuUrl(r))}" target="_blank" rel="noopener noreferrer">Website / Menu</a>${phone?`<a href="tel:${escapeHtml(phone.replace(/[^+0-9]/g,''))}">Call</a>`:''}<button type="button" data-add-wheel="${escapeHtml(r.id)}">Add to wheel</button></div></article>`;
  }).join('')||'<div class="card" role="status">No matches in this category. Choose All or another cuisine.</div>';
  document.dispatchEvent(new Event('hangry:results-rendered'));
 }
 filters.forEach(b=>b.addEventListener('click',()=>{filter=b.dataset.filter;draw();}));
 select.addEventListener('change',()=>{sort=select.value;draw();});
 root.querySelectorAll('.lab-scroll-btn').forEach(b=>b.addEventListener('click',()=>root.querySelector('.lab-cuisine-filters').scrollBy({left:Number(b.dataset.dir)*320,behavior:'smooth'})));
 host.addEventListener('click',e=>{
  const b=e.target.closest('[data-add-wheel]');if(!b)return;
  const r=restaurants.find(x=>x.id===b.dataset.addWheel);if(!r||spinning)return;
  if(!wheelItems.some(x=>x.id===r.id)){
   if(wheelItems.length>=8){const i=wheelItems.findIndex(x=>!locked.has(x.id));if(i<0){alert('All eight contenders are locked. Unlock one first.');return;}wheelItems.splice(i,1);}
   wheelItems.push(r);
  }
  rejected.delete(r.id);rejectionHistory=rejectionHistory.filter(x=>x!==r.id);
  wheelTargetSize=wheelItems.length;rotation=0;drawWheel();renderContenders();updateWheelStatus();show('wheel-screen');
 });
 window.hangryRenderResults=draw;
})();
