// ====== helpers ======
const q = sel => document.querySelector(sel);
const qAll = sel => Array.from(document.querySelectorAll(sel));

// ====== progress bar ======
const neonBar = q('.wenprogress .neon');
function updateProgress() {
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  neonBar.style.width = pct + '%';
}
window.addEventListener('scroll', updateProgress);
window.addEventListener('resize', updateProgress);
updateProgress();

// ====== fade-in on scroll via IntersectionObserver ======
const sections = qAll('.fade-section');
const ioOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.55   // more than half of section visible -> mark in-view
};
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      // do NOT unobserve so snapping back also animates (optional)
    } else {
      // keep in-view only while visible; remove if you want re-animation on re-enter:
      entry.target.classList.remove('in-view');
    }
  });
}, ioOptions);

sections.forEach(s => io.observe(s));

// ====== nav toggle / smooth scroll with header offset ======
const menuToggle = q('#menu-toggle');
const navMenu = q('#nav-menu');
const header = q('#site-header');
const headerHeight = () => header.getBoundingClientRect().height || 72;

// Toggle menu (click)
menuToggle.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
});

// Smooth navigation + auto-close on mobile
qAll('#nav-menu a').forEach(a => {
  a.addEventListener('click', (ev) => {
    ev.preventDefault();
    const targetId = a.getAttribute('data-target') || a.getAttribute('href').replace('#','');
    const targetEl = document.getElementById(targetId);
    if (!targetEl) return;

    // compute top so content sits below header
    const top = targetEl.offsetTop - headerHeight() + 2; // small offset
    window.scrollTo({ top, behavior: 'smooth' });

    // auto-close menu when mobile
    if (navMenu.classList.contains('open')) {
      navMenu.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });
});

// Clicking outside menu closes it (mobile)
document.addEventListener('click', (ev) => {
  const inside = ev.target.closest('#nav-menu') || ev.target.closest('#menu-toggle');
  if (!inside && navMenu.classList.contains('open')) {
    navMenu.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }
});

// Ensure progress updates on load
window.addEventListener('load', updateProgress);