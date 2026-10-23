import type { FieldGuide } from '../../lib/field-guide'
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons'
import { AppIcon } from '../ui/AppIcon'
export function FieldExplanation({ guide, location }: { guide: FieldGuide; location: string }) {
  const rows = [
    ['Emplacement', location],
    ['Type', guide.type],
    ['Producteur → destinataire', `${guide.producer} → ${guide.recipient}`],
    ['Origine de la valeur', guide.origin],
    ['Contrôle attendu', guide.check],
    ['Présence', guide.requirement],
    ['Confidentialité', guide.sensitivity],
    ['Conservation', guide.retention],
    ['Référence', guide.specRef],
  ]
  return (
    <details className="mt-1 font-sans text-xs">
      <summary className="cursor-pointer text-accent">
        <AppIcon icon={faCircleInfo} className="mr-1.5 inline size-3" />
        Comprendre ce champ
      </summary>
      <p className="mt-2">{guide.description}</p>
      <dl className="mt-2 space-y-2">
        {rows.map(([label, value]) => (
          <div key={label}>
            <dt className="font-semibold text-muted">{label}</dt>
            <dd className="break-words">{value}</dd>
          </div>
        ))}
      </dl>
    </details>
  )
}
