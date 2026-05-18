import { motion } from 'framer-motion';

export default function TimelineItem({ date, title, description, code, language = 'javascript', isLast = false }) {
  return (
    <div className="flex relative">
      {!isLast && (
        <div className="absolute top-8 bottom-0 left-6 w-0.5 bg-gradient-to-b from-primary/50 to-transparent -ml-[1px]" />
      )}
      
      <div className="relative mr-8 mt-2">
        <div className="w-12 h-12 rounded-full bg-white border-2 border-primary flex items-center justify-center z-10 shadow-md">
          <div className="w-4 h-4 rounded-full bg-primary" />
        </div>
      </div>
      
      <div className="pb-16 flex-1">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="glass-panel p-8"
        >
          <span className="text-sm font-mono text-primary mb-2 block">{date}</span>
          <h3 className="text-2xl font-bold mb-4">{title}</h3>
          <p className="text-textMuted mb-6 leading-relaxed whitespace-pre-line">{description}</p>
          
          {code && (
            <div className="rounded-xl overflow-hidden border border-gray-700 bg-gray-900">
              <div className="bg-gray-800 px-4 py-2 text-xs font-mono text-gray-400 border-b border-gray-700 flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
              </div>
              <pre className="p-4 overflow-x-auto text-sm font-mono text-blue-300">
                <code>{code}</code>
              </pre>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
