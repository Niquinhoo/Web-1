import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Slide from '../components/Slide';

const ARCHITECTURE = [
  {
    label: "Rutas",
    items: [
      { stp: "STP1", value: "7 routers con express.Router()", status: "neutral",
        detail: "7 archivos en routes/ modularizados con app.use(): home, login, register, cart, checkout, account, productos. Cada router maneja lógica visual completa — llama al service, prepara datos y renderiza EJS." },
      { stp: "STP2", value: "Endpoints HTTP con semántica REST", status: "improved",
        detail: "Rutas con verbos HTTP correctos y patrón POST-Redirect-GET. Ya no tocan datos — solo definen endpoints y delegan a controllers. Separación de concerns clara." },
      { stp: "STP3", value: "Totalmente limpias — sin cambios", status: "improved",
        detail: "Idénticas a STP2. La migración a SQLite es transparente para las rutas porque controllers y servicios manejan el cambio internamente." }
    ]
  },
  {
    label: "Controladores",
    items: [
      { stp: "STP1", value: "No existen", status: "worst",
        detail: "Las rutas actúan como proto-controladores. No hay capa HTTP separada — cada ruta recibe req, llama al service y ejecuta res.render(). La lógica visual y de negocio están mezcladas." },
      { stp: "STP2", value: "Thin wrappers — 10 y 7 funciones", status: "improved",
        detail: "productController exporta 10 funciones que delegan 1:1 al service. cartController con 7 operaciones (add, update, remove, clear). Capa delgada deliberada: solo traduce HTTP a llamadas de servicio." },
      { stp: "STP3", value: "Sin cambios — migración transparente", status: "improved",
        detail: "Los controladores no requieren modificaciones. La migración a SQLite ocurre solo en servicios. Esto demuestra que la arquitectura por capas aísla correctamente los cambios de persistencia." }
    ]
  },
  {
    label: "Servicios",
    items: [
      { stp: "STP1", value: "2 servicios, 6 funciones total", status: "neutral",
        detail: "product.service.js (getAllProducts, getProductById, getRelatedProducts, getRandomProducts) y cart.service.js (buildCartItem, getCartDetail). Operan sobre array global en memoria." },
      { stp: "STP2", value: "10 ops catálogo + CRUD carrito", status: "improved",
        detail: "productsService crece a 10 funciones: agrega normalizeId(), searchProductsByName(), getProductsByCategory(), getProductsSortedByPrice(). cartService con CRUD completo sobre session." },
      { stp: "STP3", value: "Misma API — SQL real con prepare()", status: "improved",
        detail: "Interfaz idéntica a STP2 pero con db.prepare('SELECT...').all(). Bound parameters (?), LIKE, ORDER BY RANDOM(), ORDER BY price. Sin cambios en quienes consumen el servicio." }
    ]
  },
  {
    label: "Persistencia",
    items: [
      { stp: "STP1", value: "Mock global — data/db.js", status: "worst",
        detail: "Array de objetos en data/db.js. Compartido entre todos los usuarios. Sin persistencia: al reiniciar el servidor se pierde todo. Sin integridad ni concurrencia." },
      { stp: "STP2", value: "Mock encapsulado en models/", status: "neutral",
        detail: "Los datos se mueven a models/productModel.js. Sigue siendo array en memoria pero ahora encapsulado con una API clara. Estructura lista para migrar a DB sin cambiar la interfaz." },
      { stp: "STP3", value: "SQLite — 5 tablas, ACID, seed", status: "improved",
        detail: "better-sqlite3 con 5 tablas relacionales, FOREIGN KEYs, transacciones ACID, bootstrap idempotente con migración atómica de esquema legacy. Persistencia real y garantías ACID." }
    ]
  },
  {
    label: "Carrito",
    items: [
      { stp: "STP1", value: "Global y compartido", status: "worst",
        detail: "Array carrito en data/db.js. Mismo carrito visible para todos los usuarios. Sin sesión ni individualización. Precios hardcodeados en el array." },
      { stp: "STP2", value: "Individual por sesión", status: "improved",
        detail: "express-session con { productId, quantity }. Cada usuario tiene su propio carrito. Los precios se resuelven al renderizar consultando el modelo. Cart counter global via middleware." },
      { stp: "STP3", value: "Sesión + SQLite como fuente real", status: "improved",
        detail: "La sesión guarda solo IDs mínimos. buildCartItem() ejecuta SELECT * FROM products WHERE id = ?. Si un producto se elimina, se filtra automáticamente. El precio real siempre viene de la DB." }
    ]
  },
  {
    label: "Manejo de Errores",
    items: [
      { stp: "STP1", value: "Fallback básico", status: "worst",
        detail: "Middleware de fallback al final que redirige rutas inexistentes a /login. Assets estáticos reciben 404 silencioso. No hay diferenciación entre 400, 404 y 500." },
      { stp: "STP2", value: "400 + 404 + 500 con vistas", status: "improved",
        detail: "Middleware 404 global (3 params) y middleware 500 (4 params) al final de la cadena. normalizeId() separa 400 (ID inválido) de 404 (no encontrado). Cada código tiene su vista EJS dedicada." },
      { stp: "STP3", value: "400/404 contra DB real", status: "improved",
        detail: "normalizeId() ahora valida formato (regex → 400) Y existencia en SQLite (SELECT → 404). El router decide el código de estado basado en normalizedId.statusCode." }
    ]
  },
  {
    label: "Validación",
    items: [
      { stp: "STP1", value: "Sin validación", status: "worst",
        detail: "Login y register son mock. No hay validación de formularios ni del lado del cliente ni del servidor. Los datos se aceptan sin control alguno." },
      { stp: "STP2", value: "Dual frontend + backend — 422", status: "improved",
        detail: "register-validation.js frena el submit en frontend. El servidor re-valida y responde 422 con feedback visual por campo. 6 reglas: vacíos, email, longitud ≥8, letra+número+especial, prohibidas, coincidencia." },
      { stp: "STP3", value: "Se mantiene de STP2", status: "improved",
        detail: "La validación no depende del motor de persistencia, por lo que no requiere cambios. Sigue siendo dual frontend+backend con respuesta 422 y mensajes por campo." }
    ]
  }
];

