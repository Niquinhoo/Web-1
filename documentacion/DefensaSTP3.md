# Defensa STP3

## 1. Idea general del proyecto

Este proyecto implementa una aplicacion web server-side render con **Node.js + Express + EJS** orientada a un flujo tipo e-commerce/comida. El usuario puede:

- entrar a la home,
- explorar productos,
- filtrarlos por categoria,
- buscarlos por nombre,
- abrir el detalle,
- agregarlos al carrito,
- modificar cantidades dentro del carrito.

La parte mas importante para defender no es solo la UI, sino la **separacion por capas**:

- `app.js` configura el servidor y conecta todo.
- `routes/` define los endpoints HTTP.
- `controllers/` expone funciones de negocio a las rutas.
- `services/` contiene la logica real de acceso a datos y transformacion.
- `db/` inicializa SQLite, aplica esquema y hace bootstrap/migracion.
- `views/` renderiza HTML con EJS usando composicion tipo Atomic Design.

En otras palabras: la app no mezcla todo en un solo archivo. La request entra por una ruta, se apoya en servicios, consulta SQLite y finalmente renderiza una vista.

---

## 2. Arquitectura global

### Flujo tecnico resumido

```text
Cliente -> app.js -> route -> controller -> service -> SQLite
Cliente <- EJS render <- route <- datos listos <- service
```

### Punto de entrada

El archivo clave es `app.js`.

Responsabilidades principales:

- configura Express,
- activa EJS como motor de vistas,
- expone archivos estaticos,
- parsea formularios y JSON,
- crea la sesion,
- calcula el contador global del carrito,
- monta todas las rutas,
- define errores 404 y 500.

### Lineas que conviene mostrar

- `app.js:13-16`: configura EJS y la carpeta `views`.
- `app.js:19-26`: publica `public`, `styles`, `assets` y `scripts`.
- `app.js:31-38`: crea la sesion con `express-session`.
- `app.js:39-44`: calcula `res.locals.cartItemCount` a partir de la sesion.
- `app.js:60-79`: conecta las rutas por modulo.
- `app.js:82-95`: manejo centralizado de errores 404 y 500.

### Que defender aca

Una buena explicacion es:

> `app.js` actua como orquestador. No resuelve negocio de productos ni carrito; solo configura infraestructura, middlewares y delega en routers especializados.

---

## 3. Integracion con SQLite

### Que hace la capa `db/`

La integracion con SQL no esta puesta "solo para guardar datos", sino como base estable del proyecto.

### `db/database.js`

Este archivo:

1. abre o crea `db/database.db`,
2. lee `db/schema.sql`,
3. ejecuta el esquema,
4. asegura compatibilidad de la tabla `users`,
5. hace seed inicial si la base esta vacia.

### Lineas importantes

- `db/database.js:7-8`: crea la conexion con SQLite mediante `better-sqlite3`.
- `db/database.js:11-16`: carga el schema y ejecuta `ensureUsersTable` + `ensureSeedData`.

### `db/schema.sql`

Define las tablas principales:

- `categories`
- `products`
- `users`
- `orders`
- `order_items`

### Que significa eso para la defensa

Aunque hoy el flujo mas completo sea catalogo + carrito, la base ya esta pensada para crecer hacia:

- autenticacion real,
- persistencia de usuarios,
- ordenes,
- detalle de items comprados.

### Lineas importantes

- `db/schema.sql:1-16`: tablas de categorias y productos.
- `db/schema.sql:18-24`: tabla `users` con `password_hash` y `created_at`.
- `db/schema.sql:26-42`: tablas `orders` y `order_items`, que muestran la proyeccion a checkout real.

---

## 4. El "truco" mas interesante de SQL: bootstrap + migracion segura

El archivo mas defendible a nivel tecnico es `db/bootstrap.js`.

### Que problema resuelve

No asume que la base esta siempre perfecta. Si existe una tabla `users` vieja, el sistema detecta si faltan columnas o si el esquema anterior usaba `password` en vez de `password_hash`.

Si detecta un formato legacy:

1. renombra la tabla vieja,
2. crea la nueva estructura,
3. copia los datos a la nueva tabla,
4. elimina la vieja.

Esto es importante porque demuestra una decision de mantenimiento, no solo de funcionalidad.

### Lineas clave para explicar

- `db/bootstrap.js:14-19`: chequea si la tabla actual ya cumple el esquema esperado.
- `db/bootstrap.js:22-47`: hace la migracion completa dentro de una transaccion.
- `db/bootstrap.js:23`: renombra `users` a `users_legacy`.
- `db/bootstrap.js:25-31`: crea la nueva tabla con `password_hash` y `created_at`.
- `db/bootstrap.js:34-45`: migra los datos desde la tabla vieja adaptando columnas.
- `db/bootstrap.js:52-88`: hace seed de categorias y productos solo si las tablas estan vacias.

