/* ==============================================
   Kuzeytepe Muhtarın Yeri – Ana JavaScript
   ============================================== */

'use strict';

/* ---- Navbar: scroll efekti + aktif link ---- */
const header   = document.getElementById('header');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('main section[id]');

function onScroll() {
  /* Sticky arka plan */
  header.classList.toggle('stuck', window.scrollY > 56);

  /* Aktif nav linki */
  const scrollMid = window.scrollY + window.innerHeight / 2;
  let current = '';
  sections.forEach(sec => {
    if (sec.offsetTop <= scrollMid) current = sec.id;
  });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll(); // ilk yükleme

/* ---- Hero: hafif zoom (Ken Burns) ---- */
document.querySelector('.hero').classList.add('loaded');

/* ---- Hamburger menü ---- */
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

/* Overlay tıklamayla kapat */
document.addEventListener('click', e => {
  if (navMenu.classList.contains('open')
      && !navMenu.contains(e.target)
      && !hamburger.contains(e.target)) {
    navMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
});

/* Link tıklamayla kapat */
navMenu.querySelectorAll('.nav-link').forEach(a => {
  a.addEventListener('click', () => {
    navMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

/* ---- Scroll reveal animasyonu ---- */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.10, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('[data-anim]').forEach(el => revealObs.observe(el));

/* ---- Sayaç animasyonu (stats bar) ---- */
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el  = e.target;
    const end = parseInt(el.dataset.target, 10);
    if (isNaN(end)) return;
    counterObs.unobserve(el);
    animateCount(el, 0, end, 1400);
  });
}, { threshold: 0.6 });

document.querySelectorAll('.stat-num[data-target]').forEach(el => counterObs.observe(el));

function animateCount(el, from, to, duration) {
  let start = null;
  function step(ts) {
    if (!start) start = ts;
    const progress = Math.min((ts - start) / duration, 1);
    const ease     = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(from + (to - from) * ease);
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* ---- Menü filtre ---- */
const filterBtns  = document.querySelectorAll('.filter-btn');
const dishCards   = document.querySelectorAll('.dish-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');

    const filter = btn.dataset.filter;
    dishCards.forEach(card => {
      const match = filter === 'all' || card.dataset.cat === filter;
      card.classList.toggle('hide', !match);
    });
  });
});

/* ---- Galeri Lightbox ---- */
const lightbox = document.getElementById('lightbox');
const lbImg    = document.getElementById('lbImg');
const lbClose  = document.getElementById('lbClose');
const lbPrev   = document.getElementById('lbPrev');
const lbNext   = document.getElementById('lbNext');

const galleryItems = Array.from(document.querySelectorAll('.g-item'));
let currentIdx = 0;

function openLightbox(idx) {
  currentIdx = idx;
  const img = galleryItems[idx].querySelector('img');
  lbImg.src = img.src;
  lbImg.alt = img.alt;
  lightbox.removeAttribute('hidden');
  setTimeout(() => lightbox.style.opacity = '1', 10);
  document.body.style.overflow = 'hidden';
  lbClose.focus();
}

function closeLightbox() {
  lightbox.style.opacity = '0';
  setTimeout(() => {
    lightbox.setAttribute('hidden', '');
    lbImg.src = '';
    document.body.style.overflow = '';
  }, 320);
}

function showPrev() {
  currentIdx = (currentIdx - 1 + galleryItems.length) % galleryItems.length;
  const img  = galleryItems[currentIdx].querySelector('img');
  lbImg.src  = img.src;
  lbImg.alt  = img.alt;
}

function showNext() {
  currentIdx = (currentIdx + 1) % galleryItems.length;
  const img  = galleryItems[currentIdx].querySelector('img');
  lbImg.src  = img.src;
  lbImg.alt  = img.alt;
}

galleryItems.forEach((item, i) => {
  item.addEventListener('click',   () => openLightbox(i));
  item.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openLightbox(i);
    }
  });
});

lbClose.addEventListener('click', closeLightbox);
lbPrev.addEventListener('click',  showPrev);
lbNext.addEventListener('click',  showNext);

lightbox.addEventListener('click', e => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', e => {
  if (lightbox.hasAttribute('hidden')) return;
  if (e.key === 'Escape')      closeLightbox();
  if (e.key === 'ArrowLeft')   showPrev();
  if (e.key === 'ArrowRight')  showNext();
});

/* ---- Hero parallax (hafif) ---- */
const heroBg = document.querySelector('.hero-bg');
if (heroBg) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y < window.innerHeight) {
      heroBg.style.transform = `scale(1) translateY(${y * 0.18}px)`;
    }
  }, { passive: true });
}

/* ---- Menü kartı: hafif tilt efekti (mouse) ---- */
document.querySelectorAll('.dish-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r   = card.getBoundingClientRect();
    const x   = ((e.clientX - r.left) / r.width  - 0.5) * 6;
    const y   = ((e.clientY - r.top)  / r.height - 0.5) * 6;
    card.style.transform = `translateY(-7px) rotateX(${-y}deg) rotateY(${x}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ---- Galeri: hover'da komşu kartları soldur ---- */
const galleryGrid = document.querySelector('.gallery-grid');
if (galleryGrid) {
  galleryGrid.addEventListener('mouseover', e => {
    const hovered = e.target.closest('.g-item');
    if (!hovered) return;
    document.querySelectorAll('.g-item').forEach(item => {
      item.style.opacity = item === hovered ? '1' : '0.55';
      item.style.transition = 'opacity .3s ease';
    });
  });
  galleryGrid.addEventListener('mouseleave', () => {
    document.querySelectorAll('.g-item').forEach(item => {
      item.style.opacity = '1';
    });
  });
}

/* ---- Stats sayaç — daha kısa süre ---- */
/* (zaten counterObs ile yapılıyor, süreyi doğrudan orada düzenledik) */

/* ---- Smooth scroll ---- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id     = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    const offset = header.offsetHeight + 8;
    const top    = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
