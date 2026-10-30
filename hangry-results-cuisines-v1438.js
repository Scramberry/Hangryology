(()=>{
const section=document.getElementById('all'),list=document.getElementById('all-list');
if(!section||!list)return;
const filters=[...section.querySelectorAll('.lab-cuisine')],sort=section.querySelector('#lab-results-sort');
const title=section.querySelector('.hunger-title'),sub=section.querySelector('.hunger-subtitle');
const themes=[
 ['THE SNACK LAB REPORT',"Byte found a few tasty possibilities!"],
 ['THE CRAVING INVESTIGATION',"Bunsen's nose has detected something delicious!"],
 ['OPERATION: FEED BUNSEN!',"The cravings are escalating. Results are in!"],
 ['EMERGENCY FOOD DISPATCH',"Byte has located your next meal. Move quickly!"],
 ['HANGRY EMERGENCY: TARGETS ACQUIRED!',"Bunsen has officially lost his patience. Food rescue is underway!"]
];
const types={
 burger:['burger','american','fast_food'],pizza:['pizza','italian'],mexican:['mexican'],
 asian:['chinese','thai','sushi','indian'],sushi:['sushi'],seafood:['seafood'],
 steak:['steak'],chicken:['chicken'],sandwich:['sandwich'],
 breakfast:['breakfast'],coffee:['coffee','cafe'],dessert:['dessert','bakery','ice_cream'],
 healthy:['salad'],indian:['indian']
};
const known=new Set(Object.values(types).flat());
let originals=[],prevSignature='';
const normalize=s=>String(s||'').trim().toLowerCase().replace(/\s+/g,'_');
function cardType(c){return normalize((c.querySelector('.result-meta')?.textContent||'').split('·').pop())}
function matches(c,k){
 if(k==='all')return true;
 const type=cardType(c),name=(c.querySelector('.result-body strong')?.textContent||'').toLowerCase();
 if(k==='other')return type==='other'||(!known.has(type)&&type!=='');
 if((types[k]||[]).includes(type))return true;
 // Only use unmistakable cuisine words in the business name, not broad guesses.
 const patterns={
 burger:/\bburger(s)?\b/i,pizza:/\bpizza\b/i,mexican:/\btaco(s)?\b|\bburrito(s)?\b/i,
 sushi:/\bsushi\b/i,seafood:/\bseafood\b|\bfish\b/i,steak:/\bsteak(house)?\b/i,
 chicken:/\bchicken\b|\bwings\b/i,sandwich:/\bsandwich(es)?\b|\bsubs?\b/i,
 breakfast:/\bbreakfast\b|\bpancakes?\b|\bwaffles?\b/i,
 coffee:/\bcoffee\b|\bcafe\b|\bespresso\b/i,
 dessert:/\bdessert(s)?\b|\bice cream\b|\bdonut(s)?\b|\bbakery\b/i,
 healthy:/\bsalad(s)?\b/i,indian:/\bindian\b|\bcurry\b/i,
 asian:/\bramen\b|\bthai\b|\bchinese\b|\basian\b/i
 };
 return !!patterns[k]?.test(name);
}
const empty=document.createElement('p');empty.className='lab-empty';empty.hidden=true;
empty.textContent='🔬 No restaurants in this category from the current search. Try another cuisine or All.';
list.after(empty);
function apply(){
 const active=section.querySelector('.lab-cuisine.active')?.dataset.filter||'all';
 let visible=originals.filter(c=>matches(c,active));
 if(sort?.value==='distance')visible.sort((a,b)=>(parseFloat(a.querySelector('.result-meta')?.textContent.match(/[\d.]+/)?.[0])||999)-(parseFloat(b.querySelector('.result-meta')?.textContent.match(/[\d.]+/)?.[0])||999));
 if(sort?.value==='name')visible.sort((a,b)=>(a.querySelector('.result-body strong')?.textContent||'').localeCompare(b.querySelector('.result-body strong')?.textContent||''));
 const hidden=originals.filter(c=>!visible.includes(c));
 const frag=document.createDocumentFragment();
 for(const c of visible){c.hidden=false;frag.appendChild(c)}
 for(const c of hidden){c.hidden=true;frag.appendChild(c)}
 list.appendChild(frag);
 empty.hidden=visible.length!==0||originals.length===0;
 filters.forEach(f=>{f.setAttribute('aria-pressed',String(f.classList.contains('active')))});
}
function updateTheme(){
 const i=Math.max(0,Math.min(4,(Number(document.body.dataset.hungerLevel)||3)-1));
 if(title)title.textContent=themes[i][0];
 if(sub)sub.textContent=themes[i][1];
}
function refresh(){
 const cards=[...list.querySelectorAll('.result-card')];
 const signature=cards.map(c=>c.querySelector('.result-body strong')?.textContent||'').join('\u0001');
 if(signature!==prevSignature||cards.length!==originals.length){
  originals=cards;prevSignature=signature;apply();
 }
 updateTheme();
}
filters.forEach(b=>b.addEventListener('click',()=>{
 filters.forEach(f=>f.classList.toggle('active',f===b));apply();
}));
sort?.addEventListener('change',apply);
section.querySelectorAll('.lab-scroll-btn').forEach(b=>b.addEventListener('click',()=>{
 section.querySelector('.lab-cuisine-filters')?.scrollBy({left:Number(b.dataset.dir)*360,behavior:'smooth'});
}));
new MutationObserver(()=>{
 const cards=list.querySelectorAll('.result-card');
 if(cards.length!==originals.length||[...cards].some(c=>!originals.includes(c)))refresh();
}).observe(list,{childList:true});
new MutationObserver(updateTheme).observe(document.body,{attributes:true,attributeFilter:['data-hunger-level']});
refresh();
})();