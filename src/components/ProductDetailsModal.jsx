import React, { useEffect } from 'react'

export default function ProductDetailsModal({ open, item, title, image, description, details = [], actions = [], onClose }) {
  useEffect(() => {
    if (!open) return undefined

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open || !item) return null

  return (
    <div className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-4" onClick={onClose}>
      <div
        className="w-full md:max-w-2xl bg-surface rounded-t-3xl md:rounded-2xl shadow-2xl border border-outline-variant overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 px-4 sm:px-6 py-4 border-b border-outline-variant bg-surface-container-lowest sticky top-0 z-10">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-1">Mais informações</p>
            <h3 className="font-headline-md text-headline-md text-on-background break-words">{title || item.name || item.label}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex-shrink-0 w-10 h-10 rounded-full bg-background border border-outline-variant text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
            aria-label="Fechar detalhes"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="overflow-y-auto">
          {(image || item.image) && (
            <div className="w-full aspect-[16/10] bg-gradient-to-br from-primary-fixed-dim to-tertiary-fixed/30 flex items-center justify-center overflow-hidden">
              {image || item.image ? (
                <img
                  src={image || item.image}
                  alt={title || item.name || item.label}
                  className="w-full h-full object-cover"
                  onError={(event) => {
                    event.currentTarget.style.display = 'none'
                  }}
                />
              ) : null}
            </div>
          )}

          <div className="px-4 sm:px-6 py-5 space-y-5">
            {description && (
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed whitespace-pre-line">
                {description}
              </p>
            )}

            {details.length > 0 && (
              <div className="grid gap-3 sm:grid-cols-2">
                {details.map((detail) => (
                  <div key={detail.label} className="rounded-xl border border-outline-variant bg-background p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-primary font-semibold mb-1">{detail.label}</p>
                    <p className="font-semibold text-on-surface break-words">{detail.value}</p>
                  </div>
                ))}
              </div>
            )}

            {actions.length > 0 && (
              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                {actions.map((action) => (
                  <button
                    key={action.label}
                    type="button"
                    onClick={action.onClick}
                    className={action.className || 'w-full sm:w-auto px-5 py-3 rounded-xl bg-primary text-white font-label-md text-label-md hover:bg-primary-light transition-colors'}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}