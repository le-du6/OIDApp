/**
 * Fixtures OID4VP — GÉNÉRÉES par scripts/gen-oid4vp-fixtures.mjs (jose, dev
 * uniquement). Ne pas éditer : régénérer. Clés jetables, données fictives,
 * salts/timestamps fixes pour les tests.
 */

/** client_id du Verifier — préfixe x509_san_dns (OID4VP 1.0 §5.9.3). */
export const VP_VERIFIER_CLIENT_ID = 'x509_san_dns:verifier.example'

/** nonce de l'Authorization Request du Verifier (anti-rejeu). */
export const VP_NONCE = 'vpn-4Kd82mQxaz'

/** JWKS public de l'Issuer du credential présenté. */
export const VP_ISSUER_JWKS = {
  keys: [
    {
      kty: 'EC',
      x: 'CJw283n282bugcPCc2CBICxRcecFbeNYVMSaUDrN50A',
      y: '3bkG2-9eOhmM0a9xzPUukZTNUi3QgLwSKwZLGWvcxCI',
      crv: 'P-256',
      kid: 'vp-issuer-2026-01',
      alg: 'ES256',
      use: 'sig',
    },
  ],
} as const

/** Clé publique du wallet (celle du cnf du credential — vérifie le KB-JWT). */
export const VP_WALLET_JWK = {
  kty: 'EC',
  x: '1nvop1c5AeNM__ogG7CIoZmi7z4U3bD5Dpzz5SyNB6U',
  y: 'GiYvXjoPb9ILih9gv6X_Uf69Zkz1HCyNTu5loz4UVDY',
  crv: 'P-256',
} as const

/** Les 3 disclosures du credential ; revealed = choix de CETTE présentation. */
export const VP_DISCLOSURES = [
  {
    salt: 'salt-gn-Vp81KzTe',
    name: 'given_name',
    value: 'Camille',
    revealed: true,
    b64: 'WyJzYWx0LWduLVZwODFLelRlIiwiZ2l2ZW5fbmFtZSIsIkNhbWlsbGUiXQ',
    digest: 'tP2RTc-6a8MsVzxF0v-AnHS72fkcLolouGuY7_-WTO0',
  },
  {
    salt: 'salt-fn-Wq44RbNu',
    name: 'family_name',
    value: 'Martin',
    revealed: false,
    b64: 'WyJzYWx0LWZuLVdxNDRSYk51IiwiZmFtaWx5X25hbWUiLCJNYXJ0aW4iXQ',
    digest: 'Hias6KjYiSHtz3012NHu0suA2EAi7-yhLxUifg1UqAM',
  },
  {
    salt: 'salt-bd-Xc09LmPy',
    name: 'birthdate',
    value: '1990-01-01',
    revealed: true,
    b64: 'WyJzYWx0LWJkLVhjMDlMbVB5IiwiYmlydGhkYXRlIiwiMTk5MC0wMS0wMSJd',
    digest: '_Ij9eBAw9kgxr9gp1o1ucyAXUKiIE02rWNdE24chbLo',
  },
] as const

/** Partie JWT (signée par l'Issuer) du credential SD-JWT VC. */
export const VP_SD_JWT =
  'eyJhbGciOiJFUzI1NiIsInR5cCI6ImRjK3NkLWp3dCIsImtpZCI6InZwLWlzc3Vlci0yMDI2LTAxIn0.eyJ2Y3QiOiJodHRwczovL2NyZWRlbnRpYWxzLmV4YW1wbGUvaWRlbnRpdHlfY3JlZGVudGlhbCIsIl9zZCI6WyJ0UDJSVGMtNmE4TXNWenhGMHYtQW5IUzcyZmtjTG9sb3VHdVk3Xy1XVE8wIiwiSGlhczZLallpU0h0ejMwMTJOSHUwc3VBMkVBaTcteWhMeFVpZmcxVXFBTSIsIl9JajllQkF3OWtneHI5Z3AxbzF1Y3lBWFVLaUlFMDJyV05kRTI0Y2hiTG8iXSwiX3NkX2FsZyI6InNoYS0yNTYiLCJjbmYiOnsiandrIjp7Imt0eSI6IkVDIiwieCI6IjFudm9wMWM1QWVOTV9fb2dHN0NJb1ptaTd6NFUzYkQ1RHB6ejVTeU5CNlUiLCJ5IjoiR2lZdlhqb1BiOUlMaWg5Z3Y2WF9VZjY5Wmt6MUhDeU5UdTVsb3o0VVZEWSIsImNydiI6IlAtMjU2In19LCJpc3MiOiJodHRwczovL2lzc3Vlci5leGFtcGxlIiwiaWF0IjoxNzY3MjI1NjAwLCJleHAiOjE3OTg3NjE2MDB9.E0MC0n24apnE7eJNZytc9y7kn-jnx3fDOPlSOTf5mqg5jb-mdAdgYNvYN0p3vqSTTs62hoLIbIlC0wFwHVyGeA'

