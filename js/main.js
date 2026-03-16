// Nav scroll
const nav = document.getElementById('navbar');
if (nav) {
  window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 40));
}

// Reveal on scroll
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('visible'); observer.unobserve(e.target); }});
}, { threshold: 0.1 });
document.querySelectorAll('.reveal, .tl-item').forEach(el => observer.observe(el));

// Counter animation
function animateCount(el, target, dur) {
  if (dur === undefined) dur = 2200;
  let start;
  const run = ts => {
    if(!start) start = ts;
    const prog = Math.min((ts - start) / dur, 1);
    const ease = 1 - Math.pow(1 - prog, 3);
    el.textContent = Math.floor(ease * target).toLocaleString('en-IN');
    if(prog < 1) requestAnimationFrame(run);
    else el.textContent = target.toLocaleString('en-IN');
  };
  requestAnimationFrame(run);
}

const impactSection = document.getElementById('impact');
if (impactSection) {
  const impactObs = new IntersectionObserver(entries => {
    if(entries[0].isIntersecting){
      document.querySelectorAll('.ic-num[data-target]').forEach(el =>
        animateCount(el, +el.dataset.target)
      );
      impactObs.disconnect();
    }
  }, { threshold: 0.15 });
  impactObs.observe(impactSection);
}

// Hamburger mobile menu
const hamburger = document.getElementById('navHamburger');
const navMobile = document.getElementById('navMobile');
if (hamburger && navMobile) {
  hamburger.addEventListener('click', () => {
    const open = navMobile.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    navMobile.style.display = open ? 'block' : 'none';
  });
  // Close mobile menu on outside click
  document.addEventListener('click', e => {
    if (!hamburger.contains(e.target) && !navMobile.contains(e.target)) {
      closeMob();
    }
  });
}

function closeMob() {
  if (navMobile && hamburger) {
    navMobile.classList.remove('open');
    hamburger.classList.remove('open');
    navMobile.style.display = 'none';
  }
}

// Gallery filter
function filterGallery(cat, btn) {
  document.querySelectorAll('.gf-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.g-item').forEach(item => {
    const show = cat === 'all' || item.dataset.cat === cat;
    item.style.display = show ? '' : 'none';
  });
}

// Smooth scroll for in-page anchor links
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if(t){ e.preventDefault(); t.scrollIntoView({ behavior:'smooth' }); }
  });
});
