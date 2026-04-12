// controllers/tasks.controller.js

const tasksModel = require("../models/tasks.model");

function list(req, res) {
  const tasks = tasksModel.getAll();
  res.render("tasks/index", { tasks });
}

function detail(req, res) {
  const id = Number(req.params.id);
  const task = tasksModel.getById(id);

  if (!task) {
    return res.status(404).render("404", { message: "Tarea no encontrada" });
  }

  res.render("tasks/details", { task });
}

module.exports = {
  list,
  detail
};
