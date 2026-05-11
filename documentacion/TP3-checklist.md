# TP3 Checklist

## Estado general

- Sprint funcional: `OK`
- Runtime principal: `OK`
- Persistencia en SQLite: `OK`
- Dependencia runtime de JSON: `NO`
- Documentacion legacy: `PARCIAL`, quedan referencias viejas

## Checklist por requerimiento de sprint

### 1. Crear base de datos SQLite con tablas necesarias

- [x] Existe carpeta `db/`
- [x] Existe `db/database.js`
- [x] Existe `db/schema.sql`
- [x] Existe tabla `products`
- [x] Existe tabla `categories`
- [x] Existe tabla `users`
- [x] Existe tabla `orders`
- [x] Existe tabla `order_items`
- [x] App arranca sin romper

Evidencia:
- `db/schema.sql`
- `db/database.js`
- `db/database.db`

### 2. Migrar datos a SQLite

- [x] Existe `migrate.js`
- [x] Datos viven en SQLite
- [x] Seed/migracion no duplica datos
- [x] Script corre sin error

Observacion:
- Consigna original US2 decia leer `products.json`.
- Estado final sprint ya no hace eso, porque US6 elimino JSON.
- Hoy migracion/seed sale desde `data/seedData.js`, consistente con cierre final sprint.

Evidencia:
- `migrate.js`
- `db/bootstrap.js`
- `data/seedData.js`

### 3. Servicios leen/escriben desde SQLite

- [x] `services/productsService.js` usa SQLite
- [x] Obtiene todos productos
- [x] Obtiene producto por ID
- [x] Filtra por categoria
- [x] Busca por nombre
- [x] Ordena por precio
- [x] Obtiene relacionados
- [x] Obtiene sugeridos

Evidencia:
- `services/productsService.js`
- `controllers/productController.js`

### 4. Eliminar dependencia de JSON

- [x] `data/products.json` eliminado
- [x] `data/categories.json` eliminado
- [x] `models/productModel.js` eliminado
- [x] Rutas principales ya no dependen de modelo viejo
- [x] Runtime no referencia JSON

Observacion:
- Quedan menciones viejas en docs, no en runtime.

Evidencia:
- `routes/index.router.js`
- `routes/categories.router.js`
- `routes/productos.router.js`
- `services/catalogService.js`

### 5. Mantener logica interna y vistas sin cambio visible

- [x] Home renderiza con datos desde DB
- [x] Detalle producto renderiza con datos desde DB
- [x] Categorias siguen funcionando
- [x] Busqueda sigue funcionando
- [x] Carrito sigue funcionando con sesion

Evidencia:
- `routes/index.router.js`
- `routes/productos.router.js`
- `routes/categories.router.js`
- `routes/search.router.js`
- `services/cartService.js`

### 6. Preparar proyecto para autenticacion real Sprint 4

- [x] Tabla `users` existe
- [x] `users` tiene `id`
- [x] `users` tiene `name`
- [x] `users` tiene `email`
- [x] `users` tiene `password_hash`
- [x] `users` tiene `created_at`
- [x] No se implemento login real
- [x] No se implemento hashing real

Evidencia:
- `db/schema.sql`
- `db/bootstrap.js`

## Checklist por US

### US1

- [x] Cumplida

### US2

- [x] Cumplida funcionalmente
- [!] Ajustada por estado final sprint: migracion ya no depende de JSON

### US3

- [x] Cumplida

### US4

- [x] Cumplida

### US5

- [x] Cumplida
- [x] `normalizeId()` valida formato + existencia
- [x] Responde `400/404`

### US6

- [x] Cumplida

### US7

- [x] Cumplida

## Verificaciones hechas

- [x] `node migrate.js`
- [x] `GET /producto/abc` -> `400`
- [x] `GET /producto/99999` -> `404`
- [x] `GET /producto/1` -> `200`
- [x] `POST /cart/items/abc/increase` -> `400`
- [x] `POST /cart/items/99999/increase` -> `404`

## Pendientes menores

- [ ] Actualizar `README.md`
- [ ] Actualizar `documentacion/US1.md`
- [ ] Actualizar `documentacion/US2.md`

## Resultado

- TP3 esta `cumplido` en codigo y runtime.
- Queda `pendiente menor` de consistencia documental en archivos viejos.
