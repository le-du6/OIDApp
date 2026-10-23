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
      'Entité capable d’accorder l’accès à une ressource protégée. Lorsqu’il s’agit d’une personne, OAuth parle d’end-user. Le propriétaire de ressource et le client peuvent aussi être la même entité.',
    specRef: 'RFC 6749 §1.1',
    naming:
      'Personne ne dit « propriétaire de ressource » pour dire « vous ». Le nom est exact du point de vue du modèle, mais opaque pour un débutant.',
    actorRole: 'user',
  },
  {
    id: 'client',
    term: 'Client',
    definition:
      'Rôle logiciel qui demande un accès : backend, application web, native, CLI ou appareil. Sa capacité à protéger ses moyens d’authentification détermine son type public ou confidentiel.',
    specRef: 'RFC 6749 §1.1',
    naming:
      '« Client » évoque le navigateur ou le poste de l’utilisateur ; ici c’est l’application qui consomme l’API — y compris un backend. Client au sens « client de l’AS », pas « client de l’humain ».',
    actorRole: 'client',
  },
  {
    id: 'authorization-server',
    term: 'Authorization Server',
    definition:
      'Serveur qui émet les tokens après validation du grant. Dans les flows concernés il authentifie l’utilisateur, sans qu’OAuth impose la méthode. L’authentification du client est distincte.',
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
      'Grant désigne une autorisation exploitable par le client, pas nécessairement un consentement utilisateur interactif. RFC 9700 déconseille Implicit et interdit ROPC.',
  },
  {
    id: 'access-token',
    term: 'Access token',
    definition:
      'Jeton présenté au Resource Server pour accéder aux ressources. RFC 6749 ne fixe pas sa forme : opaque ou structuré, par exemple JWT selon RFC 9068. Sa durée de vie relève du serveur ; une durée courte limite l’exposition.',
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
      'Code opaque pour le client, éphémère et à usage unique, remis via le navigateur puis échangé au token endpoint. Dans notre architecture avec backend, seul le code traverse le navigateur. Une SPA peut aussi appeler directement le token endpoint.',
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
      'Destination enregistrée du retour navigateur. RFC 9700 exige une correspondance exacte, avec l’exception du port localhost des applications natives. Lorsqu’elle figure dans la demande de code, sa valeur est aussi vérifiée à l’échange du code.',
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
      'Secret partagé utilisé pour authentifier un client capable de le protéger. Un secret distribué dans une SPA ou une application native ne prouve pas l’identité d’une instance. PKCE lie une transaction au code ; il ne remplace pas l’authentification client.',
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
      'Valeur de corrélation liée à la session et comparée au retour. Protection CSRF classique ; PKCE ou nonce OIDC peuvent remplir ce rôle sous les conditions de RFC 9700. L’état applicatif peut être conservé localement derrière cette référence.',
    specRef: 'RFC 6749 §10.12 · RFC 9700 §2.1',
  },
  {
    id: 'pkce',
    term: 'PKCE',
    expansion: 'Proof Key for Code Exchange (« pixy »)',
    definition:
      'Liaison entre le code et un secret éphémère du client (verifier/challenge). RFC 9700 : requis pour les clients publics, recommandé pour les confidentiels. S256 est utilisé dans le cours. Ce mécanisme n’authentifie pas à lui seul un client enregistré.',
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
      'Échange passant par l’agent utilisateur, par exemple une redirection. Les valeurs peuvent être exposées au navigateur. Implicit livre historiquement un access token dans le fragment ; le code flow livre un code.',
    specRef: 'RFC 6749 §1.5 (usage)',
    naming:
      'Terme d’usage, pas défini formellement dans la RFC 6749 — ce qui ne l’empêche pas d’être LA grille de lecture de tout le protocole.',
  },
  {
    id: 'back-channel',
    term: 'Back channel',
    definition:
      'Appel direct entre acteurs, par exemple au token endpoint. Le client peut être un backend, une SPA ou un wallet. TLS authentifie le serveur ; l’authentification du client dépend de son type et du protocole.',
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
      'Conteneur JSON de claims, représenté par un JWS (signature ou MAC, trois segments en forme compacte) ou un JWE (chiffrement, cinq segments). Nos exemples JWS ES256 sont lisibles sans clé et vérifiés avec une clé publique de confiance.',
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
      'Token dont le client ne doit pas interpréter la structure. Le RS peut utiliser un stockage ou l’introspection ; la fraîcheur de révocation dépend des caches et du déploiement.',
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
      'Invalidation d’un token auprès de l’AS (RFC 7009). Révoquer les access tokens associés à un refresh token est une recommandation conditionnelle ; la prise en compte par les ressources dépend de leurs contrôles.',
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
      'Grant réservé aux clients confidentiels, qui s’authentifient et agissent pour leur propre compte ou dans un cadre convenu. Pas d’interaction utilisateur dans ce flow. La réponse ne devrait pas inclure de refresh token (SHOULD NOT).',
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
      'Preuve signée liant l’usage d’un token à une clé du client. Elle couvre méthode, URI, date et identifiant ; ath lie l’access token lors de l’accès à une ressource. Voler le token seul ne suffit pas si tous les contrôles sont appliqués ; il reste lisible.',
    specRef: 'RFC 9449',
  },
  {
    id: 'mtls',
    term: 'mTLS (certificate-bound tokens)',
    definition:
      'Les tokens liés à un certificat TLS client sont vérifiés en les rapprochant du certificat présenté sur la connexion. RFC 8705 distingue cette liaison de l’authentification du client ; une PKI publique n’est pas nécessaire dans tous les déploiements.',
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
      'Consolidation encore en draft (version 16, septembre 2026) : code flow avec PKCE, retrait d’Implicit et de ROPC, durcissement des redirections et des tokens. À distinguer de RFC 9700, qui est déjà le Security BCP OAuth 2.0.',
    specRef: 'draft-ietf-oauth-v2-1-16',
  },
  {
    id: 'security-bcp',
    term: 'OAuth 2.0 Security BCP',
    definition:
      'Pratiques de sécurité OAuth 2.0 : PKCE requis pour les clients publics et recommandé pour les confidentiels ; Implicit déconseillé ; ROPC interdit. Les exigences précises dépendent du flow et des capacités du client.',
    specRef: 'RFC 9700',
  },
  {
    id: 'par',
    term: 'PAR',
    expansion: 'Pushed Authorization Requests',
    definition:
      'Le client pousse sa demande à l’AS par un appel direct et reçoit une request_uri pour la redirection. L’authentification dépend du type et de l’enregistrement du client ; un client public peut utiliser PAR. La redirection contient notamment client_id et request_uri.',
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
      'Clé d’accès propre à un service. Sa portée, sa durée et sa révocation dépendent de ce service. OAuth définit un cadre interopérable de délégation ; toutes les API keys ne sont pas illimitées.',
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
      'Un ID Token fournit au RP un résultat d’authentification à valider. Un access token peut aussi contenir sub et aud, mais son contrat est l’accès à une ressource.',
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
      'Objet contenant un ensemble de clés JWK. Pour nos signatures asymétriques OIDC, les clés publiques viennent du jwks_uri d’un OP attendu. kid aide à la sélection et à la rotation ; il n’est pas une preuve de confiance.',
    specRef: 'RFC 7517',
  },
  {
    id: 'kid',
    term: 'kid',
    expansion: 'key ID',
    definition:
      'Identifiant optionnel de clé dans JOSE, utilisé pour choisir parmi les clés acceptables. Il peut faciliter la rotation et doit être interprété dans le contexte du profil ; sa présence ne rend pas une clé fiable.',
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
      'Empreinte de l’access token : moitié gauche du hash associé à alg, encodée en base64url. SHA-256 dans notre exemple ES256. Optionnel au token endpoint en code flow ; conditions différentes en Implicit/Hybrid.',
    specRef: 'OIDC Core 1.0 §3.1.3.6',
  },
  {
    id: 'jws',
    term: 'JWS',
    expansion: 'JSON Web Signature',
    definition:
      'Protection d’un contenu par signature ou MAC. La forme compacte a trois segments. Nos signatures ES256 portent sur header.payload et sont représentées par r‖s (64 octets). JWS ne chiffre pas le contenu.',
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
      'Rôle qui émet des credentials. Son Credential Endpoint est protégé par OAuth ; le ou les Authorization Servers peuvent être distincts. Le Nonce Endpoint dépend du service. Une présentation peut nécessiter d’autres accès pour les clés ou le statut.',
    specRef: 'OID4VCI 1.0 §3',
    actorRole: 'issuer',
  },
  {
    id: 'verifiable-credential',
    term: 'Verifiable Credential',
    definition:
      'Claims sur un sujet, protégés selon un format vérifiable. Le sujet et le détenteur ne sont pas nécessairement identiques. Signature valide, confiance dans l’émetteur, statut et binding sont des contrôles distincts. Formats illustrés : SD-JWT VC et mdoc.',
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
      'Code d’émission pour une autorisation obtenue en amont, échangé au token endpoint avec le grant urn:ietf:params:oauth:grant-type:pre-authorized_code. Il évite une redirection d’autorisation pendant cet échange ; l’identification préalable dépend du contexte.',
    specRef: 'OID4VCI 1.0 §4.1.1',
  },
  {
    id: 'tx-code',
    term: 'tx_code',
    expansion: 'Transaction Code',
    definition:
      'Code additionnel si l’offre l’exige, transmis par un canal convenu et saisi au token endpoint. Il réduit le risque lié au vol du seul pre-authorized code ; séparation des canaux et limitation des essais comptent.',
    specRef: 'OID4VCI 1.0 §4.1.1',
  },
  {
    id: 'c-nonce',
    term: 'c_nonce',
    definition:
      'Nonce fourni par le Credential Issuer et repris dans la preuve d’émission. Son acceptation et sa durée relèvent de l’Issuer ; il n’est pas intrinsèquement unique par transaction ni à usage unique.',
    specRef: 'OID4VCI 1.0 §7',
  },
  {
    id: 'jwt-proof',
    term: 'jwt proof',
    definition:
      'Preuve jwt d’émission : typ openid4vci-proof+jwt, aud vers l’Issuer, iat, référence de clé et nonce si l’Issuer expose un Nonce Endpoint. Prouve le contrôle d’une clé, pas à elle seule le droit de recevoir un credential.',
    specRef: 'OID4VCI 1.0 App. F.1',
  },
  {
    id: 'cnf',
    term: 'cnf',
    expansion: 'confirmation',
    definition:
      'Claim de confirmation qui lie un jeton à une clé ou une référence de clé. Notre credential contient cnf.jwk pour vérifier un KB-JWT ; un token DPoP peut porter cnf.jkt. La liaison signée doit être validée avant d’utiliser cette clé.',
    specRef: 'RFC 7800 · draft-ietf-oauth-sd-jwt-vc',
  },
  {
    id: 'sd-jwt',
    term: 'SD-JWT',
    expansion: 'Selective Disclosure JWT',
    definition:
      'Extension du JWT pour la divulgation sélective : les claims cachables sont remplacés dans le jeton signé par des hachages salés (_sd, _sd_alg), et transmis à côté sous forme de disclosures que le Holder choisit de révéler… ou pas.',
    specRef: 'RFC 9901',
  },
  {
    id: 'disclosure',
    term: 'Disclosure',
    definition:
      'Donnée sélective encodée en base64url : [sel, nom, valeur] pour un membre d’objet, [sel, valeur] pour un élément de tableau. Son digest est protégé par le SD-JWT ; notre profil utilise SHA-256 et des membres simples.',
    specRef: 'RFC 9901',
  },
  {
    id: 'sd-jwt-vc',
    term: 'SD-JWT VC',
    definition:
      'Profil de credential fondé sur SD-JWT : typ dc+sd-jwt, vct pour le type et cnf en cas de binding cryptographique. vc+sd-jwt est historique ; le draft 19 a retiré la note transitoire de double acceptation. mdoc constitue un autre format.',
    specRef: 'draft-ietf-oauth-sd-jwt-vc-19',
  },
  {
    id: 'vct',
    term: 'vct',
    expansion: 'verifiable credential type',
    definition:
      'Claim REQUIRED du SD-JWT VC : identifiant (résistant aux collisions, souvent une URL) du TYPE de credential — « attestation d’identité », « diplôme »… L’équivalent du doctype côté mdoc.',
    specRef: 'draft-ietf-oauth-sd-jwt-vc-19',
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
      'Attestation signée par un tiers reconnu sur une ou plusieurs clés et leurs propriétés. Le proof jwt peut l’inclure et signer avec une clé attestée ; le proof attestation peut fonctionner sans cette signature de possession.',
    specRef: 'OID4VCI 1.0 App. D & F.3',
  },
  {
    id: 'eudi-wallet',
    term: 'EUDI Wallet',
    expansion: 'European Digital Identity Wallet',
    definition:
      'Portefeuille européen d’identité numérique dans le cadre eIDAS révisé. PID, attestations, protocoles, formats et certification relèvent de couches distinctes. Le cours présente les concepts, sans évaluer une conformité réglementaire.',
    specRef: 'Règlement (UE) 2024/1183 · ARF',
  },
  {
    id: 'phone-home',
    term: '« Phone home »',
    definition:
      'Contact avec l’émetteur lors d’un usage, susceptible de révéler des métadonnées. Une nouvelle authentification OIDC contacte l’OP ; une session applicative ne le fait pas à chaque action. Le modèle wallet réduit ce besoin sans exclure statut ou collusion.',
    specRef: '(propriété d’architecture — motivation d’eIDAS 2.0)',
  },

  {
    id: 'verifier',
    term: 'Verifier',
    definition:
      'Entité qui demande et vérifie une présentation. Les contrôles d’identification dépendent du préfixe et du parcours. Notre exemple x509_san_dns valide un certificat et un Request Object ; redirect_uri et certaines requêtes DC API ont d’autres règles.',
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
      'Préfixe de client_id indiquant comment identifier le Verifier. origin: est réservé à l’audience de présentation via DC API et ne doit pas être accepté comme préfixe dans la requête. client_id_scheme appartient aux anciens drafts.',
    specRef: 'OID4VP 1.0 §5.9.3',
    naming:
      'A remplacé l’ancien paramètre séparé client_id_scheme (drafts) — attention aux articles antérieurs à 2025.',
  },
  {
    id: 'kb-jwt',
    term: 'Key Binding JWT',
    definition:
      'Preuve de détenteur SD-JWT signée avec la clé liée dans cnf. typ kb+jwt et claims iat, aud, nonce, sd_hash lient cette présentation au contexte. Exigée dans le parcours du cours ; les contrôles et la consommation de transaction sont nécessaires contre le rejeu.',
    specRef: 'RFC 9901',
  },
  {
    id: 'sd-hash',
    term: 'sd_hash',
    definition:
      'Hash des octets exacts de la partie <JWT>~<disclosures choisies>~, tilde final inclus. Modifier cette partie fait échouer la comparaison sd_hash même si la signature du KB-JWT reste valide.',
    specRef: 'RFC 9901',
  },
  {
    id: 'direct-post',
    term: 'direct_post',
    definition:
      'Réponse du wallet par POST form à response_uri. vp_token contient un objet JSON indexé par les identifiants DCQL. direct_post.jwt transporte la réponse chiffrée selon OID4VP §8.3.',
    specRef: 'OID4VP 1.0 §8.2-8.3',
  },
  {
    id: 'unlinkability',
    term: 'Unlinkability',
    definition:
      'Impossibilité visée de corréler des présentations au-delà des attributs révélés. Signatures, digests, clés publiques, temps précis, statut et combinaisons de claims peuvent corréler ; les lots ne suffisent pas à eux seuls.',
    specRef: 'OID4VP 1.0 (considérations vie privée) · ARF',
  },
  {
    id: 'dc-api',
    term: 'Digital Credentials API (DC API)',
    definition:
      'API du navigateur pour demander des credentials via l’environnement système. OID4VP annexe A utilise l’origine fournie par cet environnement pour l’audience origin: de présentation ; ce n’est pas un client_id origin: dans la requête.',
    specRef: 'OID4VP 1.0 App. A · W3C Digital Credentials',
  },
  {
    id: 'haip',
    term: 'HAIP',
    expansion: 'High Assurance Interoperability Profile',
    definition:
      'Profil OpenID 1.0 Final (24 décembre 2025) sélectionnant des exigences d’interopérabilité pour OID4VCI, OID4VP, SD-JWT VC et mdoc. Sa mise en œuvre ne suffit pas, à elle seule, à établir la conformité eIDAS au niveau d’assurance élevé.',
    specRef: 'OpenID4VC HAIP 1.0 Final §1 et §3',
  },
  {
    id: 'presentation',
    term: 'Presentation',
    definition:
      'Ce que le wallet remet au Verifier. Pour notre SD-JWT VC lié à une clé : credential signé, disclosures choisies et KB-JWT. L’acceptation exige confiance, signatures, contexte et adéquation à la demande ; le format seul ne les garantit pas.',
    specRef: 'OID4VP 1.0 §2 et annexe B.1',
  },
]

export const glossaryById = new Map(glossary.map((e) => [e.id, e]))

export function getGlossaryEntry(id: string): GlossaryEntry | undefined {
  return glossaryById.get(id)
}
