# **Objetivo**

Se espera que cada *estudiante* pueda construir de forma integral una aplicación que consuma datos desde una API Rest existente. La app debe ser diseñada y desarrollada pensando en que las personas la consumirán principalmente desde dispositivos móviles, pero no sólo desde ellos.

# **Pautas de Trabajo**

En la sección [Requerimientos](https://www.notion.so/Requerimientos-3212f5d5636481819b5ce8575c68a4ba?pvs=21) de este documento, se presentarán los requerimientos funcionales en forma de ***Stories***. 

~~Disponer de tareas concretas de desarrollo tiene una doble finalidad:~~

- ~~por un lado, permite brindar *visibilidad* del trabajo que estamos realizando (en progreso) y del trabajo que tenemos pendiente;~~
- ~~y por otro lado, permite validar que cada bootcamper comprender el flujo de trabajo utilizado en los proyectos y su gestión con un issue tracker.~~

# Criterios de aceptación generales

Los criterios que se tendrán en cuenta al analizar los resultados de este Trabajo Final incluyen los siguientes:

💪 ***Debe existir el progreso individual,*** es decir, esperamos que cada persona produzca una parte importante del proyecto.

🤝 ***Debe existir trabajo colaborativo.*** Durante el desarrollo, pueden surgir inconvenientes para resolver un problema específico, esperamos que puedan recurrir a sus compañeras y compañeros para solicitar ayuda y fortalecer el intercambio. Esto no implica delegar el trabajo en otra persona.

✅ Revisaremos que hagas un uso semántico correcto de las etiquetas HTML y que respeten las reglas de estilo en tu código.

🎖️ El producto obtenido al final debe cumplir con los requisitos funcionales que se piden.

# ¿Qué debemos construir?

Un cliente nos solicitó un tracker de tareas a medida para organizar y realizar seguimiento de los avances sobre los distintos proyectos dentro de su organización.

En las entrevistas previas, donde conocimos a las personas usuarias, entendimos que lo que buscan es una aplicación que les permita gestionar Proyectos, que pueden tener una o más Épicas. Dentro de las Épicas, organizan el trabajo con User Stories, y cada User Story suele tener un conjunto de Tareas que el equipo de trabajo organiza en Sprints.

En el siguiente diagrama puede verse esta estructura de forma simplificada.

![apiStructureLamansys.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/c5ab99cc-1f8d-42d7-b399-60d0023adb9a/apiStructureLamansys.png)

Nuestro equipo de Backend ya puso manos a la obra en este proyecto y comenzó con el desarrollo de una API Rest con NodeJS y MongoDB para alimentar una o más aplicaciones frontend.

Nosotros nos encargaremos de diseñar y construir una Single Page Application para que las personas de esta organización puedan administrar sus proyectos desde su teléfono.

La app debe permitir que una persona pueda autenticarse e ingresar a ver los *Proyectos*, *Épicas*, *Stories* y *Tasks* sobre los que tiene permiso. 

# Requerimientos

## 1. Estructura de la App

La UI de la app debe tener una arquitectura definida que permita una navegación simple y fácil de interpretar. Se propone la siguiente estructura:

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/4cfd5ca9-a380-4fc5-924b-2edfa69bf088/Untitled.png)

---

## 2. Encabezado y Navegación

La app debe tener una estructura de navegación que permita llegar de forma sencilla y con cierto orden a los diferentes espacios de información. Se propone el siguiente esquema:

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/ac55b206-4529-4e6c-9e75-13bc3961e059/Untitled.png)

🏠 **Home `/`:** Pantalla principal.

📁 **My Projects `/my-projects`:** Lista de proyectos.

📒 **Project N `/my-projects/project-n`:** Un proyecto en particular. Para cada proyecto hay un listado de *Epics*.

⭐ **Epic K `/my-projects/project-n/epic-k`:** Una épica en particular. Para épica hay un listado de *Stories*.

💬 **Story J `/my-projects/project-n/epic-k/story-j`:** Una story tiene un listado de tareas.

📂 **My Stories `/my-stories`:** Muestra todas las stories de todos los proyectos en los que está trabajando una persona.

👤 **Settings `/settings`:** permite acceder a opciones de configuración de la persona usuaria y de la app.

