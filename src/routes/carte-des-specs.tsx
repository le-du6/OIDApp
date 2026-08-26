import { useMemo, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  Background,
  Handle,
  Position,
  ReactFlow,
  type Edge,
  type Node,
  type NodeProps,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { edgeKindMeta, familyMeta, specEdges, specNodes, type SpecNode } from '../data/spec-map'

export const Route = createFileRoute('/carte-des-specs')({
  component: SpecMapPage,
})

/**
 * Carte des specs : graphe interactif (@xyflow/react) — nœuds = RFC/specs,
 * arêtes = « étend / profile / remplace / s'appuie sur ». Cliquer un nœud
 * ouvre son détail. Positions fixes (chronologie verticale, familles en
 * colonnes) ; le pan/zoom reste libre.
 */

type SpecFlowNode = Node<{ spec: SpecNode; selected: boolean }, 'spec'>

function SpecNodeView({ data }: NodeProps<SpecFlowNode>) {
  const color = familyMeta[data.spec.family].color
  return (
    <div
      className="rounded-lg border-2 bg-surface px-3 py-2 shadow-sm transition-transform hover:-translate-y-0.5"
      style={{
        borderColor: color,
        boxShadow: data.selected
          ? `0 0 0 3px color-mix(in srgb, ${color} 35%, transparent)`
          : undefined,
        width: 170,
      }}
    >
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      <p className="text-[13px] font-bold leading-tight" style={{ color }}>
        {data.spec.label}
      </p>
      <p className="text-[11px] leading-tight text-muted">{data.spec.sub}</p>
      {data.spec.status !== 'final' && (
        <p className="mt-0.5 text-[9px] font-medium uppercase tracking-wide text-warning">
          {data.spec.status === 'draft' ? 'draft / évolutif' : 'règlement'}
        </p>
      )}
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
    </div>
  )
}

const nodeTypes = { spec: SpecNodeView }

function SpecMapPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = specNodes.find((n) => n.id === selectedId) ?? null

  const nodes: SpecFlowNode[] = useMemo(
    () =>
      specNodes.map((spec) => ({
        id: spec.id,
        type: 'spec',
        position: { x: spec.x, y: spec.y },
        data: { spec, selected: spec.id === selectedId },
      })),
    [selectedId],
  )

  const edges: Edge[] = useMemo(
    () =>
      specEdges.map((e, i) => {
        const active = selectedId !== null && (e.source === selectedId || e.target === selectedId)
        return {
          id: `e${i}`,
          source: e.source,
          target: e.target,
          label: edgeKindMeta[e.kind].label,
          labelStyle: { fill: 'var(--muted)', fontSize: 10 },
          labelBgStyle: { fill: 'var(--surface)', fillOpacity: 0.85 },
          style: {
            stroke: active ? 'var(--accent)' : 'var(--line)',
            strokeWidth: active ? 2.2 : 1.4,
            strokeDasharray: edgeKindMeta[e.kind].dash,
          },
          animated: active,
        }
      }),
    [selectedId],
  )

  return (
    <div className="mx-auto max-w-7xl space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Carte des specs</h1>
        <p className="mt-1 text-sm text-muted">
          Comment les pièces s'emboîtent : pleine = <em>étend</em>, tirets = <em>profile</em>,
          pointillés = <em>remplace/consolide</em>, tirets longs = <em>s'appuie sur</em>. Cliquez un
          nœud pour son résumé et ses relations ; molette/pincement pour zoomer.
        </p>
        <p className="mt-2 flex flex-wrap gap-3 text-xs">
          {Object.entries(familyMeta).map(([key, fam]) => (
            <span key={key} className="flex items-center gap-1.5">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ background: fam.color }}
              />
              {fam.label}
            </span>
          ))}
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="h-[560px] min-w-0 overflow-hidden rounded-xl border border-line bg-surface">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodeClick={(_, node) => setSelectedId(node.id)}
            onPaneClick={() => setSelectedId(null)}
            fitView
            fitViewOptions={{ padding: 0.15 }}
            minZoom={0.35}
            maxZoom={1.6}
            nodesConnectable={false}
            elementsSelectable={false}
            proOptions={{ hideAttribution: true }}
            colorMode="dark"
            style={{ background: 'transparent' }}
          >
            <Background color="var(--line)" gap={28} />
          </ReactFlow>
        </div>

        <aside className="h-fit rounded-xl border border-line bg-surface p-4 text-sm">
          {selected ? (
            <>
              <p className="font-bold" style={{ color: familyMeta[selected.family].color }}>
                {selected.label} — {selected.sub}
              </p>
              <p className="mt-2 leading-relaxed text-ink/90">{selected.description}</p>
              <div className="mt-3 border-t border-line pt-2 text-xs text-muted">
                {specEdges
                  .filter((e) => e.source === selected.id || e.target === selected.id)
                  .map((e, i) => {
                    const other = e.source === selected.id ? e.target : e.source
                    const otherNode = specNodes.find((n) => n.id === other)!
                    const verb =
                      e.source === selected.id
                        ? edgeKindMeta[e.kind].label
                        : `← ${edgeKindMeta[e.kind].label} par`
                    return (
                      <p key={i} className="py-0.5">
                        <span className="text-ink/80">{verb}</span>{' '}
                        <button
                          type="button"
                          className="text-accent underline-offset-2 hover:underline"
                          onClick={() => setSelectedId(otherNode.id)}
                        >
                          {otherNode.label}
                        </button>{' '}
                        <span>({otherNode.sub})</span>
                      </p>
                    )
                  })}
              </div>
            </>
          ) : (
            <p className="text-muted">
              Sélectionnez un nœud pour afficher son rôle et naviguer dans ses relations. Les specs
              marquées « draft / évolutif » sont celles dont la version de référence est affichée en
              tête de chaque module.
            </p>
          )}
        </aside>
      </div>
    </div>
  )
}
