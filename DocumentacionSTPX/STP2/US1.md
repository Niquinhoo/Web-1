## User Story #1 - Reordenar Proyecto

**Codigo:** `#main-s2-us1`

**Nombre:** Reordenar estructura del proyecto y las rutas de los recursos

### Detalle

La aplicacion necesitaba una reorganizacion para acercarse a una arquitectura MVC y separar mejor responsabilidades entre datos, logica de negocio, renderizado y ruteo. La meta de esta historia no era solo mover archivos, sino dejar una base mas mantenible para seguir creciendo.

### Estado actual del proyecto

El proyecto quedo organizado con una estructura base compatible con MVC:

- `app.js` como punto de entrada del servidor
- `models/` para datos mockeados
- `controllers/` para logica de productos y carrito
- `routes/` para endpoints Express
- `views/` para vistas EJS
- `public/` para estilos publicos
- `assets/` para imagenes y recursos estaticos

Dentro de `views/` y `public/styles/`, la interfaz tambien evoluciono hacia una organizacion inspirada en **Atomic Design**, separando `atoms`, `molecules`, `organisms` y `templates`. Ese criterio ya se aplica en home, producto, carrito, login, register, 404, account y checkout.

### Cumplimiento real de la US1

La historia se considera **cumplida de forma parcial y funcional**, porque la reorganizacion principal si se hizo, aunque todavia conviven rutas con distinto nivel de madurez dentro del patron MVC.

**Cambios implementados:**

1. **Modelo de datos centralizado**
   Se consolidaron los datos estaticos del proyecto en `models/productModel.js`, donde hoy viven productos, categorias, publicidades y carrito. Esto permite evitar datos dispersos dentro de las rutas o las vistas.

2. **Controladores incorporados**
   Se agregaron controladores especificos en `controllers/productController.js` y `controllers/cartController.js`. Estos encapsulan logica de consulta, detalle, relacionados, sugerencias aleatorias y armado del carrito.

3. **Rutas separadas**
   Las rutas quedaron distribuidas en `routes/` y `app.js` se encarga de conectarlas. Esto mejora la legibilidad y evita concentrar toda la navegacion en un unico archivo.

4. **Capa de vistas y recursos estaticos ordenada**
   Las vistas permanecen en `views/` y los estilos se sirven desde `public/styles`, mientras que las imagenes siguen en `assets/`. Esta division deja mas claro que Express expone como contenido publico.

5. **Profundizacion de la estructura visual**
   Ademas del orden MVC, se consolidaron nuevas pantallas bajo la logica de Atomic Design. `account-page.ejs` y `checkout-page.ejs` dejaron de ser vistas aisladas y ahora delegan en templates propios (`account-layout` y `checkout-layout`), que a su vez componen organismos, moleculas y atomos reutilizables.

### Observaciones importantes

- No todo el proyecto usa una separacion MVC estricta todavia.
- `index.router.js` y `productos.router.js` todavia consumen parte de la informacion del modelo de forma directa, aunque ya delegan logica puntual en controladores.
- `login`, `register`, `account` y `checkout` siguen sin una capa completa de controlador ni persistencia real, aunque `account` y `checkout` ya tienen una estructura visual consistente con Atomic Design.
- Por eso, la documentacion correcta para esta historia no es "cumplimiento perfecto de MVC", sino una **migracion parcial y consistente hacia MVC**.

### Conclusion

La US1 representa bien el proyecto si se documenta como una **reorganizacion estructural exitosa** y no como una adopcion completa del patron MVC. La base del proyecto ya esta ordenada para trabajar con ese enfoque, pero todavia hay partes que pueden profundizarse en futuros sprints.