Para navegar entre las opciones de primer nivel de la estructura de navegación, se propone la inclusión de un menu hamburguesa (☰) en el encabezado que permita abrir un panel lateral (sidebar).

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/7df1a1fc-8c9e-40df-9521-e7fb3e5834a2/Untitled.png)

Junto al menú, para clarificar la posición en la que se encuentra la persona dentro de la app, se muestra un *título* con información de la vista actual.

Al interactuar con el ícono *Menu*, se accede al panel lateral que permanece oculto y se revela deslizándose sobre la pantalla:

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/95d77041-9253-4f14-823a-b236b0d205c8/Untitled.png)

En las vistas que no son accesibles desde el primer nivel, el encabezado cambia levemente para mostrar una flecha hacia la izquierda (‹) que permite volver un paso en el historial.

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/1c931e45-d6f2-4016-a75a-81b998e68b87/Untitled.png)

---

## 3. Menú lateral

El menú lateral consta de 3 partes bien identificadas:

- Un encabezado que muestra la marca de la App.
- Una sección con opciones de navegación.
- Una opción especial que permite acceder al perfil de la persona usuaria y a las opciones de la App.

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/f84196b0-59a9-4b75-b6d4-2b8cc3ecbf39/Untitled.png)

<aside>
💬 Donde se menciona la ruta `/user`, debe decir `/settings`.

</aside>

---

## 4. Pantalla de Bienvenida

<aside>
👤 Esta historia debe ser desarrollada individualmente.

</aside>

La pantalla de bienvenida es accesible desde la opción ***Home*** del menú lateral y desde las URLs `/` y `/home`.

Aún no está diseñado el contenido que irá en esta página, pero se espera que sea un resumen de la información importante para cada persona usuaria.

<aside>
💡 Este es un buen caso para que dejes volar tu creatividad proponiendo un diseño para esta página.

</aside>

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/6256208f-5ed1-4c3d-9a4c-6477666713fb/Untitled.png)

---

## 5. **Listado de proyectos**

La página de proyectos es accesible desde la opción ***My Projects*** del menú lateral y desde `/my-projects`. Debe mostrar un listado de proyectos representados como tarjetas, una debajo de la otra, con los detalles de cada proyecto. 

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/e3b22095-b2da-4062-949d-c0a473e8bab5/Untitled.png)

A modo informativo, tenemos el Schema de la entidad `project` con la que trabaja la API Rest:

- **Schema**
    
    ```json
    name: {
      type: String,
      required: true
    },
    members: [{
      type: schema.Types.ObjectId,
      ref: user,
      required: true
    }],
    description: {
      type: String,
      required: false
    },
    icon: {
      type: String,
    	required: false
    }
    ```
    
- **Ejemplo de Respuesta al pedir un `project` a la API.**
    
    ```json
    {
    	"members": [],
    	"name": "Project 1",
    	"description": "This is my first project",
    	"icon": null,
    }
    ```
    

### ✅ **Criterios de aceptación**

- La vista debe ser accesible desde `/my-projects`.
- Si no existen proyectos, se debe informar que no hay proyectos asignados a esa persona.
- Mientras se obtienen los datos del listado, se debe informar que los datos están siendo cargados.
- Al clickear sobre un proyecto, debe navegarse a la vista detallada de un proyecto.

---

## 6. Detalle de un Proyecto

La página de detalles de un proyecto, se abre al clickear sobre un proyecto en el listado de proyectos o al cargar la url `/my-projects/project-n` donde `project-n` es el identificador del *Proyecto N*. Esta página debe mostrar la descripción detallada del proyecto y una lista de todas las Epics definidas para ese proyecto.

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/01221ff5-b9fb-4ed9-bc52-04e49ac89df1/Untitled.png)

A modo informativo, tenemos el Schema de la entidad `epic` con la que trabaja la API Rest:

- **Schema**
    
    ```json
    project: {
      type: schema.Types.ObjectId,
      ref: project,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: false
    },
    icon: {
      type: String,
      required: false
    }
    ```
    
