import { describe, expect, it } from 'vitest'
import {
  base64UrlToBytes,
  bytesToBase64Url,
  bytesToHex,
  computeCodeChallenge,
  generateCodeVerifier,
  sha256Hex,
} from './crypto'

describe('base64url', () => {
  it('encode sans padding avec - et _', () => {
    // 0xfb 0xef 0xff → base64 "++//" → base64url "--__"
    expect(bytesToBase64Url(new Uint8Array([0xfb, 0xef, 0xff]))).toBe('--__')
  })

  it('aller-retour identité', () => {
    const bytes = new Uint8Array([0, 1, 2, 250, 251, 252, 253, 254, 255])
    expect([...base64UrlToBytes(bytesToBase64Url(bytes))]).toEqual([...bytes])
  })
})

describe('sha256', () => {
  it('vecteur connu (chaîne vide)', async () => {
    expect(await sha256Hex('')).toBe(
      'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    )
  })
})

describe('PKCE (RFC 7636)', () => {
  it('vecteur officiel de l’appendice B', async () => {
    // RFC 7636 Appendix B : verifier → challenge S256
    const challenge = await computeCodeChallenge('dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk')
    expect(challenge).toBe('E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM')
  })

  it('génère un verifier de la bonne longueur et du bon alphabet', () => {
    const v = generateCodeVerifier(43)
    expect(v).toHaveLength(43)
    expect(v).toMatch(/^[A-Za-z0-9\-._~]+$/)
  })

  it('refuse les longueurs hors RFC (43–128)', () => {
    expect(() => generateCodeVerifier(42)).toThrow(RangeError)
    expect(() => generateCodeVerifier(129)).toThrow(RangeError)
  })

  it('deux verifiers ne se répètent pas (aléa)', () => {
    expect(generateCodeVerifier()).not.toBe(generateCodeVerifier())
  })
})

describe('bytesToHex', () => {
  it('padde chaque octet sur 2 caractères', () => {
    expect(bytesToHex(new Uint8Array([0, 15, 255]))).toBe('000fff')
  })
})

/* ------------------------------------------------- OIDC : at_hash & JWS */

import { computeAtHash, verifyCompactJwsES256 } from './crypto'
import { OIDC_ACCESS_TOKEN, OIDC_AT_HASH, OIDC_ID_TOKEN, OIDC_JWKS } from '../data/fixtures/oidc'

describe('computeAtHash (OIDC Core §3.1.3.6)', () => {
  it('reproduit exactement le at_hash de la fixture (moitié gauche SHA-256, base64url)', async () => {
    expect(await computeAtHash(OIDC_ACCESS_TOKEN)).toBe(OIDC_AT_HASH)
  })

  it('produit 22 caractères base64url pour SHA-256 (16 octets)', async () => {
    const h = await computeAtHash('anything')
    expect(h).toMatch(/^[A-Za-z0-9_-]{22}$/)
  })
})

describe('verifyCompactJwsES256', () => {
  const jwk = OIDC_JWKS.keys[0] as JsonWebKey

  it('vérifie l’ID Token fixture avec la clé du JWKS', async () => {
    expect(await verifyCompactJwsES256(OIDC_ID_TOKEN, jwk)).toBe(true)
  })

  it('rejette un payload altéré (un seul claim modifié)', async () => {
    const [h, p, s] = OIDC_ID_TOKEN.split('.') as [string, string, string]
    const claims = JSON.parse(Buffer.from(p, 'base64url').toString())
    claims.sub = 'attacker'
    const tampered = Buffer.from(JSON.stringify(claims)).toString('base64url')
    expect(await verifyCompactJwsES256(`${h}.${tampered}.${s}`, jwk)).toBe(false)
  })

  it('rejette une autre clé (kid inconnu)', async () => {
    const wrongJwk = { ...jwk, x: jwk.y, y: jwk.x } // clé invalide/différente
    await expect(verifyCompactJwsES256(OIDC_ID_TOKEN, wrongJwk).catch(() => false)).resolves.toBe(
      false,
    )
  })
})
