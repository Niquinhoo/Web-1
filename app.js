// Importamos express para crear el servidor web
const express = require('express');

// Inicializamos la aplicación
const app = express();

// Definimos el puerto donde va a correr el servidor
const PORT = 3000;

// Configuramos EJS como nuestro motor de vistas (View Engine)
app.set('view engine', 'ejs');

// Le indicamos a express en qué carpeta están nuestras vistas
app.set('views', './views');

// Servimos la carpeta 'styles' para que los archivos HTML/EJS puedan acceder a los CSS
app.use('/styles', express.static('./public/styles'));

// Servimos la carpeta 'assets' para que las imágenes puedan cargar
app.use('/assets', express.static('./assets'));
app.use('/scripts', express.static('./public/scripts'));

// Middleware para procesar datos de formularios (POST)
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// --- IMPORTACIÓN DE RUTAS ---
const indexRouter = require('./routes/index.router');
const loginRouter = require('./routes/login.router');
const registerRouter = require('./routes/register.router');
const cartRouter = require('./routes/cart.router');
const checkoutRouter = require('./routes/checkout.router');
const accountRouter = require('./routes/account.router');
const productosRouter = require('./routes/productos.router');

// --- CONEXIÓN DE RUTAS (Endpoints) ---

// Ruta principal (Legacy index)
app.use('/', indexRouter);

// Rutas de Atomic Design
app.use('/index', indexRouter);
app.use('/home', indexRouter);

// Ruta de Iniciar Sesión (Login) - Maneja el acceso de usuarios
app.use('/login', loginRouter);

app.use('/register', registerRouter);
app.use('/cart', cartRouter);
app.use('/checkout', checkoutRouter);
app.use('/account', accountRouter);

// Rutas de Productos
app.use('/producto', productosRouter);

// Fallback: Manejador de error 404 (Páginas no encontradas)
app.use((req, res) => {
    console.log(`Ruta no encontrada: ${req.originalUrl}. Renderizando 404`);
    res.status(404).render('pages/404/404-page');
});

// --- INICIO DEL SERVIDOR ---
// Ponemos a escuchar a la aplicación en el puerto asignado
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

