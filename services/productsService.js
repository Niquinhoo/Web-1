const db = require('../db/database');

const PRODUCT_IMAGE_FALLBACK = '/assets/productos/proximamente.png';

function withFallbackImage(product) {
    return {
        ...product,
        src: product.src || PRODUCT_IMAGE_FALLBACK,
        isTopSeller: Boolean(product.isTopSeller),
        stock: product.stock !== undefined && product.stock !== null ? Number(product.stock) : 20,
        status: product.status || 'Activo'
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

// ── Operaciones de escritura (API REST) ────────────────────────────────────

function createProduct({ title, price, description = null, src = null, category = null, isTopSeller = 0, stock = null, status = null }) {
    if (!title || price === undefined) {
        throw new Error('Los campos "title" y "price" son obligatorios.');
    }
    const resolvedStock = stock !== null && stock !== undefined ? Number(stock) : 20;
    const resolvedStatus = status || (resolvedStock === 0 ? 'Sin Stock' : (resolvedStock <= 12 ? 'Stock Bajo' : 'Activo'));

    const stmt = db.prepare(
        'INSERT INTO products (title, description, price, src, category, isTopSeller, stock, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    );
    const result = stmt.run(String(title).trim(), description, Number(price), src, category, isTopSeller ? 1 : 0, resolvedStock, resolvedStatus);
    return getProductById(result.lastInsertRowid);
}

function updateProduct(id, body) {
    const existing = getProductById(id);
    if (!existing) return undefined;

    const { title, price, description, src, image, category, isTopSeller, stock, status } = body;

    const newTitle       = title       !== undefined ? String(title).trim()   : existing.title;
    const newPrice       = price       !== undefined ? Number(price)           : existing.price;
    const newDescription = description !== undefined ? description             : existing.description;
    const newSrc         = (src || image) !== undefined ? (src || image)       : existing.src;
    const newCategory    = category    !== undefined ? category                : existing.category;
    const newIsTopSeller = isTopSeller !== undefined ? (isTopSeller ? 1 : 0)  : existing.isTopSeller;
    const newStock       = stock       !== undefined ? Number(stock)           : existing.stock;
    const newStatus      = status      !== undefined ? status                  : 
                           (stock !== undefined ? (newStock === 0 ? 'Sin Stock' : (newStock <= 12 ? 'Stock Bajo' : 'Activo')) : existing.status);

    db.prepare(
        'UPDATE products SET title = ?, price = ?, description = ?, src = ?, category = ?, isTopSeller = ?, stock = ?, status = ? WHERE id = ?'
    ).run(newTitle, newPrice, newDescription, newSrc, newCategory, newIsTopSeller ? 1 : 0, newStock, newStatus, Number(id));

    return getProductById(id);
}

function deleteProduct(id) {
    const existing = getProductById(id);
    if (!existing) return false;
    db.prepare('DELETE FROM products WHERE id = ?').run(Number(id));
    return true;
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
    searchProductsByName,
    createProduct,
    updateProduct,
    deleteProduct,
};
