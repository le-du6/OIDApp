import { motion } from 'motion/react'
import type { Step } from '../../engine/scenario'
import {
  DOT_GAP,
  LABEL_FONT_SIZE,
  fitCenteredLabel,
  labelTextWidth,
  layoutSelfLabel,
} from '../../engine/label-layout'

const kindStyle: Record<
  Step['kind'],
  { stroke: string; dash?: string; labelClass: string; color: string }
> = {
  http: { stroke: 'var(--ink)', labelClass: 'fill-[var(--ink)]', color: 'var(--ink)' },
  redirect: {
    stroke: 'var(--ink)',
    dash: '7 5',
    labelClass: 'fill-[var(--ink)]',
    color: 'var(--ink)',
  },
  'user-action': {
    stroke: 'var(--muted)',
    dash: '2 5',
    labelClass: 'fill-[var(--muted)]',
    color: 'var(--muted)',
  },
  internal: {
    stroke: 'var(--muted)',
    dash: '2 3',
    labelClass: 'fill-[var(--muted)]',
    color: 'var(--muted)',
  },
  attack: { stroke: 'var(--danger)', labelClass: 'fill-[var(--danger)]', color: 'var(--danger)' },
}

const securityDot: Record<'info' | 'warning' | 'danger', string> = {
  info: 'var(--ok)',
  warning: 'var(--warning)',
  danger: 'var(--danger)',
}

/**
 * Une flèche du diagramme : ligne animée (dessin gauche→droite au moment où
 * l'étape est jouée), tête de flèche, libellé cliquable, pastille sécurité.
 *
 * Auto-messages : le libellé est un bloc HTML (foreignObject) qui passe à la
 * ligne (3 lignes max) et se retourne à gauche quand la droite est trop
 * étroite (dernière lane) ; au-delà, troncature « … » + infobulle intégrale.
 * Flèches classiques : libellé mono-ligne centré, tronqué au bord du viewBox.
 */
