import { beforeAll, describe, expect, it } from 'vite-plus/test'
import {
  createBindingDemo,
  buildPresentation,
  validatePresentation,
  signJwt,
  DEMO_ISSUER,
  DEMO_VERIFIER,
  DEMO_VCT,
  type BindingDemo,
  type Fault,
} from './binding-demo'
import { VCI_SD_JWT, WALLET_PUBLIC_JWK, VCI_JWT_PROOF } from '../data/fixtures/oid4vci'
import {
  VP_SD_JWT,
  VP_WALLET_JWK,
  VP_PRESENTATION,
  VP_ISSUER_JWKS,
  VP_NONCE,
  VP_DEMO_NOW,
} from '../data/fixtures/oid4vp'
import { decodeJwt } from './jwt'
import { verifyCompactJwsES256 } from './crypto'
let demo: BindingDemo
beforeAll(async () => {
  demo = await createBindingDemo()
})
const context = () => ({
  issuerJwk: demo.issuerJwk,
  issuer: DEMO_ISSUER,
  audience: DEMO_VERIFIER,
  nonce: demo.nonce,
  now: demo.now,
  consumed: false,
  requiredClaims: ['given_name'],
  vct: DEMO_VCT,
})
describe('Chaîne réelle émission → présentation du profil pédagogique', () => {
  it('accepte une chaîne complète avec deux disclosures', async () => {
    const p = await buildPresentation(demo, ['given_name', 'birthdate'])
    const checks = await validatePresentation(p.compact, context())
    expect(checks.filter((c) => !c.ok)).toEqual([])
  })
  it.each<[Fault, string]>([
    ['key', 'holder'],
    ['audience', 'audience'],
    ['nonce', 'nonce'],
    ['old', 'freshness'],
    ['disclosures', 'sd-hash'],
  ])('isole le rejet %s sans confondre signature et contexte', async (fault, id) => {
    const p = await buildPresentation(demo, ['given_name', 'birthdate'], fault)
    const checks = await validatePresentation(p.compact, context())
    expect(checks.filter((c) => !c.ok).map((c) => c.id)).toEqual([id])
  })
  it('refuse une seconde utilisation malgré une preuve mathématiquement valide', async () => {
    const p = await buildPresentation(demo, ['given_name'])
    const first = await validatePresentation(p.compact, context())
    expect(first.every((c) => c.ok)).toBe(true)
    const second = await validatePresentation(p.compact, { ...context(), consumed: true })
    expect(second.filter((c) => !c.ok).map((c) => c.id)).toEqual(['transaction'])
  })
  it('refuse une présentation authentique qui ne fournit pas le claim demandé', async () => {
    const p = await buildPresentation(demo, ['birthdate'])
    expect(
      (await validatePresentation(p.compact, context())).filter((c) => !c.ok).map((c) => c.id),
    ).toEqual(['query'])
  })
  it('refuse les digests incohérents même si le wallet signe le nouveau sd_hash', async () => {
    const changed = {
      ...demo,
      disclosures: demo.disclosures.map((d) => ({
        ...d,
        b64: Buffer.from(JSON.stringify(['new-salt', d.name, 'Mallory'])).toString('base64url'),
      })),
    }
    const p = await buildPresentation(changed, ['given_name'])
    expect(
      (await validatePresentation(p.compact, context())).filter((c) => !c.ok).map((c) => c.id),
    ).toEqual(['disclosures'])
  })
  it('ne traite pas un JWT portant alg=none comme une signature ES256 acceptable', async () => {
    const jwt = await signJwt({ alg: 'none' }, { sub: 'Camille' }, demo.issuer.privateKey)
    expect(await verifyCompactJwsES256(jwt, demo.issuerJwk)).toBe(false)
  })
  it('garde le credential et la clé strictement identiques dans les fixtures des deux modules', async () => {
    expect(VP_SD_JWT).toBe(VCI_SD_JWT)
    expect(VP_WALLET_JWK).toEqual(WALLET_PUBLIC_JWK)
    expect(decodeJwt(VCI_JWT_PROOF).header.jwk).toEqual(WALLET_PUBLIC_JWK)
    expect(
      (
        await validatePresentation(VP_PRESENTATION, {
          ...context(),
          issuerJwk: VP_ISSUER_JWKS.keys[0],
          nonce: VP_NONCE,
          now: VP_DEMO_NOW,
        })
      ).filter((c) => !c.ok),
    ).toEqual([])
  })
  it('rejette une présentation illisible sans exception non gérée', async () => {
    expect((await validatePresentation('broken~stuff', context())).every((c) => c.ok)).toBe(false)
  })
})