/** Partie « credential + disclosures CHOISIES » de la présentation (finit par ~). */
export const VP_PRESENTATION_PART =
  'eyJhbGciOiJFUzI1NiIsInR5cCI6ImRjK3NkLWp3dCIsImtpZCI6InZwLWlzc3Vlci0yMDI2LTAxIn0.eyJ2Y3QiOiJodHRwczovL2NyZWRlbnRpYWxzLmV4YW1wbGUvaWRlbnRpdHlfY3JlZGVudGlhbCIsIl9zZCI6WyJ0UDJSVGMtNmE4TXNWenhGMHYtQW5IUzcyZmtjTG9sb3VHdVk3Xy1XVE8wIiwiSGlhczZLallpU0h0ejMwMTJOSHUwc3VBMkVBaTcteWhMeFVpZmcxVXFBTSIsIl9JajllQkF3OWtneHI5Z3AxbzF1Y3lBWFVLaUlFMDJyV05kRTI0Y2hiTG8iXSwiX3NkX2FsZyI6InNoYS0yNTYiLCJjbmYiOnsiandrIjp7Imt0eSI6IkVDIiwieCI6IjFudm9wMWM1QWVOTV9fb2dHN0NJb1ptaTd6NFUzYkQ1RHB6ejVTeU5CNlUiLCJ5IjoiR2lZdlhqb1BiOUlMaWg5Z3Y2WF9VZjY5Wmt6MUhDeU5UdTVsb3o0VVZEWSIsImNydiI6IlAtMjU2In19LCJpc3MiOiJodHRwczovL2lzc3Vlci5leGFtcGxlIiwiaWF0IjoxNzY3MjI1NjAwLCJleHAiOjE3OTg3NjE2MDB9.E0MC0n24apnE7eJNZytc9y7kn-jnx3fDOPlSOTf5mqg5jb-mdAdgYNvYN0p3vqSTTs62hoLIbIlC0wFwHVyGeA~WyJzYWx0LWduLVZwODFLelRlIiwiZ2l2ZW5fbmFtZSIsIkNhbWlsbGUiXQ~WyJzYWx0LWJkLVhjMDlMbVB5IiwiYmlydGhkYXRlIiwiMTk5MC0wMS0wMSJd~'

/** sd_hash attendu = base64url(SHA-256(VP_PRESENTATION_PART)). */
export const VP_SD_HASH = 'twOwUNkkJUeMafFuYkt0zPsiRZWYHAtKlUd_-U9IWdE'

/** Key Binding JWT (typ kb+jwt) — signé par la clé du wallet. */
export const VP_KB_JWT =
  'eyJhbGciOiJFUzI1NiIsInR5cCI6ImtiK2p3dCJ9.eyJub25jZSI6InZwbi00S2Q4Mm1ReGF6Iiwic2RfaGFzaCI6InR3T3dVTmtrSlVlTWFmRnVZa3QwelBzaVJaV1lIQXRLbFVkXy1VOUlXZEUiLCJhdWQiOiJ4NTA5X3Nhbl9kbnM6dmVyaWZpZXIuZXhhbXBsZSIsImlhdCI6MTc2NzIyOTIwMH0.4d_ejumT1FiWg4yIj2cOKz0Uwx5ySI75HxFjTKvS0Zsu41XljXYD1LCyKEqb5zRqRkLOnOsqdqyVSBk5Riv5rw'

/** Présentation complète : <jwt>~<disclosures choisies>~<kb-jwt>. */
export const VP_PRESENTATION =
  'eyJhbGciOiJFUzI1NiIsInR5cCI6ImRjK3NkLWp3dCIsImtpZCI6InZwLWlzc3Vlci0yMDI2LTAxIn0.eyJ2Y3QiOiJodHRwczovL2NyZWRlbnRpYWxzLmV4YW1wbGUvaWRlbnRpdHlfY3JlZGVudGlhbCIsIl9zZCI6WyJ0UDJSVGMtNmE4TXNWenhGMHYtQW5IUzcyZmtjTG9sb3VHdVk3Xy1XVE8wIiwiSGlhczZLallpU0h0ejMwMTJOSHUwc3VBMkVBaTcteWhMeFVpZmcxVXFBTSIsIl9JajllQkF3OWtneHI5Z3AxbzF1Y3lBWFVLaUlFMDJyV05kRTI0Y2hiTG8iXSwiX3NkX2FsZyI6InNoYS0yNTYiLCJjbmYiOnsiandrIjp7Imt0eSI6IkVDIiwieCI6IjFudm9wMWM1QWVOTV9fb2dHN0NJb1ptaTd6NFUzYkQ1RHB6ejVTeU5CNlUiLCJ5IjoiR2lZdlhqb1BiOUlMaWg5Z3Y2WF9VZjY5Wmt6MUhDeU5UdTVsb3o0VVZEWSIsImNydiI6IlAtMjU2In19LCJpc3MiOiJodHRwczovL2lzc3Vlci5leGFtcGxlIiwiaWF0IjoxNzY3MjI1NjAwLCJleHAiOjE3OTg3NjE2MDB9.E0MC0n24apnE7eJNZytc9y7kn-jnx3fDOPlSOTf5mqg5jb-mdAdgYNvYN0p3vqSTTs62hoLIbIlC0wFwHVyGeA~WyJzYWx0LWduLVZwODFLelRlIiwiZ2l2ZW5fbmFtZSIsIkNhbWlsbGUiXQ~WyJzYWx0LWJkLVhjMDlMbVB5IiwiYmlydGhkYXRlIiwiMTk5MC0wMS0wMSJd~eyJhbGciOiJFUzI1NiIsInR5cCI6ImtiK2p3dCJ9.eyJub25jZSI6InZwbi00S2Q4Mm1ReGF6Iiwic2RfaGFzaCI6InR3T3dVTmtrSlVlTWFmRnVZa3QwelBzaVJaV1lIQXRLbFVkXy1VOUlXZEUiLCJhdWQiOiJ4NTA5X3Nhbl9kbnM6dmVyaWZpZXIuZXhhbXBsZSIsImlhdCI6MTc2NzIyOTIwMH0.4d_ejumT1FiWg4yIj2cOKz0Uwx5ySI75HxFjTKvS0Zsu41XljXYD1LCyKEqb5zRqRkLOnOsqdqyVSBk5Riv5rw'
