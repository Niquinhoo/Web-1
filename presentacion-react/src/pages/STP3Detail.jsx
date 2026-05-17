import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import TimelineItem from '../components/TimelineItem';
import TheoryBlock from '../components/TheoryBlock';
import ContrastBlock from '../components/ContrastBlock';

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
            Migración de mock data a better-sqlite3 con schema.sql, bootstrap idempotente, transacciones ACID, bound parameters y 7 User Stories — contrastado con la teoría de Datos y Arquitectura por Capas.
          </p>
        </header>

        {/* ── 01 ── */}
        <Section num="01" title="¿Por qué SQLite? — De JSON a DB real">
          <TheoryBlock title="La transición según la cátedra">
            <p>«Los archivos JSON no están diseñados para manejar múltiples operaciones, no garantizan integridad, no permiten consultas eficientes. SQLite es un motor de base de datos relacional embebido que guarda toda la información en un único archivo <code>.db</code>. No es un "JSON mejorado": implementa la mayor parte del estándar SQL y cumple con las garantías ACID.»</p>
            <p className="mt-2">«better-sqlite3 es una biblioteca síncrona, directa, estable y que no introduce promesas ni callbacks.»</p>
          </TheoryBlock>
          <ContrastBlock
            theory="«SQLite representa el punto exacto entre la simplicidad y la seriedad técnica: no requiere instalación, no necesita puertos ni servicios corriendo.» — Doc. Datos"
            practice="Nuestro proyecto usa better-sqlite3 con un archivo db/database.db. Cero configuración de servidor de DB. npm install better-sqlite3 y listo."
          />
        </Section>

        {/* ── 02 ── */}
        <Section num="02" title="database.js + schema.sql — Punto Único de Entrada">
          <TheoryBlock title="Arquitectura de conexión">
            <p>«El módulo database.js es el punto único de entrada a SQLite. Ahí se crea la conexión con <code>new Database()</code>, se ejecutan las sentencias de creación de tablas y se exporta el objeto db para que los modelos/servicios lo usen.»</p>
          </TheoryBlock>

          <TimelineItem
            date="db/database.js"
            title="Conexión + schema + bootstrap"
            description={`19 líneas que hacen 3 cosas:
1. Abren/crean la DB con better-sqlite3
2. Ejecutan schema.sql (CREATE TABLE IF NOT EXISTS)
3. Corren bootstrap: migración de users + seed idempotente

La teoría dice: "Si la base de datos no existe, better-sqlite3 la creará." Exactamente lo que pasa.`}
            code={`// db/database.js (CÓDIGO REAL - 19 líneas)
const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');
const { ensureSeedData, ensureUsersTable } = require('./bootstrap');

const dbPath = path.join(__dirname, 'database.db');
const db = new Database(dbPath);

const schemaPath = path.join(__dirname, 'schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf8');

db.exec(schema);          // Crea tablas si no existen
ensureUsersTable(db);     // Migra esquema legacy
ensureSeedData(db);       // Seed idempotente

module.exports = db;`}
          />

          <TimelineItem
            date="db/schema.sql"
            title="5 tablas relacionales"
            description={`El esquema define 5 tablas con FOREIGN KEYs:
• categories (id, name, icon, type)
• products (id, title, description, price, src, category, isTopSeller)
• users (id, name, email, password_hash, created_at)
• orders (id, user_id → users, total, created_at)
• order_items (id, order_id → orders, product_id → products, quantity, price)

La teoría dice: "No es un JSON mejorado: es la definición de un sistema relacional." Nuestro schema.sql lo demuestra.`}
            code={`-- db/schema.sql (CÓDIGO REAL)
CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL, icon TEXT, type TEXT
);
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL, description TEXT,
    price REAL NOT NULL, src TEXT,
    category TEXT, isTopSeller INTEGER DEFAULT 0
);
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER, total REAL NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
);
CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER, product_id INTEGER,
    quantity INTEGER NOT NULL, price REAL NOT NULL,
    FOREIGN KEY(order_id) REFERENCES orders(id),
    FOREIGN KEY(product_id) REFERENCES products(id)
);`}
          />
        </Section>

        {/* ── 03 ── */}
        <Section num="03" title="Bootstrap: Migración + Seed Idempotente">
          <TheoryBlock title="Transacciones ACID">
            <p>La documentación dice: «El archivo .db no es un "JSON mejorado", sino una base de datos completa que soporta transacciones y cumple con las garantías ACID.»</p>
            <p className="mt-2">Nuestro bootstrap usa <code>db.transaction()</code> para garantizar que la migración de users sea atómica: o migra todo o no migra nada.</p>
          </TheoryBlock>

          <TimelineItem
            date="db/bootstrap.js"
            title="ensureUsersTable() — Migración atómica"
            description={`El punto más fuerte de la arquitectura DB. Flujo:
1. PRAGMA table_info(users) → lee columnas actuales
2. Si tiene password_hash + created_at y NO tiene password → esquema OK, salir
3. Si no → db.transaction() atómico:
   a. RENAME TABLE users → users_legacy
   b. CREATE TABLE users (nuevo esquema)
   c. INSERT INTO users SELECT ... FROM users_legacy (adapta columnas)
   d. DROP TABLE users_legacy

Esto permite arranques seguros en múltiples entornos sin perder datos.`}
            code={`// db/bootstrap.js (CÓDIGO REAL - migración)
function ensureUsersTable(db) {
    const usersColumns = db.prepare(
      'PRAGMA table_info(users)').all();
    if (usersColumns.length === 0) return;

    const hasPasswordHash = usersColumns.some(
      c => c.name === 'password_hash');
    const hasCreatedAt = usersColumns.some(
      c => c.name === 'created_at');
    const hasLegacyPassword = usersColumns.some(
      c => c.name === 'password');

    if (hasPasswordHash && hasCreatedAt && !hasLegacyPassword)
      return;  // Esquema ya correcto

    const migrateUsers = db.transaction(() => {
        db.exec('ALTER TABLE users RENAME TO users_legacy');
        db.exec(\`CREATE TABLE users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )\`);
        // Adapta columnas legacy dinámicamente
        const legacyColumns = db.prepare(
          'PRAGMA table_info(users_legacy)').all();
        const pwCol = legacyColumns.some(
          c => c.name === 'password_hash')
          ? 'password_hash' : 'password';
        db.exec(\`INSERT INTO users
          (id, name, email, password_hash, created_at)
          SELECT id, name, email, \${pwCol},
          CURRENT_TIMESTAMP FROM users_legacy\`);
        db.exec('DROP TABLE users_legacy');
    });
    migrateUsers();  // Atómico: todo o nada
}`}
          />

          <TimelineItem
            date="db/bootstrap.js"
            title="ensureSeedData() — Seed con transacciones"
            description={`Seed idempotente: solo inserta si la tabla está vacía.
• SELECT COUNT(*) → si 0, inserta con db.transaction()
• Usa db.prepare() una vez + .run() en loop (Statement reusado)
• Categorías y productos se seedean por separado

La teoría dice: "prepare() parsea y valida la consulta una sola vez — si hay error, explota en el prepare() y no en la ejecución." Nuestro seed aprovecha eso.`}
            code={`// db/bootstrap.js (CÓDIGO REAL - seed)
function ensureSeedData(db) {
    const catCount = db.prepare(
      'SELECT COUNT(*) AS count FROM categories')
      .get().count;

    if (catCount === 0) {
        const insertCat = db.prepare(
          'INSERT INTO categories (name, icon, type) VALUES (?, ?, ?)');
        const seedCategories = db.transaction(() => {
            for (const cat of categories) {
                insertCat.run(cat.name, cat.icon, cat.type);
            }
        });
        seedCategories();
    }

    const prodCount = db.prepare(
      'SELECT COUNT(*) AS count FROM products')
      .get().count;

    if (prodCount === 0) {
        const insertProd = db.prepare(
          'INSERT INTO products (title, description, price, src, category, isTopSeller) VALUES (?, ?, ?, ?, ?, ?)');
        const seedProducts = db.transaction(() => {
            for (const p of products) {
                insertProd.run(p.title, p.description,
                  p.price, p.src, p.category, p.isTopSeller);
            }
        });
        seedProducts();
    }
}`}
          />
        </Section>

        {/* ── 04 ── */}
        <Section num="04" title="productsService: de Array.filter() a SQL">
          <TheoryBlock title="prepare(), get(), all()">
            <p>«El método .prepare() toma el string SQL, lo envía al motor SQLite y genera un Statement precompilado. El Statement tiene: .run() para INSERT/UPDATE/DELETE, .get() para una fila, .all() para un array de resultados.»</p>
            <p className="mt-2">«Los bound parameters (?) son valores que se "inyectan" sin modificar el SQL, permitiendo seguridad, performance y tipado correcto.»</p>
          </TheoryBlock>

          <div className="mt-6 space-y-4">
            <TimelineItem
              date="STP2 → STP3"
              title="Evolución lado a lado"
              description="Cada función migró de operar sobre un array en memoria a ejecutar SQL real:"
              code={`// ━━━ STP2: Array en memoria ━━━
function getAllProducts() {
    return productos.map(withFallbackImage);
}
function getRandomProducts(limit = 4) {
    return [...getAllProducts()]
      .sort(() => 0.5 - Math.random()).slice(0, limit);
}
function searchProductsByName(query) {
    return getAllProducts().filter(product =>
      String(product.title).toLowerCase().includes(query));
}

// ━━━ STP3: SQL real con better-sqlite3 ━━━
function getAllProducts() {
    return db.prepare('SELECT * FROM products')
      .all().map(withFallbackImage);
}
function getRandomProducts(limit = 4) {
    return db.prepare(
      'SELECT * FROM products ORDER BY RANDOM() LIMIT ?')
      .all(limit).map(withFallbackImage);
}
function searchProductsByName(query) {
    return db.prepare(
      "SELECT * FROM products WHERE LOWER(title) LIKE '%' || LOWER(?) || '%'")
      .all(normalizedQuery).map(withFallbackImage);
}`}
            />

            <TimelineItem
              date="normalizeId()"
              title="Validación semántica contra DB"
              description={`En STP2, normalizeId() solo validaba formato (regex).
En STP3, TAMBIÉN consulta la DB para confirmar existencia:
• ID no numérico → { ok: false, statusCode: 400 }
• ID válido pero no existe en DB → { ok: false, statusCode: 404 }
• Existe → { ok: true, id, product }

El router lee normalizedId.ok y normalizedId.statusCode para decidir 400 vs 404.`}
              code={`// services/productsService.js STP3 (CÓDIGO REAL)
function normalizeId(rawId) {
    const value = String(rawId || '').trim();
    if (!/^\\d+$/.test(value))
      return { ok: false, statusCode: 400 };

    const normalized = Number(value);
    if (!Number.isInteger(normalized) || normalized <= 0)
      return { ok: false, statusCode: 400 };

    // ← NUEVA: consulta la DB
    const product = getProductById(normalized);
    if (!product)
      return { ok: false, statusCode: 404 };

    return { ok: true, id: String(normalized), product };
}

// En el router STP3:
if (!normalizedId.ok && normalizedId.statusCode === 400)
    return res.status(400).render('pages/400/400-page');
if (!normalizedId.ok && normalizedId.statusCode === 404)
    return res.status(404).render('pages/product/product-not-found-page');
if (normalizedId.ok)
    return res.render('pages/product/product-detail-page',
      { producto: normalizedId.product });`}
            />
          </div>
        </Section>

        {/* ── 05 ── */}
        <Section num="05" title="Carrito: Sesión + DB como fuente de verdad">
          <TheoryBlock title="Patrón híbrido sesión/DB">
            <p>La US4 STP3 dice: «El carrito sigue viviendo en la sesión, pero ahora debe obtener los datos reales del producto desde SQLite. No se guarda información sensible en la sesión.»</p>
          </TheoryBlock>

          <TimelineItem
            date="cartService.js STP3"
            title="Precios de DB, nunca de sesión"
            description={`La sesión guarda SOLO { productId, quantity }.
Al renderizar, buildCartItem() llama a productsService.getProductById() que ahora ejecuta SELECT * FROM products WHERE id = ?.

Si un producto fue eliminado de la DB entre requests, buildCartItem() retorna null y .filter(Boolean) lo excluye silenciosamente.

El precio real SIEMPRE viene de la DB — nunca de la sesión.`}
            code={`// services/cartService.js STP3 (CÓDIGO REAL)
function buildCartItem(cartLine) {
    // Precio y existencia: SQLite vía productsService
    const product = productsService.getProductById(
      cartLine.productId);  // ← SELECT * FROM products WHERE id = ?
    if (!product) return null;  // Producto borrado → ignorar

    const quantity = Number(cartLine.quantity) || 0;
    const unitPrice = product.price;  // ← Precio real de DB

    return {
        productId: String(product.id),
        title: product.title,
        description: product.description,
        category: product.category,
        src: product.src,
        quantity,
        unitPrice,
        subtotal: unitPrice * quantity
    };
}`}
          />

          <ContrastBlock
            theory="«No se usa JSON. El carrito funciona igual que antes. No se guarda información sensible en la sesión.» — US4 STP3"
            practice="cartService mantiene la misma API que STP2, pero ahora getProductById() ejecuta SQL en lugar de buscar en un array. Cambio transparente para las vistas."
          />
        </Section>

        {/* ── 06 ── */}
        <Section num="06" title="catalogService: Categorías desde DB">
          <TimelineItem
            date="services/catalogService.js"
            title="Nuevo servicio con SQL"
            description={`STP3 agrega catalogService.js — servicio nuevo que consulta la tabla categories directamente con SQL. Las categorías ya no vienen de un require() a un array hardcodeado.`}
            code={`// services/catalogService.js (CÓDIGO REAL - 16 líneas)
const db = require('../db/database');
const { publicidades } = require('../data/homeContent');

function getCategories() {
    return db.prepare(
      'SELECT name, icon, type FROM categories ORDER BY id ASC'
    ).all();
}

function getHomeBanners() {
    return publicidades;  // Banners siguen en data/ (no son entidad DB)
}

module.exports = { getCategories, getHomeBanners };`}
          />
        </Section>

        {/* ── 07 ── */}
        <Section num="07" title="Arquitectura por Capas — Teoría vs Proyecto">
          <TheoryBlock title="La nueva arquitectura según la cátedra">
            <p>«Las rutas definen los endpoints y nada más. Los controladores reciben la request, validan lo mínimo y delegan. Los modelos encapsulan el acceso a la base de datos. SQLite se convierte en la capa de persistencia real.»</p>
            <p className="mt-2">«El objetivo no es agregar capas por agregar, sino acomodar el sistema para que la complejidad que viene no lo rompa.»</p>
          </TheoryBlock>

          <div className="mt-6 font-mono text-sm bg-black/30 p-5 rounded-xl border border-white/5 text-textMuted">
            <div className="text-white mb-3">Capas en STP3 vs Capas de la teoría:</div>
            <div className="space-y-1">
              <div>📖 Teoría: route → controller → <span className="text-orange-300">model (SQL)</span> → DB</div>
              <div>💻 Nuestro: route → controller → <span className="text-accent">service (SQL)</span> → DB</div>
            </div>
            <div className="mt-3 text-xs text-amber-300/80">
              Nota: La cátedra sugiere NO usar services en STP3 ("son un concepto más avanzado"). Nuestro proyecto los mantiene de STP2 porque ya existían. El service cumple el rol de model+service combinado.
            </div>
          </div>

          <ContrastBlock
            theory="«En este curso no vamos a usar servicios. No porque no sean importantes, sino porque son un concepto más avanzado, propio de backend profesional.» — Doc. Datos"
            practice="Nuestro proyecto mantiene services/ de STP2 por continuidad. Los services hacen db.prepare() directamente, combinando la capa model + service de la teoría en una sola. Decisión pragmática: no romper lo que ya funciona."
          />
        </Section>

        {/* ── 08 ── */}
        <Section num="08" title="7 User Stories de STP3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <USGroup title="Infraestructura DB" items={['US1 — Crear DB SQLite (schema.sql)', 'US2 — Migrar datos de JSON a SQLite', 'US6 — Eliminar dependencia de JSON']} color="blue" />
            <USGroup title="Servicios SQL" items={['US3 — productsService con SQL', 'US4 — cartService con datos de DB', 'US5 — normalizeId() contra DB']} color="green" />
            <USGroup title="Preparación STP4" items={['US7 — Tabla users lista para auth']} color="purple" />
          </div>

          <div className="mt-6 p-5 bg-emerald-950/30 border border-emerald-500/20 rounded-xl">
            <h4 className="text-emerald-400 font-semibold mb-3">Validaciones clave cumplidas:</h4>
            <ul className="text-sm text-emerald-200/80 space-y-1">
              <li>✅ La base se crea sin errores al arrancar</li>
              <li>✅ Ninguna función del servicio usa JSON</li>
              <li>✅ Los controladores siguen funcionando sin cambios</li>
              <li>✅ Las vistas muestran datos reales desde SQLite</li>
              <li>✅ No se duplican datos si se ejecuta dos veces (seed idempotente)</li>
              <li>✅ La tabla users tiene password_hash (no password)</li>
              <li>✅ No se implementa login todavía (preparación para STP4)</li>
            </ul>
          </div>
        </Section>

        {/* ── 09 ── */}
        <Section num="09" title="El Salto Conceptual" isLast={true}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <EvoCard phase="STP1" desc="Array hardcodeado en data/db.js. Sin persistencia. Sin sesiones." color="blue" />
            <EvoCard phase="STP2" desc="Mismo array + express-session para carrito. Controllers + Services." color="purple" />
            <EvoCard phase="STP3" desc="SQLite real. prepare()/get()/all(). Transacciones ACID. Seed idempotente." color="green" />
          </div>

          <div className="mt-6 p-5 bg-accent/10 border border-accent/20 rounded-xl">
            <p className="text-accent font-semibold mb-2">Cita final de la cátedra:</p>
            <p className="text-sm text-textMuted italic">«Este cambio no es menor: es el momento en que la aplicación deja de ser un ejercicio académico y empieza a comportarse como un producto que podría vivir en producción.»</p>
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({ num, title, children, isLast = false }) {
  return (
    <section className={isLast ? 'mb-8' : 'mb-16'}>
      <h2 className="text-3xl font-bold mb-2 border-b border-white/10 pb-4">
        <span className="text-accent">{num}.</span> {title}
      </h2>
      {children}
    </section>
  );
}

