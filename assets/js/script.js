document.addEventListener('DOMContentLoaded', () => {
    console.log("Script loaded");
    const sliders = document.querySelectorAll('.testimonials-slider');
    
    sliders.forEach(slider => {
        const slides = slider.querySelectorAll('.swiper-slide');
        const pagination = slider.querySelector('.swiper-pagination');
        let currentSlide = 0;

        if (!slides.length || !pagination) {
            console.error("Slider or pagination not found", slider, pagination);
            return;
        }

        // Create pagination bullets
        slides.forEach((_, index) => {
            const bullet = document.createElement('span');
            bullet.classList.add('swiper-pagination-bullet');
            if (index === 0) bullet.classList.add('swiper-pagination-bullet-active');
            bullet.addEventListener('click', () => goToSlide(slider, index));
            pagination.appendChild(bullet);
        });

        function goToSlide(slider, index) {
            const wrapper = slider.querySelector('.swiper-wrapper');
            if (wrapper) {
                wrapper.style.transform = `translateX(-${index * 100}%)`;
                slider.querySelector('.swiper-pagination-bullet-active')?.classList.remove('swiper-pagination-bullet-active');
                pagination.children[index].classList.add('swiper-pagination-bullet-active');
                currentSlide = index;
            } else {
                console.error("Wrapper not found", slider);
            }
        }

        // Auto-swipe every 5 seconds
        setInterval(() => {
            currentSlide = (currentSlide + 1) % slides.length;
            goToSlide(slider, currentSlide);
        }, 5000);
    });

    // Add scroll event for progress bar and section fade-in
    window.addEventListener('scroll', () => {
        const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        document.querySelector('.neon').style.width = scrolled + '%';

        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top + window.scrollY;
            if (window.scrollY > sectionTop - window.innerHeight * 0.1) {
                section.classList.add('visible');
            }
        });
    });

    // Toggle mobile navigation
    document.querySelector('.mobile-nav-toggle').addEventListener('click', () => {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            navbar.classList.toggle('navbar-mobile');
            const icon = document.querySelector('.mobile-nav-toggle i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        }
    });

    // Smooth scroll for nav links
    document.querySelectorAll('.scrollto').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const target = document.getElementById(targetId);
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 60,
                    behavior: 'smooth'
                });
                if (document.querySelector('.navbar')?.classList.contains('navbar-mobile')) {
                    document.querySelector('.navbar').classList.remove('navbar-mobile');
                    document.querySelector('.mobile-nav-toggle i')?.classList.replace('fa-times', 'fa-bars');
                }
            }
        });
    });
});