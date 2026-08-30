/**
 * Géométrie des libellés de flèches (pure, testable).
 *
 * Les libellés sont en police monospace : l'avance d'un caractère est
 * constante (0.6em), la mesure est donc triviale — pas de canvas ni de
 * getBBox à orchestrer. Le rendu (StepArrow) applique ces boîtes.
 */

/** Taille de police des libellés de flèches (doit suivre StepArrow). */
export const LABEL_FONT_SIZE = 11.5
/** Avance monospace ≈ 0.6em. */
export const LABEL_CHAR_WIDTH = LABEL_FONT_SIZE * 0.6
/** Hauteur de ligne (line-height 1.15). */
export const LABEL_LINE_HEIGHT = LABEL_FONT_SIZE * 1.15
/** Écart entre la lifeline et le libellé d'un auto-message. */
export const SELF_LABEL_GAP = 50
/** Marge conservée par rapport au bord du viewBox. */
const EDGE_PAD = 10
/** Écart pastille sécurité ↔ libellé. */
export const DOT_GAP = 6

/** Largeur d'un texte monospace en px. */
export function labelTextWidth(text: string): number {
  return text.length * LABEL_CHAR_WIDTH
}

export type WrappedLabel = {
  lines: string[]
  truncated: boolean
}

/**
 * Enveloppe un label sur des lignes de `maxWidth` px max : coupe aux
 * espaces, casse les mots plus longs qu'une ligne, et si ça ne rentre pas
 * dans `maxLines` tronque la dernière ligne avec « … ».
 */
export function wrapLabel(text: string, maxWidth: number, maxLines = 3): WrappedLabel {
  const maxChars = Math.max(1, Math.floor(maxWidth / LABEL_CHAR_WIDTH))

  // Espace trop mince pour un wrap lisible : ligne unique tronquée.
  if (maxChars < 8) {
    const fits = text.length <= maxChars
    return {
      lines: [fits ? text : `${text.slice(0, maxChars - 1).trimEnd()}…`],
      truncated: !fits,
    }
  }

  const words = text.split(' ').filter(Boolean)
  const lines: string[] = []
  let current = ''

  for (let i = 0; i < words.length; i++) {
    let word = words[i] ?? ''
    const candidate = current ? `${current} ${word}` : word

    if (candidate.length <= maxChars) {
      current = candidate
      continue
    }
    // Plus de lignes disponibles : la dernière absorbe le reste, tronqué.
    if (lines.length >= maxLines - 1) {
      const remaining = [current, ...words.slice(i)].filter(Boolean).join(' ')
      lines.push(`${remaining.slice(0, maxChars - 1).trimEnd()}…`)
      return { lines, truncated: true }
    }
    if (current) {
      lines.push(current)
      current = ''
    }
    while (word.length > maxChars && lines.length < maxLines - 1) {
      lines.push(word.slice(0, maxChars))
      word = word.slice(maxChars)
    }
    current = word
  }

  if (current) lines.push(current)
  return { lines, truncated: false }
}

/** Boîte d'un libellé d'auto-message : côté, position, lignes, wrap. */
export type SelfLabelBox = {
  side: 'left' | 'right'
  x: number
  width: number
  top: number
  height: number
  align: 'left' | 'right'
  lines: string[]
  truncated: boolean
}

/**
 * Place le libellé d'un auto-message autour de sa lifeline : côté offrant
 * le plus de place dans le viewBox (flip à gauche sur la dernière lane),
 * wrap sur 3 lignes max, bloc centré verticalement sur l'étape.
 */
export function layoutSelfLabel(
  laneX: number,
  viewWidth: number,
  stepY: number,
  label: string,
  maxLines = 3,
): SelfLabelBox {
  const rightSpace = viewWidth - (laneX + SELF_LABEL_GAP) - EDGE_PAD
  const leftSpace = laneX - SELF_LABEL_GAP - EDGE_PAD
  const side: SelfLabelBox['side'] = rightSpace >= leftSpace ? 'right' : 'left'
  const space = side === 'right' ? rightSpace : leftSpace
  const maxWidth = Math.max(LABEL_CHAR_WIDTH, space)
  const { lines, truncated } = wrapLabel(label, maxWidth, maxLines)
  const height = lines.length * LABEL_LINE_HEIGHT
  const width = Math.max(...lines.map(labelTextWidth))
  return {
    side,
    x: side === 'right' ? laneX + SELF_LABEL_GAP : laneX - SELF_LABEL_GAP - width,
    width,
    top: stepY - height / 2,
    height,
    align: side === 'right' ? 'left' : 'right',
    lines,
    truncated,
  }
}

/**
 * Filet de sécurité des flèches classiques : le label est centré sur
 * `midX` ; le tronque avec « … » s'il déborderait du viewBox.
 */
export function fitCenteredLabel(
  label: string,
  midX: number,
  viewWidth: number,
): { text: string; truncated: boolean } {
  const half = Math.max(LABEL_CHAR_WIDTH / 2, Math.min(midX, viewWidth - midX) - EDGE_PAD)
  const maxChars = Math.max(1, Math.floor((half * 2) / LABEL_CHAR_WIDTH))
  if (label.length <= maxChars) return { text: label, truncated: false }
  return {
    text: `${label.slice(0, Math.max(1, maxChars - 1)).trimEnd()}…`,
    truncated: true,
  }
}
