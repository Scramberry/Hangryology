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

/* V1.4.20: Keep the meter meaningful across modes; the core search still runs in app.js. */
(()=> {
 const range=document.getElementById('hangry-range');
 if(!range) return;
 const notes=[
  'Explore lighter bites and take your time choosing.',
  'Full food discovery mode: explore restaurants and cuisines.',
  'Hungry mode: nearby matches get priority.',
  'Fast-track mode: skip the quiz and focus on nearby quick food.',
  'Code Red: skip the quiz and search for urgent nearby options.'
 ];
 const update=()=>{
  const n=Math.max(1,Math.min(5,Number(range.value)||3));
  range.setAttribute('aria-valuetext',['Just Peckish','Getting Snacky','Hangry & Dangerous','Feed Me Now','Code Red Emergency'][n-1]);
  const note=document.getElementById('hangry-action-explainer');
  if(note)note.textContent=notes[n-1];
 };
 range.addEventListener('input',update);
 update();
})();
