import TaskForm from '../../components/TaskForm'
import TaskList from '../../components/TaskList'

const tasks = [
  { id: 'task-n', label: 'Tarea N' },
  { id: 'task-n-1', label: 'Tarea N-1' },
  { id: 'task-n-2', label: 'Completada Tarea N-2', completed: true },
  { id: 'task-k', label: 'Tarea K' },
  { id: 'task-2', label: 'Tarea 2' },
  { id: 'task-1', label: 'Completada Tarea 1', completed: true },
]

function TasksView() {
  return (
    <main className="todo-app">
      <h1>LISTA DE TAREAS DE NICOLÁS</h1>
      <TaskForm />
      <TaskList tasks={tasks} />
    </main>
  )
}

export default TasksView