### Como explicarlo oralmente

> Uno de los puntos fuertes del proyecto es que la integracion con SQLite no solo inserta datos. Tambien contempla compatibilidad hacia atras. Si la tabla `users` tenia un formato anterior, la app la corrige automaticamente al iniciar, sin perder informacion.

Eso deja muy bien parado al proyecto porque habla de **evolucion del esquema** y **arranque idempotente**.

### `migrate.js`

`migrate.js` funciona como script manual de verificacion/migracion.

### Lineas importantes

- `migrate.js:1-5`: importa la DB y vuelve a ejecutar las garantias de bootstrap.
- `migrate.js:7-14`: imprime conteos y columnas finales para comprobar el estado de la base.

### Como venderlo

> El proyecto tiene un punto de control explicito para revisar que la migracion quedo bien y que la base contiene los datos base necesarios.

---

## 5. Flujo real de una request

### Caso 1: Home

Ruta: `/`, `/index`, `/home`

### Recorrido

1. `app.js` deriva la request a `routes/index.router.js`.
2. La ruta pide productos sugeridos y mas pedidos.
3. Tambien pide categorias y banners.
4. Renderiza `views/pages/home/home-page.ejs`.

### Archivos involucrados

- `routes/index.router.js`
- `controllers/productController.js`
- `services/productsService.js`
- `services/catalogService.js`
- `views/pages/home/home-page.ejs`
- `views/layouts/main.ejs`

### Lineas importantes

- `routes/index.router.js:12-24`: arma toda la data de home y la renderiza.
- `services/catalogService.js:4-9`: mezcla datos de SQLite (`categories`) con contenido de archivo (`publicidades`).
- `views/pages/home/home-page.ejs:1-27`: usa `main.ejs` y le inyecta el contenido de la pagina.
- `views/partials/pages/home-content.ejs:1-4`: compone hero, grillas y barra de categorias.

### Idea para defender

> La home ya refleja una arquitectura desacoplada: parte del contenido viene de base de datos y parte de contenido editorial fijo. La vista no consulta datos directamente; recibe un view model preparado por la ruta.

---

### Caso 2: Listado de productos con orden por precio

Ruta: `/products`

### Recorrido

1. La ruta lee `req.query.sort`.
2. Usa `getProductsSortedByPrice(sort)`.
3. El service traduce esa intencion a SQL con `ORDER BY price`.
4. Renderiza la pagina con el orden activo.

### Lineas importantes

- `routes/productos.router.js:17-29`: toma `sort` desde query string y renderiza listado.
- `services/productsService.js:97-105`: resuelve `asc`, `desc` o fallback a todos los productos.

### Como explicarlo

> La ruta no sabe SQL. Solo expresa la necesidad de ordenamiento. La decision concreta de consulta queda encapsulada en el service.

---

### Caso 3: Detalle de producto

Ruta: `/products/:id`

Este es uno de los mejores flujos para defender porque muestra validacion, errores y consulta relacionada.

### Recorrido

1. La ruta recibe `:id`.
2. Llama a `normalizeId`.
3. Si el id no es numerico o es invalido, responde `400`.
4. Si el id no existe en DB, responde `404` con sugerencias aleatorias.
5. Si existe, busca productos relacionados por categoria.
6. Renderiza la pagina de detalle.

### Archivos involucrados

- `routes/productos.router.js`
- `controllers/productController.js`
- `services/productsService.js`
- `views/pages/product/product-detail-page.ejs`
- `views/partials/organisms/product/product-detail.ejs`
- `views/partials/molecules/product/product-info.ejs`

### Lineas importantes

- `routes/productos.router.js:31-60`: flujo completo de validacion y render.
- `services/productsService.js:65-95`: `normalizeId` valida formato, existencia y devuelve un resultado semantico.
- `services/productsService.js:35-40`: busca relacionados por categoria excluyendo el mismo producto.
- `views/partials/molecules/product/product-info.ejs:11-18`: el boton agrega al carrito mediante `POST /cart/items`.

### Por que es importante

Porque demuestra tres cosas:

- validacion de entrada,
- manejo diferenciado de `400` y `404`,
- composicion entre backend y vista para una accion real.

### Frase util para la defensa

> En vez de asumir que cualquier `id` recibido es valido, primero lo normalizamos y validamos. Eso evita errores de negocio y permite responder distinto si el dato esta mal formado o si simplemente el producto no existe.

