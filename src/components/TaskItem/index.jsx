function TaskItem({ id, label, completed, onRemove, onToggle }) {
  return (
    <li className="task-item">
      <input id={id} type="checkbox" checked={completed} onChange={() => onToggle(id)} />
      <label htmlFor={id}>{label}</label>
      <button
        className="delete-button"
        type="button"
        aria-label={`Eliminar ${label}`}
        onClick={() => onRemove(id)}
      >
        <span className="trash-icon" aria-hidden="true" />
      </button>
    </li>
  )
}

export default TaskItem
