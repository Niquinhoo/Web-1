## User Story #1 – Reordenar Proyecto

<aside>
🤝

Es recomendable trabajar esta story de forma colaborativa, usando las rutas como subtareas o pasos necesarios para completarla.

</aside>

**Código:** `#main-s2-us1`

**Nombre:** Reordenar estructura del proyecto y las rutas de los recursos

### Detalle

Necesitamos reorganizar nuestra app usando la estructura propuesta por el modelo MVC, porque nuestra idea original de estructura no nos permite separar los conceptos de forma adecuada. Con las nuevas formas propuestas estaremos respetando las buenas prácticas.

<aside>
⚠️

No es obligatorio respetar las estructuras propuestas si surgen ideas superadoras.

</aside>

- Estructura propuesta 1
    
    📁 public
    
    📁 src
    
        📁 models
    
            📄productModel.js
    
        📁 controllers
    
            📄productController.js
    
        📁 views
    
            📄products.ejs
    
        📁 routes
    
            📄productRoute.js
    
    ⏯️ app.js
    
    ⚙️ package.json
    
    📁 assets
    
- Estructura propuesta 2
    
    📁 public
    
    📁 models
    
        📄productModel.js
    
    📁 controllers
    
        📄productController.js
    
    📁 views
    
        📄products.ejs
    
    📁 routes
    
        📄productRoute.js
    
    ⏯️ server.js
    
    ⚙️ package.json
    
    📁 assets

---

### ✅ Solución y Cumplimiento de la US1

Se determinó utilizar e implementar la **Estructura propuesta 2**, ya que nos provee una organización clásica del patrón MVC en la ruta base, ideal para esta fase del sprint. A continuación, el detalle de por qué y cómo logramos el objetivo de la User Story:

**Acciones implementadas para respetar el modelo MVC:**
1. **Modelos (M de MVC):** Creamos la carpeta `/models` y migramos los datos estáticos desde `data/db.js` hacia su nuevo archivo `/models/productModel.js`. De esta manera, centralizamos la responsabilidad de nuestros datos (nuestro *Modelo* para categorías, publicidad, productos y carrito).
2. **Controladores (C de MVC):** Creamos la carpeta `/controllers`. Renombramos la antigua semántica de la carpeta "services" y movimos su funcionalidad a `/controllers/productController.js` y `/controllers/cartController.js`. Estos actuaron como enlace, extrayendo la información del modelo y validándola para ser expuesta.
3. **Vistas e Interfaz (V de MVC):** Las vistas ya estaban ubicadas en `/views`. Refinamos la capa estática del proyecto creando un directorio `/public` para alojar los estilos (`/public/styles`), un factor importante para organizar de manera segura qué sirve Express hacia el usuario final.
4. **Rutas (Routes):** Mantuviemos los endpoints en `/routes/` configurados pero arreglamos todos los puntos internos de integración (`requires`) para que las rutas ahora llamen a nuestros *Controladores* recientemente creados, quienes a su vez interactúan directamente con nuestros *Modelos*.

*(Esta estructuración permite cumplir perfectamente con **separar los conceptos de forma adecuada**, base esencial de una arquitectura escalable bajo la metodología MVC).*
