const { categories, products } = require('../data/seedData');

function getUsersColumns(db) {
    return db.prepare('PRAGMA table_info(users)').all();
}

function ensureUsersTable(db) {
    const usersColumns = getUsersColumns(db);

    if (usersColumns.length === 0) {
        return;
    }

    const hasPasswordHash = usersColumns.some((column) => column.name === 'password_hash');
    const hasCreatedAt = usersColumns.some((column) => column.name === 'created_at');
    const hasLegacyPassword = usersColumns.some((column) => column.name === 'password');

    if (hasPasswordHash && hasCreatedAt && !hasLegacyPassword) {
        return;
    }

    const migrateUsers = db.transaction(() => {
        db.exec('ALTER TABLE users RENAME TO users_legacy');
        db.exec(`
            CREATE TABLE users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        const legacyColumns = db.prepare('PRAGMA table_info(users_legacy)').all();
        const hasLegacyCreatedAt = legacyColumns.some((column) => column.name === 'created_at');
        const legacyPasswordColumn = legacyColumns.some((column) => column.name === 'password_hash')
            ? 'password_hash'
            : 'password';
        const createdAtSelect = hasLegacyCreatedAt ? 'created_at' : 'CURRENT_TIMESTAMP';

        db.exec(`
            INSERT INTO users (id, name, email, password_hash, created_at)
            SELECT id, name, email, ${legacyPasswordColumn}, ${createdAtSelect}
            FROM users_legacy
        `);
        db.exec('DROP TABLE users_legacy');
    });

    migrateUsers();
}

function ensureProductsTable(db) {
    const columns = db.prepare('PRAGMA table_info(products)').all();
    const hasStock = columns.some((column) => column.name === 'stock');
    const hasStatus = columns.some((column) => column.name === 'status');

    if (!hasStock) {
        db.exec('ALTER TABLE products ADD COLUMN stock INTEGER DEFAULT 20');
    }
    if (!hasStatus) {
        db.exec("ALTER TABLE products ADD COLUMN status TEXT DEFAULT 'Activo'");
    }
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
            'INSERT INTO products (title, description, price, src, category, isTopSeller, stock, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
        );

        const seedProducts = db.transaction(() => {
            for (const product of products) {
                insertProduct.run(
                    product.title,
                    product.description,
                    product.price,
                    product.src,
                    product.category,
                    product.isTopSeller,
                    product.stock !== undefined ? product.stock : 20,
                    product.status !== undefined ? product.status : 'Activo'
                );
            }
        });

        seedProducts();
    }
}

module.exports = {
    ensureSeedData,
    ensureUsersTable,
    ensureProductsTable
};
