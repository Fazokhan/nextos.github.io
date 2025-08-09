/* assets/js/main.js
   Progress bar, mobile menu, fade-in on scroll (only when scrolling down),
   smooth scrolling with header offset, and click-outside to close mobile menu.
*/

const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));

/* Elements */
const progressBar = $('#wenprogressbar'); // the blue top bar
const header = $('#site-header');
const menuToggle = $('#menu-toggle');
const navMenu = $('#nav-menu'); // UL
const fadeEls = $$('.fade-card');

function updateProgress(){
  const scrollTop = document.documentElement.scrollTop || window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  if (progressBar) progressBar.style.width = pct + '%';
}

/* Init listeners */
window.addEventListener('scroll', updateProgress, { passive: true });
window.addEventListener('resize', updateProgress);
window.addEventListener('load', () => {
  updateProgress();
  // animate elements initially in view
  fadeEls.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.8) el.classList.add('in-view');
  });
});

/* Mobile menu toggle & auto-close */
if (menuToggle && navMenu) {
  menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = navMenu.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  navMenu.addEventListener('click', (ev) => {
    const a = ev.target.closest('a');
    if (!a) return;
    ev.preventDefault();
    const href = a.getAttribute('href');
    if (!href || !href.startsWith('#')) return;
    const id = href.slice(1);
    const target = document.getElementById(id);
    if (target) {
      const headerH = header ? header.getBoundingClientRect().height : 72;
      const top = target.offsetTop - headerH + 6;
      window.scrollTo({ top, behavior: 'smooth' });
    }
    if (navMenu.classList.contains('open')) {
      navMenu.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });

  // click outside closes menu
  document.addEventListener('click', (ev) => {
    if (!ev.target.closest('#nav-menu') && !ev.target.closest('#menu-toggle')) {
      if (navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        menuToggle.setAttribute('aria-expanded','false');
      }
    }
  });
}

/* Fade-in: IntersectionObserver marks visibility, scroll handler adds class only when scrolling down */
let lastScroll = window.pageYOffset || document.documentElement.scrollTop;

const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    entry.target.dataset.visible = entry.isIntersecting ? '1' : '0';
    if (!entry.isIntersecting) entry.target.classList.remove('in-view');
  });
}, { threshold: 0.55 });

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