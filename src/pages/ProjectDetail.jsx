import { useEffect } from 'react'
import { useNavigate, useOutletContext, useParams } from 'react-router-dom'
import { Card } from '../components/ui/Card'
import { EmptyState } from '../components/ui/EmptyState'
import { ErrorState } from '../components/ui/ErrorState'
import { Spinner } from '../components/ui/Spinner'
import { useFetch } from '../hooks/useFetch'
import { getArray, getIcon, getId, truncate } from '../utils/data'

export function ProjectDetail() {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const { setHeaderTitle } = useOutletContext()
  const projectFetch = useFetch(`/projects/${projectId}`, [projectId])
  const epicsFetch = useFetch(`/epics?project=${projectId}`, [projectId])
  const project = projectFetch.data?.data || projectFetch.data
  const epics = getArray(epicsFetch.data)

  useEffect(() => {
    setHeaderTitle(project?.name || 'Proyecto')
  }, [project?.name, setHeaderTitle])

  const loading = projectFetch.loading || epicsFetch.loading
  const error = projectFetch.error || epicsFetch.error

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
            projectFetch.refetch()
            epicsFetch.refetch()
          }}
        />
      ) : (
        <>
          {/* Project Header Banner with Atmospheric Glow */}
          <article className="bg-surface-container-low rounded-xl border border-outline-variant/10 p-6 sm:p-8 shadow-deep flex flex-col sm:flex-row gap-6 relative overflow-hidden group">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -z-10 group-hover:bg-primary/20 transition-colors duration-700 ease-in-out pointer-events-none" />
            <div className="text-4xl w-16 h-16 rounded-xl bg-surface-container flex items-center justify-center border border-outline-variant/10 flex-shrink-0">
              {getIcon(project) || '🚀'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-primary text-xs font-bold uppercase tracking-wider mb-1">Proyecto</p>
              <h1 className="text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight mb-2">{project?.name}</h1>
              <p className="text-sm md:text-base text-on-surface-variant max-w-4xl leading-relaxed mb-4">{project?.description || 'Sin descripción'}</p>
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-variant border border-outline-variant/30 text-on-surface-variant text-xs font-semibold">
                  {Array.isArray(project?.members)
                    ? `${project.members.length} miembros`
                    : 'Equipo asignado'}
                </span>
              </div>
            </div>
          </article>

          {/* Epics List */}
          <section className="flex flex-col gap-4">
            <div className="pb-2 border-b border-outline-variant/10">
              <h2 className="text-lg md:text-xl font-bold text-on-surface">Épicas</h2>
            </div>
            {epics.length === 0 ? (
              <EmptyState message="Este proyecto no tiene épicas" />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {epics.map((epic) => (
                  <Card
                    key={getId(epic)}
                    icon={getIcon(epic)}
                    title={epic.name}
                    description={truncate(epic.description)}
                    onClick={() => navigate(`/my-projects/${projectId}/${getId(epic)}`)}
                  />
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </section>
  )
}
