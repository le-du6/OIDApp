import { useEffect, useRef, useState } from 'react'
import {
  faChevronUp,
  faCircleHalfStroke,
  faDownload,
  faFloppyDisk,
  faMoon,
  faPalette,
  faSliders,
  faSun,
  faTrashCan,
  faUpload,
} from '@fortawesome/free-solid-svg-icons'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { useImportProgress, useResetProgress } from '../../db/hooks'
import { buildProgressExport, downloadProgressExport } from '../../db/progress-io'
import { AppIcon } from '../ui/AppIcon'

function currentTheme(): 'dark' | 'light' {
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'
}

export function ProgressMenu({ placement = 'sidebar' }: { placement?: 'topbar' | 'sidebar' }) {
  const [open, setOpen] = useState(false)
  const [confirmingReset, setConfirmingReset] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [theme, setTheme] = useState<'dark' | 'light'>(currentTheme)
  const containerRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const reset = useResetProgress()
  const importMut = useImportProgress()

  const close = () => {
    setOpen(false)
    setConfirmingReset(false)
  }

  useEffect(() => {
    if (!open) return
    const onPointer = (event: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) close()
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const flash = (message: string) => {
    setFeedback(message)
    window.setTimeout(() => setFeedback(null), 3500)
  }
  const selectTheme = (next: 'dark' | 'light') => {
    document.documentElement.dataset.theme = next
    localStorage.setItem('oidapp-theme', next)
    setTheme(next)
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
    'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-xs text-ink transition-colors hover:bg-surface-2'
  const menuPosition =
    placement === 'sidebar'
      ? 'progress-menu absolute bottom-full left-0 z-30 mb-2 w-72 rounded-2xl border p-2'
      : 'progress-menu absolute right-0 top-full z-30 mt-2 w-72 rounded-2xl border p-2'

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => (open ? close() : setOpen(true))}
        className="group flex w-full items-center gap-2.5 rounded-xl px-2 py-2 text-left transition-colors hover:bg-surface-2"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="grid size-8 shrink-0 place-items-center rounded-lg border border-line bg-surface-2 text-muted group-hover:text-accent">
          <AppIcon icon={faSliders} className="size-3.5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-xs font-medium text-ink">Réglages</span>
          <span className="block truncate text-[10px] text-muted">Thème et données locales</span>
        </span>
        <AppIcon
          icon={faChevronUp}
          tone="muted"
          className={`size-3 transition-transform motion-reduce:transition-none ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div role="menu" aria-label="Réglages de l’application" className={menuPosition}>
          <div className="flex items-center gap-2 px-2 pb-2 pt-1">
            <AppIcon icon={faPalette} tone="accent" className="size-3.5" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted">
              Apparence
            </p>
          </div>
          <div className="grid grid-cols-2 gap-1 rounded-xl bg-bg p-1">
            <ThemeChoice
              label="Sombre"
              icon={faMoon}
              active={theme === 'dark'}
              onClick={() => selectTheme('dark')}
            />
            <ThemeChoice
              label="Clair"
              icon={faSun}
              active={theme === 'light'}
              onClick={() => selectTheme('light')}
            />
          </div>

          <div className="my-2 border-t border-line" />
          <div className="flex items-center gap-2 px-2 pb-1">
            <AppIcon icon={faCircleHalfStroke} tone="ok" className="size-3.5" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted">
              Progression
            </p>
          </div>
          <button
            type="button"
            role="menuitem"
            className={itemClass}
            onClick={() => void handleExport()}
          >
            <AppIcon icon={faDownload} tone="ok" className="size-3.5" />
            <span>
              <strong className="block font-medium">Exporter</strong>
              <span className="text-[10px] text-muted">Sauvegarde JSON locale</span>
            </span>
          </button>
          <button
            type="button"
            role="menuitem"
            className={itemClass}
            onClick={() => fileInputRef.current?.click()}
          >
            <AppIcon icon={faUpload} tone="client" className="size-3.5" />
            <span>
              <strong className="block font-medium">Importer</strong>
              <span className="text-[10px] text-muted">Restaurer une sauvegarde</span>
            </span>
          </button>

          {!confirmingReset ? (
            <button
              type="button"
              role="menuitem"
              className={`${itemClass} text-danger hover:bg-danger-soft`}
              onClick={() => setConfirmingReset(true)}
            >
              <AppIcon icon={faTrashCan} className="size-3.5" />
              Réinitialiser la progression
            </button>
          ) : (
            <div className="rounded-xl border border-danger/30 bg-danger-soft p-3">
              <p className="text-xs leading-relaxed">
                Effacer leçons, quiz et badges de ce navigateur ?
              </p>
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => void handleReset()}
                  disabled={reset.isPending}
                  className="rounded-lg bg-danger px-2.5 py-1.5 text-xs font-medium text-white disabled:opacity-50"
                >
                  {reset.isPending ? 'Effacement…' : 'Tout effacer'}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmingReset(false)}
                  className="rounded-lg border border-line px-2.5 py-1.5 text-xs"
                >
                  Annuler
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="application/json,.json"
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (file) void handleImportFile(file)
          event.target.value = ''
        }}
      />
      {feedback && (
        <p
          role="status"
          className="absolute bottom-full left-0 mb-2 w-full rounded-lg border border-line bg-surface px-3 py-2 text-xs text-muted shadow-lg"
        >
          <AppIcon icon={faFloppyDisk} tone="ok" className="mr-2 inline size-3" />
          {feedback}
        </p>
      )}
    </div>
  )
}

function ThemeChoice({
  label,
  icon,
  active,
  onClick,
}: {
  label: string
  icon: IconDefinition
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex items-center justify-center gap-2 rounded-lg px-2 py-2 text-xs transition-colors ${active ? 'bg-surface-2 text-accent shadow-sm' : 'text-muted hover:text-ink'}`}
    >
      <AppIcon icon={icon} className="size-3.5" />
      {label}
    </button>
  )
}
