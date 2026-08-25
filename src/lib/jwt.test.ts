import { describe, expect, it } from 'vitest'
import { base64UrlDecode, decodeJwt, formatEpochClaim, JwtDecodeError } from './jwt'

// Fixture générée avec jose (ES256) — la même que dans le scénario auth code.
const fixture =
  'eyJhbGciOiJFUzI1NiIsInR5cCI6ImF0K2p3dCIsImtpZCI6ImFzLTIwMjYtMDEifQ.eyJzY29wZSI6InBob3Rvcy5yZWFkIiwiY2xpZW50X2lkIjoid2ViLWFwcCIsImlzcyI6Imh0dHBzOi8vYXMuZXhhbXBsZSIsInN1YiI6InVzZXItOGIyYzkxIiwiYXVkIjoiaHR0cHM6Ly9hcGkuZXhhbXBsZSIsImlhdCI6MTc2NzIyNTYwMCwiZXhwIjoxNzY3MjI5MjAwLCJqdGkiOiI5ZjNhN2QyZS00YjFjLTRjOGEtOWU3NS0xZDJmNmI4YzBhMTEifQ.NMEldLsjPFYimHAjQZe9YwsMD-oouUEX3dThGkW15f5jCdMn_B5c7clmMOfeaoP0QagYLtQv1TpAgIokWqwYAw'

describe('base64UrlDecode', () => {
  it('décode l’alphabet base64url (- et _) sans padding', () => {
    // "?>" encodé en base64url : Pz4
    expect(base64UrlDecode('Pz4')).toBe('?>')
  })

  it('rejette les caractères hors alphabet (+, /, =)', () => {
    expect(() => base64UrlDecode('a+b')).toThrow(JwtDecodeError)
    expect(() => base64UrlDecode('a/b')).toThrow(JwtDecodeError)
    expect(() => base64UrlDecode('ab==')).toThrow(JwtDecodeError)
  })
})

describe('decodeJwt', () => {
  it('décode header, payload et signature de la fixture', () => {
    const jwt = decodeJwt(fixture)
    expect(jwt.header).toMatchObject({ alg: 'ES256', typ: 'at+jwt', kid: 'as-2026-01' })
    expect(jwt.payload).toMatchObject({
      iss: 'https://as.example',
      sub: 'user-8b2c91',
      aud: 'https://api.example',
      scope: 'photos.read',
    })
    expect(jwt.signature).toBe(jwt.raw.signature)
    expect(jwt.signature.length).toBeGreaterThan(0)
  })

  it('rejette autre chose que 3 segments', () => {
    expect(() => decodeJwt('a.b')).toThrowError(/3 segments/)
    expect(() => decodeJwt('a.b.c.d')).toThrowError(/3 segments/)
  })

  it('rejette un payload non-JSON', () => {
    expect(() => decodeJwt('eyJhbGciOiJub25lIn0.bm90LWpzb24.sig')).toThrow(JwtDecodeError)
  })
})

describe('formatEpochClaim', () => {
  it('formate exp/iat en ISO 8601', () => {
    expect(formatEpochClaim('exp', 1767229200)).toBe('2026-01-01T01:00:00.000Z')
    expect(formatEpochClaim('iat', 1767225600)).toBe('2026-01-01T00:00:00.000Z')
  })

  it('ignore les claims non temporels ou non numériques', () => {
    expect(formatEpochClaim('sub', 1767225600)).toBeNull()
    expect(formatEpochClaim('exp', 'demain')).toBeNull()
  })
})
