import { useEffect } from 'react'
import { X } from '@phosphor-icons/react'

export function Modal({ isOpen, onClose, title, children, closeDisabled = false }) {
  useEffect(() => {
    if (!isOpen) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && !closeDisabled) onClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [closeDisabled, isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-[2px]" role="presentation">
      <section
        className="bg-surface-container-lowest border border-outline-variant/20 rounded-[1.2rem] w-full max-w-md max-h-[90vh] overflow-y-auto p-6 shadow-deep relative flex flex-col gap-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="flex items-center justify-between pb-2 border-b border-outline-variant/10">
          <h2 className="text-lg font-bold text-on-surface" id="modal-title">
            {title}
          </h2>
          <button
            className="text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/50 transition-all duration-200 p-1.5 rounded-full active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            type="button"
            aria-label="Cerrar modal"
            onClick={onClose}
            disabled={closeDisabled}
          >
            <X size={18} weight="bold" />
          </button>
        </div>
        <div>
          {children}
        </div>
      </section>
    </div>
  )
}
