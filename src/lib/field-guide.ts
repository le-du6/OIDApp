/** Convention éditoriale commune ; annotations explicatives, jamais des règles de validation. */
export type FieldGuide = {
  description: string
  type: string
  producer: string
  recipient: string
  origin: string
  check: string
  requirement: string
  sensitivity: string
  retention: string
  specRef: string
}
export type JwtContext = 'id-token' | 'credential' | 'vci-proof' | 'kb-jwt' | 'dpop' | 'jwt'
const contexts: Record<
  JwtContext,
  { producer: string; recipient: string; spec: string; key: string }
> = {
  'id-token': {
    producer: 'OpenID Provider',
    recipient: 'Relying Party identifié par aud',
    spec: 'OIDC Core §2 et §3.1.3.7',
    key: 'Clé de l’OP attendu, obtenue par une configuration de confiance (par exemple Discovery puis JWKS). kid ne crée pas la confiance.',
  },
  credential: {
    producer: 'Credential Issuer',
    recipient: 'Wallet, puis Verifier lors de la présentation',
    spec: 'SD-JWT VC draft 19 §2 ; RFC 9901',
    key: 'Clé de l’Issuer reconnu par la politique du Verifier. cnf.jwk est la clé du détenteur, pas celle qui signe le credential.',
  },
  'vci-proof': {
    producer: 'Wallet',
    recipient: 'Credential Issuer désigné par aud',
    spec: 'OID4VCI 1.0 annexe F.1',
    key: 'Clé désignée dans le header (jwk dans notre exemple). Sa signature prouve la possession ; l’autorisation d’émettre vient séparément du token et de la politique.',
  },
  'kb-jwt': {
    producer: 'Wallet détenteur de la clé',
    recipient: 'Verifier désigné par aud',
    spec: 'RFC 9901 §4.3 et §7.3 ; OID4VP annexe B.1',
    key: 'Clé cnf.jwk du credential dont la signature et la confiance dans l’Issuer ont déjà été validées. Ne pas accepter une clé arbitraire fournie par le KB-JWT.',
  },
  dpop: {
    producer: 'Client détenteur de la clé DPoP',
    recipient: 'AS ou Resource Server ciblé par htu',
    spec: 'RFC 9449 §4.2–4.3',
    key: 'jwk du header de la preuve, comparée à la liaison du token (cnf.jkt) lors de l’accès à la ressource.',
  },
  jwt: {
    producer: 'Émetteur à déterminer selon le profil',
    recipient: 'Destinataire défini par le profil',
    spec: 'RFC 7519 ; profil applicable',
    key: 'Déterminer d’abord le profil, le signataire attendu et la provenance de sa clé. Le décodage ne valide aucun de ces éléments.',
  },
}
export function inferJwtContext(
  header: Record<string, unknown>,
  payload: Record<string, unknown>,
): JwtContext {
  if (header.typ === 'openid4vci-proof+jwt') return 'vci-proof'
  if (header.typ === 'kb+jwt') return 'kb-jwt'
  if (header.typ === 'dpop+jwt') return 'dpop'
  if (header.typ === 'dc+sd-jwt' || header.typ === 'vc+sd-jwt') return 'credential'
  if ('auth_time' in payload || 'at_hash' in payload) return 'id-token'
  return 'jwt'
}
export const jwtKeyExplanation = (context: JwtContext) => contexts[context].key
const descriptions: Record<string, [string, string, string]> = {
  given_name: [
    'Prénom du sujet déclaré par l’émetteur.',
    'string',
    'Interpréter selon le profil ; ce champ seul n’identifie pas une personne de façon unique.',
  ],
  family_name: [
    'Nom de famille déclaré.',
    'string',
    'Appliquer les règles de minimisation et de correspondance à la demande.',
  ],
  birthdate: [
    'Date de naissance déclarée.',
    'string date',
    'Ne demander la date complète que si nécessaire ; une preuve d’âge peut limiter la divulgation.',
  ],
  status: [
    'Référence de statut du credential.',
    'object',
    'Appliquer le mécanisme de statut et sa politique de fraîcheur ; considérer les risques de corrélation.',
  ],
  x5c: [
    'Chaîne de certificats X.509 du signataire.',
    'array de certificats DER en base64',
    'Valider la chaîne, l’identité et la politique de confiance ; une chaîne incluse n’est pas automatiquement fiable.',
  ],
  iss: [
    'Identifiant de l’émetteur déclaré.',
    'string',
    'Comparer à l’émetteur attendu ; ne pas faire confiance à cette valeur pour choisir librement une clé.',
  ],
  sub: [
    'Sujet du jeton ; en OIDC, identité locale à iss.',
    'string',
    'En OIDC, utiliser le couple (iss, sub), vérifier aussi le sub de UserInfo.',
  ],
  aud: [
    'Destinataire auquel cette preuve ou ce jeton est destiné.',
    'string ou tableau selon profil',
    'Comparer au destinataire attendu dans ce contexte, pas à une valeur choisie par le jeton.',
  ],
  iat: [
    'Instant d’émission, en secondes Unix.',
    'number',
    'Appliquer la fenêtre de fraîcheur prévue par le profil et une horloge connue.',
  ],
  exp: [
    'Fin de validité temporelle.',
    'number',
    'Refuser après expiration, selon les tolérances de temps définies.',
  ],
  nbf: ['Début de validité temporelle.', 'number', 'Ne pas accepter avant cet instant.'],
  jti: [
    'Identifiant de ce JWT.',
    'string',
    'L’anti-rejeu nécessite un contrôle et, selon le profil, une mémoire des identifiants déjà vus.',
  ],
  nonce: [
    'Défi ou valeur de corrélation recopiée dans la preuve.',
    'string',
    'Comparer à la valeur attendue ; appliquer la politique de fraîcheur et de consommation.',
  ],
  cnf: [
    'Clé de confirmation ou référence de clé liée par le signataire.',
    'object',
    'Lire cette liaison seulement après validation du jeton qui la contient.',
  ],
  'cnf.jwk': [
    'Clé publique du détenteur liée au credential.',
    'JWK public',
    'Utiliser cette clé pour le KB-JWT après validation du credential.',
  ],
  'cnf.jkt': [
    'Empreinte RFC 7638 de la clé DPoP.',
    'string base64url',
    'Comparer à l’empreinte de la jwk de la preuve DPoP.',
  ],
  sd_hash: [
    'Empreinte de la partie SD-JWT présentée, tilde final inclus.',
    'string base64url',
    'Recalculer sur les octets exacts du credential et des disclosures, sans le KB-JWT.',
  ],
  _sd: [
    'Empreintes des disclosures sélectives.',
    'array de strings',
    'Vérifier chaque disclosure divulguée, refuser doublons et collisions de noms.',
  ],
  _sd_alg: [
    'Algorithme des digests SD-JWT ; sha-256 par défaut si absent.',
    'string',
    'Accepter seulement les algorithmes pris en charge ; le KB-JWT réutilise ce choix pour sd_hash.',
  ],
  vct: [
    'Type de credential, défini indépendamment du transport OID4VCI.',
    'string',
    'Comparer au type demandé par DCQL et au profil accepté.',
  ],
  acr: [
    'Classe du contexte d’authentification convenue avec l’OP.',
    'string',
    'Si demandée, vérifier que la valeur convient à la politique du RP.',
  ],
  amr: [
    'Méthodes d’authentification déclarées par l’OP.',
    'array de strings',
    'Interpréter selon le registre et le profil ; une méthode ne suffit pas à déduire un niveau d’assurance.',
  ],
  azp: [
    'Partie autorisée dans les extensions qui utilisent ce claim.',
    'string',
    'Appliquer les contrôles de l’extension ; la comparaison à client_id peut en faire partie.',
  ],
  auth_time: [
    'Date d’authentification de l’utilisateur, différente de iat.',
    'number',
    'Contrôler l’âge de l’authentification si demandé, notamment avec max_age.',
  ],
  at_hash: [
    'Moitié gauche du hash de l’access token, en base64url.',
    'string',
    'Algorithme lié à alg ; présence et contrôle dépendent du flow et de l’endpoint OIDC.',
  ],
  c_hash: [
    'Moitié gauche du hash du code, en base64url.',
    'string',
    'Requis dans l’ID Token d’authorization endpoint émis avec un code (Hybrid).',
  ],
  alg: [
    'Algorithme JOSE déclaré par le message.',
    'string',
    'Le comparer à la liste autorisée, indépendamment de ce que le header demande.',
  ],
  typ: [
    'Type explicite de l’artefact signé.',
    'string',
    'Comparer au type attendu pour empêcher la confusion entre profils de JWT.',
  ],
  kid: [
    'Indice de sélection d’une clé.',
    'string',
    'Chercher parmi les clés de confiance ; kid n’est ni une clé ni une preuve d’identité.',
  ],
  jwk: [
    'Clé publique au format JSON Web Key.',
    'object',
    'Vérifier type, courbe, usage et provenance ; aucune clé privée ne doit être transportée ici.',
  ],
  key_attestation: [
    'JWT d’attestation de clé signé par un tiers.',
    'string JWT',
    'Valider le tiers, les clés attestées, le contexte et les exigences du profil.',
  ],
  htm: [
    'Méthode HTTP liée à la preuve DPoP.',
    'string',
    'Comparer exactement à la méthode de la requête reçue.',
  ],
  htu: [
    'URI cible de la preuve DPoP, sans query ni fragment.',
    'string URI',
    'Comparer à la cible de la requête selon RFC 9449.',
  ],
  ath: [
    'Hash SHA-256 complet de l’access token lié à la requête DPoP.',
    'string base64url',
    'Recalculer depuis l’access token effectivement reçu ; différent de at_hash OIDC.',
  ],
  scope: [
    'Droits accordés selon le serveur.',
    'string',
    'Vérifier les droits requis par l’opération ; ne pas confondre demande et octroi.',
  ],
  client_id: [
    'Identifiant public du client.',
    'string',
    'Identifier le client ; cette valeur seule ne l’authentifie pas.',
  ],
  email: [
    'Adresse déclarée pour le sujet.',
    'string',
    'Ne pas l’utiliser comme identifiant immuable ; vérifier le sens de email_verified si présent.',
  ],
  email_verified: [
    'L’OP déclare avoir vérifié le contrôle de l’adresse.',
    'boolean',
    'N’implique pas une identité civile ni un contrôle permanent de l’adresse.',
  ],
  name: [
    'Nom affichable déclaré.',
    'string',
    'Donnée de profil, pas preuve d’identité à elle seule.',
  ],
}
export function jwtFieldGuide(name: string, context: JwtContext): FieldGuide | undefined {
  const d = descriptions[name]
  if (!d) return undefined
  const c = contexts[context]
  let requirement = 'Dépend du profil et du message ; consulter la référence.'
  if (context === 'id-token')
    requirement = ['iss', 'sub', 'aud', 'exp', 'iat'].includes(name)
      ? 'Requis par OIDC Core §2.'
      : name === 'nonce'
        ? 'Requis si envoyé dans la demande code ; requis en Implicit.'
        : name === 'auth_time'
          ? 'Requis si max_age ou demandé comme Essential Claim.'
          : 'Optionnel ou conditionnel ; voir Core §2 et le flow utilisé.'
  if (context === 'kb-jwt' && ['typ', 'alg', 'iat', 'aud', 'nonce', 'sd_hash'].includes(name))
    requirement = 'Requis pour le KB-JWT.'
  if (context === 'vci-proof')
    requirement =
      name === 'nonce'
        ? 'Requis si l’Issuer expose un Nonce Endpoint.'
        : ['typ', 'alg', 'aud', 'iat'].includes(name)
          ? 'Requis pour le proof jwt.'
          : 'Selon la méthode de référence de clé et le profil.'
  let origin = `Défini par ${c.producer} selon le profil.`
  if (name === 'nonce')
    origin =
      context === 'kb-jwt'
        ? 'Défi de la requête du Verifier, recopié par le wallet.'
        : context === 'vci-proof'
          ? 'c_nonce fourni par l’Issuer, recopié par le wallet.'
          : context === 'id-token'
            ? 'Valeur générée par le RP, liée à sa session et recopiée par l’OP.'
            : 'Valeur fournie ou générée selon le protocole.'
  if (name === 'aud')
    origin =
      context === 'kb-jwt'
        ? 'client_id du Verifier dans ce parcours ; audience origin: en DC API.'
        : context === 'vci-proof'
          ? 'Credential Issuer Identifier obtenu des métadonnées.'
          : context === 'id-token'
            ? 'client_id du RP enregistré auprès de l’OP.'
            : 'Destinataire prévu par le profil.'
  return {
    description: d[0],
    type: d[1],
    check: d[2],
    producer: c.producer,
    recipient: c.recipient,
    origin,
    requirement,
    specRef: c.spec,
    sensitivity:
      'Un JWS est lisible : ces champs peuvent divulguer ou corréler des données. La clé publique n’est pas secrète.',
    retention:
      'Conserver selon la transaction et la politique de minimisation ; les preuves anti-rejeu nécessitent un état limité dans le temps.',
  }
}
const httpFields: Record<string, [string, string, string]> = {
  issuer: [
    'Identifiant de l’Authorization Server ou de l’OP.',
    'Configuration de confiance puis métadonnées découvertes.',
    'Comparer exactement à l’issuer attendu ; ne pas laisser une réponse choisir sa propre racine de confiance.',
  ],
  jwks_uri: [
    'Adresse du jeu de clés.',
    'Métadonnées de l’émetteur attendu.',
    'Vérifier la provenance des métadonnées avant de récupérer les clés.',
  ],
  authorization_endpoint: [
    'Endpoint de demande d’autorisation.',
    'Métadonnées AS/OP.',
    'Utiliser l’AS attendu et protéger le trajet navigateur.',
  ],
  token_endpoint: [
    'Endpoint d’échange du grant.',
    'Métadonnées AS/OP.',
    'Utiliser TLS et les méthodes d’authentification prévues pour ce client.',
  ],
  credential_endpoint: [
    'Endpoint d’émission.',
    'Credential Issuer Metadata.',
    'Y présenter le token et les preuves requis pour la configuration autorisée.',
  ],
  nonce_endpoint: [
    'Endpoint fournissant c_nonce.',
    'Credential Issuer Metadata.',
    'Récupérer un défi avant la preuve lorsque cet endpoint est exposé.',
  ],
  authorization_servers: [
    'Authorization Servers pouvant autoriser l’émission.',
    'Credential Issuer Metadata.',
    'Découvrir séparément les métadonnées du serveur choisi ; s’il est absent, l’Issuer joue ce rôle.',
  ],
  credential_configurations_supported: [
    'Catalogue des configurations émises.',
    'Credential Issuer Metadata.',
    'Choisir une configuration compatible avec le format, les preuves et le binding du wallet.',
  ],
  credential_configuration_ids: [
    'Configurations proposées dans l’offre.',
    'Credential Offer.',
    'Les résoudre dans credential_configurations_supported ; une offre ne constitue pas la totalité des métadonnées.',
  ],
  grants: [
    'Grants proposés pour cette offre.',
    'Credential Issuer.',
    'Suivre le grant choisi et ses paramètres ; ne pas supposer une preuve de clé imposée par le grant lui-même.',
  ],
  token_endpoint_auth_methods_supported: [
    'Méthodes d’authentification client annoncées.',
    'Métadonnées AS/OP.',
    'Choisir une méthode compatible avec l’enregistrement et le type du client.',
  ],
  'pre-authorized_grant_anonymous_access_supported': [
    'Acceptation de wallets anonymes pour ce grant.',
    'Métadonnées AS.',
    'Ne pas déduire une autorisation générale d’émission : code et éventuel tx_code restent à vérifier.',
  ],
  grant_types_supported: [
    'Grants pris en charge.',
    'Métadonnées AS/OP.',
    'Vérifier la compatibilité du parcours demandé.',
  ],
  credential_identifiers: [
    'Identifiants utilisables au Credential Endpoint.',
    'authorization_details de la réponse token.',
    'Les conserver avec l’autorisation et utiliser un credential_identifier approprié.',
  ],
  client_id: [
    'Identifiant public du client.',
    'Enregistrement ou mécanisme d’identification prévu par le profil.',
    'Identifier ; ne pas traiter cette seule valeur comme une authentification.',
  ],
  redirect_uri: [
    'Destination du retour navigateur.',
    'Configuration du client enregistrée auprès de l’AS.',
    'Comparer aux URI autorisées ; même valeur lors de l’échange du code si fournie initialement.',
  ],
  response_type: [
    'Type de réponse demandé.',
    'Choix du flow par le client.',
    'code pour le code flow ; vp_token pour la présentation.',
  ],
  scope: [
    'Droits ou ensembles de claims demandés.',
    'Besoin applicatif et capacités du serveur.',
    'Vérifier le périmètre accordé ; openid déclenche OIDC.',
  ],
  state: [
    'Corrélation du retour à la session.',
    'Valeur imprévisible du client, associée localement à la transaction.',
    'Comparer au retour et consommer la transaction selon la politique.',
  ],
  nonce: [
    'Défi à reporter dans une preuve.',
    'RP, Issuer ou Verifier selon le contexte.',
    'Comparer dans la preuve au défi attendu ; les politiques diffèrent.',
  ],
  code: [
    'Authorization code.',
    'AS, après autorisation ; reçu par le callback.',
    'Vérifier liaison au client, redirect_uri, PKCE et usage unique.',
  ],
  grant_type: [
    'Grant utilisé au token endpoint.',
    'Parcours choisi et autorisé par l’AS.',
    'Vérifier les paramètres et l’authentification propres à ce grant.',
  ],
  code_challenge: [
    'Engagement PKCE sur le verifier.',
    'BASE64URL(SHA-256(code_verifier)) dans notre parcours S256.',
    'Lier au code lors de son émission.',
  ],
  code_challenge_method: [
    'Méthode du challenge PKCE.',
    'Client ; S256 dans les exemples.',
    'Utiliser la méthode acceptée et résister au downgrade.',
  ],
  code_verifier: [
    'Secret éphémère PKCE.',
    'Généré par le client et conservé pour cette transaction.',
    'Recalculer le challenge à l’échange du code ; ne pas l’exposer dans la redirection.',
  ],
  access_token: [
    'Autorisation d’accès à une ressource.',
    'Token endpoint après validation du grant.',
    'Valider auprès du RS avec les droits, destinataire et liaison de clé nécessaires.',
  ],
  token_type: [
    'Mode d’utilisation du token.',
    'AS.',
    'Respecter Bearer ou DPoP ; ne pas déduire le format du token.',
  ],
  expires_in: [
    'Durée de validité en secondes.',
    'AS au moment d’émission.',
    'Calculer la fin de validité ; ne pas confondre durée et date absolue.',
  ],
  refresh_token: [
    'Moyen d’obtenir de nouveaux access tokens.',
    'AS selon sa politique.',
    'Présenter au token endpoint avec les protections requises.',
  ],
  id_token: [
    'Résultat d’authentification destiné au RP.',
    'OP.',
    'Appliquer la validation OIDC, pas seulement le décodage.',
  ],
  c_nonce: [
    'Défi pour les preuves d’émission.',
    'Nonce Endpoint de l’Issuer.',
    'Vérifier son acceptation selon la politique de l’Issuer ; pas intrinsèquement à usage unique.',
  ],
  credential_configuration_id: [
    'Configuration d’émission demandée.',
    'Catalogue credential_configurations_supported.',
    'Vérifier format, type et autorisation ; ne pas combiner avec credential_identifier.',
  ],
  credential_identifier: [
    'Instance ou ensemble autorisé à émettre.',
    'credential_identifiers de la réponse token.',
    'Vérifier sa correspondance avec l’autorisation obtenue.',
  ],
  authorization_details: [
    'Demande ou résultat d’autorisation structurée.',
    'Client dans la demande, AS dans la réponse.',
    'Suivre configurations et identifiants jusqu’au credential endpoint.',
  ],
  proofs: [
    'Preuves de clés pour l’émission.',
    'Wallet selon la configuration de l’Issuer.',
    'Vérifier type, signature ou attestation et contexte avant de lier le credential.',
  ],
  credentials: [
    'Credentials émis.',
    'Credential Issuer.',
    'Traiter les objets credential selon le format annoncé, puis les stocker dans le wallet.',
  ],
  dcql_query: [
    'Credentials et claims demandés.',
    'Verifier.',
    'Sélection côté wallet, puis vérification de l’adéquation côté Verifier.',
  ],
  vp_token: [
    'Présentations indexées par id de requête DCQL.',
    'Wallet.',
    'Valider format, Issuer, binding, contexte et correspondance DCQL.',
  ],
  response_uri: [
    'Destination de direct_post.',
    'Verifier dans sa demande.',
    'Valider sa liaison au client_id avant d’envoyer les données.',
  ],
  response_mode: [
    'Transport de la réponse.',
    'Verifier selon capacités et profil.',
    'direct_post est un POST ; direct_post.jwt transporte une réponse chiffrée.',
  ],
  request_uri: [
    'Référence à une demande.',
    'Client / Verifier, ou AS avec PAR.',
    'Récupérer et valider le Request Object selon le profil.',
  ],
  credential_offer_uri: [
    'Référence à un Credential Offer.',
    'Issuer.',
    'Récupérer l’offer et vérifier l’Issuer et ses métadonnées.',
  ],
  credential_issuer: [
    'Identifiant du Credential Issuer.',
    'Offer ou configuration de confiance.',
    'Comparer aux métadonnées obtenues avant d’utiliser leurs endpoints.',
  ],
  'pre-authorized_code': [
    'Code préautorisé d’émission.',
    'AS/Issuer après autorisation préalable.',
    'Secret à durée limitée et à usage unique ; appliquer tx_code si requis.',
  ],
  'pre-authorized-code': [
    'Code préautorisé d’émission.',
    'Offer de l’Issuer.',
    'Contrôler usage unique et tx_code lorsqu’il est requis.',
  ],
  tx_code: [
    'Code additionnel du parcours préautorisé.',
    'Canal convenu avec l’Issuer, saisi par l’utilisateur.',
    'Vérifier au token endpoint ; limiter les essais.',
  ],
  authorization: [
    'Moyen d’authentification ou token d’accès.',
    'Client selon l’endpoint.',
    'Basic authentifie le client ; Bearer/DPoP présente un token à la ressource.',
  ],
  dpop: [
    'Preuve signée liée à la requête HTTP.',
    'Client détenteur de la clé.',
    'Contrôler typ, alg, jwk, htm, htu, iat, jti et ath/nonce si applicables.',
  ],
  'content-type': [
    'Type de sérialisation du corps.',
    'Émetteur du message.',
    'Décoder form, JSON ou JWT conformément à cet en-tête.',
  ],
  location: [
    'Destination de redirection.',
    'Serveur dans une réponse 3xx.',
    'Le navigateur émet ensuite une nouvelle requête vers cette destination.',
  ],
  'cache-control': [
    'Directives de cache.',
    'Serveur.',
    'no-store demande de ne pas stocker ; ce n’est pas une protection cryptographique.',
  ],
  pragma: [
    'Directive historique de cache.',
    'Serveur.',
    'no-cache complète Cache-Control pour les clients anciens.',
  ],
}
const httpTypes: Record<string, string> = {
  expires_in: 'number (secondes)',
  authorization_details: 'array d’objets JSON',
  proofs: 'object indexé par type de preuve',
  credentials: 'array d’objets credential',
  dcql_query: 'object JSON',
  vp_token: 'object JSON (sérialisé en string dans le form)',
  grants: 'object JSON',
  credential_configurations_supported: 'object indexé par configuration',
  credential_configuration_ids: 'array de strings',
  credential_identifiers: 'array de strings',
  authorization_servers: 'array d’URI',
  grant_types_supported: 'array de strings',
  token_endpoint_auth_methods_supported: 'array de strings',
  'pre-authorized_grant_anonymous_access_supported': 'boolean',
}
const httpPresence: Record<string, string> = {
  client_id:
    'Requis dans la demande d’autorisation ; requis à l’échange du code lorsque le client ne s’authentifie pas.',
  redirect_uri:
    'Conditionnel selon le parcours ; au token endpoint, même valeur si fournie dans la demande de code.',
  grant_type: 'Requis au token endpoint.',
  code: 'Requis pour échanger un authorization code.',
  code_verifier: 'Requis lorsque PKCE a été utilisé pour obtenir le code.',
  state:
    'Recommandé dans RFC 6749 ; s’il est envoyé, retour à l’identique. La protection CSRF reste requise.',
  scope: 'Optionnel dans OAuth ; openid requis pour une demande OIDC.',
  access_token: 'Requis dans une réponse token réussie.',
  token_type: 'Requis dans une réponse token réussie.',
  expires_in: 'Recommandé dans une réponse token ; durée à documenter autrement si absent.',
  refresh_token: 'Optionnel selon le grant et la politique ; déconseillé dans Client Credentials.',
  id_token: 'Requis dans la réponse token réussie du code flow OIDC.',
  c_nonce: 'Requis dans la réponse réussie du Nonce Endpoint OID4VCI.',
  proofs: 'Conditionnel selon la configuration et la preuve demandée par l’Issuer.',
  credential_configuration_id:
    'Identifie la configuration ; ne pas envoyer avec credential_identifier.',
  credential_identifier:
    'Utilisé si des credential_identifiers ont été retournés ; ne pas envoyer avec credential_configuration_id.',
  vp_token: 'Requis pour une réponse de présentation réussie utilisant ce paramètre.',
  tx_code: 'Requis au token endpoint si demandé dans l’offre préautorisée.',
}
export function httpFieldGuide(name: string): FieldGuide | undefined {
  const key = name.toLowerCase(),
    d = httpFields[key]
  if (!d) return undefined
  const vc = [
    'credential',
    'proofs',
    'c_nonce',
    'nonce_endpoint',
    'grants',
    'tx_code',
    'pre-authorized',
    'authorization_servers',
  ].some((prefix) => key.startsWith(prefix))
  const vp = ['dcql_query', 'vp_token', 'response_uri', 'response_mode'].includes(key)
  const oidc = ['id_token', 'jwks_uri'].includes(key)
  const sensitive = [
    'code',
    'code_verifier',
    'access_token',
    'refresh_token',
    'id_token',
    'vp_token',
    'credentials',
    'tx_code',
    'authorization',
    'pre-authorized_code',
    'pre-authorized-code',
  ].includes(key)
  return {
    description: d[0],
    type: httpTypes[key] ?? 'string',
    origin: d[1],
    check: d[2],
    producer: 'Émetteur du message affiché',
    recipient: 'Destinataire du message affiché',
    requirement:
      httpPresence[key] ??
      'Dépend de l’endpoint, du grant et du profil ; vérifier les références du scénario.',
    sensitivity: sensitive
      ? 'Valeur sensible : éviter les logs et fuites ; TLS en transit, protection adaptée au repos.'
      : 'Pas un secret d’authentification en soi ; intégrité et corrélation restent à considérer.',
    retention: sensitive
      ? 'Limiter à sa durée d’utilité et minimiser les traces. Ne pas réutiliser les secrets de transaction.'
      : 'Conserver le contexte de transaction ou les métadonnées avec une politique de cache appropriée.',
    specRef: vc
      ? 'OID4VCI 1.0 §5–8 et §12'
      : vp
        ? 'OID4VP 1.0 §5–8'
        : oidc
          ? 'OIDC Core §3 ; Discovery §3'
          : 'RFC 6749 §3–5 ; RFC 7636 pour PKCE ; références du scénario',
  }
}
