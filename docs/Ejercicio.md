# Mi Ecommerce Sprint 4

<aside>
✅ **¿Qué necesitas saber?**

Para poder completar este sprint debes haber pasado por **Sprint 3 (Persistencia con SQLite)**, conocer el uso de controladores, servicios y el manejo de respuestas en formato JSON (`res.json()`).

</aside>

<aside>
🎯 **Objetivos**

Exponer los datos de la aplicación a través de un conjunto de endpoints de estilo RESTful bajo la ruta base `/api/`. La API utilizará la misma capa de servicios e infraestructura SQL desarrollada en el Sprint 3, pero respondiendo en formato JSON para dar soporte a aplicaciones cliente externas (como el Dashboard administrativo del Sprint 5).

</aside>

<aside>
🔧 Para completar este Sprint, sólo necesitas contar con una computadora y conexión a internet.

</aside>

<aside>
🚨

**Pautas**

Los criterios que se tendrán en cuenta al analizar los resultados del Sprint son los siguientes:

**♻️ Reutilización de código (DRY).** No debes duplicar consultas SQL ni lógica de negocio. Los nuevos controladores API deben importar y consumir los servicios existentes en `services/productsService.js` (y servicios asociados).

**📦 Formato Estándar:** Todas las rutas de la API deben responder con objetos o arrays JSON y códigos de estado HTTP apropiados (`200 OK`, `201 Created`, `400 Bad Request`, `404 Not Found`, `500 Internal Server Error`).

**🌐 Habilitación de CORS:** Se debe configurar la API para permitir peticiones de origen cruzado.

💪 Debe existir el progreso individual, es decir, esperamos que cada persona del equipo de desarrollo produzca una parte del proyecto.

🤝 Debe existir trabajo colaborativo. Esperamos que apliquen las metodologías aprendidas para fortalecer el avance conjunto y la división de trabajo.

✅ Revisaremos que hagas uso de buenas prácticas de programación y que el código Javascript sea correcto, completo, ordenado y elegante.

🎖️El producto obtenido al final del Sprint debe cumplir con los requisitos funcionales que se piden.

</aside>

<aside>
🗒️ **Nota importante**
Podes trabajar de forma individual o grupal. Pero en cualquier caso la entrega será personal. Si hay alguna tarea o concepto mencionado que no conoces o no entiendes, es necesario que lo informes cuanto antes para poder obtener asistencia.

</aside>

<aside>
📦 **Entregable**
Se espera la entrega de un repositorio Git con el código producido. Se valorará el trabajo en ramas.

</aside>

---

# **Transición formal del Monolito SSR a Arquitectura que provee datos**

Este sprint marca el momento en que tu backend deja de ser únicamente un servidor de vistas EJS y pasa a comportarse como un **proveedor de datos**. Armaremos una pseudo API REST que será consumida por el Dashboard administrativo del Sprint 5 y por cualquier cliente externo que necesite acceder a los recursos del sistema.

La clave de este sprint es **no duplicar lógica**, **no mezclar responsabilidades** y **no romper la arquitectura del Sprint 3**.
Tu backend ahora tendrá **dos capas de salida**:

- **SSR (EJS)** → vistas tradicionales.
- **API REST (JSON)** → endpoints para clientes externos.

# **Requerimientos Técnicos Básicos**

1. Configurar Middleware para interpretar JSON en el body (`express.json()`).
2. Configurar el paquete `cors` en Express para permitir consultas desde clientes frontend (por ejemplo el dashboard que haremos con React).
3. Crear una estructura de ruteo dedicada para la API (por ejemplo `routes/api/productsApiRoutes.js` o `routes/apiRoutes.js`).
4. Reutilizar la capa de `services` para obtener/manipular la base de datos SQLite.

# Requerimientos del Sprint

Para dar cumplimiento a estas tareas y lograr el objetivo del sprint sin perder de vista nuestro enfoque en las personas usuarias, vamos a trabajar con *User Stories* que nos ayudarán a cumplir estos requisitos funcionales.

<aside>
⚠️

Es importante que, cada persona en conjunto con su equipo, estime el tiempo de trabajo requerido en cada User Story para poder evaluar, durante el ciclo de trabajo y al finalizar el Sprint, cómo fue la estimación.

</aside>

<aside>
⚠️

En las US que mencionan la creación de un **servicio**, podes optar por integrar esa lógica en los **controllers**.

</aside>


## **User Story #1 — Configuración del Servidor para API (CORS y Middlewares)**

<aside>
🤝

Es recomendable trabajar esta story de forma colaborativa, usando las rutas como subtareas o pasos necesarios para completarla.

</aside>

**Código:** `#main-s4-us1`

**Nombre:** Configuración del Servidor API

### Detalle

Como desarrollador/a frontend, necesito que el servidor backend procese peticiones en formato JSON y acepte solicitudes de otros dominios/puertos para poder consumir la API desde una aplicación React sin bloqueos de seguridad.

### Requerimientos

