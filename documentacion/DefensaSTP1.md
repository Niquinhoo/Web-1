# Defensa STP1

## 1. Que representa esta rama

La rama `Web-1-STP1` representa la primera base funcional del proyecto.

Es una aplicacion **server-side render** construida con:

- Node.js
- Express
- EJS
- CSS modularizado

Todavia no hay:

- base de datos,
- autenticacion real,
- carrito en sesion,
- manejo formal de errores HTTP,
- layout global unificado.

Por eso, la mejor forma de defender STP1 no es venderla como una version completa, sino como el sprint donde se construye la **estructura inicial**, la **navegacion principal**, el **dataset compartido** y las **pantallas base** del proyecto.

---

## 2. Arquitectura general en STP1

### Flujo tecnico resumido

```text
Cliente -> app.js -> route -> service -> data/db.js
Cliente <- render EJS <- route <- datos preparados
```

### Capas reales del proyecto

- `app.js`
  Configura Express, estaticos, middlewares y rutas.

- `routes/`
  Separa las pantallas principales por seccion.

- `services/`
  Encapsula parte de la logica de productos y carrito.

- `data/db.js`
  Contiene todos los datos mock del proyecto.

- `views/`
  Renderiza HTML con EJS y una composicion inspirada en Atomic Design.

- `styles/`
  Organiza la parte visual por `base`, `atoms`, `molecules`, `organisms` y `templates`.

### Diferencia importante respecto a STP2 y STP3

En STP1:

- no hay `controllers/`,
- no hay `models/`,
- no hay `express-session`,
- no hay `main.ejs` comun,
- no hay rutas de busqueda o categoria,
- no hay DB.

Eso es clave para explicar la evolucion del proyecto entre ramas.

---

## 3. Punto de entrada del sistema

El archivo central es `app.js`.

### Que hace

- activa EJS,
- define la carpeta `views`,
- publica `styles` y `assets`,
- parsea formularios y JSON,
- conecta las rutas,
- deja un fallback global que redirige a `/login`.

### Lineas claves

- `app.js:10-14`
  Configura EJS y la carpeta de vistas.

- `app.js:16-20`
  Publica `styles` y `assets`.

- `app.js:22-24`
  Middlewares para formularios y JSON.

- `app.js:27-33`
  Importa routers.

- `app.js:38-54`
  Conecta las rutas principales.

- `app.js:55-59`
  Fallback de rutas inexistentes hacia `/login`.

### Como defenderlo

> `app.js` ya organiza la aplicacion por modulos y centraliza el ingreso al sistema. Aunque todavia no tenga middleware de sesion ni manejo 404/500 formal, ya separa correctamente el servidor, los estaticos y las rutas.

---

## 4. Fuente de datos del proyecto

Toda la informacion de STP1 vive en:

- `data/db.js`

### Que contiene

- `productos`
- `publicidades`
- `categorias`
- `carrito`

### Por que es importante

En esta rama, `data/db.js` cumple el rol de una fuente compartida de verdad para todo el sistema.

Gracias a eso:

- la home y el detalle usan los mismos productos,
- el carrito puede cruzar lineas con productos reales,
- las categorias pueden mostrarse en varias pantallas,
- y el proyecto deja atras el hardcode repetido en varias vistas.

### Lineas claves

- `data/db.js:1-42`
  Productos base con `id`, `description`, `price`, `src` y `category`.

- `data/db.js:44-57`
  Publicidades/banners.

- `data/db.js:59-69`
  Categorias.

- `data/db.js:71-75`
  Carrito mockeado global.

### Como explicarlo

> En STP1 no habia persistencia real, pero si habia una necesidad muy concreta: dejar de duplicar datos y tener una fuente central que alimente home, detalle y carrito.

---

## 5. Servicios: primer paso hacia la separacion de logica

En esta rama no hay controllers todavia. La capa intermedia real es `services/`.

## `services/product.service.js`

Concentra:

- todos los productos,
- busqueda por id,
- productos relacionados,
- productos aleatorios.

### Lineas claves

- `product.service.js:3-5`
  Listado total.

- `product.service.js:7-9`
  Busqueda por id.

- `product.service.js:11-13`
  Relacionados por categoria.

- `product.service.js:15-18`
  Sugerencias aleatorias.

## `services/cart.service.js`

Concentra:

- cruce entre carrito mock y productos,
- armado de items visibles,
- calculo de subtotal,
- calculo de totalItems.

### Lineas claves

