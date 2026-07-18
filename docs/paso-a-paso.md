# Paso a paso de la resolución

## Análisis del ejercicio

Se leyó el enunciado y se compararon `Wireframe.png` y `WireframeLineamientos.png`. De esa revisión surgieron los elementos obligatorios: título, campo para una tarea nueva, botón `ADD` y lista en orden cronológico inverso. Cada fila debía incluir checkbox, descripción y botón para eliminar.

También se respetaron las restricciones principales: una sola aplicación React, un único componente principal, etiquetas HTML estándar, CSS sin bibliotecas externas y ausencia de lógica de negocio.

## Creación del proyecto

Se preparó la estructura mínima equivalente a una aplicación React creada con Vite:

1. `index.html` define el nodo `#root` y carga `src/main.jsx`.
2. `src/main.jsx` monta el componente `App` con `createRoot`.
3. `vite.config.js` habilita el plugin oficial de React.
4. `package.json` conserva únicamente React, Vite y las herramientas de lint necesarias.

## Construcción de la estructura

Todo el contenido visual se escribió en `src/App.jsx`, sin extraer componentes y sin crear estados, eventos ni colecciones procesadas con JavaScript.

Se utilizaron elementos semánticos y estándar:

- `main` para el contenido principal.
- `h1` para el encabezado.
- `form`, `label`, `input` y `button` para el área de carga.
- `ul` y `li` para la lista de tareas.
- `input type="checkbox"` para representar el estado de cada tarea.

Los botones usan `type="button"` para evitar envíos accidentales. El campo de texto tiene una etiqueta accesible oculta visualmente y cada botón de borrado posee un nombre descriptivo mediante `aria-label`.

## Aplicación de estilos

Los estilos globales se ubicaron en `src/index.css` y los estilos de la pantalla en `src/App.css`.

Para reproducir el wireframe se definieron:

1. Un contenedor central de 508 px.
2. Una grilla de dos columnas para el campo y el botón `ADD`.
3. Bordes rectos de 2 px y una paleta monocromática.
4. Una lista vertical con separación uniforme.
5. Filas con tres columnas para checkbox, texto y borrado.
6. El tachado mediante el selector CSS `input:checked + label`.
7. Estados de foco visibles para navegación con teclado.

El icono de papelera se dibujó con bordes CSS porque el ejercicio no permite incorporar una biblioteca externa.

## Verificación

La entrega se comprueba con:

```bash
npm run lint
npm run build
```

Además, la pantalla se contrasta visualmente con los dos wireframes en un navegador desktop. Los controles deben ocupar su posición esperada, las dos tareas completadas deben verse tachadas y no debe existir ninguna interacción de dominio.

## Próxima iteración

La lógica para agregar, completar, ordenar o eliminar tareas queda deliberadamente fuera de esta entrega. Se incorporará cuando el siguiente ejercicio lo solicite.

