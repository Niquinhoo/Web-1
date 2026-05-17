# User Story #6 - Productos Sugeridos en Inicio

**Codigo:** `#main-s2-us6`

**Nombre:** Mostrar productos sugeridos en Inicio

### Detalle

La historia pedia que la Home mostrara una seccion "Te puede interesar" usando productos reales del proyecto, sin consumir APIs ni usar fetch. El objetivo era destacar hasta 5 productos reutilizando la card existente para ayudar al descubrimiento desde la pagina principal.

### Implementacion actual

La US6 quedo implementada sobre el renderizado server-side existente con Express + EJS.

- La Home obtiene los productos desde el modulo local `models/productModel.js`.
- La seleccion de sugeridos se resuelve en `controllers/productController.js` con `getSuggestedProducts(5)`.
- La ruta `GET /` en `routes/index.router.js` envia `suggestedProducts` a la vista.
- La pagina `views/pages/home/home-page.ejs` renderiza la seccion con el titulo "Te puede interesar".
- Se reutiliza el organismo `views/partials/organisms/home/product-grid.ejs` y la card `views/partials/molecules/home/product-card.ejs`.

### Criterio de seleccion

Para esta story se uso una seleccion simple y estable: los primeros 5 productos disponibles en el modulo de datos. Eso cumple el requerimiento de mostrar hasta 5 productos reales sin agregar complejidad innecesaria.

### Ajuste de navegacion

La story pedia links a `/products/:id`. El proyecto ya tenia detalle de producto funcionando en `/producto/:id`, asi que se sumo compatibilidad adicional con:

- `app.use('/products', productosRouter)`

De esta manera:

- la Home ahora enlaza a `/products/:id`
- la ruta historica `/producto/:id` sigue funcionando

### Bonus aplicado

Se incorporo fallback de imagen en `controllers/productController.js`. Si un producto no trae `src`, se usa:

- `/assets/productos/proximamente.png`

En el dataset actual todos los productos ya tienen imagen, pero el fallback deja cubierta la validacion sin depender de que el modulo siga perfecto en el futuro.

### Validacion contra la story

La implementacion actual cumple con lo pedido:

- se muestran hasta 5 productos en Home
- cada producto muestra imagen, nombre y precio
- cada card enlaza a `/products/:id`
- los datos salen del modulo local de productos
- no se usa API
- no se usa fetch
- no se usa base de datos
- existe fallback de imagen para productos sin `src`

### Conclusion

La US6 queda resuelta con un cambio chico y consistente con la arquitectura actual del proyecto. La Home ahora destaca productos reales con componentes ya existentes y sin introducir logica cliente innecesaria.