- **Ejemplo de respuesta al pedir una `epic` a la API.**
    
    ```json
    {
    	"project": "62014bdae564ba4f507afcd1",
    	"name": "Epic 2",
    	"description": "This is the third Epic for Project 1",
    	"icon": "🥁"
    }
    ```
    

### ✅ **Criterios de aceptación**

- La vista de epics de un proyecto `n` debe ser accesible desde **`/my-projects/project-n`**, donde `proyect-n` es el id del proyecto para el que se muestran las épicas.
- Si no existen *epics*, debe informarse de esto a la persona usuaria.
- Mientras se obtienen los datos del listado, se debe informar que los datos están siendo cargados.

---

## 7. Detalles de una Epic.

Al hacer clic en una *epic* del listado dentro de un proyecto, la persona usuaria será enviada a una nueva pantalla con la URL `/my-projects/project-n/epic-k` en la que se especifique el proyecto y la epic correspondiente como cabecera de la página y se listen las *stories* pertenecientes a ese *epic*.

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/2ac33161-4a3c-4239-86cb-d41c99861e04/Untitled.png)

<aside>
💡 En el wireframe no puede apreciarse, pero la pantalla de un *Epic K* con su listado de *stories* también debe mostrar info de este *epic*.

</aside>

A modo informativo, tenemos el Schema de la entidad `story` con la que trabaja la API Rest:

- **Schema**
    
    ```jsx
    name: {
    	type: String,
      required: true
    },
    description: {
      type: String,
      required: false
    },
    epic: {
      type: schema.Types.ObjectId,
      ref: epic,
      required: true
    },
    owner: {
      type: schema.Types.ObjectId,
      ref: user,
      required: false
    },
    assignedTo: [{
      type: schema.Types.ObjectId,
      ref: user,
      required: false
    }],
    points: {
      type: Number,
      required: false,
      default: 0,
      min: 0,
      max: 5,
    },
    created: {
      type: Date,
      default: Date.now,
      required: false
    },
    due: {
      type: Date,
      required: false
    },
    started: {
      type: Date,
      required: false
    },
    finished: {
      type: Date,
      required: false
    },
    status: {
      type: String,
      enum: ['todo', 'running', 'done'],
      required: false,
      default: 'todo'
    },
    icon: {
      type: String,
      required: false
    }
    ```
    
- **Ejemplo de respuesta al pedir una `story` a la API**
    
    ```json
    {
    	"assignedTo": [],
    	"points": 5,
    	"status": "todo",
    	"name": "US #2",
    	"description": "Lorem ipsum",
    	"epic": 1,
    	"created": "2022-02-07T21:44:26.346Z",
    }
    ```
    

### ✅ **Criterios de aceptación**

- La vista de stories de un proyecto `n` debe ser accesible desde **`/my-projects/project-n/epic-k`**, donde `epic-k` es el `id` del *epic* para el que se muestran las *stories*.
- Si no existen *epics*, debe informarse de esto a la persona usuaria.
- Mientras se obtienen los datos del listado, se debe informar que los datos están siendo cargados.

---

## 8. **Listado de tareas para una Story**

Al clickear en una *story* en la pantalla `/my-projects/project-n/epic-k`, la persona usuaria debe ser dirigida a `/my-projects/project-n/epic-k/story-j` en donde puede ver todas las tareas (***tasks***) que conforman esa *story*.

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/5a1df649-2770-4888-8ccd-63ed61ac698e/Untitled.png)

A modo informativo, tenemos el Schema de la entidad `task` con la que trabaja la API Rest:

- **Schema**
    
    ```json
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: false
    },
    story: {
      type: schema.Types.ObjectId,
      ref: story,
      required: true
    },
    created: {
      type: Date,
      default: Date.now,
      required: false
    },
    dueDate: {
      type: Date,
      required: false
    },
    done: {
      type: Boolean,
      required: false,
      default: false
    }
    ```
    
- **Ejemplo de respuesta al pedir una `task` a la API**
    
    ```json
    {
    	"done": false,
    	"name": "Task 1",
    	"description": "This is task #1",
    	"story": "620192ba5d34515ecc3adafa",
    	"created": "2022-04-10T21:59:24.063Z",
    	"due": "2022-02-07T21:44:50.568Z",
    }
    ```
    

### ✅ **Criterios de aceptación**