export function StepArrow({
  step,
  x1,
  x2,
  y,
  index,
  isCurrent,
  isSelected,
  animate,
  viewWidth,
  onSelect,
}: {
  step: Step
  x1: number
  x2: number
  y: number
  index: number
  isCurrent: boolean
  isSelected: boolean
  animate: boolean
  /** Largeur du viewBox : borne la place disponible pour les libellés. */
  viewWidth: number
  onSelect: () => void
}) {
  const style = kindStyle[step.kind]
  const isSelf = x1 === x2
  const dir = x2 >= x1 ? 1 : -1
  const headX = x2 - dir * 10
  const midX = (x1 + x2) / 2
  const opacity = isCurrent || isSelected ? 1 : 0.55

  /** Auto-message : boîte du libellé (côté + wrap) ; la boucle suit le côté. */
  const selfBox = isSelf ? layoutSelfLabel(x1, viewWidth, y, step.label) : null
  const loopDir = selfBox && selfBox.side === 'left' ? -1 : 1
  const selfPath = `M ${x1 + 9 * loopDir} ${y - 6} H ${x1 + 34 * loopDir} Q ${x1 + 40 * loopDir} ${y - 6} ${x1 + 40 * loopDir} ${y} Q ${x1 + 40 * loopDir} ${y + 6} ${x1 + 34 * loopDir} ${y + 6} H ${x1 + 12 * loopDir}`
  const selfHead = `M ${x1 + 10 * loopDir} ${y + 6} L ${x1 + 20 * loopDir} ${y + 1} L ${x1 + 20 * loopDir} ${y + 11} Z`

  /** Flèche classique : libellé centré, tronqué s'il déborde du viewBox. */
  const centered = !isSelf ? fitCenteredLabel(step.label, midX, viewWidth) : null

  /** Zone de clic / halo de sélection : couvre la flèche ET le libellé. */
  const selfSpan =
    isSelf && selfBox
      ? {
          left: Math.min(x1 - 42, selfBox.x),
          right: Math.max(x1 + 42, selfBox.x + selfBox.width),
          top: selfBox.top,
          height: selfBox.height,
        }
      : null
  const hit = selfSpan
    ? {
        x: selfSpan.left - 6,
        y: selfSpan.top - 6,
        width: selfSpan.right - selfSpan.left + 12,
        height: selfSpan.height + 12,
      }
    : { x: Math.min(x1, x2) - 10, y: y - 26, width: (Math.abs(x2 - x1) || 320) + 20, height: 36 }

  /** Pastille sécurité : juste à l'extérieur du libellé (mesure réelle). */
  const dotCx = selfSpan
    ? selfBox && selfBox.side === 'right'
      ? selfBox.x + selfBox.width + DOT_GAP
      : selfBox
        ? selfBox.x - DOT_GAP
        : 0
    : midX + (centered ? labelTextWidth(centered.text) : 0) / 2 + DOT_GAP + 6
  const dotCy = selfSpan ? y : y - 13

  return (
    <g
      role="button"
      tabIndex={0}
      aria-label={`Étape ${index + 1} : ${step.label}`}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect()
        }
      }}
      style={{ cursor: 'pointer', opacity }}
      className="outline-none focus-visible:opacity-100"
    >
      {/* Zone de clic généreuse */}
      <rect x={hit.x} y={hit.y} width={hit.width} height={hit.height} fill="transparent" />
      {isSelf ? (
        <motion.path
          d={selfPath}
          fill="none"
          stroke={style.stroke}
          strokeWidth={isSelected ? 2.5 : 1.8}
          strokeDasharray={style.dash}
          initial={animate ? { pathLength: 0 } : false}
          animate={{ pathLength: 1 }}
          transition={{ duration: animate ? 0.45 : 0, ease: 'easeOut' }}
        />
      ) : (
        <motion.line
          x1={x1}
          y1={y}
          x2={x2}
          y2={y}
          stroke={style.stroke}
          strokeWidth={isSelected ? 2.5 : 1.8}
          strokeDasharray={style.dash}
          initial={animate ? { pathLength: 0 } : false}
          animate={{ pathLength: 1 }}
          transition={{ duration: animate ? 0.45 : 0, ease: 'easeOut' }}
        />
      )}
      {/* Tête de flèche */}
      <motion.path
        d={isSelf ? selfHead : `M ${x2} ${y} L ${headX} ${y - 5} L ${headX} ${y + 5} Z`}
        fill={style.stroke}
        initial={animate ? { opacity: 0 } : false}
        animate={{ opacity: 1 }}
        transition={{ delay: animate ? 0.4 : 0, duration: 0.15 }}
      />
      {/* Numéro d'étape */}
      <circle cx={x1} cy={y} r={9} fill="var(--surface-2)" stroke={style.stroke} strokeWidth={1} />
      <text x={x1} y={y + 3.5} textAnchor="middle" fontSize={9.5} fill="var(--ink)">
        {index + 1}
      </text>
      {/* Libellé */}
      {isSelf && selfBox ? (
        /*
         * foreignObject : le <text> SVG ne sait pas passer à la ligne ; on rend
         * le label en HTML (3 lignes max) et on le retourne à gauche quand la
         * droite est trop étroite. Troncature « … » + infobulle si ça ne
         * rentre pas dans 3 lignes.
         */
        <foreignObject
          x={selfBox.x - 2}
          y={selfBox.top}
          width={selfBox.width + 4}
          height={selfBox.height + 2}
        >
          <div
            className="sd-step-label"
            title={selfBox.truncated ? step.label : undefined}
            style={{
              color: style.color,
              textAlign: selfBox.align,
              fontStyle: step.kind === 'user-action' ? 'italic' : 'normal',
            }}
          >
            {selfBox.lines.join('\n')}
          </div>
        </foreignObject>
      ) : (
        centered && (
          <text
            x={midX}
            y={y - 9}
            textAnchor="middle"
            fontSize={LABEL_FONT_SIZE}
            fontFamily="var(--font-mono)"
            className={style.labelClass}
            style={{ fontStyle: step.kind === 'user-action' ? 'italic' : 'normal' }}
          >
            {centered.text}
            {centered.truncated && <title>{step.label}</title>}
          </text>
        )
      )}
      {/* Pastille sécurité */}
      {step.security && (
        <circle cx={dotCx} cy={dotCy} r={4} fill={securityDot[step.security.level]}>
          <title>{step.security.note}</title>
        </circle>
      )}
      {isSelected && selfSpan && (
        <rect
          x={selfSpan.left - 4}
          y={selfSpan.top - 5}
          width={selfSpan.right - selfSpan.left + 8}
          height={selfSpan.height + 10}
          rx={8}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={1.2}
          strokeDasharray="3 3"
        />
      )}
      {isSelected && !selfSpan && (
        <rect
          x={Math.min(x1, x2) - 14}
          y={y - 24}
          width={Math.abs(x2 - x1) + 28}
          height={34}
          rx={8}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={1.2}
          strokeDasharray="3 3"
        />
      )}
    </g>
  )
}