const STP_COLORS = ['text-primary', 'text-secondary', 'text-tertiary'];
const STP_HEADERS = ['#1E3A8A', '#6D7698', '#6E2C00'];

function StatusDot({ status }) {
  const colors = {
    worst: 'bg-red-500',
    neutral: 'bg-amber-500',
    improved: 'bg-emerald-600'
  };
  return <span className={`w-2 h-2 rounded-full ${colors[status]} inline-block shrink-0`} />;
}

export default function EvolutionSlide() {
  const [selected, setSelected] = useState(null);

  const handleClick = (category, itemIndex) => {
    setSelected({ ...category, activeItem: category.items[itemIndex], itemIndex });
  };

  return (
    <Slide className="justify-center items-center">
      <h2 className="text-4xl font-bold mb-2 text-center font-display">Evolución de la Arquitectura</h2>
      <p className="text-textMuted text-sm mb-6 text-center max-w-xl">
        Hacé clic en cada ítem para ver el análisis técnico detallado
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
        {['STP1', 'STP2', 'STP3'].map((stp, colIdx) => (
          <div
            key={stp}
            className={`glass-panel p-4 ${colIdx === 1 ? 'scale-105 shadow-md z-10' : ''}`}
            style={{ borderTop: `3px solid ${STP_HEADERS[colIdx]}` }}
          >
            <div className={`font-display text-lg mb-4 font-bold text-center ${STP_COLORS[colIdx]}`}>
              {stp}
              <span className="block text-xs font-normal text-textMuted mt-1">
                {colIdx === 0 ? 'Fundación' : colIdx === 1 ? 'Consolidación' : 'Persistencia'}
              </span>
            </div>

            <div className="space-y-1">
              {ARCHITECTURE.map((cat) => (
                <button
                  key={cat.label}
                  onClick={() => handleClick(cat, colIdx)}
                  className="w-full text-left p-2 rounded-lg bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:border-gray-300 transition-all cursor-pointer group"
                >
                  <span className="text-[10px] text-textMuted uppercase tracking-wider block">{cat.label}</span>
                  <span className="text-xs font-medium text-textMain flex items-center gap-1.5 mt-0.5">
                    <StatusDot status={cat.items[colIdx].status} />
                    {cat.items[colIdx].value}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm"
              onClick={() => setSelected(null)}
            />
            <motion.div
              key="popover"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.4, bounce: 0.3 }}
              className="fixed inset-x-4 top-[12%] mx-auto max-w-lg z-50 bg-white rounded-2xl shadow-xl border border-gray-200 p-6 overflow-auto max-h-[76vh]"
            >
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
                <h3 className="text-xl font-bold text-textMain flex items-center gap-2 font-display">
                  <span className="text-primary">{selected.label}</span>
                </h3>
                <button
                  onClick={() => setSelected(null)}
                  className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-textMuted"
                  aria-label="Cerrar"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                {selected.items.map((item, i) => (
                  <div
                    key={item.stp}
                    className={`p-4 rounded-xl border transition-colors ${
                      i === selected.itemIndex
                        ? 'bg-primary/[0.04] border-primary/20'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <StatusDot status={item.status} />
                      <span className={`font-mono text-sm font-bold ${STP_COLORS[i]}`}>{item.stp}</span>
                      <span className="text-xs text-textMuted ml-auto">{item.value}</span>
                    </div>
                    <p className="text-sm text-textMuted leading-relaxed">{item.detail}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </Slide>
  );
}
