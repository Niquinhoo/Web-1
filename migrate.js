// migrate.js
// Ejecutar una sola vez: node migrate.js
// Migra products.json y categories.json a la base de datos SQLite.

const db = require('./db/database');
const products = require('./data/products.json');
const categories = require('./data/categories.json');

// --- Migrar categorías ---
const existingCategories = db.prepare('SELECT COUNT(*) as count FROM categories').get();

if (existingCategories.count === 0) {
    const insertCategory = db.prepare(
        'INSERT OR IGNORE INTO categories (name, icon, type) VALUES (?, ?, ?)'
    );

    const migrateCategories = db.transaction(() => {
        for (const cat of categories) {
            insertCategory.run(cat.name, cat.icon, cat.type);
        }
    });

    migrateCategories();
    console.log(`✅ ${categories.length} categorías migradas.`);
} else {
    console.log(`⏭️  Categorías ya migradas (${existingCategories.count} filas). Saltando.`);
}

// --- Migrar productos ---
const existingProducts = db.prepare('SELECT COUNT(*) as count FROM products').get();

if (existingProducts.count === 0) {
    const insertProduct = db.prepare(
        'INSERT OR IGNORE INTO products (title, description, price, src, category, isTopSeller) VALUES (?, ?, ?, ?, ?, ?)'
    );

    const migrateProducts = db.transaction(() => {
        for (const p of products) {
            insertProduct.run(p.title, p.description, p.price, p.src, p.category, p.isTopSeller);
        }
    });

    migrateProducts();
    console.log(`✅ ${products.length} productos migrados.`);
} else {
    console.log(`⏭️  Productos ya migrados (${existingProducts.count} filas). Saltando.`);
}

console.log('Migración completada.');