function USGroup({ title, items, color }) {
  const bg = { blue: 'bg-blue-950/30 border-blue-500/20', green: 'bg-emerald-950/30 border-emerald-500/20', purple: 'bg-purple-950/30 border-purple-500/20' };
  const text = { blue: 'text-blue-400', green: 'text-emerald-400', purple: 'text-purple-400' };
  return (
    <div className={`p-4 ${bg[color]} border rounded-xl`}>
      <h4 className={`${text[color]} font-semibold text-sm mb-2`}>{title}</h4>
      <ul className="text-xs text-textMuted space-y-1">
        {items.map((item, i) => <li key={i}>• {item}</li>)}
      </ul>
    </div>
  );
}

function EvoCard({ phase, desc, color }) {
  const bg = { blue: 'bg-blue-950/30 border-blue-500/20', purple: 'bg-purple-950/30 border-purple-500/20', green: 'bg-emerald-950/30 border-emerald-500/20' };
  const text = { blue: 'text-blue-400', purple: 'text-purple-400', green: 'text-emerald-400' };
  return (
    <div className={`p-5 ${bg[color]} border rounded-xl`}>
      <h4 className={`${text[color]} font-bold text-lg mb-2`}>{phase}</h4>
      <p className="text-xs text-textMuted">{desc}</p>
    </div>
  );
}
