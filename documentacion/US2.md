# User Story #2 – Error 404

## Implementación Anterior
Anteriormente, la aplicación manejaba las rutas no encontradas a través de un "fallback" en el archivo `app.js` que no cumplía estrictamente con los requisitos HTTP y visuales de una página 404. El viejo comportamiento era atrapar todas las rutas no declaradas y forzar una redirección HTTP 302 hacia `/login`:

```javascript
// Fallback: Redirige cualquier ruta no definida (404) a la página de Login
app.use((req, res) => {
    console.log(`Ruta no encontrada: ${req.originalUrl}. Redirigiendo a /login`);
    res.redirect('/login');
});
```

## Implementación Actual
Para cumplir correctamente con los requerimientos de la US2, se realizaron los siguientes cambios:

1. **Nuevo middleware de error 404 en `app.js`:**
   En vez de redirigir, ahora se envía el estado HTTP explícito `404` (Not Found) a través de `res.status(404)` y se renderiza una vista dedicada a este tipo de error. 
   ```javascript
   // Fallback: Manejador de error 404 (Páginas no encontradas)
   app.use((req, res) => {
       console.log(`Ruta no encontrada: ${req.originalUrl}. Renderizando 404`);
       res.status(404).render('pages/404/404-page');
   });
   ```

2. **Creación de la vista y estilos:**
   - Se creó una nueva página en `views/pages/404/404-page.ejs` respetando la estructura del Atomic Design (reutilizando los módulos globales de `navbar` y `footer`).
   - Se añadió un layout en `public/styles/templates/error-layout.css` para darle un diseño amigable a la página de error e invitar al usuario a regresar al inicio ("Volver al inicio"), optimizando así su experiencia de usuario sin que abandone la app al llegar a una URL incorrecta.
