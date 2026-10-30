document.addEventListener('click',function(event){
 const button=event.target.closest('.hangry-reset-everywhere');
 if(!button)return;
 event.preventDefault();
 if(typeof resetToHome==='function')resetToHome();
 else document.querySelector('header.top [data-go="home"]')?.click();
});
