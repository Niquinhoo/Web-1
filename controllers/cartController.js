const { carrito } = require('../models/productModel');
const { getProductById } = require('./productController');

function buildCartItem(cartLine) {
    const product = getProductById(cartLine.productId);

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

function getCartDetail() {
    const items = carrito
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

module.exports = {
    getCartDetail
};
