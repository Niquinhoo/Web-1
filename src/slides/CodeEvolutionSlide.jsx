import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Slide from '../components/Slide';
import CodeBlock from '../components/CodeBlock';

const CART_TAB = {
  id: 'cart',
  label: 'Carrito',
  columns: [
    {
      key: 'stp1',
      title: 'STP1: Memoria Global',
      code: `// STP1: data/db.js — Array global compartido
const carrito = [
  { productId: 1, quantity: 2, price: 1500 },
];
// Mismo carrito para todos los usuarios.
// Precios hardcodeados, sin validación.`,
      detail: 'En STP1 el carrito era un array global en data/db.js. Todos los usuarios compartían el mismo carrito. Los precios estaban hardcodeados. No había sesión ni individualización. Cero persistencia.'
    },
    {
      key: 'stp2',
      title: 'STP2: Estado por Sesión',
      code: `// STP2: express-session — Carrito individual
app.use(session({
  secret: 'web-1-cart-session',
  resave: false,
  saveUninitialized: false
}));

// Cada usuario tiene su propio carrito
if (!req.session.cart) {
  req.session.cart = [];
}

// El contador se expone via res.locals
// para el badge del navbar`,
      detail: 'Express-session permite un carrito por usuario. Cada request tiene su propio req.session.cart. Los precios se resuelven al renderizar consultando el modelo. Middleware global expone cartItemCount en res.locals.'
    },
    {
      key: 'stp3',
      title: 'STP3: Sesión + SQLite',
      code: `// STP3: cartService.js — DB como fuente real
const getCartDetails = (sessionCart) => {
  let total = 0;
  const items = sessionCart.map(item => {
    // La DB es la fuente de verdad
    const product = db.prepare(
      'SELECT * FROM products WHERE id = ?'
    ).get(item.productId);

    if (!product) return null;
    total += product.price * item.quantity;
    return { ...product, quantity: item.quantity };
  });
  return { items: items.filter(Boolean), total };
};
// Sesión guarda solo IDs.
// DB valida existencia y precio real.`,
      detail: 'La sesión guarda solo productId y quantity. buildCartItem() ejecuta SELECT * FROM products WHERE id = ? para obtener el precio real desde SQLite. Si un producto fue eliminado, se filtra automáticamente con filter(Boolean).'
    }
  ]
};

const PRODUCTS_TAB = {
  id: 'products',
  label: 'Productos',
  columns: [
    {
      key: 'stp1',
      title: 'STP1: Array en Memoria',
      code: `// STP1: product.service.js — 4 funciones
function getProductById(productId) {
  return productos.find(
    p => p.id === String(productId)
  );
}

function getRelatedProducts(product) {
  return productos.filter(
    i => i.category === product.category
      && i.id !== product.id
  );
}

function getRandomProducts(limit = 4) {
  return [...productos]
    .sort(() => 0.5 - Math.random())
    .slice(0, limit);
}
// Array.find(), Array.filter(), Math.random()`,
      detail: '4 funciones operando sobre el array global en data/db.js. getProductById() usa Array.find() con conversión a String. getRandomProducts() usa Math.random() para shuffling. Sin validación de IDs, sin búsqueda, sin ordenamiento.'
    },
    {
      key: 'stp2',
      title: 'STP2: 10 Operaciones',
      code: `// STP2: productsService.js — Validación
function normalizeId(rawId) {
  const value = String(rawId || '').trim();
  if (!/^\\d+$/.test(value)) return null;
  const normalized = Number(value);
  if (!Number.isInteger(normalized)
    || normalized <= 0) return null;
  return String(normalized);
}

function searchProductsByName(query) {
  return getAllProducts().filter(p =>
    p.title.toLowerCase()
      .includes(query.toLowerCase()));
}
// Regex, búsqueda case-insensitive, sort asc/desc`,
      detail: '10 funciones con normalizeId() que valida formato mediante regex /^\\d+$/. searchProductsByName() con includes() case-insensitive. getProductsByCategory() con normalización Unicode. sort asc/desc en getProductsSortedByPrice().'
    },
    {
      key: 'stp3',
      title: 'STP3: SQL Real',
      code: `// STP3: productsService.js — Consultas SQL
function getProductById(id) {
  return db.prepare(
    'SELECT * FROM products WHERE id = ?'
  ).get(id);
}

function getRandomProducts(limit = 4) {
  return db.prepare(
    'SELECT * FROM products ORDER BY RANDOM() LIMIT ?'
  ).all(limit);
}

function searchProductsByName(query) {
  return db.prepare(
    "SELECT * FROM products WHERE LOWER(title) LIKE '%' || LOWER(?) || '%'"
  ).all(query);
}
// prepare(), bound params, LIKE, RANDOM()`,
      detail: 'Misma API que STP2 pero con SQL real. db.prepare() precompila el statement una sola vez. Bound parameters (?) evitan SQL injection. ORDER BY RANDOM() es más eficiente que sort+Math.random(). LIKE con LOWER() para búsqueda nativa.'
    }
  ]
};

const TABS = [CART_TAB, PRODUCTS_TAB];

export default function CodeEvolutionSlide() {
  const [activeTab, setActiveTab] = useState(CART_TAB.id);
  const [selectedColumn, setSelectedColumn] = useState(null);

  const currentTab = TABS.find(t => t.id === activeTab);

  return (
    <Slide className="justify-center">
      <h2 className="text-4xl font-bold mb-3 text-center font-display">Evolución en Código</h2>

      <div className="flex justify-center gap-2 mb-6">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setSelectedColumn(null); }}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === tab.id
                ? 'bg-primary text-white shadow-sm'
                : 'bg-white text-textMuted border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <p className="text-textMuted text-sm mb-6 text-center">
        Hacé clic en cada columna para ver el análisis
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[420px]">
        {currentTab.columns.map((col) => (
          <button
            key={col.key}
            onClick={() => setSelectedColumn(col)}
            className="h-full text-left transform transition-all hover:scale-[1.02] focus:outline-none cursor-pointer"
          >
            <CodeBlock
              title={col.title}
              code={col.code}
              language="javascript"
            />
          </button>
        ))}
      </div>

      <AnimatePresence>
        {selectedColumn && (
          <>
            <motion.div
              key="cb-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm"
              onClick={() => setSelectedColumn(null)}
            />
            <motion.div
              key="cb-popover"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.4, bounce: 0.3 }}
              className="fixed inset-x-4 top-[28%] mx-auto max-w-md z-50 bg-white rounded-2xl shadow-xl border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-200">
                <h3 className="text-lg font-bold text-textMain font-display">{selectedColumn.title}</h3>
                <button
                  onClick={() => setSelectedColumn(null)}
                  className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-textMuted"
                  aria-label="Cerrar"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-textMuted leading-relaxed">{selectedColumn.detail}</p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </Slide>
  );
}
