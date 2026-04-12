// models/tasks.model.js

let tasks = [
  { id: 1, title: "Aprender JavaScript", difficulty: 2, description: "Aprender los conceptos básicos de JavaScript" },
  { id: 2, title: "Aprender HTML", difficulty: 1, description: "Aprender a crear estructuras de página web con HTML" },
  { id: 3, title: "Aprender CSS", difficulty: 1, description: "Aprender a dar estilo a las páginas web con CSS" },
  { id: 4, title: "Aprender Node.js", difficulty: 3, description: "Comprender el entorno de ejecución de JavaScript del lado del servidor" },
  { id: 5, title: "Aprender Express", difficulty: 3, description: "Crear servidores y APIs REST con el framework Express" }
];

function getAll() {
  return tasks;
}

function getById(id) {
  return tasks.find(t => t.id === id);
}

module.exports = {
  getAll,
  getById
};
