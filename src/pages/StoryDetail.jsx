import { useEffect, useState } from 'react'
import { useOutletContext, useParams } from 'react-router-dom'
import { Trash, Checks, Plus, Calendar, Hash } from '@phosphor-icons/react'
import { TaskForm } from '../components/forms/TaskForm'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { EmptyState } from '../components/ui/EmptyState'
import { ErrorState } from '../components/ui/ErrorState'
import { Modal } from '../components/ui/Modal'
import { Spinner } from '../components/ui/Spinner'
import { StatusBadge } from '../components/ui/StatusBadge'
import { fetchClient } from '../api/client'
import { useFetch } from '../hooks/useFetch'
import { formatDate, getArray, getId } from '../utils/data'

export function StoryDetail() {
  const { storyId } = useParams()
  const { setHeaderTitle } = useOutletContext()
  const storyFetch = useFetch(`/stories/${storyId}`, [storyId])
  const tasksFetch = useFetch(`/tasks?story=${storyId}`, [storyId])
  const story = storyFetch.data?.data || storyFetch.data
  const tasks = getArray(tasksFetch.data)
  const [taskModalOpen, setTaskModalOpen] = useState(false)
  const [taskSubmitting, setTaskSubmitting] = useState(false)
  const [taskToDelete, setTaskToDelete] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteError, setDeleteError] = useState(null)

  useEffect(() => {
    setHeaderTitle(story?.name || 'Story')
  }, [story?.name, setHeaderTitle])

  const loading = storyFetch.loading || tasksFetch.loading
  const error = storyFetch.error || tasksFetch.error

  const handleTaskCreated = async () => {
    await tasksFetch.refetch()
    setTaskModalOpen(false)
  }

  const handleDelete = async () => {
    if (!taskToDelete) return
    setDeleteLoading(true)
    setDeleteError(null)

    try {
      await fetchClient(`/tasks/${getId(taskToDelete)}`, { method: 'DELETE' })
      await tasksFetch.refetch()
      setTaskToDelete(null)
    } catch (deleteRequestError) {
      setDeleteError(deleteRequestError.message)
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleToggleTask = async (task) => {
    const taskId = getId(task)
    const nextDone = !task.done

    const updateLocalState = (doneState) => {
      tasksFetch.setData((prev) => {
        if (Array.isArray(prev)) {
          return prev.map((t) => (getId(t) === taskId ? { ...t, done: doneState } : t))
        }
        if (prev && Array.isArray(prev.data)) {
          return {
            ...prev,
            data: prev.data.map((t) => (getId(t) === taskId ? { ...t, done: doneState } : t)),
          }
        }
        return prev
      })
    }

    updateLocalState(nextDone)

    try {
      await fetchClient(`/tasks/${taskId}`, {
        method: 'PATCH',
        body: JSON.stringify({ done: nextDone }),
      })
      await tasksFetch.refetch()
    } catch (toggleError) {
      updateLocalState(task.done)
      console.error(toggleError.message)
    }
  }

  return (
    <section className="flex flex-col gap-8">
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Spinner />
        </div>
      ) : error ? (
        <ErrorState
          message={error}
          onRetry={() => {
            storyFetch.refetch()
            tasksFetch.refetch()
          }}
        />
      ) : (
        <>
          {/* Upper Section: Story Metadata */}
          <section className="bg-surface-container-low rounded-xl border border-outline-variant/10 p-6 sm:p-8 shadow-deep flex flex-col gap-6 relative overflow-hidden group">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -z-10 group-hover:bg-primary/20 transition-colors duration-700 ease-in-out pointer-events-none" />
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-primary text-xs font-bold uppercase tracking-wider">Story / {story?._id || 'DW-100'}</span>
                <StatusBadge status={story?.status} />
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight">{story?.name}</h2>
              <p className="text-sm md:text-base text-on-surface-variant max-w-4xl leading-relaxed">
                {story?.description || 'Sin descripción'}
              </p>
            </div>

            {/* Metadata Pills */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-variant border border-outline-variant/30 text-on-surface-variant text-xs font-semibold">
                <Hash size={14} className="text-primary" />
                {story?.points ?? 0} puntos
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-variant border border-outline-variant/30 text-on-surface-variant text-xs font-semibold">
                <Calendar size={14} className="text-primary" />
                Creada: {formatDate(story?.created)}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-variant border border-outline-variant/30 text-on-surface-variant text-xs font-semibold">
                <Calendar size={14} className="text-primary" />
                Vence: {formatDate(story?.due)}
              </span>
            </div>
          </section>

          {/* Lower Section: Task Management */}
          <section className="flex flex-col gap-5">
            {/* Header & Action */}
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/10">
              <h3 className="text-lg md:text-xl font-bold text-on-surface flex items-center gap-2">
                <Checks size={22} className="text-primary" weight="bold" />
                Tareas de ejecución
                <span className="bg-surface-variant text-on-surface-variant rounded-full px-2.5 py-0.5 text-xs font-semibold ml-2">
                  {tasks.length}
                </span>
              </h3>
              <button
                className="bg-primary text-white font-bold text-xs px-5 py-2.5 rounded-full hover:scale-[1.02] hover:shadow-lg transition-all duration-200 flex items-center gap-2 active:scale-95 cursor-pointer"
                type="button"
                onClick={() => setTaskModalOpen(true)}
              >
                <Plus size={16} weight="bold" />
                Agregar tarea
              </button>
            </div>

            {/* Task List */}
            {tasks.length === 0 ? (
              <EmptyState message="Esta story no tiene tareas" />
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {tasks.map((task) => {
                  const taskId = getId(task)
                  return (
                    <div
                      key={taskId}
                      className="group flex items-start gap-4 p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/10 hover:border-outline-variant/30 transition-all duration-300 relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-surface-variant/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />
                      
                      {/* Checkbox button */}
                      <button
                        type="button"
                        onClick={() => handleToggleTask(task)}
                        className="flex-shrink-0 mt-1 cursor-pointer focus:outline-none"
                        aria-label={task.done ? 'Marcar como pendiente' : 'Marcar como completada'}
                        aria-checked={Boolean(task.done)}
                      >
                        {task.done ? (
                          <div className="w-5 h-5 rounded-[4px] border border-primary bg-primary flex items-center justify-center shadow-[0_0_8px_rgba(214,90,62,0.3)]">
                            <span className="text-white text-[12px] font-bold">✓</span>
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-[4px] border-2 border-outline-variant hover:border-primary transition-colors flex items-center justify-center" />
                        )}
                      </button>

                      {/* Content */}
                      <div className={`flex-1 min-w-0 ${task.done ? 'opacity-60' : ''}`}>
                        <h4 className={`text-base font-bold text-on-surface ${task.done ? 'line-through decoration-outline-variant' : ''}`}>
                          {task.name}
                        </h4>
                        <p className={`text-sm text-on-surface-variant leading-relaxed mt-0.5 ${task.done ? 'line-through decoration-outline-variant/50' : ''}`}>
                          {task.description || 'Sin descripción'}
                        </p>
                        
                        <div className="flex flex-wrap gap-2 mt-3">
                          <span className="px-2 py-0.5 text-xs rounded bg-surface-variant/50 text-on-surface-variant font-medium">
                            Creada: {formatDate(task.created)}
                          </span>
                          <span className="px-2 py-0.5 text-xs rounded bg-surface-variant/50 text-on-surface-variant font-medium">
                            Vence: {formatDate(task.dueDate)}
                          </span>
                        </div>
                      </div>

                      {/* Delete Action */}
                      <button
                        aria-label={`Eliminar tarea ${task.name}`}
                        className="flex-shrink-0 p-2 rounded-full text-on-surface-variant hover:text-error hover:bg-error/10 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer"
                        type="button"
                        onClick={() => setTaskToDelete(task)}
                      >
                        <Trash size={18} />
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </section>

          <Modal
            isOpen={taskModalOpen}
            onClose={() => {
              if (!taskSubmitting) setTaskModalOpen(false)
            }}
            title="Agregar tarea"
            closeDisabled={taskSubmitting}
          >
            <TaskForm
              storyId={storyId}
              onSuccess={handleTaskCreated}
              onCancel={() => {
                if (!taskSubmitting) setTaskModalOpen(false)
              }}
              onBusyChange={setTaskSubmitting}
            />
          </Modal>

          <ConfirmDialog
            isOpen={Boolean(taskToDelete)}
            message="¿Estás seguro de eliminar esta tarea?"
            loading={deleteLoading}
            onCancel={() => {
              if (!deleteLoading) {
                setTaskToDelete(null)
                setDeleteError(null)
              }
            }}
            onConfirm={handleDelete}
          />
          {deleteError ? (
            <div className="fixed bottom-4 right-4 bg-error-container text-on-error-container border border-error/20 p-4 rounded-lg shadow-lg z-50 text-sm font-semibold" role="alert">
              {deleteError}
            </div>
          ) : null}
        </>
      )}
    </section>
  )
}
