import { ArrowRight } from 'lucide-react';

export default function ContrastBlock({ theory, practice }) {
  return (
    <div className="my-4 grid grid-cols-1 md:grid-cols-2 gap-3">
      <div className="p-4 bg-violet-50 border border-violet-200 rounded-xl">
        <span className="text-xs font-mono text-violet-600 uppercase tracking-wider block mb-2">📖 La Teoría Dice</span>
        <p className="text-sm text-violet-700 leading-relaxed">{theory}</p>
      </div>
      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
        <span className="text-xs font-mono text-emerald-600 uppercase tracking-wider block mb-2">💻 Nuestro Código</span>
        <p className="text-sm text-emerald-700 leading-relaxed">{practice}</p>
      </div>
    </div>
  );
}
