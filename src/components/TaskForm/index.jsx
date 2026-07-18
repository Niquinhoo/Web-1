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
        onChange={(event) => setValue(event.target.value)}
      />
      <button type="button" onClick={handleAdd}>ADD</button>
    </div>
  )
}

export default TaskForm
