import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vite-plus/test'
import { parseScenario } from './scenario'
import { VCI_JWT_PROOF, VCI_SD_JWT_COMPACT } from '../data/fixtures/oid4vci'
import { VP_PRESENTATION } from '../data/fixtures/oid4vp'
import { requestTarget } from '../lib/http-view'
const root = join(__dirname, '../../public/scenarios')
const scenario = (id: string) =>
  parseScenario(JSON.parse(readFileSync(join(root, `${id}.json`), 'utf8')))
const all = readdirSync(root).flatMap((m) =>
  readdirSync(join(root, m))
    .filter((f) => f.endsWith('.json'))
    .map((f) => scenario(`${m}/${f.slice(0, -5)}`)),
)
describe('Cohérence des échanges affichés', () => {
  it('le navigateur livre le code au RP avant le POST de celui-ci au token endpoint', () => {
    const steps = scenario('oidc/authorization-code').steps
    const callback = steps.findIndex((s) => s.id === 'browser-callback'),
      token = steps.findIndex((s) => s.id === 'token-request')
    expect(steps[callback]?.from).toBe('browser')
    expect(steps[callback]?.to).toBe('rp')
    expect(callback).toBeLessThan(token)
    const location = steps.find((s) => s.id === 'code-redirect')!.request!.response!.headers!
      .Location!
    expect(new URL(requestTarget(steps[callback]!.request!.request)).searchParams.get('code')).toBe(
      new URL(location).searchParams.get('code'),
    )
  })
  it('les code grants non authentifiés identifient le client', () => {
    for (const id of ['oauth2/dpop', 'oid4vci/authorization-code']) {
      const exchange = scenario(id).steps.find((s) =>
        s.request?.request.url.endsWith('/token'),
      )!.request!
      expect(exchange.request.headers?.Authorization).toBeUndefined()
      expect(new URLSearchParams(exchange.request.body!.content).get('client_id')).toBeTruthy()
    }
  })
  it('les paramètres form expliqués correspondent au corps sérialisé', () => {
    for (const s of all)
      for (const step of s.steps) {
        const body = step.request?.request.body
        if (body?.type === 'form' && body.params) {
          const values = new URLSearchParams(body.content)
          for (const p of body.params)
            expect(values.get(p.name), `${s.id}/${step.id}/${p.name}`).toBe(p.value)
        }
      }
  })
  it('les liens d’invocation ne sont pas déclarés comme des GET HTTP', () => {
    for (const s of all)
      for (const step of s.steps) {
        const r = step.request?.request
        if (r?.url.startsWith('openid')) expect(r.method, `${s.id}/${step.id}`).toBe('INVOKE')
      }
  })
  it('les credentials et preuves des échanges VCI sont les fixtures inspectables', () => {
    for (const s of all.filter((s) => s.id.startsWith('oid4vci/')))
      for (const step of s.steps) {
        const e = step.request
        if (e?.request.url === 'https://issuer.example/credential') {
          if (e.request.body)
            expect(JSON.parse(e.request.body.content).proofs.jwt).toEqual([VCI_JWT_PROOF])
          if (e.response?.body)
            expect(JSON.parse(e.response.body.content).credentials[0].credential).toBe(
              VCI_SD_JWT_COMPACT,
            )
        }
      }
  })
  it('la présentation transmise correspond à celle de la chaîne commune', () => {
    const body = scenario('oid4vp/presentation-flow').steps.find((s) => s.id === 'direct-post')!
      .request!.request.body!
    expect(JSON.parse(new URLSearchParams(body.content).get('vp_token')!).identite).toEqual([
      VP_PRESENTATION,
    ])
  })
  it('les vues décodées de Request Object ne prétendent pas être le corps réseau', () => {
    const e = scenario('oid4vp/presentation-flow').steps.find(
      (s) => s.id === 'fetch-request',
    )!.request!
    expect(e.response!.body!.representation).toBe('decoded')
    const view = JSON.parse(e.response!.body!.content)
    expect(view.header.typ).toBe('oauth-authz-req+jwt')
    expect(view.payload.aud).toBe('https://self-issued.me/v2')
  })
})
