# Defensa STP2

## 1. Que representa esta rama

La rama `Web-1-STP2` representa un sprint donde el proyecto consolida una arquitectura **SSR con Express + EJS**, pero todavia sin base de datos ni API externa.

La fuente de datos principal sigue siendo local y mockeada:

- `models/productModel.js`

La idea general de esta rama es:

- ordenar el proyecto hacia MVC,
- mejorar navegacion y manejo de errores,
- hacer funcional el carrito en sesion,
- completar el flujo de catalogo y detalle,
- agregar servicios para encapsular logica,
- sostener todo con render server-side y componentes EJS reutilizables.

En STP2 no se defiende una integracion SQL como en STP3. Aca lo fuerte es otra cosa:

- **arquitectura MVC parcial pero consistente,**
- **sesion para persistencia temporal,**
- **encapsulacion de logica en servicios,**
- **vistas reutilizables con Atomic Design,**
- **sin depender de frontend cliente complejo ni APIs externas.**

---

## 2. Arquitectura global del proyecto

### Flujo tecnico general

```text
Cliente -> app.js -> route -> controller -> service -> model mock
Cliente <- render EJS <- route <- datos preparados
```

### Capas reales del proyecto

- `app.js`
  Configura Express, middlewares, sesion, estaticos, rutas y errores.

- `routes/`
  Define endpoints por seccion: home, productos, categorias, carrito, login, register, search, checkout y account.

- `controllers/`
  Actua como capa delgada que delega al servicio correspondiente.

- `services/`
  Contiene la logica real de productos y carrito.

- `models/`
  Provee el dataset local con productos, categorias y publicidades.

- `views/`
  Renderiza HTML con EJS usando layout comun y composicion tipo Atomic Design.

### Archivos mas importantes

- `app.js`
- `models/productModel.js`
- `services/productsService.js`
- `services/cartService.js`
- `routes/productos.router.js`
- `routes/cart.router.js`
- `views/layouts/main.ejs`
- `views/partials/templates/auth-temp.ejs`

---

## 3. Punto de entrada y conexion entre modulos

El archivo central es `app.js`.

### Que hace

- activa EJS,
- publica `/public`, `/styles`, `/assets` y `/scripts`,
- parsea formularios y JSON,
- crea la sesion con `express-session`,
- calcula el contador global del carrito,
- conecta todos los routers,
- define middleware 404 y 500.

### Lineas claves

- `app.js:13-16`
  Configuracion del motor de vistas.

- `app.js:19-26`
  Publicacion de recursos estaticos.

- `app.js:31-38`
  Configuracion de `express-session`.

- `app.js:39-44`
  Middleware global que calcula `cartItemCount`.

- `app.js:60-79`
  Conexion de routers.

- `app.js:82-95`
  Manejo de errores 404 y 500.

### Como defenderlo

> `app.js` no resuelve negocio. Solo actua como orquestador de infraestructura y deja que cada modulo haga su trabajo especifico.

---

## 4. Fuente de datos en STP2

La fuente de datos del sprint es local y vive en:

- `models/productModel.js`

### Que contiene

- `productos`
- `publicidades`
- `categorias`

### Por que es importante

Porque todo el proyecto esta pensado para SSR sin dependencia externa:

- no usa fetch,
- no usa API REST,
- no usa DB,
- no usa frontend state complejo.

Eso hace que las integraciones pedidas por las user stories se materialicen por composicion server-side y por transformacion de datos dentro de servicios.

### Lineas claves

- `models/productModel.js:1-45`
  Dataset de productos.

- `models/productModel.js:47-60`
  Banners/publicidades.

- `models/productModel.js:62-72`
  Categorias.

---

## 5. Servicios: donde vive la logica real

Uno de los cambios mas importantes de STP2 es que la logica ya no queda desparramada en rutas o vistas.

## `services/productsService.js`

Concentra:

- listado completo,
- sugeridos,
- mas pedidos,
- detalle por id,
- relacionados,
- aleatorios,
- filtro por categoria,
- normalizacion de ids,
- orden por precio,
- busqueda por nombre,
- fallback de imagen.

### Lineas claves

- `services/productsService.js:5-10`
  Fallback de imagen.

- `services/productsService.js:16-18`
  Productos sugeridos.

- `services/productsService.js:20-28`
  Productos mas pedidos.

- `services/productsService.js:30-34`
  Detalle por id.

