import { useState } from 'react'

/**
 * Arbre de décision interactif (« quel flow pour quel cas ? ») :
 * une question à la fois, réponses cliquables, fil des choix affiché.
 */
export type DecisionNode =
  | { kind: 'question'; id: string; question: string; options: { label: string; next: string }[] }
  | { kind: 'answer'; id: string; result: string; detail: string }

export function DecisionTree({ nodes, rootId }: { nodes: DecisionNode[]; rootId: string }) {
  const byId = new Map(nodes.map((n) => [n.id, n]))
  const [path, setPath] = useState<{ nodeId: string; picked?: string }[]>([{ nodeId: rootId }])
  const current = byId.get(path.at(-1)!.nodeId)

  const pick = (option: { label: string; next: string }) => {
    setPath((p) => [
      ...p.slice(0, -1),
      { ...p.at(-1)!, picked: option.label },
      { nodeId: option.next },
    ])
  }

  return (
    <div className="my-4 rounded-xl border border-line bg-surface p-4">
      <p className="mb-3 text-xs font-semibold text-muted">🧭 Quel flow pour votre cas ?</p>
      {path
        .filter((s) => s.picked)
        .map((s, i) => {
          const n = byId.get(s.nodeId)
          return (
            <p key={i} className="mb-1 text-xs text-muted">
              {n?.kind === 'question' ? n.question : ''} →{' '}
              <span className="text-ink">{s.picked}</span>
            </p>
          )
        })}
      {current?.kind === 'question' && (
        <div className="mt-2">
          <p className="mb-2 text-sm font-medium">{current.question}</p>
          <div className="flex flex-wrap gap-2">
            {current.options.map((o) => (
              <button
                key={o.label}
                type="button"
                onClick={() => pick(o)}
                className="rounded-md border border-line bg-surface-2 px-3 py-1.5 text-sm transition-colors hover:border-accent"
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
      )}
      {current?.kind === 'answer' && (
        <div className="mt-2 rounded-lg border border-ok bg-ok-soft p-3">
          <p className="text-sm font-semibold">→ {current.result}</p>
          <p className="mt-1 text-xs leading-relaxed">{current.detail}</p>
        </div>
      )}
      {path.length > 1 && (
        <button
          type="button"
          onClick={() => setPath([{ nodeId: rootId }])}
          className="mt-3 text-xs text-muted underline-offset-2 hover:text-accent hover:underline"
        >
          ↺ Recommencer
        </button>
      )}
    </div>
  )
}
