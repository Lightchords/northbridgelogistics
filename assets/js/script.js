// script.js — clean redirect + WhatsApp widget + smooth animations

// TRACK FORM REDIRECT
const form = document.getElementById('trackForm');
if(form){
    form.addEventListener('submit', e => {
        e.preventDefault();
        const tn = document.getElementById('trackingInput').value.trim();
        if(!tn) return;
        location.href = `result.html?tracking=${encodeURIComponent(tn)}`;
    });
}

// DEMO LINKS
const demoLinks = document.querySelectorAll('.track-demo');
demoLinks.forEach(a =>{
    a.addEventListener('click', e =>{
        e.preventDefault();
        location.href = `result.html?tracking=${encodeURIComponent(a.textContent.trim())}`;
    });
});

// SIMPLE FADE ANIMATION
window.fadeIn = function(el){
    el.style.opacity = 0;
    el.style.display = 'block';
    let op = 0;
    const timer = setInterval(()=>{
        if(op >= 1) clearInterval(timer);
        el.style.opacity = op;
        op += 0.1;
    }, 30);
};

// WhatsApp Panel
const whBtn = document.getElementById('whBtn');
const whPanel = document.getElementById('whPanel');
const whClose = document.getElementById('whClose');

if(whBtn){
    whBtn.onclick = ()=>{
        whPanel.style.display = whPanel.style.display === 'block' ? 'none' : 'block';
    };
}
if(whClose){
    whClose.onclick = ()=> whPanel.style.display='none';
}

document.addEventListener('click', e =>{
    if(!e.target.closest('.wh-panel') && !e.target.closest('.wh-btn')){
        if(whPanel) whPanel.style.display='none';
    }
});
