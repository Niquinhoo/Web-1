# Web-1-STP1

Aplicacion web server-side construida con Node.js, Express y EJS. El proyecto modela una experiencia simple tipo e-commerce/comida con home, detalle de producto, carrito, login y registro, usando una estructura inspirada en Atomic Design para las vistas y los estilos.

## Stack

- Node.js
- Express `5.2.1`
- EJS `5.0.1`
- Nodemon `3.1.14` como dependencia de desarrollo/ejecucion local
- CSS plano organizado por capas (`base`, `atoms`, `molecules`, `organisms`, `templates`)
- Datos mockeados en memoria desde archivos `.js`

## Como correr el proyecto

1. Instalar dependencias:

```bash
npm install
```

2. Levantar el servidor:

```bash
node app.js
```

Opcionalmente, para desarrollo:

```bash
npx nodemon app.js
```

3. Abrir en el navegador:

```text
http://localhost:3000
```

## Flujo general de la aplicacion

El flujo principal del proyecto hoy funciona asi:

1. `app.js` inicializa Express, configura EJS como motor de vistas, expone `/styles` y `/assets` como carpetas estaticas y registra las rutas.
2. La home vive en `/`, `/index` y `/home`. Esa ruta toma datos desde `data/db.js` y `services/product.service.js`, y renderiza `views/pages/home/home-page.ejs`.
3. Desde la grilla de productos se navega al detalle en `/producto/:id`.
4. La ruta de detalle busca el producto por id:
   - Si existe, renderiza la pagina de detalle con productos relacionados.
   - Si no existe, renderiza una vista de producto no encontrado y muestra sugerencias aleatorias.
5. La ruta `/cart` arma el carrito a partir de datos mockeados en memoria, calcula subtotales/totales con `services/cart.service.js` y renderiza la vista del carrito.
6. `/login` y `/register` muestran formularios server-side. Sus `POST` hoy no persisten datos: solo registran informacion en consola y redirigen a `/home`.
7. Cualquier ruta no definida redirige a `/login`.

## Flujo tecnico por capas

### 1. Entrada de la app

`app.js` es el punto de entrada. Ahi se define:

- Puerto `3000`
- View engine `ejs`
- Carpeta de vistas `./views`
- Middlewares `express.urlencoded()` y `express.json()`
- Rutas principales
- Fallback de rutas no encontradas

### 2. Rutas

Las rutas viven en `routes/` y reparten responsabilidades por seccion:

- `index.router.js`: home
- `productos.router.js`: detalle de producto y fallback de producto inexistente
- `cart.router.js`: carrito
- `login.router.js`: login
- `register.router.js`: registro
- `checkout.router.js`: checkout placeholder
- `account.router.js`: account placeholder

### 3. Datos

Los datos estan centralizados en `data/db.js` y hoy son estaticos:

- `productos`
- `publicidades`
- `categorias`
- `carrito`

No hay base de datos ni persistencia real. Todo el contenido se resuelve en memoria.

### 4. Servicios

La capa `services/` encapsula la logica de lectura y transformacion de datos:

- `product.service.js`
  - obtiene todos los productos
  - busca un producto por id
  - calcula relacionados por categoria
  - arma sugerencias aleatorias
- `cart.service.js`
  - cruza lineas del carrito con productos
  - calcula cantidad, precio unitario y subtotal
  - arma el resumen final del carrito

### 5. Renderizado de vistas

Las vistas estan en `views/` y siguen una composicion por niveles:

- `pages/`: paginas finales que se renderizan desde Express
- `partials/templates/`: layouts principales
- `partials/organisms/`: bloques grandes de interfaz
- `partials/molecules/`: componentes intermedios
- `partials/atoms/`: piezas chicas y reutilizables

Ejemplos concretos:

- `views/pages/home/home-page.ejs` delega en `partials/templates/home-layout.ejs`
- `views/pages/product/product-detail-page.ejs` delega en `partials/templates/product-layout.ejs`
- `views/pages/cart/cart-page.ejs` usa `partials/templates/cart-layout.ejs`
- `views/pages/login/login-page.ejs` y `views/pages/register/register-page.ejs` usan `partials/templates/auth-temp.ejs`

## Estructura del proyecto

```text
.
|-- app.js
|-- package.json
|-- data/
|   `-- db.js
|-- routes/
|   |-- index.router.js
|   |-- productos.router.js
|   |-- cart.router.js
|   |-- login.router.js
|   |-- register.router.js
|   |-- checkout.router.js
|   `-- account.router.js
|-- services/
|   |-- product.service.js
|   `-- cart.service.js
|-- views/
|   |-- pages/
|   |-- partials/
|   |   |-- templates/
|   |   |-- organisms/
|   |   |-- molecules/
|   |   `-- atoms/
|   `-- index.ejs
|-- styles/
|   |-- base/
|   |-- atoms/
|   |-- molecules/
|   |-- organisms/
|   `-- templates/
|-- assets/
|   |-- banners/
|   |-- productos/
|   `-- socialmedia/
`-- documentacion/
```

## Como se relacionan las carpetas

- `routes/` recibe la request y decide que vista renderizar.
- `services/` prepara la informacion que necesita la interfaz.
- `data/` actua como fuente de datos mock.
- `views/` define la estructura HTML con EJS.
- `styles/` define la presentacion visual, tambien separada por Atomic Design.
- `assets/` contiene imagenes, logos y recursos visuales.
- `documentacion/` guarda historias de usuario y notas del proyecto.

## Flujo de navegacion actual

```text
/login -> POST /login -> /home
/register -> POST /register -> /home
/home -> listado de productos -> /producto/:id
/producto/:id -> detalle + relacionados
/cart -> carrito con resumen
* -> cualquier ruta no definida -> /login
```

## Responsive y organizacion visual

El proyecto tambien trabaja el responsive directamente sobre los estilos por componente. Los breakpoints que aparecen repetidos en la documentacion y las hojas de estilo estan orientados a:

- mobile alrededor de `600px - 640px`
- tablet en `768px`
- desktop intermedio en `900px`

Esto impacta especialmente en:

- navbar
- grilla de productos
- detalle de producto
- carrito

## Estado actual y observaciones

- El proyecto usa datos mockeados; no hay base de datos ni autenticacion real.
- `login` y `register` simulan el flujo mediante redireccion.
- `checkout.router.js` renderiza `pages/checkout/checkout-page`.
- `account.router.js` renderiza `pages/account/account-page`.
- Ambas rutas ya cuentan con vistas propias y estructura basada en Atomic Design.
- En `package.json` no hay scripts de arranque definidos; hoy la forma directa de correr la app es `node app.js` o `npx nodemon app.js`.

## Resumen

Este proyecto implementa una aplicacion SSR simple con Express y EJS, organizada con una logica de componentes inspirada en Atomic Design. El backend actual se encarga de enrutar, preparar datos mock y renderizar vistas; el frontend se resuelve con EJS + CSS modularizado por niveles. La base esta pensada para seguir creciendo hacia persistencia real, autenticacion y nuevas pantallas como checkout y account.
