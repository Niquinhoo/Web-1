# Conclusion General - STP2

## Resumen ejecutivo

La revision de todas las User Stories (`US1` a `US19`) muestra que el proyecto STP2 quedo **funcionalmente completo en su alcance de Sprint 2**: estructura MVC/SSR con EJS, carrito en sesion, errores HTTP controlados (404/500/400), catalogo navegable, detalle de producto, categorias, orden por precio y buscador por nombre.

Ademas, la arquitectura evoluciono correctamente hacia una separacion por capas:

- `routes/` para endpoints
- `controllers/` como capa delgada
- `services/` para logica de negocio (productos y carrito)
- `views/` con layout base comun y parciales reutilizables

## Estado global por bloques funcionales

- **Base del proyecto y UX transversal:** cumplido  
  (US1, US2, US14)

- **Autenticacion mock y validaciones de formulario:** cumplido en alcance Sprint 2  
  (US3 sin persistencia real, tal como estaba previsto)

- **Carrito y checkout temporal:** cumplido  
  (US4, US5, US11, US12, US16)

- **Catalogo y producto:** cumplido  
  (US6, US7, US8, US9, US10, US17, US18, US19)

- **Manejo de errores del servidor:** cumplido  
  (US13 y complemento de US17 con 400)

## Hallazgos de consistencia documental

Durante la revision se detecto que algunas US quedaron con texto de estado intermedio y hoy el codigo ya las supera:

- `US8.md`: documenta limitaciones que ya fueron resueltas (relacionados limitados y seleccionados en servicio).
- `US9.md`: documenta faltantes que hoy estan cubiertos (categoria visible y 404 para inexistente).
- `US10.md`: figura como pendiente, pero la funcionalidad ya esta implementada.

Esto no impacta el funcionamiento del sistema, pero si la trazabilidad documental.

## Conclusion final

El proyecto STP2 queda **cerrado y operativo** para los objetivos del sprint: sin API externa y sin DB, pero con logica encapsulada, flujos principales completos y navegacion coherente de punta a punta.

La unica deuda relevante que queda para un cierre prolijo de entrega es **alinear la documentacion historica desactualizada** (principalmente US8, US9 y US10) con el estado real del codigo.
