const db = require('../db/database');
const { publicidades } = require('../data/homeContent');

function getCategories() {
    return db.prepare('SELECT name, icon, type FROM categories ORDER BY id ASC').all();
}

function getCategoryByName(name) {
    return db.prepare('SELECT id, name, icon, type FROM categories WHERE LOWER(name) = LOWER(?) LIMIT 1').get(name);
}

function getHomeBanners() {
    return publicidades;
}

module.exports = {
    getCategories,
    getCategoryByName,
    getHomeBanners
};
