/**
 * Données de la Carte des specs : nœuds (specs) et arêtes (relations).
 * Familles → couleurs constantes ; positions fixées à la main pour une
 * lecture chronologique (haut → bas) et par famille (gauche → droite).
 */

export type SpecFamily = 'oauth2' | 'jose' | 'oidc' | 'vc' | 'iso' | 'eu'

export type SpecNode = {
  id: string
  label: string
  sub: string
  family: SpecFamily
  status: 'final' | 'draft' | 'reglement'
  x: number
  y: number
  description: string
}

export type SpecEdgeKind = 'etend' | 'profile' | 'remplace' | 'sappuie'

export type SpecEdge = { source: string; target: string; kind: SpecEdgeKind }

export const familyMeta: Record<SpecFamily, { label: string; color: string }> = {
  oauth2: { label: 'OAuth 2.0', color: 'var(--actor-authorization-server)' },
  jose: { label: 'JOSE / JWT', color: 'var(--actor-client)' },
  oidc: { label: 'OpenID Connect', color: 'var(--actor-user)' },
  vc: { label: 'Verifiable Credentials', color: 'var(--actor-wallet)' },
  iso: { label: 'ISO', color: 'var(--actor-verifier)' },
  eu: { label: 'Europe', color: 'var(--accent)' },
}

export const edgeKindMeta: Record<SpecEdgeKind, { label: string; dash?: string }> = {
  etend: { label: 'étend' },
  profile: { label: 'profile', dash: '6 4' },
  remplace: { label: 'remplace/consolide', dash: '2 4' },
  sappuie: { label: 's’appuie sur', dash: '10 4' },
}

export const specNodes: SpecNode[] = [
  // — Colonne OAuth2 —
  {
    id: 'rfc6749',
    label: 'RFC 6749',
    sub: 'OAuth 2.0',
    family: 'oauth2',
    status: 'final',
    x: 60,
    y: 240,
    description:
      'Le cadre d’autorisation : rôles, grants, endpoints. Le socle de tout le reste du graphe — suivez les flèches qui en partent.',
  },
  {
    id: 'rfc6750',
    label: 'RFC 6750',
    sub: 'Bearer Token',
    family: 'oauth2',
    status: 'final',
    x: 60,
    y: 360,
    description:
      'L’usage du bearer token contre un Resource Server. Le nom dit le problème : détention = pouvoir.',
  },
  {
    id: 'rfc7636',
    label: 'RFC 7636',
    sub: 'PKCE',
    family: 'oauth2',
    status: 'final',
    x: 60,
    y: 480,
    description:
      'Lie le code au Client qui l’a demandé (verifier/challenge S256). Rendu obligatoire partout par le BCP et OAuth 2.1.',
  },
  {
    id: 'rfc8628',
    label: 'RFC 8628',
    sub: 'Device Grant',
    family: 'oauth2',
    status: 'final',
    x: 60,
    y: 600,
    description:
      'Le flow des appareils sans navigateur ni clavier (TV, CLI) : user_code sur un second appareil, polling du premier.',
  },
  {
    id: 'rfc9449',
    label: 'RFC 9449',
    sub: 'DPoP',
    family: 'oauth2',
    status: 'final',
    x: 240,
    y: 600,
    description:
      'Tokens liés au détenteur par preuve de possession applicative — la réponse au vol de bearer token.',
  },
  {
    id: 'par-jar-rar',
    label: 'RFC 9126 · 9101 · 9396',
    sub: 'PAR · JAR · RAR',
    family: 'oauth2',
    status: 'final',
    x: 240,
    y: 480,
    description:
      'Requêtes poussées (PAR), signées (JAR), riches (RAR) : l’authorization request durcie et précisée. JAR et RAR resurgissent dans OID4VP/VCI.',
  },
  {
    id: 'rfc9700',
    label: 'RFC 9700',
    sub: 'Security BCP',
    family: 'oauth2',
    status: 'final',
    x: 240,
    y: 240,
    description:
      'Vingt ans de leçons actées : PKCE généralisé, fin d’implicit et de ROPC, exact matching, sender-constrained tokens.',
  },
  {
    id: 'oauth21',
    label: 'OAuth 2.1',
    sub: 'draft',
    family: 'oauth2',
    status: 'draft',
    x: 240,
    y: 120,
    description:
      'La consolidation : 6749 + BCP − ce qui est déprécié. Un seul document à lire pour démarrer proprement.',
  },

  // — Colonne JOSE —
  {
    id: 'jose',
    label: 'RFC 7515-7518',
    sub: 'JWS · JWE · JWK · JWA',
    family: 'jose',
    status: 'final',
    x: 470,
    y: 120,
    description:
      'La boîte à outils : signer (JWS), chiffrer (JWE), représenter les clés (JWK), nommer les algorithmes (JWA).',
  },
  {
    id: 'jwt',
    label: 'RFC 7519',
    sub: 'JWT',
    family: 'jose',
    status: 'final',
    x: 470,
    y: 240,
    description:
      'Le format de claims signé/chiffré le plus déployé du web. ID Token, access token (RFC 9068), proofs, KB-JWT : tous des JWT.',
  },
  {
    id: 'sd-jwt',
    label: 'draft IETF',
    sub: 'SD-JWT',
    family: 'jose',
    status: 'draft',
    x: 470,
    y: 480,
    description:
      'La divulgation sélective par digests salés (_sd) et disclosures — plus le Key Binding JWT. Le moteur crypto du monde VC.',
  },

  // — Colonne OIDC —
  {
    id: 'oidc-core',
    label: 'OIDC Core 1.0',
    sub: 'l’authentification',
    family: 'oidc',
    status: 'final',
    x: 700,
    y: 240,
    description:
      'La couche d’identité au-dessus d’OAuth2 : ID Token, UserInfo, validation §3.1.3.7. Ce que « login avec » veut vraiment dire.',
  },
  {
    id: 'oidc-discovery',
    label: 'OIDC Discovery 1.0',
    sub: '.well-known',
    family: 'oidc',
    status: 'final',
    x: 700,
    y: 360,
    description:
      'La configuration de l’OP publiée à une URL standard dérivée de l’issuer — endpoints, JWKS, capacités.',
  },

  // — Colonne VC —
  {
    id: 'sd-jwt-vc',
    label: 'draft IETF',
    sub: 'SD-JWT VC',
    family: 'vc',
    status: 'draft',
    x: 700,
    y: 480,
    description:
      'Le profil credential de SD-JWT : typ dc+sd-jwt, vct, cnf. Format du PID de l’EUDI Wallet.',
  },
  {
    id: 'oid4vci',
    label: 'OID4VCI 1.0',
    sub: 'émission',
    family: 'vc',
    status: 'final',
    x: 930,
    y: 360,
    description:
      'L’émission de credentials : Credential Offer, pre-authorized code, Nonce Endpoint, jwt proof, key attestation.',
  },
  {
    id: 'oid4vp',
    label: 'OID4VP 1.0',
    sub: 'présentation',
    family: 'vc',
    status: 'final',
    x: 930,
    y: 480,
    description:
      'La présentation : DCQL, Client Identifier Prefixes, vp_token, direct_post, et l’annexe DC API.',
  },
  {
    id: 'haip',
    label: 'HAIP',
    sub: 'profil interop',
    family: 'vc',
    status: 'draft',
    x: 930,
    y: 600,
    description:
      'Le profil à haut niveau de garantie qui fige les options d’OID4VCI/VP pour l’interopérabilité réelle.',
  },

  // — ISO / EU —
  {
    id: 'iso18013',
    label: 'ISO/IEC 18013-5',
    sub: 'mdoc / mDL',
    family: 'iso',
    status: 'final',
    x: 700,
    y: 600,
    description:
      'Le permis de conduire mobile : CBOR/COSE, doctype, présentation de proximité (NFC/BLE). Second format EUDI.',
  },
  {
    id: 'eidas2',
    label: 'Règlement (UE) 2024/1183',
    sub: 'eIDAS 2.0',
    family: 'eu',
    status: 'reglement',
    x: 1160,
    y: 360,
    description:
      'Le texte qui impose l’EUDI Wallet à chaque État membre — et, en creux, la non-traçabilité par l’émetteur.',
  },
  {
    id: 'arf',
    label: 'ARF',
    sub: 'cadre technique EUDI',
    family: 'eu',
    status: 'draft',
    x: 1160,
    y: 480,
    description:
      'L’Architecture and Reference Framework : le profil technique européen qui assemble OID4VCI/VP, SD-JWT VC et mdoc.',
  },
]

