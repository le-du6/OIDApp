/**
 * Génère les fixtures OIDC (dev uniquement, jose) → src/data/fixtures/oidc.ts
 *
 *   node scripts/gen-oidc-fixtures.mjs
 *
 * Produit : paire de clés ES256 de l'OP, JWKS public, ID Token signé
 * conforme à OIDC Core 1.0 §2 (iss/sub/aud/exp/iat/auth_time/nonce/at_hash),
 * access token opaque (celui de l'exemple de la spec, §3.1.3.3).
 * at_hash : moitié gauche de SHA-256(ASCII(access_token)), base64url
 * (OIDC Core §3.1.3.6). Timestamps FIXES pour des tests déterministes.
 */
import { createHash } from 'node:crypto'
import { writeFileSync } from 'node:fs'
import { exportJWK, generateKeyPair, SignJWT } from 'jose'

const IAT = 1767225600 // 2026-01-01T00:00:00Z — fixe (stabilité des tests)
const ACCESS_TOKEN = 'SlAV32hkKG' // valeur de l'exemple OIDC Core §3.1.3.3
const NONCE = 'n-0S6_WzA2Mj' // valeur de l'exemple OIDC Core §3.1.3.1

// at_hash = base64url(moitié gauche de SHA-256(ascii(access_token))) — §3.1.3.6
const digest = createHash('sha256').update(ACCESS_TOKEN, 'ascii').digest()
const atHash = digest.subarray(0, digest.length / 2).toString('base64url')

const { privateKey, publicKey } = await generateKeyPair('ES256')
const kid = 'op-2026-01'

const idToken = await new SignJWT({
  auth_time: IAT - 20,
  nonce: NONCE,
  at_hash: atHash,
  email: 'user@mail.example',
  email_verified: true,
})
  .setProtectedHeader({ alg: 'ES256', typ: 'JWT', kid })
  .setIssuer('https://op.example')
  .setSubject('user-8b2c91')
  .setAudience('web-app')
  .setIssuedAt(IAT)
  .setExpirationTime(IAT + 3600)
  .sign(privateKey)

const jwk = { ...(await exportJWK(publicKey)), kid, alg: 'ES256', use: 'sig' }

const ts = `/**
 * Fixtures OIDC — GÉNÉRÉES par scripts/gen-oidc-fixtures.mjs (jose, dev
 * uniquement). Ne pas éditer à la main : régénérer. Clés jetables, aucune
 * donnée réelle. Timestamps fixes (2026-01-01T00:00:00Z) pour les tests.
 */

/** Access token opaque émis par l'OP (valeur de l'exemple OIDC Core §3.1.3.3). */
export const OIDC_ACCESS_TOKEN = ${JSON.stringify(ACCESS_TOKEN)}

/** nonce généré par le RP au début du flow (exemple OIDC Core §3.1.3.1). */
export const OIDC_NONCE = ${JSON.stringify(NONCE)}

/** at_hash attendu : base64url(moitié gauche de SHA-256(access_token)) — §3.1.3.6. */
export const OIDC_AT_HASH = ${JSON.stringify(atHash)}

/** ID Token signé ES256 par l'OP (kid ${kid}) — claims OIDC Core §2. */
export const OIDC_ID_TOKEN =
  ${JSON.stringify(idToken)}

/** JWKS publié par l'OP sur jwks_uri (RFC 7517) — la clé qui vérifie l'ID Token. */
export const OIDC_JWKS = {
  keys: [${JSON.stringify(jwk)}],
} as const
`

writeFileSync(new URL('../src/data/fixtures/oidc.ts', import.meta.url), ts)
console.log('OK — at_hash =', atHash)
console.log('id_token =', idToken)
console.log('jwk =', JSON.stringify(jwk))