---

### Caso 4: Busqueda

Ruta: `/search?query=...`

### Recorrido

1. El formulario del navbar envia `GET /search`.
2. La ruta toma `req.query.query`.
3. El service ejecuta una busqueda SQL por coincidencia parcial.
4. La vista renderiza resultados.

### Lineas importantes

- `views/partials/molecules/home/search-bar.ejs:1-17`: formulario GET reutilizable desde el navbar.
- `routes/search.router.js:11-20`: toma el query y renderiza resultados.
- `services/productsService.js:108-114`: usa `LIKE` con `LOWER(...)` para busqueda case-insensitive.

### Que defender

> La busqueda no esta hardcodeada en la vista. La UI solo envia el parametro; la logica de coincidencia parcial queda encapsulada en SQL.

---

### Caso 5: Filtro por categoria

Ruta: `/categories/:category`

### Recorrido

1. La ruta recibe un slug.
2. Lo decodifica y reemplaza guiones/underscores por espacios.
3. Normaliza tildes y mayusculas.
4. Filtra productos por categoria.
5. Busca el nombre "visible" de la categoria para mostrarlo prolijo.

### Lineas importantes

- `routes/categories.router.js:12-18`: formatea el slug recibido.
- `routes/categories.router.js:20-26`: normaliza tildes y mayusculas.
- `routes/categories.router.js:28-42`: busca productos y renderiza la categoria.
- `services/productsService.js:47-63`: reutiliza la misma normalizacion para comparar categorias.

### Que tiene de bueno

Es un detalle fino de UX y robustez. Soporta diferencias entre:

- URL amigable,
- nombre persistido en DB,
- nombre mostrado en pantalla.

### Frase util

> Implementamos una normalizacion de categoria para desacoplar la URL del texto exacto guardado en base. Asi se toleran tildes, mayusculas y formatos distintos sin romper el filtro.

---

### Caso 6: Carrito con sesion + DB

Este es el flujo funcional mas rico del proyecto.

### Idea central

La sesion **no guarda el producto completo** ni el precio. Solo guarda:

- `productId`
- `quantity`

Despues, para construir el carrito visible, la app vuelve a consultar el producto real en SQLite.

Eso es una decision importante porque evita duplicar datos inconsistentes en sesion.

### Donde se ve eso

### En `services/cartService.js`

- `cartService.js:3-9`: inicializa `session.cart`.
- `cartService.js:11-32`: arma cada item del carrito consultando el producto real.
- `cartService.js:20-21`: el precio real sale de DB, no de sesion.
- `cartService.js:35-50`: calcula subtotal, total y cantidad total.
- `cartService.js:57-85`: agrega un producto validando antes que exista.
- `cartService.js:74-81`: guarda en sesion solo id y cantidad.
- `cartService.js:87-103`: cambia cantidades y elimina si queda en cero.

### En `routes/cart.router.js`

- `cart.router.js:31-39`: renderiza el carrito cruzando sesion con productos.
- `cart.router.js:42-57`: agrega item validando `productId`.
- `cart.router.js:59-89`: incrementa, decrementa o elimina.
- `cart.router.js:92-94`: vacia todo el carrito.

### En las vistas

- `views/partials/molecules/home/product-card.ejs:18-25`: formulario para agregar al carrito desde cards.
- `views/partials/molecules/product/product-info.ejs:11-18`: formulario para agregar desde el detalle.
- `views/partials/molecules/cart/cart-item.ejs:21-23`: elimina una linea del carrito.

### Por que esta decision es importante

Este es probablemente el mejor argumento tecnico del proyecto:

> La sesion se usa como almacenamiento temporal minimo, mientras que la verdad del producto sigue estando en la base de datos.

Ventajas:

- evita guardar precios manipulables en sesion,
- evita desincronizacion si el producto cambia,
- simplifica la estructura del carrito,
- separa persistencia temporal de datos maestros.

### Otro detalle a mencionar

En `app.js:39-44` se calcula `cartItemCount` como middleware global, para que el navbar pueda mostrar el badge de carrito desde cualquier vista.

Y en `views/partials/organisms/home/navbar.ejs:2-18` ese valor se consume para pintar el badge.

Eso demuestra integracion entre:

- middleware,
- sesion,
- layout global compartido.

---

## 6. Rol de los controllers y por que existen

Puede parecer que `controllers/productController.js` y `controllers/cartController.js` son "thin wrappers", y eso no esta mal defenderlo.

### Que hacen hoy

Principalmente exponen una API de negocio estable para las rutas:

