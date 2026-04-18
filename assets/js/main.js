// GlobalExpressDelivery — main JS (Bootstrap-based)
// Handles: navbar toggles, hero autoplay, tracking redirect + results, WhatsApp widget, dark mode, language selector

document.addEventListener('DOMContentLoaded', function(){

  /* ---------- Dark mode toggle (if exists) ---------- */
  const dmBtn = document.getElementById('darkModeToggle');
  if(dmBtn){
    const stored = localStorage.getItem('ged_theme');
    if(stored === 'dark'){ document.body.classList.add('dark-mode'); dmBtn.innerHTML = '<i class="bi bi-sun"></i>'; }
    dmBtn.addEventListener('click', () => {
      const isDark = document.body.classList.toggle('dark-mode');
      dmBtn.innerHTML = isDark ? '<i class="bi bi-sun"></i>' : '<i class="bi bi-moon"></i>';
      localStorage.setItem('ged_theme', isDark ? 'dark' : 'light');
    });
  }

  
  /* ---------- Tracking form redirect (track.html) ---------- */
  const trackForm = document.getElementById('trackForm');
  if(trackForm){
    trackForm.addEventListener('submit', function(e){
      e.preventDefault();
      const tn = document.getElementById('trackingInput').value.trim();
      if(!tn){ document.getElementById('trackingInput').classList.add('is-invalid'); setTimeout(()=>document.getElementById('trackingInput').classList.remove('is-invalid'),1400); return; }
      location.href = `result.html?trackingID=${encodeURIComponent(tn)}`;
    });
  }

  /* ---------- Demo tracking dataset (client-side) ---------- */
  window.__demoTracking = {
    'GEX123456': {
      tracking: 'GEX123456',
      service: 'Air Express',
      origin: 'Lagos, NG',
      destination: 'London, UK',
      eta: '2025-10-22',
      progress: 80,
      events: [
        {time:'2025-10-14 09:02', status:'Label created — awaiting pickup', location:'Lagos, NG'},
        {time:'2025-10-14 14:20', status:'Picked up by carrier', location:'Lagos, NG'},
        {time:'2025-10-15 08:40', status:'In transit (flight)', location:'Lagos Intl Airport'},
        {time:'2025-10-18 12:15', status:'Arrived at destination hub', location:'Heathrow, UK'},
        {time:'2025-10-20 07:30', status:'Out for delivery', location:'London, UK'}
      ]
    },
      
      
      'KAZ252611': {
      tracking: 'KAZ252611',
      service: 'Dubai Intl Airport, UAE','Almaty Airport',
      origin: 'London, UK','Manchester, UK','Birmingham, UK',
      destination: 'JFK Intl','Kazakhstan',
      eta: '2025-11-07',
      progress: 80,
      events: [
        {time:'2025-10-14 09:02', status:'Label created — awaiting pickup', location:'London, UK'},
        {time:'2025-10-14 14:20', status:'Picked up by carrier', location:'London, UK'},
        {time:'2025-10-15 08:40', status:'In transit (flight)', location:'London Heathrow Airport, New York, Boston Logan International Airport'},
        {time:'2025-10-18 12:15', status:'Arrived at destination hub', location:'Almaty Region, Kazakhstan'},
        {time:'2025-10-20 07:30', status:'Out for delivery', location:'Kasymbek Village, Zhambyl District,'}
      ]
    },
    'GEX000001': {
      tracking: 'GEX000001',
      service: 'Sea Cargo',
      origin: 'Shanghai, CN',
      destination: 'New York, US',
      eta: '2025-11-05',
      progress: 45,
      events: [
        {time:'2025-09-25 10:00', status:'Container loaded on vessel', location:'Shanghai Port'},
        {time:'2025-09-27 18:00', status:'Departed port', location:'Shanghai Port'},
        {time:'2025-10-12 09:00', status:'In transit (ocean)', location:'Atlantic Ocean'}
      ]
    }
  };

  /* ---------- Render tracking result (result.html) ---------- */
  window.renderTrackingResult = function(trackingID){
    const loading = document.getElementById('loading');
    const notFound = document.getElementById('notFound');
    const trackingResult = document.getElementById('trackingResult');
    if(loading) loading.style.display = 'flex';
    setTimeout(()=> {
      if(loading) loading.style.display = 'none';
      const data = window.__demoTracking[trackingID] || null;
      if(!data){
        if(notFound) notFound.style.display = 'block';
        return;
      }
      if(trackingResult) trackingResult.style.display = 'block';
      // fill
      const setText = (id, text) => { const el = document.getElementById(id); if(el) el.textContent = text; };
      setText('resTracking', data.tracking);
      setText('resRoute', `${data.origin} → ${data.destination}`);
      setText('resService', data.service);
      setText('resETA', data.eta);
      const prog = document.getElementById('resProgress');
      if(prog) prog.style.width = (data.progress || 0) + '%';
      // timeline
      const timeline = document.getElementById('timeline');
      if(timeline){
        timeline.innerHTML = '';
        data.events.slice().reverse().forEach(ev=>{
          const node = document.createElement('div');
          node.className = 'd-flex mb-3';
          node.innerHTML = `<div style="width:12px;min-width:12px;height:12px;background:var(--primary);border-radius:50%;margin-right:12px;margin-top:6px;"></div>
            <div><div class="small text-muted">${ev.time} • ${ev.location}</div><div>${ev.status}</div></div>`;
          timeline.appendChild(node);
        });
      }
    }, 700);
  };

  /* ---------- On result page load: fetch query and render ---------- */
  (function handleResultPage(){
    const params = new URLSearchParams(location.search);
    const id = params.get('trackingID') || params.get('tn') || params.get('trackingId');
    if(!id) return;
    // show loader and then render
    if(typeof window.renderTrackingResult === 'function') window.renderTrackingResult(id);
  })();

  /* ---------- WhatsApp widget injection (works on all pages) ---------- */
  (function injectWhatsApp(){
    const root = document.createElement('div');
    root.className = 'wh-widget';
    root.innerHTML = `
      <div class="panel card-glass" id="wh-panel" style="display:none;">
        <div class="p-3">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <strong>Chat with us</strong>
            <button class="btn btn-sm btn-light" id="whClose">Close</button>
          </div>
          <div class="item d-flex align-items-center justify-content-between">
            <div>
              <div class="fw-semibold">UK Office</div>
              <div class="small text-muted">+44 7474 179851</div>
            </div>
            <a class="btn btn-success btn-sm" href="https://wa.me/447474179851" target="_blank" rel="noopener">Open</a>
          </div>
          <div class="item d-flex align-items-center justify-content-between">
            <div>
              <div class="fw-semibold">US Office</div>
              <div class="small text-muted">+1 (929) 400-8690</div>
            </div>
            <a class="btn btn-success btn-sm" href="https://wa.me/19294008690" target="_blank" rel="noopener">Open</a>
          </div>
        </div>
      </div>
      <button class="wh-btn" id="wh-btn" title="Chat with us"><i class="bi bi-whatsapp" style="font-size:20px;color:#fff;"></i></button>
    `;
    document.body.appendChild(root);
    const panel = document.getElementById('wh-panel');
    const btn = document.getElementById('wh-btn');
    const close = document.getElementById('whClose');
    btn.addEventListener('click', ()=> panel.style.display = (panel.style.display === 'block' ? 'none' : 'block'));
    close && close.addEventListener('click', ()=> panel.style.display='none');
    document.addEventListener('click', (e)=>{
      if(!root.contains(e.target) && panel.style.display === 'block') panel.style.display = 'none';
    });
  })();

}); // DOMContentLoaded end

