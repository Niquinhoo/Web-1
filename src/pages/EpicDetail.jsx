import { useEffect } from 'react'
import { useNavigate, useOutletContext, useParams } from 'react-router-dom'
import { Card } from '../components/ui/Card'
import { EmptyState } from '../components/ui/EmptyState'
import { ErrorState } from '../components/ui/ErrorState'
import { Spinner } from '../components/ui/Spinner'
import { StatusBadge } from '../components/ui/StatusBadge'
import { useFetch } from '../hooks/useFetch'
import {
  getArray,
  getAssignedLabel,
  getIcon,
  getId,
  truncate,
} from '../utils/data'

export function EpicDetail() {
  const { projectId, epicId } = useParams()
  const navigate = useNavigate()
  const { setHeaderTitle } = useOutletContext()
  const epicFetch = useFetch(`/epics/${epicId}`, [epicId])
  const storiesFetch = useFetch(`/stories?epic=${epicId}`, [epicId])
  const epic = epicFetch.data?.data || epicFetch.data
  const stories = getArray(storiesFetch.data)

  useEffect(() => {
    setHeaderTitle(epic?.name || 'Épica')
  }, [epic?.name, setHeaderTitle])

  const loading = epicFetch.loading || storiesFetch.loading
  const error = epicFetch.error || storiesFetch.error

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
            epicFetch.refetch()
            storiesFetch.refetch()
          }}
        />
      ) : (
        <>
          {/* Epic Header Banner */}
          <article className="bg-surface-container-low rounded-xl border border-outline-variant/10 p-6 sm:p-8 shadow-deep flex flex-col sm:flex-row gap-6 relative overflow-hidden group">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -z-10 group-hover:bg-primary/20 transition-colors duration-700 ease-in-out pointer-events-none" />
            <div className="text-4xl w-16 h-16 rounded-xl bg-surface-container flex items-center justify-center border border-outline-variant/10 flex-shrink-0">
              {getIcon(epic) || '⚡'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-primary text-xs font-bold uppercase tracking-wider mb-1">Épica</p>
              <h1 className="text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight mb-2">{epic?.name}</h1>
              <p className="text-sm md:text-base text-on-surface-variant max-w-4xl leading-relaxed">{epic?.description || 'Sin descripción'}</p>
            </div>
          </article>

          {/* Stories List */}
          <section className="flex flex-col gap-4">
            <div className="pb-2 border-b border-outline-variant/10">
              <h2 className="text-lg md:text-xl font-bold text-on-surface">Stories</h2>
            </div>
            {stories.length === 0 ? (
              <EmptyState message="Esta épica no tiene stories" />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {stories.map((story) => (
                  <Card
                    key={getId(story)}
                    icon={getIcon(story)}
                    title={story.name}
                    description={truncate(story.description)}
                    badge={<StatusBadge status={story.status} />}
                    onClick={() =>
                      navigate(`/my-projects/${projectId}/${epicId}/${getId(story)}`)
                    }
                  >
                    <div className="mt-4 pt-4 border-t border-outline-variant/10 flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-1 rounded-md bg-surface-variant border border-outline-variant/30 text-on-surface-variant text-xs font-semibold">
                        {story.points ?? 0} puntos
                      </span>
                      <span className="px-2.5 py-1 rounded-md bg-surface-variant border border-outline-variant/30 text-on-surface-variant text-xs font-semibold">
                        {getAssignedLabel(story.assignedTo)}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </section>
  )
}
