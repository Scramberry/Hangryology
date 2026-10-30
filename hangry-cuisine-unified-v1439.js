(()=>{
'use strict';
const aliases={burger:'burger',pizza:'pizza',mexican:'mexican',chicken:'chicken',
italian:'pizza',chinese:'asian',sushi:'sushi',steak:'steak',sandwich:'sandwich',
salad:'healthy',indian:'indian',thai:'asian',breakfast:'breakfast',
fast_food:'burger',seafood:'seafood',cafe:'coffee',coffee:'coffee',
bakery:'dessert',dessert:'dessert',ice_cream:'dessert',
american:'burger',asian:'asian',other:'other'};
const path=k=>'cuisine-'+(aliases[k]||k||'other')+'-v1439.svg';
function setupIcons(){
 for(const b of document.querySelectorAll('#setup [data-category],#setup [data-category2],#setup [data-category-solo]')){
  if(b.querySelector('.cuisine-symbol'))continue;
  const type=b.dataset.category||b.dataset.category2||b.dataset.categorySolo;
  const img=document.createElement('img');img.src=path(type);
  img.alt='';img.className='cuisine-symbol';img.loading='lazy';
  b.insertBefore(img,b.firstChild);
 }
}
function wheelIcons(){
 for(const row of document.querySelectorAll('#contenders .contender-row')){
  if(row.querySelector('.contender-cuisine-icon'))continue;
  const block=row.firstElementChild;if(!block)continue;
  const small=block.querySelector('small');
  const type=(small?.textContent||'').split('·').pop().trim().toLowerCase().replace(/\s+/g,'_');
  const icon=document.createElement('img');
  icon.src=path(type);icon.alt='';icon.className='contender-cuisine-icon';
  const info=document.createElement('div');info.className='contender-info';
  while(block.firstChild)info.append(block.firstChild);
  block.append(icon,info);
 }
}
const observer=new MutationObserver(()=>{setupIcons();wheelIcons()});
observer.observe(document.body,{subtree:true,childList:true});
setupIcons();wheelIcons();
})();