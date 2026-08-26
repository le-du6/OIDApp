import { useEffect, useId, useRef, useState } from 'react'
import { getGlossaryEntry } from '../../data/glossary'
import { actorColor } from '../../lib/actors'

/**
 * Terme technique cliquable : popover avec définition FR, terme EN officiel,
 * référence de spec et critique du nom si méritée. Le code couleur des
 * acteurs s'applique aussi ici (cohérence texte ↔ diagrammes ↔ glossaire).
 */
export function Term({ id, children }: { id: string; children?: React.ReactNode }) {
  const entry = getGlossaryEntry(id)
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)
  const popId = useId()

  useEffect(() => {
    if (!open) return
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent && e.key !== 'Escape') return
      if (e instanceof MouseEvent && ref.current?.contains(e.target as Node)) return
      setOpen(false)
    }
    document.addEventListener('mousedown', close)
    document.addEventListener('keydown', close)
    return () => {
      document.removeEventListener('mousedown', close)
      document.removeEventListener('keydown', close)
    }
  }, [open])

  if (!entry) return <span className="text-danger">[terme inconnu : {id}]</span>

  const color = entry.actorRole ? actorColor(entry.actorRole) : undefined

  return (
    <span ref={ref} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={popId}
        className="cursor-pointer border-b border-dotted border-current font-medium text-accent hover:border-solid"
        style={color ? { color } : undefined}
      >
        {children ?? entry.term}
      </button>
      {open && (
        <span
          id={popId}
          role="tooltip"
          className="absolute left-0 top-full z-30 mt-1.5 block w-80 max-w-[85vw] rounded-lg border border-line bg-surface-2 p-3 text-left text-sm font-normal shadow-xl"
        >
          <span className="block font-semibold text-ink" style={color ? { color } : undefined}>
            {entry.term}
          </span>
          {entry.expansion && (
            <span className="block text-xs text-muted italic">{entry.expansion}</span>
          )}
          <span className="mt-1.5 block leading-relaxed text-ink/90">{entry.definition}</span>
          {entry.naming && (
            <span className="mt-2 block rounded border-l-2 border-warning bg-warning-soft py-1 pl-2 pr-1 text-xs leading-relaxed">
              🏷️ {entry.naming}
            </span>
          )}
          <span className="mt-2 block font-mono text-xs text-muted">📜 {entry.specRef}</span>
        </span>
      )}
    </span>
  )
}
