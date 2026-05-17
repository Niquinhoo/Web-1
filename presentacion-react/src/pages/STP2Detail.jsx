import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import TimelineItem from '../components/TimelineItem';
import TheoryBlock from '../components/TheoryBlock';
import ContrastBlock from '../components/ContrastBlock';

export default function STP2Detail() {
  return (
    <div className="min-h-screen bg-background text-textMain p-8 md:p-16 relative overflow-x-hidden">
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-secondary/5 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] rounded-full bg-purple-500/5 blur-[120px]"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <Link to="/" className="inline-flex items-center text-secondary hover:text-secondary/80 mb-8 transition-colors">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Volver a la Presentación
        </Link>

        <header className="mb-16">
          <span className="text-secondary font-mono text-xl mb-2 block">Fase 2</span>
          <h1 className="text-5xl font-bold mb-4">STP2: MVC y Sesiones</h1>
          <p className="text-xl text-textMuted">
            Consolidación arquitectónica MVC, carrito con express-session, manejo de errores HTTP y 19 User Stories — contrastado con la teoría de Middlewares, MVC y Gestión de Datos.
          </p>
        </header>

        {/* ── 01: EVOLUCIÓN ARQUITECTÓNICA ── */}
        <Section num="01" title="Evolución Arquitectónica: de STP1 a STP2">
          <TheoryBlock title="Patrón MVC según la cátedra">
            <p>La documentación define: «El <strong>Modelo</strong> representa los datos y la lógica de negocio. La <strong>Vista</strong> es la interfaz de usuario. El <strong>Controlador</strong> recibe las solicitudes del usuario, interactúa con el Modelo y selecciona la Vista apropiada.»</p>
            <p className="mt-2">También: «Obtendremos como producto final, un proyecto que sigue el patrón MVC e implementa una API Rest para poder consumir los datos de forma segura y ordenada.»</p>
          </TheoryBlock>
          <ContrastBlock
            theory="«La meta no era solo mover archivos, sino dejar una base más mantenible» — US1 STP2. El patrón MVC separa datos, lógica y presentación."
            practice="STP2 introduce controllers/ y migra data/db.js → models/productModel.js. Las rutas ya no tocan datos directamente: delegan al controller, que delega al service, que consulta al model."
          />
          <div className="mt-4 font-mono text-sm bg-black/30 p-5 rounded-xl border border-white/5 text-textMuted">
            <div className="text-white mb-2">Flujo STP2:</div>
            <div>Cliente → <span className="text-secondary">app.js</span> → <span className="text-blue-400">route</span> → <span className="text-purple-400">controller</span> → <span className="text-accent">service</span> → <span className="text-orange-300">model</span></div>
            <div className="mt-1">Cliente ← <span className="text-green-400">render EJS</span> ← <span className="text-blue-400">route</span> ← datos preparados</div>
          </div>
        </Section>

        {/* ── 02: MIDDLEWARES Y SESIÓN ── */}
        <Section num="02" title="Middlewares y express-session">
          <TheoryBlock title="Middlewares de terceros">
            <p>La documentación dice: «Los middlewares de terceras partes son funcionalidades que agregamos a nuestra app a través de paquetes npm. Un middleware intercepta el ciclo petición/respuesta, accede a req y res, y puede continuar con next() o terminar el ciclo.»</p>
            <p className="mt-2">express-session es exactamente esto: un middleware npm que agrega <code>req.session</code> a cada petición, permitiendo persistir datos entre requests del mismo usuario.</p>
          </TheoryBlock>

          <div className="space-y-4 mt-6">
            <TimelineItem
              date="app.js:31-38"
              title="Configuración de express-session"
              description={`La teoría dice que un middleware de terceros se instala vía npm y se carga con app.use() antes de las rutas. Nuestro proyecto configura express-session con:
• secret para firmar la cookie
• resave: false (no reguarda sesiones sin cambios)
• saveUninitialized: false (no crea sesión vacía)
• cookie.httpOnly: true (seguridad contra XSS)`}
              code={`// app.js — Líneas 31-38 (CÓDIGO REAL)
app.use(session({
    secret: 'web-1-cart-session',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true
    }
}));`}
            />

            <TimelineItem
              date="app.js:39-44"
              title="Middleware global: contador del carrito"
              description={`La teoría dice: «Un middleware a nivel de aplicación se ejecuta para TODAS las rutas, interceptando todas las peticiones.»

Nuestro middleware global lee req.session.cart y calcula res.locals.cartItemCount. Esto hace que TODAS las vistas EJS tengan acceso al badge del carrito sin que cada ruta lo calcule manualmente.`}
              code={`// app.js — Líneas 39-44 (CÓDIGO REAL)
app.use((req, res, next) => {
    const cart = Array.isArray(req.session.cart)
      ? req.session.cart : [];
    res.locals.cartItemCount = cart.reduce(
      (total, item) => total + (Number(item.quantity) || 0), 0
    );
    next();
});`}
            />
          </div>

          <ContrastBlock
            theory="«Debemos prestar atención a la posición del middleware dentro de la cadena — un middleware a nivel de app interceptará TODAS las peticiones» — Doc. Middlewares"
            practice="En app.js el orden es: static() → urlencoded() → json() → session() → cartCounter → rutas → 404 → 500. Exactamente la cadena que la teoría describe."
          />
        </Section>

        {/* ── 03: CONTROLLERS ── */}
        <Section num="03" title="Controllers: Capa Delgada HTTP">
          <TheoryBlock title="El Controlador en MVC">
            <p>La documentación MVC define: «El Controlador recibe las solicitudes del usuario, interactúa con el Modelo y selecciona la Vista apropiada para la respuesta.»</p>
            <p className="mt-2">En Express, el controller es quien lee req.params/req.body, llama al service, y decide qué vista renderizar o qué código de estado enviar.</p>
          </TheoryBlock>

          <div className="space-y-4 mt-6">
            <TimelineItem
              date="productController.js"
              title="Controller de productos — delegación pura"
              description={`El productController expone 10 funciones que delegan 1:1 al productsService. Es un "thin wrapper" deliberado: separa la capa HTTP de la lógica de negocio.

La teoría dice que el controller NO debe contener lógica de negocio — solo coordinar. Eso es exactamente lo que hace.`}
              code={`// controllers/productController.js (CÓDIGO REAL)
const productsService = require('../services/productsService');

function getProductById(productId) {
    return productsService.getProductById(productId);
}

function normalizeId(rawId) {
    return productsService.normalizeId(rawId);
}

function getProductsSortedByPrice(sort) {
    return productsService.getProductsSortedByPrice(sort);
}
// ...10 funciones en total, todas delegando`}
            />

            <TimelineItem
              date="cartController.js"
              title="Controller de carrito — 7 operaciones"
              description={`cartController delega al cartService: ensureCart, getCartDetail, addProductToCart, updateProductQuantity, removeProductFromCart, clearCart.

La capa HTTP (rutas) llama al controller. El controller llama al service. El service consulta al model. Tres capas limpias.`}
              code={`// controllers/cartController.js (CÓDIGO REAL)
const cartService = require('../services/cartService');

function addProductToCart(session, productId) {
    return cartService.addProductToCart(session, productId);
}

function updateProductQuantity(session, productId, delta) {
    return cartService.updateProductQuantity(session, productId, delta);
}

function clearCart(session) {
    return cartService.clearCart(session);
}`}
            />
          </div>
        </Section>

        {/* ── 04: SERVICES ── */}
        <Section num="04" title="Services: Lógica de Negocio Encapsulada">
          <TheoryBlock title="El Modelo y la lógica de negocio">
            <p>La documentación dice: «El Modelo representa los datos y la lógica de negocio. Los modelos serán simples archivos JavaScript que contienen funciones para manejar datos.»</p>
            <p className="mt-2">En STP2, los services cumplen el rol de "lógica de negocio" mientras el model (productModel.js) es la fuente de datos pura. Esta separación permite migrar a SQLite en STP3 sin tocar los services.</p>
          </TheoryBlock>

          <div className="space-y-4 mt-6">
            <TimelineItem
              date="productsService.js"
              title="10 operaciones de catálogo"
              description={`productsService.js evoluciona de 4 funciones (STP1) a 10:
• getAllProducts() con fallback de imagen
• getSuggestedProducts() — primeros N del catálogo
• getTopOrderedProducts() — filtro isTopSeller + aleatorios
• getProductById() con normalización de ID
• getRelatedProducts() — misma categoría, excluye actual
• getRandomProducts() — shuffle + slice
• getProductsByCategory() — normalización Unicode de categorías
• normalizeId() — regex /^\\d+$/ + validación positivo entero
• getProductsSortedByPrice() — sort asc/desc
• searchProductsByName() — includes() case-insensitive`}
              code={`// services/productsService.js (CÓDIGO REAL - fragmentos clave)
function normalizeId(rawId) {
    const value = String(rawId || '').trim();
    if (!/^\\d+$/.test(value)) return null;
    const normalized = Number(value);
    if (!Number.isInteger(normalized) || normalized <= 0)
      return null;
    return String(normalized);
}

function getProductsByCategory(category) {
    const normalizedCategory = normalizeCategoryValue(category);
    if (!normalizedCategory) return [];
    return productos
      .filter(item =>
        normalizeCategoryValue(item.category) === normalizedCategory)
      .map(withFallbackImage);
}

function searchProductsByName(query) {
    const normalizedQuery = String(query || '')
      .trim().toLowerCase();
    if (!normalizedQuery) return [];
    return getAllProducts().filter(product =>
      String(product.title || '').toLowerCase()
        .includes(normalizedQuery));
}`}
            />

            <TimelineItem
              date="cartService.js"
              title="Carrito en sesión — CRUD completo"
              description={`cartService.js maneja el ciclo de vida completo del carrito:
1. ensureCart() — inicialización defensiva de session.cart
2. buildCartItem() — cruza productId con modelo real
3. getCartDetailFromSession() — mapea items + calcula totales
4. addProductToCart() — valida stock, incrementa o crea
5. updateProductQuantity() — delta ±1, elimina si ≤ 0
6. removeProductFromCart() — filter por productId
7. clearCart() — reset a []

La sesión SOLO guarda { productId, quantity }. Los precios se resuelven al renderizar.`}
              code={`// services/cartService.js (CÓDIGO REAL - fragmentos clave)
function addProductToCart(session, productId) {
    const cart = ensureCart(session);
    const product = productsService.getProductById(productId);
    if (!product) return false;

    const productStock = Number(product.stock);
    const isOutOfStock = Number.isFinite(productStock)
      && productStock <= 0;
    if (isOutOfStock) return false;

    const existingItem = cart.find(
      item => item.productId === String(productId));
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ productId: String(productId), quantity: 1 });
    }
    return true;
}

function getCartDetailFromSession(sessionCart) {
    const items = sessionCart.map(buildCartItem).filter(Boolean);
    const subtotal = items.reduce(
      (acc, item) => acc + item.subtotal, 0);
    return { items, summary: { subtotal, total: subtotal,
      totalItems: items.reduce(
        (acc, item) => acc + item.quantity, 0) } };
}`}
              isLast={true}
            />
          </div>
        </Section>

        {/* ── 05: RUTAS Y ERRORES HTTP ── */}
        <Section num="05" title="Rutas con Semántica HTTP Correcta">
          <TheoryBlock title="Códigos de estado HTTP">
            <p>La documentación de Rutas dice: «res.status() nos permite definir el código de estado de la respuesta. Los más comunes: 200 (OK), 400 (Bad Request), 404 (Not Found), 500 (Internal Server Error).»</p>
            <p className="mt-2">También: «La forma correcta de manejar un 404 global es agregar un middleware al final de todas nuestras rutas.»</p>
          </TheoryBlock>

          <div className="space-y-4 mt-6">
            <TimelineItem
              date="productos.router.js:30-57"
              title="Detalle con 400 y 404 diferenciados"
              description={`La ruta /:id ahora tiene 3 caminos:
1. ID inválido (letras, negativos) → 400 Bad Request
2. ID válido pero producto inexistente → 404 Not Found + sugerencias
3. Producto encontrado → 200 con detalle + relacionados

Esto NO existía en STP1. La teoría dice: «Debemos responder con el código de estado apropiado para que el cliente sepa exactamente qué pasó.»`}
              code={`// routes/productos.router.js (CÓDIGO REAL)
router.get('/:id', (req, res) => {
    const normalizedId = normalizeId(req.params.id);

    if (!normalizedId) {
        return res.status(400).render('pages/400/400-page',
          { cartItemCount });  // ← 400 Bad Request
    }

    const producto = getProductById(normalizedId);
    if (producto) {
        const relatedProducts = getRelatedProducts(producto);
        return res.render('pages/product/product-detail-page',
          { producto, relatedProducts, categorias });
    }

    const randomProducts = getRandomProducts(4);
    return res.status(404).render(
      'pages/product/product-not-found-page',
      { randomProducts, categorias });  // ← 404
});`}
            />

            <TimelineItem
              date="cart.router.js"
              title="6 rutas RESTful del carrito"
              description={`El carrito usa verbos HTTP correctos:
• GET /cart → ver carrito
• POST /cart/items → agregar producto (req.body.productId)
• POST /cart/items/:productId/increase → +1
• POST /cart/items/:productId/decrease → -1 (elimina si ≤0)
• POST /cart/items/:productId/remove → eliminar
• POST /cart/clear → vaciar

Todas usan res.redirect('/cart') para mantener el patrón POST-Redirect-GET que evita reenvíos de formulario.`}
              code={`// routes/cart.router.js (CÓDIGO REAL)
router.get('/', (req, res) => {
    const cart = ensureCart(req.session);
    const cartDetail = getCartDetailFromSession(cart);
    res.render('pages/cart/cart-page', {
        cartItems: cartDetail.items,
        cartSummary: cartDetail.summary
    });
});

router.post('/items', (req, res) => {
    const { productId } = req.body;
    addProductToCart(req.session, productId);
    res.redirect('/cart');
});

router.post('/items/:productId/increase', (req, res) => {
    updateProductQuantity(req.session,
      req.params.productId, 1);
    res.redirect('/cart');
});`}
            />
          </div>
        </Section>

        {/* ── 06: MANEJO DE ERRORES ── */}
        <Section num="06" title="Manejo de Errores 404 y 500">
          <TheoryBlock title="Middleware de errores">
            <p>La documentación dice: «Los middlewares de error se especifican con cuatro parámetros (err, req, res, next). Se ubican AL FINAL de la cadena de middlewares para capturar cualquier error no manejado.»</p>
          </TheoryBlock>

          <div className="space-y-4 mt-6">
            <TimelineItem
              date="app.js:82-96"
              title="404 global + 500 con vista dedicada"
              description={`STP2 implementa los dos middlewares de error que la teoría describe:

1. Middleware 404 (3 params) — al final de todas las rutas, captura cualquier URL que no matcheó con ningún router
2. Middleware 500 (4 params) — captura errores internos, verifica headersSent para evitar doble respuesta

Cada uno tiene su vista EJS dedicada (404-page.ejs, 500-page.ejs).`}
              code={`// app.js — Líneas 82-96 (CÓDIGO REAL)
// 404 — Ruta no encontrada
app.use((req, res) => {
    console.log(\`Ruta no encontrada: \${req.originalUrl}\`);
    res.status(404).render('pages/404/404-page');
});

// 500 — Error interno del servidor
app.use((error, req, res, next) => {
    console.error(\`[500] Error en \${req.method} \${req.originalUrl}:\`,
      error.message);
    if (res.headersSent) {
        return next(error);
    }
    return res.status(500).render('pages/500/500-page');
});`}
            />
          </div>

          <ContrastBlock
            theory="«Un middleware de error tiene 4 parámetros (err, req, res, next). Si invocamos next(err), Express saltea todos los middlewares normales y va directo al de error» — Doc. Middlewares"
            practice="Nuestro app.js tiene el 404 (3 params) como red de contención y el 500 (4 params) como captura global. Ambos al final de la cadena, exactamente como indica la teoría."
          />
        </Section>

        {/* ── 07: VALIDACIÓN ── */}
        <Section num="07" title="Validación Doble: Frontend + Backend">
          <TheoryBlock title="Validación de formularios">
            <p>La US3 de la cátedra pide: «Validar el formulario de registro antes de enviarlo.» La implementación usa validación dual:</p>
            <p className="mt-2">• <strong>Frontend:</strong> public/scripts/register-validation.js frena el submit antes de que llegue al servidor.</p>
            <p className="mt-2">• <strong>Backend:</strong> routes/register.router.js re-valida todo y responde 422 con feedback visual si falla.</p>
          </TheoryBlock>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 bg-surface/40 border border-white/5 rounded-xl">
              <span className="text-xs font-mono text-blue-400 uppercase tracking-wider block mb-2">Validaciones del registro</span>
              <ul className="text-sm text-textMuted space-y-1">
                <li>• Campos no vacíos ni con espacios</li>
                <li>• Email con formato válido</li>
                <li>• Contraseña ≥ 8 caracteres</li>
                <li>• Incluye letra + número + especial</li>
                <li>• Sin cadenas prohibidas (password, 1234...)</li>
                <li>• Confirmación coincide</li>
              </ul>
            </div>
            <div className="p-5 bg-surface/40 border border-white/5 rounded-xl">
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider block mb-2">Respuesta HTTP</span>
              <ul className="text-sm text-textMuted space-y-1">
                <li>• <code className="text-red-400">422</code> si falla validación backend</li>
                <li>• Re-renderiza con mensajes por campo</li>
                <li>• Bordes rojos + alertas visuales</li>
                <li>• Si pasa → redirect a /home (mock)</li>
              </ul>
            </div>
          </div>
        </Section>

        {/* ── 08: USER STORIES ── */}
        <Section num="08" title="19 User Stories Integradas">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <USGroup title="Base y UX" items={['US1 — Reordenar proyecto (MVC)', 'US2 — Página 404', 'US14 — Layout base main.ejs']} color="blue" />
            <USGroup title="Catálogo" items={['US6 — Productos sugeridos', 'US7 — Más pedidos (isTopSeller)', 'US8 — Relacionados por categoría', 'US9 — Detalle de producto', 'US10 — Filtro por categoría', 'US17 — Normalización de IDs (400)', 'US18 — Orden por precio', 'US19 — Buscador por nombre']} color="purple" />
            <USGroup title="Carrito" items={['US4 — Carrito en sesión', 'US5 — Checkout temporal', 'US11 — Sin stock (bloqueo)', 'US12 — Badge en navbar', 'US16 — Servicio del carrito']} color="green" />
            <USGroup title="Auth y Errores" items={['US3 — Validar registro (422)', 'US13 — Página 500', 'US15 — Servicio de productos']} color="amber" />
          </div>

          <div className="mt-6 p-5 bg-violet-950/30 border border-violet-500/20 rounded-xl">
            <h4 className="text-violet-400 font-semibold mb-3">Integraciones entre historias:</h4>
            <ul className="text-sm text-violet-200/80 space-y-2">
              <li><strong>Catálogo + Detalle:</strong> US6→US9→US8 comparten cards, grid y productsService</li>
              <li><strong>Carrito persistente:</strong> US4→US11→US12→US16 — sesión + stock + badge + service</li>
              <li><strong>Errores HTTP:</strong> US2 (404) + US13 (500) + US17 (400) = semántica completa</li>
              <li><strong>Layout unificado:</strong> US1 + US14 — main.ejs para todo, auth-temp.ejs para login/register</li>
            </ul>
          </div>
        </Section>

        {/* ── 09: LIMITACIONES ── */}
        <Section num="09" title="Limitaciones Honestas de STP2" isLast={true}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 bg-amber-950/30 border border-amber-500/20 rounded-xl">
              <h4 className="text-amber-400 font-semibold mb-4">Lo que falta → STP3:</h4>
              <ul className="space-y-2 text-sm text-amber-200/80">
                <li>❌ No hay base de datos (SQLite en STP3)</li>
                <li>❌ Login/register son mock sin persistencia</li>
                <li>❌ Sesión es efímera (se pierde al reiniciar)</li>
                <li>❌ Stock existe en lógica pero no en todos los datos</li>
                <li>❌ Checkout es placeholder visual</li>
                <li>❌ No hay tests automatizados</li>
              </ul>
            </div>
            <div className="p-6 bg-emerald-950/30 border border-emerald-500/20 rounded-xl">
              <h4 className="text-emerald-400 font-semibold mb-4">Lo que STP2 SÍ logra:</h4>
              <ul className="space-y-2 text-sm text-emerald-200/80">
                <li>✅ MVC parcial pero consistente (routes→controllers→services→models)</li>
                <li>✅ Carrito funcional con sesión real</li>
                <li>✅ 400 + 404 + 500 con vistas dedicadas</li>
                <li>✅ 10 operaciones de catálogo en productsService</li>
                <li>✅ Validación dual frontend+backend (422)</li>
                <li>✅ Layout base compartido + Atomic Design</li>
                <li>✅ 19 User Stories cumplidas</li>
                <li>✅ Base lista para migrar a SQLite sin romper</li>
              </ul>
            </div>
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
        <span className="text-secondary">{num}.</span> {title}
      </h2>
      {children}
    </section>
  );
}

function USGroup({ title, items, color }) {
  const bgMap = { blue: 'bg-blue-950/30 border-blue-500/20', purple: 'bg-purple-950/30 border-purple-500/20', green: 'bg-emerald-950/30 border-emerald-500/20', amber: 'bg-amber-950/30 border-amber-500/20' };
  const textMap = { blue: 'text-blue-400', purple: 'text-purple-400', green: 'text-emerald-400', amber: 'text-amber-400' };
  return (
    <div className={`p-4 ${bgMap[color]} border rounded-xl`}>
      <h4 className={`${textMap[color]} font-semibold text-sm mb-2`}>{title}</h4>
      <ul className="text-xs text-textMuted space-y-1">
        {items.map((item, i) => <li key={i}>• {item}</li>)}
      </ul>
    </div>
  );
}