- `cart.service.js:4-23`
  Construccion de cada item del carrito.

- `cart.service.js:26-41`
  Resumen final del carrito.

### Como defenderlo

> Aunque STP1 es una rama inicial, ya empieza a separar logica de negocio de las rutas. Ese paso es importante porque prepara el salto posterior a una arquitectura mas limpia.

---

## 6. Flujo funcional real de STP1

### Home

Rutas:

- `/`
- `/index`
- `/home`

### Flujo

1. `app.js` deriva a `routes/index.router.js`.
2. La ruta toma `publicidades` y `categorias` desde `data/db.js`.
3. Obtiene los productos desde `services/product.service.js`.
4. Renderiza `views/pages/home/home-page.ejs`.

### Lineas claves

- `routes/index.router.js:3-9`
- `views/pages/home/home-page.ejs:1-7`
- `views/partials/templates/home-layout.ejs:42-54`

### Que se ve aca

La home ya muestra:

- hero con banners,
- grilla de productos,
- barra de categorias,
- navbar comun,
- footer.

---

### Detalle de producto

Ruta:

- `/producto/:id`

### Flujo

1. La ruta toma `:id`.
2. Busca el producto con `getProductById`.
3. Si existe, renderiza detalle y relacionados.
4. Si no existe, renderiza una pantalla de producto no encontrado con sugeridos aleatorios.

### Lineas claves

- `routes/productos.router.js:14-24`
- `services/product.service.js:7-18`
- `views/pages/product/product-detail-page.ejs:1-7`
- `views/pages/product/product-not-found-page.ejs:1-7`

### Punto fuerte de STP1

Este es uno de los mejores flujos para defender en esta rama, porque muestra:

- ruta dinamica,
- dataset compartido,
- fallback visual para producto inexistente,
- relacionados por categoria.

### Limite real

Todavia no diferencia entre:

- id mal formado,
- producto inexistente,
- error real del servidor.

Todo eso se mejora recien en STP2/STP3.

---

### Carrito

Ruta:

- `/cart`

### Flujo

1. La ruta usa `getCartDetail()`.
2. El service toma el array `carrito` global de `data/db.js`.
3. Cruza cada linea con un producto real.
4. Calcula subtotal y cantidad total.
5. Renderiza la vista del carrito.

### Lineas claves

- `routes/cart.router.js:3-11`
- `services/cart.service.js:1-42`
- `views/pages/cart/cart-page.ejs:40-43`
- `views/partials/organisms/cart/cart-summary.ejs:1-25`

### Que significa esto

En STP1 el carrito ya tiene vista y calculos reales, pero no tiene persistencia por usuario.

El carrito es:

- global,
- mockeado,
- fijo en memoria.

### Como defenderlo

> El objetivo de STP1 no era resolver persistencia, sino construir la primera version funcional del flujo visual del carrito usando datos reales del catalogo y calculos centralizados.

---

### Login y Register

Rutas:

- `/login`
- `/register`

### Flujo

- `GET` renderiza las paginas.
- `POST` loguea por consola y redirige a `/home`.

### Lineas claves

- `routes/login.router.js:5-13`
- `routes/register.router.js:5-13`
- `views/pages/login/login-page.ejs:1-13`
- `views/pages/register/register-page.ejs:1-13`
- `views/partials/templates/auth-temp.ejs:1-23`
- `views/partials/organisms/auth/auth-org.ejs:12-91`

### Que defender

Estas pantallas ya estaban integradas al flujo SSR, aunque el backend real no existiera aun.

O sea:

- el usuario podia navegar,
- completar formularios,
- cambiar entre login y register,
- y volver a home mediante redireccion mock.

### Limite real

No hay:

- validacion robusta,
- persistencia,
- cuenta real,
- sesion de usuario.

Eso tambien se mejora despues.

---

## 7. Templates y composicion visual

STP1 no tiene un `main.ejs` unificado, pero si tiene una composicion por templates.

### Templates principales

- `views/partials/templates/home-layout.ejs`
- `views/partials/templates/product-layout.ejs`
- `views/partials/templates/cart-layout.ejs`
- `views/partials/templates/auth-temp.ejs`

### Que muestran

- `home-layout`
  Navbar, main con componentes y category bar.

- `product-layout`
  Navbar, contenido del detalle/not found y footer.

- `cart-layout`
  Navbar, contenedor de carrito y footer.

- `auth-temp`
  Header simple, auth card y footer.

### Que valor tiene esto

