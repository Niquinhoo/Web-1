export function Spinner({ size = 'default' }) {
  return (
    <span
      className={`border-outline-variant border-t-primary rounded-full animate-spin inline-block ${
        size === 'small' ? 'w-4 h-4 border-2' : 'w-8 h-8 border-3'
      }`}
      aria-label="Cargando"
      role="status"
    />
  )
}
