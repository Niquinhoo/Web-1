function TaskItem({ id, label, completed = false }) {
  return (
    <li className="task-item">
      <input id={id} type="checkbox" defaultChecked={completed} />
      <label htmlFor={id}>{label}</label>
      <button className="delete-button" type="button" aria-label={`Eliminar ${label}`}>
        <span className="trash-icon" aria-hidden="true" />
      </button>
    </li>
  )
}

export default TaskItem