- `productController.js` delega en `productsService.js`.
- `cartController.js` delega en `cartService.js`.

### Por que sigue siendo valioso

Porque deja abierta una evolucion muy limpia:

- las rutas siguen simples,
- los services pueden crecer,
- si manana se agrega logging, reglas o validaciones cruzadas, ya existe una capa intermedia.

### Lineas para mostrar

- `controllers/productController.js:3-41`
- `controllers/cartController.js:3-29`

### Como explicarlo

> Aunque hoy los controladores son livianos, cumplen el rol de frontera semantica entre HTTP y negocio. Eso evita que las rutas queden acopladas directamente a la capa de datos.

---

## 7. Como interactuan las vistas con el backend

### `views/layouts/main.ejs`

Es el layout principal compartido.

### Que hace

- define `<head>`,
- carga estilos comunes,
- inserta el navbar,
- inserta el contenido variable de cada pagina,
- agrega footer.

### Lineas importantes

- `views/layouts/main.ejs:21-25`: permite inyectar estilos extra por pagina.
- `views/layouts/main.ejs:28-35`: inserta navbar y luego el `contentPartial`.

### Que defender

> El layout permite reutilizar estructura global y solo cambiar el contenido central. Eso reduce duplicacion de HTML y hace mas facil mantener consistencia visual.

### Ejemplo de composicion

- `views/pages/home/home-page.ejs:1-27`: define `extraStyles`, `contentPartial` y `contentProps`.
- `views/pages/product/product-detail-page.ejs:1-30`: reutiliza el mismo layout, pero con otro contenido.

Esto demuestra una separacion clara entre:

- layout comun,
- pagina,
- partials por seccion.

---

## 8. Autenticacion y registro: estado actual real

Conviene defender esto con honestidad.

### Lo que si esta implementado

- pantallas de login y registro,
- validacion server-side del formulario de registro,
- validacion client-side de apoyo,
- esquema SQL preparado para usuarios.

### Lo que todavia no esta completo

- no se inserta usuario en SQLite,
- no se hashea password,
- no existe login real contra DB,
- no hay middleware de autenticacion.

### Donde se ve

- `routes/login.router.js:5-13`: hoy simula el login y redirige a `/home`.
- `routes/register.router.js:44-118`: valida exhaustivamente el formulario.
- `routes/register.router.js:125-141`: hoy solo valida y redirige.
- `public/scripts/register-validation.js:35-124`: replica la validacion del lado cliente para mejor UX.

### Como defenderlo sin que juegue en contra

> La autenticacion quedo en un estado intermedio pero bien estructurado: ya existe la validacion de entrada, el esquema SQL de usuarios y la separacion de responsabilidades. Lo pendiente es conectar esa validacion con persistencia real e incorporar hash de contrasenas.

Eso muestra criterio tecnico y transparencia.

---

## 9. Archivos que concentran la logica mas importante

Si te preguntan "donde vive la inteligencia del proyecto", la respuesta corta es esta:

### `app.js`

Infraestructura general:

- servidor,
- middlewares,
- sesion,
- rutas,
- errores.

### `db/database.js`

Inicializacion real de SQLite y carga automatica de esquema.

### `db/bootstrap.js`

Migracion de `users` y seed de datos base.

### `services/productsService.js`

Es el nucleo del catalogo:

- consulta productos,
- resuelve orden por precio,
- busca por nombre,
- normaliza ids,
- trae relacionados,
- filtra categorias.

### `services/cartService.js`

Es el nucleo del carrito:

- usa la sesion,
- valida productos contra SQLite,
- recompone el carrito real,
- calcula resumenes.

### `routes/productos.router.js`

El mejor ejemplo de request-respuesta con manejo de casos edge.

### `routes/cart.router.js`

El mejor ejemplo de acciones mutables del usuario.

---

## 10. Decisiones tecnicas buenas que conviene remarcar

### 1. Arranque idempotente de base

El proyecto puede iniciar multiples veces sin duplicar seed innecesariamente.

Base:

- `db/bootstrap.js:52-88`

### 2. Compatibilidad hacia atras del esquema `users`

No rompe si habia una version anterior de la tabla.

Base:

- `db/bootstrap.js:22-47`

### 3. La sesion guarda el minimo necesario

No guarda precios ni snapshots de producto.

Base:

- `services/cartService.js:20-21`
- `services/cartService.js:74-81`

### 4. Validacion semantica de id

No solo valida formato; tambien valida existencia.

Base:

- `services/productsService.js:65-95`

### 5. Diferenciacion entre error 400 y 404

Esto hace el flujo mas correcto a nivel HTTP.

