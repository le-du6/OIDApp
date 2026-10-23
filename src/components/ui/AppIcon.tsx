import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import type { ReactNode } from 'react'

type Tone = 'accent' | 'ok' | 'danger' | 'warning' | 'muted' | 'client' | 'issuer' | 'verifier'

const toneClass: Record<Tone, string> = {
  accent: 'text-accent',
  ok: 'text-ok',
  danger: 'text-danger',
  warning: 'text-warning',
  muted: 'text-muted',
  client: 'text-[var(--actor-client)]',
  issuer: 'text-[var(--actor-issuer)]',
  verifier: 'text-[var(--actor-verifier)]',
}

export function AppIcon({
  icon,
  tone,
  className = 'size-4',
}: {
  icon: IconDefinition
  tone?: Tone
  className?: string
}) {
  return (
    <FontAwesomeIcon
      icon={icon}
      className={`${className} shrink-0 ${tone ? toneClass[tone] : ''}`}
      aria-hidden="true"
    />
  )
}

export function IconBadge({
  icon,
  tone = 'accent',
  children,
  className = '',
}: {
  icon: IconDefinition
  tone?: Tone
  children?: ReactNode
  className?: string
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-lg border border-current/20 bg-current/5 px-2.5 py-1.5 ${toneClass[tone]} ${className}`}
    >
      <AppIcon icon={icon} className="size-3.5" />
      {children}
    </span>
  )
}
