import TaskItem from '../TaskItem'

function TaskList({ tasks, onRemove, onToggle }) {
  if (!tasks.length) return <p className="empty-message">No hay tareas en la lista.</p>

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem key={task.id} {...task} onRemove={onRemove} onToggle={onToggle} />
      ))}
    </ul>
  )
}

export default TaskList
