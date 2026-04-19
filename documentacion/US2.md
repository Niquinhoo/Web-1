# User Story #2 - Error 404

**Codigo:** `#main-s2-us2`

**Nombre:** Implementar una pagina 404 para rutas no encontradas

### Detalle

La aplicacion necesitaba dejar de redirigir silenciosamente a otras pantallas cuando el usuario ingresaba una URL invalida. El objetivo de esta historia fue responder correctamente con estado HTTP 404 y mostrar una pagina clara, integrada al estilo visual del proyecto.

### Implementacion actual

Para cumplir con esta historia se incorporo un fallback explicito al final de `app.js`:

```javascript
app.use((req, res) => {
    console.log(`Ruta no encontrada: ${req.originalUrl}. Renderizando 404`);
    res.status(404).render('pages/404/404-page');
});
```

Con este cambio:

- las rutas inexistentes ya no redirigen a `/login`
- la respuesta devuelve el codigo HTTP correcto
- el usuario ve una pantalla dedicada a error 404

### Vista y estilos agregados

La pagina se implemento en `views/pages/404/404-page.ejs` y reutiliza componentes compartidos del proyecto, como la barra de navegacion y el footer. Sus estilos se encuentran en `public/styles/templates/error-layout.css`.

La vista incluye:

- encabezado visual con el codigo `404`
- mensaje explicando que la pagina no existe o fue movida
- boton para volver al inicio

### Alcance real dentro del proyecto

La US2 esta **correctamente implementada para URLs no definidas**, porque cualquier ruta inexistente termina en el middleware final de `app.js`.

Como ajuste complementario al estado general del proyecto, las rutas `/account` y `/checkout` ya cuentan con vistas propias integradas al esquema de Atomic Design, con templates y organismos dedicados. Esto evita confundir errores internos con verdaderos errores 404 y deja mas clara la diferencia entre una ruta inexistente y una pantalla en desarrollo.

### Conclusion

La US2 si representa correctamente el proyecto actual: el sistema cuenta con una pagina 404 funcional, visualmente integrada y con respuesta HTTP adecuada para rutas no encontradas, dentro de una navegacion mas consistente que la version anterior del proyecto.
