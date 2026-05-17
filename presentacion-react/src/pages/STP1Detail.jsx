import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import TimelineItem from '../components/TimelineItem';
import TheoryBlock from '../components/TheoryBlock';
import ContrastBlock from '../components/ContrastBlock';

export default function STP1Detail() {
  return (
    <div className="min-h-screen bg-background text-textMain p-8 md:p-16 relative overflow-x-hidden">
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] rounded-full bg-blue-500/5 blur-[120px]"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <Link to="/" className="inline-flex items-center text-primary hover:text-primary/80 mb-8 transition-colors">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Volver a la Presentación
        </Link>
        
        <header className="mb-16">
          <span className="text-primary font-mono text-xl mb-2 block">Fase 1</span>
          <h1 className="text-5xl font-bold mb-4">STP1: La Fundación</h1>
          <p className="text-xl text-textMuted">
            Server-Side Render con Node.js, Express y EJS — contrastado con la teoría de Arquitecturas Web, MVC, Rutas y Middlewares.
          </p>
        </header>

        {/* ── SECCIÓN 1: ARQUITECTURA MONOLÍTICA Y SSR ── */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-2 border-b border-white/10 pb-4">
            <span className="text-primary">01.</span> Arquitectura Monolítica y SSR
          </h2>
          <TheoryBlock title="¿Qué es un monolito?">
            <p>Según la documentación de la cátedra, una <strong>aplicación monolítica</strong> es un estilo arquitectónico donde: todo el código vive en un mismo proyecto, se ejecuta en un mismo servidor, comparte un mismo proceso y no está dividida en servicios independientes.</p>
            <p className="mt-2">Además, cuando el servidor arma el HTML completo y el navegador solo lo muestra, hablamos de <strong>Server-Side Rendering (SSR)</strong>. El ciclo es: el navegador envía una solicitud HTTP → el servidor la procesa → genera un HTML → el navegador lo renderiza.</p>
          </TheoryBlock>
          <ContrastBlock 
            theory="«Nuestras aplicaciones están completamente codificadas en una única solución, es decir una única base de código que no se conecta con ninguna otra aplicación» — Doc. Arquitecturas Web"
            practice="Nuestro proyecto Web-1 cumple exactamente esto: app.js, routes/, services/, data/ y views/ son una única base de código Express que genera HTML con EJS en el servidor y lo envía al navegador."
          />
        </section>

        {/* ── SECCIÓN 2: PUNTO DE ENTRADA ── */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-2 border-b border-white/10 pb-4">
            <span className="text-primary">02.</span> Punto de Entrada: app.js
          </h2>
          <TheoryBlock title="Configuración de Express con MVC">
            <p>La documentación indica que el archivo principal debe: crear el servidor Express, configurar EJS como motor de vistas, servir archivos estáticos desde una carpeta dedicada, y registrar las rutas delegándolas a controladores o routers.</p>
          </TheoryBlock>
          <div className="space-y-4 mt-6">
            <TimelineItem 
              date="app.js:10-14"
              title="Motor de vistas EJS"
              description={`La teoría dice: «Configuración de EJS: app.set("view engine", "ejs") y app.set("views", path.join(__dirname, "views"))». Nuestro código aplica exactamente este patrón para decirle a Express dónde buscar las plantillas.`}
              code={`// app.js — Líneas 10-14 (CÓDIGO REAL del proyecto)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));`}
            />
            <TimelineItem 
              date="app.js:16-24"
              title="Archivos estáticos y middlewares de parseo"
              description={`La teoría dice: «Express permite servir archivos estáticos a través de una carpeta dedicada usando app.use(express.static("public"))». También: «Express no hace un análisis automático del cuerpo de la petición — desde la versión 4.16.0 provee express.json() y express.urlencoded()».

Nuestro proyecto publica 'styles' y 'assets' como estáticos, y activa ambos middlewares para procesar formularios POST y datos JSON.`}
              code={`// app.js — Líneas 16-24 (CÓDIGO REAL)
// Archivos estáticos
app.use('/styles', express.static(path.join(__dirname, 'styles')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Middlewares de parseo (built-in)
app.use(express.urlencoded({ extended: false }));
app.use(express.json());`}
            />
            <TimelineItem 
              date="app.js:31-58"
              title="Conexión de rutas modularizadas"
              description={`La teoría dice: «Un Router no es más que un middleware que se encarga de trabajar con rutas. Podemos usar el módulo generado en nuestro archivo app.js y asociarlo con la ruta correspondiente usando app.use("/ruta", miRouter)».

Nuestro proyecto importa 7 routers y los conecta con app.use(), exactamente como indica la documentación.`}
              code={`// app.js — Líneas 31-58 (CÓDIGO REAL)
const indexRouter = require('./routes/index.router');
const loginRouter = require('./routes/login.router');
const productosRouter = require('./routes/productos.router');
const cartRouter = require('./routes/cart.router');
// ...más routers

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/producto', productosRouter);
app.use('/cart', cartRouter);`}
            />
          </div>
        </section>

        {/* ── SECCIÓN 3: SISTEMA DE RUTAS ── */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-2 border-b border-white/10 pb-4">
            <span className="text-primary">03.</span> Sistema de Rutas, Peticiones y Respuestas
          </h2>
          <TheoryBlock title="express.Router() y modularización">
            <p>La documentación explica: «Para crear un módulo de rutas, debemos crear un nuevo archivo, importar Express y crear una instancia de Router. Luego, en lugar de definir las rutas desde app, lo haremos desde router.»</p>
            <p className="mt-2">También: «Trabajar con rutas de forma modularizada nos permite definir rutas complejas en etapas y procesar cada segmento de ruta de una forma más ordenada y limpia.»</p>
          </TheoryBlock>

          <div className="space-y-4 mt-6">
            <TimelineItem 
              date="index.router.js"
              title="Ruta Home — GET con datos inyectados"
              description={`La teoría dice: «La función get() está diseñada para escuchar peticiones GET a la ruta especificada como primer parámetro y ejecutar la función callback como segundo parámetro. El objeto req contiene datos de la petición, y res la respuesta».

Nuestro index.router.js sigue este patrón: crea un Router, define GET '/', obtiene datos del service y los pasa a la vista con res.render().`}
              code={`// routes/index.router.js (CÓDIGO REAL COMPLETO)
const express = require('express');
const router = express.Router();
const { publicidades, categorias } = require('../data/db');
const { getAllProducts } = require('../services/product.service');

router.get('/', (req, res) => {
    const productos = getAllProducts();
    res.render('pages/home/home-page', { productos, publicidades, categorias });
});

module.exports = router;`}
            />

            <TimelineItem 
              date="productos.router.js"
              title="Ruta dinámica — Parámetros de URL"
              description={`La teoría dice: «Podemos configurar que cierta parte de la ruta sea dinámica usando dos puntos (:) como símbolo especial: app.get("/beers/:id", ...). El valor se captura en req.params.id».

Nuestro proyecto usa exactamente este patrón para /producto/:id. Si el producto existe, renderiza detalle + relacionados. Si no, muestra "not found" con sugeridos aleatorios.`}
              code={`// routes/productos.router.js (CÓDIGO REAL COMPLETO)
const express = require('express');
const router = express.Router();
const { categorias } = require('../data/db');
const {
    getProductById,
    getRelatedProducts,
    getRandomProducts
} = require('../services/product.service');

router.get('/:id', (req, res) => {
    const id = req.params.id;  // ← req.params como dice la teoría
    const producto = getProductById(id);

    if (producto) {
        const relatedProducts = getRelatedProducts(producto);
        res.render('pages/product/product-detail-page', 
          { producto, relatedProducts, categorias });
    } else {
        const randomProducts = getRandomProducts(4);
        res.render('pages/product/product-not-found-page', 
          { randomProducts, categorias });
    }
});`}
            />

            <TimelineItem 
              date="login.router.js"
              title="Peticiones con cuerpo — POST y req.body"
              description={`La teoría dice: «Peticiones que trabajan con el método POST suelen enviar datos a través del body. Cuando usamos el middleware urlencoded() o json(), se agrega un atributo body al objeto req para acceder al cuerpo de la petición».

Nuestro login.router.js maneja GET (renderiza formulario) y POST (lee req.body.email). El middleware express.urlencoded() configurado en app.js es lo que permite leer ese body.`}
              code={`// routes/login.router.js (CÓDIGO REAL)
router.get('/', (req, res) => {
    res.render('pages/login/login-page');
});

router.post('/', (req, res) => {
    console.log('Intento de Login:', req.body.email);
    // req.body funciona gracias a express.urlencoded()
    res.redirect('/home');
});`}
            />
          </div>

          <ContrastBlock 
            theory="«Cada ruta que definimos es la forma de decirle al servidor qué hacer cuando llega una petición con un método y URL determinados, y cómo construir la respuesta» — Doc. RPR"
            practice="En STP1 tenemos 7 routers que cubren: home, login, register, cart, checkout, account y productos. Cada uno define métodos HTTP específicos (GET/POST) y genera respuestas con res.render() o res.redirect()."
          />
        </section>

        {/* ── SECCIÓN 4: MIDDLEWARES ── */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-2 border-b border-white/10 pb-4">
            <span className="text-primary">04.</span> Middlewares en Acción
          </h2>
          <TheoryBlock title="¿Qué es un middleware?">
            <p>La documentación define: «Un middleware es una pieza de software que contiene funciones que se ejecutan durante el intervalo de tiempo que transcurre entre que el servidor recibe una petición y emite una respuesta. Estas funciones acceden a los objetos req y res, interceptando las peticiones y/o las respuestas.»</p>
            <p className="mt-2">Tipos: a nivel de aplicación, a nivel de rutas, built-in (json(), static()), de error (4 parámetros), y de terceros (npm).</p>
          </TheoryBlock>

          <div className="space-y-4 mt-6">
            <TimelineItem 
              date="app.js:16-24"
              title="Middlewares built-in que usamos"
              description={`La teoría categoriza estos como "middlewares incluidos (built-in) con Express":

• express.static() → sirve archivos estáticos (CSS, imágenes)
• express.urlencoded() → parsea bodies de formularios HTML
• express.json() → parsea bodies con Content-Type: application/json

Estos 3 están activos en nuestro app.js ANTES de las rutas, exactamente como indica la teoría: «debemos cargarlo en nuestra aplicación antes de cualquier definición de rutas».`}
              code={`// app.js — Middlewares built-in (CÓDIGO REAL)
app.use('/styles', express.static(path.join(__dirname, 'styles')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());`}
            />

            <TimelineItem 
              date="app.js:60-71"
              title="Middleware de fallback 404"
              description={`La teoría dice: «La forma correcta de manejar un 404 global en Express es agregar una última opción de rutas al final de todas nuestras rutas — un middleware que se ejecutará siempre que las rutas anteriores no coincidan con una previamente definida.»

Nuestro app.js tiene un fallback al final que redirige rutas inexistentes a /login. No es un 404 formal, pero cumple el principio de "red de contención" que la teoría describe.`}
              code={`// app.js — Líneas 60-71 (CÓDIGO REAL)
// Fallback: si ninguna ruta coincide
app.use((req, res) => {
    const isAsset = req.url.startsWith('/styles') 
      || req.url.startsWith('/assets') 
      || req.url.includes('.');
    
    if (isAsset) {
        return res.status(404).send('Not Found');
    }
    console.log(\`Página no encontrada: \${req.originalUrl}\`);
    res.redirect('/login');
});`}
            />
          </div>

          <ContrastBlock
            theory="«Express evalúa rutas en orden, y al no tener un path específico, el middleware coincide con cualquier petición que llegue hasta él, convirtiéndose en el último recurso» — Doc. Rutas"
            practice="Nuestro fallback distingue entre assets estáticos (devuelve 404 silencioso) y rutas de navegación (redirige a /login). Es un manejo básico pero funcional para STP1."
          />
        </section>

        {/* ── SECCIÓN 5: FUENTE DE DATOS ── */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-2 border-b border-white/10 pb-4">
            <span className="text-primary">05.</span> Fuente de Datos Compartida
          </h2>
          <TheoryBlock title="Del hardcode al modelo centralizado">
            <p>La documentación sobre datos explica: «Los archivos JSON no están diseñados para manejar múltiples operaciones, no garantizan integridad. En STP1, la capa de datos cumple el rol de una fuente compartida de verdad para todo el sistema».</p>
            <p className="mt-2">En el contexto MVC, nuestro data/db.js es un proto-modelo: «El modelo representa los datos y la lógica de negocio — en esta etapa, nuestros modelos serán simples archivos JavaScript que contienen funciones para manejar datos.»</p>
          </TheoryBlock>

          <div className="space-y-4 mt-6">
            <TimelineItem 
              date="data/db.js"
              title="Dataset centralizado — productos, categorías, carrito"
              description={`data/db.js exporta 4 colecciones que alimentan todo el proyecto:
• productos → 5 items con id, title, description, price, src, category
• publicidades → 2 banners para el hero de la home
• categorias → 9 categorías con name, icon y type
• carrito → array mock con productId y quantity

Esto evita duplicar hardcode entre Home, Detalle y Carrito.`}
              code={`// data/db.js (CÓDIGO REAL - fragmento)
const productos = [
    {
        id: '1',
        title: 'Burger Smash XL',
        description: 'Doble medallón de 120g...',
        price: 1200,
        src: '/assets/productos/hamburguesasmash.png',
        category: 'Alimentos'
    },
    // ...4 productos más
];

const carrito = [
    { productId: '1', quantity: 5 },
    { productId: '2', quantity: 1 },
    { productId: '3', quantity: 3 }
];

module.exports = { productos, publicidades, categorias, carrito };`}
            />
          </div>
        </section>

        {/* ── SECCIÓN 6: SERVICIOS ── */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-2 border-b border-white/10 pb-4">
            <span className="text-primary">06.</span> Servicios: Separación de Lógica
          </h2>
          <TheoryBlock title="Hacia el patrón MVC — Controlador y Modelo">
            <p>La documentación MVC define: «El Controlador recibe las solicitudes, coordina la lógica y decide qué vista mostrar. El Modelo representa los datos y la lógica de negocio.»</p>
            <p className="mt-2">En STP1 no hay controllers/ ni models/ formales, pero services/ ya cumple un rol intermedio: encapsula la lógica de negocio separándola de las rutas. Es el primer paso hacia la arquitectura que se completa en STP2.</p>
          </TheoryBlock>

          <div className="space-y-4 mt-6">
            <TimelineItem 
              date="product.service.js"
              title="Servicio de productos — 4 operaciones"
              description={`product.service.js expone funciones puras que operan sobre el dataset:
• getAllProducts() → retorna todo el catálogo
• getProductById(id) → busca con .find() comparando String
• getRelatedProducts(product) → filtra por categoría excluyendo el actual
• getRandomProducts(limit) → ordena aleatorio y corta

Esto es exactamente lo que la teoría describe como "lógica de negocio" separada.`}
              code={`// services/product.service.js (CÓDIGO REAL COMPLETO)
const { productos } = require('../data/db');

function getAllProducts() {
    return productos;
}

function getProductById(productId) {
    return productos.find(
      (product) => product.id === String(productId)
    );
}

function getRelatedProducts(product) {
    return productos.filter(
      (item) => item.category === product.category 
        && item.id !== product.id
    );
}

function getRandomProducts(limit = 4) {
    return [...productos]
        .sort(() => 0.5 - Math.random())
        .slice(0, limit);
}

module.exports = {
    getAllProducts, getProductById,
    getRelatedProducts, getRandomProducts
};`}
            />

            <TimelineItem 
              date="cart.service.js"
              title="Servicio de carrito — cálculos reales"
              description={`cart.service.js hace algo no trivial: cruza el carrito mock con los productos reales del catálogo.

• buildCartItem() → busca el producto por ID, calcula subtotal (unitPrice × quantity)
• getCartDetail() → mapea todos los items, filtra nulls, calcula totales

La teoría sobre servicios dice: «concentrar la lógica de negocio — calcular stock, validar reglas, coordinar operaciones». Nuestro cart.service.js ya hace exactamente eso con los cálculos del carrito.`}
              code={`// services/cart.service.js (CÓDIGO REAL COMPLETO)
const { carrito } = require('../data/db');
const { getProductById } = require('./product.service');

function buildCartItem(cartLine) {
    const product = getProductById(cartLine.productId);
    if (!product) return null;

    const quantity = Number(cartLine.quantity) || 0;
    const unitPrice = product.price;

    return {
        productId: product.id,
        title: product.title,
        description: product.description,
        category: product.category,
        src: product.src,
        quantity,
        unitPrice,
        subtotal: unitPrice * quantity
    };
}

function getCartDetail() {
    const items = carrito.map(buildCartItem).filter(Boolean);
    const subtotal = items.reduce(
      (acc, item) => acc + item.subtotal, 0);
    const totalItems = items.reduce(
      (acc, item) => acc + item.quantity, 0);

    return {
        items,
        summary: { subtotal, total: subtotal, totalItems }
    };
}`}
              isLast={true}
            />
          </div>

          <ContrastBlock
            theory="«Los controladores solo envían datos a las vistas. Los modelos encapsulan el acceso a los datos y exponen métodos claros como getAll(), getById(), create()» — Doc. MVC y Datos"
            practice="En STP1, nuestras rutas actúan como proto-controladores (reciben req, delegan al service, llaman res.render), y los services actúan como proto-modelos (getProductById, getRelatedProducts, getCartDetail)."
          />
        </section>

        {/* ── SECCIÓN 7: RESPUESTAS HTTP ── */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-2 border-b border-white/10 pb-4">
            <span className="text-primary">07.</span> Emitiendo Respuestas
          </h2>
          <TheoryBlock title="Métodos de respuesta en Express">
            <p>La documentación detalla: «El método send() envía hacía el cliente el contenido que le pasemos. Acepta un string, un array o un objeto. Si no enviamos una respuesta, el cliente se colgará esperando para siempre.»</p>
            <p className="mt-2">Otros métodos: res.status() para códigos de estado, res.json() para APIs REST, res.render() para vistas EJS, res.redirect() para redirecciones, res.sendFile() para archivos.</p>
          </TheoryBlock>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 bg-surface/40 border border-white/5 rounded-xl">
              <code className="text-primary text-sm">res.render()</code>
              <p className="text-xs text-textMuted mt-2">Usado en Home, Detalle, Cart, Login, Register para generar HTML con EJS</p>
            </div>
            <div className="p-5 bg-surface/40 border border-white/5 rounded-xl">
              <code className="text-secondary text-sm">res.redirect()</code>
              <p className="text-xs text-textMuted mt-2">Usado en POST login/register para redirigir a /home, y en el fallback para enviar a /login</p>
            </div>
            <div className="p-5 bg-surface/40 border border-white/5 rounded-xl">
              <code className="text-accent text-sm">res.sendFile()</code>
              <p className="text-xs text-textMuted mt-2">Usado para servir el favicon desde /assets/favicon.png</p>
            </div>
          </div>
        </section>

        {/* ── SECCIÓN 8: LIMITACIONES ── */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-2 border-b border-white/10 pb-4">
            <span className="text-primary">08.</span> Limitaciones Honestas de STP1
          </h2>
          <div className="p-6 bg-amber-950/30 border border-amber-500/20 rounded-xl">
            <h4 className="text-amber-400 font-semibold mb-4">Lo que falta y se resuelve en STP2/STP3:</h4>
            <ul className="space-y-2 text-sm text-amber-200/80">
              <li>❌ No hay base de datos → se agrega SQLite en STP3</li>
              <li>❌ No hay controllers/ formales → se introduce MVC completo en STP2</li>
              <li>❌ No hay autenticación real → login/register son mock</li>
              <li>❌ Carrito global, no por usuario ni sesión → express-session en STP2</li>
              <li>❌ No hay manejo 404/500 formal → solo redirect a /login</li>
              <li>❌ /checkout y /account existen como rutas pero sus vistas no</li>
              <li>❌ El buscador del navbar es solo visual, no funcional</li>
            </ul>
          </div>
          <div className="mt-6 p-6 bg-emerald-950/30 border border-emerald-500/20 rounded-xl">
            <h4 className="text-emerald-400 font-semibold mb-4">Lo que STP1 SÍ logra como fundación:</h4>
            <ul className="space-y-2 text-sm text-emerald-200/80">
              <li>✅ Estructura modularizada desde el inicio (rutas, servicios, datos, vistas, estilos)</li>
              <li>✅ Dataset compartido que evita hardcode repetido</li>
              <li>✅ Detalle de producto con comportamiento no trivial (fallback + relacionados)</li>
              <li>✅ Carrito con cálculos reales cruzando datos del catálogo</li>
              <li>✅ Composición visual con Atomic Design (templates, organismos, moléculas)</li>
              <li>✅ Flujo navegable completo: Home → Detalle → Carrito → Login/Register</li>
            </ul>
          </div>
        </section>

      </div>
    </div>
  );
}
