(() => {
 const form=document.getElementById('hunger-experiment-form');
 const slider=document.getElementById('hangry-range');
 const zip=document.getElementById('hunger-zip');
 const button=document.getElementById('hunger-launch');
 const note=document.getElementById('hunger-experiment-note');
 if(!form||!slider||!zip||!button||!note)return;
 const actions=['🧪 BEGIN SNACK EXPERIMENT →','🔬 INITIATE SNACK PROTOCOL →','⚡ LAUNCH HUNGER EXPERIMENT →','🚀 ACTIVATE RAPID FOOD PROTOCOL →','🚨 INITIATE EMERGENCY FOOD PROTOCOL →'];
 const notes=[
  'Light bites and cafés take priority.',
  'Casual eats, sandwiches and snacks get a boost.',
  'Substantial meals get priority.',
  'Closer quick-service restaurants move to the top.',
  'Emergency! Closest quick-food options first. Live wait times are not available.'
 ];
 const titles=['THE SNACK LAB','SNACK ALERT','HUNGER WARNING','RAPID FOOD RESPONSE','CODE RED EMERGENCY'];
 const subtitles=[
  'Bunsen is curious. Byte is calmly investigating lighter bites.',
  'Bunsen wants a snack. Byte is picking up the pace.',
  'Hunger is rising. Byte is juggling meal calculations!',
  'Bunsen is ravenous! Byte is activating rapid response.',
  'CRITICAL HUNGER! Bunsen has gone feral. Byte is in full emergency mode!'
 ];
 const level=()=>Math.min(5,Math.max(1,Number(slider.value)||3));
 const status=(msg,error=false)=>{note.textContent=msg;note.classList.toggle('hunger-error',error)};
 function theme(){
  const i=level()-1;
  document.body.dataset.hungerLevel=String(i+1);
  document.querySelectorAll('.hunger-themed-banner').forEach(el=>{
   const title=el.querySelector('.hunger-title'),sub=el.querySelector('.hunger-subtitle');
   if(title)title.textContent=titles[i];
   if(sub)sub.textContent=subtitles[i];
  });
 }
 function refresh(){
  const i=level()-1;
  button.textContent=actions[i];status(notes[i]);
  if(document.body.classList.contains('hunger-experiment-active'))theme();
 }
 slider.addEventListener('input',refresh);
 try{zip.value=localStorage.getItem('hangryologyExperimentZip')||document.getElementById('zip')?.value||''}catch(e){}
 zip.addEventListener('input',()=>{zip.setCustomValidity('');if(note.classList.contains('hunger-error'))status(notes[level()-1])});
 form.addEventListener('submit',e=>{
  e.preventDefault();e.stopPropagation();
  if(button.disabled)return;
  const postal=zip.value.trim();
  if(!/^\d{5}$/.test(postal)){
   status('⚠️ Please enter a valid five-digit US ZIP code.',true);
   zip.focus();return;
  }
  button.disabled=true;
  status('🔬 Experiment initiated! Calibrating Byte’s restaurant search…');
  try{
   if(typeof window.hangryLaunchExperiment!=='function'){
    throw new Error('The restaurant search engine did not load. Refresh the page and try again.');
   }
   try{localStorage.setItem('hangryologyExperimentZip',postal)}catch(e){}
   document.body.classList.add('hunger-experiment-active');
   theme();
   const launched=window.hangryLaunchExperiment(postal,level());
   if(launched===false)throw new Error('Could not start the experiment. Check your ZIP code.');
   setTimeout(()=>{button.disabled=false},1200);
  }catch(err){
   button.disabled=false;
   status('⚠️ '+(err?.message||'Something interrupted the experiment. Please try again.'),true);
   console.error('Hangryology experiment launch:',err);
  }
 });
 refresh();
})();