/* v1.4.54 — navigation starts a new experiment, not a previous wheel. */
(function(){
  'use strict';
  document.addEventListener('click',function(event){
    const btn=event.target.closest('[data-go]');
    if(!btn || !btn.closest('.top,.mobile-menu'))return;
    if(btn.dataset.mode!=='spin' && btn.dataset.go!=='wheel-screen')return;
    event.preventDefault();
    event.stopImmediatePropagation();
    // The original app's mode, resetExperiment and show are top-level bindings.
    // Reset cancels pending searches and clears previous matches/wheel state.
    if(typeof mode!=='undefined' && typeof resetExperiment==='function' && typeof show==='function'){
      mode='spin';
      resetExperiment();
      document.body.dataset.hangryMode='spin';
      document.body.classList.remove('hunger-experiment-active');
      document.body.removeAttribute('data-hunger-level');
      show('setup');
    }else{
      document.querySelector('[data-go="home"]')?.click();
    }
    document.getElementById('mobile-menu')?.classList.remove('open');
  },true);
})();
