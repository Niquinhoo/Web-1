import { DotsThree } from '@phosphor-icons/react'

export function Card({
  icon,
  title,
  subtitle,
  description,
  badge,
  onClick,
  children,
}) {
  const handleKeyDown = (event) => {
    if (!onClick) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onClick()
    }
  }

  return (
    <article
      className={`bg-[#151824] border border-outline-variant/20 rounded-[1.2rem] p-6 flex flex-col group transition-all duration-300 relative overflow-hidden ${
        onClick ? 'hover:-translate-y-[3px] hover:shadow-deep cursor-pointer' : ''
      }`}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={handleKeyDown}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <div className="flex items-start justify-between mb-4 relative z-10">
        {icon ? <span className="text-3xl" aria-hidden="true">{icon}</span> : <div />}
        {badge || (
          onClick && (
            <span className="text-outline group-hover:text-on-surface transition-colors">
              <DotsThree size={24} />
            </span>
          )
        )}
      </div>
      <div className="relative z-10 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg md:text-xl font-bold text-on-surface mb-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          {subtitle ? <p className="text-xs text-on-surface-variant font-medium mb-1">{subtitle}</p> : null}
          {description ? <p className="text-sm text-on-surface-variant line-clamp-2 leading-relaxed mb-4">{description}</p> : null}
        </div>
        {children}
      </div>
    </article>
  )
}
