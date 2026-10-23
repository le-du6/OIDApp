/** Deliberately bounded teaching profile: ES256, cnf.jwk, top-level SD claims,
 * SHA-256, one trusted issuer and one DCQL query. Not a general OIDC/VC validator.
 */
import {
  bytesToBase64Url,
  computeDisclosureDigest,
  decodeDisclosure,
  exportPublicJwk,
  generateES256KeyPair,
  signES256,
  verifyCompactJwsES256,
} from './crypto'
import { decodeJwt } from './jwt'
export const DEMO_ISSUER = 'https://issuer.example'
export const DEMO_VERIFIER = 'x509_san_dns:verifier.example'
export const DEMO_VCT = 'https://credentials.example/identity_credential'
export const DEMO_TIME = 1767229200
export const MAX_PROOF_AGE = 300
export type Disclosure = { name: string; value: string; b64: string }
export type BindingDemo = {
  issuer: CryptoKeyPair
  holder: CryptoKeyPair
  issuerJwk: JsonWebKey
  holderJwk: JsonWebKey
  nonce: string
  vciNonce: string
  proof: string
  credential: string
  disclosures: Disclosure[]
  now: number
}
export type Check = { id: string; label: string; ok: boolean; detail: string }
export type Fault = 'none' | 'key' | 'audience' | 'nonce' | 'old' | 'disclosures'
const enc = (value: unknown) => bytesToBase64Url(new TextEncoder().encode(JSON.stringify(value)))
export async function signJwt(
  header: Record<string, unknown>,
  payload: Record<string, unknown>,
  key: CryptoKey,
): Promise<string> {
  const input = `${enc(header)}.${enc(payload)}`
  return `${input}.${bytesToBase64Url(await signES256(key, input))}`
}
function randomNonce() {
  return bytesToBase64Url(crypto.getRandomValues(new Uint8Array(16)))
}
export async function createBindingDemo(now = DEMO_TIME): Promise<BindingDemo> {
  const issuer = await generateES256KeyPair(),
    holder = await generateES256KeyPair()
  const issuerJwk = await exportPublicJwk(issuer.publicKey),
    holderJwk = await exportPublicJwk(holder.publicKey)
  const vciNonce = randomNonce(),
    nonce = randomNonce()
  const proof = await signJwt(
    { typ: 'openid4vci-proof+jwt', alg: 'ES256', jwk: holderJwk },
    { aud: DEMO_ISSUER, iat: now - 60, nonce: vciNonce },
    holder.privateKey,
  )
  // The issuing step checks the demonstrated proof, not just its presence.
  const decoded = decodeJwt(proof)
  if (
    !(await verifyCompactJwsES256(proof, holderJwk)) ||
    decoded.payload.aud !== DEMO_ISSUER ||
    decoded.payload.nonce !== vciNonce ||
    decoded.payload.iat !== now - 60
  )
    throw new Error('Preuve d’émission refusée')
  const disclosures: Disclosure[] = [
    ['given_name', 'Camille'],
    ['family_name', 'Martin'],
    ['birthdate', '1990-01-01'],
  ].map(([name, value]) => ({ name: name!, value: value!, b64: enc([randomNonce(), name, value]) }))
  const credential = await signJwt(
    { typ: 'dc+sd-jwt', alg: 'ES256' },
    {
      iss: DEMO_ISSUER,
      vct: DEMO_VCT,
      iat: now - 60,
      exp: now + 3600,
      _sd_alg: 'sha-256',
      _sd: await Promise.all(disclosures.map((d) => computeDisclosureDigest(d.b64))),
      cnf: { jwk: holderJwk },
    },
    issuer.privateKey,
  )
  return {
    issuer,
    holder,
    issuerJwk,
    holderJwk,
    vciNonce,
    nonce,
    proof,
    credential,
    disclosures,
    now,
  }
}
export async function buildPresentation(demo: BindingDemo, names: string[], fault: Fault = 'none') {
  const chosen = demo.disclosures.filter((d) => names.includes(d.name))
  const part = [demo.credential, ...chosen.map((d) => d.b64), ''].join('~')
  const claims = {
    aud: fault === 'audience' ? 'x509_san_dns:other.example' : DEMO_VERIFIER,
    nonce: fault === 'nonce' ? 'nonce-etranger' : demo.nonce,
    iat: fault === 'old' ? demo.now - MAX_PROOF_AGE - 1 : demo.now,
    sd_hash: await computeDisclosureDigest(part),
  }
  const key = fault === 'key' ? (await generateES256KeyPair()).privateKey : demo.holder.privateKey
  const kb = await signJwt({ alg: 'ES256', typ: 'kb+jwt' }, claims, key)
  // Remove one disclosure after the KB-JWT has been signed: its signature stays intact.
  const transmitted =
    fault === 'disclosures'
      ? [
          demo.credential,
          ...chosen.filter((d) => d.name !== 'birthdate').map((d) => d.b64),
          '',
        ].join('~')
      : part
  return { part: transmitted, kb, compact: transmitted + kb }
}
export async function validatePresentation(
  compact: string,
  expected: {
    issuerJwk: JsonWebKey
    issuer: string
    audience: string
    nonce: string
    now: number
    consumed: boolean
    requiredClaims: string[]
    vct: string
  },
): Promise<Check[]> {
  try {
    const segments = compact.split('~'),
      kb = segments.pop()!,
      credential = segments.shift()!
    if (!kb || !credential) throw new Error('Présentation incomplète')
    const part = [credential, ...segments, ''].join('~')
    const c = decodeJwt(credential),
      k = decodeJwt(kb)
    const payload = c.payload,
      claims = k.payload
    const cnf = payload.cnf as { jwk?: JsonWebKey } | undefined
    const disclosed = await Promise.all(
      segments.map(async (d) => ({
        decoded: decodeDisclosure(d),
        digest: await computeDisclosureDigest(d),
      })),
    )
    const names = disclosed.map((d) => d.decoded[1]),
      digests = payload._sd
    const shape = Array.isArray(digests) && digests.every((d) => typeof d === 'string')
    const unique =
      new Set(segments).size === segments.length && new Set(names).size === names.length
    const disclosuresOk =
      shape &&
      unique &&
      disclosed.every(
        (d) =>
          typeof d.decoded[0] === 'string' &&
          typeof d.decoded[1] === 'string' &&
          (digests as string[]).includes(d.digest) &&
          !Object.hasOwn(payload, d.decoded[1]),
      )
    return [
      {
        id: 'issuer',
        label: 'Credential : signature et émetteur',
        ok:
          c.header.typ === 'dc+sd-jwt' &&
          payload.iss === expected.issuer &&
          (await verifyCompactJwsES256(credential, expected.issuerJwk)),
        detail: 'Clé de l’Issuer explicitement approuvé dans ce laboratoire.',
      },
      {
        id: 'credential-time',
        label: 'Credential : temps et format',
        ok:
          payload._sd_alg === 'sha-256' &&
          payload.vct === expected.vct &&
          typeof payload.iat === 'number' &&
          payload.iat <= expected.now &&
          typeof payload.exp === 'number' &&
          expected.now < payload.exp &&
          (payload.nbf === undefined ||
            (typeof payload.nbf === 'number' && payload.nbf <= expected.now)),
        detail: 'Profil de démonstration : ES256, SHA-256 et horloge déclarée.',
      },
      {
        id: 'disclosures',
        label: 'Disclosures : digests et noms',
        ok: disclosuresOk,
        detail:
          'Chaque valeur divulguée doit correspondre à un digest signé ; doublons et collisions sont refusés.',
      },
      {
        id: 'holder',
        label: 'KB-JWT : signature avec cnf.jwk',
        ok: k.header.typ === 'kb+jwt' && !!cnf?.jwk && (await verifyCompactJwsES256(kb, cnf.jwk)),
        detail: 'La clé provient du credential validé, jamais du KB-JWT reçu.',
      },
      {
        id: 'audience',
        label: 'Audience : ce Verifier',
        ok: claims.aud === expected.audience,
        detail: 'client_id attendu dans ce parcours, fixé avant de lire la preuve.',
      },
      {
        id: 'nonce',
        label: 'Nonce : cette demande',
        ok: claims.nonce === expected.nonce,
        detail: 'Comparaison au défi de présentation conservé par le Verifier.',
      },
      {
        id: 'freshness',
        label: 'Fraîcheur du KB-JWT',
        ok:
          typeof claims.iat === 'number' &&
          claims.iat <= expected.now &&
          expected.now - claims.iat <= MAX_PROOF_AGE,
        detail:
          'Fenêtre pédagogique choisie : 300 secondes, sans tolérance ; ce n’est pas une constante normative.',
      },
      {
        id: 'sd-hash',
        label: 'sd_hash : cette sélection exacte',
        ok: claims.sd_hash === (await computeDisclosureDigest(part)),
        detail:
          'Le tilde final est inclus. Une signature intacte peut accompagner un hash divergent.',
      },
      {
        id: 'query',
        label: 'Demande : claims requis présents',
        ok: expected.requiredClaims.every((name) => names.includes(name)),
        detail:
          'Sous-ensemble DCQL illustré : type attendu et présence de given_name. Pas un moteur DCQL général.',
      },
      {
        id: 'transaction',
        label: 'Transaction encore ouverte',
        ok: !expected.consumed,
        detail:
          'Politique de ce laboratoire : une acceptation ferme la transaction. Vérifier une signature ne consomme rien.',
      },
    ]
  } catch {
    return [
      {
        id: 'serialization',
        label: 'Structure de la présentation',
        ok: false,
        detail: 'Présentation illisible ou non prise en charge par le profil de démonstration.',
      },
    ]
  }
}