Aunque la arquitectura visual todavia no estaba unificada del todo, ya habia una decision clara:

- reutilizar partes,
- evitar duplicacion completa de HTML,
- componer pantallas desde parciales.

Eso es la base de la evolucion posterior hacia layouts mas consistentes.

---

## 8. User Stories y donde viven en codigo

## US1 - Generar estructura del proyecto

Se materializa en:

- `views/`
- `styles/`
- `routes/`
- `services/`
- `data/`

Estado real:

- cumplida como base estructural del proyecto.

## US2 - Definir rutas

Se materializa en:

- `app.js`
- `routes/index.router.js`
- `routes/login.router.js`
- `routes/register.router.js`
- `routes/cart.router.js`
- `routes/checkout.router.js`
- `routes/account.router.js`
- `routes/productos.router.js`

Estado real:

- cumplida en la definicion de las rutas principales.

## US3 y US4 - Register y Login

Se materializan en:

- `routes/login.router.js`
- `routes/register.router.js`
- `views/pages/login/login-page.ejs`
- `views/pages/register/register-page.ejs`
- `views/partials/templates/auth-temp.ejs`
- `views/partials/organisms/auth/auth-org.ejs`

Estado real:

- cumplidas como flujo visual server-side con fallback mock.

## US5 - Home

Se materializa en:

- `routes/index.router.js`
- `views/pages/home/home-page.ejs`
- `views/partials/templates/home-layout.ejs`

Estado real:

- cumplida.

## US6 - Producto

Se materializa en:

- `data/db.js`
- `services/product.service.js`
- `routes/productos.router.js`
- `views/pages/product/product-detail-page.ejs`
- `views/pages/product/product-not-found-page.ejs`

Estado real:

- cumplida con detalle y fallback visual para inexistentes.

## US7 - Carrito

Se materializa en:

- `data/db.js`
- `services/cart.service.js`
- `routes/cart.router.js`
- `views/pages/cart/cart-page.ejs`

Estado real:

- cumplida en una primera version funcional.

## US8 - Enlaces y esquema de navegacion

Se materializa en:

- `views/partials/molecules/home/product-card.ejs`
- `views/partials/organisms/home/navbar.ejs`
- `views/partials/organisms/header.ejs`
- `routes/login.router.js`
- `routes/register.router.js`

Estado real:

- mayormente cumplida para home, producto, cart, login y register.

### Observacion importante

La story menciona checkout dentro del flujo de navegacion, pero en STP1 la ruta `/checkout` existe solo de forma incompleta y la vista objetivo no existe realmente.

## US9 - Responsive

Se materializa principalmente en:

- `styles/organisms/home/navbar.css`
- `styles/organisms/home/product-grid.css`
- `styles/organisms/product/product-detail.css`
- `styles/organisms/cart/cart-container.css`
- `styles/molecules/cart/cart-item.css`

Estado real:

- cumplida como trabajo transversal sobre los componentes principales.

---

## 9. Integraciones reales entre historias

### Integracion 1: Home + Producto

US5 y US6 se conectan asi:

- Home lista productos desde un dataset comun.
- Cada card enlaza a `/producto/:id`.
- La pagina de detalle reutiliza esos datos y ofrece relacionados.

Base real:

- `views/partials/molecules/home/product-card.ejs:2-10`
- `routes/productos.router.js:14-24`

### Integracion 2: Producto inexistente + sugeridos

US6 no solo resuelve el detalle, sino tambien la salida cuando el producto no existe.

Base real:

- `routes/productos.router.js:21-23`
- `services/product.service.js:15-18`

### Integracion 3: Catalogo + carrito

US6 y US7 se conectan por la fuente compartida:

- el carrito usa `productId`,
- el service busca el producto real,
- arma el resumen y lo renderiza.

Base real:

- `services/cart.service.js:4-23`

### Integracion 4: Auth + navegacion

US3, US4 y US8 se conectan asi:

- login y register son accesibles desde el header,
- se linkean entre si,
- ambos redirigen a home tras el submit.

Base real:

- `views/partials/organisms/header.ejs:6-9`
- `views/partials/organisms/auth/auth-org.ejs:79-91`
- `routes/login.router.js:10-13`
- `routes/register.router.js:10-13`

---

## 10. Cosas buenas para remarcar en la defensa

### 1. El proyecto ya estaba modularizado desde el inicio

Aunque todavia no tenia controllers ni DB, ya habia separacion en:

