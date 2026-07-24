const db = require('../db/database');
const { publicidades } = require('../data/homeContent');

function getCategories() {
    return db.prepare('SELECT id, name, icon, type FROM categories ORDER BY id ASC').all();
}

function getCategoryByName(name) {
    return db.prepare('SELECT id, name, icon, type FROM categories WHERE LOWER(name) = LOWER(?) LIMIT 1').get(name);
}

function getCategoryById(categoryId) {
    const id = Number(categoryId);
    if (!Number.isInteger(id) || id <= 0) return undefined;

    return db.prepare('SELECT id, name, icon, type FROM categories WHERE id = ?').get(id);
}

function normalizeCategoryId(rawId) {
    const value = String(rawId || '').trim();
    if (!/^\d+$/.test(value)) return { ok: false, statusCode: 400 };

    const category = getCategoryById(Number(value));
    if (!category) return { ok: false, statusCode: 404 };

    return { ok: true, id: category.id, category };
}

function createCategory(categoryData) {
    const result = db.prepare(
        'INSERT INTO categories (name, icon, type) VALUES (?, ?, ?)'
    ).run(categoryData.name, categoryData.icon, categoryData.type);

    return getCategoryById(result.lastInsertRowid);
}

function updateCategory(categoryId, categoryData) {
    const current = getCategoryById(categoryId);
    if (!current) return undefined;

    const update = db.transaction(() => {
        db.prepare(
            'UPDATE categories SET name = ?, icon = ?, type = ? WHERE id = ?'
        ).run(categoryData.name, categoryData.icon, categoryData.type, categoryId);

        if (current.name !== categoryData.name) {
            db.prepare('UPDATE products SET category = ? WHERE category = ?')
                .run(categoryData.name, current.name);
        }
    });

    update();
    return getCategoryById(categoryId);
}

function deleteCategory(categoryId) {
    const category = getCategoryById(categoryId);
    if (!category) return { ok: false, reason: 'not-found' };

    const usage = db.prepare('SELECT COUNT(*) AS total FROM products WHERE category = ?')
        .get(category.name).total;
    if (usage > 0) return { ok: false, reason: 'in-use' };

    db.prepare('DELETE FROM categories WHERE id = ?').run(categoryId);
    return { ok: true };
}

function countCategories() {
    return db.prepare('SELECT COUNT(*) AS total FROM categories').get().total;
}

function getHomeBanners() {
    return publicidades;
}

module.exports = {
    getCategories,
    getCategoryByName,
    getCategoryById,
    normalizeCategoryId,
    createCategory,
    updateCategory,
    deleteCategory,
    countCategories,
    getHomeBanners
};
