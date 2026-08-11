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
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function animateCount(el, target, dur) {
  if (prefersReducedMotion) {
    el.textContent = target.toLocaleString('en-IN');
    return;
  }
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

function closeMob() {
  if (navMobile && hamburger) {
    navMobile.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    navMobile.style.display = 'none';
    hamburger.focus();
  }
}

if (hamburger && navMobile) {
  hamburger.addEventListener('click', () => {
    const open = navMobile.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
    navMobile.style.display = open ? 'block' : 'none';
    if (open) {
      const firstLink = navMobile.querySelector('a');
      if (firstLink) setTimeout(() => firstLink.focus(), 50);
    }
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!hamburger.contains(e.target) && !navMobile.contains(e.target)) {
      closeMob();
    }
  });

  // Escape key closes menu
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && navMobile.classList.contains('open')) {
      closeMob();
    }
  });

  // Focus trap inside mobile menu
  navMobile.addEventListener('keydown', e => {
    if (e.key !== 'Tab') return;
    const focusable = Array.from(navMobile.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])'));
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  });
}

// Keyboard support for desktop nav dropdowns (aria-expanded)
document.querySelectorAll('.nav-links .has-drop > a').forEach(trigger => {
  const updateExpanded = (val) => trigger.setAttribute('aria-expanded', String(val));
  trigger.setAttribute('aria-expanded', 'false');
  trigger.closest('.has-drop').addEventListener('mouseenter', () => updateExpanded(true));
  trigger.closest('.has-drop').addEventListener('mouseleave', () => updateExpanded(false));
  trigger.closest('.has-drop').addEventListener('focusin', () => updateExpanded(true));
  trigger.closest('.has-drop').addEventListener('focusout', e => {
    if (!trigger.closest('.has-drop').contains(e.relatedTarget)) updateExpanded(false);
  });
});

// Gallery filter
function filterGallery(cat, btn) {
  document.querySelectorAll('.gf-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.g-item').forEach(item => {
    const show = cat === 'all' || item.dataset.cat === cat;
    item.style.display = show ? '' : 'none';
  });
}

// Award image lightbox (click to zoom)
const awardCards = document.querySelectorAll('.award-card');
if (awardCards.length) {
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML =
    '<button class="lightbox-close" aria-label="Close">&times;</button>' +
    '<figure class="lightbox-figure">' +
      '<img class="lightbox-img" alt="">' +
      '<figcaption class="lightbox-caption"></figcaption>' +
    '</figure>';
  document.body.appendChild(lightbox);

  const lbImg = lightbox.querySelector('.lightbox-img');
  const lbCaption = lightbox.querySelector('.lightbox-caption');

  function openLightbox(card) {
    const img = card.querySelector('img');
    if (!img) return;
    lbImg.src = img.src;
    lbImg.alt = img.alt || '';
    const title = card.querySelector('.award-title, .award-label');
    const body = card.querySelector('.award-body');
    lbCaption.innerHTML = title
      ? '<strong>' + title.textContent + '</strong>' + (body ? '<span>' + body.textContent + '</span>' : '')
      : '';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  awardCards.forEach(card => card.addEventListener('click', () => openLightbox(card)));
  lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
  });
}

// Smooth scroll for in-page anchor links
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if(t){ e.preventDefault(); t.scrollIntoView({ behavior:'smooth' }); }
  });
});
