import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function CodeBlock({ code, language = 'javascript', title }) {
  return (
    <div className="rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-[#1e1e1e] flex flex-col h-full">
      {title && (
        <div className="bg-black/40 px-4 py-2 flex items-center border-b border-white/10">
          <div className="flex gap-2 mr-4">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <span className="text-xs text-textMuted font-mono">{title}</span>
        </div>
      )}
      <div className="flex-1 overflow-auto">
        <SyntaxHighlighter
          language={language}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: '1.5rem',
            background: 'transparent',
            fontSize: '0.85rem',
            lineHeight: '1.5'
          }}
          showLineNumbers={true}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
