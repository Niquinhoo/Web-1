import { useAuth } from '../hooks/useAuth'

export function Settings() {
  const { user, logout } = useAuth()
  const fullName = [user?.name?.first, user?.name?.last].filter(Boolean).join(' ')

  return (
    <section className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="mb-4 opacity-0 animate-fade-up">
        <p className="text-primary text-xs font-bold uppercase tracking-wider mb-1">Settings</p>
        <h1 className="text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight mb-2">Cuenta</h1>
        <p className="text-sm md:text-base text-on-surface-variant max-w-xl leading-relaxed">
          Datos del usuario autenticado y salida segura de tu espacio de trabajo.
        </p>
      </div>

      {/* Account Settings Card */}
      <article className="deep-card rounded-xl p-6 sm:p-8 max-w-xl w-full flex flex-col gap-6">
        <dl className="divide-y divide-outline-variant/10">
          <div className="py-4 flex items-center justify-between gap-4">
            <dt className="text-sm font-semibold text-on-surface-variant">Nombre</dt>
            <dd className="text-sm font-bold text-on-surface">{fullName || 'Sin nombre'}</dd>
          </div>
          <div className="py-4 flex items-center justify-between gap-4">
            <dt className="text-sm font-semibold text-on-surface-variant">Usuario</dt>
            <dd className="text-sm font-bold text-on-surface">{user?.username || 'Sin usuario'}</dd>
          </div>
          <div className="py-4 flex items-center justify-between gap-4">
            <dt className="text-sm font-semibold text-on-surface-variant">Email</dt>
            <dd className="text-sm font-bold text-on-surface truncate">{user?.email || 'Sin email'}</dd>
          </div>
        </dl>
        
        <div className="pt-4 border-t border-outline-variant/10">
          <button
            className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white font-bold px-6 py-3 rounded-full flex items-center justify-center hover:scale-[1.02] hover:shadow-lg transition-all duration-200 cursor-pointer active:scale-95 text-sm"
            type="button"
            onClick={logout}
          >
            Cerrar sesión
          </button>
        </div>
      </article>
    </section>
  )
}
