import { CircleDashed } from '@phosphor-icons/react'

export function EmptyState({ message }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 rounded-xl border border-dashed border-outline-variant/30 bg-surface-container-lowest/50 text-center relative overflow-hidden">
      <div className="w-16 h-16 rounded-full bg-surface-variant/30 flex items-center justify-center mb-4 relative" aria-hidden="true">
        <div className="absolute inset-0 rounded-full border border-primary/20 animate-[spin_6s_linear_infinite]" />
        <CircleDashed size={30} className="text-primary opacity-80" />
      </div>
      <p className="text-sm font-semibold text-on-surface-variant max-w-sm leading-relaxed">{message}</p>
    </div>
  )
}
