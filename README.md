# Web-1 Express Defensa & Resumen

## Contexto de la rama

`Web-1-Express-Resumen` no es el servidor principal del e-commerce. Es la rama de documentación y presentación para la defensa del proyecto Web-1.

Su objetivo es explicar la evolución de las ramas `Web-1-STP1`, `Web-1-STP2`, `Web-1-STP3` y `Web-1-STP4`, contrastando las decisiones implementadas con los conceptos de MVC, arquitectura por capas, sesiones, SQLite, transacciones y bootstrap.

El código de esta rama corresponde a una presentación interactiva construida con React y Vite; para ejecutar el backend del e-commerce se debe cambiar a `Web-1-STP4`.

Este repositorio centraliza la documentación escrita y la presentación interactiva diseñada para la defensa final del proyecto **Web-1** (e-commerce desarrollado en Node.js, Express y SQLite). 

El objetivo principal de este espacio es contrastar y justificar la arquitectura e implementación práctica construida durante los sprints (**STP1**, **STP2** y **STP3**) frente a los lineamientos teóricos y académicos dictados por la cátedra (patrón MVC, arquitectura por capas, persistencia de estado HTTP, bases de datos relacionales embebidas, transacciones ACID y bootstrap de esquemas).

---

## 📂 Estructura del Repositorio

```text
.
├── public/                # Archivos públicos estáticos (favicon, icons)
├── src/                   # Código fuente de la presentación interactiva (React + Vite)
│   ├── assets/            # Imágenes y recursos (hero.png, svg)
│   ├── components/        # Componentes dinámicos (TheoryBlock, ContrastBlock, TimelineItem, CodeBlock, Slide)
│   ├── pages/             # Vistas de detalle técnico (STP1Detail, STP2Detail, STP3Detail, Presentation)
│   ├── slides/            # Diapositivas secuenciales de la presentación
│   ├── App.css            # Estilos globales de la aplicación
│   ├── App.jsx            # Configuración de rutas y layout global de la SPA
│   ├── index.css          # Estilos base y reseteo
│   └── main.jsx           # Punto de entrada de React
├── dist/                  # Build estático de la presentación para producción
├── index.html             # HTML principal de la SPA
├── package.json           # Dependencias y scripts de la presentación
├── vite.config.js         # Configuración del bundler Vite
├── eslint.config.js       # Configuración de ESLint
└── README.md              # Este archivo descriptivo
```

---

## 📖 Contenido Académico por Sprints (De qué se habla)

A través de la documentación y los paneles de la presentación, se abordan los siguientes ejes conceptuales:

### 🔹 STP1: Fundamentos y Diseño de Interfaz (EJS + MVC + CSS)
- **MVC Server-Side:** Renderizado en servidor (SSR) usando EJS como motor de vistas y Express para el enrutamiento básico.
- **Atomic Design:** Organización modular de la interfaz y estilos en subcapas (*Atoms*, *Molecules*, *Organisms*, *Templates* y *Pages*) para maximizar la reutilización del código y mantener la consistencia visual.
- **Navegación e Integridad:** Flujo inicial de pantallas con datos mockeados en memoria (`data/db.js`).

### 🔹 STP2: Modularización, Estado y Flujo HTTP (Controllers + Services + Session)
- **Separación de Responsabilidades:** Creación de controladores delgados (*Slim Controllers*) encargados de la interfaz HTTP y traslado de la lógica de negocio a servicios puros (*Services*).
- **Persistencia Temporal:** Uso de `express-session` para el estado persistente del carrito de compras y sesiones sin comprometer datos confidenciales.
- **Validación y Semántica HTTP:** Implementación de validación de doble entrada (formulario frontend y validación estricta backend) junto con códigos de estado HTTP semánticos (`400 Bad Request`, `404 Not Found`).
- **Middleware de Errores:** Middleware global de captura de errores `500 Internal Server Error` y manejo centralizado de caídas de página `404`.

### 🔹 STP3: Persistencia Relacional y Transacciones (SQLite + better-sqlite3)
- **Persistencia Real:** Transición desde arrays en memoria a base de datos relacional SQLite utilizando el driver síncrono y de alta performance `better-sqlite3`.
- **Integridad Referencial:** Creación del esquema relacional (`db/schema.sql`) compuesto por 5 tablas vinculadas (`categories`, `products`, `users`, `orders`, `order_items`) mediante claves primarias y foráneas.
- **Bootstrap y Migración Idempotente:**
  - `ensureUsersTable()`: Proceso automatizado bajo **transacciones SQL** que detecta si la tabla de usuarios posee el esquema legacy (`password` plano) y la migra al esquema moderno (`password_hash`, `created_at`) de forma segura sin pérdida de datos.
  - `ensureSeedData()`: Inyección idempotente de datos semilla (categorías y productos) si la base de datos se encuentra vacía.
- **Consultas Seguras:** Migración de filtros JS a consultas precompiladas con *Prepared Statements* y *Bound Parameters* (`?`) para evitar inyecciones SQL.

---

## 🖥️ Flujo de la Presentación Interactiva

La aplicación web SPA en `src/` está diseñada para guiar la defensa del examen a través de diapositivas interactivas estructuradas con animaciones fluidas y soporte visual:

1. **TitleSlide:** Portada y presentación de los pilares de la defensa.
2. **STP1Slide & Detail:** Muestra las tarjetas de características de la Fase 1 y abre un panel de contraste teórico-práctico de las vistas dinámicas.
3. **STP2Slide & Detail:** Detalla la arquitectura de controladores/servicios y el flujo de validaciones HTTP semánticas.
4. **STP3Slide & Detail:** Profundiza en el modelo relacional, explicando el script de bootstrap y el uso de transacciones ACID en SQLite.
5. **EvolutionSlide:** Una línea de tiempo que ilustra la evolución conceptual del software a través de los tres sprints.
6. **CodeEvolutionSlide:** Sección interactiva para visualizar código de antes (mockeado) vs. después (SQL precompilado) con resaltador de sintaxis.

---