- `services/productsService.js:36-46`
  Productos relacionados.

- `services/productsService.js:54-72`
  Normalizacion y filtro por categoria.

- `services/productsService.js:74-88`
  Normalizacion de ids.

- `services/productsService.js:90-103`
  Orden por precio.

- `services/productsService.js:105-115`
  Busqueda por nombre.

## `services/cartService.js`

Concentra:

- inicializacion del carrito en sesion,
- armado del carrito visible,
- agregado de productos,
- aumento/disminucion de cantidad,
- eliminacion,
- vaciado,
- calculo de subtotal y total.

### Lineas claves

- `services/cartService.js:3-9`
  Inicializacion defensiva del carrito.

- `services/cartService.js:11-30`
  Construccion de una linea del carrito a partir de `productId`.

- `services/cartService.js:33-48`
  Calculo del resumen.

- `services/cartService.js:55-79`
  Alta de producto.

- `services/cartService.js:81-95`
  Cambio de cantidad.

- `services/cartService.js:98-105`
  Eliminacion y vaciado.

### Como defenderlo

> En STP2 el gran salto arquitectonico no es la persistencia, sino haber extraido la logica de negocio a servicios reutilizables. Eso deja las rutas mas limpias y prepara una futura migracion a DB.

---

## 6. Controllers: capa delgada pero util

Los controladores de esta rama son deliberadamente livianos:

- `controllers/productController.js`
- `controllers/cartController.js`

### Que hacen

Principalmente delegan a los servicios.

### Por que sigue siendo correcto

Porque mantienen separadas:

- la capa HTTP,
- la logica de negocio,
- la fuente de datos.

### Lineas claves

- `controllers/productController.js:3-41`
- `controllers/cartController.js:3-29`

### Forma de explicarlo

> Aunque los controladores hoy sean thin wrappers, cumplen una funcion de frontera entre rutas y negocio. Esto evita acoplar las rutas directamente a la capa de datos o a la transformacion de informacion.

---

## 7. Flujo funcional completo del proyecto

### Home

Ruta:

- `/`
- `/index`
- `/home`

### Flujo

1. `app.js` deriva a `routes/index.router.js`.
2. La ruta toma `publicidades` y `categorias` del modelo.
3. Pide `suggestedProducts` y `topOrderedProducts` al controller.
4. Renderiza `views/pages/home/home-page.ejs`.

### Lineas claves

- `routes/index.router.js:12-22`
- `views/pages/home/home-page.ejs:1-27`
- `views/partials/pages/home-content.ejs:1-4`

### Detalle importante

La Home integra varias user stories juntas:

- sugeridos,
- mas pedidos,
- categorias,
- header con buscador,
- contador de carrito.

---

### Listado de productos

Ruta:

- `/products`

### Flujo

1. Lee `req.query.sort`.
2. Llama a `getProductsSortedByPrice`.
3. Renderiza `products-list-page`.

### Lineas claves

- `routes/productos.router.js:18-27`
- `views/partials/pages/products-list-content.ejs:1-19`

---

### Detalle de producto

Ruta:

- `/products/:id`
- alias historico: `/producto/:id`

### Flujo

1. La ruta normaliza el id.
2. Si el formato es invalido, responde `400`.
3. Si el producto existe, renderiza detalle.
4. Si no existe, responde `404` con sugerencias aleatorias.

### Lineas claves

- `routes/productos.router.js:30-57`
- `services/productsService.js:74-88`
- `services/productsService.js:30-34`
- `services/productsService.js:36-46`
- `views/partials/pages/product-detail-content.ejs:1-8`
- `views/partials/molecules/product/product-info.ejs:1-19`

### Que defender

> El detalle no solo muestra informacion: tambien maneja correctamente errores 400 y 404, y suma descubrimiento mediante relacionados.

---

### Categoria

Ruta:

- `/categories/:category`
- alias: `/category/:category`

### Flujo

1. La ruta toma el slug.
2. Lo decodifica y reemplaza guiones por espacios.
3. Normaliza tildes y mayusculas.
4. Filtra productos por categoria.
5. Renderiza una vista con la categoria visible y estado vacio amigable.

### Lineas claves

- `routes/categories.router.js:12-18`
- `routes/categories.router.js:20-41`
- `services/productsService.js:54-72`
- `views/partials/pages/category-content.ejs:1-7`

---

### Busqueda

