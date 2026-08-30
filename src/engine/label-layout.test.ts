import { describe, expect, it } from 'vitest'
import {
  LABEL_CHAR_WIDTH,
  fitCenteredLabel,
  labelTextWidth,
  layoutSelfLabel,
  wrapLabel,
} from './label-layout'

const LABEL = 'Vérifie tout : Issuer ✓ disclosures ✓ KB ✓ nonce ✓' // 50 car.

describe('labelTextWidth', () => {
  it('mesure à l’avance monospace (0.6em)', () => {
    expect(labelTextWidth('abcde')).toBeCloseTo(5 * LABEL_CHAR_WIDTH)
  })
})

describe('wrapLabel', () => {
  it('laisse un label court sur une ligne', () => {
    const { lines, truncated } = wrapLabel('Scanne le QR', 200)
    expect(lines).toEqual(['Scanne le QR'])
    expect(truncated).toBe(false)
  })

  it('coupe aux espaces sans dépasser la largeur', () => {
    const maxWidth = 30 * LABEL_CHAR_WIDTH
    const { lines, truncated } = wrapLabel(LABEL, maxWidth)
    expect(lines.length).toBeLessThanOrEqual(3)
    for (const line of lines) expect(line.length).toBeLessThanOrEqual(30)
    expect(truncated).toBe(false)
    expect(lines.join(' ')).toBe(LABEL)
  })

  it('tronque avec « … » si ça ne rentre pas dans maxLines', () => {
    const { lines, truncated } = wrapLabel(LABEL, 15 * LABEL_CHAR_WIDTH, 3)
    expect(lines).toHaveLength(3)
    for (const line of lines) expect(line.length).toBeLessThanOrEqual(15)
    expect(truncated).toBe(true)
    expect(lines[2]).toBe('disclosures ✓…')
  })

  it('casse les mots plus longs qu’une ligne', () => {
    const { lines, truncated } = wrapLabel('abcdefghijkl', 10 * LABEL_CHAR_WIDTH, 3)
    expect(lines).toEqual(['abcdefghij', 'kl'])
    expect(truncated).toBe(false)
  })

  it('tombe sur une ligne unique tronquée si l’espace est mince', () => {
    const { lines, truncated } = wrapLabel('hello world', 40)
    expect(lines).toEqual(['hell…'])
    expect(truncated).toBe(true)
  })
})

describe('layoutSelfLabel', () => {
  it('reste à droite quand c’est le côté le plus large', () => {
    const box = layoutSelfLabel(110, 600, 100, LABEL)
    expect(box.side).toBe('right')
    expect(box.x).toBe(160)
  })

  it('flippe à gauche sur la dernière lane', () => {
    const box = layoutSelfLabel(490, 600, 100, LABEL)
    expect(box.side).toBe('left')
    expect(box.x + box.width).toBe(440)
    expect(box.align).toBe('right')
  })

  it('centre le bloc verticalement sur l’étape', () => {
    const box = layoutSelfLabel(490, 600, 100, LABEL)
    expect(box.top + box.height / 2).toBeCloseTo(100)
  })

  it('garde chaque label dans le viewBox, quelle que soit la lane', () => {
    for (const laneX of [110, 300, 490]) {
      const box = layoutSelfLabel(laneX, 600, 100, LABEL)
      expect(box.x).toBeGreaterThanOrEqual(-0.001)
      expect(box.x + box.width).toBeLessThanOrEqual(600)
    }
  })

  it('wrappe sur l’espace réel du côté choisi (pas le plus petit)', () => {
    // dernière lane d’un diagramme 600 px : 52 px à droite, 430 px à gauche
    const box = layoutSelfLabel(490, 600, 100, LABEL)
    expect(box.side).toBe('left')
    // 50 car. × 6.9 px = 345 px < 430 px → la ligne unique tient
    expect(box.lines).toEqual([LABEL])
    expect(box.truncated).toBe(false)
  })

  it('wrappe (2 lignes) quand aucun côté n’absorbe la ligne unique', () => {
    // lane médiane d’un diagramme de 600 px : 240 px de place de chaque côté
    const box = layoutSelfLabel(300, 600, 100, LABEL)
    expect(box.lines.length).toBeGreaterThan(1)
    expect(box.lines.length).toBeLessThanOrEqual(3)
    expect(box.truncated).toBe(false)
  })
})

describe('fitCenteredLabel', () => {
  it('laisse passer les labels qui tiennent', () => {
    expect(fitCenteredLabel('GET /authorize', 300, 600)).toEqual({
      text: 'GET /authorize',
      truncated: false,
    })
  })

  it('tronque au bord du viewBox', () => {
    const { text, truncated } = fitCenteredLabel(LABEL, 100, 600)
    expect(truncated).toBe(true)
    expect(text.endsWith('…')).toBe(true)
    const half = Math.min(100, 600 - 100) - 10
    expect(labelTextWidth(text)).toBeLessThanOrEqual(half * 2 + 0.001)
  })
})