Base:

- `routes/productos.router.js:36-49`
- `routes/cart.router.js:19-29`

### 6. Reutilizacion del layout

Evita duplicacion y facilita mantenimiento visual.

Base:

- `views/layouts/main.ejs:28-35`

---

## 11. Limitaciones actuales

Es mejor nombrarlas vos antes de que te las marquen.

- `README.md` quedo desactualizado en partes: todavia habla de datos mock en memoria, pero el proyecto ya usa SQLite.
- `checkout` y `account` tienen vista, pero poca logica de negocio por ahora.
- `users`, `orders` y `order_items` existen en schema, pero el flujo real aun no persiste registros.
- no hay suite de tests automatizados.
- no hay autenticacion real ni hash de contrasenas.
- algunos campos como `stock` se contemplan en la vista y en el carrito, pero no aparecen definidos en `schema.sql`, por lo que hoy ese control no queda completamente persistido.

Este ultimo punto es util si te preguntan por mejoras futuras.

---

## 12. Posibles preguntas del docente y como responder

### "Por que usar services si las rutas podian consultar la base directamente?"

Porque las rutas deben ocuparse del protocolo HTTP y del render, mientras que la logica de consulta, normalizacion y armado de datos queda mejor encapsulada en una capa reutilizable.

### "Que aporta SQLite aca?"

Permite pasar de datos fijos a persistencia real, estructurar el dominio con tablas y relaciones, y preparar el proyecto para usuarios, ordenes y checkout. Ademas, el bootstrap resuelve migracion y seed automaticos.

### "Por que el carrito usa sesion y no DB?"

Porque para un carrito temporal anonimo la sesion simplifica el flujo. Igual, la sesion solo guarda `productId` y `quantity`; el detalle real se recompone desde DB para mantener consistencia.

### "Que parte es la mas solida del backend?"

La combinacion de:

- `productsService.js`
- `cartService.js`
- `db/bootstrap.js`

Porque ahi estan la consulta real, la validacion de negocio y el manejo de persistencia base.

### "Que mejorarias primero?"

1. persistir usuarios realmente en SQLite,
2. hashear contrasenas,
3. conectar `orders` y `order_items` al checkout,
4. agregar tests.

---

## 13. Mini guion para explicar el proyecto en 2 minutos

> El proyecto esta construido con Node, Express, EJS y SQLite. La arquitectura se separa en rutas, controladores, servicios, base de datos y vistas. `app.js` inicializa el servidor, las sesiones y los middlewares; despues delega cada seccion a routers especializados.  
>  
> La base de datos se inicializa automaticamente desde `db/database.js`, que ejecuta el schema, asegura compatibilidad de la tabla `users` y siembra categorias y productos si la base esta vacia. Un punto fuerte es `db/bootstrap.js`, porque no solo inserta datos: tambien migra estructuras legacy sin perder informacion.  
>  
> En el flujo funcional, el catalogo consulta productos desde SQLite, permite ordenar, buscar y filtrar categorias. El carrito usa sesion, pero guarda solo `productId` y `quantity`; despues recompone el detalle real desde la base. Eso evita inconsistencias con precios o datos del producto. Finalmente, las vistas EJS se renderizan con un layout principal reutilizable y componentes organizados con Atomic Design.

---

## 14. Fragmentos de codigo que vale la pena abrir en vivo

Si durante la defensa queres mostrar pocas cosas pero que digan mucho, abriria estos archivos:

1. `app.js`
   Explicar middlewares, sesiones, rutas y manejo de errores.

2. `db/bootstrap.js`
   Explicar migracion de `users` y seed condicional.

3. `services/productsService.js`
   Explicar normalizacion de id, busqueda SQL y filtros.

4. `services/cartService.js`
   Explicar por que la sesion guarda poco y el detalle sale de DB.

5. `routes/productos.router.js`
   Explicar `400`, `404` y render del detalle.

6. `views/layouts/main.ejs`
   Explicar composicion SSR reutilizable.

---

## 15. Cierre

La mejor forma de defender este proyecto es presentarlo como una aplicacion SSR ya estructurada para escalar:

- tiene separacion de capas,
- ya incorpora SQLite de forma real,
- resuelve migracion y seed,
- implementa un carrito consistente con sesion + DB,
- diferencia errores correctamente,
- reutiliza layout y componentes visuales,
- y deja preparado el terreno para autenticacion y checkout reales.

No hace falta venderlo como "terminado al 100%". Conviene venderlo como un proyecto con una base tecnica bien pensada, donde las decisiones importantes ya estan correctamente encaminadas.
