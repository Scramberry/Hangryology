/* Homepage-only visual feedback. Search and wheel logic remain in app.js. */
(()=> {
  const slider=document.getElementById('hangry-range');
  if(!slider) return;
  const update=()=> {
    const value=Number(slider.value);
    document.querySelectorAll('#home .bunsen-level').forEach(el=>{
      el.classList.toggle('selected',Number(el.dataset.level)===value);
    });
    slider.setAttribute('aria-valuetext', ['','Just Peckish','Getting Snacky','Hangry and Dangerous','Feed Me Now','Code Red Emergency'][value]);
  };
  slider.addEventListener('input',update);
  slider.addEventListener('change',update);
  update();
})();
