(()=> {
 const form=document.getElementById('hunger-experiment-form');
 const slider=document.getElementById('hangry-range');
 if(!form||!slider)return;
 const zip=document.getElementById('hunger-zip');
 const button=document.getElementById('hunger-launch');
 const note=document.getElementById('hunger-experiment-note');
 const names=['JUST PECKISH','GETTING SNACKY','HANGRY & DANGEROUS','FEED ME NOW!','CODE RED EMERGENCY'];
 const actions=['🧪 BEGIN SNACK EXPERIMENT →','🔬 INITIATE SNACK PROTOCOL →','⚡ LAUNCH HUNGER EXPERIMENT →','🚀 ACTIVATE RAPID FOOD PROTOCOL →','🚨 INITIATE EMERGENCY FOOD PROTOCOL →'];
 const notes=[
 'Light bites, cafés and snacks take priority. Plenty of time to explore.',
 'Casual eats, sandwiches, pizza and tacos get a boost.',
 'Time for a substantial meal. Full-service choices get priority.',
 'Quick-service restaurants and closer options move to the top.',
 'Code Red! Closest quick-food options first. Live wait times are not available.'
 ];
 const subtitles=[
 'Bunsen is curious. Byte is calmly investigating lighter bites.',
 'Bunsen wants a snack. Byte is picking up the pace.',
 'Hunger is rising. Byte is juggling meal calculations!',
 'Bunsen is ravenous! Byte is activating rapid response.',
 'CRITICAL HUNGER! Bunsen has gone feral. Byte is in full emergency mode!'
 ];
 const titles=['THE SNACK LAB','SNACK ALERT','HUNGER WARNING','RAPID FOOD RESPONSE','CODE RED EMERGENCY'];
 function level(){return Math.max(1,Math.min(5,Number(slider.value)||3))}
 function refresh(){
  const i=level()-1;
  button.textContent=actions[i];
  note.textContent=notes[i];
  if(document.body.classList.contains('hunger-experiment-active'))theme();
 }
 function theme(){
  const i=level()-1;
  document.body.dataset.hungerLevel=String(i+1);
  document.querySelectorAll('.hunger-themed-banner').forEach(b=>{
   b.querySelector('.hunger-title').textContent=titles[i];
   b.querySelector('.hunger-subtitle').textContent=subtitles[i];
  });
 }
 slider.addEventListener('input',refresh);
 zip.value=localStorage.getItem('hangryologyExperimentZip')||document.getElementById('zip')?.value||'';
 form.addEventListener('submit',e=>{
  e.preventDefault();
  const postal=zip.value.trim();
  if(!/^\d{5}$/.test(postal)){zip.setCustomValidity('Enter a valid 5-digit US ZIP code.');zip.reportValidity();return}
  zip.setCustomValidity('');
  if(typeof window.hangryLaunchExperiment!=='function'){
   alert('The experiment engine is not ready. Please refresh the page.');return;
  }
  localStorage.setItem('hangryologyExperimentZip',postal);
  document.body.classList.add('hunger-experiment-active');
  theme();
  window.hangryLaunchExperiment(postal,level());
 });
 zip.addEventListener('input',()=>zip.setCustomValidity(''));
 // Recalibration: the same home slider updates theme on subsequent experiments.
 // Existing non-experiment modes remain untouched.
 refresh();
})();