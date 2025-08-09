/* assets/js/main.js */
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
  if (!progressBar) return;
  const scrollTop = document.documentElement.scrollTop || window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = `${pct}%`;
}

/* Debounced scroll handler */
let scrollTimeout;
function debounceScroll(fn) {
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(fn, 50);
}

/* Initialize listeners */
if (progressBar) {
  window.addEventListener('scroll', () => debounceScroll(updateProgress), { passive: true });
  window.addEventListener('resize', updateProgress);
  window.addEventListener('load', updateProgress);
}

/* Mobile menu toggle & auto-close */
if (menuToggle && navMenu) {
  const toggleMenu = (e) => {
    e.stopPropagation();
    const open = navMenu.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', open);
    navMenu.setAttribute('aria-hidden', !open);
  };
  menuToggle.addEventListener('click', toggleMenu);
  menuToggle.addEventListener('touchstart', toggleMenu, { passive: true });

  navMenu.addEventListener('click', (ev) => {
    const a = ev.target.closest('a');
    if (!a) return;
    ev.preventDefault();
    const href = a.getAttribute('href');
    if (!href || !href.startsWith('#')) return;
    const id = href.slice(1);
    const target = document.getElementById(id);
    if (target && snapContainer) {
      const headerH = header ? header.getBoundingClientRect().height : 72;
      const top = target.offsetTop - headerH + 6;
      snapContainer.style.scrollSnapType = 'none'; // Disable snap temporarily
      window.scrollTo({ top, behavior: 'smooth' });
      setTimeout(() => {
        snapContainer.style.scrollSnapType = 'y proximity'; // Restore snap
      }, 1000);
    }
    if (navMenu.classList.contains('open')) {
      navMenu.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      navMenu.setAttribute('aria-hidden', 'true');
    }
  });

  document.addEventListener('click', (ev) => {
    if (!ev.target.closest('#nav-menu') && !ev.target.closest('#menu-toggle')) {
      if (navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        navMenu.setAttribute('aria-hidden', 'true');
      }
    }
  });
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