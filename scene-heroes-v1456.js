/* Actual in-flow hero images: legacy background gradients cannot obscure them. */
(()=>{
 'use strict';
 const screenIds=['all','wheel-screen','search-error'];
 const levelNames=['Just Peckish','Getting Snacky','Hangry and Dangerous','Feed Me Now','Code Red Emergency'];
 function fit(){document.documentElement.style.setProperty('--scene-viewport-width',document.documentElement.clientWidth+'px');}
 function update(){
  const active=window.hangryExperimentActive===true;
  const n=Math.max(1,Math.min(5,Number(document.getElementById('hangry-range').value)||3));
  document.getElementById('other').textContent=active?'🔎 Explore Your Shortlist':'🔎 Explore All Matches';
  document.getElementById('view-matches').textContent=active?'🔎 View shortlist':'🔎 View all matches';
  for(const id of screenIds){
   const section=document.getElementById(id);let hero=section.querySelector('.level-scene-hero');
   if(!hero){
    hero=document.createElement('figure');hero.className='scene-hero level-scene-hero';
    const img=document.createElement('img');img.width=2172;img.height=724;img.decoding='async';
    hero.append(img);section.prepend(hero);
   }
   hero.hidden=!active;
   if(active){
    const img=hero.querySelector('img'),src=`hangry-banner-level-${n}-v1435.webp`;
    if(img.getAttribute('src')!==src)img.src=src;
    img.alt=`Hangry level ${n}: ${levelNames[n-1]} — Byte and Bunsen in their ${['green','yellow','orange','red-orange','red'][n-1]} food laboratory`;
   }
  }
  fit();
 }
 document.addEventListener('hangry:screen',update);
 document.getElementById('hangry-range').addEventListener('input',update);
 window.addEventListener('resize',fit);
 new ResizeObserver(fit).observe(document.documentElement);
 update();
})();