export const specEdges: SpecEdge[] = [
  { source: 'rfc6750', target: 'rfc6749', kind: 'etend' },
  { source: 'rfc7636', target: 'rfc6749', kind: 'etend' },
  { source: 'rfc8628', target: 'rfc6749', kind: 'etend' },
  { source: 'rfc9449', target: 'rfc6750', kind: 'etend' },
  { source: 'par-jar-rar', target: 'rfc6749', kind: 'etend' },
  { source: 'rfc9700', target: 'rfc6749', kind: 'profile' },
  { source: 'oauth21', target: 'rfc6749', kind: 'remplace' },
  { source: 'oauth21', target: 'rfc9700', kind: 'sappuie' },

  { source: 'jwt', target: 'jose', kind: 'sappuie' },
  { source: 'sd-jwt', target: 'jose', kind: 'etend' },

  { source: 'oidc-core', target: 'rfc6749', kind: 'sappuie' },
  { source: 'oidc-core', target: 'jwt', kind: 'sappuie' },
  { source: 'oidc-discovery', target: 'oidc-core', kind: 'etend' },

  { source: 'sd-jwt-vc', target: 'sd-jwt', kind: 'profile' },
  { source: 'oid4vci', target: 'rfc6749', kind: 'sappuie' },
  { source: 'oid4vci', target: 'sd-jwt-vc', kind: 'sappuie' },
  { source: 'oid4vci', target: 'iso18013', kind: 'sappuie' },
  { source: 'oid4vp', target: 'sd-jwt-vc', kind: 'sappuie' },
  { source: 'oid4vp', target: 'iso18013', kind: 'sappuie' },
  { source: 'oid4vp', target: 'par-jar-rar', kind: 'sappuie' },
  { source: 'haip', target: 'oid4vci', kind: 'profile' },
  { source: 'haip', target: 'oid4vp', kind: 'profile' },

  { source: 'arf', target: 'oid4vci', kind: 'profile' },
  { source: 'arf', target: 'oid4vp', kind: 'profile' },
  { source: 'arf', target: 'eidas2', kind: 'sappuie' },
]
