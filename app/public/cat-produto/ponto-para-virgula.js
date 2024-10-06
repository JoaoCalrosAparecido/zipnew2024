window.onload = function() {
    // Para os elementos com a classe 'product-price'
    var precos00 = document.querySelectorAll('.product-price');
    precos00.forEach(function(p) {
        p.innerHTML = p.innerHTML.replace(/\./g, ',');
    });

    // Para o elemento com o ID 'parte_preço_bolsa_Preta'
    var precos0 = document.getElementById('parte_preço_bolsa_Preta');
    if (precos0) { // Verifica se o elemento existe
        precos0.innerHTML = precos0.innerHTML.replace(/\./g, ',');
    }

    // Para o elemento com o ID 'parte_escrita_subtotal'
    var preco1 = document.getElementById('parte_escrita_subtotal');
    if (preco1) { // Verifica se o elemento existe
        preco1.innerHTML = preco1.innerHTML.replace(/\./g, ',');
    }

    // Para os elementos com a classe 'preco-prod'
    var precos = document.querySelectorAll('.preco-prod');
    precos.forEach(function(p) {
        p.innerHTML = p.innerHTML.replace(/\./g, ',');
    });

    var precos = document.querySelectorAll('.parte_do_total');
    precos.forEach(function(p) {
        p.innerHTML = p.innerHTML.replace(/\./g, ',');
    });
};