- La vista de *tasks* de un story `j` debe ser accesible desde **`/my-projects/project-n/epic-k/story-j`**, donde `story-j` es el id de la *story* para la que se muestran las *tasks*.
- Si no existen tareas, debe informarse de esto al usuario.
- Mientras se obtiene la información, se debe mostrar a la persona usuaria que los datos están siendo cargados.

---

## 9. **Agregar Projects, Epics y Stories**

<aside>
👥 Esta tarea debe ser realizada sólo en proyectos grupales

</aside>

Para cada uno de los listados de Projects, Epics y Stories, debe incluirse la acción de agregar un nuevo item a la lista.

Al desencadenar esta acción, debe renderizarse un formulario para la carga de datos del nuevo item según el *schema* propuesto.

Si la información cargada en el formulario es correcta, se deberá cerrar el diálogo y reflejar el nuevo item en el listado. Este formulario también debe poder cerrarse sin efectuar cambios en caso de que la persona usuaria abandone la carga.

---

## 10. Editar **Projects, Epics y Stories**

<aside>
👥 Esta tarea debe ser realizada sólo en proyectos grupales

</aside>

Para cada una de las vistas de detalles de Projects, Epics y Stories, debe incluirse la posibilidad de editar su atributos.

Al desencadenar esta acción, debe renderizarse un formulario para la modificación de datos del item según el *schema* propuesto.

Si la información cargada en el formulario es correcta, se deberá cerrar el diálogo y reflejar los cambios. Este formulario también debe poder cerrarse sin efectuar cambios en caso de que la persona usuaria abandone la carga.

---

## 11. **Eliminar Projects, Epics y Stories**

<aside>
👥 Esta tarea debe ser realizada sólo en proyectos grupales

</aside>

Sobre cada tarjeta del listado de Projects, Epics y Stories, se debe agregar un botón que permita eliminar el item. Al hacer clic, se debe mostrar un diálogo de confirmación preguntando a la persona usuaria si está segura de realizar la acción. 

Si se confirma la acción, se debe eliminar el item y debe verse reflejada la acción en el listado. Si se desestima el diálogo, ningún cambio debe ser efectuado.

<aside>
⚠️ No deben poder eliminarse *Projects* que posean Epic, o *Epics* que posean Stories, o *Stories* que posean Tasks.

</aside>

---

## 12. **Agregar tareas a una User Story**

En la página donde se visualizan las tareas de una *story*, debe colocarse, por encima del listado de tareas, una acción que permita agregar una nueva tarea a la story. 

Al hacer clic en esta acción, se desplegará un diálogo con un formulario para la carga de datos de la nueva tarea según el *schema* propuesto. 

El diálogo debe poder cerrarse sin efectuar cambios, y, a su vez, debe poder agregar la tarea con la información cargada. Si la información es correcta, se deberá cerrar el diálogo y reflejar la tarea creada en el listado.

### ✅ **Criterios de aceptación**

- El atributo `name` es obligatorio
- El atributo `description` es opcional, pero si se provee requiere al menos 10 caracteres.
- Mientras se agrega la tarea, se debe mantener el diálogo abierto informando que se está creando la tarea.

---

## 13. **Eliminar tareas de una User Story**

Sobre cada tarjeta del listado de *tasks*, se debe agregar un botón que permita eliminar dicha tarea. Al hacer clic, se debe mostrar un diálogo de confirmación preguntando a la persona usuaria si está segura de realizar la acción. 

Al confirmar, se debe eliminar dicha tarea y ver reflejada la acción en el listado. Si se desestima el diálogo, ningún cambio debe ser efectuado.

### ✅ **Criterios de aceptación**

- Mientras se elimina la tarea, se debe mantener el diálogo abierto informando que se está eliminando la tarea.

---

## 14. **Conectar con servicios de la API y remover el uso de mocks**

Se deben reemplazar los datos *mock* por las conexiones con la API Rest que se encargará de la administración de los datos.

Nuestra API Rest está localizada en https://lamansysfaketaskmanagerapi.onrender.com/api. 

