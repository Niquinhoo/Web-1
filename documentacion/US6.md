# US6 - Eliminacion de persistencia en JSON

## Objetivo

La user story pedia quitar la dependencia de `products.json`, eliminar referencias a archivos JSON y limpiar codigo muerto asociado a esa estrategia de persistencia.

## Cambios aplicados

### 1. Seeds en JS en lugar de JSON

Se crearon:

- `data/seedData.js`
- `data/homeContent.js`

`seedData.js` concentra los datos iniciales de `products` y `categories` en modulos JS comunes, evitando depender de archivos `.json`.

`homeContent.js` conserva las publicidades estaticas de la home, separadas de la logica de productos.

### 2. Bootstrap de base de datos

Se agrego `db/bootstrap.js` con dos responsabilidades:

- `ensureSeedData(db)`: inserta categorias y productos si las tablas estan vacias.
- `ensureUsersTable(db)`: deja la tabla `users` lista con el esquema nuevo.

Luego `db/database.js` ejecuta:

1. `schema.sql`
2. `ensureUsersTable(db)`
3. `ensureSeedData(db)`

Con eso la aplicacion ya no necesita una migracion basada en JSON para arrancar con datos.

### 3. Limpieza de rutas y codigo muerto

Se eliminaron:

- `data/products.json`
- `data/categories.json`
- `models/productModel.js`

Tambien se movieron las rutas que dependian de ese modelo a un servicio nuevo:

- `services/catalogService.js`

Ese servicio ahora:

- lee categorias desde SQLite
- expone las publicidades estaticas de home

Las rutas actualizadas fueron:

- `routes/index.router.js`
- `routes/categories.router.js`
- `routes/productos.router.js`

### 4. `migrate.js`

Se reescribio para reutilizar el bootstrap actual en vez de cargar JSON. Ahora sirve como verificacion/manual trigger del seed y del estado del esquema.

## Validacion realizada

Se comprobo:

- el proyecto funciona sin `products.json`
- `node migrate.js` completa sin errores
- `products` queda poblada desde el seed en JS
- `categories` queda disponible desde SQLite
- no quedaron referencias de runtime a `productModel`, `products.json` o `categories.json`

## Resultado

- La app ya no depende de persistencia JSON.
- El arranque de datos iniciales queda centralizado en SQLite + seed JS.
- Se elimino codigo viejo que habia quedado despues de la migracion previa.
