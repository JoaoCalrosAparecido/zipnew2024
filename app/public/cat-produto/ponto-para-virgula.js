window.onload = function() {
    var precos = document.querySelectorAll('.product-price');
    precos.forEach(function(p) {
        p.innerHTML = p.innerHTML.replace(/\./g, ',');
    });
};