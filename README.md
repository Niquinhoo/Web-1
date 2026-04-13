# TaskManager MVC

Aplicación web simple construida con Node.js, Express y EJS para mostrar una lista de tareas usando el patrón MVC.

## Stack

- Node.js
- Express
- EJS
- CSS estático en `public/css/styles.css`

## Scripts

```bash
npm install
npm run dev
```

Otros comandos disponibles:

```bash
npm start
```

La aplicación levanta por defecto en `http://localhost:3000`.

## Estructura del proyecto

```text
MVC/
├── app.js
├── package.json
├── controllers/
│   └── tasks.controller.js
├── models/
│   └── tasks.model.js
├── public/
│   └── css/
│       └── styles.css
├── views/
│   ├── 404.ejs
│   ├── index.ejs
│   ├── partials/
│   │   ├── footer.ejs
│   │   └── header.ejs
│   └── tasks/
│       ├── details.ejs
│       └── index.ejs
```

## Qué hace cada parte

- `app.js`: punto de entrada. Configura Express, EJS, archivos estáticos y rutas.
- `controllers/tasks.controller.js`: contiene la lógica de respuesta para listar tareas y mostrar el detalle.
- `models/tasks.model.js`: simula la fuente de datos con un array en memoria y expone funciones para consultar tareas.
- `views/`: contiene las vistas EJS renderizadas en servidor.
- `views/partials/`: fragmentos reutilizables como header y footer.
- `public/`: archivos estáticos accesibles desde el navegador.

## Rutas

- `GET /`: landing principal del proyecto.
- `GET /tasks`: listado de tareas.
- `GET /tasks/:id`: detalle de una tarea por id.
- Cualquier otra ruta renderiza `404.ejs`.

## Flujo MVC

El flujo principal de la app funciona así:

1. El navegador hace una petición a una ruta.
2. Express recibe la solicitud en `app.js`.
3. La ruta delega la lógica al controlador.
4. El controlador consulta el modelo.
5. El modelo devuelve los datos en memoria.
6. El controlador envía esos datos a una vista EJS.
7. EJS genera el HTML en el servidor.
8. Express responde al navegador con la página final.

## Flujo concreto de `/tasks`

1. El usuario entra a `GET /tasks`.
2. `app.js` deriva la petición a `tasksController.list`.
3. `tasks.controller.js` llama a `tasksModel.getAll()`.
4. `tasks.model.js` devuelve el array de tareas.
5. El controlador renderiza `views/tasks/index.ejs` con la variable `tasks`.
6. La vista arma el HTML del listado y el navegador lo muestra.

## Flujo concreto de `/tasks/:id`

1. El usuario entra a una URL como `GET /tasks/3`.
2. `app.js` deriva la petición a `tasksController.detail`.
3. El controlador toma `req.params.id` y lo convierte a número.
4. Llama a `tasksModel.getById(id)`.
5. Si la tarea existe, renderiza `views/tasks/details.ejs`.
6. Si no existe, responde con estado `404` y renderiza `views/404.ejs`.

## Fuente de datos

Actualmente las tareas están definidas en memoria dentro de `models/tasks.model.js`. No hay base de datos, por lo que los datos:

- no persisten entre reinicios si se editaran en tiempo de ejecución,
- sirven como ejemplo simple para practicar MVC,
- pueden reemplazarse más adelante por una base de datos sin cambiar la idea general del flujo.

## Vista y presentación

- El renderizado es SSR con EJS.
- `header.ejs` incluye tipografías, iconos y la hoja de estilos global.
- `footer.ejs` cierra la estructura compartida entre páginas.
- `styles.css` contiene la identidad visual completa de la app.

## Objetivo del proyecto

Este proyecto está pensado como práctica de arquitectura MVC en Express, separando:

- datos y acceso a información en el modelo,
- lógica de rutas y coordinación en el controlador,
- presentación en las vistas.
