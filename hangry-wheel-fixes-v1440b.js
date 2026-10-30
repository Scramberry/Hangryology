(()=>{
const select=document.getElementById('lab-results-sort');
if(!select||document.getElementById('lab-sort-trigger'))return;
const wrap=select.closest('.lab-sort-label');if(!wrap)return;
const trigger=document.createElement('button');trigger.type='button';trigger.id='lab-sort-trigger';
trigger.className='lab-sort-trigger';trigger.setAttribute('aria-haspopup','listbox');
trigger.setAttribute('aria-expanded','false');
const label=document.createElement('span');const arrow=document.createElement('span');arrow.textContent='⌄';
trigger.append(label,arrow);
const menu=document.createElement('div');menu.className='lab-sort-menu';menu.id='lab-sort-menu';
menu.setAttribute('role','listbox');menu.hidden=true;trigger.setAttribute('aria-controls',menu.id);
function sync(){label.textContent=select.selectedOptions[0]?.textContent||'Best Match';
 menu.querySelectorAll('button').forEach(b=>b.setAttribute('aria-selected',String(b.dataset.value===select.value)));}
function close(){menu.hidden=true;trigger.setAttribute('aria-expanded','false')}
function open(){menu.hidden=false;trigger.setAttribute('aria-expanded','true');
 (menu.querySelector('[aria-selected="true"]')||menu.querySelector('button'))?.focus()}
[...select.options].forEach(opt=>{
 const b=document.createElement('button');b.type='button';b.className='lab-sort-option';
 b.setAttribute('role','option');b.dataset.value=opt.value;b.textContent=opt.textContent;
 b.addEventListener('click',()=>{select.value=opt.value;select.dispatchEvent(new Event('change',{bubbles:true}));sync();close();trigger.focus()});
 menu.append(b)
});
trigger.addEventListener('click',()=>menu.hidden?open():close());
menu.addEventListener('keydown',e=>{
 const bs=[...menu.querySelectorAll('button')],i=bs.indexOf(document.activeElement);
 if(e.key==='Escape'){e.preventDefault();close();trigger.focus()}
 if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();bs[(i+(e.key==='ArrowDown'?1:-1)+bs.length)%bs.length].focus()}
 if(e.key==='Home'){e.preventDefault();bs[0].focus()}
 if(e.key==='End'){e.preventDefault();bs[bs.length-1].focus()}
});
document.addEventListener('pointerdown',e=>{if(!wrap.contains(e.target))close()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!menu.hidden){close();trigger.focus()}});
select.addEventListener('change',sync);
wrap.append(trigger,menu);sync();
})();