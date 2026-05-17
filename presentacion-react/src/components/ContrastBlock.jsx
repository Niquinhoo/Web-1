import { ArrowRight } from 'lucide-react';

export default function ContrastBlock({ theory, practice }) {
  return (
    <div className="my-4 grid grid-cols-1 md:grid-cols-2 gap-3">
      <div className="p-4 bg-violet-950/30 border border-violet-500/20 rounded-xl">
        <span className="text-xs font-mono text-violet-400 uppercase tracking-wider block mb-2">📖 La Teoría Dice</span>
        <p className="text-sm text-violet-200/80 leading-relaxed">{theory}</p>
      </div>
      <div className="p-4 bg-emerald-950/30 border border-emerald-500/20 rounded-xl">
        <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider block mb-2">💻 Nuestro Código</span>
        <p className="text-sm text-emerald-200/80 leading-relaxed">{practice}</p>
      </div>
    </div>
  );
}
