import { describe, expect, it } from 'vitest'
import {
  initialSequencerState,
  sequencerReducer,
  stepDelayMs,
  STEP_DURATION_MS,
  type SequencerState,
} from './sequencer'

const run = (state: SequencerState, ...actions: Parameters<typeof sequencerReducer>[1][]) =>
  actions.reduce(sequencerReducer, state)

describe('sequencerReducer', () => {
  it('démarre avant la première étape', () => {
    expect(initialSequencerState(5)).toEqual({
      stepIndex: -1,
      stepCount: 5,
      playing: false,
      speed: 1,
    })
  })

  it('next avance et se borne à la dernière étape', () => {
    let s = initialSequencerState(2)
    s = run(s, { type: 'next' }, { type: 'next' })
    expect(s.stepIndex).toBe(1)
    s = sequencerReducer(s, { type: 'next' })
    expect(s.stepIndex).toBe(1)
  })

  it('prev recule et se borne à -1', () => {
    let s = run(initialSequencerState(3), { type: 'seek', index: 1 })
    s = run(s, { type: 'prev' }, { type: 'prev' }, { type: 'prev' })
    expect(s.stepIndex).toBe(-1)
  })

  it('next/prev mettent la lecture en pause (contrôle manuel)', () => {
    const s = run(initialSequencerState(3), { type: 'play' }, { type: 'next' })
    expect(s.playing).toBe(false)
  })

  it('tick avance pendant la lecture puis s’arrête à la fin', () => {
    let s = run(initialSequencerState(2), { type: 'play' })
    s = sequencerReducer(s, { type: 'tick' })
    expect(s).toMatchObject({ stepIndex: 0, playing: true })
    s = run(s, { type: 'tick' }, { type: 'tick' })
    expect(s).toMatchObject({ stepIndex: 1, playing: false })
  })

  it('tick est sans effet en pause', () => {
    const s = sequencerReducer(initialSequencerState(3), { type: 'tick' })
    expect(s.stepIndex).toBe(-1)
  })

  it('play depuis la fin repart du début', () => {
    let s = run(initialSequencerState(2), { type: 'seek', index: 1 }, { type: 'play' })
    expect(s.stepIndex).toBe(-1)
    expect(s.playing).toBe(true)
  })

  it('seek borne l’index dans [-1, count-1]', () => {
    const s = initialSequencerState(3)
    expect(sequencerReducer(s, { type: 'seek', index: 99 }).stepIndex).toBe(2)
    expect(sequencerReducer(s, { type: 'seek', index: -99 }).stepIndex).toBe(-1)
  })

  it('reset revient avant le début et coupe la lecture', () => {
    const s = run(
      initialSequencerState(3),
      { type: 'seek', index: 2 },
      { type: 'play' },
      { type: 'reset' },
    )
    expect(s).toMatchObject({ stepIndex: -1, playing: false })
  })

  it('la vitesse divise le délai entre étapes', () => {
    expect(stepDelayMs(2)).toBe(STEP_DURATION_MS / 2)
    expect(stepDelayMs(0.5)).toBe(STEP_DURATION_MS * 2)
  })
})
