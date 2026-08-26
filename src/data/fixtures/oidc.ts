/**
 * Fixtures OIDC — GÉNÉRÉES par scripts/gen-oidc-fixtures.mjs (jose, dev
 * uniquement). Ne pas éditer à la main : régénérer. Clés jetables, aucune
 * donnée réelle. Timestamps fixes (2026-01-01T00:00:00Z) pour les tests.
 */

/** Access token opaque émis par l'OP (valeur de l'exemple OIDC Core §3.1.3.3). */
export const OIDC_ACCESS_TOKEN = 'SlAV32hkKG'

/** nonce généré par le RP au début du flow (exemple OIDC Core §3.1.3.1). */
export const OIDC_NONCE = 'n-0S6_WzA2Mj'

/** at_hash attendu : base64url(moitié gauche de SHA-256(access_token)) — §3.1.3.6. */
export const OIDC_AT_HASH = 'rXH7QWVTZnXYCou_6Vdpfg'

/** ID Token signé ES256 par l'OP (kid op-2026-01) — claims OIDC Core §2. */
export const OIDC_ID_TOKEN =
  'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Im9wLTIwMjYtMDEifQ.eyJhdXRoX3RpbWUiOjE3NjcyMjU1ODAsIm5vbmNlIjoibi0wUzZfV3pBMk1qIiwiYXRfaGFzaCI6InJYSDdRV1ZUWm5YWUNvdV82VmRwZmciLCJlbWFpbCI6InVzZXJAbWFpbC5leGFtcGxlIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImlzcyI6Imh0dHBzOi8vb3AuZXhhbXBsZSIsInN1YiI6InVzZXItOGIyYzkxIiwiYXVkIjoid2ViLWFwcCIsImlhdCI6MTc2NzIyNTYwMCwiZXhwIjoxNzY3MjI5MjAwfQ.QTmRvNUgt0gRk1sSIDyr-Q_-5D8XKhzHWpiQOhTvaOeVGMlwiHIk201bUo_MoMdihh-SwaAS9GXQSVrDTS_EVg'

/** JWKS publié par l'OP sur jwks_uri (RFC 7517) — la clé qui vérifie l'ID Token. */
export const OIDC_JWKS = {
  keys: [
    {
      kty: 'EC',
      x: 'xW33eUhIVQiXYUl_6EwHAivO6J9nwibFa56ILrP1F94',
      y: 'ZxwsTfzF2ECeH4gkmGeFW__urmi1rJhMestuaeVtzIY',
      crv: 'P-256',
      kid: 'op-2026-01',
      alg: 'ES256',
      use: 'sig',
    },
  ],
} as const