- Instalar y configurar el paquete `cors`.
- Asegurar el uso de `app.use(express.json())` en `app.js` / `server.js`.
- Crear el prefijo de rutas `/api` para agrupar todas las salidas JSON.

### Validación

- Las peticiones externas desde otros puertos no generan errores de CORS en el navegador.
- El body con formato JSON es parseado correctamente en peticiones `POST` y `PUT`.


## **User Story #2 — Endpoints API de Productos**

<aside>
🤝

Es recomendable trabajar esta story de forma colaborativa, usando las rutas como subtareas o pasos necesarios para completarla.

</aside>

**Código:** `#main-s4-us2`

**Nombre:** API Rest de Productos

### Detalle

Como sistema cliente, necesito endpoints HTTP para consultar, crear, modificar y eliminar productos.

### Rutas Requeridas

| **Método** | **Ruta** | **Descripción** | **Estado Exitoso** |
| --- | --- | --- | --- |
| `GET` | `/api/products` | Devuelve el listado completo de productos en JSON | `200 OK` |
| `GET` | `/api/products/:id` | Devuelve el detalle de un producto específico | `200 OK` (ó `404`) |
| `POST` | `/api/products` | Registra un nuevo producto recibiendo JSON en el body | `201 Created` |
| `PUT` | `/api/products/:id` | Actualiza los datos de un producto existente | `200 OK` |
| `DELETE` | `/api/products/:id` | Elimina un producto por su ID | `200 OK` / `204 No Content` |

### Validación

- `GET /api/products` devuelve una estructura JSON legible con la lista de productos obtenida desde SQLite.
- Si un ID no existe en `GET /api/products/:id`, se devuelve un estado HTTP `404` con un mensaje JSON `{ "error": "Producto no encontrado" }`.
- La creación, actualización y eliminación modifican la base de datos SQLite llamando a los métodos del servicio.



## **User Story #3 — Endpoints API de Categorías**

<aside>
🤝

Es recomendable trabajar esta story de forma colaborativa, usando las rutas como subtareas o pasos necesarios para completarla.

</aside>

**Código:** `#main-s4-us3`

**Nombre:** API Rest de Categorías

### Detalle

Como sistema cliente, necesito endpoints para consultar y gestionar el listado de categorías disponibles.

### Rutas Requeridas

| **Método** | **Ruta** | **Descripción** | **Estado Exitoso** |
| --- | --- | --- | --- |
| `GET` | `/api/categories` | Devuelve el listado de categorías en JSON | `200 OK` |
| `GET` | `/api/categories/:id` | Devuelve los detalles de una categoría | `200 OK` |
| `POST` | `/api/categories` | Registra una nueva categoría | `201 Created` |
| `PUT` | `/api/categories/:id` | Modifica una categoría | `200 OK` |
| `DELETE` | `/api/categories/:id` | Elimina una categoría | `200 OK` |

### Validación

- Todas las respuestas entregan datos JSON consultados directamente desde la base de datos relacional.


## **User Story #4 — Endpoint de Estadísticas / Resumen para Dashboard (Home)**

<aside>
🤝

Es recomendable trabajar esta story de forma colaborativa, usando las rutas como subtareas o pasos necesarios para completarla.

</aside>

**Código:** `#main-s4-us4`

**Nombre:** API de Métricas Generales

### Detalle

Como administrador/a de la tienda, necesito un endpoint que me entregue el conteo total de productos y categorías para alimentar las tarjetas métricas de la pantalla principal del Dashboard.

### Rutas Requeridas

- `GET /api/stats` (o en su defecto que `/api/products` y `/api/categories` retornen metadatos con el conteo total).

### Validación

- Retorna un objeto JSON con la estructura:
    
    ```json
    { "totalProducts": X, "totalCategories": Y }
    ```



# 🛟 Ayuda para encarar este Sprint

## **¿Cómo estructurar la API sin repetir código?**

1. **No toques tus controladores existentes de EJS:** Esos controladores pertenecen al frontend servido por el servidor (SSR).
    
    ```jsx
    // Controlador EJS
    getDetail: (req, res) => {
      const product = productsService.getById(req.params.id);
      res.render('productDetail', { product });
    }
    ```
    
2. **Crea nuevos controladores API:** Crea una carpeta para los controladores nuevos
    
    ```
    controllers/api/productsApiController.js
    controllers/api/categoriesApiController.js
    ```
    
    Ejemplo:
    
    ```jsx
    // Controlador API
    getDetailApi: (req, res) => {
      const product = productsService.getById(req.params.id);
    
      if (!product) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }
    
      res.json(product);
    }
    ```
    
3. **Reutiliza los servicios:** En tus controladores API, importa los mismos servicios de la base de datos (`productsService.js`). 
    1. No se debe escribir SQL nuevo.
    2. No se debe duplicar lógica.
    3. No se debe consultar la base de datos desde los controladores.
    
    Los controladores API deben usar:
    
    ```
    services/productsService.js
    services/categoriesService.js
    ```
    
