const productsService = require('./productsService');

function ensureCart(session) {
    if (!Array.isArray(session.cart)) {
        session.cart = [];
    }

    return session.cart;
}

function buildCartItem(cartLine) {
    const product = productsService.getProductById(cartLine.productId);

    if (!product) {
        return null;
    }

    const quantity = Number(cartLine.quantity) || 0;
    const unitPrice = product.price;

    return {
        productId: product.id,
        title: product.title,
        description: product.description,
        category: product.category,
        src: product.src,
        quantity,
        unitPrice,
        subtotal: unitPrice * quantity
    };
}

function getCartDetailFromSession(sessionCart) {
    const items = sessionCart
        .map(buildCartItem)
        .filter(Boolean);

    const subtotal = items.reduce((acc, item) => acc + item.subtotal, 0);
    const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

    return {
        items,
        summary: {
            subtotal,
            total: subtotal,
            totalItems
        }
    };
}

function getCartDetail() {
    return getCartDetailFromSession([]);
}

function addProductToCart(session, productId) {
    const cart = ensureCart(session);
    const product = productsService.getProductById(productId);

    if (!product) {
        return false;
    }

    const productStock = Number(product.stock);
    const isOutOfStock = Number.isFinite(productStock) && productStock <= 0;

    if (isOutOfStock) {
        return false;
    }

    const existingItem = cart.find((item) => item.productId === String(productId));

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ productId: String(productId), quantity: 1 });
    }

    return true;
}

function updateProductQuantity(session, productId, delta) {
    const cart = ensureCart(session);
    const itemIndex = cart.findIndex((item) => item.productId === String(productId));

    if (itemIndex === -1) {
        return false;
    }

    cart[itemIndex].quantity += delta;

    if (cart[itemIndex].quantity <= 0) {
        cart.splice(itemIndex, 1);
    }

    return true;
}

function removeProductFromCart(session, productId) {
    const cart = ensureCart(session);
    session.cart = cart.filter((item) => item.productId !== String(productId));
}

function clearCart(session) {
    session.cart = [];
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
