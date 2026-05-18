import Slide from '../components/Slide';
import { Share2, Archive, AlertTriangle, Blocks, ArrowRight, Shield, Search, ListFilter } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function STP2Slide() {
  return (
    <Slide className="justify-center">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center h-full">
        <div className="order-2 lg:order-1 glass-panel p-8 h-[520px] flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-semibold mb-4 border-b border-gray-200 pb-3 text-textMain">Teoría ↔ Código</h3>
            <div className="space-y-3 text-sm">
              <TheoryLine concept="Patrón MVC" code="routes/ → controllers/ → services/ → models/" />
              <TheoryLine concept="Middleware de terceros" code="express-session para carrito por usuario" />
              <TheoryLine concept="Middleware a nivel app" code="Contador global cartItemCount en res.locals" />
              <TheoryLine concept="Middleware de error (4 params)" code="app.use((err,req,res,next)) para 500" />
              <TheoryLine concept="res.status(400/404/500)" code="3 códigos HTTP con vistas dedicadas" />
              <TheoryLine concept="req.body + validación" code="Register con 422 dual frontend+backend" />
            </div>
          </div>

          <div>
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg text-sm text-purple-800 mb-4">
              <strong>9 secciones</strong> — MVC, sesiones, controllers, services, rutas RESTful, errores HTTP, validación, 19 US integradas, limitaciones honestas.
            </div>
            <div className="flex justify-start">
              <Link
                to="/stp2"
                className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-white font-semibold rounded-xl hover:bg-secondary/90 transition-all hover:scale-105"
              >
                Ver análisis completo
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <span className="text-secondary font-mono text-xl mb-4 block">Fase 2</span>
          <h2 className="text-5xl font-bold mb-6 font-display">STP2: MVC y Sesiones</h2>
          <p className="text-lg text-textMuted mb-8 leading-relaxed">
            Consolidación <strong className="text-textMain">MVC</strong> con 
            <strong className="text-textMain"> controllers</strong>, 
            <strong className="text-textMain"> express-session</strong> para carrito,
            errores HTTP semánticos y <strong className="text-textMain">19 User Stories</strong>.
          </p>

          <div className="grid grid-cols-2 gap-3">
            <FeatureCard icon={<Share2 className="text-blue-600" />} title="Controllers" desc="Capa delgada HTTP que delega al service sin tocar datos." />
            <FeatureCard icon={<Blocks className="text-purple-600" />} title="10 Operaciones" desc="productsService con búsqueda, categorías, sort y normalización." />
            <FeatureCard icon={<Archive className="text-emerald-600" />} title="Sesión Real" desc="express-session con { productId, quantity } — precios al renderizar." />
            <FeatureCard icon={<AlertTriangle className="text-red-600" />} title="400/404/500" desc="Tres códigos HTTP con vistas EJS dedicadas." />
            <FeatureCard icon={<Shield className="text-amber-600" />} title="Validación 422" desc="Register con validación dual frontend + backend." />
            <FeatureCard icon={<Search className="text-cyan-600" />} title="19 US" desc="Todas cumplidas: catálogo, carrito, auth, errores, layout." />
          </div>
        </div>
      </div>
    </Slide>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="p-3 bg-white border border-gray-200 rounded-xl hover:border-gray-300 transition-colors shadow-sm">
      <div className="mb-2">{icon}</div>
      <h4 className="font-semibold text-textMain text-sm mb-1">{title}</h4>
      <p className="text-xs text-textMuted">{desc}</p>
    </div>
  );
}

function TheoryLine({ concept, code }) {
  return (
    <div className="flex items-start gap-3 text-textMuted">
      <span className="text-indigo-500 font-mono shrink-0">📖</span>
      <span className="text-indigo-700 font-medium shrink-0 w-52">{concept}</span>
      <span className="text-gray-300">→</span>
      <span className="text-emerald-700">{code}</span>
    </div>
  );
}
