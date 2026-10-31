(()=>{
const q=s=>document.querySelector(s), qa=s=>[...document.querySelectorAll(s)];
let activeFilter='all',activeSort='match';
const typeMatches=(r,f)=> f==='all'||r.type===f||(f==='asian'&&['chinese','thai','japanese','korean','vietnamese'].includes(r.type))||(f==='healthy'&&r.type==='salad')||(f==='dessert'&&['dessert','ice_cream','bakery'].includes(r.type));
function draw(){if(!q('#all')?.classList.contains('active'))return;
 let data=typeof restaurants!=='undefined'?[...restaurants]:[];
 data=data.filter(r=>typeMatches(r,activeFilter));
 if(activeSort==='distance')data.sort((a,b)=>a.miles-b.miles);
 if(activeSort==='name')data.sort((a,b)=>a.name.localeCompare(b.name));
 const count=q('#all-count');if(count)count.textContent=data.length;
 const host=q('#all-list');if(!host)return;
 host.innerHTML=data.map(r=>{
  const tags=r.tags||{}, website=tags.website||tags['contact:website']||'',phone=tags.phone||tags['contact:phone']||'',menu=/^https?:\/\//i.test(website)?website:'https://www.google.com/search?q='+encodeURIComponent(r.name+' menu '+r.address);
  const maps='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(r.name+' '+r.lat+','+r.lon);
  const icon=({burger:'burger',pizza:'pizza',mexican:'mexican',chicken:'chicken',italian:'pizza',chinese:'asian',sushi:'sushi',steak:'steak',sandwich:'sandwich',salad:'healthy',indian:'indian',thai:'asian',breakfast:'breakfast',fast_food:'burger',seafood:'seafood',coffee:'coffee',dessert:'dessert'})[r.type]||'other';
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  return `<article class="v1450-row"><img src="cuisine-${icon}-v1441.png" alt="" loading="lazy"><div class="v1450-row-info"><strong>${esc(r.name)}</strong><small>${Number(r.miles).toFixed(1)} mi · ${esc(r.type.replace('_',' '))} · ${esc(r.address)}</small><small>${esc(tags.opening_hours?'Hours listed — verify before visiting':'Hours unconfirmed')} · ${esc(tags['price:range']||tags.price||'Price unconfirmed')}</small></div><div class="v1450-links"><a href="${esc(maps)}" target="_blank" rel="noopener">Directions</a><a href="${esc(menu)}" target="_blank" rel="noopener">Website / Menu</a>${phone?`<a href="tel:${esc(phone.replace(/[^+0-9]/g,''))}">Call</a>`:''}<button type="button" data-add-wheel="${esc(r.id)}">Add to wheel</button></div></article>`;
 }).join('')||'<div class="card">No matches in this category. Choose All or another cuisine.</div>';
 host.querySelectorAll('[data-add-wheel]').forEach(b=>b.addEventListener('click',()=>{
  const r=restaurants.find(x=>x.id===b.dataset.addWheel);if(!r)return;
  if(rejected.has(r.id)){rejected.delete(r.id);rejectionHistory=rejectionHistory.filter(x=>x!==r.id)}
  if(!wheelItems.some(x=>x.id===r.id)){if(wheelItems.length>=8){const i=wheelItems.findIndex(x=>!locked.has(x.id));if(i<0){alert('Unlock a contender first.');return;}wheelItems.splice(i,1)}wheelItems.push(r)}
  rotation=0;drawWheel();renderContenders();updateWheelStatus();show('wheel-screen');
 }));
}
function enter(){activeFilter='all';activeSort='match';qa('#all .lab-cuisine').forEach(b=>b.classList.toggle('active',b.dataset.filter==='all'));const sort=q('#lab-results-sort');if(sort)sort.value='match';setTimeout(draw,0);setTimeout(draw,150)}
document.addEventListener('click',e=>{
 const filter=e.target.closest('#all .lab-cuisine[data-filter]');if(filter){e.preventDefault();e.stopImmediatePropagation();activeFilter=filter.dataset.filter;qa('#all .lab-cuisine').forEach(b=>b.classList.toggle('active',b===filter));draw();return;}
 if(e.target.closest('#view-matches,#other'))setTimeout(enter,0);
},true);
q('#lab-results-sort')?.addEventListener('change',e=>{e.stopImmediatePropagation();activeSort=e.target.value;draw()},true);
new MutationObserver(()=>{if(q('#all')?.classList.contains('active'))enter()}).observe(q('#all'),{attributes:true,attributeFilter:['class']});
})();