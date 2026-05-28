export function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 rounded-xl border border-red-500/20 bg-red-950/10 text-center" role="alert">
      <p className="text-red-400 text-sm font-semibold mb-4 max-w-sm leading-relaxed">{message}</p>
      {onRetry ? (
        <button
          className="bg-surface-container border border-outline-variant/30 hover:border-primary text-on-surface hover:text-primary text-xs font-semibold px-5 py-2.5 rounded-full hover:scale-[1.02] transition-all duration-200 cursor-pointer active:scale-95"
          type="button"
          onClick={onRetry}
        >
          Reintentar
        </button>
      ) : null}
    </div>
  )
}
