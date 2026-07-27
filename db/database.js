const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');
const { ensureSchema, ensureSeedData } = require('./bootstrap');

// Crea o abre la base de datos en la carpeta db
const dbPath = process.env.DATABASE_PATH
    ? path.resolve(process.env.DATABASE_PATH)
    : process.env.VERCEL
        ? path.join('/tmp', 'pediloo-database.db')
        : path.join(__dirname, 'database.db');
const db = new Database(dbPath);

// Lee el archivo schema.sql y ejecuta sus instrucciones para crear las tablas si no existen
const schemaPath = path.join(__dirname, 'schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf8');

db.exec(schema);
ensureSchema(db);
ensureSeedData(db);

module.exports = db;
