import './App.css'

function App() {
  return (
    <main className="todo-app">
      <h1>LISTA DE TAREAS DE NICOLAS</h1>

      <form className="task-form">
        <label className="sr-only" htmlFor="new-task">
          Nueva tarea
        </label>
        <input id="new-task" name="new-task" type="text" />
        <button type="button">Agregar</button>
      </form>

      <ul className="task-list">
        <li className="task-item">
          <input id="task-n" type="checkbox" />
          <label htmlFor="task-n">Tarea N</label>
          <button className="delete-button" type="button" aria-label="Eliminar Tarea N">
            <span className="trash-icon" aria-hidden="true" />
          </button>
        </li>

        <li className="task-item">
          <input id="task-n-1" type="checkbox" />
          <label htmlFor="task-n-1">Tarea N-1</label>
          <button className="delete-button" type="button" aria-label="Eliminar Tarea N-1">
            <span className="trash-icon" aria-hidden="true" />
          </button>
        </li>

        <li className="task-item">
          <input id="task-n-2" type="checkbox" defaultChecked />
          <label htmlFor="task-n-2">Completada Tarea N-2</label>
          <button className="delete-button" type="button" aria-label="Eliminar Completada Tarea N-2">
            <span className="trash-icon" aria-hidden="true" />
          </button>
        </li>

        <li className="task-item">
          <input id="task-k" type="checkbox" />
          <label htmlFor="task-k">Tarea K</label>
          <button className="delete-button" type="button" aria-label="Eliminar Tarea K">
            <span className="trash-icon" aria-hidden="true" />
          </button>
        </li>

        <li className="task-item">
          <input id="task-2" type="checkbox" />
          <label htmlFor="task-2">Tarea 2</label>
          <button className="delete-button" type="button" aria-label="Eliminar Tarea 2">
            <span className="trash-icon" aria-hidden="true" />
          </button>
        </li>

        <li className="task-item">
          <input id="task-1" type="checkbox" defaultChecked />
          <label htmlFor="task-1">Completada Tarea 1</label>
          <button className="delete-button" type="button" aria-label="Eliminar Completada Tarea 1">
            <span className="trash-icon" aria-hidden="true" />
          </button>
        </li>
      </ul>
    </main>
  )
}

export default App

