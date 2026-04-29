# User Story #5 - Checkout Temporal

**Codigo:** `#main-s2-us5`

**Nombre:** Vista temporal de checkout

### Detalle

La historia pedia que la ruta `/checkout` existiera aunque el flujo real de compra todavia no estuviera desarrollado. La idea era dar una salida valida de navegacion y dejar claro para la persona usuaria que esa funcionalidad quedara para un sprint posterior.

### Implementacion actual

La US5 quedo resuelta con una vista server-side simple en Express + EJS, sin logica de negocio ni datos mockeados de pago, entrega o confirmacion.

- Se mantuvo la ruta `GET /checkout` en `routes/checkout.router.js`.
- La ruta renderiza `views/pages/checkout/checkout-page.ejs`.
- La pagina usa `views/partials/templates/checkout-layout.ejs`.
- El contenido principal vive en `views/partials/organisms/checkout/checkout-temporary.ejs`.
- Los estilos especificos quedaron en `public/styles/organisms/checkout/checkout-temporary.css`.

### Comportamiento visible

Al entrar a `/checkout`, la app muestra una pantalla temporal con:

- mensaje "Checkout disponible en el proximo sprint"
- boton "Volver al carrito" que navega a `/cart`
- boton "Volver al inicio" que navega a `/home`

La vista conserva el layout general del proyecto con navbar y footer, pero el contenido central del checkout se simplifico para que no sugiera un flujo de compra ya implementado.

### Decision tecnica

Antes de este cambio existia una pantalla de checkout mas desarrollada visualmente, con pasos, resumen y datos simulados de entrega y pago. Eso no coincidia con el alcance de la story, porque daba a entender que habia una logica funcional mas avanzada.

Por eso la implementacion se ajusto a una version temporal:

- sin resumen de compra
- sin pasos de checkout
- sin datos hardcodeados de direccion o pago
- sin procesamiento de formularios
- sin calculos ni estado extra

### Validacion contra la story

La implementacion actual cumple con lo pedido:

- la ruta `/checkout` existe
- la vista renderiza correctamente
- no agrega logica de negocio
- devuelve una respuesta HTTP valida para una pagina existente
- deja una navegacion clara hacia `/cart` y `/home`

### Conclusion

La US5 queda implementada como un placeholder intencional y consistente con el estado real del proyecto. La pagina existe, evita errores o rutas rotas y comunica con claridad que el checkout completo sera abordado en un sprint posterior.
