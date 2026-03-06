// ── Script block 1 ──
// ── CUSTOM CURSOR ──
const dot=document.getElementById('cur-dot');
const ring=document.getElementById('cur-ring');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{
  mx=e.clientX;my=e.clientY;
  dot.style.left=mx+'px';dot.style.top=my+'px';
});
(function animRing(){
  rx+=(mx-rx)*.1;ry+=(my-ry)*.1;
  ring.style.left=rx+'px';ring.style.top=ry+'px';
  requestAnimationFrame(animRing);
})();
document.querySelectorAll('a,button,select,input,textarea,.mos,.srv-card,.tl-item,.hstat').forEach(el=>{
  el.addEventListener('mouseenter',()=>{dot.classList.add('hov');ring.classList.add('hov')});
  el.addEventListener('mouseleave',()=>{dot.classList.remove('hov');ring.classList.remove('hov')});
});

// ── PARALLAX HERO ──
const heroBg=document.querySelector('.hero-bg');
window.addEventListener('scroll',()=>{
  if(heroBg) heroBg.style.transform=`translateY(${window.scrollY*.3}px)`;
},{passive:true});

function setCookie(val){
  const consent = {
    value: val,
    expiry: Date.now() + 31536000000
  };
  localStorage.setItem('cookie_consent', JSON.stringify(consent));
  document.getElementById('cookie-banner').style.display='none';
}

window.addEventListener('DOMContentLoaded',()=>{
  const consent = JSON.parse(localStorage.getItem('cookie_consent'));
  if(!consent || Date.now() > consent.expiry){
    document.getElementById('cookie-banner').style.display='flex';
  }
});

