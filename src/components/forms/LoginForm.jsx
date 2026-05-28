import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { Spinner } from '../ui/Spinner'

export function LoginForm({ onSuccess }) {
  const { login } = useAuth()
  const [values, setValues] = useState({ username: 'nicolas', password: 'nicolas1234' })
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const updateField = (event) => {
    setValues((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }))
  }

  const validate = () => {
    const nextErrors = {}
    if (!values.username.trim()) nextErrors.username = 'Ingresá tu usuario'
    if (values.username.trim() && values.username.trim().length < 4) {
      nextErrors.username = 'El usuario debe tener al menos 4 caracteres'
    }
    if (!values.password) nextErrors.password = 'Ingresá tu contraseña'
    if (values.password && values.password.length < 4) {
      nextErrors.password = 'La contraseña debe tener al menos 4 caracteres'
    }
    return nextErrors
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)
    setApiError(null)

    if (Object.keys(nextErrors).length) return

    setSubmitting(true)
    try {
      await login(values.username.trim(), values.password)
      onSuccess()
    } catch (error) {
      setApiError(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="deep-card rounded-xl p-8 max-w-md w-full flex flex-col gap-6" onSubmit={handleSubmit} noValidate>
      <div>
        <p className="text-primary text-xs font-bold uppercase tracking-wider mb-1">Task Tracker</p>
        <h1 className="text-3xl font-extrabold tracking-tight text-on-surface mb-2">Entrá a tu espacio</h1>
        <p className="text-on-surface-variant text-sm leading-relaxed">Proyectos, épicas, stories y tareas en una sola SPA.</p>
      </div>

      <fieldset className="flex flex-col gap-5" disabled={submitting}>
        <div className="flex flex-col gap-1.5">
          <label className="text-on-surface font-semibold text-sm" htmlFor="username">Usuario</label>
          <input
            id="username"
            name="username"
            autoComplete="username"
            value={values.username}
            onChange={updateField}
            className="w-full bg-surface-container border border-outline-variant/20 rounded-lg px-4 py-3 text-on-surface placeholder-outline-variant focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
            placeholder="tu usuario"
          />
          {errors.username ? <span className="text-red-400 text-xs font-medium mt-1">{errors.username}</span> : null}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-on-surface font-semibold text-sm" htmlFor="password">Contraseña</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={values.password}
            onChange={updateField}
            className="w-full bg-surface-container border border-outline-variant/20 rounded-lg px-4 py-3 text-on-surface placeholder-outline-variant focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
            placeholder="mínimo 4 caracteres"
          />
          {errors.password ? <span className="text-red-400 text-xs font-medium mt-1">{errors.password}</span> : null}
        </div>

        {apiError ? <p className="text-red-400 text-xs font-semibold text-center mt-1">{apiError}</p> : null}

        <button
          className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 rounded-full flex items-center justify-center gap-2 hover:scale-[1.02] hover:shadow-lg transition-all duration-200 cursor-pointer active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed text-sm"
          type="submit"
        >
          {submitting ? <Spinner size="small" /> : null}
          {submitting ? 'Ingresando...' : 'Ingresar'}
        </button>
      </fieldset>
    </form>
  )
}
