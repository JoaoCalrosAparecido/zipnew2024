function addToCartfv(productName, price) {
    const cartItem = {
        name: productName,
        price: price
    };
    let cartItems = localStorage.getItem('cartItemsfv');
    cartItems = cartItems ? JSON.parse(cartItems) : [];
    cartItems.push(cartItem);
    localStorage.setItem('cartItemsfv', JSON.stringify(cartItems));
}
