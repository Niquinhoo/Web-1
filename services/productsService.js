const db = require('../db/database');

const PRODUCT_IMAGE_FALLBACK = '/assets/productos/proximamente.png';

function withFallbackImage(product) {
    return {
        ...product,
        src: product.src || PRODUCT_IMAGE_FALLBACK,
        isTopSeller: Boolean(product.isTopSeller)
    };
}

function getAllProducts() {
    return db.prepare('SELECT * FROM products').all().map(withFallbackImage);
}

function getSuggestedProducts(limit = 5) {
    return db.prepare('SELECT * FROM products LIMIT ?').all(limit).map(withFallbackImage);
}

function getTopOrderedProducts(limit = 10) {
    // Top sellers primero, luego el resto aleatorio
    const topSellers = db.prepare('SELECT * FROM products WHERE isTopSeller = 1').all().map(withFallbackImage);
    const rest = db.prepare('SELECT * FROM products WHERE isTopSeller = 0 ORDER BY RANDOM()').all().map(withFallbackImage);
    return [...topSellers, ...rest].slice(0, limit);
}

function getProductById(productId) {
    const id = Number(productId);
    if (!Number.isInteger(id) || id <= 0) return undefined;
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    return product ? withFallbackImage(product) : undefined;
}

function getRelatedProducts(product) {
    if (!product || !product.category) return [];
    return db
        .prepare('SELECT * FROM products WHERE category = ? AND id != ? ORDER BY RANDOM() LIMIT 4')
        .all(product.category, product.id)
        .map(withFallbackImage);
}

function getRandomProducts(limit = 4) {
    return db.prepare('SELECT * FROM products ORDER BY RANDOM() LIMIT ?').all(limit).map(withFallbackImage);
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
    if (!normalizedCategory) return [];

    // SQLite no tiene normalize, filtramos en JS igual que antes
    return db.prepare('SELECT * FROM products').all()
        .filter((item) => normalizeCategoryValue(item.category) === normalizedCategory)
        .map(withFallbackImage);
}

function normalizeId(rawId) {
    const value = String(rawId || '').trim();
    if (!/^\d+$/.test(value)) {
        return {
            ok: false,
            statusCode: 400
        };
    }

    const normalized = Number(value);
    if (!Number.isInteger(normalized) || normalized <= 0) {
        return {
            ok: false,
            statusCode: 400
        };
    }

    const product = getProductById(normalized);
    if (!product) {
        return {
            ok: false,
            statusCode: 404
        };
    }

    return {
        ok: true,
        id: String(normalized),
        product
    };
}

function getProductsSortedByPrice(sort) {
    const normalizedSort = String(sort || '').toLowerCase();
    if (normalizedSort === 'asc') {
        return db.prepare('SELECT * FROM products ORDER BY price ASC').all().map(withFallbackImage);
    }
    if (normalizedSort === 'desc') {
        return db.prepare('SELECT * FROM products ORDER BY price DESC').all().map(withFallbackImage);
    }
    return getAllProducts();
}

function searchProductsByName(query) {
    const normalizedQuery = String(query || '').trim();
    if (!normalizedQuery) return [];
    return db
        .prepare("SELECT * FROM products WHERE LOWER(title) LIKE '%' || LOWER(?) || '%'")
        .all(normalizedQuery)
        .map(withFallbackImage);
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
