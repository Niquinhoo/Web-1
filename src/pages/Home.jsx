import { useNavigate } from 'react-router-dom'
import { ErrorState } from '../components/ui/ErrorState'
import { Spinner } from '../components/ui/Spinner'
import { useAuth } from '../hooks/useAuth'
import { useFetch } from '../hooks/useFetch'
import { getArray, getId } from '../utils/data'
import { Folder, ListBullets, CaretRight, PlusCircle, NotePencil } from '@phosphor-icons/react'

export function Home() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const projectsFetch = useFetch('/projects')
  const storiesFetch = useFetch('/stories')
  const projects = getArray(projectsFetch.data)
  const stories = getArray(storiesFetch.data)
  const activeStories = stories.filter((story) =>
    ['todo', 'running'].includes(story.status),
  )
  const firstName = user?.name?.first || user?.username || 'equipo'
  const loading = projectsFetch.loading || storiesFetch.loading
  const error = projectsFetch.error || storiesFetch.error

  return (
    <section className="flex flex-col gap-8">
      {/* Welcome Section */}
      <div className="mb-2 opacity-0 animate-fade-up">
        <h2 className="text-3xl font-bold tracking-tight text-on-surface mb-2">¡Hola, {firstName}!</h2>
        <p className="text-base md:text-lg text-on-surface-variant">Comencemos con el trabajo profundo.</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Spinner />
        </div>
      ) : error ? (
        <ErrorState
          message={error}
          onRetry={() => {
            projectsFetch.refetch()
            storiesFetch.refetch()
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Metrics Card: Active Projects */}
          <div 
            onClick={() => navigate('/my-projects')}
            className="deep-card rounded-xl p-6 flex flex-col justify-between h-48 opacity-0 animate-fade-up delay-100 cursor-pointer"
          >
            <div className="flex justify-between items-start">
              <div className="p-3 rounded-lg bg-primary/10">
                <Folder size={24} className="text-primary" />
              </div>
            </div>
            <div>
              <p className="text-4xl font-bold text-on-surface">{projects.length}</p>
              <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mt-1">Proyectos activos</p>
            </div>
          </div>

          {/* Metrics Card: Pending Stories */}
          <div 
            onClick={() => navigate('/my-stories')}
            className="deep-card rounded-xl p-6 flex flex-col justify-between h-48 opacity-0 animate-fade-up delay-200 cursor-pointer"
          >
            <div className="flex justify-between items-start">
              <div className="p-3 rounded-lg bg-tertiary/10">
                <ListBullets size={24} className="text-tertiary" />
              </div>
            </div>
            <div>
              <p className="text-4xl font-bold text-on-surface">{activeStories.length}</p>
              <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mt-1">Stories pendientes</p>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="deep-card rounded-xl p-6 col-span-1 md:col-span-2 lg:col-span-1 opacity-0 animate-fade-up delay-300 flex flex-col justify-center gap-4">
            <h3 className="text-base font-bold text-on-surface">Acciones rápidas</h3>
            <button 
              onClick={() => navigate('/my-projects')}
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-surface-variant/40 hover:bg-surface-container-high transition-colors border border-outline-variant/10 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <PlusCircle size={20} className="text-on-surface-variant" />
                <span className="text-sm font-semibold text-on-surface">Nuevo proyecto</span>
              </div>
              <CaretRight size={16} className="text-on-surface-variant" />
            </button>
            <button 
              onClick={() => navigate('/my-stories')}
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-surface-variant/40 hover:bg-surface-container-high transition-colors border border-outline-variant/10 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <NotePencil size={20} className="text-on-surface-variant" />
                <span className="text-sm font-semibold text-on-surface">Borrador de story</span>
              </div>
              <CaretRight size={16} className="text-on-surface-variant" />
            </button>
          </div>

          {/* Recent Activity Card (Wide) */}
          <div className="deep-card rounded-xl p-6 col-span-1 md:col-span-2 lg:col-span-3 opacity-0 animate-fade-up delay-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-base font-bold text-on-surface">Actividad reciente</h3>
              <button 
                onClick={() => navigate('/my-stories')}
                className="text-primary text-xs font-semibold hover:underline cursor-pointer uppercase tracking-wider"
              >
                VER TODO
              </button>
            </div>
            
            <div className="flex flex-col gap-3">
              {stories.slice(0, 3).map((story, index) => {
                const storyId = getId(story)
                const projectId = story.project ? getId(story.project) : null
                const epicId = story.epic ? getId(story.epic) : null

                return (
                  <div
                    key={storyId}
                    onClick={() => {
                      if (projectId && epicId) {
                        navigate(`/my-projects/${projectId}/${epicId}/${storyId}`)
                      }
                    }}
                    className={`flex items-center justify-between p-3.5 rounded-lg border border-transparent transition-all duration-200 ${
                      projectId && epicId 
                        ? 'hover:bg-surface-container-high hover:border-outline-variant/10 cursor-pointer' 
                        : ''
                    }`}
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div 
                        className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                          story.status === 'done' 
                            ? 'bg-green-500' 
                            : story.status === 'running' 
                              ? 'bg-tertiary' 
                              : 'bg-outline'
                        }`} 
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-on-surface truncate">
                          Actualizó '{story.name}' a <span className="font-semibold text-primary uppercase">{story.status === 'done' ? 'Completado' : story.status === 'running' ? 'En curso' : 'Por hacer'}</span>
                        </p>
                        <p className="text-xs text-on-surface-variant truncate mt-0.5">
                          Proyecto: {story.project?.name || 'Task Tracker'}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-on-surface-variant flex-shrink-0 ml-4 font-medium">
                      Hace {index * 2 + 2}h
                    </span>
                  </div>
                )
              })}

              {stories.length === 0 && (
                <p className="text-sm text-on-surface-variant text-center py-4">No se encontró actividad reciente.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
