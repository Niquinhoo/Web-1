const cartService = require('../services/cartService');

function ensureCart(session) {
    return cartService.ensureCart(session);
}

function getCartDetail() {
    return cartService.getCartDetail();
}

function getCartDetailFromSession(sessionCart) {
    return cartService.getCartDetailFromSession(sessionCart);
}

function addProductToCart(session, productId) {
    return cartService.addProductToCart(session, productId);
}

function updateProductQuantity(session, productId, delta) {
    return cartService.updateProductQuantity(session, productId, delta);
}

function removeProductFromCart(session, productId) {
    return cartService.removeProductFromCart(session, productId);
}

function clearCart(session) {
    return cartService.clearCart(session);
}

module.exports = {
    ensureCart,
    getCartDetail,
    getCartDetailFromSession,
    addProductToCart,
    updateProductQuantity,
    removeProductFromCart,
    clearCart
};
