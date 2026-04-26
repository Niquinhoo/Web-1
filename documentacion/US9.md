# User Story #9 - Detalle de Producto

**Codigo:** `#main-s2-us9`

**Nombre:** Detalle del producto

### Detalle

La historia pedia que `/products/:id` mostrara la informacion principal de un producto desde la fuente local del proyecto, y que contemplara el caso de ID inexistente con una salida de error clara.

### Implementacion actual

La US9 quedo implementada sobre Express + EJS con datos locales.

- La busqueda por ID se resuelve en `controllers/productController.js` con `getProductById(productId)`.
- La ruta `GET /products/:id` vive en `routes/productos.router.js`.
- Si el producto existe, renderiza `views/pages/product/product-detail-page.ejs`.
- Si el producto no existe, renderiza `views/pages/product/product-not-found-page.ejs`.
- El bloque principal del detalle esta en `views/partials/organisms/product/product-detail.ejs`.
- La informacion textual y accion de compra se renderizan en `views/partials/molecules/product/product-info.ejs`.
- La imagen se renderiza con `views/partials/molecules/product/product-gallery.ejs`.

### Datos mostrados en el detalle

Con la implementacion actual se muestran:

- nombre
- descripcion
- precio
- imagen principal (`src`)
- boton "Agregar al Carrito" con `POST /cart/items`

Ademas, el controller aplica fallback de imagen:

- si falta `src`, usa `/assets/productos/proximamente.png`

### Comportamiento para producto inexistente

Si el ID no existe, la app muestra una pantalla dedicada de "Producto no encontrado" y sugiere productos aleatorios para continuar navegando.

### Limitaciones respecto del enunciado

Hay dos diferencias frente a la story original:

- la categoria del producto no se muestra en el bloque principal
- la vista de no encontrado no se devuelve con `status(404)` en esta ruta (renderiza pagina de error, pero con estado HTTP 200)

### Validacion contra la story

Cumplido:

- el ID de URL determina el producto buscado
- muestra informacion principal del producto
- muestra imagen principal con fallback
- no usa API REST
- no usa fetch
- no usa base de datos

Parcial/Pendiente:

- mostrar categoria explicitamente en el detalle
- responder con codigo HTTP 404 al no encontrar el producto

### Conclusion

La US9 esta implementada y usable en navegacion real. Para alinearla completamente al criterio original faltan ajustes puntuales de presentacion (categoria) y de semantica HTTP (status 404).

