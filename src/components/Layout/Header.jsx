import { ArrowLeft, List, User } from '@phosphor-icons/react'
import { useLocation, useNavigate } from 'react-router-dom'

const firstLevelTitles = {
  '/': 'Inicio',
  '/home': 'Inicio',
  '/my-projects': 'Mis proyectos',
  '/my-stories': 'Mis stories',
  '/settings': 'Configuración',
}

export function Header({ detailTitle, onMenuClick }) {
  const location = useLocation()
  const navigate = useNavigate()
  const isFirstLevel = Object.hasOwn(firstLevelTitles, location.pathname)
  const title = isFirstLevel
    ? firstLevelTitles[location.pathname]
    : detailTitle || 'Detalle'

  return (
    <header className="bg-surface-container/80 backdrop-blur-[20px] rounded-full mt-4 mx-margin-mobile md:mx-margin-desktop sticky top-4 border border-outline-variant/30 shadow-md flex justify-between items-center px-6 py-3 z-50">
      <div className="flex items-center gap-3">
        {isFirstLevel ? (
          <button
            className="md:hidden text-on-surface hover:text-primary transition-colors p-1 rounded-full hover:bg-surface-variant/50 cursor-pointer"
            type="button"
            aria-label="Abrir menú"
            onClick={onMenuClick}
          >
            <List size={24} weight="bold" />
          </button>
        ) : (
          <button
            className="text-on-surface hover:text-primary transition-colors p-1 rounded-full hover:bg-surface-variant/50 cursor-pointer"
            type="button"
            aria-label="Volver"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={24} weight="bold" />
          </button>
        )}
        <h1 className="text-lg md:text-xl font-bold text-on-surface tracking-tight">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <button
          className="text-on-surface-variant hover:text-primary hover:bg-surface-variant/50 transition-all duration-200 p-2 rounded-full active:scale-95 cursor-pointer"
          type="button"
          aria-label="Configuración de cuenta"
          onClick={() => navigate('/settings')}
        >
          <User size={20} weight="bold" />
        </button>
      </div>
    </header>
  )
}
