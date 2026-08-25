/**
 * Décodage de JWT côté client — volontairement écrit à la main (pas de lib) :
 * montrer qu'un JWT se LIT sans aucune clé est un point pédagogique central.
 * (La VÉRIFICATION de signature, elle, exige la clé publique — Crypto Lab.)
 */

export type DecodedJwt = {
  header: Record<string, unknown>
  payload: Record<string, unknown>
  /** Signature brute, base64url (non décodée : c'est un blob binaire). */
  signature: string
  /** Les trois segments bruts, pour l'affichage coloré. */
  raw: { header: string; payload: string; signature: string }
}

export class JwtDecodeError extends Error {}

/** Décode un segment base64url en texte UTF-8. */
export function base64UrlDecode(segment: string): string {
  if (!/^[A-Za-z0-9_-]*$/.test(segment)) {
    throw new JwtDecodeError('Segment non base64url (caractères invalides)')
  }
  const base64 = segment.replaceAll('-', '+').replaceAll('_', '/')
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4)
  let binary: string
  try {
    binary = atob(padded)
  } catch {
    throw new JwtDecodeError('Segment base64url invalide')
  }
  const bytes = Uint8Array.from(binary, (c) => c.codePointAt(0) ?? 0)
  return new TextDecoder().decode(bytes)
}

export function decodeJwt(token: string): DecodedJwt {
  const parts = token.trim().split('.')
  if (parts.length !== 3) {
    throw new JwtDecodeError(
      `Un JWT (JWS compact) a exactement 3 segments séparés par « . » — ici : ${parts.length}`,
    )
  }
  const [rawHeader, rawPayload, rawSignature] = parts as [string, string, string]
  const parseJson = (raw: string, name: string): Record<string, unknown> => {
    let parsed: unknown
    try {
      parsed = JSON.parse(base64UrlDecode(raw))
    } catch (e) {
      if (e instanceof JwtDecodeError) throw e
      throw new JwtDecodeError(`${name} : JSON invalide`)
    }
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      throw new JwtDecodeError(`${name} : doit être un objet JSON`)
    }
    return parsed as Record<string, unknown>
  }
  return {
    header: parseJson(rawHeader, 'Header'),
    payload: parseJson(rawPayload, 'Payload'),
    signature: rawSignature,
    raw: { header: rawHeader, payload: rawPayload, signature: rawSignature },
  }
}

/** Annotations FR des claims standard (registre IANA + RFC 7519 / RFC 9068). */
export const claimDescriptions: Record<string, { description: string; specRef: string }> = {
  iss: { description: 'Issuer — qui a émis le token', specRef: 'RFC 7519 §4.1.1' },
  sub: { description: 'Subject — de qui parle le token', specRef: 'RFC 7519 §4.1.2' },
  aud: { description: 'Audience — à qui le token est destiné', specRef: 'RFC 7519 §4.1.3' },
  exp: { description: 'Expiration (epoch seconds)', specRef: 'RFC 7519 §4.1.4' },
  nbf: { description: 'Not before — invalide avant cet instant', specRef: 'RFC 7519 §4.1.5' },
  iat: { description: 'Issued at — instant d’émission', specRef: 'RFC 7519 §4.1.6' },
  jti: { description: 'JWT ID — identifiant unique (anti-rejeu)', specRef: 'RFC 7519 §4.1.7' },
  scope: { description: 'Périmètre d’accès accordé', specRef: 'RFC 8693 §4.2' },
  client_id: { description: 'Client pour lequel le token a été émis', specRef: 'RFC 9068 §2.2' },
  alg: { description: 'Algorithme de signature', specRef: 'RFC 7515 §4.1.1' },
  typ: { description: 'Type de token (at+jwt = access token JWT)', specRef: 'RFC 9068 §2.1' },
  kid: { description: 'Key ID — quelle clé a signé (lookup JWKS)', specRef: 'RFC 7515 §4.1.4' },
}

/** Formate un claim epoch-seconds en date lisible, sinon retourne null. */
export function formatEpochClaim(name: string, value: unknown): string | null {
  if (!['exp', 'iat', 'nbf', 'auth_time'].includes(name)) return null
  if (typeof value !== 'number') return null
  return new Date(value * 1000).toISOString()
}
