import { useState } from 'react'
import { fetchClient } from '../../api/client'
import { Spinner } from '../ui/Spinner'

export function TaskForm({ storyId, onSuccess, onCancel, onBusyChange }) {
  const [values, setValues] = useState({ name: '', description: '' })
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
    if (!values.name.trim()) nextErrors.name = 'Ingresá un nombre para la tarea'
    if (values.description.trim() && values.description.trim().length < 10) {
      nextErrors.description = 'La descripción debe tener al menos 10 caracteres'
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
    onBusyChange?.(true)
    try {
      await fetchClient('/tasks', {
        method: 'POST',
        body: JSON.stringify({
          name: values.name.trim(),
          description: values.description.trim(),
          story: storyId,
        }),
      })
      await onSuccess()
    } catch (error) {
      setApiError(error.message)
    } finally {
      setSubmitting(false)
      onBusyChange?.(false)
    }
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
      <fieldset className="flex flex-col gap-5" disabled={submitting}>
        <div className="flex flex-col gap-1.5">
          <label className="text-on-surface font-semibold text-sm" htmlFor="task-name">Nombre</label>
          <input
            id="task-name"
            name="name"
            value={values.name}
            onChange={updateField}
            className="w-full bg-surface-container border border-outline-variant/20 rounded-lg px-4 py-3 text-on-surface placeholder-outline-variant focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
            placeholder="Ej: escribir validaciones"
          />
          {errors.name ? <span className="text-red-400 text-xs font-medium mt-1">{errors.name}</span> : null}
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-on-surface font-semibold text-sm" htmlFor="task-description">Descripción</label>
          <textarea
            id="task-description"
            name="description"
            value={values.description}
            onChange={updateField}
            className="w-full bg-surface-container border border-outline-variant/20 rounded-lg px-4 py-3 text-on-surface placeholder-outline-variant focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm min-h-[100px] resize-y"
            placeholder="Opcional, mínimo 10 caracteres si la completás"
          />
          {errors.description ? (
            <span className="text-red-400 text-xs font-medium mt-1">{errors.description}</span>
          ) : null}
        </div>
        {apiError ? <p className="text-red-400 text-xs font-semibold text-center mt-1">{apiError}</p> : null}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline-variant/10">
          <button
            className="bg-transparent border border-outline-variant/30 hover:border-primary text-on-surface hover:text-primary text-xs font-semibold px-5 py-2.5 rounded-full hover:scale-[1.02] transition-all duration-200 cursor-pointer active:scale-95 disabled:opacity-50"
            type="button"
            onClick={onCancel}
            disabled={submitting}
          >
            Cancelar
          </button>
          <button 
            className="bg-primary hover:bg-primary/90 text-white text-xs font-semibold px-5 py-2.5 rounded-full hover:scale-[1.02] hover:shadow-lg transition-all duration-200 cursor-pointer active:scale-95 disabled:opacity-50 flex items-center justify-center gap-1.5"
            type="submit"
          >
            {submitting ? <Spinner size="small" /> : null}
            {submitting ? 'Creando tarea...' : 'Crear tarea'}
          </button>
        </div>
      </fieldset>
    </form>
  )
}
