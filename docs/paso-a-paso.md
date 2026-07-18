# Manos a la obra II: proceso, teoría y refutación

## 1. Punto de partida y alcance

La primera entrega tenía toda la interfaz en `App.jsx`: título, formulario y seis filas de tareas repetidas manualmente. El enunciado de esta segunda entrega pide mejorar esa arquitectura mediante componentes y Atomic Design, sin sumar funcionalidades.

Por eso se mantuvieron el contenido, el orden, los estados iniciales y la apariencia. Los botones continúan sin lógica para agregar o borrar tareas.

## 2. Planificación de componentes

| Pieza | Nivel usado | Responsabilidad |
|---|---|---|
| `TaskForm` | Molécula | Agrupa etiqueta, campo y botón para crear una tarea. |
| `TaskItem` | Molécula | Representa una tarea mediante checkbox, texto y botón de borrado. |
| `TaskList` | Organismo | Recibe la colección y genera un `TaskItem` por tarea. |
| `TasksView` | Vista/página | Compone el título, el formulario y la lista con datos representativos. |
| `App` | Raíz | Monta la única vista de la SPA. |

No se crearon componentes `Button`, `Input`, `Label`, `Title` o `DeleteIcon`. En esta pantalla cada uno tendría una sola utilización conceptual y no aportaría comportamiento, variantes ni reutilización. Los elementos JSX nativos ya expresan esas unidades de forma más directa.

## 3. Implementación

1. Se recuperó la base React/Vite de la primera entrega.
2. Se extrajeron el formulario y la fila repetible de tarea.
3. Las seis tareas se trasladaron a un array de objetos con `id`, `label` y `completed`.
4. `TaskList` usa `map()` y una `key` estable basada en `id` para producir las filas.
5. `TasksView` reúne la estructura completa y `App` queda como punto de composición mínimo.
6. Cada componente vive en una carpeta PascalCase con `index.jsx`, siguiendo la estructura solicitada.

El flujo de datos es unidireccional: `TasksView` entrega `tasks` a `TaskList`; este pasa las propiedades de cada objeto a `TaskItem`. Ningún componente modifica datos externos durante el renderizado.


## 4. Refutación razonada

La afirmación fuerte de que una interfaz correctamente atómica debe convertir todo elemento mínimo en componente y obligar a los niveles altos a depender de componentes inferiores no se sostiene como regla universal.

1. **Ser mínimo no vuelve reutilizable a un elemento.** Un `Title` que sólo retorna `<h1>` duplica la abstracción que ya ofrece JSX. No reduce código ni concentra una decisión compartida.
2. **La clasificación no siempre es objetiva.** El texto interno incluye una `card` entre los átomos, mientras las definiciones externas llaman átomo sólo a lo que no puede dividirse. Una card normalmente contiene texto, imagen o acciones; por esa regla sería molécula u organismo.
3. **La jerarquía química no coincide necesariamente con las dependencias del producto.** `TaskItem` puede componerse correctamente con HTML nativo. Forzarlo a importar `Checkbox`, `Text` y `DeleteButton` no mejora por sí mismo su pureza, accesibilidad o mantenimiento.
4. **El beneficio depende de la escala.** Las propias lecturas externas destacan equipos y proyectos grandes. En esta SPA pequeña, una taxonomía completa de cinco niveles costaría más de recorrer y mantener que la estructura que ordena.
5. **React no exige Atomic Design.** Lo que React sí necesita aquí son componentes puros, props claras y claves estables. Atomic Design es una metodología de diseño y organización, no una condición técnica del framework.

Por lo tanto, la conclusión no es descartar Atomic Design, sino refutar su aplicación rígida. Resulta útil como vocabulario para descubrir límites de responsabilidad; deja de ser útil cuando la categoría se convierte en el objetivo y produce componentes sin una razón de cambio propia.

## 5. Verificación

La entrega se comprueba con:

```bash
npm run lint
npm run build
```

El criterio visual es que se conserve la pantalla de la primera entrega: título, formulario, seis tareas, dos tareas inicialmente marcadas y tachado asociado al checkbox.
