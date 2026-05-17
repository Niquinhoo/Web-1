const express = require('express');
const path = require('path');

// Inicializamos la aplicación
const app = express();

// Definimos el puerto donde va a correr el servidor
const PORT = 3000;

// Configuramos EJS como nuestro motor de vistas (View Engine)
app.set('view engine', 'ejs');

// Le indicamos a express en qué carpeta están nuestras vistas
app.set('views', path.join(__dirname, 'views'));

// Servimos la carpeta 'styles' para que los archivos HTML/EJS puedan acceder a los CSS
app.use('/styles', express.static(path.join(__dirname, 'styles')));

// Servimos la carpeta 'assets' para que las imágenes puedan cargar
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Middleware para procesar datos de formularios (POST)
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Servir Favicon - Evita logs innecesarios de "Ruta no encontrada"
app.get('/favicon.ico', (req, res) => {
    res.sendFile(path.join(__dirname, 'assets', 'favicon.png'));
});

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

// Manejo de errores 404: 
// Solo redirigimos a /login si no es una petición de un recurso estático (css, js, imagenes)
app.use((req, res) => {
    const isAsset = req.url.startsWith('/styles') || req.url.startsWith('/assets') || req.url.includes('.');
    
    if (isAsset) {
        return res.status(404).send('Not Found');
    }

    console.log(`Página no encontrada: ${req.originalUrl}. Redirigiendo a /login`);
    res.redirect('/login');
});

// --- INICIO DEL SERVIDOR ---
// Ponemos a escuchar a la aplicación en el puerto asignado
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

