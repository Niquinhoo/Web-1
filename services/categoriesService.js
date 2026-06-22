const db = require('../db/database');

// ── Lectura ────────────────────────────────────────────────────────────────

function getAllCategories() {
    return db.prepare('SELECT * FROM categories ORDER BY id ASC').all();
}

function getCategoryById(id) {
    const numId = Number(id);
    if (!Number.isInteger(numId) || numId <= 0) return undefined;
    return db.prepare('SELECT * FROM categories WHERE id = ?').get(numId) || undefined;
}

// ── Creación ───────────────────────────────────────────────────────────────

function createCategory({ name, icon = null, type = null }) {
    if (!name || String(name).trim() === '') {
        throw new Error('El campo "name" es obligatorio.');
    }
    const stmt = db.prepare('INSERT INTO categories (name, icon, type) VALUES (?, ?, ?)');
    const result = stmt.run(String(name).trim(), icon, type);
    return getCategoryById(result.lastInsertRowid);
}

// ── Actualización ──────────────────────────────────────────────────────────

function updateCategory(id, { name, icon, type }) {
    const existing = getCategoryById(id);
    if (!existing) return undefined;

    const newName = name !== undefined ? String(name).trim() : existing.name;
    const newIcon = icon !== undefined ? icon : existing.icon;
    const newType = type !== undefined ? type : existing.type;

    db.prepare('UPDATE categories SET name = ?, icon = ?, type = ? WHERE id = ?')
        .run(newName, newIcon, newType, Number(id));

    return getCategoryById(id);
}

// ── Eliminación ────────────────────────────────────────────────────────────

function deleteCategory(id) {
    const existing = getCategoryById(id);
    if (!existing) return false;
    db.prepare('DELETE FROM categories WHERE id = ?').run(Number(id));
    return true;
}

module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
};
