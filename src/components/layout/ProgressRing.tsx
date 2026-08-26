/**
 * Jauge de progression circulaire — SVG maison (pas de lib de charts).
 *
 * `shrink-0` est ESSENTIEL : la jauge vit dans un conteneur flex à côté d'un
 * texte de longueur variable. Sans lui, flexbox écrase le SVG sur les cartes
 * à description longue (les attributs width/height ne sont pas une taille
 * minimale pour un flex item).
 */
export function ProgressRing({
  ratio,
  size = 76,
  stroke = 7,
  label,
}: {
  ratio: number
  size?: number
  stroke?: number
  label?: string
}) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const clamped = Math.max(0, Math.min(1, ratio))
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="shrink-0"
      style={{ width: size, height: size }}
      role="img"
      aria-label={label ?? `Progression : ${Math.round(clamped * 100)} %`}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="var(--line)"
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={clamped >= 1 ? 'var(--ok)' : 'var(--accent)'}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - clamped)}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: 'stroke-dashoffset 0.6s ease' }}
      />
      <text
        x="50%"
        y="50%"
        dominantBaseline="central"
        textAnchor="middle"
        fontSize={size / 3.6}
        fontWeight={700}
        fill={clamped >= 1 ? 'var(--ok)' : 'var(--ink)'}
      >
        {Math.round(clamped * 100)}%
      </text>
    </svg>
  )
}
