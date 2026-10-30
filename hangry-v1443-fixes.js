(()=>{'use strict';
const all=document.getElementById('all'),back=document.getElementById('back-from-all');
const isHunger=()=>window.hangryExperimentActive===true||document.body.classList.contains('hunger-experiment-active');
function label(){if(back)back.textContent=isHunger()?'← Start Over · Hangry Meter':'← Return to Experiment';}
function allFilter(){document.querySelector('#all .lab-cuisine[data-filter="all"]')?.click();const s=document.getElementById('lab-results-sort');if(s){s.value='match';s.dispatchEvent(new Event('change',{bubbles:true}));}}
// Watch actual screen transitions, not individual buttons, so every navigation resets the category.
let lastScreen='';
const screenObserver=new MutationObserver(()=>{const current=document.querySelector('main>.screen.active')?.id||'';if(current!==lastScreen){if(current==='all')allFilter();lastScreen=current;label();}});
screenObserver.observe(document.querySelector('main'),{subtree:true,attributes:true,attributeFilter:['class']});
label();
// Reset Experiment returns to the relevant experiment start, never an unrelated mode.
document.addEventListener('click',e=>{const b=e.target.closest('.hangry-reset-everywhere');if(!b)return;
 if(isHunger()){e.preventDefault();e.stopImmediatePropagation();if(typeof resetToHome==='function')resetToHome();document.querySelector('#home .home-meter')?.scrollIntoView({behavior:'instant',block:'start'});}
 else if(typeof resetExperiment==='function'){e.preventDefault();e.stopImmediatePropagation();resetExperiment();if(typeof show==='function')show('setup');}
},true);
// Keep header styling isolated to hunger-specific screens.
const resetTheme=new MutationObserver(()=>{if(!isHunger()&&document.body.classList.contains('hunger-experiment-active'))document.body.classList.remove('hunger-experiment-active')});
})();