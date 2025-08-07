document.addEventListener('DOMContentLoaded', () => {
    const sliders = document.querySelectorAll('.testimonials-slider');
    
    sliders.forEach(slider => {
        const slides = slider.querySelectorAll('.swiper-slide');
        const pagination = slider.querySelector('.swiper-pagination');
        let currentSlide = 0;

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
            wrapper.style.transform = `translateX(-${index * 100}%)`;
            slider.querySelector('.swiper-pagination-bullet-active')?.classList.remove('swiper-pagination-bullet-active');
            pagination.children[index].classList.add('swiper-pagination-bullet-active');
            currentSlide = index;
        }

        // Auto-swipe every 5 seconds
        setInterval(() => {
            currentSlide = (currentSlide + 1) % slides.length;
            goToSlide(slider, currentSlide);
        }, 5000);
    });
});