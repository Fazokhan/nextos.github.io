// Mobile Menu Toggle
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('nav ul');
const navLinks = document.querySelectorAll('nav ul li a');

menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('show');
});

// Auto-close menu on link click (mobile)
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('show');
    });
});

// Progress Bar
const progressBar = document.getElementById('wenprogressbar');
window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    progressBar.style.width = progress + '%';
});

// Fade-in on scroll (only when scrolling down)
let lastScrollTop = 0;
const fadeElements = document.querySelectorAll('.fade-in');

window.addEventListener('scroll', () => {
    let currentScroll = window.scrollY;

    if (currentScroll > lastScrollTop) {
        fadeElements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            if (elementTop < window.innerHeight - 100) {
                el.classList.add('visible');
            }
        });
    }
    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
});