import type { ActorRole } from '../engine/scenario'

/**
 * Glossaire central. Règles :
 * - `term` est le terme OFFICIEL anglais (jamais traduit dans l'app) ;
 * - `definition` est l'explication française, fidèle à la spec citée ;
 * - `naming` est la critique du nom quand elle est méritée — assumée : le
 *   vocabulaire d'OAuth2 est inutilement compliqué, on le dit.
 */
export type GlossaryEntry = {
  id: string
  term: string
  /** Prononciation/développé si utile (ex. « Proof Key for Code Exchange »). */
  expansion?: string
  definition: string
  specRef: string
  naming?: string
  /** Colore le terme du code couleur de l'acteur correspondant. */
  actorRole?: ActorRole
}

export const glossary: GlossaryEntry[] = [
  {
    id: 'resource-owner',
    term: 'Resource Owner',
    definition:
      'L’entité capable d’accorder l’accès à une ressource protégée. Quand c’est une personne physique, la spec dit « end-user » — dans 99 % des cas, c’est simplement l’utilisateur.',
    specRef: 'RFC 6749 §1.1',
    naming:
      'Personne ne dit « propriétaire de ressource » pour dire « vous ». Le nom est exact du point de vue du modèle, mais opaque pour un débutant.',
    actorRole: 'user',
  },
  {
    id: 'client',
    term: 'Client',
    definition:
      'L’application qui effectue des requêtes vers des ressources protégées au nom du Resource Owner et avec son autorisation. C’est souvent… un serveur web.',
    specRef: 'RFC 6749 §1.1',
    naming:
      '« Client » évoque le navigateur ou le poste de l’utilisateur ; ici c’est l’application qui consomme l’API — y compris un backend. Client au sens « client de l’AS », pas « client de l’humain ».',
    actorRole: 'client',
  },
  {
    id: 'authorization-server',
    term: 'Authorization Server',
    definition:
      'Le serveur qui authentifie le Resource Owner, recueille son consentement et émet les tokens. Keycloak, Auth0, Entra ID… jouent ce rôle.',
    specRef: 'RFC 6749 §1.1',
    naming:
      'Il passe son temps à faire de l’authentification mais ne s’appelle pas comme ça — parce qu’OAuth2 ne normalise QUE la partie autorisation. L’authentification y est un moyen, pas un résultat.',
    actorRole: 'authorization-server',
  },
  {
    id: 'resource-server',
    term: 'Resource Server',
    definition:
      'Le serveur qui héberge les ressources protégées et accepte les requêtes munies d’un access token : concrètement, l’API.',
    specRef: 'RFC 6749 §1.1',
    actorRole: 'resource-server',
  },
  {
    id: 'user-agent',
    term: 'User-Agent',
    definition:
      'Le logiciel par lequel le Resource Owner interagit : en pratique le navigateur. C’est le véhicule du front channel — tout ce qui y transite est observable et manipulable par l’utilisateur… ou par ce qui a compromis son poste.',
    specRef: 'RFC 6749 §1.1',
    actorRole: 'browser',
  },
  {
    id: 'authorization-grant',
    term: 'Authorization Grant',
    definition:
      'La représentation de l’autorisation accordée par le Resource Owner, que le Client échange contre un access token. Quatre types dans la RFC : authorization code, implicit, resource owner password credentials, client credentials.',
    specRef: 'RFC 6749 §1.3',
    naming:
      'Un mot abstrait pour « la preuve que l’utilisateur a dit oui ». Quatre « grants » pour des réalités très différentes (dont deux aujourd’hui dépréciés) n’aident pas.',
  },
  {
    id: 'access-token',
    term: 'Access token',
    definition:
      'Le jeton présenté au Resource Server pour accéder aux ressources. Sa forme n’est PAS normalisée par la RFC 6749 : opaque (simple référence) ou structuré (JWT, profil RFC 9068). Durée de vie courte par conception.',
    specRef: 'RFC 6749 §1.4',
  },
  {
    id: 'refresh-token',
    term: 'Refresh token',
    definition:
      'Jeton longue durée permettant au Client d’obtenir de nouveaux access tokens sans re-solliciter l’utilisateur. Il ne se présente QU’au token endpoint (back channel), jamais au Resource Server.',
    specRef: 'RFC 6749 §1.5',
  },
  {
    id: 'bearer-token',
    term: 'Bearer token',
    definition:
      'Token « au porteur » : quiconque le détient peut l’utiliser, sans avoir à prouver quoi que ce soit d’autre. C’est le mode par défaut d’OAuth2 (header Authorization: Bearer).',
    specRef: 'RFC 6750 §1.2',
    naming:
      'Pour une fois, le nom dit exactement le problème de sécurité : comme un billet de banque, détention = pouvoir. D’où les tokens liés à leur détenteur (DPoP, mTLS).',
  },
  {
    id: 'authorization-code',
    term: 'Authorization code',
    definition:
      'Jeton intermédiaire, opaque, éphémère (durée recommandée ≤ 10 min, en pratique quelques secondes) et à usage unique, remis au Client via le front channel puis échangé contre les tokens au token endpoint. Il existe pour que l’access token, lui, ne transite jamais par le navigateur.',
    specRef: 'RFC 6749 §4.1.2',
  },
  {
    id: 'scope',
    term: 'scope',
    definition:
      'Le périmètre d’accès demandé puis accordé, exprimé en liste de chaînes séparées par des espaces. C’est le contrat affiché à l’utilisateur au consentement, et la limite opposable au token.',
    specRef: 'RFC 6749 §3.3',
  },
  {
    id: 'redirect-uri',
    term: 'redirect_uri',
    definition:
      'L’adresse où l’AS renvoie le navigateur (et le code) après la décision de l’utilisateur. Doit être pré-enregistrée et comparée en correspondance EXACTE — toute validation approximative (préfixe, wildcard) ouvre des attaques d’open redirect.',
    specRef: 'RFC 6749 §3.1.2 · RFC 9700 §4.1',
  },
  {
    id: 'client-id',
    term: 'client_id',
    definition:
      'Identifiant public du Client, attribué lors de son enregistrement auprès de l’AS. Public : le connaître ne donne aucun pouvoir.',
    specRef: 'RFC 6749 §2.2',
  },
  {
    id: 'client-secret',
    term: 'client_secret',
    definition:
      'Secret partagé entre un Client confidentiel et l’AS, utilisé pour authentifier le Client au token endpoint. Un Client public (SPA, mobile) ne peut PAS en garder un — c’est ce qui motive PKCE.',
    specRef: 'RFC 6749 §2.3.1',
  },
  {
    id: 'confidential-public-client',
    term: 'Confidential / Public client',
    definition:
      'Client confidentiel : capable de protéger ses credentials (backend). Client public : incapable (app mobile, SPA — le code est entre les mains de l’utilisateur). Cette distinction pilote les exigences de sécurité de tout le protocole.',
    specRef: 'RFC 6749 §2.1',
  },
  {
    id: 'state',
    term: 'state',
    definition:
      'Valeur imprévisible générée par le Client, renvoyée telle quelle par l’AS au callback. Elle lie la réponse à la requête d’origine et à la session du navigateur : c’est la contre-mesure anti-CSRF du callback.',
    specRef: 'RFC 6749 §10.12 · RFC 9700 §2.1',
  },
  {
    id: 'pkce',
    term: 'PKCE',
    expansion: 'Proof Key for Code Exchange (« pixy »)',
    definition:
      'Extension qui lie l’authorization code au Client qui l’a demandé : le Client génère un code_verifier aléatoire, envoie son empreinte (code_challenge, S256) dans l’authorization request, puis prouve la possession du verifier au token endpoint. Un code volé devient inutilisable. Obligatoire pour tous les clients dans OAuth 2.1.',
    specRef: 'RFC 7636 · RFC 9700 §2.1.1',
  },
  {
    id: 'code-verifier',
    term: 'code_verifier',
    definition:
      'Chaîne aléatoire de 43 à 128 caractères (alphabet non réservé) générée par le Client au début du flow PKCE, gardée secrète jusqu’à l’échange au token endpoint.',
    specRef: 'RFC 7636 §4.1',
  },
  {
    id: 'code-challenge',
    term: 'code_challenge',
    definition:
      'L’empreinte du code_verifier envoyée dans l’authorization request : BASE64URL(SHA-256(code_verifier)) avec la méthode S256. La méthode « plain » (challenge = verifier) est interdite sauf impossibilité technique.',
    specRef: 'RFC 7636 §4.2',
  },
  {
    id: 'front-channel',
    term: 'Front channel',
    definition:
      'Communication qui transite PAR le navigateur (redirections, URL, fragments) : observable dans l’historique, les logs, les referers, et manipulable par l’utilisateur ou un poste compromis. Tout ce qui y passe doit être considéré comme exposé.',
    specRef: 'RFC 6749 §1.5 (usage)',
    naming:
      'Terme d’usage, pas défini formellement dans la RFC 6749 — ce qui ne l’empêche pas d’être LA grille de lecture de tout le protocole.',
  },
  {
    id: 'back-channel',
    term: 'Back channel',
    definition:
      'Communication directe de serveur à serveur (Client → AS, Client → RS) : TLS, authentifiée, invisible du navigateur. C’est là que doivent circuler les secrets et les tokens.',
    specRef: 'RFC 6749 §1.5 (usage)',
  },
  {
    id: 'authorization-endpoint',
    term: 'Authorization endpoint',
    definition:
      'L’endpoint de l’AS (front channel) où le navigateur porte l’authorization request, où l’utilisateur s’authentifie et consent. Réponse : une redirection vers la redirect_uri.',
    specRef: 'RFC 6749 §3.1',
  },
  {
    id: 'token-endpoint',
    term: 'Token endpoint',
    definition:
      'L’endpoint de l’AS (back channel) où le Client, authentifié s’il est confidentiel, échange un grant (code, refresh token, credentials) contre des tokens.',
    specRef: 'RFC 6749 §3.2',
  },
  {
    id: 'jwt',
    term: 'JWT',
    expansion: 'JSON Web Token',
    definition:
      'Format de token structuré : trois segments base64url séparés par des points — header (métadonnées de signature), payload (claims), signature. Se LIT sans clé ; ne se VÉRIFIE qu’avec la clé publique de l’émetteur.',
    specRef: 'RFC 7519',
  },
  {
    id: 'claim',
    term: 'claim',
    definition:
      'Une « déclaration » portée par un JWT : paire nom/valeur du payload (iss, sub, aud, exp…). Les claims enregistrés sont au registre IANA ; le profil access token JWT en normalise l’usage.',
    specRef: 'RFC 7519 §4 · RFC 9068',
  },
  {
    id: 'opaque-token',
    term: 'Opaque token',
    definition:
      'Token sans structure lisible : une simple référence aléatoire, que seul l’émetteur sait résoudre (lookup interne ou introspection). Avantage : révocation immédiate et aucune donnée exposée ; coût : un aller-retour vers l’AS pour valider.',
    specRef: 'RFC 7662 (introspection)',
  },
  {
    id: 'introspection',
    term: 'Token introspection',
    definition:
      'Endpoint de l’AS où un Resource Server soumet un token (opaque ou non) et reçoit son état : actif ou non, scope, sub, exp… C’est la validation « en ligne », par opposition à la vérification locale de signature d’un JWT.',
    specRef: 'RFC 7662',
  },
  {
    id: 'revocation',
    term: 'Token revocation',
    definition:
      'Endpoint où le Client notifie l’AS qu’un token (access ou refresh) n’est plus nécessaire — déconnexion, compromission. La révocation d’un refresh token doit entraîner celle des access tokens associés.',
    specRef: 'RFC 7009',
  },
  {
    id: 'implicit-grant',
    term: 'Implicit grant',
    definition:
      'Flow historique où l’access token était renvoyé directement dans le fragment d’URL (#access_token=…) au navigateur, sans passage par le token endpoint. Déprécié : le token s’exposait dans le front channel, sans authentification du Client ni preuve d’intégrité. Retiré d’OAuth 2.1.',
    specRef: 'RFC 6749 §4.2 · RFC 9700 §2.1.2',
    naming:
      '« Implicit » désignait l’absence d’étape d’échange explicite — le nom ne dit rien du risque, le flow disait tout.',
  },
  {
    id: 'ropc',
    term: 'Resource Owner Password Credentials (ROPC)',
    definition:
      'Flow historique où l’utilisateur donnait son mot de passe AU CLIENT, qui l’échangeait contre des tokens. Il réintroduit exactement l’anti-pattern qu’OAuth2 devait éliminer. Interdit par le Security BCP, retiré d’OAuth 2.1.',
    specRef: 'RFC 6749 §4.3 · RFC 9700 §2.4',
  },
  {
    id: 'client-credentials',
    term: 'Client Credentials grant',
    definition:
      'Flow machine-à-machine : le Client s’authentifie au token endpoint et obtient un token en son nom propre, sans utilisateur ni consentement. Pas de refresh token — le Client peut se ré-authentifier quand il veut.',
    specRef: 'RFC 6749 §4.4',
  },
  {
    id: 'device-grant',
    term: 'Device Authorization Grant',
    definition:
      'Flow pour appareils sans navigateur ou sans clavier (TV, CLI, IoT) : l’appareil affiche un user_code et une URL, l’utilisateur autorise depuis un second appareil, pendant que le premier interroge (polling) le token endpoint.',
    specRef: 'RFC 8628',
  },
  {
    id: 'dpop',
    term: 'DPoP',
    expansion: 'Demonstrating Proof of Possession',
    definition:
      'Mécanisme applicatif liant les tokens à une paire de clés détenue par le Client : chaque requête porte un header DPoP, un JWT signé prouvant la possession de la clé privée (avec méthode, URI, horodatage, et hash de l’access token). Un token volé sans la clé est inerte.',
    specRef: 'RFC 9449',
  },
  {
    id: 'mtls',
    term: 'mTLS (certificate-bound tokens)',
    definition:
      'Alternative à DPoP au niveau transport : le token est lié au certificat TLS client (empreinte dans le claim cnf/x5t#S256). Robuste mais exige une PKI côté clients — DPoP est plus simple à déployer pour le web.',
    specRef: 'RFC 8705',
  },
  {
    id: 'mix-up',
    term: 'Mix-up attack',
    definition:
      'Attaque multi-AS : un AS malveillant (ou compromis) amène le Client à envoyer le code ou les credentials destinés à un AS honnête vers l’attaquant. Contre-mesure : l’AS renvoie son identité (paramètre iss) dans la réponse d’autorisation, et le Client la vérifie.',
    specRef: 'RFC 9207 · RFC 9700 §4.4',
  },
  {
    id: 'open-redirect',
    term: 'Open redirect',
    definition:
      'Utilisation d’un endpoint de redirection insuffisamment validé pour renvoyer le navigateur (et ce qu’il porte : code, tokens) vers une destination choisie par l’attaquant. Se prévient par la correspondance exacte des redirect_uri.',
    specRef: 'RFC 9700 §4.11',
  },
  {
    id: 'csrf',
    term: 'CSRF',
    expansion: 'Cross-Site Request Forgery',
    definition:
      'Attaque où le navigateur de la victime est amené à effectuer une requête à son insu — ici, terminer un flow OAuth avec le code de l’ATTAQUANT, pour lier le compte de la victime aux ressources de l’attaquant. Contre-mesures : state (et/ou PKCE, qui couvre aussi ce cas).',
    specRef: 'RFC 6749 §10.12 · RFC 9700 §4.7',
  },
  {
    id: 'oauth21',
    term: 'OAuth 2.1',
    definition:
      'Consolidation en cours de standardisation : OAuth 2.0 + les obligations du Security BCP, moins ce qui est déprécié. Retirés : implicit, ROPC, bearer en query string. Obligatoires : PKCE partout, redirect_uri en correspondance exacte.',
    specRef: 'draft-ietf-oauth-v2-1',
  },
  {
    id: 'security-bcp',
    term: 'OAuth 2.0 Security BCP',
    definition:
      'Les meilleures pratiques de sécurité actuelles pour OAuth 2.0 : le document qui acte vingt ans de leçons — PKCE généralisé, fin d’implicit et de ROPC, exact matching, sender-constrained tokens recommandés.',
    specRef: 'RFC 9700',
  },
  {
    id: 'par',
    term: 'PAR',
    expansion: 'Pushed Authorization Requests',
    definition:
      'Le Client pousse les paramètres de l’authorization request directement à l’AS (back channel, authentifié) et reçoit une request_uri à usage unique : l’URL du front channel ne porte plus que cette référence. Répond aux manipulations de paramètres dans le navigateur.',
    specRef: 'RFC 9126',
  },
  {
    id: 'jar',
    term: 'JAR',
    expansion: 'JWT-Secured Authorization Request',
    definition:
      'L’authorization request devient un JWT signé (request object) : intégrité et authenticité des paramètres, même en front channel. Souvent combiné avec PAR.',
    specRef: 'RFC 9101',
  },
  {
    id: 'rar',
    term: 'RAR',
    expansion: 'Rich Authorization Requests',
    definition:
      'Remplace la granularité pauvre des scopes par un paramètre authorization_details structuré en JSON : « virement de 50 € vers IBAN X » au lieu de « payments ». Le consentement devient précis et auditable.',
    specRef: 'RFC 9396',
  },
  {
    id: 'iss-response',
    term: 'iss (authorization response)',
    definition:
      'Paramètre ajouté à la réponse d’autorisation identifiant l’AS émetteur ; le Client compare avec l’AS attendu. Contre-mesure au mix-up attack.',
    specRef: 'RFC 9207',
  },
  {
    id: 'api-key',
    term: 'API key',
    definition:
      'Secret statique identifiant un appelant auprès d’une API. Comparée à OAuth2 : pas de périmètre fin, pas d’expiration native, pas d’identité utilisateur, révocation = rotation manuelle. Acceptable entre machines de confiance, inadaptée à la délégation.',
    specRef: '(pratique d’industrie, hors spec)',
  },
]

export const glossaryById = new Map(glossary.map((e) => [e.id, e]))

export function getGlossaryEntry(id: string): GlossaryEntry | undefined {
  return glossaryById.get(id)
}
