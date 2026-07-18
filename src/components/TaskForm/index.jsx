import { useState } from 'react'

function TaskForm({ onAdd }) {
  const [value, setValue] = useState('')

  const handleAdd = () => {
    if (onAdd(value)) setValue('')
  }

  return (
    <div className="task-form">
      <label className="sr-only" htmlFor="new-task">
        Nueva tarea
      </label>
      <input
        id="new-task"
        name="new-task"
        type="text"
        value={value}
        placeholder="Escribe una tarea…"
        onChange={(event) => setValue(event.target.value)}
      />
      <button
        className="add-button"
        type="button"
        aria-label="Agregar tarea"
        onClick={handleAdd}
      >
        <span aria-hidden="true">✓</span>
      </button>
    </div>
  )
}

export default TaskForm
