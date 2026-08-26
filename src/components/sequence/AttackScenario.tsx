import { useState } from 'react'
import { useScenario } from '../../engine/useScenario'
import { SequenceDiagram } from './SequenceDiagram'

/**
 * Wrapper « attaque / contre-mesure » : joue d'abord le flow attaqué
 * (acteur Attacker en rouge), puis bascule sur le flow protégé pour
 * rejouer la même histoire avec la contre-mesure en place.
 */
export function AttackScenario({
  attackId,
  protectedId,
  attackLabel = '🧨 Flow attaqué',
  protectedLabel = '🛡 Flow protégé',
}: {
  attackId: string
  protectedId: string
  attackLabel?: string
  protectedLabel?: string
}) {
  const [mode, setMode] = useState<'attack' | 'protected'>('attack')
  const active = mode === 'attack' ? attackId : protectedId

  return (
    <div>
      <div className="mb-3 flex gap-2" role="tablist" aria-label="Attaque ou contre-mesure">
        {(
          [
            ['attack', attackLabel, 'border-danger bg-danger-soft'],
            ['protected', protectedLabel, 'border-ok bg-ok-soft'],
          ] as const
        ).map(([m, label, activeCls]) => (
          <button
            key={m}
            type="button"
            role="tab"
            aria-selected={mode === m}
            onClick={() => setMode(m)}
            className={`rounded-md border px-3.5 py-1.5 text-sm font-medium transition-colors ${
              mode === m ? activeCls : 'border-line text-muted hover:border-muted'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <ScenarioLoader key={active} scenarioId={active} />
    </div>
  )
}

export function ScenarioLoader({ scenarioId }: { scenarioId: string }) {
  const { data: scenario, isLoading, error } = useScenario(scenarioId)
  if (isLoading) return <p className="text-sm text-muted">Chargement du scénario…</p>
  if (error || !scenario) {
    return (
      <div className="rounded-xl border border-danger bg-danger-soft p-4 text-sm">
        <p className="font-semibold">Scénario invalide ou introuvable</p>
        <pre className="mt-2 overflow-x-auto text-xs">{String(error)}</pre>
      </div>
    )
  }
  return <SequenceDiagram scenario={scenario} />
}
