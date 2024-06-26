function removeProductFromCartfv(cartItem) {
    let cartItems = localStorage.getItem('cartItemsfv');
    cartItems = cartItems ? JSON.parse(cartItems) : [];

    const newCartItems = cartItems.filter(function(item) {
        return item.name != cartItem.name && item.price != cartItem.price && item.imagefv != cartItem.imagefv != cartItem.descriptionfv;
    })

    
    localStorage.setItem('cartItemsfv', JSON.stringify(newCartItems));
}

function productExistInCart(cartItem) {
    let cartItems = localStorage.getItem('cartItemsfv');
    cartItems = cartItems ? JSON.parse(cartItems) : [];

    // não tem productos no carrinho
    if (cartItems.length === 0) return false;

    // valida se o produto selecionado está no carrinho
    const isProductInCart = cartItems.some(function(item) {
        return item.name == cartItem.name && item.price == cartItem.price && item.imagefv == cartItem.imagefv ==cartItem.descriptionfv;
    })

    return isProductInCart
} 

function addToCartfv(productName, price, imageName, description) {
    const cartItem = {
        name: productName,
        price: price,
        imagefv: imageName,
        descriptionfv: description
    };

    if (productExistInCart(cartItem)) {
        removeProductFromCartfv(cartItem);
        return
    };    
    

    let cartItems = localStorage.getItem('cartItemsfv');
    cartItems = cartItems ? JSON.parse(cartItems) : [];
    cartItems.push(cartItem);
    localStorage.setItem('cartItemsfv', JSON.stringify(cartItems));
}
