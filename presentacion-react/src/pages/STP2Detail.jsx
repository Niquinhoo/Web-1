import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import TimelineItem from '../components/TimelineItem';

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
            Arquitectura MVC consolidada. Los Controllers actúan como capa HTTP delgada y los Services encapsulan la lógica pura. El Carrito comienza a persistir en sesión.
          </p>
        </header>

        <div className="space-y-4">
          <TimelineItem 
            date="Paso 1"
            title="Soporte para Sesiones"
            description="app.js incorpora express-session para mantener un carrito temporal individualizado por usuario, y un middleware global expone el conteo de ítems a todas las vistas."
            code={`// app.js (Fragmento)
app.use(session({
  secret: 'my-secret-key',
  resave: false,
  saveUninitialized: true
}));

app.use((req, res, next) => {
  const cart = req.session.cart || [];
  res.locals.cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  next();
});`}
          />

          <TimelineItem 
            date="Paso 2"
            title="Separación MVC: Controllers Delgados"
            description="La ruta HTTP ya no maneja los datos. Llama a un Controller, y este al Service. Esto permite separar las responsabilidades semánticamente (ej: manejar códigos 400 y 404)."
            code={`// controllers/productController.js
const productsService = require('../services/productsService');

const getProductDetail = (req, res) => {
  const result = productsService.getProductDetail(req.params.id);

  if (result.error === 'INVALID_ID') return res.status(400).render('pages/400/400-page');
  if (result.error === 'NOT_FOUND') return res.status(404).render('pages/404/404-page');

  res.render('pages/product/product-detail-page', {
    product: result.product,
    relatedProducts: result.relatedProducts
  });
};`}
          />

          <TimelineItem 
            date="Paso 3"
            title="El Truco del Carrito Temporal"
            description="La sesión no guarda precios ni objetos completos de producto. Sólo guarda el productId y la quantity. El cartService lo cruza con el modelo para asegurar datos y precios reales."
            code={`// services/cartService.js (Fragmento)
const getCartDetails = (sessionCart) => {
  const cartItems = sessionCart.map(cartItem => {
    // Busca el producto en la fuente de verdad (Mock Model por ahora)
    const product = productModel.productos.find(p => p.id === cartItem.productId);
    
    return {
      product,
      quantity: cartItem.quantity,
      subtotal: product.price * cartItem.quantity
    };
  });

  const total = cartItems.reduce((acc, item) => acc + item.subtotal, 0);
  return { cartItems, total };
};`}
          />

          <TimelineItem 
            date="Paso 4"
            title="Layout Base Centralizado"
            description="Se consolida views/layouts/main.ejs para no repetir HTML. Todas las páginas principales inyectan su contenido en un layout que tiene el Navbar y Footer ya configurados."
            code={`<!-- views/layouts/main.ejs -->
<!DOCTYPE html>
<html lang="es">
<head>
    <%- extraStyles || '' %>
</head>
<body>
    <%- include('../partials/organisms/home/navbar') %>
    
    <main>
        <%- include('../partials/pages/' + contentPartial, contentProps || {}) %>
    </main>

    <%- include('../partials/organisms/home/footer') %>
</body>
</html>`}
            isLast={true}
          />
        </div>
      </div>
    </div>
  );
}
