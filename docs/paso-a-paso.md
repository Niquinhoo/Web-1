# Manos a la obra IV: paso a paso

## 1. Alcance

Esta entrega conserva la funcionalidad de la lista de tareas y aplica el sistema de diseño solicitado. No agrega edición, copiar, compartir, persistencia ni cambio de tema.

## 2. SCSS y tema light

Los estilos globales viven en `src/index.scss` y los de la aplicación en `src/App.scss`. Sass compila ambos archivos durante el desarrollo y el build de Vite.

La paleta utiliza Blanco como fondo y Negro, Negro50 y Negro10 para texto, estados secundarios y superficies. Las medidas siguen una base de 8 px y los controles usan bordes redondeados de 4 px.

## 3. Layout responsive

`TasksView` separa el encabezado de la lista. El encabezado contiene el título, el control para agregar tareas y el Divider; `position: sticky` lo mantiene visible durante el scroll.

La clase `app-shell` limita todos los componentes a 512 px y reserva 24 px a cada lado en pantallas angostas. El formulario, la lista y cada tarea usan Flexbox, por lo que no necesitan breakpoints específicos para adaptarse a desktop y mobile.

## 4. Componentes

- `TaskForm` mantiene el input controlado, rechaza textos vacíos y presenta un botón de icono accesible.
- `TaskList` muestra el estado vacío o la colección en orden cronológico inverso.
- `TaskItem` alinea checkbox, texto flexible y botón de eliminar. Las etiquetas largas pueden dividirse sin desplazar los controles.
- Los estados de foco, hover, pulsación y tarea completada tienen una representación visible.

## 5. Verificación

La lógica se comprueba con la prueba existente de alta, completado y eliminación. La entrega completa se valida con:

```bash
npm run lint
npm test
npm run build
```

La revisión visual debe cubrir desktop, un viewport mobile de 375 px, una lista con scroll, textos largos y navegación por teclado.
