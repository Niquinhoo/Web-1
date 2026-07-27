# Lista de tareas de Nicolás — Manos a la obra IV

## Contexto de la rama

`Web-1-MalO4` es la cuarta entrega del gestor de tareas y la versión más completa de esta línea. Conserva la funcionalidad de `Web-1-MalO3` y agrega SCSS, sistema de diseño, tema claro, Flexbox, layout líquido y encabezado fijo.

Esta rama sigue siendo un frontend React independiente del backend e-commerce `Web-1-STP1`–`Web-1-STP4`.

SPA en React, Vite y SCSS para crear, completar y eliminar tareas. La interfaz implementa el sistema de diseño de la cuarta entrega con tema light, Flexbox, layout líquido y encabezado fijo durante el scroll.

## Uso

Requiere Node.js 20.19 o superior.

```bash
npm install
npm run dev
```

## Verificación

```bash
npm run lint
npm test
npm run build
```

## Características

- Las tareas nuevas aparecen primero.
- El checkbox marca o desmarca una tarea como completada.
- El botón del tacho elimina una tarea.
- La lista vacía muestra un mensaje informativo.
- El contenido tiene un ancho máximo de 512 px y márgenes móviles de 24 px.
- El encabezado permanece visible al recorrer listas largas.
- Los estilos usan SCSS, Flexbox y la grilla de 8 px del sistema de diseño.

El desarrollo está documentado en [docs/paso-a-paso.md](docs/paso-a-paso.md).
