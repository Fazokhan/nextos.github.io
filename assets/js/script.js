document.addEventListener('DOMContentLoaded', () => {
    const stacks = document.querySelectorAll('.card-stack');

    stacks.forEach(stack => {
        const cards = stack.querySelectorAll('.card-item');
        let currentIndex = 0;

        // Initialize stack and circle indicators
        function updateStack() {
            cards.forEach((card, index) => {
                if (index === currentIndex) {
                    card.classList.add('active');
                    card.classList.remove('next', 'below');
                } else if (index === currentIndex + 1 && index < cards.length) {
                    card.classList.add('next');
                    card.classList.remove('active', 'below');
                } else {
                    card.classList.add('below');
                    card.classList.remove('active', 'next');
                }
            });

            // Update circle indicators
            const indicators = stack.nextElementSibling;
            if (indicators && indicators.classList.contains('circle-indicators')) {
                indicators.innerHTML = '';
                for (let i = 0; i < cards.length; i++) {
                    const span = document.createElement('span');
                    if (i === currentIndex) span.classList.add('active');
                    span.addEventListener('click', () => {
                        currentIndex = i;
                        updateStack();
                    });
                    indicators.appendChild(span);
                }
            }
        }

        // Swipe handling
        let touchStartX = 0;
        let touchEndX = 0;

        stack.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        });

        stack.addEventListener('touchmove', e => {
            touchEndX = e.changedTouches[0].screenX;
        });

        stack.addEventListener('touchend', () => {
            const deltaX = touchEndX - touchStartX;
            if (deltaX > 50 && currentIndex > 0) {
                currentIndex--; // Swipe right to previous card
            } else if (deltaX < -50 && currentIndex < cards.length - 1) {
                currentIndex++; // Swipe left to next card
            }
            updateStack();
        });

        // Mouse drag handling
        let isDragging = false;
        let startX = 0;

        stack.addEventListener('mousedown', e => {
            isDragging = true;
            startX = e.clientX;
            stack.style.cursor = 'grabbing';
        });

        stack.addEventListener('mousemove', e => {
            if (isDragging) {
                const currentX = e.clientX;
                const deltaX = currentX - startX;
                if (deltaX > 50 && currentIndex > 0) {
                    currentIndex--;
                    updateStack();
                    startX = currentX;
                } else if (deltaX < -50 && currentIndex < cards.length - 1) {
                    currentIndex++;
                    updateStack();
                    startX = currentX;
                }
            }
        });

        stack.addEventListener('mouseup', () => {
            isDragging = false;
            stack.style.cursor = 'grab';
        });

        stack.addEventListener('mouseleave', () => {
            isDragging = false;
            stack.style.cursor = 'grab';
        });

        // Initial setup
        updateStack();
    });
});