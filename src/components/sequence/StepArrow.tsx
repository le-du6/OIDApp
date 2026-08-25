import { motion } from 'motion/react'
import type { Step } from '../../engine/scenario'

const kindStyle: Record<Step['kind'], { stroke: string; dash?: string; labelClass: string }> = {
  http: { stroke: 'var(--ink)', labelClass: 'fill-[var(--ink)]' },
  redirect: { stroke: 'var(--ink)', dash: '7 5', labelClass: 'fill-[var(--ink)]' },
  'user-action': { stroke: 'var(--muted)', dash: '2 5', labelClass: 'fill-[var(--muted)]' },
  internal: { stroke: 'var(--muted)', dash: '2 3', labelClass: 'fill-[var(--muted)]' },
  attack: { stroke: 'var(--danger)', labelClass: 'fill-[var(--danger)]' },
}

const securityDot: Record<'info' | 'warning' | 'danger', string> = {
  info: 'var(--ok)',
  warning: 'var(--warning)',
  danger: 'var(--danger)',
}

/**
 * Une flèche du diagramme : ligne animée (dessin gauche→droite au moment où
 * l'étape est jouée), tête de flèche, libellé cliquable, pastille sécurité.
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
  onSelect: () => void
}) {
  const style = kindStyle[step.kind]
  const dir = x2 >= x1 ? 1 : -1
  const headX = x2 - dir * 10
  const midX = (x1 + x2) / 2
  const opacity = isCurrent || isSelected ? 1 : 0.55

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
      <rect
        x={Math.min(x1, x2)}
        y={y - 26}
        width={Math.abs(x2 - x1) || 40}
        height={36}
        fill="transparent"
      />
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
      {/* Tête de flèche */}
      <motion.path
        d={`M ${x2} ${y} L ${headX} ${y - 5} L ${headX} ${y + 5} Z`}
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
      <text
        x={midX}
        y={y - 9}
        textAnchor="middle"
        fontSize={11.5}
        fontFamily="var(--font-mono)"
        className={style.labelClass}
        style={{ fontStyle: step.kind === 'user-action' ? 'italic' : 'normal' }}
      >
        {step.label}
      </text>
      {/* Pastille sécurité */}
      {step.security && (
        <circle
          cx={midX + measureOffset(step.label)}
          cy={y - 13}
          r={4}
          fill={securityDot[step.security.level]}
        >
          <title>{step.security.note}</title>
        </circle>
      )}
      {isSelected && (
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

/** Décale la pastille sécurité à droite du libellé (approximation monospace). */
function measureOffset(label: string): number {
  return Math.min(label.length * 3.4, 150) + 12
}
