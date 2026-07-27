# Web-1 (STP2) — Arquitectura en Capas y Gestión de Estado

## Contexto de la rama

`Web-1-STP2` es la segunda etapa del e-commerce y evoluciona `Web-1-STP1` hacia una arquitectura en capas. Introduce rutas, controladores delgados, servicios de negocio, sesiones para el carrito y manejo semántico de errores.

Esta rama todavía trabaja con datos mock/en memoria. La persistencia real se incorpora en `Web-1-STP3`, mientras que la API REST formal se incorpora en `Web-1-STP4`.

Aplicación web server-side rendering (SSR) construida con **Node.js**, **Express**, **EJS** y **Express-Session**. En esta segunda fase del desarrollo (STP2), se implementa la separación formal de responsabilidades dividiendo la lógica en controladores delgados (*Slim Controllers*) y servicios de negocio (*Services*), además de incorporar la gestión del carrito mediante sesiones y un control riguroso de errores semánticos en el backend.

---

## 🛠️ Stack Tecnológico

- **Runtime:** Node.js
- **Framework Web:** Express `5.2.1`
- **Motor de Plantillas:** EJS `5.0.1`
- **Manejo de Sesiones:** `express-session` `1.19.0` (empleado para persistir temporalmente el estado del carrito)
- **Desarrollo Local:** `nodemon` `3.1.14`
- **Diseño de Interfaz:** CSS plano bajo arquitectura **Atomic Design**
- **Persistencia:** En memoria / Mock Data estructurada en la capa de modelos

---

## 🚀 Cómo Ejecutar el Proyecto

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Iniciar el servidor:**
   - Modo normal:
     ```bash
     node app.js
     ```
   - Modo desarrollo (con recarga automática):
     ```bash
     npx nodemon app.js
     ```

3. **Acceder a la aplicación:**
   Abrir en el navegador [http://localhost:3000](http://localhost:3000)

---

## 📂 Estructura General del Proyecto

```text
.
├── app.js                 # Punto de entrada principal y configuración de middlewares/rutas
├── package.json           # Definición de dependencias
├── controllers/           # Controladores: Capa delgada HTTP (req, res, render)
│   ├── cartController.js
│   └── productController.js
├── models/                # Modelos: Mock de datos estáticos estructurados en memoria
│   └── productModel.js
├── routes/                # Enrutadores que dirigen las solicitudes al controlador correspondiente
│   ├── account.router.js
│   ├── cart.router.js
│   ├── checkout.router.js
│   ├── index.router.js
│   ├── login.router.js
│   ├── productos.router.js
│   └── register.router.js
├── services/              # Capa de Negocio: Lógica matemática y manipulación de datos (sin req/res)
│   ├── cartService.js
│   └── productsService.js
└── views/                 # Vistas dinámicas EJS modularizadas en componentes
    ├── index.ejs          # Punto de entrada global de vistas
    └── partials/          # Componentes de presentación organizados por Atomic Design
        ├── head-favicons.ejs
        ├── templates/     # Layouts estructurales (home-layout, cart-layout, etc.)
        ├── organisms/     # Componentes complejos autónomos (navbar, grid de productos)
        ├── molecules/     # Bloques de UI reutilizables medianos (tarjetas, banners, inputs)
        └── atoms/         # Unidades mínimas de UI (botones, textos, badges de precio)
```

---

## 🔄 Pilares de la Arquitectura STP2

### 1. Desacoplamiento por Capas (Controllers vs Services)
Para garantizar un código mantenible y testeable, se divide la lógica en:
- **Controladores (`controllers/`):** Tienen responsabilidades estrictamente asociadas a la comunicación HTTP. Capturan datos del cliente (`req.params`, `req.body`), delegan la resolución de datos a los servicios correspondientes y finalmente emiten una respuesta HTTP (`res.render`, `res.redirect`).
- **Servicios (`services/`):** Son clases o módulos con lógica pura de negocio. No tienen visibilidad de los objetos `req` o `res` de Express. Reciben argumentos nativos y devuelven datos limpios (ej. filtrado de productos relacionados, cálculo de totales del carrito).

### 2. Gestión de Estado (Session)
- Implementación de `express-session` para conservar el carrito del usuario.
- **Hibridación Carrito/DB:** La sesión almacena únicamente identificadores de producto y cantidades (`{ productId, quantity }`). Los precios, títulos e imágenes se resuelven en tiempo de ejecución consultando al servicio de productos (`productsService`). Esto previene manipulaciones fraudulentas de precios desde el cliente.

### 3. Validaciones y Semántica HTTP
- **Validación Backend de Doble Entrada:** Todos los inputs críticos recibidos a través de formularios (POST) o parámetros de ruta (GET) se normalizan y validan estrictamente en el backend.
- **Códigos de Estado Semánticos:** En caso de parámetros incorrectos (ej. ID de producto no numérico o vacío), el sistema responde explícitamente con `400 Bad Request`. Si el recurso no se encuentra (ej. ID numérico que no existe), se responde con `404 Not Found`.

### 4. Middleware de Captura de Errores
- **Fallback 404:** Un middleware final captura cualquier petición a rutas no implementadas y renderiza una vista dedicada `pages/404/404-page.ejs`.
- **Manejador Global 500:** Intercepta cualquier excepción ocurrida en el servidor, escribe la bitácora de error en consola y sirve al usuario la pantalla de error genérica `pages/500/500-page.ejs`.
