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

function ensureOrdersForeignKeys(db) {
    const userForeignKey = db.prepare('PRAGMA foreign_key_list(orders)').all()
        .find((foreignKey) => foreignKey.from === 'user_id');

    if (!userForeignKey || userForeignKey.table === 'users') return;

    const foreignKeysEnabled = db.pragma('foreign_keys', { simple: true });
    db.pragma('foreign_keys = OFF');

    try {
        db.transaction(() => {
            db.exec(`
                ALTER TABLE order_items RENAME TO order_items_legacy_fk;
                ALTER TABLE orders RENAME TO orders_legacy_fk;

                CREATE TABLE orders (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER,
                    status TEXT NOT NULL DEFAULT 'Recibido',
                    subtotal REAL NOT NULL DEFAULT 0,
                    discount_code TEXT,
                    discount_percent REAL NOT NULL DEFAULT 0,
                    discount_amount REAL NOT NULL DEFAULT 0,
                    total REAL NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY(user_id) REFERENCES users(id)
                );

                INSERT INTO orders (
                    id, user_id, status, subtotal, discount_code,
                    discount_percent, discount_amount, total, created_at
                )
                SELECT
                    id,
                    CASE WHEN user_id IS NULL OR EXISTS (
                        SELECT 1 FROM users WHERE users.id = orders_legacy_fk.user_id
                    ) THEN user_id ELSE NULL END,
                    status, subtotal, discount_code,
                    discount_percent, discount_amount, total, created_at
                FROM orders_legacy_fk;

                CREATE TABLE order_items (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    order_id INTEGER,
                    product_id INTEGER,
                    quantity INTEGER NOT NULL,
                    price REAL NOT NULL,
                    FOREIGN KEY(order_id) REFERENCES orders(id),
                    FOREIGN KEY(product_id) REFERENCES products(id)
                );

                INSERT INTO order_items (id, order_id, product_id, quantity, price)
                SELECT id, order_id, product_id, quantity, price
                FROM order_items_legacy_fk;

                DROP TABLE order_items_legacy_fk;
                DROP TABLE orders_legacy_fk;
            `);
        })();
    } finally {
        if (foreignKeysEnabled) db.pragma('foreign_keys = ON');
    }
}

function ensureSchema(db) {
    addColumn(db, 'products', 'stock INTEGER NOT NULL DEFAULT 20');
    ensureUsersTable(db);
    addColumn(db, 'orders', "status TEXT NOT NULL DEFAULT 'Recibido'");
    addColumn(db, 'orders', 'subtotal REAL NOT NULL DEFAULT 0');
    addColumn(db, 'orders', 'discount_code TEXT');
    addColumn(db, 'orders', 'discount_percent REAL NOT NULL DEFAULT 0');
    addColumn(db, 'orders', 'discount_amount REAL NOT NULL DEFAULT 0');
    ensureOrdersForeignKeys(db);
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
    ensureUsersTable,
    ensureOrdersForeignKeys
};
