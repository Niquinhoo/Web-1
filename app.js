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
app.use('/styles', express.static('./styles'));

// Servimos la carpeta 'assets' para que las imágenes puedan cargar
app.use('/assets', express.static('./assets'));

// --- IMPORTACIÓN DE RUTAS ---
const indexRouter = require('./routes/index');
const homeRouter = require('./routes/home');
const loginRouter = require('./routes/login');
const registerRouter = require('./routes/register');
const cartRouter = require('./routes/cart');
const checkoutRouter = require('./routes/checkout');
const accountRouter = require('./routes/account');
const productosRouter = require('./routes/productos');

// --- CONEXIÓN DE RUTAS (Endpoints) ---

// Ruta principal (Legacy index)
app.use('/', indexRouter);

// Rutas de Atomic Design
app.use('/home', homeRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/cart', cartRouter);
app.use('/checkout', checkoutRouter);
app.use('/account', accountRouter);

// Rutas de Productos
app.use('/producto', productosRouter);


// --- INICIO DEL SERVIDOR ---
// Ponemos a escuchar a la aplicación en el puerto asignado
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
