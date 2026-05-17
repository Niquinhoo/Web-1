import Slide from '../components/Slide';
import CodeBlock from '../components/CodeBlock';

export default function CodeEvolutionSlide() {
  const stp1Code = `// STP1: data/db.js (Memoria Global)
const carrito = [
  { productId: 1, quantity: 2, price: 1500 },
];
// Problema: Global, hardcodeado, mismo para todos.
`;

  const stp2Code = `// STP2: app.js (Sesión introducida)
app.use(session({
  secret: 'mi-secreto',
  resave: false,
  saveUninitialized: true
}));

// cartService.js (Inicialización por usuario)
if (!req.session.cart) {
  req.session.cart = []; 
}
// Problema: Aún se guardaban precios en la sesión
// o no había una base real que los respaldara.
`;

  const stp3Code = `// STP3: cartService.js (Sesión + SQLite)
const getCartDetails = (sessionCart) => {
  // sessionCart = [{ productId: 1, quantity: 2 }]
  let total = 0;
  const items = sessionCart.map(item => {
    // La VERDAD sale de la base de datos, no de sesión
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(item.productId);
    
    total += product.price * item.quantity;
    return { ...product, quantity: item.quantity };
  });

  return { items, total };
};
// Logro: Sesión guarda lo mínimo. SQLite valida existencia y precio real.
`;

  return (
    <Slide className="justify-center">
      <h2 className="text-4xl font-bold mb-8 text-center">Evolución en Código: El Carrito</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[500px]">
        <div className="h-full transform transition-all hover:scale-[1.02]">
          <CodeBlock 
            title="STP1: Memoria Global" 
            code={stp1Code} 
            language="javascript" 
          />
        </div>
        <div className="h-full transform transition-all hover:scale-[1.02]">
          <CodeBlock 
            title="STP2: Estado por Sesión" 
            code={stp2Code} 
            language="javascript" 
          />
        </div>
        <div className="h-full transform transition-all hover:scale-[1.02]">
          <CodeBlock 
            title="STP3: Sesión + SQLite" 
            code={stp3Code} 
            language="javascript" 
          />
        </div>
      </div>
    </Slide>
  );
}