Ruta:

- `/search?query=...`

### Flujo

1. El navbar envia un formulario GET.
2. La ruta lee `query`.
3. El service filtra por coincidencia parcial case-insensitive.
4. La vista muestra resultados o estado vacio.

### Lineas claves

- `routes/search.router.js:11-20`
- `services/productsService.js:105-115`
- `views/partials/pages/search-results-content.ejs:1-8`
- `views/partials/organisms/home/navbar.ejs:8-10`

---

### Carrito

Ruta base:

- `/cart`

### Acciones

- `GET /cart`
- `POST /cart/items`
- `POST /cart/items/:productId/increase`
- `POST /cart/items/:productId/decrease`
- `POST /cart/items/:productId/remove`
- `POST /cart/clear`

### Flujo

1. La sesion guarda solo `{ productId, quantity }`.
2. Al renderizar, el service cruza eso con el modelo de productos.
3. Calcula subtotal, total y totalItems.
4. La vista arma el carrito final.

### Lineas claves

- `routes/cart.router.js:12-52`
- `services/cartService.js:11-48`
- `services/cartService.js:55-105`
- `views/partials/molecules/home/product-card.ejs:18-25`
- `views/partials/molecules/product/product-info.ejs:11-18`
- `views/partials/pages/cart-content.ejs:1-4`

### Punto fuerte

> Aunque STP2 no usa DB, el carrito ya esta bien modelado porque la sesion guarda lo minimo y el detalle visible se recompone desde la fuente real de productos.

---

## 8. Layouts y composicion visual

El proyecto usa una organizacion inspirada en Atomic Design:

- `atoms`
- `molecules`
- `organisms`
- `templates`
- `pages`

## Layout principal

Archivo:

- `views/layouts/main.ejs`

### Que hace

- define la estructura HTML base,
- carga estilos comunes,
- monta el navbar,
- inserta el contenido variable,
- agrega footer.

### Lineas claves

- `views/layouts/main.ejs:21-25`
  Permite inyectar estilos extra por pagina.

- `views/layouts/main.ejs:28-35`
  Inserta navbar y `contentPartial`.

## Layout de auth

Archivo:

- `views/partials/templates/auth-temp.ejs`

### Que hace

- deja login/register fuera del layout principal,
- monta header y footer,
- inyecta el organismo de auth,
- permite cargar script por pagina.

### Lineas claves

- `views/partials/templates/auth-temp.ejs:13-18`
- `views/partials/templates/auth-temp.ejs:23-25`

### Por que importa

Esta separacion responde directo a la user story del layout base:

- las paginas principales usan `main.ejs`,
- login y register quedan fuera, como se pedia.

---

## 9. Integracion de las User Stories con el codigo

## US1 - Reordenar proyecto

Se materializa en:

- `app.js`
- `models/productModel.js`
- `controllers/`
- `services/`
- `routes/`
- `views/` y `public/styles/` por Atomic Design

Estado:

- cumplida como migracion consistente hacia MVC.

## US2 - Pagina 404

Se materializa en:

- `app.js:82-85`
- `views/pages/404/404-page.ejs`
- `views/partials/pages/error-content.ejs`

Estado:

- cumplida.

## US3 - Validacion de registro

Se materializa en:

- `routes/register.router.js:44-141`
- `public/scripts/register-validation.js:1-125`
- `views/pages/register/register-page.ejs`
- `views/partials/organisms/auth/auth-org.ejs`

Integracion real:

- frontend valida antes del submit,
- backend vuelve a validar,
- si falla, responde `422` con feedback visual.

Estado:

- cumplida dentro del alcance mock.

## US4 - Carrito en sesion

Se materializa en:

- `app.js:31-44`
- `routes/cart.router.js`
- `services/cartService.js`

Integracion real:

- sesion para persistencia temporal,
- forms SSR desde cards y detalle,
- render del carrito a partir del estado de sesion.

Estado:

- cumplida.

## US5 - Checkout temporal

Se materializa en:

- `routes/checkout.router.js:4-6`
- `views/pages/checkout/checkout-page.ejs`
- `views/partials/pages/checkout-content.ejs`
- `views/partials/organisms/checkout/checkout-temporary.ejs`

Estado:

- cumplida como placeholder intencional.

## US6 - Productos sugeridos

Se materializa en:

- `services/productsService.js:16-18`
- `routes/index.router.js:12-22`
- `views/partials/pages/home-content.ejs:1-2`

