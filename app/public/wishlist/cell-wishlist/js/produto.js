function updateCartfv() {
    // Recupera os itens do carrinho do localStorage
    let cartItems = localStorage.getItem('cartItemsfv');
    cartItems = cartItems ? JSON.parse(cartItems) : [];

    // Obtém o container onde os itens serão exibidos
    const cartContainer = document.getElementById('cart-itemsfv');
    cartContainer.innerHTML = ''; // Limpa o conteúdo atual

    // Itera sobre cada item do carrinho
    cartItems.forEach((item, index) => {
        const cartItem = document.createElement('article');
        cartItem.classList.add('cart-itemfv');

        // Cria e adiciona a imagem do produto
        const productImage = document.createElement('img');
        productImage.src = `../../IMG/${item.imagefv}`;
        productImage.alt = item.name;
        cartItem.appendChild(productImage);

        // Cria e adiciona as informações do produto
        const productInfo = document.createElement('div'); // Alterei para 'div' para ser mais semântico
        productInfo.innerHTML = `
            <h3>${item.name}</h3>
            <p>${item.descriptionfv || ''}</p>
            <p>Preço: R$ ${parseFloat(item.price).toFixed(2)}</p>
        `;
        cartItem.appendChild(productInfo);

        // Cria o formulário para remoção
        const removeForm = document.createElement('form');
        removeForm.method = 'DELETE'; // O método será POST para simular DELETE
        removeForm.action = 'removeFav'; // Ação para onde o formulário deve ser enviado
        removeForm.onsubmit = function(event) {
            event.preventDefault(); // Previne o envio padrão do formulário
            removeFromCartfv(index); // Chama a função para remover o item
        };

        // Cria e adiciona o botão de remoção
        const removeButton = document.createElement('button');
        removeButton.type = 'submit'
        removeButton.textContent = 'Remover'; // Texto do botão
        removeForm.appendChild(removeButton); // Adiciona o botão ao formulário

        // Adiciona o formulário ao item do carrinho
        cartItem.appendChild(removeForm);

        // Adiciona o item do carrinho ao container
        cartContainer.appendChild(cartItem);
    });
}

// Função para remover um item do carrinho
function removeFromCartfv(index) {
    let cartItems = localStorage.getItem('cartItemsfv');
    cartItems = cartItems ? JSON.parse(cartItems) : [];
    cartItems.splice(index, 1); // Remove o item pelo índice
    localStorage.setItem('cartItemsfv', JSON.stringify(cartItems)); // Atualiza o localStorage
    updateCartfv(); // Atualiza a exibição do carrinho
}

// Atualiza o carrinho quando a página carrega
window.addEventListener("load", function() {
    updateCartfv();
});





/* codigo antigo

function updateCartfv() {
    // Recupera os itens do carrinho do localStorage
    let cartItems = localStorage.getItem('cartItemsfv');
    cartItems = cartItems ? JSON.parse(cartItems) : [];

    // Obtém o container onde os itens serão exibidos
    const cartContainer = document.getElementById('cart-itemsfv');
    cartContainer.innerHTML = ''; // Limpa o conteúdo atual

    // Itera sobre cada item do carrinho
    cartItems.forEach((item, index) => {
        const cartItem = document.createElement('article');
        cartItem.classList.add('cart-itemfv');

        // Cria e adiciona a imagem do produto
        const productImage = document.createElement('img');
        productImage.src = `../../IMG/${item.imagefv}`;
        productImage.alt = item.name;
        cartItem.appendChild(productImage);

        // Cria e adiciona as informações do produto
        const productInfo = document.createElement('div'); // Alterei para 'div' para ser mais semântico
        productInfo.innerHTML = `
            <h3>${item.name}</h3>
            <p>${item.descriptionfv || ''}</p>
            <p>Preço: R$ ${parseFloat(item.price).toFixed(2)}</p>
        `;
        cartItem.appendChild(productInfo);

        // Cria e adiciona o botão de remoção
        const removeButton = document.createElement('button');
        removeButton.textContent = ''; // Adicionei um texto ao botão
        removeButton.onclick = function () {
            removeFromCartfv(index); // Chama a função para remover o item
        };
        cartItem.appendChild(removeButton);

        // Adiciona o item do carrinho ao container
        cartContainer.appendChild(cartItem);
    });
}


// Função para remover um item do carrinho
function removeFromCartfv(index) {
    let cartItems = localStorage.getItem('cartItemsfv');
    cartItems = cartItems ? JSON.parse(cartItems) : [];
    cartItems.splice(index, 1); // Remove o item pelo índice
    localStorage.setItem('cartItemsfv', JSON.stringify(cartItems)); // Atualiza o localStorage
    updateCartfv(); // Atualiza a exibição do carrinho
}

// Atualiza o carrinho quando a página carrega
window.addEventListener("load", function() {
    updateCartfv();
});*/
