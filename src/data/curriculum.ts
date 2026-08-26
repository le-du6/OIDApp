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
    description: 'ID Token, validation de signature, Discovery, JWKS, nonce.',
    available: false,
    phase: 2,
    chapters: [],
  },
  {
    id: 'oid4vci',
    title: 'OID4VCI — l’émission de credentials',
    shortTitle: 'OID4VCI',
    description: 'Le triangle Issuer / Wallet / Verifier, SD-JWT VC, mdoc.',
    available: false,
    phase: 3,
    chapters: [],
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
