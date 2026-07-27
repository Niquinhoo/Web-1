const db = require('./db/database');
const { ensureSchema, ensureSeedData } = require('./db/bootstrap');

ensureSchema(db);
ensureSeedData(db);

const categoriesCount = db.prepare('SELECT COUNT(*) AS count FROM categories').get().count;
const productsCount = db.prepare('SELECT COUNT(*) AS count FROM products').get().count;
const usersColumns = db.prepare('PRAGMA table_info(users)').all().map((column) => column.name);

console.log(`Categorias disponibles: ${categoriesCount}`);
console.log(`Productos disponibles: ${productsCount}`);
console.log(`Columnas users: ${usersColumns.join(', ')}`);
console.log('Migracion completada.');
