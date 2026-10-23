import type { Dispatch } from 'react'
import type { SequencerAction, SequencerState } from '../../engine/sequencer'
import {
  faBackwardStep,
  faChevronLeft,
  faChevronRight,
  faGaugeHigh,
  faPause,
  faPlay,
} from '@fortawesome/free-solid-svg-icons'
import { AppIcon } from '../ui/AppIcon'

const speeds = [0.5, 1, 2] as const

/** Barre de contrôle de lecture : reset / précédent / play-pause / suivant / vitesse. */
export function DiagramControls({
  state,
  dispatch,
}: {
  state: SequencerState
  dispatch: Dispatch<SequencerAction>
}) {
  const btn =
    'rounded-md border border-line bg-surface-2 px-3 py-1.5 text-sm text-ink transition-colors hover:border-accent disabled:opacity-40 disabled:hover:border-line'
  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-line px-4 py-3">
      <button
        type="button"
        className={btn}
        onClick={() => dispatch({ type: 'reset' })}
        aria-label="Revenir au début"
      >
        <AppIcon icon={faBackwardStep} className="size-3.5" />
      </button>
      <button
        type="button"
        className={btn}
        onClick={() => dispatch({ type: 'prev' })}
        disabled={state.stepIndex <= -1}
        aria-label="Étape précédente"
      >
        <AppIcon icon={faChevronLeft} className="size-3.5" />
      </button>
      <button
        type="button"
        className={`${btn} min-w-20 border-accent bg-accent-soft font-medium`}
        onClick={() => dispatch({ type: 'toggle' })}
        aria-label={state.playing ? 'Pause' : 'Lecture'}
      >
        <AppIcon icon={state.playing ? faPause : faPlay} className="mr-2 inline size-3.5" />
        {state.playing ? 'Pause' : 'Lecture'}
      </button>
      <button
        type="button"
        className={btn}
        onClick={() => dispatch({ type: 'next' })}
        disabled={state.stepIndex >= state.stepCount - 1}
        aria-label="Étape suivante"
      >
        <AppIcon icon={faChevronRight} className="size-3.5" />
      </button>
      <span className="ml-2 text-sm text-muted tabular-nums" aria-live="polite">
        {state.stepIndex + 1} / {state.stepCount}
      </span>
      <div className="ml-auto flex items-center gap-1" role="group" aria-label="Vitesse de lecture">
        <AppIcon icon={faGaugeHigh} tone="muted" className="mr-1 size-3.5" />
        {speeds.map((s) => (
          <button
            key={s}
            type="button"
            className={`rounded-md px-2 py-1 text-xs transition-colors ${
              state.speed === s ? 'bg-accent-soft text-accent' : 'text-muted hover:text-ink'
            }`}
            onClick={() => dispatch({ type: 'setSpeed', speed: s })}
            aria-pressed={state.speed === s}
          >
            ×{s}
          </button>
        ))}
      </div>
    </div>
  )
}
