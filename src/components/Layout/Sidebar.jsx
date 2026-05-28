import { House, Folder, BookOpen, Gear, X } from '@phosphor-icons/react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const links = [
  { to: '/', label: 'Inicio', icon: House },
  { to: '/my-projects', label: 'Mis proyectos', icon: Folder },
  { to: '/my-stories', label: 'Mis stories', icon: BookOpen },
]

export function Sidebar({ isOpen, onClose }) {
  const { user } = useAuth()
  const userInitials = user
    ? [user.name?.first?.[0], user.name?.last?.[0]].filter(Boolean).join('') || user.username?.substring(0, 2).toUpperCase() || 'U'
    : 'U'
  const userFullName = user
    ? [user.name?.first, user.name?.last].filter(Boolean).join(' ') || user.username
    : 'Usuario'

  return (
    <>
      {/* Mobile Drawer Overlay */}
      <div
        className={`md:hidden fixed inset-0 bg-black/60 z-[55] transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Navigation Drawer */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-[280px] bg-surface-container-lowest border-r border-outline-variant/10 shadow-2xl z-[60] flex flex-col py-8 px-4 transition-transform duration-300 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-hidden={!isOpen}
      >
        {/* Mobile Close Button */}
        <button
          className="md:hidden absolute top-4 right-4 text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/50 transition-all duration-200 p-1.5 rounded-full active:scale-95"
          type="button"
          aria-label="Cerrar menú"
          onClick={onClose}
        >
          <X size={18} weight="bold" />
        </button>

        {/* Brand / User Header */}
        <div className="mb-12 px-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-semibold text-lg uppercase">
            {userInitials}
          </div>
          <div className="min-w-0">
            <h2 className="text-on-surface font-semibold text-base truncate">{userFullName}</h2>
            <p className="text-on-surface-variant text-xs font-medium tracking-wide">Foco de productividad</p>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="flex flex-col gap-2 flex-1" aria-label="Navegación principal">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'text-primary font-bold border-r-4 border-primary bg-surface-container-high translate-x-1'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
                }`
              }
              end={to === '/'}
            >
              {({ isActive }) => (
                <>
                  <Icon size={20} weight={isActive ? 'fill' : 'regular'} />
                  <span className="text-sm font-semibold tracking-wide">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer Navigation */}
        <div className="mt-auto flex flex-col gap-2 border-t border-outline-variant/10 pt-4">
          <NavLink
            to="/settings"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'text-primary font-bold border-r-4 border-primary bg-surface-container-high translate-x-1'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Gear size={20} weight={isActive ? 'fill' : 'regular'} />
                <span className="text-sm font-semibold tracking-wide">Configuración</span>
              </>
            )}
          </NavLink>
        </div>
      </aside>
    </>
  )
}