Estado:

- cumplida.

## US7 - Mas pedidos

Se materializa en:

- `models/productModel.js` con `isTopSeller`
- `services/productsService.js:20-28`
- `views/partials/pages/home-content.ejs:3`

Estado:

- cumplida.

## US8 - Relacionados

Se materializa en:

- `services/productsService.js:36-46`
- `routes/productos.router.js:42-49`
- `views/partials/pages/product-detail-content.ejs:3-8`

Estado:

- cumplida.

## US9 - Detalle de producto

Se materializa en:

- `routes/productos.router.js:30-57`
- `services/productsService.js:30-34`
- `views/partials/molecules/product/product-info.ejs`

Estado:

- cumplida con 404 real cuando no existe.

## US10 - Categoria

Se materializa en:

- `routes/categories.router.js`
- `services/productsService.js:62-72`
- `views/pages/category/category-products-page.ejs`

Estado:

- cumplida.

## US11 - Sin stock

Se materializa en:

- `views/partials/molecules/home/product-card.ejs:2-24`
- `views/partials/molecules/product/product-info.ejs:2-17`
- `services/cartService.js:63-68`

Integracion real:

- vista bloquea el boton,
- backend rechaza el agregado.

Estado:

- cumplida.

## US12 - Total del carrito en header

Se materializa en:

- `app.js:39-44`
- `views/partials/organisms/home/navbar.ejs:2-18`

Estado:

- cumplida.

## US13 - Pagina 500

Se materializa en:

- `app.js:87-95`
- `views/pages/500/500-page.ejs`

Estado:

- cumplida.

## US14 - Layout base

Se materializa en:

- `views/layouts/main.ejs`
- paginas principales que incluyen ese layout

Estado:

- cumplida.

## US15 - Servicio de productos

Se materializa en:

- `services/productsService.js`
- `controllers/productController.js`

Estado:

- cumplida.

## US16 - Servicio del carrito

Se materializa en:

- `services/cartService.js`
- `controllers/cartController.js`

Estado:

- cumplida.

## US17 - Normalizacion de IDs

Se materializa en:

- `services/productsService.js:74-88`
- `routes/productos.router.js:31-38`
- `views/pages/400/400-page.ejs`

Estado:

- cumplida.

## US18 - Orden por precio

Se materializa en:

- `services/productsService.js:90-103`
- `routes/productos.router.js:18-27`
- `views/partials/pages/products-list-content.ejs:1-11`

Estado:

- cumplida.

## US19 - Buscador

Se materializa en:

- `services/productsService.js:105-115`
- `routes/search.router.js:11-20`
- `views/partials/molecules/home/search-bar.ejs`
- `views/pages/search/search-results-page.ejs`

Estado:

- cumplida.

---

## 10. Integraciones importantes entre historias

Lo mejor de STP2 no es solo que haya 19 historias, sino que varias quedaron conectadas entre si.

### Integracion 1: Home + catalogo + detalle

US6, US7, US8, US9, US10, US18 y US19 se conectan asi:

- Home muestra sugeridos y mas pedidos.
- Cada card navega a `/products/:id`.
- El detalle usa ese id, valida el formato y muestra relacionados.
- El catalogo general permite ordenar.
- El buscador y las categorias reutilizan la misma card y el mismo grid.

### Integracion 2: Carrito persistente en navegacion

US4, US11, US12 y US16 se conectan asi:

- cualquier card puede agregar al carrito,
- el detalle tambien puede agregar,
- el badge del navbar se actualiza desde sesion,
- el carrito renderiza totales y acciones,
- si el producto no tiene stock, se bloquea en UI y backend.

### Integracion 3: Errores y semantica HTTP

US2, US13 y US17 se conectan asi:

- rutas inexistentes -> `404`
- id mal formado -> `400`
- error interno -> `500`

Eso demuestra que no se resolvio todo con redirecciones silenciosas.

### Integracion 4: Layout y experiencia uniforme

US1 y US14 se conectan asi:

- layout principal para casi todo el sitio,
- auth con template aparte,
- componentes reutilizados entre home, listado, categoria, detalle, carrito y errores.

---

## 11. Cosas buenas para remarcar en la defensa

### 1. El proyecto no depende de frontend complejo

Todo el flujo esta resuelto con SSR, formularios HTML y render EJS.

