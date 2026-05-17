import Slide from '../components/Slide';
import { Share2, Archive, AlertTriangle, Blocks, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function STP2Slide() {
  return (
    <Slide className="justify-center">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center h-full">
        <div className="order-2 lg:order-1 glass-panel p-8 h-[500px] flex flex-col justify-center">
          <h3 className="text-2xl font-semibold mb-6 border-b border-white/10 pb-4">Carrito con Sesión</h3>
          
          <div className="bg-black/30 p-5 rounded-xl border border-white/5 mb-6">
            <p className="text-sm text-textMuted mb-4">
              En STP2, el carrito deja de ser global y se asocia a la sesión del usuario (`express-session`). 
              <strong className="text-white block mt-2">La sesión almacena lo mínimo:</strong>
            </p>
            <div className="font-mono text-xs bg-black/50 p-3 rounded text-accent">
              req.session.cart = [<br/>
              &nbsp;&nbsp;{'{'} productId: 12, quantity: 2 {'}'},<br/>
              &nbsp;&nbsp;{'{'} productId: 5, quantity: 1 {'}'}<br/>
              ]
            </div>
            <p className="text-sm text-textMuted mt-4">
              El <span className="text-secondary">cartService</span> cruza estos IDs con los datos reales para asegurar precios correctos al renderizar.
            </p>
          </div>
          
          <div className="mt-6 flex justify-start">
            <Link 
              to="/stp2" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-black font-semibold rounded-lg hover:bg-secondary/90 transition-all hover:scale-105"
            >
              Ver evolución y código
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <span className="text-secondary font-mono text-xl mb-4 block">Fase 2</span>
          <h2 className="text-5xl font-bold mb-6">STP2: MVC y Sesiones</h2>
          <p className="text-lg text-textMuted mb-8 leading-relaxed">
            Se consolida la arquitectura MVC. La lógica de negocio abandona las rutas y se encapsula 
            completamente en <strong className="text-white">Services</strong>, expuestos a través de <strong className="text-white">Controllers</strong>.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FeatureCard 
              icon={<Share2 className="text-blue-400" />}
              title="Controladores"
              desc="Capa delgada que recibe la petición HTTP y delega en el servicio."
            />
            <FeatureCard 
              icon={<Blocks className="text-purple-400" />}
              title="Lógica Aislada"
              desc="Servicios manejan filtrado, ordenamiento y cruce de datos."
            />
            <FeatureCard 
              icon={<Archive className="text-green-400" />}
              title="Estado Temporal"
              desc="express-session permite un carrito individual por usuario."
            />
            <FeatureCard 
              icon={<AlertTriangle className="text-red-400" />}
              title="Manejo de Errores"
              desc="Diferenciación real entre errores 400 (Bad Request) y 404."
            />
          </div>
        </div>
      </div>
    </Slide>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="p-4 bg-surface/40 border border-white/5 rounded-xl hover:bg-surface/60 transition-colors">
      <div className="mb-3">{icon}</div>
      <h4 className="font-semibold text-white mb-1">{title}</h4>
      <p className="text-xs text-textMuted">{desc}</p>
    </div>
  );
}
