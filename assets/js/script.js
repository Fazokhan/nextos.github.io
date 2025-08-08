document.addEventListener('DOMContentLoaded', () => {
    const stacks = document.querySelectorAll('.card-stack');

    // Card Stack Functionality
    stacks.forEach(stack => {
        const cards = stack.querySelectorAll('.card-item');
        let currentIndex = 0;
        let inactivityTimeout;
        let autoChangeInterval;

        function updateStack() {
            cards.forEach((card, index) => {
                if (index === currentIndex) {
                    card.classList.add('active');
                    card.classList.remove('next', 'below');
                } else if (index === (currentIndex + 1) % cards.length) {
                    card.classList.add('next');
                    card.classList.remove('active', 'below');
                } else if (index === (currentIndex - 1 + cards.length) % cards.length) {
                    card.classList.add('below');
                    card.classList.remove('active', 'next');
                } else {
                    card.classList.remove('active', 'next', 'below');
                }
            });

            const indicators = stack.nextElementSibling;
            if (indicators && indicators.classList.contains('circle-indicators')) {
                indicators.innerHTML = '';
                for (let i = 0; i < cards.length; i++) {
                    const span = document.createElement('span');
                    if (i === currentIndex) span.classList.add('active');
                    span.addEventListener('click', () => {
                        currentIndex = i;
                        updateStack();
                        resetInactivity();
                    });
                    indicators.appendChild(span);
                }
            }
        }

        function startAutoChange() {
            autoChangeInterval = setInterval(() => {
                currentIndex = (currentIndex + 1) % cards.length;
                updateStack();
            }, 3000); // Auto-change every 3 seconds
        }

        function stopAutoChange() {
            clearInterval(autoChangeInterval);
        }

        function resetInactivity() {
            clearTimeout(inactivityTimeout);
            stopAutoChange();
            inactivityTimeout = setTimeout(() => {
                startAutoChange();
            }, 3000); // Start auto-change after 3 seconds of inactivity
        }

        let touchStartX = 0;
        let touchEndX = 0;

        stack.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
            resetInactivity();
        });

        stack.addEventListener('touchmove', e => {
            touchEndX = e.changedTouches[0].screenX;
        });

        stack.addEventListener('touchend', () => {
            const deltaX = touchEndX - touchStartX;
            if (deltaX > 50 && currentIndex > 0) {
                currentIndex = (currentIndex - 1 + cards.length) % cards.length;
            } else if (deltaX < -50 && currentIndex < cards.length - 1) {
                currentIndex = (currentIndex + 1) % cards.length;
            }
            updateStack();
            resetInactivity();
        });

        let isDragging = false;
        let startX = 0;

        stack.addEventListener('mousedown', e => {
            isDragging = true;
            startX = e.clientX;
            resetInactivity();
            stack.style.cursor = 'grabbing';
        });

        stack.addEventListener('mousemove', e => {
            if (isDragging) {
                const currentX = e.clientX;
                const deltaX = currentX - startX;
                if (deltaX > 50 && currentIndex > 0) {
                    currentIndex = (currentIndex - 1 + cards.length) % cards.length;
                    updateStack();
                    startX = currentX;
                } else if (deltaX < -50 && currentIndex < cards.length - 1) {
                    currentIndex = (currentIndex + 1) % cards.length;
                    updateStack();
                    startX = currentX;
                }
            }
        });

        stack.addEventListener('mouseup', () => {
            isDragging = false;
            stack.style.cursor = 'grab';
            resetInactivity();
        });

        stack.addEventListener('mouseleave', () => {
            isDragging = false;
            stack.style.cursor = 'grab';
            resetInactivity();
        });

        updateStack();
        resetInactivity(); // Initial setup with inactivity check
    });

    // Intersection Observer for Scroll Animations
    const sections = document.querySelectorAll('section');

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target); // Stop observing after animation
            }
        });
    }, {
        threshold: 0.1 // Trigger when 10% visible
    });

    sections.forEach(section => {
        observer.observe(section);
    });
});