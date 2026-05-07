const productsService = require('./productsService');

function ensureCart(session) {
    if (!Array.isArray(session.cart)) {
        session.cart = [];
    }

    return session.cart;
}

function buildCartItem(cartLine) {
    // Precio y validación de existencia obtenidos desde SQLite vía productsService
    const product = productsService.getProductById(cartLine.productId);

    if (!product) {
        return null;
    }

    const quantity = Number(cartLine.quantity) || 0;
    // Precio real viene de la DB — nunca de la sesión
    const unitPrice = product.price;

    return {
        productId: String(product.id),
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

    // Valida que el producto existe en SQLite (vía productsService que usa DB)
    const product = productsService.getProductById(productId);

    if (!product) {
        return false;
    }

    const productStock = Number(product.stock);
    const isOutOfStock = Number.isFinite(productStock) && productStock <= 0;

    if (isOutOfStock) {
        return false;
    }

    // Sesión guarda solo { productId (String), quantity } — sin datos sensibles ni precio
    const idStr = String(product.id);
    const existingItem = cart.find((item) => item.productId === idStr);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ productId: idStr, quantity: 1 });
    }

    return true;
}

function updateProductQuantity(session, productId, delta) {
    const cart = ensureCart(session);
    const idStr = String(productId);
    const itemIndex = cart.findIndex((item) => item.productId === idStr);

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
    const idStr = String(productId);
    session.cart = cart.filter((item) => item.productId !== idStr);
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
