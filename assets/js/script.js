document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section');
    let currentSectionIndex = 0;

    // Swipe Navigation
    let touchStartY = 0;
    let touchEndY = 0;

    document.addEventListener('touchstart', e => {
        touchStartY = e.changedTouches[0].screenY;
    });

    document.addEventListener('touchmove', e => {
        touchEndY = e.changedTouches[0].screenY;
    });

    document.addEventListener('touchend', () => {
        const deltaY = touchEndY - touchStartY;
        if (deltaY > 50 && currentSectionIndex > 0) {
            currentSectionIndex--;
        } else if (deltaY < -50 && currentSectionIndex < sections.length - 1) {
            currentSectionIndex++;
        }
        scrollToSection();
    });

    // Mouse Wheel Navigation
    document.addEventListener('wheel', e => {
        if (e.deltaY > 0 && currentSectionIndex < sections.length - 1) {
            currentSectionIndex++;
        } else if (e.deltaY < 0 && currentSectionIndex > 0) {
            currentSectionIndex--;
        }
        scrollToSection();
    });

    function scrollToSection() {
        sections.forEach((section, index) => {
            if (index === currentSectionIndex) {
                section.scrollIntoView({ behavior: 'smooth' });
                section.classList.add('in-view');
            } else {
                section.classList.remove('in-view');
            }
        });
    }

    // Initial Setup
    scrollToSection();

    // Intersection Observer for Scroll Animations
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, {
        threshold: 0.5
    });

    sections.forEach(section => {
        observer.observe(section);
    });
});