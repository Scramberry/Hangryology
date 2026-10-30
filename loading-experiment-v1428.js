/* Stage-driven progress, never claims a percentage of server completion. */
(()=>{
 const track=document.getElementById('hangry-loading-track');
 const fill=document.getElementById('hangry-loading-fill');
 const label=document.getElementById('hangry-loading-stage');
 if(!track||!fill||!label)return;
 const update=(percent,stage,waiting=false)=>{
  fill.style.width=percent+'%';label.textContent=stage;
  track.setAttribute('aria-valuenow',String(percent));track.setAttribute('aria-valuetext',stage);
  track.classList.toggle('is-waiting',waiting);
 };
 document.addEventListener('hangry:search-start',()=>update(5,'PREPARING FOOD EXPERIMENT'));
 document.addEventListener('hangry:search-stage',e=>{
  const stage=e.detail?.stage;
  if(stage==='location')update(15,'CHECKING YOUR ZIP CODE');
  if(stage==='nearby')update(32,'LOCATING NEARBY RESTAURANTS',true);
  if(stage==='results')update(85,'ANALYZING RESTAURANT MATCHES');
 });
 document.addEventListener('hangry:search-progress',e=>{
  const msg=String(e.detail?.message||'');
  if(/Server attempts|Searching within|Restaurant server busy|Trying again/i.test(msg))update(42,'CONTACTING RESTAURANT SERVERS',true);
  if(/saved nearby restaurants/i.test(msg))update(85,'READING SAVED RESULTS');
 });
})();