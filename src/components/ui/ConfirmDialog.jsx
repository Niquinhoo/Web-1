import { Modal } from './Modal'
import { Spinner } from './Spinner'

export function ConfirmDialog({
  isOpen,
  onConfirm,
  onCancel,
  message,
  loading = false,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title="Confirmar acción"
      closeDisabled={loading}
    >
      <div className="flex flex-col gap-5">
        <p className="text-sm text-on-surface-variant leading-relaxed">{message}</p>
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-outline-variant/10">
          <button
            className="bg-transparent border border-outline-variant/30 hover:border-primary text-on-surface hover:text-primary text-xs font-semibold px-5 py-2.5 rounded-full hover:scale-[1.02] transition-all duration-200 cursor-pointer active:scale-95 disabled:opacity-50"
            type="button"
            onClick={onCancel}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            className="bg-red-500 hover:bg-red-600 text-white text-xs font-semibold px-5 py-2.5 rounded-full hover:scale-[1.02] hover:shadow-lg transition-all duration-200 cursor-pointer active:scale-95 disabled:opacity-50 flex items-center justify-center gap-1.5"
            type="button"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? <Spinner size="small" /> : null}
            {loading ? 'Eliminando...' : 'Confirmar'}
          </button>
        </div>
      </div>
    </Modal>
  )
}
