/**
 * Génère les fixtures OID4VP (dev uniquement, jose) → src/data/fixtures/oid4vp.ts
 *
 *   node scripts/gen-oid4vp-fixtures.mjs
 *
 * Trio cohérent et autonome (indépendant des fixtures OID4VCI, dont les
 * clés privées ne sont pas conservées) :
 * - credential SD-JWT VC signé par l'Issuer, 3 claims divulgables, cnf.jwk ;
 * - PRÉSENTATION partielle : given_name + birthdate révélés, family_name
 *   RETENU — c'est la divulgation sélective en acte ;
 * - Key Binding JWT (typ kb+jwt) signé par la clé du wallet : aud = client_id
 *   du Verifier (préfixe x509_san_dns:), nonce du Verifier, sd_hash EXACT
 *   (hachage de « <jwt>~<disclosures choisies>~ », tilde final inclus).
 *
 * Réfs : OID4VP 1.0 (Final, 9 juil. 2025) ; draft-ietf-oauth-selective-
 * disclosure-jwt (KB-JWT §Key Binding). Salts/timestamps fixes pour les tests.
 */
import { createHash } from 'node:crypto'
import { writeFileSync } from 'node:fs'
import { exportJWK, generateKeyPair, SignJWT } from 'jose'

const IAT = 1767225600 // 2026-01-01T00:00:00Z
const VERIFIER_CLIENT_ID = 'x509_san_dns:verifier.example'
const VP_NONCE = 'vpn-4Kd82mQxaz'
const VCT = 'https://credentials.example/identity_credential'

const b64u = (buf) => Buffer.from(buf).toString('base64url')
const sha256b64u = (ascii) => b64u(createHash('sha256').update(ascii, 'ascii').digest())

// --- Clés -----------------------------------------------------------------
const issuer = await generateKeyPair('ES256')
const wallet = await generateKeyPair('ES256')
const issuerKid = 'vp-issuer-2026-01'
const issuerJwk = {
  ...(await exportJWK(issuer.publicKey)),
  kid: issuerKid,
  alg: 'ES256',
  use: 'sig',
}
const walletJwk = await exportJWK(wallet.publicKey)

// --- Credential : 3 disclosures, salts fixes ------------------------------
const claims = [
  ['salt-gn-Vp81KzTe', 'given_name', 'Camille', true], // révélé
  ['salt-fn-Wq44RbNu', 'family_name', 'Martin', false], // RETENU
  ['salt-bd-Xc09LmPy', 'birthdate', '1990-01-01', true], // révélé
]
const disclosures = claims.map(([salt, name, value, revealed]) => {
  const b64 = b64u(JSON.stringify([salt, name, value]))
  return { salt, name, value, revealed, b64, digest: sha256b64u(b64) }
})

const sdJwt = await new SignJWT({
  vct: VCT,
  _sd: disclosures.map((d) => d.digest),
  _sd_alg: 'sha-256',
  cnf: { jwk: walletJwk },
})
  .setProtectedHeader({ alg: 'ES256', typ: 'dc+sd-jwt', kid: issuerKid })
  .setIssuer('https://issuer.example')
  .setIssuedAt(IAT)
  .setExpirationTime(IAT + 86400 * 365)
  .sign(issuer.privateKey)

// --- Présentation partielle + KB-JWT --------------------------------------
const revealed = disclosures.filter((d) => d.revealed)
const presentationPart = [sdJwt, ...revealed.map((d) => d.b64), ''].join('~') // finit par ~
const sdHash = sha256b64u(presentationPart)

const kbJwt = await new SignJWT({ nonce: VP_NONCE, sd_hash: sdHash })
  .setProtectedHeader({ alg: 'ES256', typ: 'kb+jwt' })
  .setAudience(VERIFIER_CLIENT_ID)
  .setIssuedAt(IAT + 3600) // présenté plus tard que l'émission
  .sign(wallet.privateKey)

const presentation = presentationPart + kbJwt

// --- Écriture -------------------------------------------------------------
const ts = `/**
 * Fixtures OID4VP — GÉNÉRÉES par scripts/gen-oid4vp-fixtures.mjs (jose, dev
 * uniquement). Ne pas éditer : régénérer. Clés jetables, données fictives,
 * salts/timestamps fixes pour les tests.
 */

/** client_id du Verifier — préfixe x509_san_dns (OID4VP 1.0 §5.9.3). */
export const VP_VERIFIER_CLIENT_ID = ${JSON.stringify(VERIFIER_CLIENT_ID)}

/** nonce de l'Authorization Request du Verifier (anti-rejeu). */
export const VP_NONCE = ${JSON.stringify(VP_NONCE)}

/** JWKS public de l'Issuer du credential présenté. */
export const VP_ISSUER_JWKS = { keys: [${JSON.stringify(issuerJwk)}] } as const

/** Clé publique du wallet (celle du cnf du credential — vérifie le KB-JWT). */
export const VP_WALLET_JWK = ${JSON.stringify(walletJwk)} as const

/** Les 3 disclosures du credential ; revealed = choix de CETTE présentation. */
export const VP_DISCLOSURES = ${JSON.stringify(disclosures, null, 2)} as const

/** Partie JWT (signée par l'Issuer) du credential SD-JWT VC. */
export const VP_SD_JWT = ${JSON.stringify(sdJwt)}

/** Partie « credential + disclosures CHOISIES » de la présentation (finit par ~). */
export const VP_PRESENTATION_PART = ${JSON.stringify(presentationPart)}

/** sd_hash attendu = base64url(SHA-256(VP_PRESENTATION_PART)). */
export const VP_SD_HASH = ${JSON.stringify(sdHash)}

/** Key Binding JWT (typ kb+jwt) — signé par la clé du wallet. */
export const VP_KB_JWT = ${JSON.stringify(kbJwt)}

/** Présentation complète : <jwt>~<disclosures choisies>~<kb-jwt>. */
export const VP_PRESENTATION = ${JSON.stringify(presentation)}
`
writeFileSync(new URL('../src/data/fixtures/oid4vp.ts', import.meta.url), ts)
console.log('OK — sd_hash =', sdHash)
console.log('kb-jwt =', kbJwt)
console.log('sd-jwt =', sdJwt.slice(0, 100) + '…')
