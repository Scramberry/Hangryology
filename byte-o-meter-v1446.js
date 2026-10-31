
/* Byte-O-Meter v1.4.46 — personal 1–5 restaurant satisfaction ratings.
   Stored locally on this device, not external restaurant reviews. */
(()=>{
  'use strict';
  const KEY='hangryology-byte-o-meter-v1';
  const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return {}}};
  const get=id=>Number(read()[id]||0);
  const save=(id,n)=>{const ratings=read();ratings[id]=n;localStorage.setItem(KEY,JSON.stringify(ratings))};
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','&#39;':'&#39;'}[c]));
  const labels=['','Not for me','Could be better','Pretty good','Really good','Absolutely delicious!'];
  function markup(id){
    const rating=get(id);
    return `<div class="byte-meter" data-byte-id="${esc(id)}">
      <span class="byte-meter-title">🤖 BYTE-O-METER <small>Rate your experience</small></span>
      <div class="byte-meter-options" role="group" aria-label="Rate this restaurant from 1 to 5">
      ${[1,2,3,4,5].map(n=>`<button type="button" class="byte-meter-choice ${rating===n?'selected':''}" data-byte-value="${n}" aria-label="${n} out of 5: ${labels[n]}" aria-pressed="${rating===n}">
       <img src="byte-o-meter-${n}.webp" alt="" loading="lazy"><span>${n}</span></button>`).join('')}
      </div><span class="byte-meter-caption" aria-live="polite">${rating?`${rating}/5 — ${labels[rating]}`:'How was the food? Tap Byte to rate.'}</span>
    </div>`;
  }
  function inject(){
    document.querySelectorAll('#all-list .result-card').forEach(card=>{
      if(card.querySelector('.byte-meter'))return;
      const btn=card.querySelector('.add-wheel');
      const id=btn?.dataset.wheel;
      if(!id)return;
      const body=card.querySelector('.result-body')||card;
      body.insertAdjacentHTML('beforeend',markup(id));
    });
    const winnerName=document.getElementById('winner-name');
    const winnerArea=document.querySelector('#winner .winner-details')||document.getElementById('winner-details');
    if(winnerName && winnerArea && !winnerArea.querySelector('.byte-meter')){
      const id=typeof winner!=='undefined' && winner?.id;
      if(id)winnerArea.insertAdjacentHTML('afterend',markup(id));
    }
    // Update the winner meter if a different restaurant wins.
    const w=document.querySelector('#winner .byte-meter');
    const id=typeof winner!=='undefined' && winner?.id;
    if(w && id && w.dataset.byteId!==String(id))w.outerHTML=markup(id);
  }
  document.addEventListener('click',e=>{
    const b=e.target.closest('.byte-meter-choice');
    if(!b)return;
    const meter=b.closest('.byte-meter');
    save(meter.dataset.byteId,Number(b.dataset.byteValue));
    meter.outerHTML=markup(meter.dataset.byteId);
  });
  const watch=document.getElementById('all-list');
  if(watch)new MutationObserver(()=>{queueMicrotask(inject)}).observe(watch,{childList:true});
  const winnerArea=document.getElementById('winner-details');
  if(winnerArea)new MutationObserver(()=>{queueMicrotask(inject)}).observe(winnerArea,{childList:true});
  document.addEventListener('click',e=>{
    if(e.target.closest('#spin,#other,#back-from-all,#again,#reject-winner'))setTimeout(inject,50);
  });
  document.addEventListener('DOMContentLoaded',inject);
  setTimeout(inject,500);
})();
