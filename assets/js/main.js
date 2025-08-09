/* assets/js/main.js - NEXTOS JavaScript */

const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));

/* Elements */
const progressBar = $('#wenprogressbar');
const header = $('#site-header');
const menuToggle = $('#menu-toggle');
const navMenu = $('#nav-menu');
const snapContainer = $('.snap-container');
const fadeEls = $$('.fade-card');

/* Progress bar */
function updateProgress() {
  if (!progressBar || !snapContainer) {
    console.error('Progress bar or snap container not found');
    return;
  }
  const scrollTop = snapContainer.scrollTop || window.scrollY;
  const docHeight = snapContainer.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  console.log('ScrollTop:', scrollTop, 'DocHeight:', docHeight, 'Pct:', pct);
  progressBar.style.width = `${pct}%`;
  progressBar.style.visibility = 'visible';
}

/* Debounced scroll handler */
let scrollTimeout;
function debounceScroll(fn) {
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(fn, 10); // Reduced to 10ms
}

/* Initialize listeners */
if (progressBar && snapContainer) {
  snapContainer.addEventListener('scroll', () => {
    console.log('Snap container scroll triggered');
    debounceScroll(updateProgress);
  }, { passive: true });
  window.addEventListener('resize', updateProgress);
  window.addEventListener('load', updateProgress);
}

/* Mobile menu toggle & auto-close */
if (menuToggle && navMenu) {
  let isToggling = false;
  const toggleMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isToggling) return;
    isToggling = true;
    setTimeout(() => { isToggling = false; }, 300); // Increased to 300ms
    const open = navMenu.classList.toggle('open');
    console.log('Menu toggled:', open ? 'Open' : 'Closed', 'Event:', e.type);
  };
  menuToggle.addEventListener('click', toggleMenu);
  menuToggle.addEventListener('pointerdown', toggleMenu, { passive: false });

  navMenu.addEventListener('click', (ev) => {
    const a = ev.target.closest('a');
    if (!a) return;
    ev.preventDefault();
    ev.stopPropagation();
    const href = a.getAttribute('href');
    if (!href || !href.startsWith('#')) return;
    const id = href.slice(1);
    const target = document.getElementById(id);
    if (target && snapContainer) {
      const headerH = header ? header.getBoundingClientRect().height : 80;
      const top = target.offsetTop - headerH + 6;
      snapContainer.style.scrollSnapType = 'none';
      window.scrollTo({ top, behavior: 'smooth' });
      setTimeout(() => {
        snapContainer.style.scrollSnapType = 'y proximity';
      }, 1000);
    }
    navMenu.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    navMenu.setAttribute('aria-hidden', 'true');
    console.log('Menu closed via link click');
  });

  document.addEventListener('pointerdown', (ev) => {
    if (navMenu.classList.contains('open') && !isToggling) {
      if (!ev.target.closest('#nav-menu') && !ev.target.closest('#menu-toggle')) {
        navMenu.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        navMenu.setAttribute('aria-hidden', 'true');
        console.log('Menu closed via outside click', 'Target:', ev.target);
      }
    }
  }, { passive: true });
}

/* Fade-in animation */
let lastScroll = window.pageYOffset || document.documentElement.scrollTop;
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    entry.target.dataset.visible = entry.isIntersecting ? '1' : '0';
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
    } else {
      entry.target.classList.remove('in-view');
    }
  });
}, { threshold: 0.2 });

fadeEls.forEach(el => io.observe(el));

window.addEventListener('scroll', () => {
  const now = window.pageYOffset || document.documentElement.scrollTop;
  const scrollingDown = now > lastScroll;
  if (scrollingDown) {
    fadeEls.forEach(el => {
      if (el.dataset.visible === '1') el.classList.add('in-view');
    });
  }
  lastScroll = now <= 0 ? 0 : now;
}, { passive: true });

/* Initial fade-in */
window.addEventListener('load', () => {
  fadeEls.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.8) el.classList.add('in-view');
  });
});