import Slide from '../components/Slide';

export default function TitleSlide() {
  return (
    <Slide className="justify-center items-center text-center">
      <div className="glass-panel p-16 max-w-4xl w-full">
        <div className="mb-6 inline-block">
          <span className="px-4 py-1.5 rounded-full bg-primary/[0.08] text-primary text-sm font-semibold tracking-wider uppercase border border-primary/20">
            Defensa Final
          </span>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight font-display">
          Evolución del Proyecto <br />
          <span className="gradient-text">Web 1</span>
        </h1>
        <p className="text-xl md:text-2xl text-textMuted mb-8 max-w-2xl mx-auto leading-relaxed">
          Un análisis técnico del crecimiento de la aplicación a través de STP1, STP2 y STP3.
        </p>
        <p className="text-sm text-textMuted/60 mb-8 font-mono">
          Web 1 — TUDAI — 2025
        </p>
        
        <div className="flex justify-center gap-6">
          <div className="flex flex-col items-center p-4 rounded-xl bg-white border border-gray-200 w-32 shadow-sm">
            <span className="text-3xl font-bold text-primary mb-2">STP1</span>
            <span className="text-xs text-textMuted text-center">Fundación &<br/>Estructura</span>
          </div>
          <div className="flex flex-col items-center p-4 rounded-xl bg-white border border-gray-200 w-32 shadow-sm">
            <span className="text-3xl font-bold text-secondary mb-2">STP2</span>
            <span className="text-xs text-textMuted text-center">MVC &<br/>Sesiones</span>
          </div>
          <div className="flex flex-col items-center p-4 rounded-xl bg-white border border-gray-200 w-32 shadow-sm">
            <span className="text-3xl font-bold text-tertiary mb-2">STP3</span>
            <span className="text-xs text-textMuted text-center">SQLite &<br/>Persistencia</span>
          </div>
        </div>
      </div>
    </Slide>
  );
}
