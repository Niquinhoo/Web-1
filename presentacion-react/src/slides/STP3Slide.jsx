import Slide from '../components/Slide';
import { Database, RefreshCw, Server, ShieldCheck, ArrowRight, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function STP3Slide() {
  return (
    <Slide className="justify-center">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center h-full">
        <div>
          <span className="text-tertiary font-mono text-xl mb-4 block">Fase 3</span>
          <h2 className="text-5xl font-bold mb-6 font-display">STP3: SQLite y Persistencia</h2>
          <p className="text-lg text-textMuted mb-8 leading-relaxed">
            De <strong className="text-textMain">arrays en memoria</strong> a
            <strong className="text-textMain"> better-sqlite3</strong> real.
            Schema SQL, transacciones ACID, bootstrap idempotente y
            <strong className="text-textMain"> 7 User Stories</strong>.
          </p>

          <div className="grid grid-cols-2 gap-3">
            <FeatureCard icon={<Database className="text-blue-600" />} title="5 Tablas SQL" desc="categories, products, users, orders, order_items con FOREIGN KEYs." />
            <FeatureCard icon={<RefreshCw className="text-purple-600" />} title="Bootstrap ACID" desc="Migración atómica de users_legacy + seed idempotente con transacciones." />
            <FeatureCard icon={<Server className="text-emerald-600" />} title="Carrito Híbrido" desc="Sesión guarda IDs, DB provee precios reales. Nunca confía en memoria." />
            <FeatureCard icon={<ShieldCheck className="text-red-600" />} title="normalizeId() + DB" desc="Valida formato (400) Y existencia en DB (404) en una sola función." />
            <FeatureCard icon={<Search className="text-cyan-600" />} title="SQL Real" desc="LIKE, ORDER BY RANDOM(), LOWER() — no más Array.filter()." />
            <FeatureCard icon={<Database className="text-amber-600" />} title="prepare()" desc="Statements precompilados con bound parameters (?). Seguro y eficiente." />
          </div>
        </div>

        <div className="glass-panel p-8 h-[520px] flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-semibold mb-4 border-b border-gray-200 pb-3 text-textMain">Teoría ↔ Código</h3>
            <div className="space-y-3 text-sm">
              <TheoryLine concept="better-sqlite3 síncrono" code="db.prepare('...').all() sin callbacks ni promesas" />
              <TheoryLine concept="CREATE TABLE IF NOT EXISTS" code="schema.sql con 5 tablas + FOREIGN KEYs" />
              <TheoryLine concept="db.transaction() ACID" code="Migración users_legacy atómica: todo o nada" />
              <TheoryLine concept="Bound parameters (?)" code="stmt.run(title, price) — nunca interpolación" />
              <TheoryLine concept="prepare() + get()/all()" code="Statement reusable, parseo una sola vez" />
              <TheoryLine concept="Capas con responsabilidades" code="routes → controllers → services(SQL) → DB" />
            </div>
          </div>

          <div>
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800 mb-4">
              <strong>9 secciones</strong> — SQLite, schema, bootstrap ACID, productsService SQL, carrito híbrido, catalogService, arquitectura por capas, 7 US, evolución STP1→STP3.
            </div>
            <div className="flex justify-end">
              <Link
                to="/stp3"
                className="inline-flex items-center gap-2 px-6 py-3 bg-tertiary text-white font-semibold rounded-xl hover:bg-tertiary/90 transition-all hover:scale-105"
              >
                Ver evolución y código
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
