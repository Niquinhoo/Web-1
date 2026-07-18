# Lista de tareas de Nicolás — Manos a la obra II

SPA estática en React y Vite. La segunda entrega conserva la interfaz original y divide el componente único en componentes con responsabilidades concretas.

## Uso

Requiere Node.js 20.19 o superior.

```bash
npm install
npm run dev
```

Verificación:

```bash
npm run lint
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
└── main.jsx
```

La resolución, el contraste entre las fuentes y la refutación razonada están en [docs/paso-a-paso.md](docs/paso-a-paso.md).
