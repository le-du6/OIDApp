import type { Scenario, SecurityNote, Step } from '../../engine/scenario'
import { HttpRequestView } from '../http/HttpRequestView'
import { JwtInspector } from '../jwt/JwtInspector'

const securityStyles: Record<
  SecurityNote['level'],
  { border: string; bg: string; icon: string; title: string }
> = {
  info: { border: 'border-ok', bg: 'bg-ok-soft', icon: '🛈', title: 'Sécurité' },
  warning: { border: 'border-warning', bg: 'bg-warning-soft', icon: '⚠', title: 'Attention' },
  danger: { border: 'border-danger', bg: 'bg-danger-soft', icon: '🧨', title: 'Danger' },
}

/**
 * Panneau latéral : détail pédagogique de l'étape sélectionnée — résumé,
 * encadré sécurité, requête HTTP complète, artefacts inspectables (JWT…).
 */
export function StepDetailPanel({ scenario, step }: { scenario: Scenario; step: Step | null }) {
  if (!step) {
    return (
      <aside className="rounded-xl border border-line bg-surface p-5 text-sm text-muted">
        <h3 className="mb-2 text-base font-semibold text-ink">{scenario.title}</h3>
        <p>{scenario.description}</p>
        {scenario.specRefs && (
          <p className="mt-3 font-mono text-xs">📜 {scenario.specRefs.join(' · ')}</p>
        )}
        <p className="mt-4">
          Lancez la lecture ▶ ou cliquez sur une flèche du diagramme pour afficher ici le détail de
          chaque étape.
        </p>
      </aside>
    )
  }

  const security = step.security ? securityStyles[step.security.level] : null

  return (
    <aside className="space-y-4 rounded-xl border border-line bg-surface p-5" aria-live="polite">
      <div>
        <p className="font-mono text-xs text-muted">
          {step.from} → {step.to}
        </p>
        <h3 className="mt-1 font-mono text-sm font-semibold text-ink">{step.label}</h3>
      </div>
      {step.summary && <p className="text-sm leading-relaxed text-ink/90">{step.summary}</p>}
      {step.security && security && (
        <div className={`rounded-lg border ${security.border} ${security.bg} p-3 text-sm`}>
          <p className="font-semibold">
            {security.icon} {security.title}
          </p>
          <p className="mt-1 leading-relaxed">{step.security.note}</p>
          {step.security.specRef && (
            <p className="mt-2 font-mono text-xs text-muted">📜 {step.security.specRef}</p>
          )}
        </div>
      )}
      {step.request && <HttpRequestView exchange={step.request} />}
      {step.tokens?.map((token) =>
        token.format === 'jwt' ? (
          <JwtInspector key={token.id} label={token.label} jwt={token.value} note={token.note} />
        ) : (
          <div key={token.id} className="rounded-lg border border-line bg-surface-2 p-3">
            <p className="text-xs font-semibold text-muted">{token.label}</p>
            <code className="mt-1 block break-all font-mono text-sm text-accent">
              {token.value}
            </code>
            {token.note && <p className="mt-2 text-xs text-muted">{token.note}</p>}
          </div>
        ),
      )}
    </aside>
  )
}
