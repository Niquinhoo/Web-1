import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import TimelineItem from '../components/TimelineItem';

export default function STP3Detail() {
  return (
    <div className="min-h-screen bg-background text-textMain p-8 md:p-16 relative overflow-x-hidden">
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-accent/5 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] rounded-full bg-green-500/5 blur-[120px]"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <Link to="/" className="inline-flex items-center text-accent hover:text-accent/80 mb-8 transition-colors">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Volver a la Presentación
        </Link>
        
        <header className="mb-16">
          <span className="text-accent font-mono text-xl mb-2 block">Fase 3</span>
          <h1 className="text-5xl font-bold mb-4">STP3: SQLite y Persistencia</h1>
          <p className="text-xl text-textMuted">
            Abandono de Mocks locales e integración de better-sqlite3. El foco no es solo hacer queries, sino proveer arranque idempotente, migraciones automáticas y seguridad semántica.
          </p>
        </header>

        <div className="space-y-4">
          <TimelineItem 
            date="Paso 1"
            title="Base de Datos y Arranque Inicial"
            description="database.js establece la conexión y ejecuta un esquema SQL con relaciones (Categorías, Productos, Usuarios, Órdenes). Además, se encarga de llamar a los procesos de validación."
            code={`// db/database.js
const Database = require('better-sqlite3');
const fs = require('fs');

const db = new Database('./db/database.db');
const schema = fs.readFileSync('./db/schema.sql', 'utf-8');
db.exec(schema);

// Garantiza integridad y datos inciales si está vacía
bootstrap.ensureUsersTableCompat(db);
bootstrap.ensureSeedData(db);`}
          />

          <TimelineItem 
            date="Paso 2"
            title="Migración Automática (Bootstrap)"
            description="Este es el punto más fuerte de la arquitectura de DB: Si el esquema de usuarios quedó desactualizado, el sistema lo detecta, lo migra y adapta los datos legacy automáticamente."
            code={`// db/bootstrap.js (Fragmento de Migración)
const columns = db.prepare("PRAGMA table_info(users)").all();
const hasPasswordHash = columns.some(c => c.name === 'password_hash');

if (!hasPasswordHash) {
  const tx = db.transaction(() => {
    db.exec("ALTER TABLE users RENAME TO users_legacy");
    db.exec(\`CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )\`);
    db.exec(\`INSERT INTO users (id, email, password_hash) 
             SELECT id, email, password FROM users_legacy\`);
    db.exec("DROP TABLE users_legacy");
  });
  tx();
}`}
          />

          <TimelineItem 
            date="Paso 3"
            title="Lógica de Búsqueda y Filtros en SQL"
            description="El productsService.js abandona métodos de Array y ejecuta queries de SQL en base a lo requerido (Sort, Search). Aprovechando LOWER(..) y LIKE para consultas elásticas."
            code={`// services/productsService.js
const searchProducts = (queryStr) => {
  const sql = \`
    SELECT * FROM products 
    WHERE LOWER(name) LIKE ? OR LOWER(description) LIKE ?
  \`;
  const param = \`%\${queryStr.toLowerCase()}%\`;
  const products = db.prepare(sql).all(param, param);
  
  return products.map(mapProduct); // Normaliza booleanos e imágenes
};`}
          />

          <TimelineItem 
            date="Paso 4"
            title="El Carrito Robusto: Sesión + SQLite"
            description="El Carrito sigue en sesión para ser anónimo y rápido, pero NUNCA confía en precios en memoria. En cada renderizado cruza el ID del carrito con la base de datos real."
            code={`// services/cartService.js (Interacción con DB)
const getCartDetails = (sessionCart) => {
  const stmt = db.prepare('SELECT * FROM products WHERE id = ?');
  
  const cartItems = sessionCart.map(cartItem => {
    // La fuente de la VERDAD absoluta es SQLite
    const product = stmt.get(cartItem.productId);
    
    if (!product) return null; // Resiliente si el producto fue borrado

    return {
      product: mapProduct(product),
      quantity: cartItem.quantity,
      subtotal: product.price * cartItem.quantity
    };
  }).filter(Boolean);

  // Calcula total confiable
};`}
            isLast={true}
          />
        </div>
      </div>
    </div>
  );
}
