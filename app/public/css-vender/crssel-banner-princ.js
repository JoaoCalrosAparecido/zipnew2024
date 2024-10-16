var swiper3 = new Swiper(".mySwiper3", {
    grabCursor: true,
    autoplay: {
        delay: 3500,
        disableOnInteraction: false,
    },
    effect: "creative",
    creativeEffect: {
        prev: {
            shadow: true,
            translate: ["-20%", 0, -1],
        },
        next: {
            translate: ["100%", 0, 0],
        },
    },
});