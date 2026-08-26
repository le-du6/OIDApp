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