4. **Cambia la respuesta:** En lugar de hacer `res.render('products/detail', { product })`, hacé `res.json(product)`. La API no renderiza vistas, la API solo devuelve JSON.

## ¿Cómo usar servicios?

A continuación, tenemos una pequeña explicación con un ejemplo **completo, claro y didáctico** para **crear la capa de servicios** desde cero, sin duplicar SQL y sin mezclar responsabilidades. Este ejemplo está pensado para quienes **no hicieron servicios en el Sprint 3** o los hicieron de forma incompleta.

### 🌱 **Qué es un Service y por qué existe**

Un **service** es una capa intermedia entre los controladores y la base de datos.
Su función es:

- encapsular la lógica de acceso a datos,
- evitar SQL repetido en controladores,
- centralizar reglas de negocio,
- permitir que la API y el SSR usen la misma lógica,

Sin services:

- los controladores se llenan de SQL,
- se repite código en cada ruta,
- la arquitectura se vuelve inmantenible.

Con services:

- los controladores solo coordinan,
- la lógica de negocio vive en un solo lugar,
- la API y el SSR comparten la misma base de código.

### 📁 **Estructura recomendada**

```
/db
    db.js
/services
    productsService.js
    categoriesService.js
/controllers
    /api
        productsApiController.js
        categoriesApiController.js
```

### 🧩 **Ejemplo completo con `productsService.js`**

```jsx
// services/productsService.js
const db = require('../db/db');

// ⚠️ Todos los métodos del service devuelven datos puros (objetos, arrays)

const productsService = {
  getAll() {
    const stmt = db.prepare('SELECT * FROM products');
    return stmt.all();
  },
  getById(id) {
    const stmt = db.prepare('SELECT * FROM products WHERE id = ?');
    return stmt.get(id);
  },
  create(data) {
    const stmt = db.prepare(`
      INSERT INTO products (name, price, category_id)
      VALUES (?, ?, ?)
    `);
    const result = stmt.run(data.name, data.price, data.category_id);
    // Devuelvo el producto recién creado
    return this.getById(result.lastInsertRowid);
  },
  update(id, data) {
    const stmt = db.prepare(`
      UPDATE products
      SET name = ?, price = ?, category_id = ?
      WHERE id = ?
    `);
    stmt.run(data.name, data.price, data.category_id, id);
    return this.getById(id);
  },
  delete(id) {
    const stmt = db.prepare('DELETE FROM products WHERE id = ?');
    return stmt.run(id);
  },

  count() {
    const stmt = db.prepare('SELECT COUNT(*) AS total FROM products');
    return stmt.get().total;
  }
};

module.exports = productsService;
```

### 🔌 ¿**Cómo se usa desde un controlador API?**

```jsx
// controllers/api/productsApiController.js
const productsService = require('../../services/productsService');

const productsApiController = {
  getAll: (req, res) => {
    const products = productsService.getAll();
    res.json(products);
  },
  getById: (req, res) => {
    const product = productsService.getById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(product);
  },
  create: (req, res) => {
    const newProduct = productsService.create(req.body);
    res.status(201).json(newProduct);
  },
  update: (req, res) => {
    const product = productsService.getById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    const updated = productsService.update(req.params.id, req.body);
    res.json(updated);
  },
  delete: (req, res) => {
    const product = productsService.getById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    productsService.delete(req.params.id);
    res.status(204).send();
  }
};

module.exports = productsApiController;
```

### ❌ Errores típicos y cómo evitarlos

#### **1. Escribir SQL dentro del controlador**

Error: rompe la arquitectura y duplica lógica.

Solución: todo SQL va en `/services`.

#### **2. Devolver res.render() en la API**

Error: olvidar que la API no renderiza vistas.

Solución: siempre `res.json()`.

#### **3. No validar si el ID existe**

Error: `GET` `/api/products/999` devuelve `undefined`.

Solución: devolver 404 con JSON.

#### **4. No usar express.json()**

Error: `req.body` llega vacío.

Solución: `app.use(express.json())`.

#### **5. No usar CORS**

Error: React bloquea las peticiones.

Solución: `app.use(cors())`.

# Próximos pasos…

Este sprint prepara la infraestructura para el siguiente que la convierte nuestra aplicación gracias a una interfaz profesional y escalable.

El próximo paso natural después de este sprint es construir un **Dashboard administrativo en React** que consuma esta API y convierta nuestro backend en un verdadero proveedor de datos desacoplado. 

A partir de ahora, la aplicación deja de depender de vistas EJS y pasa a funcionar como un **frontend SPA** que obtiene toda la información mediante `fetch()` hacia los endpoints `/api/products`, `/api/categories` y `/api/stats`. 

Esto habilita métricas en tiempo real, tablas dinámicas, formularios de creación/edición totalmente interactivos y una experiencia de administración moderna. 

El Sprint 5 se centra en esa integración: montar un proyecto React, crear componentes que representen cada sección del panel, y conectar esos componentes con la API mediante hooks personalizados, loaders o contextos globales.