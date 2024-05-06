window.addEventListener('scroll', function() {
    var icon1 = document.getElementById('icon1');
    
    if (window.scrollY > 300) {
        icon1.style.display = 'block';
    } else {
        icon1.style.display = 'none';
    }
});

window.addEventListener('scroll', function() {
    var icon1 = document.getElementById('icon3');
    var icon2 = document.getElementById('icon4');
    
    if (window.scrollY > 300) {
        icon1.style.display = 'block';
        icon2.style.display = 'none';
    } else {
        icon1.style.display = 'none';
        icon2.style.display = 'block';
    }
});

