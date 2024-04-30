window.addEventListener('scroll', function() {
    const squares = document.querySelectorAll('.square');
    squares.forEach(square => {
      const rect = square.getBoundingClientRect();
      if (rect.top >= 8 && rect.bottom <= window.innerHeight) {
        square.style.transform = 'scale(1)';
      } else {
        square.style.transform = 'scale(0.8)';
      }
    });
  });
  