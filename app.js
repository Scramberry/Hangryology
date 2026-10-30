const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const categories=[['🍔','Burgers','burger'],['🍕','Pizza','pizza'],['🌮','Mexican','mexican'],['🍗','Chicken','chicken'],['🍝','Italian','italian'],['🥡','Chinese','chinese'],['🍣','Sushi','sushi'],['🥩','Steak','steak'],['🥪','Sandwiches','sandwich'],['🥗','Salads','salad'],['🍛','Indian','indian'],['🍜','Thai','thai'],['🍳','Breakfast','breakfast'],['🍟','Fast Food','fast_food'],['🦐','Seafood','seafood']];
const chainFries=['mcdonald','burger king','wendy','five guys','chick-fil-a','chick fil a','popeyes','culver','shake shack','sonic','checkers','rally','dairy queen','hardee','carls jr','jack in the box','whataburger','in-n-out','arbys','arby’s','kfc'];
let mode='spin',excluded=new Set(),excluded2=new Set(),soloExcluded=new Set(),restaurants=[],rotation=0,spinning=false,winner=null,geo=null;
const favorites=()=>JSON.parse(localStorage.getItem('dinnerRouletteFavorites')||'[]');
const saveFavorites=a=>localStorage.setItem('dinnerRouletteFavorites',JSON.stringify(a));
const show=id=>{ if(id==='home')return resetToHome(); $$('.screen').forEach(e=>e.classList.toggle('active',e.id===id));window.scrollTo({top:0,behavior:'instant'});if(id==='saved')renderSaved();};
// Each experiment begins with clean choices. Restaurant search cache is shared,
// but wheel exclusions and each person's preferences are never carried across modes.
function clearChips(id){$$('#'+id+' .chip').forEach((b,i)=>b.classList.toggle('selected',i===0))}
function resetExperiment(){
 searchGeneration++;stopActiveRequests();
 excluded.clear();excluded2.clear();soloExcluded.clear();
 $$('[data-category], [data-category2], [data-category-solo]').forEach(b=>b.classList.remove('excluded'));
 ['service','solo-fries','solo-vibe','fries','vibe','fries2','vibe2'].forEach(clearChips);
 restaurants=[];wheelItems=[];wheelTargetSize=8;rejected.clear();locked.clear();rejectionHistory=[];
 winner=null;rotation=0;spinning=false;
 $('#spin').disabled=false;
 $('#all-list').innerHTML='';$('#contenders').innerHTML='';
 $('#chemistry-results').classList.add('hidden');
 $('#chemistry-setup').classList.toggle('hidden',mode!=='date');
 $('#solo-cuisines').classList.toggle('hidden',mode==='date');
 $('#quiz-heading').textContent=mode==='date'?'Craving Chemistry: Two separate appetites.':'Time for your food diagnosis.';
 $('#quiz-player1').classList.toggle('hidden',mode==='date');
 $('#quiz-solo').classList.toggle('hidden',mode==='date');
 $('#player2').classList.add('hidden');
 $('#continue').textContent=mode==='date'?'Continue to Player 1 →':'Continue →';
}
function resetToHome(){
 mode='spin';
 window.hangryExperimentActive=false;
 document.body.classList.remove('hunger-experiment-active');
 delete document.body.dataset.hungerLevel;
 resetExperiment();
 const slider=document.getElementById('hangry-range');
 if(slider){slider.value='3';slider.dispatchEvent(new Event('input',{bubbles:true}));}
 try{localStorage.removeItem('hangryologyLevel');localStorage.removeItem('hangryologyExperimentZip')}catch(e){}
 const zip=document.getElementById('zip');if(zip)zip.value='';
 const experimentZip=document.getElementById('hunger-zip');if(experimentZip)experimentZip.value='';
 const radius=document.getElementById('radius');if(radius)radius.value='10';
 $$('.screen').forEach(e=>e.classList.toggle('active',e.id==='home'));
 window.scrollTo({top:0,behavior:'instant'});
}
function enterMode(next){
 window.hangryExperimentActive=false;
 document.body.classList.remove('hunger-experiment-active');
 delete document.body.dataset.hungerLevel;
 mode=next;resetExperiment();show('setup')
}
$$('[data-go]').forEach(b=>b.addEventListener('click',()=>{
 if(b.dataset.mode){enterMode(b.dataset.mode)}
 else if(b.dataset.go==='wheel-screen'&&!wheelItems.length){enterMode('spin')}
 else show(b.dataset.go);
 $('#mobile-menu').classList.remove('open');
}));
$$('[data-mode]').forEach(b=>b.addEventListener('click',()=>enterMode(b.dataset.mode)));
$('#reset-experiment').addEventListener('click',()=>{if(confirm('Reset the experiment and return to Mission Control? Your saved favorites will stay.'))resetToHome()});
$('#reset-from-results').addEventListener('click',resetToHome);
$('#cuisinesSolo').innerHTML=categories.map(([emoji,label,id])=>`<button class="food" data-category-solo="${id}"><span>${emoji}</span>${label}</button>`).join('');
$$('[data-category-solo]').forEach(b=>b.addEventListener('click',()=>{const c=b.dataset.categorySolo;soloExcluded.has(c)?soloExcluded.delete(c):soloExcluded.add(c);b.classList.toggle('excluded',soloExcluded.has(c))}));
$('#cuisines').innerHTML=categories.map(([emoji,label,id])=>`<button class="food" data-category="${id}"><span>${emoji}</span>${label}</button>`).join('');
$('#cuisines2').innerHTML=categories.map(([emoji,label,id])=>`<button class="food" data-category2="${id}"><span>${emoji}</span>${label}</button>`).join('');
$$('[data-category2]').forEach(b=>b.addEventListener('click',()=>{const c=b.dataset.category2;excluded2.has(c)?excluded2.delete(c):excluded2.add(c);b.classList.toggle('excluded',excluded2.has(c))}));
$$('[data-category]').forEach(b=>b.addEventListener('click',()=>{const c=b.dataset.category;excluded.has(c)?excluded.delete(c):excluded.add(c);b.classList.toggle('excluded',excluded.has(c))}));
for(const id of ['service','solo-fries','solo-vibe','fries','vibe','fries2','vibe2']){$$('#'+id+' .chip').forEach(b=>b.addEventListener('click',()=>{$$('#'+id+' .chip').forEach(x=>x.classList.remove('selected'));b.classList.add('selected')}))}
const chosen=id=>$('#'+id+' .selected')?.dataset.value||'any';
$('#continue').addEventListener('click',()=>{
 if(!/^\d{5}$/.test($('#zip').value.trim())&&!geo){alert('Please enter a valid 5-digit US ZIP code or use your location.');return}
 if(mode==='date'){show('chemistry-player1');return}
 if(mode==='spin'||mode==='browse'||+$('#hangry-range').value>=4)search();else show('quiz');
});
$('#find').addEventListener('click',search);
$('#chemistry-next').addEventListener('click',()=>show('chemistry-player2'));
$('#chemistry-find').addEventListener('click',search);
$('#chemistry-back1').addEventListener('click',()=>show('chemistry-player1'));
$('#locate').addEventListener('click',()=>{if(!navigator.geolocation){alert('Location is not supported on this device.');return}navigator.geolocation.getCurrentPosition(p=>{geo={lat:p.coords.latitude,lon:p.coords.longitude,label:'Your location'};$('#zip').value='';alert('Location ready!')},()=>alert('Location permission was unavailable. You can enter a ZIP code instead.'),{timeout:12000})});
function haversine(a,b,c,d){const r=Math.PI/180,x=(c-a)*r,y=(d-b)*r,z=Math.sin(x/2)**2+Math.cos(a*r)*Math.cos(c*r)*Math.sin(y/2)**2;return 3958.8*2*Math.atan2(Math.sqrt(z),Math.sqrt(1-z))}
function cuisineFor(tags){const raw=[tags.cuisine||'',tags.name||'',tags['name:en']||'',tags.amenity||''].join(' ').toLowerCase();if(tags.amenity==='fast_food')return 'fast_food';for(const [,,id] of categories){const words={burger:['burger','hamburger'],mexican:['mexican','taco','burrito'],chicken:['chicken','wings'],steak:['steak','steakhouse'],sandwich:['sandwich','sub'],salad:['salad','healthy'],breakfast:['breakfast','brunch','pancake'],seafood:['seafood','fish'],sushi:['sushi','japanese'],chinese:['chinese'],pizza:['pizza'],italian:['italian','pasta'],indian:['indian'],thai:['thai']}[id]||[];if(words.some(w=>raw.includes(w)))return id}return 'other'}
function hasFries(name){return chainFries.some(c=>name.toLowerCase().includes(c))}
function address(t){return [t['addr:housenumber'],t['addr:street'],t['addr:city']].filter(Boolean).join(' ')||'Address not listed — open directions'}
const SEARCH_CACHE_KEY='hangryology_search_cache_v130';
let searchGeneration=0;
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
function cacheRead(key){try{const obj=JSON.parse(localStorage.getItem(SEARCH_CACHE_KEY)||'{}');return obj[key]?.elements?.length?obj[key]:null}catch{return null}}
function cacheWrite(key,elements){try{let obj=JSON.parse(localStorage.getItem(SEARCH_CACHE_KEY)||'{}');obj[key]={saved:Date.now(),elements};const keys=Object.keys(obj).sort((a,b)=>obj[b].saved-obj[a].saved).slice(0,8);obj=Object.fromEntries(keys.map(k=>[k,obj[k]]));localStorage.setItem(SEARCH_CACHE_KEY,JSON.stringify(obj))}catch(e){console.warn('Restaurant cache unavailable:',e)}}
function progress(message){const el=$('#loading-text');if(el)el.textContent=message;document.dispatchEvent(new CustomEvent('hangry:search-progress',{detail:{message}}))}
function getRestaurantsFromData(data,point,miles){
 const seen=new Set();return (data.elements||[]).map(e=>{const t=e.tags||{},lat=e.lat??e.center?.lat,lon=e.lon??e.center?.lon,name=t.name||t['name:en'];if(!name||lat==null||lon==null)return null;return {id:`${e.type}-${e.id}`,name,lat,lon,address:address(t),type:cuisineFor(t),miles:haversine(point.lat,point.lon,lat,lon),tags:t}}).filter(Boolean).filter(r=>{const key=`${r.name.toLowerCase()}-${r.lat.toFixed(3)}-${r.lon.toFixed(3)}`;if(seen.has(key))return false;seen.add(key);return r.miles<=miles&&!(mode==='quiz'&&soloExcluded.has(r.type))&&!(mode==='date'&&excluded.has(r.type))&&!(mode==='date'&&excluded2.has(r.type))});
}
function presentResults(data,point,miles){
 document.dispatchEvent(new CustomEvent('hangry:search-stage',{detail:{stage:'results'}}));
 restaurants=getRestaurantsFromData(data,point,miles);
 if(mode==='quiz'){
  const fries=chosen('solo-fries'),vibe=chosen('solo-vibe');
  if(fries==='yes')restaurants=restaurants.filter(r=>hasFries(r.name));
  if(fries==='no')restaurants=restaurants.filter(r=>!hasFries(r.name));
  if(vibe==='fast')restaurants=restaurants.filter(r=>r.tags.amenity==='fast_food');
  if(vibe==='sit')restaurants=restaurants.filter(r=>r.tags.amenity==='restaurant');
 }
 if(mode==='date'){
  // Both players' vetoes are applied independently; a restaurant must satisfy both.
  restaurants=restaurants.filter(r=>{
   const preferences=[['fries','vibe'],['fries2','vibe2']];
   return preferences.every(([friesId,vibeId])=>{
    const fries=chosen(friesId),vibe=chosen(vibeId);
    return (fries==='any'||(fries==='yes'?hasFries(r.name):!hasFries(r.name)))&&
     (vibe==='any'||(vibe==='fast'?r.tags.amenity==='fast_food':r.tags.amenity==='restaurant'));
   });
  });
 }
 if(window.hangryExperimentActive){
  const level=Number($('#hangry-range').value)||3;
  const score=r=>{
   const type=String(r.type||'').toLowerCase(),amenity=String(r.tags?.amenity||'');
   const light=['cafe','salad','breakfast','sandwich','other'].includes(type);
   const snack=['sandwich','pizza','mexican','burger','cafe','fast_food'].includes(type)||amenity==='cafe';
   const substantial=amenity==='restaurant'||['burger','mexican','italian','chinese','thai','indian','steak','sushi'].includes(type);
   const quick=amenity==='fast_food'||['burger','pizza','sandwich','chicken','fast_food'].includes(type);
   const match=[light,snack,substantial,quick,quick][level-1];
   const distanceWeight=[.6,.9,1.1,2.5,4][level-1];
   return (match?0:level>=4?6:2)+r.miles*distanceWeight;
  };
  restaurants.sort((a,b)=>score(a)-score(b));
 }else{
  restaurants.sort((a,b)=>a.miles-b.miles);
  if(+$('#hangry-range').value>=4){
   const fast=restaurants.filter(r=>r.tags.amenity==='fast_food'||r.miles<=3);
   if(fast.length)restaurants=fast;
  }
 }
 if(!restaurants.length){show('search-error');$('#error-message').textContent='The search returned restaurants, but none matched your current filters. Try fewer exclusions or a different preference.';return}
 rejected.clear();locked.clear();rejectionHistory=[];prepareWheel();if(mode==='date')showChemistryResults();else show(['browse','quiz'].includes(mode)?'all':'wheel-screen');
}
function showChemistryResults(){
 const ids=categories.map(c=>c[2]);
 const common=ids.filter(id=>!excluded.has(id)&&!excluded2.has(id));
 const union=ids.filter(id=>!excluded.has(id)||!excluded2.has(id));
 const percent=union.length?Math.round(100*common.length/union.length):0;
 $('#chemistry-score').textContent=`${percent}%`;
 $('#chemistry-explain').textContent=`${common.length} cuisines neither person vetoed, out of ${union.length} cuisines at least one person would consider. This is a preference-overlap score, not a prediction of how much you'll enjoy a restaurant.`;
 $('#chemistry-count').textContent=`${restaurants.length} nearby restaurants satisfy both players' selected restrictions.`;
 $('#chemistry-results').classList.remove('hidden');
 show('chemistry-results-screen');
}
$('#chemistry-see-all').addEventListener('click',()=>show('all'));
$('#chemistry-spin').addEventListener('click',()=>show('wheel-screen'));
$('#back-from-all').addEventListener('click',()=>show(mode==='date'?'chemistry-results-screen':'wheel-screen'));
// Version 1.2.5: independent, uncapped requests; no timer aborts.
let activeSearchControllers=[];
function stopActiveRequests(){activeSearchControllers.forEach(c=>c.abort());activeSearchControllers=[];}
async function search(){
 const generation=++searchGeneration;
 stopActiveRequests();
 show('loading');document.dispatchEvent(new Event('hangry:search-start'));progress('Finding real restaurants near your location…');
 let point=geo;
 try{
  if($('#zip').value.trim()){
   const zip=$('#zip').value.trim();
   if(!/^\d{5}$/.test(zip))throw Error('Please enter a valid five-digit ZIP code.');
   document.dispatchEvent(new CustomEvent('hangry:search-stage',{detail:{stage:'location'}}));
   const res=await fetch(`https://api.zippopotam.us/us/${encodeURIComponent(zip)}`);
   if(!res.ok)throw Error('ZIP code not found. Please check the ZIP and try again.');
   const data=await res.json();point={lat:+data.places[0].latitude,lon:+data.places[0].longitude,label:`${data.places[0]['place name']}, ${data.places[0]['state abbreviation']}`};
  }
  if(!point)throw Error('Enter a ZIP code or share your location.');
 }catch(e){if(generation===searchGeneration){show('search-error');$('#error-message').textContent=e.message||'Could not look up this location.'}return}
 if(generation!==searchGeneration)return;
 const miles=+$('#radius').value,meters=Math.round(miles*1609.344);
 const key=`${point.lat.toFixed(4)}:${point.lon.toFixed(4)}:${meters}`;
 document.dispatchEvent(new CustomEvent('hangry:search-stage',{detail:{stage:'nearby'}}));
 const cached=cacheRead(key);
 if(cached){document.dispatchEvent(new CustomEvent('hangry:search-stage',{detail:{stage:'results'}}));progress('Loading saved nearby restaurants…');presentResults(cached,point,miles);return}
 // Unchanged original V1.0 Overpass query.
 const query=`[out:json][timeout:35];(nwr["amenity"~"^(restaurant|fast_food|cafe)$"](around:${meters},${point.lat},${point.lon}););out center tags;`;
 const endpoints=['https://overpass.kumi.systems/api/interpreter','https://overpass-api.de/api/interpreter'];
 const controllers=endpoints.map(()=>new AbortController());
 activeSearchControllers=controllers;
 let settled=false;
 const attempts=[0,0];
 const delays=[0,20000];
 const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
 function status(){
  if(generation!==searchGeneration||settled)return;
  progress(`Searching within ${miles} miles of ${point.label}… Server attempts: ${attempts.join(' / ')}. Slow requests remain active; you can cancel below.`);
 }
 // Each server retries only after its own request fails. A slow pending request
 // is never interrupted by a timer or by the other server retrying.
 async function runServer(endpoint,index){
  if(delays[index])await sleep(delays[index]);
  while(generation===searchGeneration&&!settled){
   attempts[index]++;status();
   try{
    const response=await fetch(endpoint,{method:'POST',body:new URLSearchParams({data:query}),signal:controllers[index].signal});
    if(!response.ok)throw Error(`HTTP ${response.status}`);
    const data=await response.json();
    if(!data||!Array.isArray(data.elements))throw Error('Unexpected restaurant response');
    if(generation!==searchGeneration||settled)return;
    settled=true;
    cacheWrite(key,data.elements);
    document.dispatchEvent(new CustomEvent('hangry:search-stage',{detail:{stage:'results'}}));
    // Stop the other pending request only AFTER a successful result.
    controllers.forEach((c,i)=>{if(i!==index)c.abort()});
    activeSearchControllers=[];
    presentResults(data,point,miles);
    return;
   }catch(e){
    if(generation!==searchGeneration||settled||controllers[index].signal.aborted)return;
    console.warn('Hangryology restaurant server attempt failed:',endpoint,e);
    progress(`Restaurant server busy. Trying again; other requests remain active. You can cancel below.`);
    await sleep(Math.min(20000,4000+attempts[index]*2000));
   }
  }
 }
 // Do not await a single server before starting the other one.
 void runServer(endpoints[0],0);
 void runServer(endpoints[1],1);
}
window.hangryLaunchExperiment=function(zip,level){
 const z=String(zip??'').trim();
 const n=Math.max(1,Math.min(5,Number(level)||3));
 if(!/^\d{5}$/.test(z))return {ok:false,message:'Please enter a five-digit US ZIP code.'};
 const setupZip=document.getElementById('zip');
 const meter=document.getElementById('hangry-range');
 const radius=document.getElementById('radius');
 if(!setupZip||!meter||!radius)return {ok:false,message:'Search controls are missing. Refresh the page.'};
 setupZip.value=z;
 meter.value=String(n);
 meter.dispatchEvent(new Event('input',{bubbles:true}));
 const requestedRadius=String(n===5?3:n===4?5:n===3?10:15);
 if([...radius.options].some(option=>option.value===requestedRadius))radius.value=requestedRadius;
 mode='browse';
 window.hangryExperimentActive=true;
 // search() is asynchronous. Starting it is not the same as finishing it;
 // ZIP lookup and Overpass failures are handled on the loading/error screens.
 void search();
 return {ok:true};
};
const cancelSearch=()=>{searchGeneration++;stopActiveRequests();show('setup')};
$('#cancel-search')?.addEventListener('click',cancelSearch);