// ── Script block 2 ──
(function(){
  // Navbar scroll
  const nav=document.getElementById('nav');
  window.addEventListener('scroll',()=>nav.classList.toggle('scrolled',scrollY>40),{passive:true});

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click',e=>{
      const t=document.querySelector(a.getAttribute('href'));
      if(!t)return;
      e.preventDefault();
      window.scrollTo({top:t.getBoundingClientRect().top+scrollY-76,behavior:'smooth'});
      mob.classList.remove('open');brg.classList.remove('open');
    });
  });

  // Dropdown — fullscreen overlay, click toggle
  document.querySelectorAll('.nav-dd').forEach(dd=>{
    const btn=dd.querySelector('.dd-toggle');
    const open=()=>{dd.classList.add('open');btn.setAttribute('aria-expanded','true')};
    const close=()=>{dd.classList.remove('open');btn.setAttribute('aria-expanded','false')};
    btn.addEventListener('click',e=>{e.stopPropagation();dd.classList.contains('open')?close():open()});
    dd.querySelector('.dd-overlay').addEventListener('click',e=>{if(e.target===e.currentTarget)close()});
  });
  document.addEventListener('click',()=>document.querySelectorAll('.nav-dd').forEach(dd=>{dd.classList.remove('open');dd.querySelector('.dd-toggle').setAttribute('aria-expanded','false')}));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')document.querySelectorAll('.nav-dd').forEach(dd=>{dd.classList.remove('open');dd.querySelector('.dd-toggle').setAttribute('aria-expanded','false')})});

  // Burger
  const brg=document.getElementById('burger');
  const mob=document.getElementById('mob-menu');
  brg.addEventListener('click',()=>{const o=mob.classList.toggle('open');brg.classList.toggle('open',o)});
  mob.querySelectorAll('[data-tab]').forEach(a=>{
    a.addEventListener('click',e=>{
      e.preventDefault();switchTab(a.dataset.tab);
      const s=document.getElementById('chi-siamo');
      window.scrollTo({top:s.getBoundingClientRect().top+scrollY-76,behavior:'smooth'});
    });
  });

  // Footer tab links
  document.querySelectorAll('.foot-col [data-tab]').forEach(a=>{
    a.addEventListener('click',e=>{
      e.preventDefault();switchTab(a.dataset.tab);
      const s=document.getElementById('chi-siamo');
      window.scrollTo({top:s.getBoundingClientRect().top+scrollY-76,behavior:'smooth'});
    });
  });

  // Tabs
  function switchTab(id){
    document.querySelectorAll('.tab-btn').forEach(b=>b.classList.toggle('active',b.dataset.tab===id));
    document.querySelectorAll('.tab-panel').forEach(p=>{
      const on=p.id==='panel-'+id;
      p.classList.toggle('active',on);
      p.style.display=on?'block':'none';
      if(on)p.querySelectorAll('.fu').forEach(el=>{el.classList.remove('vis');setTimeout(()=>el.classList.add('vis'),60)});
    });
  }
  document.querySelectorAll('.tab-panel:not(.active)').forEach(p=>p.style.display='none');
  document.querySelectorAll('.tab-btn').forEach(b=>b.addEventListener('click',()=>switchTab(b.dataset.tab)));

  // ── COUNTER ANIMATION ──
  const statsConfig=[
    {sel:'.hstat:nth-child(1) .hstat-v', target:2.4,  suffix:'Mrd', dec:1, sup:true},
    {sel:'.hstat:nth-child(2) .hstat-v', target:180,  suffix:'+',   dec:0, sup:true},
    {sel:'.hstat:nth-child(3) .hstat-v', target:20,   suffix:'',    dec:0, sup:false},
    {sel:'.hstat:nth-child(4) .hstat-v', target:12,   suffix:'%',   dec:0, sup:false},
  ];
  function animateCounter(el,target,suffix,dec,useSup,dur=3200){
    if(el._raf) cancelAnimationFrame(el._raf);
    const t0=performance.now();
    const html=s=>useSup?s+`<sup>${suffix}</sup>`:s+suffix;
    function step(now){
      const p=Math.min((now-t0)/dur,1);
      const e=1-Math.pow(1-p,4);
      el.innerHTML=html((e*target).toFixed(dec).replace('.',','));
      if(p<1){ el._raf=requestAnimationFrame(step); }
      else { el._raf=null; }
    }
    el._raf=requestAnimationFrame(step);
  }
  function runCounters(){
    statsConfig.forEach(c=>{
      const el=document.querySelector(c.sel);
      if(el)animateCounter(el,c.target,c.suffix,c.dec,c.sup);
    });
  }
  // Trigger on scroll into view
  const statsBar=document.querySelector('.hero-stats');
  let firstDone=false;
  if(statsBar){
    new IntersectionObserver(entries=>{
      if(entries[0].isIntersecting&&!firstDone){firstDone=true;runCounters();}
    },{threshold:0.5}).observe(statsBar);
  }
  window.addEventListener('load',()=>{
    const r=statsBar?.getBoundingClientRect();
    if(r&&r.top<window.innerHeight&&!firstDone){firstDone=true;runCounters();}
  });
  // Re-trigger on hover of each stat
  document.querySelectorAll('.hstat').forEach((stat,i)=>{
    stat.addEventListener('mouseenter',()=>{
      const c=statsConfig[i];
      const el=stat.querySelector('.hstat-v');
      if(el)animateCounter(el,c.target,c.suffix,c.dec,c.sup);
    });
  });

  // Mosaic spotlight
  const mosaic = document.querySelector('.mosaic');
  if(mosaic){
    mosaic.addEventListener('mouseover', e=>{
      const mos = e.target.closest('.mos');
      if(!mos) return;
      document.querySelectorAll('.mos').forEach(m=>m.classList.remove('mos-active'));
      mos.classList.add('mos-active');
    });
    mosaic.addEventListener('mouseleave', ()=>{
      document.querySelectorAll('.mos').forEach(m=>m.classList.remove('mos-active'));
    });
  }

  // Typewriter effect — Storia
  const twEls = document.querySelectorAll('.tw');
  let twTimer = null;

  function resetTw() {
    clearTimeout(twTimer);
    twEls.forEach(el => { el.textContent = ''; el.style.opacity = '1'; });
    const sig = document.querySelector('.tw-sig');
    if(sig) sig.style.opacity = '0';
  }

  function runTw() {
    resetTw();
    const items = Array.from(twEls);
    let idx = 0;

    function typeEl(el, cb) {
      const text = el.dataset.text || '';
      let i = 0;
      el.textContent = '';
      const speed = el.tagName === 'H2' ? 22 : 11;
      function tick() {
        if(i < text.length) {
          el.textContent = text.slice(0, ++i);
          twTimer = setTimeout(tick, speed);
        } else {
          setTimeout(cb, 80);
        }
      }
      tick();
    }

    function next() {
      if(idx >= items.length) {
        const sig = document.querySelector('.tw-sig');
        if(sig) sig.style.opacity = '1';
        return;
      }
      typeEl(items[idx++], next);
    }
    next();
  }

  // Add blink keyframe
  if(!document.getElementById('blink-style')) {
    const s = document.createElement('style');
    s.id = 'blink-style';
    s.textContent = '@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}';
    document.head.appendChild(s);
  }

  const storiaGrid = document.querySelector('#panel-storia .storia-grid > div:first-child');
  if(storiaGrid) {
    new IntersectionObserver(entries => {
      if(entries[0].isIntersecting) { runTw(); }
      else { resetTw(); }
    }, { threshold: 0.25 }).observe(storiaGrid);
  }

  // Timeline animata sequenziale — si ripete ad ogni scroll
  const tlObserver = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      const items = entry.target.querySelectorAll('.tl-item');
      if(entry.isIntersecting){
        items.forEach((item,i)=>{
          setTimeout(()=>item.classList.add('tl-vis'), i*420);
        });
      } else {
        items.forEach(item=>item.classList.remove('tl-vis'));
      }
    });
  },{threshold:0.1});
  const tlEl = document.querySelector('.tl');
  if(tlEl) tlObserver.observe(tlEl);


  // ── Vantaggi: typewriter on scroll ──
  (function(){
    const grid = document.getElementById('van-grid');
    if(!grid) return;
    const cards = grid.querySelectorAll('.van-card');

    function typewrite(el, text, speed, cb){
      el.textContent = '';
      let i = 0;
      const t = setInterval(()=>{
        el.textContent += text[i++];
        if(i >= text.length){ clearInterval(t); if(cb) cb(); }
      }, speed);
    }

    function animateCards(){
      cards.forEach((card, idx) => {
        setTimeout(()=>{
          const h = card.querySelector('.van-h');
          const p = card.querySelector('.van-p');
          if(h && h.dataset.text && !h.textContent){
            typewrite(h, h.dataset.text, 28, ()=>{
              if(p && p.dataset.text) typewrite(p, p.dataset.text, 12);
            });
          }
        }, idx * 180);
      });
    }

    const obs = new IntersectionObserver((entries)=>{
      if(entries[0].isIntersecting){ animateCards(); obs.disconnect(); }
    }, {threshold: 0.25});
    obs.observe(grid);

    // ── Click zoom + opacify ──
    cards.forEach(card=>{
      card.addEventListener('click', ()=>{
        const isActive = card.classList.contains('active');
        grid.classList.remove('has-active');
        cards.forEach(c => c.classList.remove('active'));
        if(!isActive){
          grid.classList.add('has-active');
          card.classList.add('active');
        }
      });
    });

    // click outside deactivates
    document.addEventListener('click', e=>{
      if(!grid.contains(e.target)){
        grid.classList.remove('has-active');
        cards.forEach(c=>c.classList.remove('active'));
      }
    });
  })();

  // Scroll animations
  const io=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){e.target.classList.add('vis')}
      else{e.target.classList.remove('vis')}
    });
  },{threshold:0.1});
  document.querySelectorAll('.fu').forEach((el,i)=>{
    el.style.transitionDelay=(i%4)*0.09+'s';
    io.observe(el);
  });

  // Form — Formspree
  const form=document.getElementById('contact-form');
  const msg=document.getElementById('form-msg');
  const btn=form.querySelector('.form-btn');
  form.addEventListener('submit',async e=>{
    e.preventDefault();
    const name=form.querySelector('[name="name"]').value.trim();
    const email=form.querySelector('[name="email"]').value.trim();
    const privacy=form.querySelector('[name="privacy"]').checked;
    const phone=form.querySelector('[name="phone"]').value.trim();
    if(!name||!email||!phone){show('Compila tutti i campi obbligatori (*).', false);return}
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){show('Email non valida.',false);return}
    if(!privacy){show('Devi accettare la Privacy Policy per continuare.',false);return}
    btn.disabled=true;btn.textContent='Invio in corso…';
    try{
      const fd=new FormData();
      fd.append('name', name);
      fd.append('email', email);
      fd.append('telefono', phone);
      fd.append('oggetto', form.querySelector('[name="subject"]').value);
      const res=await fetch('https://formspree.io/f/xdalqega',{
        method:'POST',
        headers:{'Accept':'application/json'},
        body:fd
      });
      const data=await res.json();
      if(res.ok && !data.errors){window.location.href='grazie.html'; return;}
      else{show((data.errors&&data.errors[0]&&data.errors[0].message)||'Errore nell\'invio. Riprova più tardi.',false);}
    }catch{
      show('Errore di rete. Riprova più tardi.',false);
    }finally{
      btn.disabled=false;btn.textContent='Invia la richiesta';
    }
  });
  function show(t,ok){
    msg.textContent=t;msg.style.display='block';
    msg.style.background=ok?'rgba(61,107,71,.08)':'rgba(192,57,43,.08)';
    msg.style.borderLeftColor=ok?'var(--ga)':'#c0392b';
    msg.style.color=ok?'var(--gd)':'#c0392b';
    setTimeout(()=>msg.style.display='none',6000);
  }
})();

