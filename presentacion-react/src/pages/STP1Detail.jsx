import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import TimelineItem from '../components/TimelineItem';

export default function STP1Detail() {
  return (
    <div className="min-h-screen bg-background text-textMain p-8 md:p-16 relative overflow-x-hidden">
      {/* Background decorations */}
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
            Server-Side Render con Node.js, Express y EJS. Estructura inicial, navegación principal, dataset compartido y pantallas base.
          </p>
        </header>

        <div className="space-y-4">
          <TimelineItem 
            date="Paso 1"
            title="Punto de Entrada: app.js"
            description="Configura Express, activa EJS como motor de vistas, publica los estáticos, y conecta las rutas. Aún no hay manejo formal de sesiones ni errores globales, pero separa correctamente el servidor de la lógica."
            code={`// app.js (Fragmento)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.use('/', indexRouter);
app.use('/productos', productosRouter);
app.use('/cart', cartRouter);
app.use('/login', loginRouter);`}
          />

          <TimelineItem 
            date="Paso 2"
            title="Fuente de Datos Compartida"
            description="Toda la información vive en un archivo local data/db.js. Esto es clave porque evita duplicar datos hardcodeados entre la Home, el Detalle y el Carrito."
            code={`// data/db.js (Fragmento)
const productos = [
  { id: 1, description: 'Hamburguesa Clasica', price: 5000, category: 'hamburguesas' },
  // ...
];
const carrito = [
  { productId: 1, quantity: 2 }
];

module.exports = { productos, carrito };`}
          />

          <TimelineItem 
            date="Paso 3"
            title="El Nacimiento de los Servicios"
            description="Incluso sin base de datos, extrajimos la lógica de productos a services/product.service.js. Esto centraliza la búsqueda por ID, sugerencias aleatorias y relacionados."
            code={`// services/product.service.js
const { productos } = require('../data/db');

const getProductById = (id) => productos.find(p => p.id === Number(id));

const getRelatedProducts = (category, currentId) => {
  return productos.filter(p => p.category === category && p.id !== currentId).slice(0, 4);
};`}
          />

          <TimelineItem 
            date="Paso 4"
            title="Flujo Funcional del Detalle"
            description="La ruta dinámica /producto/:id usa los servicios y renderiza EJS. Si no existe, muestra una vista de 'not found' con sugerencias."
            code={`// routes/productos.router.js
router.get('/:id', (req, res) => {
  const producto = productService.getProductById(req.params.id);
  
  if (producto) {
    const relacionados = productService.getRelatedProducts(producto.category, producto.id);
    res.render('pages/product/product-detail-page', { producto, relacionados });
  } else {
    const sugerencias = productService.getRandomProducts(4);
    res.render('pages/product/product-not-found-page', { sugerencias });
  }
});`}
            isLast={true}
          />
        </div>
      </div>
    </div>
  );
}
