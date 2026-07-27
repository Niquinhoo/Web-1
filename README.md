# Lista de tareas de Nicolás — Manos a la obra II

## Contexto de la rama

`Web-1-MalO2` es la segunda entrega del gestor de tareas. Mantiene la interfaz de `Web-1-MalO1` y divide el componente inicial en componentes React con responsabilidades concretas.

Esta rama todavía es una SPA estática: la interacción completa de tareas se incorpora en `Web-1-MalO3`. No pertenece a la línea backend `Web-1-STP1`–`Web-1-STP4`.

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
