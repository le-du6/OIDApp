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
