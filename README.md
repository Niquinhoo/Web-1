# Lista de tareas de Nicolás — Manos a la obra III

SPA en React y Vite que permite escribir, agregar, completar y eliminar tareas. Las tareas nuevas aparecen primero y, cuando la lista está vacía, se muestra un aviso.

## Uso

Requiere Node.js 20.19 o superior.

```bash
npm install
npm run dev
```

Verificación:

```bash
npm run lint
npm test
npm run build
```

## Estructura

```text
src/
├── components/
│   ├── TaskForm/index.jsx
│   ├── TaskItem/index.jsx
│   └── TaskList/index.jsx
├── views/
│   └── TasksView/index.jsx
├── App.css
├── App.jsx
├── index.css
├── main.jsx
├── tasks.js
└── tasks.test.js
```

## Funcionalidades

- El campo de texto permite escribir una tarea.
- El botón `ADD` guarda la tarea y limpia el campo.
- Las tareas se muestran en orden cronológico inverso.
- El checkbox marca o desmarca una tarea como completada.
- El botón del tacho elimina la tarea.
- La lista vacía muestra un mensaje informativo.

El desarrollo completo está documentado en [docs/paso-a-paso.md](docs/paso-a-paso.md).
