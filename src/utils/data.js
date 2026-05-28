export const getId = (item) => item?._id || item?.id

export const getIcon = (item, fallback = '◌') => item?.icon || fallback

export const truncate = (value = '', limit = 120) => {
  if (!value) return 'Sin descripción'
  return value.length > limit ? `${value.slice(0, limit).trim()}...` : value
}

export const formatDate = (value) => {
  if (!value) return 'Sin fecha'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Sin fecha'
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

export const getPersonName = (person) => {
  if (!person) return null
  if (typeof person === 'string') return person
  if (person.name?.first || person.name?.last) {
    return [person.name.first, person.name.last].filter(Boolean).join(' ')
  }
  return person.username || person.email || getId(person)
}

export const getAssignedLabel = (assignedTo) => {
  if (!assignedTo) return 'Sin asignar'
  if (Array.isArray(assignedTo)) {
    const names = assignedTo.map(getPersonName).filter(Boolean)
    return names.length ? names.join(', ') : `${assignedTo.length} asignados`
  }
  return getPersonName(assignedTo) || 'Sin asignar'
}

export const getArray = (payload) => {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.data)) return payload.data
  if (Array.isArray(payload?.projects)) return payload.projects
  if (Array.isArray(payload?.epics)) return payload.epics
  if (Array.isArray(payload?.stories)) return payload.stories
  if (Array.isArray(payload?.tasks)) return payload.tasks
  return []
}
