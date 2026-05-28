import { useNavigate } from 'react-router-dom'
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

export function MyStories() {
  const navigate = useNavigate()
  const { data, loading, error, refetch } = useFetch('/stories')
  const stories = getArray(data)

  return (
    <section className="flex flex-col gap-6">
      {/* Section Header */}
      <div className="mb-4 opacity-0 animate-fade-up">
        <p className="text-primary text-xs font-bold uppercase tracking-wider mb-1">Mis stories</p>
        <h1 className="text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight mb-2">Trabajo narrado</h1>
        <p className="text-sm md:text-base text-on-surface-variant max-w-2xl leading-relaxed">
          Todas tus stories en una vista. Si el contexto viene populado, se muestra acá; si no, priorizamos estado y puntos.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Spinner />
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : stories.length === 0 ? (
        <EmptyState message="No tenés stories asignadas" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map((story) => {
            const storyId = getId(story)
            const epicId = getId(story.epic)
            const projectId = story.project ? getId(story.project) : null
            const hasDetailLink = projectId && epicId

            return (
              <Card
                key={storyId}
                icon={getIcon(story)}
                title={story.name}
                description={truncate(story.description)}
                badge={<StatusBadge status={story.status} />}
                onClick={
                  hasDetailLink
                    ? () => navigate(`/my-projects/${projectId}/${epicId}/${storyId}`)
                    : undefined
                }
              >
                <div className="mt-4 pt-4 border-t border-outline-variant/10 flex flex-wrap gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-surface-variant border border-outline-variant/30 text-on-surface-variant text-xs font-semibold">
                    {story.points ?? 0} puntos
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-surface-variant border border-outline-variant/30 text-on-surface-variant text-xs font-semibold">
                    {getAssignedLabel(story.assignedTo)}
                  </span>
                  {story.epic?.name ? (
                    <span className="px-2.5 py-1 rounded-md bg-surface-variant border border-outline-variant/30 text-on-surface-variant text-xs font-semibold truncate max-w-xs">
                      Épica: {story.epic.name}
                    </span>
                  ) : null}
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </section>
  )
}
