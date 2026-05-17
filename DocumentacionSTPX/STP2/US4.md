# User Story #4 - Carrito en Sesion

**Codigo:** `#main-s2-us4`

**Nombre:** Carrito en sesion

### Detalle

La historia pedia que el carrito dejara de estar mockeado en memoria global y pasara a vivir en la sesion del navegador usando `express-session`. El objetivo era que la persona usuaria pudiera navegar por la app, agregar productos, cambiar cantidades y vaciar el carrito sin perder el estado mientras la sesion siguiera abierta.

### Implementacion actual

La US4 quedo implementada sobre el flujo SSR existente con Express y EJS.

- Se agrego `express-session` en `app.js`.
- El carrito ahora se guarda en `req.session.cart`.
- La sesion solo almacena informacion minima por linea: `{ productId, quantity }`.
- Los datos reales de cada producto se resuelven al renderizar la vista usando `getProductById`.

La logica principal del carrito vive en `controllers/cartController.js`. Ahi se resuelve:

- inicializacion segura del carrito en sesion
- agregado de productos
- aumento y disminucion de cantidades
- eliminacion de un item cuando su cantidad llega a `0`
- vaciado completo del carrito
- calculo de subtotales, total e items visibles para la vista

### Flujo implementado

La historia queda cubierta con estas rutas en `routes/cart.router.js`:

- `GET /cart`: renderiza el carrito desde `req.session.cart`
- `POST /cart/items`: agrega un producto al carrito
- `POST /cart/items/:productId/increase`: suma una unidad
- `POST /cart/items/:productId/decrease`: resta una unidad y elimina el item si llega a cero
- `POST /cart/items/:productId/remove`: elimina un producto directamente
- `POST /cart/clear`: vacia el carrito

Desde la pagina de detalle de producto `views/partials/molecules/product/product-info.ejs`, el boton "Agregar al Carrito" ahora envia un formulario `POST` a `/cart/items`.

En la vista del carrito:

- cada item muestra imagen, nombre, precio unitario, cantidad y subtotal
- los botones `+` y `-` actualizan la sesion
- el boton `Vaciar carrito` reinicia `req.session.cart` a un array vacio
- cuando no hay productos, se muestra un mensaje claro y un boton para volver al inicio

### Ajuste visual y de navegacion

Ademas de la pantalla `/cart`, se actualizo el navbar para que el badge del carrito ya no sea fijo. Ahora refleja la cantidad total de unidades almacenadas en la sesion, lo que hace visible la persistencia del carrito al navegar entre paginas.

### Validacion contra la story

La implementacion actual cumple con el alcance pedido:

- usa `express-session` solo para el carrito
- no guarda datos sensibles ni informacion completa del producto en la sesion
- persiste durante la navegacion mientras la sesion siga abierta
- obtiene los datos del producto desde la fuente mock al renderizar
- permite agregar, aumentar, disminuir, eliminar y vaciar
- calcula correctamente subtotal y total general
- contempla el estado vacio con una salida usable

### Alcance real dentro del proyecto

La persistencia es de sesion de navegador, no de base de datos. Si la sesion se reinicia o se cierra el navegador segun la configuracion del cliente, el carrito se pierde. Eso coincide con lo pedido por la historia y evita introducir almacenamiento permanente antes de tiempo.

### Conclusion

La US4 ya no depende de un carrito hardcodeado. El flujo de compra queda modelado con estado de sesion real, manteniendo el enfoque actual del proyecto: datos mock para productos y renderizado server-side con EJS.
