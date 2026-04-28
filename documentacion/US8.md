# User Story #8 - Productos Relacionados en Detalle

**Codigo:** `#main-s2-us8`

**Nombre:** Mostrar productos relacionados en la pagina de producto

### Detalle

La historia pedia que la vista de detalle (`/products/:id`) mostrara una seccion de productos relacionados para facilitar el descubrimiento, reutilizando datos locales del proyecto y sin usar API, fetch ni base de datos.

### Implementacion final

La US8 esta **completamente implementada** sobre el flujo SSR con Express + EJS.

- **Logica de seleccion:** Se resuelve en `services/productsService.js` mediante la funcion `getRelatedProducts(product)`.
- **Criterio:** Filtra productos de la misma categoria, excluyendo el producto actual.
- **Randomizacion:** Aplica un orden aleatorio (`.sort(() => 0.5 - Math.random())`) para variar las sugerencias en cada carga.
- **Limite:** Se limita estrictamente a **4 productos** (`.slice(0, 4)`) tal como pide el requerimiento.
- **Presentacion:** `views/pages/product/product-detail-page.ejs` renderiza la seccion usando parciales reutilizables.

### Validacion contra la story

Cumplido al 100%:

- [x] Usa solo datos locales (sin API/fetch/DB).
- [x] Seccion ubicada debajo del detalle principal.
- [x] Reutiliza card existente.
- [x] Limite de hasta 4 productos.
- [x] Seleccion aleatoria cuando hay abundancia de productos.
- [x] Manejo de estado vacio (devuelve array vacio si no hay coincidencias).

### Conclusion

La US8 cumple con todos los criterios de aceptacion originales, integrando logica de negocio en la capa de servicios y manteniendo la coherencia visual con el resto del sitio.

