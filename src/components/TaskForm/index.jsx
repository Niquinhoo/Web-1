function TaskForm() {
  return (
    <form className="task-form">
      <label className="sr-only" htmlFor="new-task">
        Nueva tarea
      </label>
      <input id="new-task" name="new-task" type="text" />
      <button type="button">Agregar</button>
    </form>
  )
}

export default TaskForm