// ── Script block 3 ──
(function(){
  function animateLine(text, el, startDelay, speed, onDone){
    text.split('').forEach((ch, i) => {
      const s = document.createElement('span');
      s.className = 'letter';
      s.textContent = ch === ' ' ? ' ' : ch;
      const delay = startDelay + i * speed;
      s.style.animationDelay = delay + 's';
      el.appendChild(s);
    });
    if(onDone){
      const totalTime = (startDelay + text.length * speed + 0.6) * 1000;
      setTimeout(onDone, totalTime);
    }
  }

  const line1 = "Gestiamo e valorizziamo";
  const line2 = "il tuo patrimonio";
  const el1 = document.getElementById('heroLine1');
  const el2 = document.getElementById('heroLine2');
  const logo = document.getElementById('heroLogo');

  if(!el1 || !el2) return;

  // Line 1 - faster
  animateLine(line1, el1, 0.1, 0.055, null);

  // Line 2 starts after line 1 finishes
  const line1End = 0.1 + line1.length * 0.055 + 0.2;
  animateLine(line2, el2, line1End, 0.09, function(){
    // Add shimmer to patrimoni
    el2.classList.add('shimmer-on');
    // Reveal logo
    if(logo){
      logo.style.transition='opacity 1s ease';
      logo.style.opacity='1';
    }
  });
})();

