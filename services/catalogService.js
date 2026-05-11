const db = require('../db/database');
const { publicidades } = require('../data/homeContent');

function getCategories() {
    return db.prepare('SELECT name, icon, type FROM categories ORDER BY id ASC').all();
}

function getHomeBanners() {
    return publicidades;
}

module.exports = {
    getCategories,
    getHomeBanners
};
