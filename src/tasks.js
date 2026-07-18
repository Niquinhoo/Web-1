export function addTask(tasks, label, id = crypto.randomUUID()) {
  return [{ id, label: label.trim(), completed: false }, ...tasks]
}

export function removeTask(tasks, id) {
  return tasks.filter((task) => task.id !== id)
}

export function toggleTask(tasks, id) {
  return tasks.map((task) =>
    task.id === id ? { ...task, completed: !task.completed } : task,
  )
}
