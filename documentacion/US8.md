# User Story #8 - Productos Relacionados en Detalle

**Codigo:** `#main-s2-us8`

**Nombre:** Mostrar productos relacionados en la pagina de producto

### Detalle

La historia pedia que la vista de detalle (`/products/:id`) mostrara una seccion de productos relacionados para facilitar el descubrimiento, reutilizando datos locales del proyecto y sin usar API, fetch ni base de datos.

### Implementacion actual

La US8 quedo implementada sobre el flujo SSR con Express + EJS.

- La seleccion de relacionados se resuelve en `controllers/productController.js` con `getRelatedProducts(product)`.
- El criterio usado es categoria: filtra productos con la misma `category` y excluye el producto actual.
- La ruta `GET /products/:id` en `routes/productos.router.js` envia `relatedProducts` a la vista de detalle.
- `views/pages/product/product-detail-page.ejs` agrega la seccion "Productos Relacionados" usando `views/partials/organisms/home/product-grid.ejs`.
- Cada item reutiliza la card existente `views/partials/molecules/home/product-card.ejs`.

### Comportamiento visible

En la pagina de detalle:

- debajo del bloque principal del producto aparece la seccion "Productos Relacionados"
- cada card muestra imagen, nombre y precio
- cada card mantiene link a `/products/:id`

### Limitaciones respecto del enunciado

Hay dos diferencias frente a la story original:

- hoy no se limita explicitamente a 4 relacionados (se muestran todos los de la categoria)
- no hay randomizacion cuando hay mas de 4
- si no hay relacionados, se ve la grilla vacia (no hay mensaje amigable especifico)

### Validacion contra la story

Cumplido:

- usa solo datos locales
- no usa API
- no usa fetch
- no usa base de datos
- seccion ubicada debajo del detalle principal
- reutiliza card existente

Parcial/Pendiente:

- limite de hasta 4 productos
- seleccion aleatoria cuando hay mas de 4
- mensaje explicito cuando no hay relacionados

### Conclusion

La US8 esta funcionalmente integrada al detalle de producto y reutiliza correctamente la arquitectura existente, pero todavia requiere un ajuste pequeno en la logica y en el estado vacio para cumplir al 100% con el criterio de aceptacion original.

