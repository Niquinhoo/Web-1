import { useState } from 'react'
import TaskForm from '../../components/TaskForm'
import TaskList from '../../components/TaskList'
import { addTask, removeTask, toggleTask } from '../../tasks'

function TasksView() {
  const [tasks, setTasks] = useState([])

  const handleAdd = (label) => {
    if (!label.trim()) return false

    setTasks((currentTasks) => addTask(currentTasks, label))
    return true
  }

  return (
    <main className="todo-app" id="main-content">
      <header className="app-header">
        <div className="app-shell">
          <h1>LISTA DE TAREAS DE NICOLÁS</h1>
          <TaskForm onAdd={handleAdd} />
          <hr className="divider" />
        </div>
      </header>
      <section className="app-shell task-content" aria-label="Tareas">
        <TaskList
          tasks={tasks}
          onRemove={(id) => setTasks((currentTasks) => removeTask(currentTasks, id))}
          onToggle={(id) => setTasks((currentTasks) => toggleTask(currentTasks, id))}
        />
      </section>
    </main>
  )
}

export default TasksView
