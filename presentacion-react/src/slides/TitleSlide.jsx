import Slide from '../components/Slide';

export default function TitleSlide() {
  return (
    <Slide className="justify-center items-center text-center">
      <div className="glass-panel p-16 max-w-4xl w-full">
        <div className="mb-6 inline-block">
          <span className="px-4 py-1.5 rounded-full bg-primary/20 text-primary text-sm font-semibold tracking-wider uppercase border border-primary/30">
            Defensa Final
          </span>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
          Evolución del Proyecto <br />
          <span className="gradient-text">Web 1</span>
        </h1>
        <p className="text-xl md:text-2xl text-textMuted mb-12 max-w-2xl mx-auto leading-relaxed">
          Un análisis técnico del crecimiento de la aplicación a través de STP1, STP2 y STP3.
        </p>
        
        <div className="flex justify-center gap-6">
          <div className="flex flex-col items-center p-4 rounded-xl bg-surface/50 border border-white/5 w-32">
            <span className="text-3xl font-bold text-primary mb-2">STP1</span>
            <span className="text-xs text-textMuted text-center">Fundación &<br/>Estructura</span>
          </div>
          <div className="flex flex-col items-center p-4 rounded-xl bg-surface/50 border border-white/5 w-32">
            <span className="text-3xl font-bold text-secondary mb-2">STP2</span>
            <span className="text-xs text-textMuted text-center">MVC &<br/>Sesiones</span>
          </div>
          <div className="flex flex-col items-center p-4 rounded-xl bg-surface/50 border border-white/5 w-32">
            <span className="text-3xl font-bold text-accent mb-2">STP3</span>
            <span className="text-xs text-textMuted text-center">SQLite &<br/>Persistencia</span>
          </div>
        </div>
      </div>
    </Slide>
  );
}
