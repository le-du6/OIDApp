import type { ReactNode } from 'react'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import {
  faBomb,
  faBookBookmark,
  faLightbulb,
  faShieldHalved,
} from '@fortawesome/free-solid-svg-icons'
import { AppIcon } from '../ui/AppIcon'

/**
 * Encadrés pédagogiques avec un vocabulaire visuel constant.
 */
type Kind = 'security' | 'spec' | 'attack' | 'note'

const styles: Record<
  Kind,
  {
    border: string
    bg: string
    icon: IconDefinition
    tone: 'warning' | 'muted' | 'danger' | 'ok'
    defaultTitle: string
  }
> = {
  security: {
    border: 'border-warning',
    bg: 'bg-warning-soft',
    icon: faShieldHalved,
    tone: 'warning',
    defaultTitle: 'Sécurité',
  },
  spec: {
    border: 'border-line',
    bg: 'bg-surface-2',
    icon: faBookBookmark,
    tone: 'muted',
    defaultTitle: 'Dans la spec',
  },
  attack: {
    border: 'border-danger',
    bg: 'bg-danger-soft',
    icon: faBomb,
    tone: 'danger',
    defaultTitle: 'Attaque',
  },
  note: {
    border: 'border-ok',
    bg: 'bg-ok-soft',
    icon: faLightbulb,
    tone: 'ok',
    defaultTitle: 'Repère',
  },
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
      <p className="flex items-center gap-2 font-semibold">
        <AppIcon icon={s.icon} tone={s.tone} className="size-4" /> {title ?? s.defaultTitle}
      </p>
      <div className="mt-1.5 space-y-2 leading-relaxed">{children}</div>
      {specRef && (
        <p className="mt-2 flex items-start gap-2 font-mono text-xs text-muted">
          <AppIcon icon={faBookBookmark} className="mt-0.5 size-3" />
          {specRef}
        </p>
      )}
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
