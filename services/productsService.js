const { productos } = require('../models/productModel');

const PRODUCT_IMAGE_FALLBACK = '/assets/productos/proximamente.png';

function withFallbackImage(product) {
    return {
        ...product,
        src: product.src || PRODUCT_IMAGE_FALLBACK
    };
}

function getAllProducts() {
    return productos.map(withFallbackImage);
}

function getSuggestedProducts(limit = 5) {
    return getAllProducts().slice(0, limit);
}

function getTopOrderedProducts(limit = 10) {
    const allProducts = getAllProducts();
    const flaggedProducts = allProducts.filter((product) => product.isTopSeller);
    const remainingProducts = allProducts
        .filter((product) => !product.isTopSeller)
        .sort(() => 0.5 - Math.random());

    return [...flaggedProducts, ...remainingProducts].slice(0, limit);
}

function getProductById(productId) {
    const product = productos.find((item) => item.id === String(productId));

    return product ? withFallbackImage(product) : undefined;
}

function getRelatedProducts(product) {
    if (!product || !product.category) {
        return [];
    }

    return productos
        .filter((item) => item.category === product.category && item.id !== product.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 4)
        .map(withFallbackImage);
}

function getRandomProducts(limit = 4) {
    return [...getAllProducts()]
        .sort(() => 0.5 - Math.random())
        .slice(0, limit);
}

function normalizeCategoryValue(category) {
    return String(category || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();
}

function getProductsByCategory(category) {
    const normalizedCategory = normalizeCategoryValue(category);

    if (!normalizedCategory) {
        return [];
    }

    return productos
        .filter((item) => normalizeCategoryValue(item.category) === normalizedCategory)
        .map(withFallbackImage);
}

function normalizeId(rawId) {
    const value = String(rawId || '').trim();

    if (!/^\d+$/.test(value)) {
        return null;
    }

    const normalized = Number(value);

    if (!Number.isInteger(normalized) || normalized <= 0) {
        return null;
    }

    return String(normalized);
}

function getProductsSortedByPrice(sort) {
    const normalizedSort = String(sort || '').toLowerCase();
    const allProducts = getAllProducts();

    if (normalizedSort === 'asc') {
        return [...allProducts].sort((a, b) => a.price - b.price);
    }

    if (normalizedSort === 'desc') {
        return [...allProducts].sort((a, b) => b.price - a.price);
    }

    return allProducts;
}

function searchProductsByName(query) {
    const normalizedQuery = String(query || '').trim().toLowerCase();

    if (!normalizedQuery) {
        return [];
    }

    return getAllProducts().filter((product) =>
        String(product.title || '').toLowerCase().includes(normalizedQuery)
    );
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
