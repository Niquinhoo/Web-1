import Slide from '../components/Slide';
import { Layers, Map, Database, Layout, ArrowRight, Server, GitBranch, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function STP1Slide() {
  return (
    <Slide className="justify-center">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center h-full">
        <div>
          <span className="text-primary font-mono text-xl mb-4 block">Fase 1</span>
          <h2 className="text-5xl font-bold mb-6">STP1: La Fundación</h2>
          <p className="text-lg text-textMuted mb-8 leading-relaxed">
            Aplicación <strong className="text-textMain">monolítica SSR</strong> con 
            <strong className="text-textMain"> Node.js, Express y EJS</strong>. 
            Contrastada con la teoría de Arquitecturas Web, MVC, Rutas HTTP y Middlewares.
          </p>
          
          <div className="grid grid-cols-2 gap-3">
            <FeatureCard 
              icon={<Server className="text-cyan-400" />}
              title="Monolito SSR"
              desc="Arquitectura monolítica con Server-Side Rendering — el servidor genera el HTML completo."
            />
            <FeatureCard 
              icon={<GitBranch className="text-blue-400" />}
              title="7 Routers"
              desc="Sistema de rutas modularizado con express.Router() según la documentación."
            />
            <FeatureCard 
              icon={<Database className="text-green-400" />}
              title="Dataset Central"
              desc="data/db.js como proto-modelo: centraliza productos, categorías y carrito."
            />
            <FeatureCard 
              icon={<Layers className="text-purple-400" />}
              title="Services"
              desc="Separación de lógica con product.service.js y cart.service.js — proto-MVC."
            />
            <FeatureCard 
              icon={<Shield className="text-amber-400" />}
              title="3 Middlewares"
              desc="express.static(), express.urlencoded(), express.json() — built-in según teoría."
            />
            <FeatureCard 
              icon={<Layout className="text-orange-400" />}
              title="Atomic Design"
              desc="Composición visual en templates, organismos y moléculas con EJS partials."
            />
          </div>
        </div>
        
        <div className="glass-panel p-8 h-[520px] flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-semibold mb-4 border-b border-white/10 pb-3">Teoría ↔ Código</h3>
            <div className="space-y-3 text-sm">
              <TheoryLine 
                concept="Aplicación monolítica" 
                code="Todo vive en un solo proyecto Express"
              />
              <TheoryLine 
                concept="SSR (Server-Side Rendering)" 
                code="EJS genera HTML en el servidor → navegador solo muestra"
              />
              <TheoryLine 
                concept="express.Router()" 
                code="7 archivos en routes/ modularizados con app.use()"
              />
              <TheoryLine 
                concept="req.params / req.body" 
                code="/producto/:id y POST /login con req.body.email"
              />
              <TheoryLine 
                concept="res.render() / res.redirect()" 
                code="Genera vistas EJS o redirige tras login/register"
              />
              <TheoryLine 
                concept="Middlewares built-in" 
                code="static(), urlencoded(), json() antes de las rutas"
              />
            </div>
          </div>
          
          <div>
            <div className="p-3 bg-blue-900/20 border border-blue-500/20 rounded-lg text-sm text-blue-200 mb-4">
              <strong>8 secciones de análisis</strong> con código real del proyecto contrastado contra la documentación teórica de la cátedra.
            </div>
            
            <div className="flex justify-end">
              <Link 
                to="/stp1" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-black font-semibold rounded-lg hover:bg-primary/90 transition-all hover:scale-105"
              >
                Ver análisis completo
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Slide>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="p-3 bg-surface/40 border border-white/5 rounded-xl hover:bg-surface/60 transition-colors">
      <div className="mb-2">{icon}</div>
      <h4 className="font-semibold text-white text-sm mb-1">{title}</h4>
      <p className="text-xs text-textMuted">{desc}</p>
    </div>
  );
}

function TheoryLine({ concept, code }) {
  return (
    <div className="flex items-start gap-3 text-textMuted">
      <span className="text-indigo-400 font-mono shrink-0">📖</span>
      <span className="text-indigo-300 font-medium shrink-0 w-48">{concept}</span>
      <span className="text-white/50">→</span>
      <span className="text-emerald-300/80">{code}</span>
    </div>
  );
}
