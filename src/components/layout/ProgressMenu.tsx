import { useEffect, useRef, useState } from 'react'
import { useImportProgress, useResetProgress } from '../../db/hooks'
import { buildProgressExport, downloadProgressExport } from '../../db/progress-io'

/**
 * Sous-menu « Progression » : regroupe les actions sur la progression locale —
 * exporter (sauvegarde JSON), importer, et réinitialiser. La réinitialisation
 * est destructrice : confirmation en deux temps directement dans le menu
 * (pas de dialog natif). Menu accessible : fermeture au clic extérieur et à
 * la touche Échap.
 */
type ProgressMenuProps = {
  placement?: 'topbar' | 'sidebar'
}

export function ProgressMenu({ placement = 'topbar' }: ProgressMenuProps) {
  const [open, setOpen] = useState(false)
  const [confirmingReset, setConfirmingReset] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const reset = useResetProgress()
  const importMut = useImportProgress()

  // Fermeture au clic extérieur / Échap ; on remet le menu à son état de repos.
  useEffect(() => {
    if (!open) return
    const onPointer = (e: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) close()
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const close = () => {
    setOpen(false)
    setConfirmingReset(false)
  }

  const flash = (msg: string) => {
    setFeedback(msg)
    window.setTimeout(() => setFeedback(null), 3500)
  }

  const handleExport = async () => {
    downloadProgressExport(await buildProgressExport())
    close()
    flash('Progression exportée.')
  }

  const handleImportFile = async (file: File) => {
    try {
      const json: unknown = JSON.parse(await file.text())
      await importMut.mutateAsync(json)
      flash('Progression importée.')
    } catch {
      flash('Fichier invalide : import annulé.')
    } finally {
      close()
    }
  }

  const handleReset = async () => {
    await reset.mutateAsync()
    close()
    flash('Progression réinitialisée.')
  }

  const itemClass =
    'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-ink transition-colors hover:bg-surface-2'
  const triggerClass =
    placement === 'sidebar'
      ? 'flex w-full items-center justify-between rounded-xl border border-line bg-surface-2 px-3 py-2 text-sm text-ink transition-colors hover:border-accent'
      : 'flex items-center gap-1.5 rounded-md border border-line bg-surface-2 px-3 py-1.5 text-sm text-ink transition-colors hover:border-accent'
  const menuPositionClass =
    placement === 'sidebar'
      ? 'absolute bottom-full left-0 z-20 mb-2 w-full rounded-2xl border border-line bg-surface p-1.5 shadow-xl'
      : 'absolute right-0 z-20 mt-2 w-64 rounded-xl border border-line bg-surface p-1.5 shadow-lg'
  const feedbackPositionClass =
    placement === 'sidebar'
      ? 'absolute bottom-full left-0 mb-2 w-full rounded-lg border border-line bg-surface px-3 py-2 text-xs text-muted shadow-lg'
      : 'absolute right-0 top-full mt-2 w-64 rounded-md border border-line bg-surface px-3 py-2 text-xs text-muted shadow-lg'

  return (
    <div className="relative w-full" ref={containerRef}>
      <button
        type="button"
        onClick={() => (open ? close() : setOpen(true))}
        className={triggerClass}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span>Progression</span>
        <span
          aria-hidden
          className={`text-[10px] transition-transform ${open ? 'rotate-180' : ''}`}
        >
          ▾
        </span>
      </button>

      {open && (
        <div role="menu" aria-label="Actions sur la progression" className={menuPositionClass}>
          <p className="px-3 pb-1.5 pt-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
            Données locales
          </p>
          <button
            type="button"
            role="menuitem"
            className={itemClass}
            onClick={() => void handleExport()}
          >
            Exporter en JSON
          </button>
          <button
            type="button"
            role="menuitem"
            className={itemClass}
            onClick={() => fileInputRef.current?.click()}
          >
            Importer une sauvegarde
          </button>

          <div className="my-1.5 border-t border-line" />

          {!confirmingReset ? (
            <button
              type="button"
              role="menuitem"
              className={`${itemClass} text-danger hover:bg-danger-soft`}
              onClick={() => setConfirmingReset(true)}
            >
              Réinitialiser la progression
            </button>
          ) : (
            <div className="rounded-md bg-danger-soft p-2.5">
              <p className="text-xs leading-relaxed text-ink">
                Effacer <strong>toute</strong> votre progression (leçons, quiz, badges) sur ce
                navigateur ? Action irréversible — pensez à exporter d'abord.
              </p>
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => void handleReset()}
                  disabled={reset.isPending}
                  className="rounded-md border border-danger bg-danger px-2.5 py-1 text-xs font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  {reset.isPending ? 'Effacement…' : 'Oui, tout effacer'}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmingReset(false)}
                  className="rounded-md border border-line px-2.5 py-1 text-xs transition-colors hover:border-accent"
                >
                  Annuler
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Import : input fichier masqué, déclenché par l'item du menu. */}
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json,.json"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) void handleImportFile(file)
          e.target.value = '' // permet de réimporter le même fichier
        }}
      />

      {feedback && (
        <p role="status" className={feedbackPositionClass}>
          {feedback}
        </p>
      )}
    </div>
  )
}
