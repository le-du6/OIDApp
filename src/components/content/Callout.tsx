import type { ReactNode } from 'react'

/**
 * Encadrés pédagogiques : ⚠ Sécurité, 📜 Dans la spec, 🧨 Attaque, 💡 Repère.
 */
type Kind = 'security' | 'spec' | 'attack' | 'note'

const styles: Record<Kind, { border: string; bg: string; icon: string; defaultTitle: string }> = {
  security: {
    border: 'border-warning',
    bg: 'bg-warning-soft',
    icon: '⚠',
    defaultTitle: 'Sécurité',
  },
  spec: { border: 'border-line', bg: 'bg-surface-2', icon: '📜', defaultTitle: 'Dans la spec' },
  attack: { border: 'border-danger', bg: 'bg-danger-soft', icon: '🧨', defaultTitle: 'Attaque' },
  note: { border: 'border-ok', bg: 'bg-ok-soft', icon: '💡', defaultTitle: 'Repère' },
}

export function Callout({
  kind,
  title,
  specRef,
  children,
}: {
  kind: Kind
  title?: string
  specRef?: string
  children: ReactNode
}) {
  const s = styles[kind]
  return (
    <aside className={`my-4 rounded-lg border ${s.border} ${s.bg} p-3.5 text-sm`}>
      <p className="font-semibold">
        {s.icon} {title ?? s.defaultTitle}
      </p>
      <div className="mt-1.5 space-y-2 leading-relaxed">{children}</div>
      {specRef && <p className="mt-2 font-mono text-xs text-muted">📜 {specRef}</p>}
    </aside>
  )
}

/** Citation de spec : texte (traduit ou original) + référence obligatoire. */
export function SpecQuote({ specRef, children }: { specRef: string; children: ReactNode }) {
  return (
    <Callout kind="spec" specRef={specRef}>
      <blockquote className="border-l-2 border-muted pl-3 italic">{children}</blockquote>
    </Callout>
  )
}
