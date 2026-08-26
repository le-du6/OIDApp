/**
 * Fixtures OID4VCI — GÉNÉRÉES par scripts/gen-oid4vci-fixtures.mjs (jose,
 * dev uniquement). Ne pas éditer : régénérer. Clés jetables, données fictives,
 * salts/timestamps fixes pour les tests (en prod : salts CSPRNG).
 */

/** Identifiant de l'Issuer (credential_issuer). */
export const VCI_ISSUER = 'https://issuer.example'

/** vct du credential (SD-JWT VC — REQUIRED). */
export const VCI_VCT = 'https://credentials.example/identity_credential'

/** c_nonce émis par le Nonce Endpoint (OID4VCI 1.0 §7). */
export const VCI_C_NONCE = 'cn-7f3b9d24aa'

/** JWKS public de l'Issuer — vérifie la signature du SD-JWT VC. */
export const VCI_ISSUER_JWKS = {
  keys: [
    {
      kty: 'EC',
      x: '3F0qUmXMmmxYSSTWLOj1cgNCMCh30yuadLkBPWCahxI',
      y: 'y_sim5j1xgCduGqjQbRJrykHMze11df7_UAIQVEN57A',
      crv: 'P-256',
      kid: 'vci-issuer-2026-01',
      alg: 'ES256',
      use: 'sig',
    },
  ],
} as const

/** Clé publique du Wallet — celle que le credential lie via cnf.jwk. */
export const WALLET_PUBLIC_JWK = {
  kty: 'EC',
  x: '5LM2rhHDyFF5dR8losSvvjCndp2QJlFAzvVTte9vzXA',
  y: 'okMxjyVx_UDiQuSv1yoTuwjo_K_-EG4rYkf9gGW-gFA',
  crv: 'P-256',
} as const

/** Les disclosures : [salt, nom, valeur] → base64url, et leur digest SHA-256. */
export const VCI_DISCLOSURES = [
  {
    salt: 'salt-gn-8Kk1VbXq',
    name: 'given_name',
    value: 'Camille',
    b64: 'WyJzYWx0LWduLThLazFWYlhxIiwiZ2l2ZW5fbmFtZSIsIkNhbWlsbGUiXQ',
    digest: 'MPxkhbG7klNmwIyonwHEdLL2y6NSlB04NrgwiqzYhOY',
  },
  {
    salt: 'salt-fn-P3zR7wYd',
    name: 'family_name',
    value: 'Martin',
    b64: 'WyJzYWx0LWZuLVAzelI3d1lkIiwiZmFtaWx5X25hbWUiLCJNYXJ0aW4iXQ',
    digest: 'ZiNP4F2cQq7TEXqwHJIVcQVrLiBjCCUXjO2DLzaNOmw',
  },
  {
    salt: 'salt-bd-Ta9GmQ2c',
    name: 'birthdate',
    value: '1990-01-01',
    b64: 'WyJzYWx0LWJkLVRhOUdtUTJjIiwiYmlydGhkYXRlIiwiMTk5MC0wMS0wMSJd',
    digest: '43NlGfmDq0SN0h4a2VGo83MK-NBv5jKl1uCp8s9gt9M',
  },
] as const

/** Partie JWT (signée) du SD-JWT VC — typ dc+sd-jwt, _sd, cnf. */
export const VCI_SD_JWT =
  'eyJhbGciOiJFUzI1NiIsInR5cCI6ImRjK3NkLWp3dCIsImtpZCI6InZjaS1pc3N1ZXItMjAyNi0wMSJ9.eyJ2Y3QiOiJodHRwczovL2NyZWRlbnRpYWxzLmV4YW1wbGUvaWRlbnRpdHlfY3JlZGVudGlhbCIsIl9zZCI6WyJNUHhraGJHN2tsTm13SXlvbndIRWRMTDJ5Nk5TbEIwNE5yZ3dpcXpZaE9ZIiwiWmlOUDRGMmNRcTdURVhxd0hKSVZjUVZyTGlCakNDVVhqTzJETHphTk9tdyIsIjQzTmxHZm1EcTBTTjBoNGEyVkdvODNNSy1OQnY1aktsMXVDcDhzOWd0OU0iXSwiX3NkX2FsZyI6InNoYS0yNTYiLCJjbmYiOnsiandrIjp7Imt0eSI6IkVDIiwieCI6IjVMTTJyaEhEeUZGNWRSOGxvc1N2dmpDbmRwMlFKbEZBenZWVHRlOXZ6WEEiLCJ5Ijoib2tNeGp5VnhfVURpUXVTdjF5b1R1d2pvX0tfLUVHNHJZa2Y5Z0dXLWdGQSIsImNydiI6IlAtMjU2In19LCJpc3MiOiJodHRwczovL2lzc3Vlci5leGFtcGxlIiwiaWF0IjoxNzY3MjI1NjAwLCJleHAiOjE3OTg3NjE2MDB9.Xti8UVrKg1vz_wi95SBs0b73955qG_fhSqzAr0qfY072fAUx8IZQUBy49vHhCyiKneCAvyJcDl39AhhAYYOv0g'

