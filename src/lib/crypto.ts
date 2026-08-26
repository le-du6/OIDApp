/**
 * Utilitaires du Crypto Lab — WebCrypto natif UNIQUEMENT (argument
 * pédagogique : tout ce que font ces protocoles est disponible dans le
 * navigateur, sans lib tierce). Toutes les clés sont jetables, générées
 * localement, non exportées hors du navigateur.
 */

export function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = ''
  for (const b of bytes) binary += String.fromCharCode(b)
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '')
}

export function base64UrlToBytes(b64u: string): Uint8Array {
  const b64 = b64u.replaceAll('-', '+').replaceAll('_', '/')
  const padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4)
  return Uint8Array.from(atob(padded), (c) => c.codePointAt(0) ?? 0)
}

export function bytesToHex(bytes: Uint8Array): string {
  return [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('')
}

export async function sha256(data: string | Uint8Array): Promise<Uint8Array> {
  const bytes = typeof data === 'string' ? new TextEncoder().encode(data) : data
  const digest = await crypto.subtle.digest('SHA-256', bytes as BufferSource)
  return new Uint8Array(digest)
}

export async function sha256Hex(data: string): Promise<string> {
  return bytesToHex(await sha256(data))
}

/* ---------------------------------------------------------------- PKCE */

/** Alphabet « unreserved » de la RFC 3986, imposé par RFC 7636 §4.1. */
const VERIFIER_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~'

/** Génère un code_verifier aléatoire (43–128 caractères, RFC 7636 §4.1). */
export function generateCodeVerifier(length = 64): string {
  if (length < 43 || length > 128) {
    throw new RangeError('RFC 7636 §4.1 : le code_verifier fait entre 43 et 128 caractères')
  }
  const random = crypto.getRandomValues(new Uint8Array(length))
  return [...random].map((b) => VERIFIER_ALPHABET[b % VERIFIER_ALPHABET.length]).join('')
}

/** code_challenge = BASE64URL(SHA-256(code_verifier)) — méthode S256 (RFC 7636 §4.2). */
export async function computeCodeChallenge(verifier: string): Promise<string> {
  return bytesToBase64Url(await sha256(verifier))
}

/* ------------------------------------------------------------- ES256 */

export async function generateES256KeyPair(): Promise<CryptoKeyPair> {
  return crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, true, ['sign', 'verify'])
}

export async function signES256(privateKey: CryptoKey, message: string): Promise<Uint8Array> {
  const sig = await crypto.subtle.sign(
    { name: 'ECDSA', hash: 'SHA-256' },
    privateKey,
    new TextEncoder().encode(message),
  )
  return new Uint8Array(sig)
}

export async function verifyES256(
  publicKey: CryptoKey,
  signature: Uint8Array,
  message: string,
): Promise<boolean> {
  return crypto.subtle.verify(
    { name: 'ECDSA', hash: 'SHA-256' },
    publicKey,
    signature as BufferSource,
    new TextEncoder().encode(message),
  )
}

export async function exportPublicJwk(key: CryptoKey): Promise<JsonWebKey> {
  return crypto.subtle.exportKey('jwk', key)
}

/* ------------------------------------------------- OIDC : at_hash & JWS */

/**
 * at_hash / c_hash (OIDC Core §3.1.3.6, §3.3.2.11) : base64url de la moitié
 * GAUCHE du hachage (SHA-256 pour ES256/RS256) de la représentation ASCII
 * de la valeur (access token ou code).
 */
export async function computeAtHash(value: string): Promise<string> {
  const digest = await sha256(value)
  return bytesToBase64Url(digest.slice(0, digest.length / 2))
}

/** Importe une clé publique EC P-256 depuis un JWK (RFC 7517) pour vérifier. */
export async function importEs256PublicJwk(jwk: JsonWebKey): Promise<CryptoKey> {
  return crypto.subtle.importKey('jwk', jwk, { name: 'ECDSA', namedCurve: 'P-256' }, false, [
    'verify',
  ])
}

/**
 * Vérifie la signature d'un JWS compact ES256 (donc d'un JWT signé).
 * Point pédagogique : la signature JWS ES256 est le concaténé brut r||s
 * (64 octets, RFC 7518 §3.4) — exactement le format attendu par WebCrypto.
 * On vérifie sur les octets ASCII de « header.payload », tels quels.
 */
export async function verifyCompactJwsES256(jws: string, jwk: JsonWebKey): Promise<boolean> {
  const parts = jws.split('.')
  if (parts.length !== 3) return false
  const [header, payload, signature] = parts as [string, string, string]
  const key = await importEs256PublicJwk(jwk)
  return verifyES256(key, base64UrlToBytes(signature), `${header}.${payload}`)
}

/* ------------------------------------------------- SD-JWT : disclosures */

/**
 * Digest d'une disclosure SD-JWT : base64url(SHA-256(ascii(disclosure))).
 * ATTENTION, différent d'at_hash : ici c'est le hachage COMPLET (32 octets),
 * pas la moitié gauche. C'est ce digest qui figure dans le tableau _sd du
 * SD-JWT — la disclosure elle-même (salt, nom, valeur) reste hors du jeton.
 */
export async function computeDisclosureDigest(disclosureB64u: string): Promise<string> {
  return bytesToBase64Url(await sha256(disclosureB64u))
}

/** Décode une disclosure base64url → [salt, nom, valeur]. */
export function decodeDisclosure(disclosureB64u: string): [string, string, unknown] {
  const json = new TextDecoder().decode(base64UrlToBytes(disclosureB64u))
  const parsed: unknown = JSON.parse(json)
  if (!Array.isArray(parsed) || parsed.length !== 3) {
    throw new Error('Disclosure invalide : attendu [salt, nom, valeur]')
  }
  return parsed as [string, string, unknown]
}