// ── Script block 4 ──
(function(){
  function buildLogoLetters(el, text, baseDelay){
    if(!el) return;
    text.split('').forEach((ch, i) => {
      const s = document.createElement('span');
      s.className = 'logo-letter';
      s.textContent = ch === ' ' ? ' ' : ch;
      s.style.animationDelay = (baseDelay + i * 0.18) + 's';
      el.appendChild(s);
    });
  }
  buildLogoLetters(document.getElementById('logoMGM'), 'MGM', 0);
  buildLogoLetters(document.getElementById('logoSub'), 'asset management', 0.5);
})();

// ── Script block 5 — Scroll Reveal (reconstructed) ──
(function(){
  const targets = [
    { sel: '#vantaggi .sec-lbl',                    dir: 'up',    delay: 0 },
    { sel: '#vantaggi .sec-title',                  dir: 'up',    delay: 0.1 },
    { sel: '#vantaggi .sec-sub',                    dir: 'up',    delay: 0.15 },
    { sel: '.van-card:nth-child(odd)',              dir: 'left',  delay: 0 },
    { sel: '.van-card:nth-child(even)',             dir: 'right', delay: 0.08 },
    { sel: '#immobili .sec-lbl',                    dir: 'up',    delay: 0 },
    { sel: '#immobili .sec-title',                  dir: 'up',    delay: 0.1 },
    { sel: '.gallery-intro p',                      dir: 'up',    delay: 0.2 },
    { sel: '.mos:nth-child(1)',                     dir: 'up',    delay: 0 },
    { sel: '.mos:nth-child(2)',                     dir: 'up',    delay: 0.1 },
    { sel: '.mos:nth-child(3)',                     dir: 'up',    delay: 0.18 },
    { sel: '.mos:nth-child(4)',                     dir: 'up',    delay: 0.08 },
    { sel: '.mos:nth-child(5)',                     dir: 'up',    delay: 0.16 },
    { sel: '#servizi .sec-lbl',                     dir: 'up',    delay: 0 },
    { sel: '#servizi .sec-title',                   dir: 'up',    delay: 0.1 },
    { sel: '#servizi .sec-sub',                     dir: 'up',    delay: 0.15 },
    { sel: '.srv-card:nth-child(1)',                dir: 'up',    delay: 0 },
    { sel: '.srv-card:nth-child(2)',                dir: 'up',    delay: 0.1 },
    { sel: '.srv-card:nth-child(3)',                dir: 'up',    delay: 0.2 },
    { sel: '.srv-card:nth-child(4)',                dir: 'up',    delay: 0.06 },
    { sel: '.srv-card:nth-child(5)',                dir: 'up',    delay: 0.14 },
    { sel: '.srv-card:nth-child(6)',                dir: 'up',    delay: 0.22 },
    { sel: '#chi-siamo .tabs',                      dir: 'up',    delay: 0 },
    { sel: '.storia-grid',                          dir: 'up',    delay: 0.1 },
    { sel: '.occ-intro',                            dir: 'up',    delay: 0 },
    { sel: '.occ-card:nth-child(odd)',              dir: 'left',  delay: 0 },
    { sel: '.occ-card:nth-child(even)',             dir: 'right', delay: 0.08 },
    { sel: '#trust .sec-lbl',                       dir: 'up',    delay: 0 },
    { sel: '#trust .sec-title',                     dir: 'up',    delay: 0.1 },
    { sel: '.trust-card',                           dir: 'up',    delay: 0 },
    { sel: '#contatti .sec-lbl',                    dir: 'up',    delay: 0 },
    { sel: '#contatti .sec-title',                  dir: 'up',    delay: 0.1 },
    { sel: '#contatti .sec-sub',                    dir: 'up',    delay: 0.15 },
    { sel: '.contact-form',                         dir: 'left',  delay: 0.1 },
    { sel: '.contact-map',                          dir: 'right', delay: 0.2 },
    { sel: '.foot-logo-block',                      dir: 'left',  delay: 0 },
    { sel: '.foot-cols',                            dir: 'right', delay: 0.1 },
  ];

  const dirClass = { up:'sr-up', down:'sr-down', left:'sr-left', right:'sr-right' };

  const observer = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add('sr-vis');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  targets.forEach(function(t){
    document.querySelectorAll(t.sel).forEach(function(el){
      el.classList.add('sr');
      if(dirClass[t.dir]) el.classList.add(dirClass[t.dir]);
      if(t.delay) el.style.transitionDelay = t.delay + 's';
      observer.observe(el);
    });
  });
})();