/** SD-JWT VC complet, format compact : <jwt>~<disclosure>~…~ */
export const VCI_SD_JWT_COMPACT =
  'eyJhbGciOiJFUzI1NiIsInR5cCI6ImRjK3NkLWp3dCIsImtpZCI6InZjaS1pc3N1ZXItMjAyNi0wMSJ9.eyJ2Y3QiOiJodHRwczovL2NyZWRlbnRpYWxzLmV4YW1wbGUvaWRlbnRpdHlfY3JlZGVudGlhbCIsIl9zZCI6WyJNUHhraGJHN2tsTm13SXlvbndIRWRMTDJ5Nk5TbEIwNE5yZ3dpcXpZaE9ZIiwiWmlOUDRGMmNRcTdURVhxd0hKSVZjUVZyTGlCakNDVVhqTzJETHphTk9tdyIsIjQzTmxHZm1EcTBTTjBoNGEyVkdvODNNSy1OQnY1aktsMXVDcDhzOWd0OU0iXSwiX3NkX2FsZyI6InNoYS0yNTYiLCJjbmYiOnsiandrIjp7Imt0eSI6IkVDIiwieCI6IjVMTTJyaEhEeUZGNWRSOGxvc1N2dmpDbmRwMlFKbEZBenZWVHRlOXZ6WEEiLCJ5Ijoib2tNeGp5VnhfVURpUXVTdjF5b1R1d2pvX0tfLUVHNHJZa2Y5Z0dXLWdGQSIsImNydiI6IlAtMjU2In19LCJpc3MiOiJodHRwczovL2lzc3Vlci5leGFtcGxlIiwiaWF0IjoxNzY3MjI1NjAwLCJleHAiOjE3OTg3NjE2MDB9.Xti8UVrKg1vz_wi95SBs0b73955qG_fhSqzAr0qfY072fAUx8IZQUBy49vHhCyiKneCAvyJcDl39AhhAYYOv0g~WyJzYWx0LWduLThLazFWYlhxIiwiZ2l2ZW5fbmFtZSIsIkNhbWlsbGUiXQ~WyJzYWx0LWZuLVAzelI3d1lkIiwiZmFtaWx5X25hbWUiLCJNYXJ0aW4iXQ~WyJzYWx0LWJkLVRhOUdtUTJjIiwiYmlydGhkYXRlIiwiMTk5MC0wMS0wMSJd~'

/** jwt proof du Wallet — typ openid4vci-proof+jwt, nonce = c_nonce. */
export const VCI_JWT_PROOF =
  'eyJhbGciOiJFUzI1NiIsInR5cCI6Im9wZW5pZDR2Y2ktcHJvb2Yrand0IiwiandrIjp7Imt0eSI6IkVDIiwieCI6IjVMTTJyaEhEeUZGNWRSOGxvc1N2dmpDbmRwMlFKbEZBenZWVHRlOXZ6WEEiLCJ5Ijoib2tNeGp5VnhfVURpUXVTdjF5b1R1d2pvX0tfLUVHNHJZa2Y5Z0dXLWdGQSIsImNydiI6IlAtMjU2In19.eyJub25jZSI6ImNuLTdmM2I5ZDI0YWEiLCJhdWQiOiJodHRwczovL2lzc3Vlci5leGFtcGxlIiwiaWF0IjoxNzY3MjI1NjAwfQ.bYlD28QgkkWrtpO5wzJWeehrRe75AjCchBCHUzVdGi7bmUuGbjfrWhh_iApbZyRdtE6-asrsm1HGFFxhDOi7kg'
