const { productos } = require('../data/db');

function getAllProducts() {
    return productos;
}

function getProductById(productId) {
    return productos.find((product) => product.id === String(productId));
}

function getRelatedProducts(product) {
    return productos.filter((item) => item.category === product.category && item.id !== product.id);
}

function getRandomProducts(limit = 4) {
    return [...productos]
        .sort(() => 0.5 - Math.random())
        .slice(0, limit);
}

module.exports = {
    getAllProducts,
    getProductById,
    getRelatedProducts,
    getRandomProducts
};
