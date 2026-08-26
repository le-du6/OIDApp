import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { parseScenario } from './scenario'

const validScenario = {
  id: 'test/minimal',
  title: 'Minimal',
  actors: [
    { id: 'a', name: 'A', role: 'client' },
    { id: 'b', name: 'B', role: 'authorization-server' },
  ],
  steps: [{ id: 's1', from: 'a', to: 'b', label: 'GET /x', kind: 'http' }],
}

describe('parseScenario', () => {
  it('accepte un scénario minimal valide', () => {
    expect(parseScenario(validScenario).id).toBe('test/minimal')
  })

  it('rejette un acteur inconnu référencé par une étape', () => {
    const bad = {
      ...validScenario,
      steps: [{ id: 's1', from: 'a', to: 'ghost', label: 'x', kind: 'http' }],
    }
    expect(() => parseScenario(bad)).toThrowError(/acteur inconnu/)
  })

  it('rejette des ids d’étapes dupliqués', () => {
    const bad = {
      ...validScenario,
      steps: [
        { id: 's1', from: 'a', to: 'b', label: 'x', kind: 'http' },
        { id: 's1', from: 'b', to: 'a', label: 'y', kind: 'http' },
      ],
    }
    expect(() => parseScenario(bad)).toThrowError(/dupliqués/)
  })

  it('rejette un rôle d’acteur hors nomenclature', () => {
    const bad = {
      ...validScenario,
      actors: [{ id: 'a', name: 'A', role: 'hacker' }, validScenario.actors[1]],
    }
    expect(() => parseScenario(bad)).toThrow()
  })

  it('valide TOUS les scénarios livrés (public/scenarios/**)', () => {
    const dir = join(__dirname, '../../public/scenarios/oauth2')
    const files = readdirSync(dir).filter((f) => f.endsWith('.json'))
    expect(files.length).toBeGreaterThanOrEqual(6) // Definition of done Phase 1
    for (const file of files) {
      const scenario = parseScenario(JSON.parse(readFileSync(join(dir, file), 'utf-8')))
      expect(scenario.id, file).toBe(`oauth2/${file.replace(/\.json$/, '')}`)
    }
  })

  it('valide le scénario livré : oauth2/authorization-code', () => {
    const raw = readFileSync(
      join(__dirname, '../../public/scenarios/oauth2/authorization-code.json'),
      'utf-8',
    )
    const scenario = parseScenario(JSON.parse(raw))
    expect(scenario.actors).toHaveLength(5)
    expect(scenario.steps.length).toBeGreaterThanOrEqual(10)
    // Le point pédagogique central : l'échange du code se fait en back channel.
    const tokenStep = scenario.steps.find((s) => s.id === 'token-request')
    expect(tokenStep?.request?.channel).toBe('back')
  })
})
