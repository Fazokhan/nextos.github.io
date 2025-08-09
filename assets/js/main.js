/* assets/js/main.js
   Progress bar, mobile menu, fade-in on scroll (only when scrolling down),
   smooth scrolling with header offset, and click-outside to close mobile menu.
*/

const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));

/* Elements */
const progressBar = $('#wenprogressbar'); // the blue top bar
const header = $('#site-header') || $('header'); // header element
const menuToggle = $('#menu-toggle');
const navMenu = $('#nav-menu'); // the UL

/* ---------- Progress bar ---------- */
function updateProgress() {
  const scrollTop = document.documentElement.scrollTop || window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  if (progressBar) progressBar.style.width = pct + '%';
}
window.addEventListener('scroll', updateProgress, { passive: true });
window.addEventListener('resize', updateProgress);
window.addEventListener('load', updateProgress);

/* ---------- Mobile menu toggle & auto-close ---------- */
if (menuToggle && navMenu) {
  menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('open');
    const open = navMenu.classList.contains('open');
    menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  // close when clicking a nav link (and smooth-scroll to section)
  navMenu.addEventListener('click', (ev) => {
    const a = ev.target.closest('a');
    if (!a) return;
    ev.preventDefault();
    const href = a.getAttribute('href');
    if (!href || !href.startsWith('#')) return;

    // smooth scroll to target with header offset
    const id = href.slice(1);
    const target = document.getElementById(id);
    if (target) {
      const headerH = header ? header.getBoundingClientRect().height : 72;
      const top = target.offsetTop - headerH + 6;
      window.scrollTo({ top, behavior: 'smooth' });
    }

    // auto-close menu on mobile
    if (navMenu.classList.contains('open')) {
      navMenu.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });

  // click outside -> close
  document.addEventListener('click', (ev) => {
    const inside = ev.target.closest('#nav-menu') || ev.target.closest('#menu-toggle');
    if (!inside && navMenu.classList.contains('open')) {
      navMenu.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ---------- Fade-in animations, trigger only when scrolling down ---------- */
let lastScroll = window.pageYOffset || document.documentElement.scrollTop;
const fadeEls = $$('.fade-card'); // use the class used in HTML/CSS

// IntersectionObserver tracks which are in view; we only apply the in-view class while scrolling down
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    // mark dataset.visible for that element
    entry.target.dataset.visible = entry.isIntersecting ? '1' : '0';
    // do not add class here; the scroll handler applies it only on downward scroll
    if (!entry.isIntersecting) entry.target.classList.remove('in-view');
  });
}, { threshold: 0.55 });

fadeEls.forEach(el => io.observe(el));

// scroll handler: when scrolling downward, add in-view to elements that are marked visible
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

/* Ensure first-view elements animate on load if they are visible */
window.addEventListener('load', () => {
  fadeEls.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.8) el.classList.add('in-view');
  });
});