const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
      if (entry.intersectionRatio >= 1) {
          if (entry.target.classList.contains('init-hidden--direita')) {
              entry.target.classList.add('animate__fadeInRight');
          } else if (entry.target.classList.contains('init-hidden')) {
              entry.target.classList.add('animate__fadeIn');
          } 
      }
  });
}, {
  threshold: [0, .5, 1]
});

document.querySelectorAll('.init-hidden, .init-hidden--direita').forEach(element => {
  observer.observe(element);
});
