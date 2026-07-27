const { categories, products } = require('../data/seedData');
const crypto = require('node:crypto');

function getColumns(db, table) {
    return db.prepare(`PRAGMA table_info(${table})`).all().map((column) => column.name);
}

function addColumn(db, table, definition) {
    const name = definition.split(/\s+/)[0];
    if (!getColumns(db, table).includes(name)) {
        db.exec(`ALTER TABLE ${table} ADD COLUMN ${definition}`);
    }
}

function ensureUsersTable(db) {
    const usersColumns = getColumns(db, 'users');
    const hasLegacyPassword = usersColumns.includes('password');

    if (hasLegacyPassword && !usersColumns.includes('password_hash')) {
        db.exec('ALTER TABLE users RENAME TO users_legacy');
        db.exec(`
            CREATE TABLE users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                first_name TEXT,
                last_name TEXT,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                admin_flag INTEGER NOT NULL DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);
        db.exec(`
            INSERT INTO users (id, name, email, password_hash)
            SELECT id, name, email, password
            FROM users_legacy
        `);
        db.exec('DROP TABLE users_legacy');
    }

    addColumn(db, 'users', 'first_name TEXT');
    addColumn(db, 'users', 'last_name TEXT');
    addColumn(db, 'users', 'admin_flag INTEGER NOT NULL DEFAULT 0');
    addColumn(db, 'users', 'created_at DATETIME');

    db.exec(`
        UPDATE users
        SET first_name = COALESCE(first_name, CASE WHEN INSTR(name, ' ') > 0 THEN SUBSTR(name, 1, INSTR(name, ' ') - 1) ELSE name END),
            last_name = COALESCE(last_name, CASE WHEN INSTR(name, ' ') > 0 THEN SUBSTR(name, INSTR(name, ' ') + 1) ELSE '' END),
            created_at = COALESCE(created_at, CURRENT_TIMESTAMP)
    `);
}

function ensureSchema(db) {
    addColumn(db, 'products', 'stock INTEGER NOT NULL DEFAULT 20');
    ensureUsersTable(db);
    addColumn(db, 'orders', "status TEXT NOT NULL DEFAULT 'Recibido'");
    addColumn(db, 'orders', 'subtotal REAL NOT NULL DEFAULT 0');
    addColumn(db, 'orders', 'discount_code TEXT');
    addColumn(db, 'orders', 'discount_percent REAL NOT NULL DEFAULT 0');
    addColumn(db, 'orders', 'discount_amount REAL NOT NULL DEFAULT 0');
}

function hashPassword(password) {
    const salt = crypto.randomBytes(16).toString('hex');
    return `scrypt:${salt}:${crypto.scryptSync(password, salt, 64).toString('hex')}`;
}

function ensureSeedData(db) {
    const categoriesCount = db.prepare('SELECT COUNT(*) AS count FROM categories').get().count;
    if (categoriesCount === 0) {
        const insertCategory = db.prepare(
            'INSERT INTO categories (name, icon, type) VALUES (?, ?, ?)'
        );

        const seedCategories = db.transaction(() => {
            for (const category of categories) {
                insertCategory.run(category.name, category.icon, category.type);
            }
        });

        seedCategories();
    }

    const productsCount = db.prepare('SELECT COUNT(*) AS count FROM products').get().count;
    if (productsCount === 0) {
        const insertProduct = db.prepare(
            'INSERT INTO products (title, description, price, src, category, isTopSeller, stock) VALUES (?, ?, ?, ?, ?, ?, ?)'
        );

        const seedProducts = db.transaction(() => {
            for (const product of products) {
                insertProduct.run(
                    product.title,
                    product.description,
                    product.price,
                    product.src,
                    product.category,
                    product.isTopSeller ? 1 : 0,
                    product.stock ?? 20
                );
            }
        });

        seedProducts();
    }

    const adminEmail = 'admin@pediloo.local';
    if (!db.prepare('SELECT id FROM users WHERE LOWER(email) = LOWER(?)').get(adminEmail)) {
        db.prepare(`
            INSERT INTO users (name, first_name, last_name, email, password_hash, admin_flag)
            VALUES (?, ?, ?, ?, ?, 1)
        `).run('Administrador Pediloo', 'Administrador', 'Pediloo', adminEmail, hashPassword('Admin123!'));
    }

    if (db.pragma('user_version', { simple: true }) < 1) {
        const migrateCatalog = db.transaction(() => {
            const insertCategory = db.prepare(`
                INSERT INTO categories (name, icon, type)
                SELECT ?, ?, ?
                WHERE NOT EXISTS (SELECT 1 FROM categories WHERE LOWER(name) = LOWER(?))
            `);
            const insertProduct = db.prepare(`
                INSERT INTO products (title, description, price, src, category, isTopSeller, stock)
                SELECT ?, ?, ?, ?, ?, ?, ?
                WHERE NOT EXISTS (SELECT 1 FROM products WHERE LOWER(title) = LOWER(?))
            `);

            for (const category of categories) {
                insertCategory.run(category.name, category.icon, category.type, category.name);
            }
            for (const product of products) {
                insertProduct.run(
                    product.title,
                    product.description,
                    product.price,
                    product.src,
                    product.category,
                    product.isTopSeller ? 1 : 0,
                    product.stock ?? 20,
                    product.title
                );
            }
            db.pragma('user_version = 1');
        });
        migrateCatalog();
    }
}

module.exports = {
    ensureSchema,
    ensureSeedData,
    ensureUsersTable
};
