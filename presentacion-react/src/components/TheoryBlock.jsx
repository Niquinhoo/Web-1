import { BookOpen } from 'lucide-react';

export default function TheoryBlock({ title, children }) {
  return (
    <div className="my-4 p-5 bg-indigo-50 border border-indigo-200 rounded-xl">
      <div className="flex items-center gap-2 mb-3">
        <BookOpen className="w-4 h-4 text-indigo-600" />
        <span className="text-xs font-mono text-indigo-600 uppercase tracking-wider">Fundamento Teórico</span>
      </div>
      {title && <h4 className="text-sm font-semibold text-indigo-800 mb-2">{title}</h4>}
      <div className="text-sm text-indigo-700 leading-relaxed space-y-2">
        {children}
      </div>
    </div>
  );
}
