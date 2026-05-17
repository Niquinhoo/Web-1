import Slide from '../components/Slide';
import { Database, RefreshCw, Server, ShieldCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function STP3Slide() {
  return (
    <Slide className="justify-center">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center h-full">
        <div>
          <span className="text-accent font-mono text-xl mb-4 block">Fase 3</span>
          <h2 className="text-5xl font-bold mb-6">STP3: SQLite y Persistencia</h2>
          <p className="text-lg text-textMuted mb-8 leading-relaxed">
            El proyecto abandona los mocks en memoria e integra <strong className="text-white">SQLite</strong>. 
            El foco no está solo en guardar datos, sino en una arquitectura sólida de inicialización y migración.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FeatureCard 
              icon={<Database className="text-blue-400" />}
              title="Integración Real"
              desc="Esquema SQL con productos, categorías, usuarios y órdenes."
            />
            <FeatureCard 
              icon={<RefreshCw className="text-purple-400" />}
              title="Bootstrap Seguro"
              desc="Migración automática de tablas legacy y seed idempotente."
            />
            <FeatureCard 
              icon={<Server className="text-green-400" />}
              title="Carrito DB + Sesión"
              desc="Sesión guarda IDs, la DB provee el precio real."
            />
            <FeatureCard 
              icon={<ShieldCheck className="text-red-400" />}
              title="Validación Semántica"
              desc="Validación de formato y existencia del producto en base."
            />
          </div>
        </div>
        
        <div className="glass-panel p-8 h-[500px] flex flex-col justify-center">
          <h3 className="text-2xl font-semibold mb-6 border-b border-white/10 pb-4">El "Truco" de Bootstrap</h3>
          <p className="text-sm text-textMuted mb-4">
            El archivo <code className="text-accent bg-accent/10 px-1 rounded">db/bootstrap.js</code> no asume que la base está perfecta.
          </p>
          
          <div className="flex flex-col gap-3 text-sm">
            <Step number="1" text="Verifica si el esquema actual coincide con el esperado." />
            <Step number="2" text="Si es viejo, renombra la tabla (ej. users_legacy)." />
            <Step number="3" text="Crea la nueva tabla con la estructura correcta." />
            <Step number="4" text="Migra los datos desde legacy adaptando columnas." />
            <Step number="5" text="Realiza un seed inicial si la DB está vacía." />
          </div>

          <div className="mt-8 p-4 bg-green-900/20 border border-green-500/20 rounded-lg text-sm text-green-200">
            <strong>Impacto:</strong> Permite arranques seguros en múltiples entornos sin perder datos.
          </div>
          
          <div className="mt-6 flex justify-end">
            <Link 
              to="/stp3" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-black font-semibold rounded-lg hover:bg-accent/90 transition-all hover:scale-105"
            >
              Ver evolución y código
              <ArrowRight className="w-4 h-4" />
            </Link>
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

function Step({ number, text }) {
  return (
    <div className="flex items-start gap-3 bg-black/20 p-3 rounded-lg border border-white/5">
      <div className="w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center font-bold text-xs shrink-0">
        {number}
      </div>
      <span className="text-textMuted mt-0.5">{text}</span>
    </div>
  );
}
