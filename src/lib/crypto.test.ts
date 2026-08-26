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

/* ------------------------------------------------- SD-JWT / OID4VCI */

import { computeDisclosureDigest, decodeDisclosure } from './crypto'
import {
  VCI_C_NONCE,
  VCI_DISCLOSURES,
  VCI_ISSUER,
  VCI_ISSUER_JWKS,
  VCI_JWT_PROOF,
  VCI_SD_JWT,
  VCI_SD_JWT_COMPACT,
  WALLET_PUBLIC_JWK,
} from '../data/fixtures/oid4vci'
import { decodeJwt } from './jwt'

describe('fixtures SD-JWT VC (draft-ietf-oauth-sd-jwt-vc)', () => {
  const payload = decodeJwt(VCI_SD_JWT).payload as {
    _sd: string[]
    _sd_alg: string
    vct: string
    cnf: { jwk: { x: string; y: string } }
  }

  it('chaque digest de disclosure figure dans _sd (hachage salé réel)', async () => {
    expect(payload._sd_alg).toBe('sha-256')
    for (const d of VCI_DISCLOSURES) {
      expect(await computeDisclosureDigest(d.b64)).toBe(d.digest)
      expect(payload._sd).toContain(d.digest)
    }
  })

  it('les disclosures décodées redonnent [salt, nom, valeur]', () => {
    const [salt, name, value] = decodeDisclosure(VCI_DISCLOSURES[0]!.b64)
    expect(salt).toBe(VCI_DISCLOSURES[0]!.salt)
    expect(name).toBe('given_name')
    expect(value).toBe('Camille')
  })

  it('le SD-JWT est signé par l’Issuer (typ dc+sd-jwt) et vérifiable', async () => {
    expect(decodeJwt(VCI_SD_JWT).header.typ).toBe('dc+sd-jwt')
    expect(payload.vct).toMatch(/^https:/)
    expect(await verifyCompactJwsES256(VCI_SD_JWT, VCI_ISSUER_JWKS.keys[0] as JsonWebKey)).toBe(
      true,
    )
  })

  it('cnf.jwk du credential est exactement la clé publique du Wallet', () => {
    expect(payload.cnf.jwk.x).toBe(WALLET_PUBLIC_JWK.x)
    expect(payload.cnf.jwk.y).toBe(WALLET_PUBLIC_JWK.y)
  })

  it('le format compact est <jwt>~<d1>~<d2>~<d3>~', () => {
    const parts = VCI_SD_JWT_COMPACT.split('~')
    expect(parts[0]).toBe(VCI_SD_JWT)
    expect(parts.slice(1, -1)).toHaveLength(3)
    expect(parts.at(-1)).toBe('')
  })
})

describe('fixture jwt proof (OID4VCI 1.0 App. F.1)', () => {
  it('typ openid4vci-proof+jwt, aud = issuer, nonce = c_nonce', () => {
    const { header, payload } = decodeJwt(VCI_JWT_PROOF)
    expect(header.typ).toBe('openid4vci-proof+jwt')
    expect(payload.aud).toBe(VCI_ISSUER)
    expect(payload.nonce).toBe(VCI_C_NONCE)
  })

  it('signé par la clé du Wallet (celle du header jwk)', async () => {
    const { header } = decodeJwt(VCI_JWT_PROOF)
    expect(await verifyCompactJwsES256(VCI_JWT_PROOF, header.jwk as JsonWebKey)).toBe(true)
    // et cette clé est bien celle attestée dans le credential (cnf)
    expect((header.jwk as { x: string }).x).toBe(WALLET_PUBLIC_JWK.x)
  })

  it('un proof au nonce altéré ne vérifie plus', async () => {
    const [h, p, s] = VCI_JWT_PROOF.split('.') as [string, string, string]
    const claims = JSON.parse(Buffer.from(p, 'base64url').toString())
    claims.nonce = 'cn-forged'
    const forged = Buffer.from(JSON.stringify(claims)).toString('base64url')
    const { header } = decodeJwt(VCI_JWT_PROOF)
    expect(await verifyCompactJwsES256(`${h}.${forged}.${s}`, header.jwk as JsonWebKey)).toBe(false)
  })
})