// Basic multi-language support
const translations = {
  en: {
    heroTitle: "Reliable Global Delivery Services",
    heroSubtitle: "Ship your goods safely, quickly, and affordably.",
    track: "Track Shipment",
    quote: "Request a Quote",
    contact: "Contact Us"
  },
  fr: {
    heroTitle: "Services de livraison mondiale fiables",
    heroSubtitle: "Expédiez vos marchandises en toute sécurité, rapidement et à moindre coût.",
    track: "Suivre l'expédition",
    quote: "Demander un devis",
    contact: "Nous contacter"
  },
  es: {
    heroTitle: "Servicios de entrega global confiables",
    heroSubtitle: "Envía tus productos de manera segura, rápida y económica.",
    track: "Rastrear envío",
    quote: "Solicitar cotización",
    contact: "Contáctenos"
  }
};

// Handle language selection
document.querySelectorAll(".lang-option").forEach(option => {
  option.addEventListener("click", (e) => {
    e.preventDefault();
    const lang = e.target.dataset.lang;
    applyLanguage(lang);
  });
});

function applyLanguage(lang) {
  const elements = document.querySelectorAll("[data-translate]");
  elements.forEach(el => {
    const key = el.dataset.translate;
    el.textContent = translations[lang][key] || el.textContent;
  });
}

// Counter animation
const counters = document.querySelectorAll('.counter');
const speed = 200;

const startCounting = () => {
  counters.forEach(counter => {
    const update = () => {
      const target = +counter.getAttribute('data-target');
      const count = +counter.innerText;
      const inc = target / speed;

      if (count < target) {
        counter.innerText = Math.ceil(count + inc);
        setTimeout(update, 30);
      } else {
        counter.innerText = target;
      }
    };
    update();
  });
};

// Detect when section is visible
const statsSection = document.querySelector('#stats');
let started = false;
window.addEventListener('scroll', () => {
  const sectionTop = statsSection.offsetTop - window.innerHeight + 200;
  if (!started && window.scrollY > sectionTop) {
    startCounting();
    started = true;
  }
});
