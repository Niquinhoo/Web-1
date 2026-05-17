# UserStory#4: Carrito con Datos desde SQLite

**Estado:** Completada
**Sprint:** 3

## Descripción

El carrito sigue viviendo en la sesión del usuario, pero ahora toda validación de existencia y precio se obtiene en tiempo real desde SQLite (vía `productsService`). La sesión solo almacena `productId` y `quantity` — sin datos sensibles ni precios cacheados.

## Acciones Realizadas

### Archivo modificado: `services/cartService.js`

El servicio ya delegaba en `productsService.getProductById()`, el cual (tras US3) ya consulta SQLite. Los cambios aplicados fueron:

**1. Fix de inconsistencia de tipos en `productId`:**

El problema era que SQLite retorna `id` como integer, pero la sesión y las búsquedas del carrito usaban `String(productId)` inconsistentemente. Ejemplo: `buildCartItem` guardaba `productId: product.id` (integer) mientras `addProductToCart` buscaba con `String(productId)`.

Solución: `String(product.id)` en todos los puntos de escritura y lectura de la sesión.

**2. Comentarios explícitos sobre el flujo de datos:**

Se documentaron en código los principios clave de la US:
- Validación de existencia → `productsService.getProductById()` → SQLite.
- Precio real → siempre desde la DB, nunca desde la sesión.
- Sesión → solo guarda `{ productId (String), quantity }`.

### Flujo resultante

```
req → cartController → cartService.addProductToCart(session, id)
                           └→ productsService.getProductById(id)   ← SQLite
                               └→ product existe? → guarda en session { productId, quantity }

req → vista carrito → cartService.getCartDetailFromSession(session.cart)
                           └→ por cada item: productsService.getProductById(id)  ← SQLite
                               └→ precio real * quantity = subtotal
```

## Validación

```
add(1): true | cart: [{"productId":"1","quantity":1}]
add(1) again: true | cart: [{"productId":"1","quantity":2}]
cart after add(2): [{"productId":"1","quantity":2},{"productId":"2","quantity":1}]
items: [ 'Burger Smash XL x2 = $2400', 'Pizza Napolitana x1 = $1500' ]
total: 3900
add(9999 invalid): false
after remove(1): [{"productId":"2","quantity":1}]
```

- ✅ No se usa JSON.
- ✅ Precio viene de SQLite (Burger $1200 × 2 = $2400 correcto).
- ✅ Producto inexistente (id 9999) retorna `false`.
- ✅ Sesión guarda solo `productId` (String) y `quantity`.
- ✅ El carrito funciona igual que antes — API exportada sin cambios.
