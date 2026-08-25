/**
 * Séquenceur pur (sans React) du diagramme de séquence.
 * Un reducer testable pilote la lecture pas-à-pas : play/pause, avance,
 * recul, saut direct, vitesse. `stepIndex === -1` signifie « avant la
 * première étape » (diagramme vide, seuls les acteurs sont posés).
 */

export type SequencerState = {
  /** Index de l'étape courante ; -1 = avant le début. */
  stepIndex: number
  /** Nombre total d'étapes du scénario joué. */
  stepCount: number
  playing: boolean
  /** Multiplicateur de vitesse (0.5, 1, 2…). */
  speed: number
}

export type SequencerAction =
  | { type: 'play' }
  | { type: 'pause' }
  | { type: 'toggle' }
  | { type: 'next' }
  | { type: 'prev' }
  | { type: 'reset' }
  | { type: 'seek'; index: number }
  | { type: 'setSpeed'; speed: number }
  /** Tick d'horloge émis pendant la lecture automatique. */
  | { type: 'tick' }

export function initialSequencerState(stepCount: number): SequencerState {
  return { stepIndex: -1, stepCount, playing: false, speed: 1 }
}

function clampIndex(index: number, stepCount: number): number {
  return Math.max(-1, Math.min(index, stepCount - 1))
}

export function sequencerReducer(state: SequencerState, action: SequencerAction): SequencerState {
  switch (action.type) {
    case 'play': {
      // Relancer depuis la fin = repartir du début.
      const atEnd = state.stepIndex >= state.stepCount - 1
      return { ...state, playing: true, stepIndex: atEnd ? -1 : state.stepIndex }
    }
    case 'pause':
      return { ...state, playing: false }
    case 'toggle':
      return sequencerReducer(state, { type: state.playing ? 'pause' : 'play' })
    case 'next':
      return {
        ...state,
        playing: false,
        stepIndex: clampIndex(state.stepIndex + 1, state.stepCount),
      }
    case 'prev':
      return {
        ...state,
        playing: false,
        stepIndex: clampIndex(state.stepIndex - 1, state.stepCount),
      }
    case 'reset':
      return { ...state, playing: false, stepIndex: -1 }
    case 'seek':
      return { ...state, playing: false, stepIndex: clampIndex(action.index, state.stepCount) }
    case 'setSpeed':
      return { ...state, speed: action.speed }
    case 'tick': {
      if (!state.playing) return state
      const next = state.stepIndex + 1
      if (next >= state.stepCount) {
        // Fin de lecture : on s'arrête sur la dernière étape.
        return { ...state, playing: false, stepIndex: state.stepCount - 1 }
      }
      return { ...state, stepIndex: next }
    }
  }
}

/** Durée d'affichage d'une étape (ms) à vitesse 1. */
export const STEP_DURATION_MS = 1600

export function stepDelayMs(speed: number): number {
  return STEP_DURATION_MS / Math.max(0.1, speed)
}
