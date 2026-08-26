/**
 * Génère les fixtures OID4VCI (dev uniquement, jose) → src/data/fixtures/oid4vci.ts
 *
 *   node scripts/gen-oid4vci-fixtures.mjs
 *
 * Produit :
 * - paire de clés ES256 de l'Issuer (kid vci-issuer-2026-01) + JWKS public ;
 * - paire de clés ES256 du Wallet (la clé attestée par le credential) ;
 * - un SD-JWT VC signé (typ dc+sd-jwt, vct, _sd/_sd_alg, cnf.jwk = clé wallet)
 *   au format compact <jwt>~<disclosure>~…~ avec de VRAIS hachages salés :
 *   disclosure = base64url(JSON [salt, nom, valeur]),
 *   digest = base64url(SHA-256(ascii(disclosure))) ∈ _sd ;
 * - un jwt proof (typ openid4vci-proof+jwt) signé par le Wallet sur c_nonce.
 *
 * Réfs : OID4VCI 1.0 (Final) App. A.3/F.1 ; draft-ietf-oauth-sd-jwt-vc ;
 * draft-ietf-oauth-selective-disclosure-jwt. Salts et timestamps FIXES pour
 * des tests déterministes — en production les salts sont aléatoires (CSPRNG).
 */
import { createHash } from 'node:crypto'
import { writeFileSync } from 'node:fs'
import { exportJWK, generateKeyPair, SignJWT } from 'jose'

const IAT = 1767225600 // 2026-01-01T00:00:00Z
const C_NONCE = 'cn-7f3b9d24aa' // c_nonce émis par le Nonce Endpoint (OID4VCI §7)
const ISSUER = 'https://issuer.example'
const VCT = 'https://credentials.example/identity_credential'

const b64u = (buf) => Buffer.from(buf).toString('base64url')
const sha256b64u = (ascii) => b64u(createHash('sha256').update(ascii, 'ascii').digest())

// --- Clés -----------------------------------------------------------------
const issuer = await generateKeyPair('ES256')
const wallet = await generateKeyPair('ES256')
const issuerKid = 'vci-issuer-2026-01'
const issuerJwk = {
  ...(await exportJWK(issuer.publicKey)),
  kid: issuerKid,
  alg: 'ES256',
  use: 'sig',
}
const walletJwk = await exportJWK(wallet.publicKey)

// --- Disclosures (salts FIXES pour la stabilité des tests) ----------------
const claims = [
  ['salt-gn-8Kk1VbXq', 'given_name', 'Camille'],
  ['salt-fn-P3zR7wYd', 'family_name', 'Martin'],
  ['salt-bd-Ta9GmQ2c', 'birthdate', '1990-01-01'],
]
const disclosures = claims.map(([salt, name, value]) => {
  const b64 = b64u(JSON.stringify([salt, name, value]))
  return { salt, name, value, b64, digest: sha256b64u(b64) }
})

// --- SD-JWT VC (partie JWT signée par l'Issuer) ---------------------------
const sdJwt = await new SignJWT({
  vct: VCT,
  _sd: disclosures.map((d) => d.digest),
  _sd_alg: 'sha-256',
  cnf: { jwk: walletJwk },
})
  .setProtectedHeader({ alg: 'ES256', typ: 'dc+sd-jwt', kid: issuerKid })
  .setIssuer(ISSUER)
  .setIssuedAt(IAT)
  .setExpirationTime(IAT + 86400 * 365)
  .sign(issuer.privateKey)

const compact = [sdJwt, ...disclosures.map((d) => d.b64), ''].join('~')

// --- jwt proof (signé par le Wallet, lie la clé au flow via c_nonce) ------
const jwtProof = await new SignJWT({ nonce: C_NONCE })
  .setProtectedHeader({ alg: 'ES256', typ: 'openid4vci-proof+jwt', jwk: walletJwk })
  .setAudience(ISSUER)
  .setIssuedAt(IAT)
  .sign(wallet.privateKey)

// --- Écriture -------------------------------------------------------------
const ts = `/**
 * Fixtures OID4VCI — GÉNÉRÉES par scripts/gen-oid4vci-fixtures.mjs (jose,
 * dev uniquement). Ne pas éditer : régénérer. Clés jetables, données fictives,
 * salts/timestamps fixes pour les tests (en prod : salts CSPRNG).
 */

/** Identifiant de l'Issuer (credential_issuer). */
export const VCI_ISSUER = ${JSON.stringify(ISSUER)}

/** vct du credential (SD-JWT VC — REQUIRED). */
export const VCI_VCT = ${JSON.stringify(VCT)}

/** c_nonce émis par le Nonce Endpoint (OID4VCI 1.0 §7). */
export const VCI_C_NONCE = ${JSON.stringify(C_NONCE)}

/** JWKS public de l'Issuer — vérifie la signature du SD-JWT VC. */
export const VCI_ISSUER_JWKS = { keys: [${JSON.stringify(issuerJwk)}] } as const

/** Clé publique du Wallet — celle que le credential lie via cnf.jwk. */
export const WALLET_PUBLIC_JWK = ${JSON.stringify(walletJwk)} as const

/** Les disclosures : [salt, nom, valeur] → base64url, et leur digest SHA-256. */
export const VCI_DISCLOSURES = ${JSON.stringify(disclosures, null, 2)} as const

/** Partie JWT (signée) du SD-JWT VC — typ dc+sd-jwt, _sd, cnf. */
export const VCI_SD_JWT = ${JSON.stringify(sdJwt)}

/** SD-JWT VC complet, format compact : <jwt>~<disclosure>~…~ */
export const VCI_SD_JWT_COMPACT = ${JSON.stringify(compact)}

/** jwt proof du Wallet — typ openid4vci-proof+jwt, nonce = c_nonce. */
export const VCI_JWT_PROOF = ${JSON.stringify(jwtProof)}
`
writeFileSync(new URL('../src/data/fixtures/oid4vci.ts', import.meta.url), ts)
console.log('OK')
console.log('sd-jwt =', sdJwt.slice(0, 80) + '…')
console.log('digests =', disclosures.map((d) => d.digest).join(' '))
console.log('proof =', jwtProof.slice(0, 80) + '…')
