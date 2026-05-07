const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

// Crea o abre la base de datos en la carpeta db
const dbPath = path.join(__dirname, 'database.db');
const db = new Database(dbPath);

// Lee el archivo schema.sql y ejecuta sus instrucciones para crear las tablas si no existen
const schemaPath = path.join(__dirname, 'schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf8');

db.exec(schema);

module.exports = db;
