import { z } from 'zod'

/**
 * Modèle de données des scénarios de séquence.
 *
 * C'est l'API de contribution du contenu pédagogique : un scénario est un
 * fichier JSON statique (public/scenarios/**) validé par ce schéma Zod au
 * chargement. Toute la valeur pédagogique est dans ces fichiers — les soigner
 * autant que le code.
 */

/** Rôles protocolaires connus — pilotent le code couleur constant de l'app. */
export const actorRoleSchema = z.enum([
  'user', // Resource Owner / Utilisateur
  'browser', // User-Agent (front channel)
  'client', // Client OAuth2 / Relying Party OIDC
  'authorization-server', // Authorization Server / OpenID Provider
  'resource-server', // Resource Server (l'API)
  'wallet', // Wallet (OID4VCI/VP)
  'issuer', // Credential Issuer
  'verifier', // Verifier
  'attacker', // Attaquant (toujours rouge)
])
export type ActorRole = z.infer<typeof actorRoleSchema>

export const actorSchema = z.object({
  id: z.string().min(1),
  /** Nom affiché en tête de swimlane, ex. « Authorization Server ». */
  name: z.string().min(1),
  role: actorRoleSchema,
  /** Alias concret, ex. « = Keycloak », « = l'API photos ». */
  alias: z.string().optional(),
})
export type Actor = z.infer<typeof actorSchema>

/** Un paramètre HTTP (query ou body) annoté pédagogiquement. */
export const httpParamSchema = z.object({
  name: z.string(),
  value: z.string(),
  /** Définition courte affichée au survol. */
  description: z.string().optional(),
  /** Référence normative, ex. « RFC 6749 §4.1.1 ». */
  specRef: z.string().optional(),
})
export type HttpParam = z.infer<typeof httpParamSchema>

export const httpBodySchema = z.object({
  type: z.enum(['form', 'json', 'html', 'text']),
  content: z.string(),
  /** Body de type form/query décomposé en paramètres annotés. */
  params: z.array(httpParamSchema).optional(),
})

export const httpRequestSchema = z.object({
  method: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS']),
  /** URL sans query string (les paramètres sont listés dans `params`). */
  url: z.string(),
  params: z.array(httpParamSchema).optional(),
  headers: z.record(z.string(), z.string()).optional(),
  body: httpBodySchema.optional(),
})

export const httpResponseSchema = z.object({
  status: z.number().int().min(100).max(599),
  statusText: z.string().optional(),
  headers: z.record(z.string(), z.string()).optional(),
  body: httpBodySchema.optional(),
})

/**
 * Échange HTTP complet affiché quand on clique sur une flèche du diagramme.
 * `channel` est LA notion structurante du module OAuth2 :
 * front channel = transite par le navigateur (observable, manipulable),
 * back channel = serveur à serveur (TLS, authentifié).
 */
export const httpExchangeSchema = z.object({
  channel: z.enum(['front', 'back']),
  request: httpRequestSchema,
  response: httpResponseSchema.optional(),
})
export type HttpExchange = z.infer<typeof httpExchangeSchema>

/** Artefact inspectable à une étape (JWT, code, etc.). */
export const tokenRefSchema = z.object({
  id: z.string(),
  label: z.string(),
  format: z.enum(['jwt', 'opaque']),
  value: z.string(),
  note: z.string().optional(),
})
export type TokenRef = z.infer<typeof tokenRefSchema>

export const securityNoteSchema = z.object({
  level: z.enum(['info', 'warning', 'danger']),
  note: z.string(),
  specRef: z.string().optional(),
})
export type SecurityNote = z.infer<typeof securityNoteSchema>

export const stepKindSchema = z.enum([
  'http', // requête/réponse HTTP
  'redirect', // redirection via le navigateur (front channel)
  'user-action', // action humaine (clic, login, consentement)
  'internal', // traitement interne à un acteur
  'attack', // action de l'attaquant
])
export type StepKind = z.infer<typeof stepKindSchema>

export const stepSchema = z.object({
  id: z.string().min(1),
  from: z.string().min(1),
  to: z.string().min(1),
  /** Libellé court porté par la flèche, ex. « GET /authorize?… ». */
  label: z.string().min(1),
  kind: stepKindSchema,
  /** Explication pédagogique de l'étape (panneau latéral). */
  summary: z.string().optional(),
  request: httpExchangeSchema.optional(),
  tokens: z.array(tokenRefSchema).optional(),
  security: securityNoteSchema.optional(),
})
export type Step = z.infer<typeof stepSchema>

export const scenarioVariantSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  /** Étapes remplacées/ajoutées par rapport au scénario de base (diff par id). */
  steps: z.array(stepSchema),
})
export type ScenarioVariant = z.infer<typeof scenarioVariantSchema>

export const scenarioSchema = z
  .object({
    id: z.string().min(1),
    title: z.string().min(1),
    description: z.string().optional(),
    /** Références normatives principales du scénario. */
    specRefs: z.array(z.string()).optional(),
    actors: z.array(actorSchema).min(2),
    steps: z.array(stepSchema).min(1),
    variants: z.array(scenarioVariantSchema).optional(),
  })
  .superRefine((scenario, ctx) => {
    const actorIds = new Set(scenario.actors.map((a) => a.id))
    scenario.steps.forEach((step, i) => {
      for (const ref of [step.from, step.to] as const) {
        if (!actorIds.has(ref)) {
          ctx.addIssue({
            code: 'custom',
            path: ['steps', i],
            message: `Étape « ${step.id} » : acteur inconnu « ${ref} »`,
          })
        }
      }
    })
    const stepIds = scenario.steps.map((s) => s.id)
    if (new Set(stepIds).size !== stepIds.length) {
      ctx.addIssue({ code: 'custom', path: ['steps'], message: 'Ids d’étapes dupliqués' })
    }
  })
export type Scenario = z.infer<typeof scenarioSchema>

/** Valide un JSON inconnu ; jette une erreur détaillée si invalide. */
export function parseScenario(data: unknown): Scenario {
  return scenarioSchema.parse(data)
}
