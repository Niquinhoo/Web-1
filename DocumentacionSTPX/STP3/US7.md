# US7 - Preparacion de tabla users

## Objetivo

La user story pedia dejar la tabla `users` preparada para Sprint 4, sin implementar todavia login real ni hashing real.

## Esquema requerido

La tabla debia tener:

- `id`
- `name`
- `email`
- `password_hash`
- `created_at`

## Cambios aplicados

### 1. `db/schema.sql`

Se actualizo la definicion de `users` para usar:

```sql
id INTEGER PRIMARY KEY AUTOINCREMENT,
name TEXT NOT NULL,
email TEXT UNIQUE NOT NULL,
password_hash TEXT NOT NULL,
created_at DATETIME DEFAULT CURRENT_TIMESTAMP
```

### 2. Migracion compatible de tabla existente

Como la base local ya tenia una tabla `users` previa con columna `password`, se agrego en `db/bootstrap.js` la funcion `ensureUsersTable(db)`.

Esa funcion:

- inspecciona `PRAGMA table_info(users)`
- detecta si el esquema es viejo
- renombra la tabla legacy
- crea la nueva tabla
- copia los datos existentes desde `password` a `password_hash`
- completa `created_at` con `CURRENT_TIMESTAMP` cuando no existia
- elimina la tabla temporal

Con esto el cambio de esquema no rompe una base ya creada.

## Validacion realizada

Se verifico por script:

- las columnas actuales de `users` son `id, name, email, password_hash, created_at`
- `node migrate.js` informa correctamente ese esquema

## Alcance intencional

Esta story no implementa:

- login real contra base
- registro persistente de usuarios
- hashing real de contrasenas

Solo deja preparada la estructura necesaria para que eso se pueda construir en el Sprint 4.
