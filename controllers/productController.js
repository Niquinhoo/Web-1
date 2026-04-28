const productsService = require('../services/productsService');

function getAllProducts() {
    return productsService.getAllProducts();
}

function getSuggestedProducts(limit = 5) {
    return productsService.getSuggestedProducts(limit);
}

function getTopOrderedProducts(limit = 10) {
    return productsService.getTopOrderedProducts(limit);
}

function getProductById(productId) {
    return productsService.getProductById(productId);
}

function getRelatedProducts(product) {
    return productsService.getRelatedProducts(product);
}

function getRandomProducts(limit = 4) {
    return productsService.getRandomProducts(limit);
}

function getProductsByCategory(category) {
    return productsService.getProductsByCategory(category);
}

function normalizeId(rawId) {
    return productsService.normalizeId(rawId);
}

function getProductsSortedByPrice(sort) {
    return productsService.getProductsSortedByPrice(sort);
}

function searchProductsByName(query) {
    return productsService.searchProductsByName(query);
}

module.exports = {
    getAllProducts,
    getSuggestedProducts,
    getTopOrderedProducts,
    getProductById,
    getRelatedProducts,
    getRandomProducts,
    getProductsByCategory,
    normalizeId,
    getProductsSortedByPrice,
    searchProductsByName
};
