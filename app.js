// app.js

const express = require("express");
const path = require("path");
const tasksController = require("./controllers/tasks.controller");

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración del motor de vistas EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Archivos estáticos (CSS, JS del cliente, imágenes)
app.use(express.static(path.join(__dirname, "public")));

// Rutas
app.get("/", (req, res) => res.render("index"));
app.get("/tasks", tasksController.list);
app.get("/tasks/:id", tasksController.detail);

// Manejo de rutas inexistentes (404)
app.use((req, res) => {
  res.status(404).render("404", { message: "La página que buscás no existe." });
});

// Inicio del servidor
app.listen(PORT, () => {
  console.log(`✓ Servidor corriendo en http://localhost:${PORT}`);
});
