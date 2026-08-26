import { useEffect, useMemo, useReducer } from 'react'
import { useReducedMotion } from 'motion/react'
import type { Scenario, Step } from '../../engine/scenario'
import { computeLayout } from '../../engine/layout'
import { initialSequencerState, sequencerReducer, stepDelayMs } from '../../engine/sequencer'
import { actorColor } from '../../lib/actors'
import { DiagramControls } from './DiagramControls'
import { StepArrow } from './StepArrow'
import { StepDetailPanel } from './StepDetailPanel'

/**
 * Le cœur de l'app : moteur de diagrammes de séquence SVG, data-driven.
 * Lecture animée pas-à-pas ; cliquer sur une flèche ouvre le détail de la
 * requête HTTP et des artefacts (tokens) de l'étape.
 */
export function SequenceDiagram({ scenario }: { scenario: Scenario }) {
  const [state, dispatch] = useReducer(
    sequencerReducer,
    scenario.steps.length,
    initialSequencerState,
  )
  const prefersReducedMotion = useReducedMotion() ?? false

  const layout = useMemo(() => computeLayout(scenario), [scenario])

  // Lecture automatique : un tick par étape, cadencé par la vitesse.
  useEffect(() => {
    if (!state.playing) return
    const delay = prefersReducedMotion ? stepDelayMs(state.speed) * 0.6 : stepDelayMs(state.speed)
    const timer = window.setTimeout(() => dispatch({ type: 'tick' }), delay)
    return () => window.clearTimeout(timer)
  }, [state.playing, state.stepIndex, state.speed, prefersReducedMotion])

  // La sélection EST l'étape courante : le panneau de détail suit la lecture,
  // et cliquer sur une flèche déplace la tête de lecture (seek).
  const selectedStep: Step | null = scenario.steps[state.stepIndex] ?? null

  return (
    <div className="grid gap-4 2xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="min-w-0 rounded-xl border border-line bg-surface">
        <DiagramControls state={state} dispatch={dispatch} />
        <div
          className="overflow-x-auto p-2"
          role="region"
          aria-label={`Diagramme : ${scenario.title}`}
        >
          {/*
           * SVG adaptatif : le viewBox porte la géométrie, la largeur suit le
           * conteneur (width:100%, height:auto) — le texte étant vectoriel, la
           * mise à l'échelle reste nette à toute taille. maxWidth borne la
           * taille naturelle (pas d'agrandissement démesuré sur écran large) ;
           * minWidth ne déclenche le défilement horizontal que sur les très
           * petites largeurs (mobile), pour éviter un texte illisible.
           */}
          <svg
            viewBox={`0 0 ${layout.width} ${layout.height}`}
            preserveAspectRatio="xMidYMid meet"
            className="mx-auto block h-auto w-full"
            style={{ minWidth: Math.min(layout.width, 540), maxWidth: layout.width }}
          >
            {/* Lifelines */}
            {scenario.actors.map((actor) => (
              <line
                key={`life-${actor.id}`}
                x1={layout.laneX[actor.id]}
                x2={layout.laneX[actor.id]}
                y1={layout.lifeline.top}
                y2={layout.lifeline.bottom}
                stroke="var(--line)"
                strokeWidth={1.5}
                strokeDasharray="4 5"
              />
            ))}
            {/* Têtes d'acteurs */}
            {scenario.actors.map((actor) => {
              const cx = layout.laneX[actor.id] ?? 0
              const color = actorColor(actor.role)
              return (
                <g key={actor.id}>
                  <rect
                    x={cx - layout.actorBox.width / 2}
                    y={layout.actorBox.y}
                    width={layout.actorBox.width}
                    height={layout.actorBox.height}
                    rx={10}
                    fill="var(--surface-2)"
                    stroke={color}
                    strokeWidth={1.5}
                  />
                  {/*
                   * foreignObject : le texte SVG ne sait pas passer à la ligne ;
                   * on rend nom + alias en HTML avec text-wrap balance/pretty
                   * (amélioration progressive : retour à la ligne standard sinon).
                   */}
                  <foreignObject
                    x={cx - layout.actorBox.width / 2}
                    y={layout.actorBox.y}
                    width={layout.actorBox.width}
                    height={layout.actorBox.height}
                    style={{ pointerEvents: 'none' }}
                  >
                    <div className="sd-actor-head">
                      <p className="sd-actor-name" style={{ color }}>
                        {actor.name}
                      </p>
                      {actor.alias && <p className="sd-actor-alias">{actor.alias}</p>}
                    </div>
                  </foreignObject>
                </g>
              )
            })}
            {/* Flèches des étapes déjà jouées */}
            {scenario.steps.map((step, i) => {
              if (i > state.stepIndex) return null
              return (
                <StepArrow
                  key={step.id}
                  step={step}
                  x1={layout.laneX[step.from] ?? 0}
                  x2={layout.laneX[step.to] ?? 0}
                  y={layout.stepY[i] ?? 0}
                  index={i}
                  isCurrent={i === state.stepIndex}
                  isSelected={i === state.stepIndex}
                  animate={!prefersReducedMotion && i === state.stepIndex}
                  onSelect={() => dispatch({ type: 'seek', index: i })}
                />
              )
            })}
          </svg>
        </div>
        <p className="border-t border-line px-4 py-2 text-xs text-muted">
          Cliquez sur une flèche pour inspecter la requête et les artefacts de l'étape.
        </p>
      </div>
      <StepDetailPanel scenario={scenario} step={selectedStep} />
    </div>
  )
}
