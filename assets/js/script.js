// Custom script for animations and effects

document.addEventListener('DOMContentLoaded', () => {
    // Mobile nav toggle
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const navbar = document.querySelector('#navbar');

    if (mobileNavToggle && navbar) {
        mobileNavToggle.addEventListener('click', () => {
            navbar.classList.toggle('navbar-mobile');
            const icon = mobileNavToggle.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
            console.log('Mobile nav toggled, navbar-mobile:', navbar.classList.contains('navbar-mobile'));
        });
    } else {
        console.error('Mobile nav toggle or navbar not found');
    }

    // Scroll to section with offset
    document.querySelectorAll('.scrollto').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const header = document.querySelector('#header');
                const offset = header ? header.offsetHeight : 0;
                const elementPos = target.offsetTop;
                window.scrollTo({
                    top: elementPos - offset,
                    behavior: 'smooth'
                });
                if (navbar.classList.contains('navbar-mobile')) {
                    navbar.classList.remove('navbar-mobile');
                    const icon = mobileNavToggle.querySelector('i');
                    if (icon) {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                }
            }
        });
    });

    // Navbar active state on scroll
    const navbarlinks = document.querySelectorAll('#navbar .scrollto');
    window.addEventListener('scroll', () => {
        let position = window.scrollY + 200;
        navbarlinks.forEach(link => {
            const href = link.getAttribute('href');
            const section = document.querySelector(href);
            if (section && position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Progress bar
        const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        document.querySelector('.neon').style.width = scrolled + '%';

        // Fade-in animation for sections
        document.querySelectorAll('section:not(.about):not(.download)').forEach(section => {
            const sectionTop = section.getBoundingClientRect().top + window.scrollY;
            if (window.scrollY > sectionTop - window.innerHeight * 0.1) {
                section.classList.add('visible');
            }
        });

        // Header scrolled effect
        const header = document.querySelector('#header');
        if (header && window.scrollY > 100) {
            header.classList.add('header-scrolled');
        } else if (header) {
            header.classList.remove('header-scrolled');
        }
    });

    // Custom slider for Devices and Team
    document.querySelectorAll('.custom-slider').forEach(slider => {
        const wrapper = slider.querySelector('.slider-wrapper');
        const slides = slider.querySelectorAll('.slide');
        const prevBtn = slider.querySelector('.slider-prev');
        const nextBtn = slider.querySelector('.slider-next');
        let currentIndex = 0;
        const totalSlides = slides.length;
        const visibleSlides = window.innerWidth >= 1200 ? 3 : window.innerWidth >= 768 ? 2 : 1;
        const slideWidth = 100 / visibleSlides;

        function updateSlider() {
            wrapper.style.transform = `translateX(-${currentIndex * slideWidth}%)`;
            prevBtn.disabled = currentIndex === 0;
            nextBtn.disabled = currentIndex >= totalSlides - visibleSlides;
        }

        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => {
                if (currentIndex > 0) {
                    currentIndex--;
                    updateSlider();
                }
            });

            nextBtn.addEventListener('click', () => {
                if (currentIndex < totalSlides - visibleSlides) {
                    currentIndex++;
                    updateSlider();
                }
            });
        }

        // Auto-slide every 5 seconds
        let autoSlide = setInterval(() => {
            if (currentIndex < totalSlides - visibleSlides) {
                currentIndex++;
            } else {
                currentIndex = 0;
            }
            updateSlider();
        }, 5000);

        // Pause on hover
        slider.addEventListener('mouseenter', () => clearInterval(autoSlide));
        slider.addEventListener('mouseleave', () => {
            autoSlide = setInterval(() => {
                if (currentIndex < totalSlides - visibleSlides) {
                    currentIndex++;
                } else {
                    currentIndex = 0;
                }
                updateSlider();
            }, 5000);
        });

        // Initialize
        wrapper.style.width = `${totalSlides * 100}%`;
        slides.forEach(slide => slide.style.width = `${slideWidth}%`);
        updateSlider();
    });

    console.log('DOM fully loaded and custom script executed');
});