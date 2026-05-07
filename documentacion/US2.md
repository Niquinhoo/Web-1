# UserStory#2: Migración de Datos JSON → SQLite

**Estado:** Completada
**Sprint:** 3

## Descripción

Se migró la información de productos y categorías que estaba hardcodeada en `models/productModel.js` a la base de datos SQLite, formalizando los datos en archivos JSON de origen y creando un script de migración idempotente.

## Acciones Realizadas

### 1. Creación de archivos JSON de origen (`/data`)

Como el proyecto no tenía un `products.json` previo (los datos vivían como array en el modelo), se formalizaron en dos archivos JSON dentro de la carpeta `/data`:

- **`data/products.json`**: 5 productos con campos `title`, `description`, `price`, `src`, `category`, `isTopSeller`.
- **`data/categories.json`**: 9 categorías con campos `name`, `icon`, `type`.

### 2. Script de migración (`migrate.js`)

Se creó el script `migrate.js` en la raíz del proyecto. Su comportamiento:

- Lee `data/products.json` y `data/categories.json`.
- Verifica si las tablas ya tienen filas (chequeo de `COUNT(*)`).
- Si están vacías, inserta todos los registros dentro de una **transacción** usando `db.transaction()` para garantizar atomicidad.
- Si ya tienen datos, **saltea** la inserción e informa por consola.
- Usa `INSERT OR IGNORE` como capa extra de seguridad contra duplicados.

**Estrategia de idempotencia:** chequeo de COUNT antes de insertar. No se modifica el schema para agregar constraints adicionales, manteniendo compatibilidad con `database.db` existente.

### 3. Ejecución y validación

```bash
node migrate.js
```

Primera ejecución:
```
✅ 9 categorías migradas.
✅ 5 productos migrados.
Migración completada.
```

Segunda ejecución (idempotencia):
```
⏭️  Categorías ya migradas (9 filas). Saltando.
⏭️  Productos ya migrados (5 filas). Saltando.
Migración completada.
```

## Validación de Consigna

- ✅ Script `migrate.js` creado.
- ✅ Datos leídos desde JSON (`data/products.json`).
- ✅ Todos los productos insertados en tabla `products`.
- ✅ No se duplican datos si se ejecuta dos veces.
- ✅ El JSON puede eliminarse (los datos ya están en SQLite).

## Nota

Los archivos JSON en `/data` pueden conservarse como referencia de los datos originales o eliminarse una vez confirmada la migración. El proyecto no los usa en runtime.