[](https://lamansysfaketaskmanagerapi.onrender.com/api)

Se provee el siguiente listado de endpoints:

---

## 15. **Login**

Necesitamos sesiones para que cada persona pueda acceder sólo al conjunto de datos que le corresponde.

Ahora, al ingresar la URL de la aplicación en el browser, si no existe una sesión válida, se deben poder ingresar las credenciales que identifican a cada *user*. Para iniciar una sesión, deben enviarse username y password al endpoint `/login` de la API Rest. Si las credenciales son válidas se debe acceder a una pantalla de inicio y almacenar el JWT que la API Rest envía como respuesta.

La pantalla de Login de nuestra app, también debe ser accesible desde `/login`.

A modo informativo, se provee el *schema* de la entidad `user` de la base de datos.

- **Schema**
    
    ```jsx
    email:{
      type:String,
      required:true
    },
    username:{
      type:String,
      required:true
    },
    password:{
      type:String,
      required:true
    },
    name:{
      first:{
    	  type:String,
        required:false
      },
      last:{
    	  type:String,
        required:false
      }
    }
    ```
    
- **Ejemplo**
    
    ```json
    {
      "email": "waltermolina@msn.com",
      "username": "waltermolina",
      "password": "1234",
      "name": {
        "first": "Walter",
        "last": "Molina"
      }
    }
    ```
    

### ✅ **Criterios de aceptación**

- La sesión del usuario debe mantenerse siempre en el dispositivo a menos que se cierre la sesión explícitamente.
- Los campos de las credenciales son obligatorios y con un mínimo de 4 caracteres.
- Las validaciones deben mostrarse de manera clara y enfática debajo del campo correspondiente al error.
- Cualquier otro error debe mostrarse debajo del formulario.


ESCLARECIMIENTO DE CONSIGNAS

1. Estructura General y Navegación (Puntos 1, 2 y 3)
Tenés que crear la base visual de la app. Esto implica un contenedor principal con un Encabezado (Header) y un Menú lateral (Sidebar).

¿Qué hacer?: * Un menú hamburguesa (☰) en el encabezado. Al tocarlo, debe deslizarse un panel lateral desde el costado.

El menú lateral debe tener tres partes: El logo/marca de la App, los links de navegación, y abajo de todo el acceso a Settings.

La regla de la flecha: Si estás en las pantallas principales (Home, Proyectos, Stories, Settings), se muestra el menú hamburguesa. Si entrás al detalle de un proyecto, épica o story, el encabezado debe cambiar y mostrar una flecha de volver atrás (‹).

Cita de la documentación: > "Para navegar entre las opciones de primer nivel... se propone la inclusión de un menu hamburguesa (☰) en el encabezado que permita abrir un panel lateral... En las vistas que no son accesibles desde el primer nivel, el encabezado cambia levemente para mostrar una flecha hacia la izquierda (‹)"

2. El Enrutamiento / Rutas de React (React Router)
Antes de programar las pantallas, tenés que configurar las URLs de tu aplicación. Estas son las rutas que debés registrar:

/ o /home ➡️ Pantalla de Bienvenida.

/login ➡️ Pantalla de inicio de sesión.

/my-projects ➡️ Listado de proyectos.

/my-projects/:projectId ➡️ Detalle de un proyecto (Ver sus Épicas).

/my-projects/:projectId/:epicId ➡️ Detalle de una Épica (Ver sus Stories).

/my-projects/:projectId/:epicId/:storyId ➡️ Detalle de una Story (Ver sus Tareas).

/my-stories ➡️ Ver todas tus stories globales.

/settings ➡️ Configuración del usuario.

3. Pantalla por Pantalla: Lo que debe hacer cada una
Aquí está el núcleo de tu aplicación. Para las pantallas de listados, la documentación te pide cumplir siempre tres estados: si está cargando, si está vacío, o si muestra las tarjetas.

🏠 Pantalla de Bienvenida (Punto 4)
¿Qué hacer?: Es la página de inicio. No te dieron un diseño fijo, así que acá podés inventar un "Dashboard" o saludo lindo. Por ejemplo: "¡Hola, [Nombre]! Tenés X tareas pendientes para hoy".

Cita: > "Aún no está diseñado el contenido... pero se espera que sea un resumen de la información importante para cada persona usuaria. Este es un buen caso para que dejes volar tu creatividad".

📁 Listado de Proyectos (Punto 5)
¿Qué hacer?: Hacer un fetch a la API para traer los proyectos. Mostrarlos en forma de tarjetas (cards), una abajo de la otra. Al hacer click en una tarjeta, te debe redirigir al detalle de ese proyecto.

Cita / Criterios: > "- Mientras se obtienen los datos... se debe informar que los datos están siendo cargados (un spinner o texto de 'Cargando...').

- Si no existen proyectos, se debe informar que no hay proyectos asignados.
- Al clickear sobre un proyecto, debe navegarse a la vista detallada."

📒 Detalle de un Proyecto / Listado de Épicas (Punto 6)
¿Qué hacer?: Mostrar la descripción del proyecto que seleccionaste y abajo listar todas las "Epics" (Épicas) que le pertenecen a ese proyecto.

Cita / Criterios: > "La vista de epics de un proyecto n debe ser accesible desde /my-projects/project-n... Mientras se obtienen los datos del listado, se debe informar que los datos están siendo cargados."

⭐ Detalle de una Épica / Listado de Stories (Punto 7)
¿Qué hacer?: Mostrar la información de la Épica en la cabecera y listar las "User Stories" (Historias de usuario) que tiene adentro. Cada Story puede mostrar sus puntos, estado (todo, running, done), etc.

Cita / Criterios: > "La pantalla de un Epic K con su listado de stories también debe mostrar info de este epic... Si no existen epics [aquí se refiere a stories], debe informarse de esto a la persona usuaria."

💬 Detalle de una Story / Listado de Tareas (Punto 8, 12 y 13)
¡Atención aquí! Esta es la pantalla con más interacción porque acá SÍ tenés que agregar y eliminar cosas individualmente.

¿Qué hacer?: 1.  Mostrar el listado de Tareas (Tasks) de esa Story indicando si están hechas o no (done: true/false).
2.  Agregar Tarea (Punto 12): Poner un botón arriba que abra un formulario (puede ser un modal/diálogo). El campo name es obligatorio y description debe tener mínimo 10 caracteres. Mientras se guarda en la API, mostrar un texto de "Creando tarea...".
3.  Eliminar Tarea (Punto 13): Cada tarjeta de tarea debe tener un botón de borrar. Al tocarlo, debe saltar un cartel de confirmación ("¿Estás seguro?"). Si dice que sí, se borra en la API y desaparece de la pantalla.

4. Autenticación y Conexión Real (Puntos 14 y 15)
Al principio podés usar datos falsos (mocks) para armar los diseños, pero al final tenés que conectar todo a la API real.

La URL base de la API es: https://lamansysfaketaskmanagerapi.onrender.com/api

El Login (Punto 15): * Si el usuario entra a la app y no está logueado, lo tenés que mandar automáticamente a /login.

El formulario pide username y password. Ambos campos son obligatorios y deben tener mínimo 4 caracteres. Si hay un error, el mensaje debe ir abajo de cada input.

Al apretar "Ingresar", llamás al endpoint de /login. Si es exitoso, guardás el token JWT que te devuelve la API (por ejemplo, en el localStorage) para que la sesión no se cierre al reiniciar la página.

Cita / Criterios: > "La sesión del usuario debe mantenerse siempre en el dispositivo a menos que se cierre la sesión explícitamente... Los campos de las credenciales son obligatorios y con un mínimo de 4 caracteres."

🛠️ Tu Plan de Acción Sugerido
Para que no te estreses, te recomiendo seguir este orden:

Paso 1: Configurar las rutas con react-router-dom y crear componentes vacíos para cada pantalla.

Paso 2: Diseñar el Layout global: El encabezado con el menú hamburguesa, la flecha de volver atrás y el menú lateral.

Paso 3: Crear la pantalla de Login y la lógica para guardar el token (puedes usar un Contexto de React para el estado del usuario).

Paso 4: Armar las pantallas de Proyectos ➡️ Épicas ➡️ Stories consumiendo los datos de la API (con sus estados de "Cargando" y "Vacío").

Paso 5: Dedicarle tiempo a la pantalla de Tareas, programando los formularios de agregar y eliminar tareas con sus respectivas validaciones.