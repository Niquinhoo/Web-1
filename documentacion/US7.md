# User Story #7 - Productos mas pedidos en Inicio

**Codigo:** `#main-s2-us7`

**Nombre:** Mostrar productos mas pedidos

### Detalle

La historia pedia agregar en Home una seccion "Los mas pedidos" que mostrara hasta 10 productos destacados usando los datos reales de la app, sin API, sin fetch y sin base de datos. La idea era reforzar el descubrimiento de productos desde la portada con una segunda grilla distinta a la de sugeridos.

### Implementacion actual

La US7 quedo implementada sobre el flujo SSR existente con Express + EJS y reutiliza exactamente los componentes visuales ya usados en Home.

- Los productos siguen saliendo del modulo local `models/productModel.js`.
- Se agrego el flag `isTopSeller` en parte del dataset para marcar productos destacados.
- La logica vive en `controllers/productController.js` con `getTopOrderedProducts(10)`.
- La ruta `GET /` en `routes/index.router.js` ahora envia `topOrderedProducts` a la vista.
- `views/pages/home/home-page.ejs` agrega una nueva seccion con el titulo "Los mas pedidos".
- La grilla reutiliza `views/partials/organisms/home/product-grid.ejs`.
- Cada item reutiliza `views/partials/molecules/home/product-card.ejs`.

### Criterio de seleccion

La story permitia dos criterios: productos marcados con un flag y productos aleatorios. La implementacion actual combina ambos:

- primero se priorizan los productos con `isTopSeller: true`
- despues se completa el listado con productos restantes en orden aleatorio
- finalmente se limita el resultado a un maximo de `10`

Con el dataset actual el proyecto tiene 5 productos, asi que hoy la seccion muestra hasta 5. Eso cumple la historia porque el requerimiento es "hasta 10", no necesariamente 10 exactos.

### Fallback de imagen

La seccion hereda el mismo fallback centralizado aplicado en la US6. Si un producto no trae `src`, el controller usa:

- `/assets/productos/proximamente.png`

Eso cubre la validacion pedida sin mover logica a la vista ni al cliente.

### Navegacion

Cada card sigue mostrando:

- imagen
- nombre
- precio
- link a `/products/:id`

La navegacion usa el alias `/products` agregado previamente, manteniendo compatibilidad con la ruta historica `/producto/:id`.

### Validacion contra la story

La implementacion actual cumple con lo pedido:

- Home muestra la seccion "Los mas pedidos"
- se renderizan hasta 10 productos
- los productos salen del modulo local del proyecto
- cada card muestra imagen, nombre y precio
- cada card enlaza a `/products/:id`
- existe fallback de imagen
- no se usa API
- no se usa fetch
- no se usa base de datos

### Conclusion

La US7 queda resuelta sin agregar complejidad innecesaria. La Home ahora tiene una segunda grilla de descubrimiento basada en datos reales y reutiliza por completo la estructura visual existente del proyecto.
