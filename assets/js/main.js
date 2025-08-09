/* MAIN JS for NEXTOS landing */

/* helpers */
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

/* elements */
const progress = $('#wenprogressbar');
const header = $('#site-header');
const menuToggle = $('#menu-toggle');
const navMenu = $('#nav-menu'); // ul

/* progress bar (track scroll) */
function updateProgress(){
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progress.style.width = pct + '%';
}
window.addEventListener('scroll', updateProgress);
window.addEventListener('resize', updateProgress);
updateProgress();

/* mobile menu toggle + auto-close on link click */
menuToggle.addEventListener('click', () => {
  const open = navMenu.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
});
// auto-close when clicking a nav link (works for mobile & desktop)
navMenu.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') {
    // smooth scroll with header offset
    e.preventDefault();
    const targetId = e.target.getAttribute('href').replace('#','');
    const target = document.getElementById(targetId);
    if (target) {
      const headerHeight = header.getBoundingClientRect().height;
      const top = target.offsetTop - headerHeight + 6;
      window.scrollTo({ top, behavior: 'smooth' });
    }
    // close menu if open (mobile)
    if (navMenu.classList.contains('open')) {
      navMenu.classList.remove('open');
      menuToggle.setAttribute('aria-expanded','false');
    }
  }
});

/* click outside nav to close (mobile) */
document.addEventListener('click', (ev) => {
  if (!ev.target.closest('#nav-menu') && !ev.target.closest('#menu-toggle')) {
    if (navMenu.classList.contains('open')) {
      navMenu.classList.remove('open');
      menuToggle.setAttribute('aria-expanded','false');
    }
  }
});

/* fade-in when scrolling down only
   Use IntersectionObserver to mark visibility, but apply in-view only when user is scrolling downward.
*/
let lastScroll = window.pageYOffset || document.documentElement.scrollTop;
const fadeEls = $$('.fade-card');

const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    // mark dataset to indicate visibility; actual class added by scroll handler while scrolling down
    entry.target.dataset.visible = entry.isIntersecting ? '1' : '0';
    // if user scroll position currently shows entry and we're scrolldown, add class
    if (entry.isIntersecting && (window.pageYOffset > lastScroll)) {
      entry.target.classList.add('in-view');
    } else if (!entry.isIntersecting) {
      // remove when out of view (allows re-animation when re-enter)
      entry.target.classList.remove('in-view');
    }
  });
}, { threshold: 0.55 });

fadeEls.forEach(el => io.observe(el));

/* scroll handler to add in-view only when scrolling down */
window.addEventListener('scroll', () => {
  const current = window.pageYOffset || document.documentElement.scrollTop;
  const scrollingDown = current > lastScroll;
  if (scrollingDown) {
    fadeEls.forEach(el => {
      if (el.dataset.visible === '1') el.classList.add('in-view');
    });
  }
  lastScroll = current <= 0 ? 0 : current;
}, { passive: true });

/* ensure progress and observer on load */
window.addEventListener('load', () => {
  updateProgress();
  fadeEls.forEach(el => {
    // run a quick check to animate the first section
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.8) el.classList.add('in-view');
  });
});