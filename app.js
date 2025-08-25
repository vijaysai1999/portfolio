/* ===== INIT FEATHER ===== */
document.addEventListener('DOMContentLoaded', () => feather.replace());

/* ===== THEME TOGGLE (persist) ===== */
const root = document.documentElement;
const stored = localStorage.getItem('theme');
if (stored === 'light') document.body.classList.add('light');

const toggleBtn = document.getElementById('theme-toggle');
const setIcon = () => {
  toggleBtn.innerHTML = document.body.classList.contains('light') ? '<i data-feather="sun"></i>' : '<i data-feather="moon"></i>';
  feather.replace();
};
setIcon();

toggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('light');
  localStorage.setItem('theme', document.body.classList.contains('light') ? 'light' : 'dark');
  setIcon();
});

/* ===== TYPED HERO TAGLINE ===== */
const typed = new Typed('#typed', {
  strings: [
    'Software Developer 👨‍💻',
    'Mainframes & Java ⚡',
    'Cloud Certified ☁️',
    'Building Scalable Systems 🚀'
  ],
  typeSpeed: 60, backSpeed: 40, backDelay: 1600, loop: true
});

/* ===== LENIS SMOOTH SCROLL ===== */
const lenis = new Lenis({ smoothWheel: true });
function raf(time){ lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);

/* ===== CANVAS STARFIELD / PARTICLES ===== */
const c = document.getElementById('space');
const ctx = c.getContext('2d');
let W, H, stars;
function resize(){
  W = c.width = window.innerWidth; H = c.height = window.innerHeight;
  stars = Array.from({length: Math.min(300, Math.floor(W*H/5000))}, () => ({
    x: Math.random()*W, y: Math.random()*H, z: Math.random()*1+0.5, r: Math.random()*1.4+0.3, vx:(Math.random()-.5)*0.2, vy:(Math.random()-.5)*0.2
  }));
}
window.addEventListener('resize', resize); resize();

function loop(){
  ctx.clearRect(0,0,W,H);
  ctx.globalCompositeOperation = 'lighter';
  for(const s of stars){
    s.x += s.vx*s.z; s.y += s.vy*s.z;
    if(s.x<0||s.x>W||s.y<0||s.y>H){ s.x=Math.random()*W; s.y=Math.random()*H; }
    const g = ctx.createRadialGradient(s.x,s.y,0,s.x,s.y,s.r*8);
    g.addColorStop(0, 'rgba(255,255,255,.9)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fill();
  }
  requestAnimationFrame(loop);
}
loop();

/* ===== GSAP MOTION & SCROLLTRIGGER ===== */
gsap.registerPlugin(ScrollTrigger);

// Magnetic buttons
document.querySelectorAll('.magnet').forEach(el=>{
  const strength = 20;
  el.addEventListener('mousemove', (e)=>{
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width/2);
    const y = e.clientY - (r.top + r.height/2);
    gsap.to(el, {x: (x/r.width)*strength, y: (y/r.height)*strength, duration: .25, ease:'power2.out'});
  });
  el.addEventListener('mouseleave', ()=> gsap.to(el, {x:0, y:0, duration:.4, ease:'power3.out'}));
});

// Reveal on scroll
const revealEls = document.querySelectorAll('.section, .card, .proj-card, .bar, .timeline .tl-item, .contact-card');
revealEls.forEach(el=>{
  el.classList.add('reveal');
  ScrollTrigger.create({
    trigger: el, start: 'top 85%', onEnter: ()=> el.classList.add('show')
  });
});

// Hero entrance
gsap.from('.pfp-wrap',{y:20, opacity:0, duration:.8, ease:'power3.out'});
gsap.from('.title',{y:20, opacity:0, duration:.8, delay:.1, ease:'power3.out'});
gsap.from('.subtitle',{y:20, opacity:0, duration:.8, delay:.2, ease:'power3.out'});
gsap.from('.cta-row .btn',{y:20, opacity:0, duration:.6, delay:.3, stagger:.08});

/* ===== SWIPER PROJECTS ===== */
const swiper = new Swiper