### 2. La sesion se usa con criterio

No guarda el producto completo, solo lo minimo.

### 3. Se encapsulo negocio en servicios

Eso hace que el proyecto quede listo para migrar a otra fuente de datos.

### 4. La interfaz reutiliza componentes reales

La misma card se usa en home, categorias, busqueda, listado y relacionados.

### 5. Se manejan varios estados HTTP correctamente

No todo termina en una redireccion: hay 400, 404 y 500 con vistas dedicadas.

---

## 12. Limitaciones honestas de STP2

Conviene decirlas vos antes de que te las marquen.

- no hay base de datos,
- no hay autenticacion real,
- login y register son flujos mock,
- account y checkout son mayormente pantallas de presentacion,
- no hay tests automatizados,
- `README.md` esta desactualizado en algunos detalles de estructura,
- algunos documentos de user stories pueden haber quedado atrasados respecto del codigo.

Ademas, el control de `stock` existe en logica y vistas, pero no aparece realmente en el dataset mock actual, asi que esa integracion esta preparada aunque no tenga un caso visible por defecto en todos los productos.

---

## 13. Preguntas que te pueden hacer

### "Si no hay base de datos, que valor tecnico tiene esta rama?"

Tiene valor en arquitectura y flujo: separacion por capas, SSR completo, sesion funcional, servicios reutilizables y navegacion consistente de punta a punta.

### "Por que usar services si los datos salen de un archivo?"

Porque el origen de datos puede cambiar mas adelante. Al encapsular hoy la logica en servicios, manana se puede migrar a DB sin romper rutas ni vistas.

### "Que parte del proyecto esta mejor resuelta?"

El bloque catalogo + detalle + carrito:

- `services/productsService.js`
- `services/cartService.js`
- `routes/productos.router.js`
- `routes/cart.router.js`

### "Que historias estan mas integradas entre si?"

Las del catalogo y carrito, porque comparten cards, layout, sesion, buscador, categorias y detalle.

### "Que mejorarias primero?"

1. persistencia real de usuarios y productos,
2. autenticacion real,
3. stock visible y consistente en dataset,
4. tests.

---

## 14. Mini guion para exponer STP2 en 2 minutos

> Esta rama corresponde al sprint STP2 y consolida una aplicacion SSR con Node, Express y EJS, sin base de datos ni APIs externas. La arquitectura se ordena por capas: `app.js` como entrada, `routes` para endpoints, `controllers` como capa delgada, `services` con la logica real y `models/productModel.js` como fuente de datos local.  
>  
> El catalogo ya permite sugeridos, mas pedidos, detalle por ID, productos relacionados, filtro por categoria, orden por precio y busqueda por nombre. Todo eso reutiliza componentes EJS comunes y se apoya en `productsService.js`.  
>  
> El carrito se resolvio con `express-session`: la sesion guarda solo `productId` y `quantity`, y al renderizar se reconstruye el detalle del carrito con subtotales y total. Ademas, el proyecto ya maneja `400`, `404` y `500`, y tiene un layout base comun para casi todas las paginas. El gran valor de STP2 es que deja una base tecnica limpia y escalable, aun sin persistencia real.

---

## 15. Archivos que conviene abrir en vivo

1. `app.js`
   Para mostrar middlewares, sesion, rutas y errores.

2. `models/productModel.js`
   Para mostrar la fuente local del sprint.

3. `services/productsService.js`
   Para explicar catalogo, relacionados, categorias, orden y busqueda.

4. `services/cartService.js`
   Para explicar sesion y calculo del carrito.

5. `routes/productos.router.js`
   Para mostrar `400`, `404` y detalle.

6. `routes/cart.router.js`
   Para mostrar acciones reales del usuario.

7. `views/layouts/main.ejs`
   Para defender el layout compartido.

8. `routes/register.router.js`
   Para defender la validacion combinada cliente/servidor.

---

## 16. Cierre

La mejor forma de defender STP2 es presentarlo como un sprint de consolidacion arquitectonica y funcional:

- ordena el proyecto,
- completa el flujo principal de catalogo,
- hace funcional el carrito con sesion,
- agrega errores HTTP correctos,
- encapsula logica en servicios,
- y deja el terreno listo para una futura migracion a persistencia real.

No es una rama pensada para vender "persistencia completa", sino para demostrar que el proyecto ya quedo bien estructurado, navegable y coherente de punta a punta.
