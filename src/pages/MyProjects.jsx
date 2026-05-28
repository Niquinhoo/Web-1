import { useNavigate } from 'react-router-dom'
import { Card } from '../components/ui/Card'
import { EmptyState } from '../components/ui/EmptyState'
import { ErrorState } from '../components/ui/ErrorState'
import { Spinner } from '../components/ui/Spinner'
import { useFetch } from '../hooks/useFetch'
import { getArray, getIcon, getId, truncate } from '../utils/data'
import { Clock } from '@phosphor-icons/react'

export function MyProjects() {
  const navigate = useNavigate()
  const { data, loading, error, refetch } = useFetch('/projects')
  const projects = getArray(data)

  return (
    <section className="flex flex-col gap-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight">Proyectos activos</h2>
          <div className="flex items-center gap-2 bg-surface-container px-3.5 py-1.5 rounded-full border border-outline-variant/20">
            {loading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-outline-variant border-t-primary rounded-full animate-spin" />
                <span className="text-xs font-semibold text-on-surface-variant">Sincronizando...</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-xs font-semibold text-on-surface-variant">Sincronizado</span>
              </>
            )}
          </div>
        </div>
      </div>
      
      {loading && projects.length === 0 ? (
        <div className="flex justify-center items-center py-20">
          <Spinner />
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : projects.length === 0 ? (
        <EmptyState message="No tenés proyectos asignados" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card
              key={getId(project)}
              icon={getIcon(project)}
              title={project.name}
              description={truncate(project.description)}
              onClick={() => navigate(`/my-projects/${getId(project)}`)}
            >
              <div className="mt-6 pt-4 border-t border-outline-variant/10 flex items-center justify-between relative z-10 w-full">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-tertiary" />
                  <span className="text-xs font-semibold text-on-surface-variant">En progreso</span>
                </div>
                <div className="flex items-center gap-1 text-outline">
                  <Clock size={14} />
                  <span className="text-xs font-semibold">Actualizado hace 2h</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </section>
  )
}
