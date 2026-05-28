const labels = {
  todo: 'Por hacer',
  running: 'En curso',
  done: 'Completado',
}

export function StatusBadge({ status = 'todo' }) {
  const normalized = labels[status] ? status : 'todo'

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
        normalized === 'done'
          ? 'bg-green-500/15 border border-green-500/20 text-green-400'
          : normalized === 'running'
            ? 'bg-tertiary/15 border border-tertiary/20 text-tertiary'
            : 'bg-surface-variant/50 border border-outline-variant/30 text-on-surface-variant'
      }`}
    >
      {normalized === 'running' ? (
        <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse shadow-[0_0_8px_rgba(231,195,101,0.6)]" />
      ) : normalized === 'done' ? (
        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
      ) : (
        <span className="w-1.5 h-1.5 rounded-full bg-outline" />
      )}
      {labels[normalized]}
    </span>
  )
}
