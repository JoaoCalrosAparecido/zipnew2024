const carouselSlide = document.querySelector('.carousel-slide');
const slides = document.querySelectorAll('.slide');
const paginationItems = document.querySelectorAll('.pagination-item');

let counter = 0;
const slideWidth = slides[0].clientWidth;

carouselSlide.style.transform = `translateX(${-slideWidth * counter}px)`;

setInterval(() => {
    counter++;
    if (counter >= slides.length) {
        counter = 0;
    }
    carouselSlide.style.transition = 'transform 0.2s ease-in-out';
    carouselSlide.style.transform = `translateX(${-slideWidth * counter}px)`;

    paginationItems.forEach(item => {
        item.classList.remove('active');
    });
    paginationItems[counter].classList.add('active');
}, 2000);
