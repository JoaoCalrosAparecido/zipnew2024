window.onload = function() {
    var precos = document.querySelectorAll('.product-price');
    precos.forEach(function(p) {
        p.innerHTML = p.innerHTML.replace(/\./g, ',');
    });
};
window.onload = function() {
    var preco = document.getElementById('parte_preço_bolsa_Preta');
    preco.forEach(function(p) {
        p.innerHTML = p.innerHTML.replace(/\./g, ',');
    });
};