import { describe, expect, it } from 'vitest'
import { computeLayout, defaultLayoutConfig } from './layout'

const scenario = {
  actors: [
    { id: 'a', name: 'A', role: 'client' as const },
    { id: 'b', name: 'B', role: 'authorization-server' as const },
    { id: 'c', name: 'C', role: 'resource-server' as const },
  ],
  steps: [
    { id: 's1', from: 'a', to: 'b', label: 'x', kind: 'http' as const },
    { id: 's2', from: 'b', to: 'c', label: 'y', kind: 'http' as const },
  ],
}

describe('computeLayout', () => {
  it('espace les swimlanes régulièrement', () => {
    const l = computeLayout(scenario)
    const { laneGap, marginX } = defaultLayoutConfig
    expect(l.laneX['a']).toBe(marginX)
    expect(l.laneX['b']).toBe(marginX + laneGap)
    expect(l.laneX['c']).toBe(marginX + 2 * laneGap)
    expect(l.width).toBe(marginX * 2 + 2 * laneGap)
  })

  it('ordonne les étapes verticalement sous les têtes d’acteurs', () => {
    const l = computeLayout(scenario)
    expect(l.stepY).toHaveLength(2)
    expect(l.stepY[0]!).toBeGreaterThan(l.lifeline.top)
    expect(l.stepY[1]!).toBeGreaterThan(l.stepY[0]!)
    expect(l.lifeline.bottom).toBeGreaterThan(l.stepY[1]!)
    expect(l.height).toBeGreaterThan(l.lifeline.bottom)
  })

  it('la hauteur croît avec le nombre d’étapes', () => {
    const small = computeLayout(scenario)
    const big = computeLayout({
      ...scenario,
      steps: [
        ...scenario.steps,
        { id: 's3', from: 'c', to: 'a', label: 'z', kind: 'http' as const },
      ],
    })
    expect(big.height).toBe(small.height + defaultLayoutConfig.stepGap)
  })
})
