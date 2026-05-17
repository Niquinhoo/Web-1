import Slide from '../components/Slide';
import { Layers, Map, Database, Layout, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function STP1Slide() {
  return (
    <Slide className="justify-center">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center h-full">
        <div>
          <span className="text-primary font-mono text-xl mb-4 block">Fase 1</span>
          <h2 className="text-5xl font-bold mb-6">STP1: La Fundación</h2>
          <p className="text-lg text-textMuted mb-8 leading-relaxed">
            STP1 establece la estructura base del proyecto Server-Side Render usando 
            <strong className="text-textMain"> Node.js, Express y EJS</strong>. No hay base de datos ni persistencia real, pero se define el esqueleto arquitectónico.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FeatureCard 
              icon={<Map className="text-blue-400" />}
              title="Ruteo Funcional"
              desc="app.js actúa como orquestador conectando vistas y páginas."
            />
            <FeatureCard 
              icon={<Database className="text-green-400" />}
              title="Dataset Compartido"
              desc="data/db.js centraliza la información evitando el hardcodeo."
            />
            <FeatureCard 
              icon={<Layers className="text-purple-400" />}
              title="Servicios Base"
              desc="product.service.js inicia la separación de la lógica."
            />
            <FeatureCard 
              icon={<Layout className="text-orange-400" />}
              title="Atomic Design"
              desc="Composición visual en templates, organismos y moléculas."
            />
          </div>
        </div>
        
        <div className="glass-panel p-8 h-[500px] flex flex-col justify-center">
          <h3 className="text-2xl font-semibold mb-6 border-b border-white/10 pb-4">Flujo Técnico STP1</h3>
          <div className="flex flex-col gap-4 text-sm font-mono text-textMuted bg-black/30 p-6 rounded-xl border border-white/5">
            <div className="flex items-center gap-4">
              <span className="text-primary">Cliente</span>
              <span>→</span>
              <span className="text-white">app.js</span>
            </div>
            <div className="flex items-center gap-4 ml-8">
              <span>↳</span>
              <span className="text-secondary">routes/*.js</span>
              <span>→</span>
              <span className="text-accent">services/*.js</span>
            </div>
            <div className="flex items-center gap-4 ml-16">
              <span>↳</span>
              <span className="text-orange-300">data/db.js (Mock)</span>
            </div>
            <div className="flex items-center gap-4 mt-4 text-green-400">
              <span>←</span>
              <span>Render EJS (Vistas preparadas)</span>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-blue-900/20 border border-blue-500/20 rounded-lg text-sm text-blue-200">
            <strong>Logro principal:</strong> Construir el flujo navegable (Home → Detalle → Carrito) usando datos reales del catálogo sin duplicar información.
          </div>
          
          <div className="mt-6 flex justify-end">
            <Link 
              to="/stp1" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-black font-semibold rounded-lg hover:bg-primary/90 transition-all hover:scale-105"
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
