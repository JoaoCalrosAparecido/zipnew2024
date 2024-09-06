function addToCart(productName, price, img) {
    const cartItem = {
        name: productName,
        price: price,
        img: img
    };
    let cartItems = localStorage.getItem('cartItems');
    cartItems = cartItems ? JSON.parse(cartItems) : [];
    cartItems.push(cartItem);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
}
