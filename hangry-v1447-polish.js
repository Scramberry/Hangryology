(()=>{
'use strict';
// When returning to a results list, reset the visible cuisine selector to All.
const all=document.getElementById('all');
if(!all)return;
const obs=new MutationObserver(()=>{
 if(!all.classList.contains('active'))return;
 // Ensure every card's image remains inside the compact artwork container.
 all.querySelectorAll('#all-list .result-card').forEach(card=>{
  const art=card.querySelector('.result-art');
  if(art)art.querySelectorAll('img').forEach(img=>{img.removeAttribute('width');img.removeAttribute('height')});
 });
});
obs.observe(all,{attributes:true,attributeFilter:['class']});
})();