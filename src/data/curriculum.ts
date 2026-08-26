/**
 * Structure pédagogique de l'app : modules → chapitres → leçons.
 * La navigation, le dashboard et le calcul de progression dérivent tous d'ici.
 */

export type LessonMeta = {
  id: string
  title: string
  /** Scénario SequenceDiagram associé (fichier public/scenarios/<id>.json). */
  scenarioId?: string
  /** Leçon rédigée et jouable (sinon « en construction »). */
  ready: boolean
}

export type ChapterMeta = {
  id: string
  /** Numéro affiché (0–7 pour OAuth2). */
  number: number
  title: string
  lessons: LessonMeta[]
}

export type ModuleMeta = {
  id: string
  title: string
  shortTitle: string
  description: string
  /** Module ouvert (Phase 1) ou à venir. */
  available: boolean
  /**
   * Versions de référence des specs du module (garde-fou : les specs
   * OID4VCI/OID4VP évoluent — on fixe et on AFFICHE la version utilisée).
   */
  specVersions?: string[]
  phase: number
  chapters: ChapterMeta[]
}

export const curriculum: ModuleMeta[] = [
  {
    id: 'oauth2',
    title: 'OAuth 2.0 — la délégation d’autorisation',
    shortTitle: 'OAuth 2.0',
    description:
      'Le socle de tout le reste : rôles, canaux, Authorization Code Flow, tokens, attaques et contre-mesures.',
    specVersions: ['RFC 6749 · RFC 6750 · RFC 7636 · RFC 9700 (Security BCP)'],
    available: true,
    phase: 1,
    chapters: [
      {
        id: 'vocabulaire',
        number: 0,
        title: 'Le vocabulaire inutilement compliqué',
        lessons: [{ id: 'decodage', title: 'Tableau de décodage des termes', ready: true }],
      },
      {
        id: 'probleme-origine',
        number: 1,
        title: 'Le problème d’origine',
        lessons: [
          {
            id: 'partage-mot-de-passe',
            title: 'Mot de passe partagé, API keys, délégation',
            ready: true,
          },
        ],
      },
      {
        id: 'roles-canaux',
        number: 2,
        title: 'Les 4 rôles et les 2 canaux',
        lessons: [
          { id: 'front-back-channel', title: 'Front channel vs back channel', ready: true },
        ],
      },
      {
        id: 'authorization-code',
        number: 3,
        title: 'Authorization Code Flow',
        lessons: [
          {
            id: 'flow-pas-a-pas',
            title: 'Le flow canonique, pas à pas',
            scenarioId: 'oauth2/authorization-code',
            ready: true,
          },
        ],
      },
      {
        id: 'tokens',
        number: 4,
        title: 'Tokens : access, refresh, bearer',
        lessons: [
          { id: 'anatomie-tokens', title: 'Anatomie et cycle de vie des tokens', ready: true },
        ],
      },
      {
        id: 'attaques',
        number: 5,
        title: 'Attaques et contre-mesures',
        lessons: [
          { id: 'csrf-state', title: 'CSRF sur le callback → state', ready: true },
          { id: 'interception-pkce', title: 'Interception du code → PKCE', ready: true },
          { id: 'implicit-ropc', title: 'Pourquoi Implicit et ROPC sont morts', ready: true },
          { id: 'bearer-dpop', title: 'Vol de bearer token → DPoP / mTLS', ready: true },
        ],
      },
      {
        id: 'autres-flows',
        number: 6,
        title: 'Les autres flows légitimes',
        lessons: [
          {
            id: 'client-credentials-device',
            title: 'Client Credentials & Device Grant',
            ready: true,
          },
        ],
      },
      {
        id: 'etat-de-l-art',
        number: 7,
        title: 'L’état de l’art 2026',
        lessons: [
          {
            id: 'bcp-oauth21',
            title: 'Security BCP (RFC 9700), OAuth 2.1, PAR/JAR/RAR',
            ready: true,
          },
        ],
      },
    ],
  },
  {
    id: 'oidc',
    title: 'OpenID Connect — l’authentification',
    shortTitle: 'OIDC',
    description:
      'La couche d’identité au-dessus d’OAuth2 : ID Token, validation de signature, Discovery, JWKS, nonce — et pourquoi « login avec un access token » est une faille.',
    specVersions: ['OIDC Core 1.0 (errata set 2) · OIDC Discovery 1.0'],
    available: true,
    phase: 2,
    chapters: [
      {
        id: 'pourquoi-oidc',
        number: 0,
        title: 'Pourquoi OIDC : délégation ≠ authentification',
        lessons: [
          {
            id: 'anti-pattern-login',
            title: 'L’anti-pattern « login avec un access token »',
            scenarioId: 'oidc/login-antipattern-broken',
            ready: true,
          },
        ],
      },
      {
        id: 'id-token',
        number: 1,
        title: 'L’ID Token : JWT, JWS (et JWE en aperçu)',
        lessons: [{ id: 'anatomie-id-token', title: 'Anatomie de l’ID Token', ready: true }],
      },
      {
        id: 'flow-complet',
        number: 2,
        title: 'Le flow OIDC complet',
        lessons: [
          {
            id: 'flow-pas-a-pas',
            title: 'Authorization Code + openid, pas à pas',
            scenarioId: 'oidc/authorization-code',
            ready: true,
          },
        ],
      },
      {
        id: 'validation',
        number: 3,
        title: 'Valider un ID Token',
        lessons: [
          {
            id: 'jwks-kid-verify',
            title: 'JWKS → kid → clé → verify',
            scenarioId: 'oidc/idtoken-validation',
            ready: true,
          },
        ],
      },
      {
        id: 'discovery',
        number: 4,
        title: 'Discovery & JWKS',
        lessons: [
          {
            id: 'well-known',
            title: 'Configurer un RP par Discovery',
            scenarioId: 'oidc/discovery',
            ready: true,
          },
        ],
      },
      {
        id: 'nonce-at-hash',
        number: 5,
        title: 'nonce vs state, at_hash/c_hash',
        lessons: [{ id: 'liaisons', title: 'Trois liaisons contre le rejeu', ready: true }],
      },
      {
        id: 'oidc-vs-saml',
        number: 6,
        title: 'OIDC vs SAML',
        lessons: [{ id: 'comparaison', title: 'Deux façons de fédérer l’identité', ready: true }],
      },
    ],
  },
  {
    id: 'oid4vci',
    title: 'OID4VCI — l’émission de credentials',
    shortTitle: 'OID4VCI',
    description:
      'Changement de paradigme : le triangle Issuer / Wallet / Verifier remplace la fédération. Credential Offer, pre-authorized code, preuve de possession de clé, SD-JWT VC et mdoc.',
    specVersions: [
      'OID4VCI 1.0 (Final)',
      'draft-ietf-oauth-sd-jwt-vc-13 (nov. 2025)',
      'draft-ietf-oauth-selective-disclosure-jwt',
      'ISO/IEC 18013-5:2021 (mdoc/mDL)',
    ],
    available: true,
    phase: 3,
    chapters: [
      {
        id: 'paradigme',
        number: 0,
        title: 'Le changement de paradigme',
        lessons: [
          {
            id: 'phone-home',
            title: 'Fédération « phone home » vs triangle',
            scenarioId: 'oid4vci/federation-phone-home',
            ready: true,
          },
        ],
      },
      {
        id: 'credential-offer',
        number: 1,
        title: 'Credential Offer & pre-authorized code',
        lessons: [
          {
            id: 'pre-authorized',
            title: 'Du QR au credential, pas à pas',
            scenarioId: 'oid4vci/pre-authorized-code',
            ready: true,
          },
        ],
      },
      {
        id: 'authorization-code',
        number: 2,
        title: 'Authorization Code Flow (émission)',
        lessons: [
          {
            id: 'wallet-initiated',
            title: 'Quand le wallet initie : authorization_details',
            scenarioId: 'oid4vci/authorization-code',
            ready: true,
          },
        ],
      },
      {
        id: 'proof-of-possession',
        number: 3,
        title: 'Proof of possession de la clé',
        lessons: [
          {
            id: 'c-nonce-jwt-proof',
            title: 'c_nonce + jwt proof',
            scenarioId: 'oid4vci/jwt-proof',
            ready: true,
          },
        ],
      },
      {
        id: 'formats',
        number: 4,
        title: 'Formats : SD-JWT VC & mdoc/mDL',
        lessons: [
          { id: 'sd-jwt-vc-mdoc', title: 'Anatomie d’un SD-JWT VC (et du mdoc)', ready: true },
        ],
      },
      {
        id: 'key-attestation',
        number: 5,
        title: 'Key attestation',
        lessons: [{ id: 'attester-la-cle', title: 'Prouver OÙ vit la clé', ready: true }],
      },
      {
        id: 'eidas',
        number: 6,
        title: 'eIDAS 2.0 & EUDI Wallet',
        lessons: [{ id: 'contexte-eudi', title: 'Le cadre réglementaire européen', ready: true }],
      },
    ],
  },
  {
    id: 'oid4vp',
    title: 'OID4VP — la présentation vérifiable',
    shortTitle: 'OID4VP',
    description: 'DCQL, vp_token, divulgation sélective, Key Binding.',
    available: false,
    phase: 4,
    chapters: [],
  },
  {
    id: 'crypto',
    title: 'Fondations crypto',
    shortTitle: 'Crypto',
    description: 'Hachage, sel, signatures, preuve de possession, aléa.',
    available: false,
    phase: 1,
    chapters: [],
  },
]

export function getModule(moduleId: string): ModuleMeta | undefined {
  return curriculum.find((m) => m.id === moduleId)
}

export function getLesson(
  moduleId: string,
  chapterId: string,
  lessonId: string,
): { module: ModuleMeta; chapter: ChapterMeta; lesson: LessonMeta } | undefined {
  const module = getModule(moduleId)
  const chapter = module?.chapters.find((c) => c.id === chapterId)
  const lesson = chapter?.lessons.find((l) => l.id === lessonId)
  if (!module || !chapter || !lesson) return undefined
  return { module, chapter, lesson }
}

/** Id de progression stable d'une leçon : moduleId/chapterId/lessonId. */
export function lessonKey(moduleId: string, chapterId: string, lessonId: string): string {
  return `${moduleId}/${chapterId}/${lessonId}`
}

export function lessonCount(module: ModuleMeta): number {
  return module.chapters.reduce((n, c) => n + c.lessons.length, 0)
}
