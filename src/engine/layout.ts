import type { Scenario } from './scenario'

/**
 * Calcul de géométrie du diagramme de séquence (pur, testable).
 * Le rendu SVG ne fait qu'appliquer ces coordonnées.
 */

export type DiagramLayout = {
  width: number
  height: number
  /** x du centre de chaque swimlane, par id d'acteur. */
  laneX: Record<string, number>
  /** y de la ligne de chaque étape (index aligné sur scenario.steps). */
  stepY: number[]
  actorBox: { width: number; height: number; y: number }
  /** y du haut et du bas des lifelines. */
  lifeline: { top: number; bottom: number }
}

export type LayoutConfig = {
  laneGap: number
  marginX: number
  actorBoxWidth: number
  actorBoxHeight: number
  headerGap: number
  stepGap: number
  footerGap: number
}

export const defaultLayoutConfig: LayoutConfig = {
  laneGap: 190,
  marginX: 110,
  actorBoxWidth: 176,
  actorBoxHeight: 66,
  headerGap: 34,
  stepGap: 64,
  footerGap: 24,
}

export function computeLayout(
  scenario: Pick<Scenario, 'actors' | 'steps'>,
  config: LayoutConfig = defaultLayoutConfig,
): DiagramLayout {
  const { actors, steps } = scenario
  const laneX: Record<string, number> = {}
  actors.forEach((actor, i) => {
    laneX[actor.id] = config.marginX + i * config.laneGap
  })

  const width = config.marginX * 2 + (actors.length - 1) * config.laneGap
  const lifelineTop = config.actorBoxHeight + config.headerGap
  const stepY = steps.map((_, i) => lifelineTop + (i + 1) * config.stepGap)
  const lastY = stepY.at(-1) ?? lifelineTop
  const lifelineBottom = lastY + config.stepGap / 2
  const height = lifelineBottom + config.footerGap

  return {
    width,
    height,
    laneX,
    stepY,
    actorBox: { width: config.actorBoxWidth, height: config.actorBoxHeight, y: 0 },
    lifeline: { top: lifelineTop, bottom: lifelineBottom },
  }
}
