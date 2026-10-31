(()=>{'use strict';
const asset={
all:'all',burger:'burger',burgers:'burger',american:'burger',pizza:'pizza',mexican:'mexican',
chicken:'chicken',italian:'italian',chinese:'chinese',sushi:'sushi',japanese:'sushi',
steak:'steak',steakhouse:'steak',sandwich:'sandwich',sandwiches:'sandwich',
salad:'salad',salads:'salad',healthy:'salad',indian:'indian',thai:'thai',
breakfast:'breakfast',fast_food:'fast_food',seafood:'seafood',other:'other'};
const file=k=>{const key=({asian:'chinese',healthy:'salad'})[k]||asset[k]||k||'other';return 'cuisine-'+key+(['coffee','dessert'].includes(key)?'-v1456.png':'-v1441.png')};
function upgrade(){
 document.querySelectorAll('img').forEach(img=>{
  const m=(img.getAttribute('src')||'').match(/^cuisine-([a-z_]+)-v1439\.svg$/);
  if(m)img.src=file(m[1]);
 });
 document.querySelectorAll('#setup .food,#chemistry-player1 .food,#chemistry-player2 .food').forEach(b=>{
  const type=b.dataset.category||b.dataset.category2||b.dataset.categorySolo;
  if(!type)return;
  let icon=b.querySelector('.cuisine-symbol');
  if(!icon){icon=document.createElement('img');icon.className='cuisine-symbol';icon.alt='';b.prepend(icon)}
  if(icon.getAttribute('src')!==file(type))icon.src=file(type);
 });
}
let pending=false;
new MutationObserver(()=>{if(!pending){pending=true;requestAnimationFrame(()=>{pending=false;upgrade()})}}).observe(document.body,{childList:true,subtree:true});
upgrade();
})();