import Slide from '../components/Slide';

export default function EvolutionSlide() {
  return (
    <Slide className="justify-center items-center">
      <h2 className="text-4xl font-bold mb-12 text-center">Evolución de la Arquitectura</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
        {/* STP1 */}
        <div className="glass-panel p-6 border-t-4 border-t-primary">
          <div className="text-primary font-mono text-xl mb-6 font-bold">STP1</div>
          
          <div className="space-y-4">
            <ArchitectureItem label="Rutas" value="Manejan lógica visual" />
            <ArchitectureItem label="Controladores" value="❌ No existen" />
            <ArchitectureItem label="Servicios" value="Incipientes" />
            <ArchitectureItem label="Persistencia" value="Mock Global (Memoria)" />
            <ArchitectureItem label="Carrito" value="Global y compartido" />
          </div>
        </div>

        {/* STP2 */}
        <div className="glass-panel p-6 border-t-4 border-t-secondary scale-105 shadow-2xl z-10">
          <div className="text-secondary font-mono text-xl mb-6 font-bold">STP2</div>
          
          <div className="space-y-4">
            <ArchitectureItem label="Rutas" value="Solo endpoints HTTP" />
            <ArchitectureItem label="Controladores" value="✅ Thin Wrappers" />
            <ArchitectureItem label="Servicios" value="✅ Encapsulan negocio" />
            <ArchitectureItem label="Persistencia" value="Mock en Modelos" />
            <ArchitectureItem label="Carrito" value="Individual (Sesión)" />
          </div>
        </div>

        {/* STP3 */}
        <div className="glass-panel p-6 border-t-4 border-t-accent">
          <div className="text-accent font-mono text-xl mb-6 font-bold">STP3</div>
          
          <div className="space-y-4">
            <ArchitectureItem label="Rutas" value="Totalmente limpias" />
            <ArchitectureItem label="Controladores" value="Delegan a servicios" />
            <ArchitectureItem label="Servicios" value="Consultas SQL" />
            <ArchitectureItem label="Persistencia" value="✅ SQLite Real" />
            <ArchitectureItem label="Carrito" value="Sesión (IDs) + SQL (Precios)" />
          </div>
        </div>
      </div>
    </Slide>
  );
}

function ArchitectureItem({ label, value }) {
  const isPositive = value.includes('✅');
  const isNegative = value.includes('❌');
  
  return (
    <div className="flex flex-col bg-black/20 p-3 rounded-lg border border-white/5">
      <span className="text-xs text-textMuted mb-1">{label}</span>
      <span className={`text-sm font-semibold ${isPositive ? 'text-green-400' : isNegative ? 'text-red-400' : 'text-white'}`}>
        {value}
      </span>
    </div>
  );
}
