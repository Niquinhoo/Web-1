import assert from 'node:assert/strict'
import test from 'node:test'
import { addTask, removeTask, toggleTask } from './tasks.js'

test('agrega primero, completa y elimina tareas', () => {
  const older = [{ id: '1', label: 'Anterior', completed: false }]
  const tasks = addTask(older, '  Nueva  ', '2')

  assert.deepEqual(tasks.map(({ id }) => id), ['2', '1'])
  assert.equal(tasks[0].label, 'Nueva')
  assert.equal(toggleTask(tasks, '2')[0].completed, true)
  assert.deepEqual(removeTask(tasks, '2'), older)
})
