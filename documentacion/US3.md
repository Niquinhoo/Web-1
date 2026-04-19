# User Story #3 - Validar Registro

**Codigo:** `#main-s2-us3`

**Nombre:** Validar el formulario de registro antes de enviarlo

### Detalle

La historia apuntaba a que la pantalla `/register` no enviara el formulario cuando los datos fueran invalidos. En el estado anterior del proyecto, esa pantalla mostraba un formulario simple y el `POST /register` redirigia siempre a `/home`, sin validar nombre, apellido, email ni contrasena.

### Implementacion actual

La US3 quedo implementada con una validacion combinada:

- **validacion en cliente** para frenar el envio del formulario cuando hay errores
- **validacion en servidor** para no aceptar datos invalidos aunque alguien saltee el control del navegador

La logica principal vive en `routes/register.router.js`. Ahi se valida que:

- `firstName`, `lastName`, `email` y `password` no esten vacios
- nombre, apellido, email y contrasena no tengan espacios al principio o al final
- el email tenga formato valido
- la contrasena tenga al menos 8 caracteres
- la contrasena incluya una letra, un numero y un caracter especial
- la contrasena no contenga cadenas prohibidas como `password`, `1234`, `qwerty`, el nombre del sitio o datos del usuario
- la confirmacion coincida con la contrasena

Si hay errores, la ruta responde con estado `422` y vuelve a renderizar la pagina con los mensajes correspondientes. Si todo esta correcto, mantiene el flujo mock actual y redirige a `/home`.

### Ajuste de Atomic Design en register

Para que la implementacion no quedara como logica suelta dentro de una sola vista, tambien se ordeno la capa EJS siguiendo la estructura del proyecto:

- `views/pages/register/register-page.ejs` sigue actuando como pagina final
- `views/partials/templates/auth-temp.ejs` ahora acepta scripts opcionales por pagina
- `views/partials/organisms/auth/auth-org.ejs` concentra la tarjeta de autenticacion y el mensaje general de error
- `views/partials/molecules/register/register-fields.ejs` agrupa los campos especificos de registro
- `views/partials/atoms/log-reg/register/regInput.ejs` paso a renderizar label, estado invalido y mensaje asociado
- `views/partials/atoms/log-reg/register/field-error.ejs` se agrego como atomo reutilizable para feedback

Con esto, `register` queda mejor alineado con el mismo criterio de composicion que ya usan home, carrito, checkout y account.

### Soporte visual y experiencia

La pantalla de registro tambien incorpora feedback visual para errores:

- campos invalidos marcados con borde y fondo de error
- mensajes por campo debajo de cada input
- alerta general arriba del formulario cuando falla el envio

Ademas se sumo `public/scripts/register-validation.js`, que valida el formulario en el navegador antes del submit y mantiene consistencia con las mismas reglas del backend.

### Alcance real dentro del proyecto

La US3 queda **cumplida de forma funcional dentro del alcance actual del proyecto**:

- no hay persistencia real de usuarios
- no se crea una cuenta en base de datos
- no existe autenticacion completa

Pero dentro del flujo mock actual, la pantalla `/register` ya no envia datos invalidos y solo continua cuando el formulario pasa las validaciones pedidas por la historia.

### Conclusion

La documentacion correcta para esta historia no es "se agrego un formulario de registro", sino que **se valido el registro tanto en frontend como en backend y se reorganizo su composicion EJS para respetar Atomic Design**. Eso deja la US3 consistente con el estado actual del proyecto y con el nivel de madurez real de la aplicacion.
