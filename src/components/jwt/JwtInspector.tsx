import { FieldExplanation } from '../content/FieldExplanation'
import {
  inferJwtContext,
  jwtFieldGuide,
  jwtKeyExplanation,
  type JwtContext,
} from '../../lib/field-guide'
import { useMemo, useState } from 'react'
import { decodeJwt, formatEpochClaim, JwtDecodeError } from '../../lib/jwt'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { AppIcon } from '../ui/AppIcon'

/**
 * Décodage live d'un JWT : trois zones colorées (header / payload /
 * signature), claims annotés, dates lisibles. La vérification de signature
 * viendra avec le Crypto Lab (WebCrypto).
 */
export function JwtInspector({
  label,
  jwt,
  note,
  context,
}: {
  label: string
  jwt: string
  note?: string
  context?: JwtContext
}) {
  const [zone, setZone] = useState<'header' | 'payload' | 'signature'>('payload')

  const decoded = useMemo(() => {
    try {
      return { ok: true as const, value: decodeJwt(jwt) }
    } catch (e) {
      return { ok: false as const, error: e instanceof JwtDecodeError ? e.message : 'JWT invalide' }
    }
  }, [jwt])

  if (!decoded.ok) {
    return (
      <div className="rounded-lg border border-danger bg-danger-soft p-3 text-sm">
        <p className="font-semibold">JWT indécodable</p>
        <p className="mt-1 text-xs">{decoded.error}</p>
      </div>
    )
  }

  const { raw, header, payload, signature } = decoded.value
  const profile = context ?? inferJwtContext(header, payload)
  const zones = [
    { id: 'header' as const, label: 'Header', color: 'text-accent', raw: raw.header },
    { id: 'payload' as const, label: 'Payload', color: 'text-ok', raw: raw.payload },
    {
      id: 'signature' as const,
      label: 'Signature',
      color: 'text-[var(--actor-user)]',
      raw: raw.signature,
    },
  ]

  return (
    <div className="overflow-hidden rounded-lg border border-line">
      <div className="border-b border-line bg-surface-2 px-3 py-2">
        <p className="flex items-center gap-2 text-xs font-semibold text-muted">
          <AppIcon icon={faMagnifyingGlass} tone="accent" className="size-3" />
          {label}
        </p>
      </div>
      {/* Le JWT brut, trois segments colorés cliquables */}
      <p className="break-all p-3 font-mono text-[11px] leading-relaxed">
        {zones.map((z, i) => (
          <span key={z.id}>
            {i > 0 && <span className="text-muted">.</span>}
            <button
              type="button"
              onClick={() => setZone(z.id)}
              className={`${z.color} ${zone === z.id ? 'underline decoration-dotted' : 'opacity-75 hover:opacity-100'} break-all text-left`}
              aria-pressed={zone === z.id}
            >
              {z.raw}
            </button>
          </span>
        ))}
      </p>
      <div className="border-t border-line p-3">
        {zone === 'signature' ? (
          <p className="text-xs leading-relaxed text-muted">
            Algorithme déclaré :{' '}
            {typeof header.alg === 'string' ? header.alg : 'absent ou non textuel'} ; signature :{' '}
            {signature.length} caractères base64url. La signature couvre les octets de{' '}
            <code>header.payload</code>. {jwtKeyExplanation(profile)} Décoder ne vérifie ni la
            signature, ni le contexte, ni la confiance. Le type affiché est une aide de lecture, pas
            une validation.
          </p>
        ) : (
          <ClaimsTable
            claims={zone === 'header' ? header : payload}
            context={profile}
            location={zone}
          />
        )}
      </div>
      {note && <p className="border-t border-line px-3 py-2 text-xs text-muted">{note}</p>}
    </div>
  )
}

function ClaimsTable({
  claims,
  context,
  location,
}: {
  claims: Record<string, unknown>
  context: JwtContext
  location: string
}) {
  return (
    <table className="w-full table-fixed border-collapse font-mono text-xs">
      <tbody>
        {Object.entries(claims).map(([name, value]) => {
          const meta = jwtFieldGuide(name, context)
          const date = formatEpochClaim(name, value)
          return (
            <tr key={name} className="border-b border-line/50 align-top last:border-0">
              <td className="w-24 break-words py-1 pr-3">
                {meta ? (
                  <span
                    className="cursor-help border-b border-dotted border-muted text-accent"
                    title={`${meta.description}\nRéférence : ${meta.specRef}`}
                  >
                    {name}
                  </span>
                ) : (
                  <span className="text-accent">{name}</span>
                )}
              </td>
              <td className="break-all py-1 text-ink/90">
                {typeof value === 'string' ? `"${value}"` : JSON.stringify(value)}
                {date && <span className="ml-2 text-muted">({date})</span>}
                {meta && (
                  <FieldExplanation
                    guide={meta}
                    location={
                      location === 'header' ? 'Paramètre JOSE du header' : 'Claim du payload'
                    }
                  />
                )}
                {name === 'cnf' &&
                  typeof value === 'object' &&
                  value !== null &&
                  Object.keys(value).map((key) => {
                    const nested = jwtFieldGuide(`cnf.${key}`, context)
                    return nested ? (
                      <FieldExplanation key={key} guide={nested} location={`payload.cnf.${key}`} />
                    ) : null
                  })}
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