- rutas,
- servicios,
- datos,
- vistas,
- estilos.

### 2. La data compartida evita hardcode repetido

`data/db.js` centraliza productos, categorias, publicidades y carrito.

### 3. El detalle de producto ya tenia comportamiento no trivial

No solo renderiza un producto:

- busca por id,
- muestra relacionados,
- y maneja un fallback con sugerencias.

### 4. El carrito ya calcula valores reales

No esta compuesto solo de UI; el total sale de cruzar datos del carrito con precios del catalogo.

### 5. Atomic Design ya estaba presente

La rama muestra el esfuerzo de pensar la interfaz en piezas reutilizables desde temprano.

---

## 11. Limitaciones honestas de STP1

Esto conviene decirlo vos antes de que te lo senalen.

- no hay base de datos,
- no hay controllers,
- no hay autenticacion real,
- login y register son mock,
- el carrito no es por usuario ni por sesion,
- el badge del carrito en navbar es fijo, no dinamico,
- el buscador es solo visual, no funcional,
- no hay pagina 404 dedicada; las rutas invalidas redirigen a `/login`,
- no hay 400 ni 500 dedicados,
- `/checkout` y `/account` tienen ruta, pero sus vistas no existen realmente.

Este ultimo punto es importante:

- `routes/checkout.router.js:5` renderiza `pages/checkout-page`
- `routes/account.router.js:5` renderiza `pages/account-page`
- pero esos archivos no existen en `views/pages/`

---

## 12. Preguntas que te pueden hacer

### "Si no hay base de datos ni sesion, que valor tecnico tiene STP1?"

Tiene valor como fundacion del proyecto: define estructura, flujo de navegacion, dataset compartido, detalle dinamico de producto y primer carrito calculado.

### "Por que es importante `data/db.js`?"

Porque permite centralizar la informacion y reutilizarla entre home, producto y carrito sin repetir hardcode en varias rutas.

### "Que parte estaba mejor resuelta en STP1?"

El bloque home + producto + carrito:

- `routes/index.router.js`
- `routes/productos.router.js`
- `routes/cart.router.js`
- `services/product.service.js`
- `services/cart.service.js`

### "Que quedaba claramente pendiente?"

- persistencia real,
- checkout real,
- account real,
- validacion de formularios,
- sesiones,
- manejo formal de errores.

---

## 13. Mini guion para exponer STP1 en 2 minutos

> STP1 es la primera base funcional del proyecto. La aplicacion ya esta construida con Node, Express y EJS, con render server-side y una organizacion visual inspirada en Atomic Design. Aunque todavia no hay base de datos ni autenticacion real, ya existe una separacion entre rutas, servicios, datos y vistas.  
>  
> La informacion compartida vive en `data/db.js`, donde se centralizan productos, categorias, publicidades y un carrito mock. A partir de eso, la home renderiza el catalogo, la ruta dinamica `/producto/:id` muestra el detalle y si el producto no existe devuelve una pantalla alternativa con sugeridos aleatorios.  
>  
> El carrito tambien ya tiene una primera implementacion real: cruza `productId` con los productos del catalogo y calcula subtotales y total. En resumen, STP1 no busca cerrar toda la logica del negocio, sino dejar construida la estructura, la navegacion principal y el primer flujo funcional del sistema.

---

## 14. Archivos que conviene abrir en vivo

1. `app.js`
   Para mostrar servidor, estaticos y conexion de rutas.

2. `data/db.js`
   Para mostrar la fuente central de datos mock.

3. `services/product.service.js`
   Para explicar detalle, relacionados y sugeridos.

4. `services/cart.service.js`
   Para explicar como se calcula el carrito.

5. `routes/productos.router.js`
   Para mostrar la ruta dinamica del producto.

6. `routes/cart.router.js`
   Para mostrar el render del carrito.

7. `views/partials/templates/home-layout.ejs`
   Para explicar composicion visual.

8. `views/partials/organisms/auth/auth-org.ejs`
   Para explicar login/register y reutilizacion.

---

## 15. Cierre

La mejor forma de defender STP1 es presentarla como el sprint donde se construyo la fundacion del proyecto:

- estructura inicial ordenada,
- rutas principales definidas,
- dataset compartido,
- home funcional,
- detalle dinamico de producto,
- carrito con calculos,
- navegacion server-side entre pantallas.

No es una rama pensada para mostrar persistencia o robustez final, sino para demostrar que el proyecto ya tenia una base modular, navegable y escalable desde su primera etapa.
