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

  {
    id: 'oidc',
    term: 'OpenID Connect (OIDC)',
    definition:
      'Couche d’identité au-dessus d’OAuth 2.0 : elle réutilise l’Authorization Code Flow et ajoute un jeton d’identité (l’ID Token), un endpoint UserInfo et la Discovery. Là où OAuth2 délègue l’ACCÈS, OIDC prouve l’IDENTITÉ.',
    specRef: 'OIDC Core 1.0 §1',
  },
  {
    id: 'id-token',
    term: 'ID Token',
    definition:
      'JWT signé émis par l’OpenID Provider qui atteste d’un événement d’authentification. Claims obligatoires : iss, sub, aud, exp, iat. Son audience (aud) est le RP lui-même — ce n’est pas un laissez-passer pour une API.',
    specRef: 'OIDC Core 1.0 §2',
    naming:
      'Bien nommé, pour une fois : c’est un jeton (Token) d’identité (ID). À ne pas confondre avec l’access token, qui n’atteste d’aucune identité.',
  },
  {
    id: 'openid-provider',
    term: 'OpenID Provider (OP)',
    definition:
      'L’Authorization Server OAuth2 quand il parle OIDC : il authentifie l’utilisateur et émet l’ID Token. Google, Microsoft Entra ID, Keycloak… jouent ce rôle.',
    specRef: 'OIDC Core 1.0 §1.2',
    actorRole: 'authorization-server',
  },
  {
    id: 'relying-party',
    term: 'Relying Party (RP)',
    definition:
      'Le Client OAuth2 quand il consomme des identités OIDC : il « s’appuie » (relies) sur l’OP pour authentifier l’utilisateur, puis valide l’ID Token reçu.',
    specRef: 'OIDC Core 1.0 §1.2',
    actorRole: 'client',
    naming:
      '« Relying Party » vient du monde de la fédération (SAML). Concrètement, c’est votre application — le même acteur que le « Client » OAuth2.',
  },
  {
    id: 'nonce',
    term: 'nonce',
    expansion: 'number used once',
    definition:
      'Valeur imprévisible générée par le RP au début du flow et liée à sa session ; l’OP la recopie dans l’ID Token, et le RP vérifie qu’elle correspond. Empêche le rejeu et l’injection d’un ID Token. OPTIONAL en code flow, REQUIRED en implicit.',
    specRef: 'OIDC Core 1.0 §3.1.2.1',
    naming:
      'Cousin du state, mais cible différente : state protège le callback (le code), nonce protège l’ID Token. Même besoin — imprévisibilité — deux emplacements.',
  },
  {
    id: 'userinfo',
    term: 'UserInfo Endpoint',
    definition:
      'Ressource OAuth2 protégée qui renvoie des claims sur l’utilisateur, appelée avec l’ACCESS token (Bearer). Sa réponse contient un sub que le RP DOIT comparer à celui de l’ID Token, sous peine de rejet.',
    specRef: 'OIDC Core 1.0 §5.3',
  },
  {
    id: 'jwks',
    term: 'JWKS',
    expansion: 'JSON Web Key Set',
    definition:
      'Ensemble de clés publiques publié par l’OP (à l’URL jwks_uri), servant à vérifier la signature des ID Tokens. Chaque clé porte un kid ; la rotation consiste à publier la nouvelle clé à côté de l’ancienne.',
    specRef: 'RFC 7517',
  },
  {
    id: 'kid',
    term: 'kid',
    expansion: 'key ID',
    definition:
      'Identifiant de clé, présent dans le header JWS et dans chaque clé du JWKS. Il permet au RP de choisir LA bonne clé publique pour vérifier, et rend la rotation gérable. Il n’apporte aucune confiance par lui-même.',
    specRef: 'RFC 7515 §4.1.4',
  },
  {
    id: 'discovery',
    term: 'OpenID Provider Discovery',
    definition:
      'Mécanisme par lequel un RP récupère la configuration de l’OP (endpoints, algorithmes, jwks_uri) à l’URL /.well-known/openid-configuration dérivée de l’issuer — au lieu de tout coder en dur.',
    specRef: 'OIDC Discovery 1.0 §4',
  },
  {
    id: 'issuer',
    term: 'issuer (iss)',
    definition:
      'Identifiant de l’OP, sous forme d’URL https. Il ancre la confiance : il doit être identique dans le document de Discovery, dans le claim iss des ID Tokens, et à l’URL utilisée pour la Discovery.',
    specRef: 'OIDC Core 1.0 §2',
  },
  {
    id: 'sub',
    term: 'sub (subject)',
    definition:
      'Identifiant de l’utilisateur, localement unique chez l’OP et jamais réattribué, ≤ 255 caractères ASCII. La clé d’identité robuste est le COUPLE (iss, sub) : sub seul n’est unique qu’au sein d’un OP donné.',
    specRef: 'OIDC Core 1.0 §2',
  },
  {
    id: 'at-hash',
    term: 'at_hash',
    expansion: 'access token hash',
    definition:
      'Claim de l’ID Token = base64url de la MOITIÉ GAUCHE de SHA-256(access_token). Il lie l’ID Token à l’access token de la même réponse, empêchant d’apparier un ID Token à un access token d’une autre provenance.',
    specRef: 'OIDC Core 1.0 §3.1.3.6',
  },
  {
    id: 'jws',
    term: 'JWS',
    expansion: 'JSON Web Signature',
    definition:
      'La brique de SIGNATURE des JWT : header.payload.signature en base64url. Un ID Token est un JWS. La signature ES256 est le concaténé brut r‖s (64 octets), vérifié sur les octets ASCII de « header.payload ».',
    specRef: 'RFC 7515',
  },
  {
    id: 'jwe',
    term: 'JWE',
    expansion: 'JSON Web Encryption',
    definition:
      'La brique de CHIFFREMENT des JWT (cinq segments), pour rendre un jeton illisible sauf au destinataire. Rare pour les ID Tokens en pratique : la signature (JWS) suffit à la plupart des besoins. À distinguer strictement de la signature.',
    specRef: 'RFC 7516',
    naming:
      'JWS signe (intégrité + origine), JWE chiffre (confidentialité). Signer ≠ chiffrer : confusion classique. Un JWT « normal » est signé, pas chiffré — donc lisible par tous.',
  },
  {
    id: 'saml',
    term: 'SAML 2.0',
    definition:
      'Standard de fédération d’identité antérieur (2005), fondé sur des assertions XML signées et le navigateur comme relais (POST binding). Toujours répandu en entreprise. OIDC vise le même objectif avec du JSON/JWT, pensé pour les API, le mobile et les SPA.',
    specRef: 'OASIS SAML 2.0',
  },

  {
    id: 'holder',
    term: 'Holder',
    definition:
      'La personne (ou l’entité) qui détient des credentials dans son wallet et décide quand et à qui les présenter. Troisième sommet du triangle, absent du modèle fédéré : c’est lui qui reprend le contrôle du flux.',
    specRef: 'OID4VCI 1.0 §3',
    actorRole: 'user',
  },
  {
    id: 'wallet',
    term: 'Wallet',
    definition:
      'L’application qui stocke les credentials du Holder, gère ses clés (idéalement en matériel sécurisé) et parle les protocoles OID4VCI (émission) et OID4VP (présentation). Dans eIDAS 2.0 : l’EUDI Wallet.',
    specRef: 'OID4VCI 1.0 §3',
    actorRole: 'wallet',
  },
  {
    id: 'credential-issuer',
    term: 'Credential Issuer',
    definition:
      'L’entité qui émet des credentials signés : État, université, employeur, banque… Techniquement, un serveur OAuth2 augmenté d’un Credential Endpoint (et d’un Nonce Endpoint). Il n’est PAS contacté lors des présentations.',
    specRef: 'OID4VCI 1.0 §3',
    actorRole: 'issuer',
  },
  {
    id: 'verifiable-credential',
    term: 'Verifiable Credential',
    definition:
      'Un ensemble de claims sur le Holder, signé par l’Issuer, vérifiable cryptographiquement par quiconque possède les clés publiques de l’émetteur — sans le contacter. Formats principaux ici : SD-JWT VC et mdoc.',
    specRef: 'OID4VCI 1.0 §3',
  },
  {
    id: 'credential-offer',
    term: 'Credential Offer',
    definition:
      'Le point d’entrée de l’émission : un objet JSON (souvent porté par un QR code) indiquant credential_issuer, credential_configuration_ids et les grants disponibles — dont le pre-authorized code.',
    specRef: 'OID4VCI 1.0 §4.1',
  },
  {
    id: 'pre-authorized-code',
    term: 'Pre-Authorized Code',
    definition:
      'Grant OAuth2 dédié (urn:ietf:params:oauth:grant-type:pre-authorized_code) : l’Issuer, ayant DÉJÀ identifié l’utilisateur, remet un code que le wallet échange directement contre un access token — sans étape d’authentification pilotée par le wallet.',
    specRef: 'OID4VCI 1.0 §4.1.1',
  },
  {
    id: 'tx-code',
    term: 'tx_code',
    expansion: 'Transaction Code',
    definition:
      'Code court (souvent numérique) transmis au Holder par un canal SÉPARÉ (SMS, e-mail) et exigé au token endpoint avec le pre-authorized code. Défense contre l’interception de l’offer : photographier le QR ne suffit pas.',
    specRef: 'OID4VCI 1.0 §4.1.1',
  },
  {
    id: 'c-nonce',
    term: 'c_nonce',
    definition:
      'Nonce fourni par le Nonce Endpoint dédié de l’Issuer (nouveauté de la 1.0 finale), que le wallet inclut dans son proof. Lie la preuve de possession de clé à UN flow d’émission précis — anti-rejeu.',
    specRef: 'OID4VCI 1.0 §7',
  },
  {
    id: 'jwt-proof',
    term: 'jwt proof',
    definition:
      'Preuve de possession de clé : un JWT au typ openid4vci-proof+jwt, signé par la clé privée du wallet, portant aud (l’Issuer), iat et nonce (le c_nonce), la clé publique voyageant dans le header jwk. L’Issuer liera le credential à cette clé.',
    specRef: 'OID4VCI 1.0 App. F.1',
  },
  {
    id: 'cnf',
    term: 'cnf',
    expansion: 'confirmation',
    definition:
      'Claim du credential (hérité de RFC 7800) contenant la clé publique du wallet prouvée à l’émission. C’est l’ancrage du key binding : présenter le credential exigera de signer avec la clé privée correspondante.',
    specRef: 'RFC 7800 · draft-ietf-oauth-sd-jwt-vc',
  },
  {
    id: 'sd-jwt',
    term: 'SD-JWT',
    expansion: 'Selective Disclosure JWT',
    definition:
      'Extension du JWT pour la divulgation sélective : les claims cachables sont remplacés dans le jeton signé par des hachages salés (_sd, _sd_alg), et transmis à côté sous forme de disclosures que le Holder choisit de révéler… ou pas.',
    specRef: 'draft-ietf-oauth-selective-disclosure-jwt',
  },
  {
    id: 'disclosure',
    term: 'Disclosure',
    definition:
      'Le triplet [salt, nom, valeur] encodé en base64url, transmis hors du JWT signé. Son digest SHA-256 figure dans _sd : révéler la disclosure permet de vérifier le claim ; la retenir le garde secret sans casser la signature.',
    specRef: 'draft-ietf-oauth-selective-disclosure-jwt',
  },
  {
    id: 'sd-jwt-vc',
    term: 'SD-JWT VC',
    definition:
      'Profil de credential fondé sur SD-JWT : typ dc+sd-jwt (renommé depuis vc+sd-jwt en nov. 2024), claim vct obligatoire (le type du credential), cnf pour le key binding. Format retenu pour le PID de l’EUDI Wallet.',
    specRef: 'draft-ietf-oauth-sd-jwt-vc',
  },
  {
    id: 'vct',
    term: 'vct',
    expansion: 'verifiable credential type',
    definition:
      'Claim REQUIRED du SD-JWT VC : identifiant (résistant aux collisions, souvent une URL) du TYPE de credential — « attestation d’identité », « diplôme »… L’équivalent du doctype côté mdoc.',
    specRef: 'draft-ietf-oauth-sd-jwt-vc',
  },
  {
    id: 'mdoc',
    term: 'mdoc / mDL',
    definition:
      'Format de credential de l’ISO/IEC 18013-5 (permis de conduire mobile), encodé en CBOR/COSE, organisé par doctype (ex. org.iso.18013.5.1.mDL) et namespaces. Dans OID4VCI, son Format Identifier est mso_mdoc. Second format du monde EUDI.',
    specRef: 'ISO/IEC 18013-5 · OID4VCI 1.0 App. A.2',
  },
  {
    id: 'key-attestation',
    term: 'Key attestation',
    definition:
      'Preuve, signée par une autorité de confiance (fabricant, wallet provider), que la clé du wallet réside dans un environnement sécurisé donné (Secure Enclave, WSCD…). OID4VCI 1.0 la porte via un proof type dédié « attestation ». Au-delà de « je contrôle la clé » : « ma clé est bien gardée ».',
    specRef: 'OID4VCI 1.0 App. D & F.3',
  },
  {
    id: 'eudi-wallet',
    term: 'EUDI Wallet',
    expansion: 'European Digital Identity Wallet',
    definition:
      'Le portefeuille d’identité numérique que chaque État membre de l’UE doit proposer sous eIDAS 2.0 (règlement (UE) 2024/1183). Il transporte le PID et des attestations (QEAA/EAA) aux formats SD-JWT VC et mdoc, via OID4VCI/OID4VP — les protocoles de ce cours.',
    specRef: 'Règlement (UE) 2024/1183 · ARF',
  },
  {
    id: 'phone-home',
    term: '« Phone home »',
    definition:
      'Le défaut structurel du modèle fédéré : chaque connexion repasse par l’IdP, qui apprend où et quand vous vous connectez. Le triangle Issuer/Holder/Verifier le supprime par construction : l’émetteur n’est pas contacté lors des présentations.',
    specRef: '(propriété d’architecture — motivation d’eIDAS 2.0)',
  },

  {
    id: 'verifier',
    term: 'Verifier',
    definition:
      'L’entité qui demande et vérifie une présentation : un site, un guichet, un contrôle. Côté protocole, c’est un Client OAuth2 qui envoie une Authorization Request au wallet — et que le WALLET doit authentifier avant tout consentement.',
    specRef: 'OID4VP 1.0 §2',
    actorRole: 'verifier',
  },
  {
    id: 'vp-token',
    term: 'vp_token',
    definition:
      'Le paramètre de réponse d’OID4VP : un objet JSON dont les clés sont les ids des Credential Queries DCQL et les valeurs des tableaux de présentations (ex. SD-JWT+KB). La réponse est structurée par la requête qui l’a demandée.',
    specRef: 'OID4VP 1.0 §8.1',
  },
  {
    id: 'dcql',
    term: 'DCQL',
    expansion: 'Digital Credentials Query Language',
    definition:
      'Le langage de requête d’OID4VP 1.0 (paramètre dcql_query) : credentials[] avec id, format, meta (ex. vct_values), claims[{path}], claim_sets, trusted_authorities, et credential_sets pour les alternatives. Il a entièrement remplacé Presentation Exchange dans la version finale.',
    specRef: 'OID4VP 1.0 §6',
  },
  {
    id: 'client-identifier-prefix',
    term: 'Client Identifier Prefix',
    definition:
      'Le mode d’identification du Verifier, porté en préfixe du client_id (« x509_san_dns:verifier.example ») : redirect_uri, openid_federation, decentralized_identifier, verifier_attestation, x509_san_dns, x509_hash — et origin (réservé DC API). Sans deux-points : client pré-enregistré.',
    specRef: 'OID4VP 1.0 §5.9.3',
    naming:
      'A remplacé l’ancien paramètre séparé client_id_scheme (drafts) — attention aux articles antérieurs à 2025.',
  },
  {
    id: 'kb-jwt',
    term: 'Key Binding JWT',
    definition:
      'Le JWT (typ kb+jwt, obligatoire) qui clôt une présentation SD-JWT : signé par la clé du cnf du credential, il porte iat, aud (le Verifier), nonce (le défi de la transaction) et sd_hash (l’empreinte de la présentation exacte). C’est lui qui rend une présentation volée irrejouable.',
    specRef: 'draft-ietf-oauth-selective-disclosure-jwt',
  },
  {
    id: 'sd-hash',
    term: 'sd_hash',
    definition:
      'Claim du KB-JWT : hachage (algorithme du _sd_alg, base64url) de la chaîne « <JWT signé>~<disclosures choisies>~ » — tilde final inclus. Il scelle EXACTEMENT ce qui est présenté : ajouter ou retirer une disclosure invalide le KB-JWT.',
    specRef: 'draft-ietf-oauth-selective-disclosure-jwt',
  },
  {
    id: 'direct-post',
    term: 'direct_post',
    definition:
      'Response mode d’OID4VP : le wallet POSTe la réponse (vp_token…) directement à la response_uri du Verifier, sans charger une redirection navigateur d’artefacts volumineux. La variante direct_post.jwt emballe la réponse dans un JWT signé et/ou chiffré.',
    specRef: 'OID4VP 1.0 §8.2-8.3',
  },
  {
    id: 'unlinkability',
    term: 'Unlinkability',
    definition:
      'Propriété visée : deux présentations d’une même personne ne doivent pas être corrélables — ni par l’émetteur (qui ne voit rien), ni entre Verifiers. Les ennemis concrets : signature du credential réutilisée, mêmes digests salés, mêmes identifiants. Les parades : émission par lots de credentials à usage limité, rotation.',
    specRef: 'OID4VP 1.0 (considérations vie privée) · ARF',
  },
  {
    id: 'dc-api',
    term: 'Digital Credentials API (DC API)',
    definition:
      'API du navigateur (W3C) par laquelle un site demande une présentation SANS QR ni deep link : le navigateur/OS route la requête vers les wallets installés. OID4VP la profile en annexe (client_id préfixé origin, fourni par le navigateur). L’avenir probable du flow same-device.',
    specRef: 'OID4VP 1.0 App. A · W3C Digital Credentials',
  },
  {
    id: 'haip',
    term: 'HAIP',
    expansion: 'High Assurance Interoperability Profile',
    definition:
      'Profil OpenID qui fige, parmi toutes les options d’OID4VCI/OID4VP, un sous-ensemble interopérable à haut niveau de garantie (formats, algorithmes, méthodes d’identification du Verifier…). C’est le genre de profil que les écosystèmes réels — dont l’EUDI — imposent par-dessus les specs de base.',
    specRef: 'OpenID HAIP (draft)',
  },
  {
    id: 'presentation',
    term: 'Presentation',
    definition:
      'Ce que le wallet remet au Verifier : pour SD-JWT VC, la chaîne <credential signé>~<disclosures choisies>~<KB-JWT>. Elle prouve trois choses à la fois : l’authenticité (signature Issuer), le contenu choisi (disclosures), la possession ici-et-maintenant (KB-JWT).',
    specRef: 'OID4VP 1.0 §2 · App. B.3',
  },
]

export const glossaryById = new Map(glossary.map((e) => [e.id, e]))

export function getGlossaryEntry(id: string): GlossaryEntry | undefined {
  return glossaryById.get(id)
}
