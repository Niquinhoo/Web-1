# Manos a la obra III: paso a paso

## 1. Objetivo

La tercera entrega convierte la interfaz estática de la lista de tareas en una SPA funcional. El alcance se limita a las historias del ejercicio:

- escribir una tarea;
- guardarla únicamente al presionar `ADD`;
- mostrar las tareas nuevas primero;
- completar o desmarcar una tarea;
- eliminar una tarea;
- mostrar un aviso cuando no existen tareas.

No se agregó persistencia, edición, filtros ni otras funciones que el enunciado no solicita.

## 2. Estado y datos

`TasksView` mantiene el array de tareas mediante `useState`. La aplicación comienza con una lista vacía para mostrar el aviso inicial.

Cada tarea tiene esta forma:

```js
{
  id: crypto.randomUUID(),
  label: 'Descripción de la tarea',
  completed: false,
}
```

El identificador se genera con la API nativa `crypto.randomUUID()`, por lo que no fue necesario instalar una dependencia.

## 3. Flujo de interacción

### Escribir y agregar

1. `TaskForm` controla el contenido del campo con `useState`.
2. El texto se conserva mientras la persona escribe.
3. El botón `ADD` llama a `onAdd`.
4. `TasksView` rechaza textos vacíos o compuestos sólo por espacios.
5. La tarea se agrega al inicio del array y el campo se limpia.

El botón es de tipo `button`; así la tarea se guarda al presionarlo, tal como pide la historia, y no mediante el envío automático de un formulario.

### Orden cronológico inverso

`addTask` antepone la tarea nueva con `[newTask, ...tasks]`. Por eso la última tarea creada siempre aparece arriba sin ordenar nuevamente la colección.

### Completar

Al cambiar el checkbox, `TaskItem` envía el identificador a `onToggle`. `toggleTask` crea un nuevo array e invierte únicamente el valor `completed` de la tarea elegida. El CSS aplica el tachado cuando el checkbox está marcado.

### Eliminar

El botón del tacho envía el identificador a `onRemove`. `removeTask` usa `filter` para devolver la lista sin esa tarea.

### Lista vacía

`TaskList` comprueba la longitud del array. Si no hay tareas, muestra `No hay tareas en la lista.` en lugar de renderizar la lista.

## 4. Responsabilidades de los archivos

| Archivo | Responsabilidad |
|---|---|
| `views/TasksView/index.jsx` | Mantiene el estado y conecta todas las acciones. |
| `components/TaskForm/index.jsx` | Controla el campo y solicita agregar una tarea. |
| `components/TaskList/index.jsx` | Muestra el estado vacío o la colección. |
| `components/TaskItem/index.jsx` | Renderiza una tarea y sus controles. |
| `tasks.js` | Contiene las operaciones puras de agregar, completar y eliminar. |
| `tasks.test.js` | Comprueba las tres operaciones principales. |

El flujo de datos sigue siendo unidireccional: `TasksView` entrega datos y callbacks a los componentes; las modificaciones regresan mediante esos callbacks y actualizan el estado central.

## 5. Verificación

La prueba automatizada comprueba que una tarea nueva:

- se inserte antes que las anteriores;
- elimine espacios exteriores del texto;
- pueda marcarse como completada;
- pueda eliminarse.

La entrega completa se valida con:

```bash
npm run lint
npm test
npm run build
```

También se puede ejecutar `npm run dev` y recorrer manualmente las historias del ejercicio desde el navegador.