let wheelItems=[];let wheelTargetSize=8;const rejected=new Set(),locked=new Set();let rejectionHistory=[];
const colors=['#e65a31','#144e73','#c23750','#f0a53a','#147e79','#754bb5','#c64a27','#2e6090'];
const eligible=()=>restaurants.filter(r=>!rejected.has(r.id));
function updateWheelStatus(){const n=eligible().length;$('#match-title').textContent=`${n} restaurants in the running!`;$('#match-note').textContent=`${wheelItems.length} on the wheel • ${restaurants.length} total matches • ${rejected.size} rejected`;$('#all-count').textContent=String(restaurants.length);$('#wheel-status').textContent=`🔒 ${locked.size} locked · 🚫 ${rejected.size} rejected · ${n} eligible. No new restaurant search needed.`;$('#spin').disabled=spinning||!wheelItems.length;$('#wheel-undo').classList.toggle('hidden',!rejectionHistory.length);}
function shuffleWheel(){const keep=wheelItems.filter(r=>locked.has(r.id)&&!rejected.has(r.id)).slice(0,8);const pool=eligible().filter(r=>!keep.some(k=>k.id===r.id));for(let i=pool.length-1;i>0;i--){const k=Math.floor(Math.random()*(i+1));[pool[i],pool[k]]=[pool[k],pool[i]];}wheelItems=[...keep,...pool.slice(0,Math.max(0,wheelTargetSize-keep.length))];rotation=0;drawWheel();renderContenders();updateWheelStatus();}
function prepareWheel(){wheelTargetSize=8;shuffleWheel();renderPlaces('#all-list',restaurants)}
function renderContenders(){const el=$('#contenders');el.innerHTML=wheelItems.map(r=>`<div class="contender-row"><div><strong>${escapeHtml(r.name)}</strong><small>📍 ${r.miles.toFixed(1)} mi · ${escapeHtml(r.type.replace('_',' '))}</small></div><div class="contender-actions"><button class="result-btn lock-choice" data-id="${escapeHtml(r.id)}" aria-label="${locked.has(r.id)?'Unlock':'Lock'} ${escapeHtml(r.name)}">${locked.has(r.id)?'🔒 Locked':'🔓 Lock'}</button><button class="result-btn remove-choice" data-id="${escapeHtml(r.id)}" aria-label="Remove ${escapeHtml(r.name)}">✕ Remove</button></div></div>`).join('')||'<p class="muted">No contenders left. Reset rejected restaurants to try again.</p>';
el.querySelectorAll('.lock-choice').forEach(btn=>btn.addEventListener('click',()=>{const id=btn.dataset.id;locked.has(id)?locked.delete(id):locked.add(id);renderContenders();updateWheelStatus()}));
el.querySelectorAll('.remove-choice').forEach(btn=>btn.addEventListener('click',()=>{const id=btn.dataset.id;locked.delete(id);wheelItems=wheelItems.filter(r=>r.id!==id);wheelTargetSize=wheelItems.length;rotation=0;drawWheel();renderContenders();updateWheelStatus()}));}
// v1.4.40: neon laboratory wheel; wheel selection and physics stay unchanged.
const labWheelIcons={american:'burger',burger:'burger',fast_food:'burger',pizza:'pizza',italian:'pizza',mexican:'mexican',asian:'asian',chinese:'asian',thai:'asian',japanese:'sushi',sushi:'sushi',seafood:'seafood',steak:'steak',steakhouse:'steak',chicken:'chicken',sandwich:'sandwich',breakfast:'breakfast',coffee:'coffee',cafe:'coffee',bakery:'dessert',dessert:'dessert',ice_cream:'dessert',healthy:'healthy',salad:'healthy',indian:'indian',other:'other'};
const labIconCache={};
function labWheelIcon(type){
 const k=labWheelIcons[String(type||'').toLowerCase()]||'other';
 if(!labIconCache[k]){const img=new Image();labIconCache[k]=img;img.onload=()=>{if(!spinning)drawWheel()};img.src=`cuisine-${({burger:'burger',pizza:'pizza',mexican:'mexican',asian:'chinese',sushi:'sushi',seafood:'seafood',steak:'steak',chicken:'chicken',sandwich:'sandwich',breakfast:'breakfast',coffee:'coffee',dessert:'dessert',healthy:'salad',indian:'indian',other:'other'})[k]||k}-v1441.png`}
 return labIconCache[k];
}
function drawWheel(){
 const c=$('#wheel'),ctx=c.getContext('2d'),n=wheelItems.length;
 ctx.clearRect(0,0,640,640);if(!n)return;
 const cx=320,cy=320,r=289,step=2*Math.PI/n;
 const palette=['#07375b','#8c3b22','#113d62','#9c4c1c','#103a56','#853e32','#114d65','#86421d'];
 const accent=(document.body.dataset.hungerLevel||'3');
 const ring=['#4cf49a','#f9d45c','#ffa34b','#ff7445','#ff3c59'][Math.max(0,Math.min(4,Number(accent)-1))];
 ctx.save();ctx.translate(cx,cy);ctx.rotate(rotation);
 for(let i=0;i<n;i++){
  const a=-Math.PI/2+i*step,b=a+step,mid=a+step/2;
  ctx.beginPath();ctx.moveTo(0,0);ctx.arc(0,0,r,a,b);ctx.closePath();
  const g=ctx.createRadialGradient(0,0,65,0,0,r);
  g.addColorStop(0,'#07172b');g.addColorStop(.52,palette[i%palette.length]);g.addColorStop(1,i%2?'#b65a29':'#156c99');
  ctx.fillStyle=g;ctx.fill();ctx.strokeStyle=i%2?'#ffae4e':'#49d9ff';ctx.lineWidth=3;ctx.stroke();
  ctx.save();ctx.rotate(mid);ctx.translate(r*.64,0);ctx.rotate(Math.PI/2);
  const icon=labWheelIcon(wheelItems[i].type);
  if(icon.complete&&icon.naturalWidth){ctx.shadowColor='#13d5ff';ctx.shadowBlur=12;ctx.drawImage(icon,-24,-62,48,48);ctx.shadowBlur=0}
  ctx.font='700 18px system-ui';ctx.textAlign='center';ctx.fillStyle='#fff';ctx.shadowColor='#000';ctx.shadowBlur=7;
  let name=wheelItems[i].name;
  while(ctx.measureText(name).width>145&&name.length>5)name=name.slice(0,-2)+'…';
  ctx.fillText(name,0,12);ctx.restore();
 }
 ctx.beginPath();ctx.arc(0,0,r+3,0,2*Math.PI);ctx.strokeStyle='#05263d';ctx.lineWidth=18;ctx.shadowBlur=0;ctx.stroke();
 ctx.beginPath();ctx.arc(0,0,r+4,0,2*Math.PI);ctx.strokeStyle=ring;ctx.lineWidth=8;ctx.shadowColor=ring;ctx.shadowBlur=25;ctx.stroke();
 ctx.beginPath();ctx.arc(0,0,r-15,0,2*Math.PI);ctx.strokeStyle='rgba(76,216,255,.55)';ctx.lineWidth=3;ctx.shadowBlur=5;ctx.stroke();
 ctx.restore();
}
$('#spin').addEventListener('click',()=>{if(spinning||!wheelItems.length)return;spinning=true;$('#spin').disabled=true;const start=rotation,delta=(Math.PI*2)*(5+Math.random()*3),duration=4700,t0=performance.now();function frame(now){const t=Math.min(1,(now-t0)/duration),ease=1-Math.pow(1-t,4);rotation=start+delta*ease;drawWheel();if(t<1)requestAnimationFrame(frame);else{spinning=false;$('#spin').disabled=false;const n=wheelItems.length,step=2*Math.PI/n,angle=(((-rotation)% (2*Math.PI))+(2*Math.PI))%(2*Math.PI);winner=wheelItems[Math.floor(angle/step)%n];renderWinner();show('winner')}}requestAnimationFrame(frame)});
function safeWebsite(r){const raw=r.tags.website||r.tags['contact:website']||r.tags['website:menu']||'';try{const u=new URL(raw);return ['https:','http:'].includes(u.protocol)?u.href:null}catch{return null}}
function mapUrl(r){return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(r.name+' '+r.lat+','+r.lon)}`}
function renderWinner(){if(!winner)return;$('#winner-name').textContent=winner.name;$('#winner-info').textContent=`📍 ${winner.miles.toFixed(1)} miles away · ${winner.type.replace('_',' ')}`;$('#winner-address').textContent=winner.address;$('#directions').href=mapUrl(winner);$('#favorite').textContent=favorites().some(x=>x.id===winner.id)?'♥ Saved':'♡ Save';
const tags=winner.tags||{};const website=safeWebsite(winner);const menu=$('#winner-menu');menu.href=website||`https://www.google.com/search?q=${encodeURIComponent(winner.name+' menu '+winner.address)}`;menu.textContent=website?'🌐 Restaurant Website / Menu':'🔎 Find Menu Online';const phone=tags.phone||tags['contact:phone'];const call=$('#winner-call');call.classList.toggle('hidden',!phone);if(phone)call.href=`tel:${phone.replace(/[^+0-9]/g,'')}`;
const details=[['🍽️ Cuisine',tags.cuisine||winner.type.replace('_',' ')],['🕒 Listed hours',tags.opening_hours||'Not available — confirm with restaurant'],['🥡 Takeout',tags.takeaway==='yes'?'Listed as available':tags.takeaway==='no'?'Listed as unavailable':'Not verified'],['🚗 Delivery',tags.delivery==='yes'?'Listed as available':tags.delivery==='no'?'Listed as unavailable':'Not verified'],['📞 Phone',phone||'Not listed']];$('#winner-details').innerHTML=details.map(([label,val])=>`<div><small>${escapeHtml(label)}</small><strong>${escapeHtml(val)}</strong></div>`).join('');$('#undo-reject').classList.toggle('hidden',rejectionHistory.length===0);}
$('#favorite').addEventListener('click',()=>{let a=favorites();a.some(x=>x.id===winner.id)?a=a.filter(x=>x.id!==winner.id):a.push(winner);saveFavorites(a);renderWinner()});
$('#again').addEventListener('click',()=>{show('wheel-screen');rotation=0;drawWheel()});$('#other').addEventListener('click',()=>show('all'));$('#view-matches').addEventListener('click',()=>show('all'));$('#reshuffle').addEventListener('click',shuffleWheel);
$('#reject-winner').addEventListener('click',()=>{if(!winner)return;const id=winner.id;rejected.add(id);rejectionHistory.push(id);locked.delete(id);wheelItems=wheelItems.filter(r=>r.id!==id);const replacement=eligible().find(r=>!wheelItems.some(w=>w.id===r.id));if(replacement)wheelItems.push(replacement);if(!wheelItems.length){show('wheel-screen');renderContenders();updateWheelStatus();alert('🐶 Bunsen says: You rejected everything! Reset rejects to start again.');return}rotation=0;drawWheel();renderContenders();updateWheelStatus();show('wheel-screen');});
$('#wheel-undo').addEventListener('click',()=>$('#undo-reject').click());
$('#undo-reject').addEventListener('click',()=>{const id=rejectionHistory.pop();if(!id)return;rejected.delete(id);const r=restaurants.find(x=>x.id===id);if(r&&!wheelItems.some(x=>x.id===id)){if(wheelItems.length>=8){const idx=wheelItems.findIndex(x=>!locked.has(x.id));if(idx>=0)wheelItems.splice(idx,1);}if(wheelItems.length<8)wheelItems.push(r);}rotation=0;drawWheel();renderContenders();updateWheelStatus();$('#undo-reject').classList.toggle('hidden',!rejectionHistory.length);show('wheel-screen')});
$('#reset-rejected').addEventListener('click',()=>{rejected.clear();rejectionHistory=[];shuffleWheel()});
$('#reset-wheel').addEventListener('click',()=>{wheelTargetSize=8;shuffleWheel()});
function renderPlaces(target,arr){$(target).innerHTML=arr.map(r=>{
const query=encodeURIComponent(r.name+' '+r.lat+','+r.lon);
const menu=r.tags.website||r.tags['contact:website']||'';
const safeMenu=/^https?:\/\//i.test(menu)?menu:'';
const emoji=({burger:'🍔',pizza:'🍕',mexican:'🌮',chicken:'🍗',italian:'🍝',chinese:'🥡',sushi:'🍣',steak:'🥩',sandwich:'🥪',salad:'🥗',indian:'🍛',thai:'🍜',breakfast:'🍳',fast_food:'🍟',seafood:'🦐',other:'🍽️'})[r.type]||'🍽️';
return `<article class="result-card"><div class="result-art" aria-hidden="true"><img class="result-cuisine-icon" src="cuisine-${({burger:"burger",pizza:"pizza",mexican:"mexican",chicken:"chicken",italian:"pizza",chinese:"asian",sushi:"sushi",steak:"steak",sandwich:"sandwich",salad:"healthy",indian:"indian",thai:"asian",breakfast:"breakfast",fast_food:"burger",seafood:"seafood",cafe:"coffee",coffee:"coffee",bakery:"dessert",dessert:"dessert",ice_cream:"dessert",american:"burger",other:"other"})[r.type]||"other"}-v1441.png" alt="" loading="lazy"></div><div class="result-body"><strong>${escapeHtml(r.name)}</strong><span class="result-meta">📍 ${r.miles.toFixed(1)} mi · ${escapeHtml(r.type.replace('_',' '))}</span><span class="result-address">${escapeHtml(r.address)}</span><div class="result-actions"><a class="result-btn" target="_blank" rel="noopener noreferrer" href="https://www.google.com/maps/search/?api=1&query=${query}">📍 Directions</a>${safeMenu?`<a class="result-btn" target="_blank" rel="noopener noreferrer" href="${escapeHtml(safeMenu)}">📖 Website / Menu</a>`:`<a class="result-btn" target="_blank" rel="noopener noreferrer" href="https://www.google.com/search?q=${encodeURIComponent(r.name+' menu near '+r.address)}">📖 Find Menu</a>`}<button class="result-btn add-wheel" data-wheel="${escapeHtml(r.id)}">🎡 Add to wheel</button></div></div></article>`}).join('')||'<p class="muted">No matches found.</p>';
$$(`${target} .add-wheel`).forEach(b=>b.addEventListener('click',()=>{const r=restaurants.find(x=>x.id===b.dataset.wheel);if(!r)return;if(rejected.has(r.id)){rejected.delete(r.id);rejectionHistory=rejectionHistory.filter(x=>x!==r.id)}if(!wheelItems.some(x=>x.id===r.id)){if(wheelItems.length>=8){const i=wheelItems.findIndex(x=>!locked.has(x.id));if(i<0){alert("All eight contenders are locked. Unlock one to add another.");return}wheelItems.splice(i,1)}wheelItems.push(r);wheelTargetSize=wheelItems.length}rotation=0;drawWheel();renderContenders();updateWheelStatus();show('wheel-screen')}));}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function renderSaved(){const a=favorites();$('#saved-list').innerHTML=a.map(r=>`<div class="place"><div><strong>${escapeHtml(r.name)}</strong><small>${escapeHtml(r.address)}</small></div><button class="remove" data-id="${escapeHtml(r.id)}" title="Remove favorite">♥</button></div>`).join('')||'<div class="card"><p class="muted">No favorites yet. Spin the wheel and save a winner!</p></div>';$$('.remove').forEach(b=>b.addEventListener('click',()=>{saveFavorites(favorites().filter(x=>x.id!==b.dataset.id));renderSaved()}))}

const hangryMessages=[['Oh, you’re just browsing. Must be nice.','Take your time and explore.'],['A snack could fix this.','We’ll help narrow it down.'],['We’re running out of patience here.','We’ll keep your food mission focused.'],['Someone get this person a cheeseburger!','Skip the quiz and prioritize nearby quick-service options.'],['🚨 THIS IS NOT A DRILL. DEPLOY THE FRIES!','We’ll skip the quiz and prioritize nearby quick food.']];
$('#hangry-range').addEventListener('input',e=>{const i=+e.target.value-1;$('#hangry-status').textContent=hangryMessages[i][0];if($('#hangry-tip'))$('#hangry-tip').textContent=hangryMessages[i][1];localStorage.setItem('hangryologyLevel',e.target.value)});$('#hangry-range').value='3';$('#hangry-range').dispatchEvent(new Event('input'));
$('#menu-toggle').addEventListener('click',()=>$('#mobile-menu').classList.toggle('open'));

$('#retry-search').addEventListener('click',search);$('#back-to-setup').addEventListener('click',()=>show('setup'));
