# UserStory#1: Configuración de Base de Datos (SQLite)

**Estado:** Completada
**Sprint:** 3

## Descripción
Se configuró el entorno inicial para reemplazar la persistencia basada en archivos JSON por una base de datos relacional (SQLite), permitiendo así la evolución de la aplicación hacia un modelo de datos robusto y escalable.

## Acciones Realizadas

1. **Instalación de Dependencias:**
   - Se instaló la biblioteca `better-sqlite3` para permitir la comunicación síncrona y eficiente con SQLite desde Node.js.

2. **Creación del Directorio de Base de Datos:**
   - Se creó la carpeta `/db` en la raíz del proyecto para centralizar la conexión y configuración de la base de datos.

3. **Esquema de la Base de Datos (`db/schema.sql`):**
   Se generó el script SQL inicial para la creación de las tablas si no existen. Las tablas definidas son:
   - `products`: Define la estructura para almacenar productos (`id`, `title`, `description`, `price`, `src`, `category`, `isTopSeller`).
   - `categories`: Define la estructura para categorías de productos (`id`, `name`, `icon`, `type`).
   - `users`: Tabla para la gestión futura de usuarios (`id`, `name`, `email`, `password`).
   - `orders`: Tabla para cabeceras de órdenes (`id`, `user_id`, `total`, `created_at`).
   - `order_items`: Tabla para el detalle de productos dentro de una orden (`id`, `order_id`, `product_id`, `quantity`, `price`).

4. **Archivo de Conexión (`db/database.js`):**
   - Se creó el módulo `database.js` que inicializa la conexión creando o abriendo `database.db`.
   - Se implementó lógica para que, al requerirse por primera vez este archivo, se lea automáticamente `schema.sql` y se ejecute el método `db.exec(schema)` para garantizar la creación de las tablas.
   - El módulo exporta la instancia de conexión `db` para que esté disponible para el resto de la aplicación (los Modelos).

## Validación
- La base de datos `database.db` se generó correctamente en la carpeta `/db`.
- La aplicación principal sigue iniciando correctamente (`node app.js`) sin romper la compatibilidad actual con JSON.
- Aún no se está utilizando JSON en la lectura/escritura (esto será abordado en futuras User Stories donde se migre la lógica de los servicios).
