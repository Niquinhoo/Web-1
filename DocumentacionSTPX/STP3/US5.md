# US5 - Validacion de IDs contra la base

## Objetivo

La user story pedia que `normalizeId()` dejara de validar solo el formato y pasara a validar tambien la existencia del producto en SQLite, devolviendo `400` para IDs invalidos y `404` para IDs inexistentes.

## Cambios aplicados

### 1. `services/productsService.js`

`normalizeId(rawId)` ahora devuelve un resultado estructurado:

- `{ ok: false, statusCode: 400 }` si el ID no es numerico o no representa un entero positivo.
- `{ ok: false, statusCode: 404 }` si el ID tiene formato valido pero no existe en `products`.
- `{ ok: true, id, product }` si el producto existe.

De esta manera la validacion de formato y la validacion contra base quedaron centralizadas en un solo punto.

### 2. `routes/productos.router.js`

La ruta `GET /producto/:id` paso a usar el resultado de `normalizeId()`:

- `400` renderiza `pages/400/400-page`.
- `404` renderiza `pages/product/product-not-found-page`.
- `200` usa el `product` ya validado para renderizar la ficha del producto.

Con esto la decision de error ya no depende de una segunda consulta separada en la ruta.

### 3. `routes/cart.router.js`

Se agrego la misma validacion para rutas que reciben `productId`:

- `POST /cart/items`
- `POST /cart/items/:productId/increase`
- `POST /cart/items/:productId/decrease`
- `POST /cart/items/:productId/remove`

Ahora esas rutas tampoco aceptan IDs invalidos o inexistentes de forma silenciosa.

## Validacion realizada

Se verifico en ejecucion real:

- `GET /producto/abc` -> `400`
- `GET /producto/99999` -> `404`
- `GET /producto/1` -> `200`
- `POST /cart/items/abc/increase` -> `400`
- `POST /cart/items/99999/increase` -> `404`

## Resultado

- No hay rutas cubiertas por esta story que acepten IDs invalidos.
- El control de errores `400/404` ahora depende de SQLite y no solo del parseo del parametro.
