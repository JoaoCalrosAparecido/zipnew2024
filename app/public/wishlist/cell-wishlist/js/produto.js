document.addEventListener('DOMContentLoaded', function () {
    const addToCartButtons = document.querySelectorAll('.add-to-cartfv');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', function () {
            const productName = button.parentNode.querySelector('figcaption .product-name').textContent;
            const price = parseFloat(button.parentNode.querySelector('figcaption .product-price').textContent.replace('R$ ', '').replace(',', '.'));
            const imageName = button.getAttribute('data-image');
            const description = button.getAttribute('data-description') || '';

            addToCartfv(productName, price, imageName, description);

            // Movendo a imagem para o carrinho
            const productImageSrc = button.parentNode.querySelector('img').src;
            moveImageToCart(productImageSrc);
        });
    });

    updateCartfv();
});

function moveImageToCart(imageSrc) {
    const cartImageContainer = document.getElementById('cart-image-containerfv');
    cartImageContainer.innerHTML = ''; // Limpa o conteúdo anterior

    const cartImage = document.createElement('img');
    cartImage.src = imageSrc;
    cartImageContainer.appendChild(cartImage);
}

function updateCartfv() {
    const cartContainer = document.getElementById('cart-itemsfv');
    const totalContainer = document.getElementById('total-pricefv');
    let cartItems = localStorage.getItem('cartItemsfv');
    cartItems = cartItems ? JSON.parse(cartItems) : [];
    let totalPrice = 0;

    cartContainer.innerHTML = '';
    cartItems.forEach((item, index) => {
        const cartItem = document.createElement('article');
        cartItem.classList.add('cart-itemfv');

        const productImage = document.createElement('img');
        productImage.src = `../../IMG/${item.imagefv}`;
        productImage.alt = item.name;
        cartItem.appendChild(productImage);

        const productInfo = document.createElement('article');
        productInfo.innerHTML = `<h3>${item.name}</h3><p>${item.descriptionfv}</p><p>Preço: R$ ${item.price.toFixed(2)}</p>`;
        cartItem.appendChild(productInfo);

        const removeButton = document.createElement('button');
        removeButton.textContent = '';
        removeButton.onclick = function () {
            removeFromCartfv(index);
        };
        cartItem.appendChild(removeButton);

        cartContainer.appendChild(cartItem);
        totalPrice += parseFloat(item.price);
    });

    totalContainer.textContent = totalPrice.toFixed(2);
}

function removeFromCartfv(index) {
    let cartItems = localStorage.getItem('cartItemsfv');
    cartItems = cartItems ? JSON.parse(cartItems) : [];
    cartItems.splice(index, 1);
    localStorage.setItem('cartItemsfv', JSON.stringify(cartItems));
    updateCartfv();
}

function productExistInCart(cartItem) {
    let cartItems = localStorage.getItem('cartItemsfv');
    cartItems = cartItems ? JSON.parse(cartItems) : [];

    return cartItems.some(item => 
        item.name === cartItem.name && 
        item.price === cartItem.price && 
        item.imagefv === cartItem.imagefv && 
        item.descriptionfv === cartItem.descriptionfv
    );
}

function addToCartfv(productName, price, imageName, description) {
    const cartItem = {
        name: productName,
        price: price,
        imagefv: imageName,
        descriptionfv: description
    };

    if (productExistInCart(cartItem)) return;

    let cartItems = localStorage.getItem('cartItemsfv');
    cartItems = cartItems ? JSON.parse(cartItems) : [];
    cartItems.push(cartItem);
    localStorage.setItem('cartItemsfv', JSON.stringify(cartItems));
    updateCartfv();
}
