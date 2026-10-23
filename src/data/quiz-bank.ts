import type { QuizQuestion } from '../components/content/Quiz'

/** Questions révisées ; positions fixes pour préserver la correction des réponses. */
export const quizBank: Record<string, QuizQuestion[]> = {
  'oid4vp/authorization-request/flow-presentation': [
    {
      id: 'q1',
      question: 'Que demande response_type=vp_token ?',
      options: [
        {
          text: 'Une réponse contenant un access token OAuth',
          explanation:
            'OID4VP réutilise une structure de requête d’autorisation pour demander des présentations.',
        },
        {
          text: 'Une réponse de présentation de credentials',
          correct: true,
          explanation:
            'OID4VP réutilise une structure de requête d’autorisation pour demander des présentations.',
        },
        {
          text: 'Une réponse de renouvellement d’un ID Token',
          explanation:
            'OID4VP réutilise une structure de requête d’autorisation pour demander des présentations.',
        },
      ],
    },
    {
      id: 'q2',
      question: 'Que représentent les clés de l’objet vp_token ?',
      options: [
        {
          text: 'Les empreintes des clés privées stockées dans le wallet',
          explanation:
            'Les valeurs associées sont des tableaux de présentations satisfaisant les requêtes correspondantes.',
        },
        {
          text: 'Les identifiants des requêtes de credentials DCQL',
          correct: true,
          explanation:
            'Les valeurs associées sont des tableaux de présentations satisfaisant les requêtes correspondantes.',
        },
        {
          text: 'Les identifiants des sessions utilisateur chez l’Issuer',
          explanation:
            'Les valeurs associées sont des tableaux de présentations satisfaisant les requêtes correspondantes.',
        },
      ],
    },
    {
      id: 'q3',
      question: 'Que transporte direct_post.jwt ?',
      options: [
        {
          text: 'Une réponse uniquement signée',
          explanation:
            'Dans OID4VP 1.0, ce mode relève des réponses chiffrées ; ne pas le définir comme signé et/ou chiffré.',
        },
        {
          text: 'Un ID Token de connexion',
          explanation:
            'Dans OID4VP 1.0, ce mode relève des réponses chiffrées ; ne pas le définir comme signé et/ou chiffré.',
        },
        {
          text: 'Une réponse chiffrée',
          correct: true,
          explanation:
            'Dans OID4VP 1.0, ce mode relève des réponses chiffrées ; ne pas le définir comme signé et/ou chiffré.',
        },
      ],
    },
  ],
  'oid4vp/key-binding/anti-rejeu': [
    {
      id: 'q1',
      question: 'Avec quelle clé vérifie-t-on le KB-JWT ?',
      options: [
        {
          text: 'La clé du détenteur liée par cnf au credential validé',
          correct: true,
          explanation:
            'L’Issuer signe la liaison ; le wallet prouve le contrôle de la partie privée correspondante.',
        },
        {
          text: 'La clé de l’Issuer utilisée pour signer le credential',
          explanation:
            'L’Issuer signe la liaison ; le wallet prouve le contrôle de la partie privée correspondante.',
        },
        {
          text: 'La première clé reçue dans le header du KB-JWT',
          explanation:
            'L’Issuer signe la liaison ; le wallet prouve le contrôle de la partie privée correspondante.',
        },
      ],
    },
    {
      id: 'q2',
      question: 'Une disclosure est retirée après signature du KB-JWT : quel contrôle échoue ?',
      options: [
        {
          text: 'La signature du credential',
          explanation:
            'La signature du KB-JWT peut rester valide, mais elle couvre une empreinte qui ne correspond plus à la sélection reçue.',
        },
        {
          text: 'La comparaison de client_id',
          explanation:
            'La signature du KB-JWT peut rester valide, mais elle couvre une empreinte qui ne correspond plus à la sélection reçue.',
        },
        {
          text: 'La comparaison de sd_hash',
          correct: true,
          explanation:
            'La signature du KB-JWT peut rester valide, mais elle couvre une empreinte qui ne correspond plus à la sélection reçue.',
        },
      ],
    },
    {
      id: 'q3',
      question: 'Pourquoi conserver l’état de la transaction acceptée ?',
      options: [
        {
          text: 'Pour chiffrer automatiquement les claims révélés',
          explanation:
            'Nonce et fraîcheur ne consomment pas eux-mêmes une transaction ; le Verifier applique sa politique anti-rejeu.',
        },
        {
          text: 'Pour renouveler la signature de l’Issuer à chaque usage',
          explanation:
            'Nonce et fraîcheur ne consomment pas eux-mêmes une transaction ; le Verifier applique sa politique anti-rejeu.',
        },
        {
          text: 'Pour refuser une seconde soumission identique',
          correct: true,
          explanation:
            'Nonce et fraîcheur ne consomment pas eux-mêmes une transaction ; le Verifier applique sa politique anti-rejeu.',
        },
      ],
    },
  ],
  'oid4vp/divulgation-selective/choisir-ses-claims': [
    {
      id: 'q1',
      question: 'Retirer une disclosure change-t-il la signature du credential ?',
      options: [
        {
          text: 'Non, le JWT signé contient les digests',
          correct: true,
          explanation:
            'La sélection ne modifie pas le JWT de l’Issuer ; elle change la partie présentée que couvre sd_hash.',
        },
        {
          text: 'Oui, le wallet doit faire resigner par l’Issuer',
          explanation:
            'La sélection ne modifie pas le JWT de l’Issuer ; elle change la partie présentée que couvre sd_hash.',
        },
        {
          text: 'Oui, la clé du détenteur remplace celle de l’Issuer',
          explanation:
            'La sélection ne modifie pas le JWT de l’Issuer ; elle change la partie présentée que couvre sd_hash.',
        },
      ],
    },
    {
      id: 'q2',
      question: 'Un digest salé stable est-il sans risque pour la vie privée ?',
      options: [
        {
          text: 'Oui, car personne ne peut voir le digest',
          explanation:
            'Le sel protège contre la recherche de valeur ; une empreinte stable reste observable et comparable.',
        },
        {
          text: 'Non, il peut corréler deux présentations',
          correct: true,
          explanation:
            'Le sel protège contre la recherche de valeur ; une empreinte stable reste observable et comparable.',
        },
        {
          text: 'Oui, car la signature change à chaque usage',
          explanation:
            'Le sel protège contre la recherche de valeur ; une empreinte stable reste observable et comparable.',
        },
      ],
    },
    {
      id: 'q3',
      question: 'Qui décide quels claims pourront être divulgués sélectivement ?',
      options: [
        {
          text: 'Le Verifier, en modifiant les digests signés',
          explanation:
            'Le wallet choisit parmi les disclosures disponibles ; il ne transforme pas librement les claims visibles en claims cachés.',
        },
        {
          text: 'Le navigateur, en réécrivant le header JOSE',
          explanation:
            'Le wallet choisit parmi les disclosures disponibles ; il ne transforme pas librement les claims visibles en claims cachés.',
        },
        {
          text: 'L’Issuer, en construisant le credential',
          correct: true,
          explanation:
            'Le wallet choisit parmi les disclosures disponibles ; il ne transforme pas librement les claims visibles en claims cachés.',
        },
      ],
    },
  ],
  'oid4vp/unlinkability/federation-vs-wallet': [
    {
      id: 'q1',
      question: 'Changer le nonce suffit-il à empêcher toute corrélation ?',
      options: [
        {
          text: 'Non, d’autres valeurs peuvent rester stables',
          correct: true,
          explanation:
            'Clés publiques, signatures, digests et attributs peuvent rester identiques entre présentations.',
        },
        {
          text: 'Oui, il change automatiquement la clé de l’Issuer',
          explanation:
            'Clés publiques, signatures, digests et attributs peuvent rester identiques entre présentations.',
        },
        {
          text: 'Oui, il supprime les timestamps du credential',
          explanation:
            'Clés publiques, signatures, digests et attributs peuvent rester identiques entre présentations.',
        },
      ],
    },
    {
      id: 'q2',
      question: 'Que faut-il examiner pour une émission en lots ?',
      options: [
        {
          text: 'Seulement la longueur des signatures dans chaque lot',
          explanation:
            'Des exemplaires différents peuvent encore partager des valeurs corrélables ; le lot n’est pas une garantie automatique.',
        },
        {
          text: 'Les clés, les temps, les sels et les politiques d’usage',
          correct: true,
          explanation:
            'Des exemplaires différents peuvent encore partager des valeurs corrélables ; le lot n’est pas une garantie automatique.',
        },
        {
          text: 'Seulement le nombre de credentials transmis au wallet',
          explanation:
            'Des exemplaires différents peuvent encore partager des valeurs corrélables ; le lot n’est pas une garantie automatique.',
        },
      ],
    },
    {
      id: 'q3',
      question: 'OIDC permet-il de demander des claims individuellement ?',
      options: [
        {
          text: 'Non, uniquement par des scopes',
          explanation:
            'Core §5.5 permet les demandes individuelles ; cela diffère de la sélection locale d’un credential déjà émis.',
        },
        {
          text: 'Oui, en modifiant la signature',
          explanation:
            'Core §5.5 permet les demandes individuelles ; cela diffère de la sélection locale d’un credential déjà émis.',
        },
        {
          text: 'Oui, via le paramètre claims',
          correct: true,
          explanation:
            'Core §5.5 permet les demandes individuelles ; cela diffère de la sélection locale d’un credential déjà émis.',
        },
      ],
    },
  ],
  'oid4vp/verifier-id/client-id-prefixes': [
    {
      id: 'q1',
      question: 'Que signifie x509_san_dns:verifier.example ?',
      options: [
        {
          text: 'Une URL que le wallet doit afficher sans contrôle supplémentaire',
          explanation:
            'Le wallet valide la chaîne, le SAN et la signature selon les règles applicables ; cela ne donne pas un droit universel de collecte.',
        },
        {
          text: 'Une identité DNS à vérifier avec le certificat et la signature',
          correct: true,
          explanation:
            'Le wallet valide la chaîne, le SAN et la signature selon les règles applicables ; cela ne donne pas un droit universel de collecte.',
        },
        {
          text: 'Une preuve que ce Verifier peut demander tous les attributs',
          explanation:
            'Le wallet valide la chaîne, le SAN et la signature selon les règles applicables ; cela ne donne pas un droit universel de collecte.',
        },
      ],
    },
    {
      id: 'q2',
      question: 'Quel usage actuel remplace client_id_scheme des anciens drafts ?',
      options: [
        {
          text: 'Un champ cnf du credential',
          explanation: 'La forme de client_id annonce la méthode d’identification dans OID4VP 1.0.',
        },
        {
          text: 'Un claim sub du proof VCI',
          explanation: 'La forme de client_id annonce la méthode d’identification dans OID4VP 1.0.',
        },
        {
          text: 'Un préfixe du client_id',
          correct: true,
          explanation: 'La forme de client_id annonce la méthode d’identification dans OID4VP 1.0.',
        },
      ],
    },
    {
      id: 'q3',
      question: 'Comment traiter un préfixe origin: reçu dans une requête ?',
      options: [
        {
          text: 'Le refuser comme préfixe de requête',
          correct: true,
          explanation:
            'origin: est réservé à l’audience de présentation dans l’usage DC API, pas à un client_id déclaré dans la requête.',
        },
        {
          text: 'L’accepter comme un certificat DNS',
          explanation:
            'origin: est réservé à l’audience de présentation dans l’usage DC API, pas à un client_id déclaré dans la requête.',
        },
        {
          text: 'L’utiliser comme le nonce du wallet',
          explanation:
            'origin: est réservé à l’audience de présentation dans l’usage DC API, pas à un client_id déclaré dans la requête.',
        },
      ],
    },
  ],
  'oid4vp/dcql/langage-requete': [
    {
      id: 'q1',
      question: 'Où intent_to_retain s’applique-t-il dans le référentiel étudié ?',
      options: [
        {
          text: 'À tous les champs SD-JWT',
          explanation: 'OID4VP annexe B.2.4 définit ce paramètre optionnel spécifique à mdoc.',
        },
        {
          text: 'Aux seuls ID Tokens OIDC',
          explanation: 'OID4VP annexe B.2.4 définit ce paramètre optionnel spécifique à mdoc.',
        },
        {
          text: 'Aux Claims Queries mdoc',
          correct: true,
          explanation: 'OID4VP annexe B.2.4 définit ce paramètre optionnel spécifique à mdoc.',
        },
      ],
    },
    {
      id: 'q2',
      question: 'Que garantit intent_to_retain=false ?',
      options: [
        {
          text: 'Une intention déclarée, sans empêcher techniquement une copie',
          correct: true,
          explanation:
            'Le wallet peut informer l’utilisateur ; l’application de la politique de conservation reste une question distincte.',
        },
        {
          text: 'Une impossibilité cryptographique de stocker les données reçues',
          explanation:
            'Le wallet peut informer l’utilisateur ; l’application de la politique de conservation reste une question distincte.',
        },
        {
          text: 'Une obligation pour le wallet de supprimer le credential local',
          explanation:
            'Le wallet peut informer l’utilisateur ; l’application de la politique de conservation reste une question distincte.',
        },
      ],
    },
    {
      id: 'q3',
      question: 'Une présentation signée valide satisfait-elle forcément DCQL ?',
      options: [
        {
          text: 'Non, il faut aussi vérifier la demande',
          correct: true,
          explanation:
            'Validité cryptographique et adéquation au type, aux claims et aux alternatives demandés sont des contrôles différents.',
        },
        {
          text: 'Oui, si la clé de l’Issuer est connue',
          explanation:
            'Validité cryptographique et adéquation au type, aux claims et aux alternatives demandés sont des contrôles différents.',
        },
        {
          text: 'Oui, dès que le nonce est identique',
          explanation:
            'Validité cryptographique et adéquation au type, aux claims et aux alternatives demandés sont des contrôles différents.',
        },
      ],
    },
  ],
  'oid4vp/ouverture/dc-api-haip': [
    {
      id: 'q1',
      question: 'Qui apporte l’origine du site dans un parcours DC API ?',
      options: [
        {
          text: 'L’environnement navigateur',
          correct: true,
          explanation:
            'Le wallet utilise l’origine fournie par l’environnement pour construire l’audience de présentation selon l’annexe A.',
        },
        {
          text: 'L’Issuer du credential',
          explanation:
            'Le wallet utilise l’origine fournie par l’environnement pour construire l’audience de présentation selon l’annexe A.',
        },
        {
          text: 'Le payload libre du KB-JWT',
          explanation:
            'Le wallet utilise l’origine fournie par l’environnement pour construire l’audience de présentation selon l’annexe A.',
        },
      ],
    },
    {
      id: 'q2',
      question: 'Deux implémentations conformes aux bases interopèrent-elles forcément ?',
      options: [
        {
          text: 'Oui, toutes les variantes sont obligatoires',
          explanation:
            'Formats, algorithmes, modes de réponse et identification du Verifier doivent être compatibles.',
        },
        {
          text: 'Non, leurs options et profils peuvent différer',
          correct: true,
          explanation:
            'Formats, algorithmes, modes de réponse et identification du Verifier doivent être compatibles.',
        },
        {
          text: 'Oui, le même nom de protocole suffit',
          explanation:
            'Formats, algorithmes, modes de réponse et identification du Verifier doivent être compatibles.',
        },
      ],
    },
    {
      id: 'q3',
      question: 'Que faut-il distinguer dans une documentation de protocole ?',
      options: [
        {
          text: 'La seule date du dernier exemple de code publié',
          explanation:
            'Le statut et la version déterminent la portée des affirmations et des exigences enseignées.',
        },
        {
          text: 'Norme, draft, profil et choix de démonstration',
          correct: true,
          explanation:
            'Le statut et la version déterminent la portée des affirmations et des exigences enseignées.',
        },
        {
          text: 'Le seul nom commercial du produit qui l’implémente',
          explanation:
            'Le statut et la version déterminent la portée des affirmations et des exigences enseignées.',
        },
      ],
    },
  ],
  'oauth2/probleme-origine/partage-mot-de-passe': [
    {
      id: 'q1',
      question: 'Quel problème illustre le partage du mot de passe ?',
      options: [
        {
          text: 'Le tiers reçoit les moyens d’agir comme l’utilisateur',
          correct: true,
          explanation:
            'Le problème est l’étendue du pouvoir partagé et la difficulté à retirer cette délégation isolément.',
        },
        {
          text: 'Le tiers doit maintenir une session sur son serveur',
          explanation:
            'Le problème est l’étendue du pouvoir partagé et la difficulté à retirer cette délégation isolément.',
        },
        {
          text: 'Le tiers doit connaître le nom du service appelé',
          explanation:
            'Le problème est l’étendue du pouvoir partagé et la difficulté à retirer cette délégation isolément.',
        },
      ],
    },
    {
      id: 'q2',
      question: 'Que peut-on affirmer sur une API key ?',
      options: [
        {
          text: 'Sa portée couvre tout le service',
          explanation:
            'Expiration, scopes et révocation des API keys varient ; OAuth fournit un cadre interopérable.',
        },
        {
          text: 'Sa portée dépend du service qui la définit',
          correct: true,
          explanation:
            'Expiration, scopes et révocation des API keys varient ; OAuth fournit un cadre interopérable.',
        },
        {
          text: 'Sa portée correspond toujours à un utilisateur',
          explanation:
            'Expiration, scopes et révocation des API keys varient ; OAuth fournit un cadre interopérable.',
        },
      ],
    },
    {
      id: 'q3',
      question: 'Quel secret reste sensible dans un code flow OAuth ?',
      options: [
        {
          text: 'Le client_id public de l’app',
          explanation:
            'OAuth évite de partager le mot de passe avec le tiers, mais remet une autorisation sensible sous forme de token.',
        },
        {
          text: 'Le code_challenge envoyé avec la demande',
          explanation:
            'OAuth évite de partager le mot de passe avec le tiers, mais remet une autorisation sensible sous forme de token.',
        },
        {
          text: 'Le bearer access token remis au client',
          correct: true,
          explanation:
            'OAuth évite de partager le mot de passe avec le tiers, mais remet une autorisation sensible sous forme de token.',
        },
      ],
    },
  ],
  'oauth2/attaques/csrf-state': [
    {
      id: 'q1',
      question: 'Quelle propriété doit avoir state pour protéger le callback ?',
      options: [
        {
          text: 'Être l’identifiant public du client enregistré',
          explanation:
            'Le RP compare le retour à la valeur associée à la transaction de ce navigateur.',
        },
        {
          text: 'Être imprévisible et lié à la session initiale',
          correct: true,
          explanation:
            'Le RP compare le retour à la valeur associée à la transaction de ce navigateur.',
        },
        {
          text: 'Être une copie du scope demandé au serveur',
          explanation:
            'Le RP compare le retour à la valeur associée à la transaction de ce navigateur.',
        },
      ],
    },
    {
      id: 'q2',
      question: 'PKCE peut-il participer à la protection CSRF ?',
      options: [
        {
          text: 'Oui, même si le serveur ignore le code_challenge reçu',
          explanation:
            'RFC 9700 autorise ce rôle de PKCE sous conditions ; générer un challenge sans vérifier son support ne suffit pas.',
        },
        {
          text: 'Oui, si son support et sa liaison à la transaction sont assurés',
          correct: true,
          explanation:
            'RFC 9700 autorise ce rôle de PKCE sous conditions ; générer un challenge sans vérifier son support ne suffit pas.',
        },
        {
          text: 'Non, la protection CSRF doit toujours utiliser state seul',
          explanation:
            'RFC 9700 autorise ce rôle de PKCE sous conditions ; générer un challenge sans vérifier son support ne suffit pas.',
        },
      ],
    },
    {
      id: 'q3',
      question: 'Comment retrouver une URL de retour après le flow ?',
      options: [
        {
          text: 'Accepter toute URL de retour fournie avec le callback',
          explanation:
            'La corrélation ne dispense pas de contrôler les destinations afin d’éviter les open redirects.',
        },
        {
          text: 'Réutiliser l’access token comme URL de redirection',
          explanation:
            'La corrélation ne dispense pas de contrôler les destinations afin d’éviter les open redirects.',
        },
        {
          text: 'Utiliser state comme référence vers un état local contrôlé',
          correct: true,
          explanation:
            'La corrélation ne dispense pas de contrôler les destinations afin d’éviter les open redirects.',
        },
      ],
    },
  ],
  'oauth2/roles-canaux/front-back-channel': [
    {
      id: 'q1',
      question: 'Un appel direct au token endpoint prouve-t-il que le client est un serveur ?',
      options: [
        {
          text: 'Oui, car seuls deux serveurs peuvent établir TLS',
          explanation:
            'Le trajet du message ne détermine pas où le client est exécuté ni s’il est authentifié.',
        },
        {
          text: 'Non, une application native peut aussi l’émettre',
          correct: true,
          explanation:
            'Le trajet du message ne détermine pas où le client est exécuté ni s’il est authentifié.',
        },
        {
          text: 'Oui, s’il fournit un client_id',
          explanation:
            'Le trajet du message ne détermine pas où le client est exécuté ni s’il est authentifié.',
        },
      ],
    },
    {
      id: 'q2',
      question: 'Où Implicit livrait-il l’access token ?',
      options: [
        {
          text: 'Dans le fragment de l’URI de redirection',
          correct: true,
          explanation:
            'Le fragment traverse le navigateur, mais n’est pas envoyé au serveur dans la requête HTTP.',
        },
        {
          text: 'Dans la réponse du token endpoint',
          explanation:
            'Le fragment traverse le navigateur, mais n’est pas envoyé au serveur dans la requête HTTP.',
        },
        {
          text: 'Dans le cookie de session du serveur OAuth',
          explanation:
            'Le fragment traverse le navigateur, mais n’est pas envoyé au serveur dans la requête HTTP.',
        },
      ],
    },
    {
      id: 'q3',
      question: 'Que garantit TLS dans un appel au token endpoint ?',
      options: [
        {
          text: 'L’enregistrement préalable du client auprès du serveur',
          explanation:
            'L’authentification du client et la liaison de clé sont des mécanismes supplémentaires.',
        },
        {
          text: 'La liaison du token à la clé privée du demandeur',
          explanation:
            'L’authentification du client et la liaison de clé sont des mécanismes supplémentaires.',
        },
        {
          text: 'L’authentification du serveur et le transport protégé',
          correct: true,
          explanation:
            'L’authentification du client et la liaison de clé sont des mécanismes supplémentaires.',
        },
      ],
    },
  ],
  'oauth2/attaques/implicit-ropc': [
    {
      id: 'q1',
      question: 'Quel niveau RFC 9700 applique-t-il à Implicit avec access token ?',
      options: [
        {
          text: 'SHOULD NOT : usage déconseillé',
          correct: true,
          explanation:
            'La déconseillation d’Implicit ne doit pas être confondue avec l’interdiction de ROPC.',
        },
        {
          text: 'MUST NOT : usage interdit',
          explanation:
            'La déconseillation d’Implicit ne doit pas être confondue avec l’interdiction de ROPC.',
        },
        {
          text: 'MAY : usage sans précaution particulière',
          explanation:
            'La déconseillation d’Implicit ne doit pas être confondue avec l’interdiction de ROPC.',
        },
      ],
    },
    {
      id: 'q2',
      question: 'Quel niveau s’applique à ROPC dans RFC 9700 ?',
      options: [
        {
          text: 'SHOULD : il convient aux apps natives',
          explanation:
            'ROPC expose le mot de passe au client et entrave les parcours modernes d’authentification.',
        },
        {
          text: 'MUST NOT : il ne doit pas être utilisé',
          correct: true,
          explanation:
            'ROPC expose le mot de passe au client et entrave les parcours modernes d’authentification.',
        },
        {
          text: 'MAY : il remplace PKCE avec un secret',
          explanation:
            'ROPC expose le mot de passe au client et entrave les parcours modernes d’authentification.',
        },
      ],
    },
    {
      id: 'q3',
      question: 'Quel parcours le cours retient-il pour une application publique ?',
      options: [
        {
          text: 'Implicit avec chiffrement',
          explanation:
            'PKCE protège l’échange du code sans imposer un secret partagé que l’application publique ne peut garder.',
        },
        {
          text: 'ROPC avec le secret intégré à l’app',
          explanation:
            'PKCE protège l’échange du code sans imposer un secret partagé que l’application publique ne peut garder.',
        },
        {
          text: 'Authorization Code avec PKCE S256',
          correct: true,
          explanation:
            'PKCE protège l’échange du code sans imposer un secret partagé que l’application publique ne peut garder.',
        },
      ],
    },
  ],
  'oauth2/authorization-code/flow-pas-a-pas': [
    {
      id: 'q1',
      question: 'Qui reçoit le code avant le POST du RP au token endpoint ?',
      options: [
        {
          text: 'Le serveur de ressources',
          explanation:
            'Le navigateur suit la redirection puis le RP échange le code dans un message distinct.',
        },
        {
          text: 'Le token endpoint appelé par le navigateur',
          explanation:
            'Le navigateur suit la redirection puis le RP échange le code dans un message distinct.',
        },
        {
          text: 'Le callback du RP appelé par le navigateur',
          correct: true,
          explanation:
            'Le navigateur suit la redirection puis le RP échange le code dans un message distinct.',
        },
      ],
    },
    {
      id: 'q2',
      question: 'Un client public non authentifié échange un code : que doit-il fournir ?',
      options: [
        {
          text: 'Son client_id et les paramètres requis du flow',
          correct: true,
          explanation:
            'RFC 6749 §4.1.3 exige client_id lorsque le client ne s’authentifie pas ; PKCE complète ce parcours.',
        },
        {
          text: 'Son client_secret copié dans le code distribué',
          explanation:
            'RFC 6749 §4.1.3 exige client_id lorsque le client ne s’authentifie pas ; PKCE complète ce parcours.',
        },
        {
          text: 'Son access token obtenu avant l’autorisation',
          explanation:
            'RFC 6749 §4.1.3 exige client_id lorsque le client ne s’authentifie pas ; PKCE complète ce parcours.',
        },
      ],
    },
    {
      id: 'q3',
      question: 'Que faire si un authorization code est réutilisé ?',
      options: [
        {
          text: 'Émettre de nouveaux tokens',
          explanation:
            'Le code est à usage unique. L’AS devrait aussi révoquer les tokens déjà émis sur ce code.',
        },
        {
          text: 'Refuser cette seconde utilisation',
          correct: true,
          explanation:
            'Le code est à usage unique. L’AS devrait aussi révoquer les tokens déjà émis sur ce code.',
        },
        {
          text: 'Accepter tant que le code n’a pas expiré',
          explanation:
            'Le code est à usage unique. L’AS devrait aussi révoquer les tokens déjà émis sur ce code.',
        },
      ],
    },
  ],
  'oauth2/attaques/interception-pkce': [
    {
      id: 'q1',
      question: 'Que relie PKCE ?',
      options: [
        {
          text: 'Le token à une clé matérielle',
          explanation:
            'Le serveur compare le challenge au dérivé du verifier présenté lors de l’échange du code.',
        },
        {
          text: 'Le code à un secret de la transaction',
          correct: true,
          explanation:
            'Le serveur compare le challenge au dérivé du verifier présenté lors de l’échange du code.',
        },
        {
          text: 'L’utilisateur à son identifiant permanent',
          explanation:
            'Le serveur compare le challenge au dérivé du verifier présenté lors de l’échange du code.',
        },
      ],
    },
    {
      id: 'q2',
      question: 'Que dit RFC 9700 sur PKCE pour les clients confidentiels ?',
      options: [
        {
          text: 'Son utilisation est recommandée',
          correct: true,
          explanation:
            'Le BCP impose PKCE aux clients publics et le recommande aux confidentiels ; le cours choisit S256 dans les deux cas.',
        },
        {
          text: 'Son utilisation est interdite',
          explanation:
            'Le BCP impose PKCE aux clients publics et le recommande aux confidentiels ; le cours choisit S256 dans les deux cas.',
        },
        {
          text: 'Son utilisation est toujours obligatoire',
          explanation:
            'Le BCP impose PKCE aux clients publics et le recommande aux confidentiels ; le cours choisit S256 dans les deux cas.',
        },
      ],
    },
    {
      id: 'q3',
      question: 'Quel élément protège contre un mix-up entre plusieurs AS ?',
      options: [
        {
          text: 'La liaison à l’Issuer attendu et son contrôle au retour',
          correct: true,
          explanation:
            'Le client doit identifier l’AS attendu et vérifier la cohérence des endpoints et de la réponse.',
        },
        {
          text: 'La présence du même scope dans toutes les demandes',
          explanation:
            'Le client doit identifier l’AS attendu et vérifier la cohérence des endpoints et de la réponse.',
        },
        {
          text: 'La conservation du dernier token reçu par le client',
          explanation:
            'Le client doit identifier l’AS attendu et vérifier la cohérence des endpoints et de la réponse.',
        },
      ],
    },
  ],
  'oauth2/etat-de-l-art/bcp-oauth21': [
    {
      id: 'q1',
      question: 'Quel référentiel de sécurité complète OAuth 2.0 ?',
      options: [
        {
          text: 'Le seul draft OAuth 2.1',
          explanation:
            'Le BCP fournit des recommandations et obligations contextualisées, distinctes d’un draft de consolidation.',
        },
        {
          text: 'La RFC 9700, Security BCP',
          correct: true,
          explanation:
            'Le BCP fournit des recommandations et obligations contextualisées, distinctes d’un draft de consolidation.',
        },
        {
          text: 'Le format de JWT de la RFC 7519',
          explanation:
            'Le BCP fournit des recommandations et obligations contextualisées, distinctes d’un draft de consolidation.',
        },
      ],
    },
    {
      id: 'q2',
      question: 'Que change PAR ?',
      options: [
        {
          text: 'Le navigateur signe les paramètres au callback',
          explanation:
            'Le front channel transporte ensuite une référence ; les autres protections restent nécessaires.',
        },
        {
          text: 'Les paramètres sont poussés à l’AS avant la redirection',
          correct: true,
          explanation:
            'Le front channel transporte ensuite une référence ; les autres protections restent nécessaires.',
        },
        {
          text: 'Les paramètres sont remplacés par les claims de l’ID Token',
          explanation:
            'Le front channel transporte ensuite une référence ; les autres protections restent nécessaires.',
        },
      ],
    },
    {
      id: 'q3',
      question: 'Que permet RAR ?',
      options: [
        {
          text: 'Chiffrer tous les access tokens',
          explanation:
            'authorization_details précise l’objet de la demande ; il ne chiffre pas les tokens et n’authentifie pas le demandeur.',
        },
        {
          text: 'Remplacer l’authentification du client',
          explanation:
            'authorization_details précise l’objet de la demande ; il ne chiffre pas les tokens et n’authentifie pas le demandeur.',
        },
        {
          text: 'Exprimer une autorisation structurée',
          correct: true,
          explanation:
            'authorization_details précise l’objet de la demande ; il ne chiffre pas les tokens et n’authentifie pas le demandeur.',
        },
      ],
    },
  ],
  'oauth2/vocabulaire/decodage': [
    {
      id: 'q1',
      question: 'Que désigne Client en OAuth ?',
      options: [
        {
          text: 'Le navigateur de login',
          explanation:
            'Client est un rôle logique, compatible avec plusieurs formes de déploiement.',
        },
        {
          text: 'Le logiciel qui demande un accès',
          correct: true,
          explanation:
            'Client est un rôle logique, compatible avec plusieurs formes de déploiement.',
        },
        {
          text: 'Le serveur qui délivre les tokens',
          explanation:
            'Client est un rôle logique, compatible avec plusieurs formes de déploiement.',
        },
      ],
    },
    {
      id: 'q2',
      question: 'Qu’est-ce qu’un client confidentiel ?',
      options: [
        {
          text: 'Un client dont toutes les requêtes sont chiffrées par TLS',
          explanation:
            'La distinction concerne la capacité à protéger les credentials du client, pas simplement l’usage de TLS.',
        },
        {
          text: 'Un client capable de protéger ses moyens d’authentification',
          correct: true,
          explanation:
            'La distinction concerne la capacité à protéger les credentials du client, pas simplement l’usage de TLS.',
        },
        {
          text: 'Un client qui conserve ses tokens uniquement en mémoire',
          explanation:
            'La distinction concerne la capacité à protéger les credentials du client, pas simplement l’usage de TLS.',
        },
      ],
    },
    {
      id: 'q3',
      question: 'Que signifie bearer ?',
      options: [
        {
          text: 'Le token identifie son porteur',
          explanation:
            'Un bearer token n’exige pas de preuve de possession d’une clé par celui qui le présente.',
        },
        {
          text: 'Le token ne fonctionne que sur son appareil',
          explanation:
            'Un bearer token n’exige pas de preuve de possession d’une clé par celui qui le présente.',
        },
        {
          text: 'La possession du token permet son usage',
          correct: true,
          explanation:
            'Un bearer token n’exige pas de preuve de possession d’une clé par celui qui le présente.',
        },
      ],
    },
  ],
  'oauth2/attaques/bearer-dpop': [
    {
      id: 'q1',
      question: 'Que lie DPoP ?',
      options: [
        {
          text: 'L’identité civile à un certificat',
          explanation:
            'DPoP prouve la possession de clé lors de l’usage du token ; il n’est pas à lui seul une authentification du client enregistré.',
        },
        {
          text: 'Le mot de passe à la session du navigateur',
          explanation:
            'DPoP prouve la possession de clé lors de l’usage du token ; il n’est pas à lui seul une authentification du client enregistré.',
        },
        {
          text: 'L’usage d’un token à une clé du client',
          correct: true,
          explanation:
            'DPoP prouve la possession de clé lors de l’usage du token ; il n’est pas à lui seul une authentification du client enregistré.',
        },
      ],
    },
    {
      id: 'q2',
      question: 'À quoi sert ath dans une preuve DPoP envoyée au RS ?',
      options: [
        {
          text: 'À lier la preuve à l’access token présenté',
          correct: true,
          explanation:
            'ath est le hash complet SHA-256 du token ; il ne faut pas le confondre avec at_hash OIDC.',
        },
        {
          text: 'À lier la preuve au code reçu au callback',
          explanation:
            'ath est le hash complet SHA-256 du token ; il ne faut pas le confondre avec at_hash OIDC.',
        },
        {
          text: 'À lier la preuve au certificat TLS du RS',
          explanation:
            'ath est le hash complet SHA-256 du token ; il ne faut pas le confondre avec at_hash OIDC.',
        },
      ],
    },
    {
      id: 'q3',
      question: 'Pourquoi vérifier htm et htu ?',
      options: [
        {
          text: 'Pour identifier l’utilisateur',
          explanation:
            'Ces champs réduisent le réemploi d’une preuve sur une autre requête ; temps, jti et nonce éventuel complètent les contrôles.',
        },
        {
          text: 'Pour lier la preuve à la méthode et à la cible HTTP',
          correct: true,
          explanation:
            'Ces champs réduisent le réemploi d’une preuve sur une autre requête ; temps, jti et nonce éventuel complètent les contrôles.',
        },
        {
          text: 'Pour déterminer les scopes autorisés par le serveur',
          explanation:
            'Ces champs réduisent le réemploi d’une preuve sur une autre requête ; temps, jti et nonce éventuel complètent les contrôles.',
        },
      ],
    },
  ],
  'oauth2/autres-flows/client-credentials-device': [
    {
      id: 'q1',
      question: 'Quel client peut utiliser Client Credentials ?',
      options: [
        {
          text: 'Un client confidentiel autorisé à agir en son nom',
          correct: true,
          explanation:
            'RFC 6749 réserve ce grant aux clients confidentiels ; il ne nécessite pas de login interactif de l’utilisateur.',
        },
        {
          text: 'Un client public avec un secret intégré',
          explanation:
            'RFC 6749 réserve ce grant aux clients confidentiels ; il ne nécessite pas de login interactif de l’utilisateur.',
        },
        {
          text: 'Un navigateur qui possède un cookie de session utilisateur',
          explanation:
            'RFC 6749 réserve ce grant aux clients confidentiels ; il ne nécessite pas de login interactif de l’utilisateur.',
        },
      ],
    },
    {
      id: 'q2',
      question: 'Quel est le principe du Device Grant ?',
      options: [
        {
          text: 'Autoriser sur un autre appareil puis interroger le token endpoint',
          correct: true,
          explanation:
            'Le code affiché permet l’autorisation ailleurs ; le premier appareil récupère ensuite les tokens par polling.',
        },
        {
          text: 'Transporter l’access token dans un QR vers un second navigateur',
          explanation:
            'Le code affiché permet l’autorisation ailleurs ; le premier appareil récupère ensuite les tokens par polling.',
        },
        {
          text: 'Partager le mot de passe du téléphone avec l’appareil demandeur',
          explanation:
            'Le code affiché permet l’autorisation ailleurs ; le premier appareil récupère ensuite les tokens par polling.',
        },
      ],
    },
    {
      id: 'q3',
      question: 'Que faire après une réponse slow_down ?',
      options: [
        {
          text: 'Espacer les requêtes de polling suivantes',
          correct: true,
          explanation:
            'RFC 8628 impose d’augmenter l’intervalle ; authorization_pending signifie que l’autorisation n’est pas encore terminée.',
        },
        {
          text: 'Renvoyer le même device_code',
          explanation:
            'RFC 8628 impose d’augmenter l’intervalle ; authorization_pending signifie que l’autorisation n’est pas encore terminée.',
        },
        {
          text: 'Remplacer le polling par un flow Implicit',
          explanation:
            'RFC 8628 impose d’augmenter l’intervalle ; authorization_pending signifie que l’autorisation n’est pas encore terminée.',
        },
      ],
    },
  ],
  'oauth2/tokens/anatomie-tokens': [
    {
      id: 'q1',
      question: 'Un JWT validé localement reflète-t-il immédiatement une révocation ?',
      options: [
        {
          text: 'Pas sans information de statut supplémentaire',
          correct: true,
          explanation:
            'La signature locale ne consulte pas un état de révocation ; caches et politique déterminent la fraîcheur.',
        },
        {
          text: 'Oui, car sa signature est liée à l’état de l’AS',
          explanation:
            'La signature locale ne consulte pas un état de révocation ; caches et politique déterminent la fraîcheur.',
        },
        {
          text: 'Oui, dès que son refresh token a été révoqué',
          explanation:
            'La signature locale ne consulte pas un état de révocation ; caches et politique déterminent la fraîcheur.',
        },
      ],
    },
    {
      id: 'q2',
      question: 'Quel est le rôle du refresh token ?',
      options: [
        {
          text: 'Obtenir de nouveaux access tokens',
          correct: true,
          explanation:
            'Il est présenté au token endpoint avec les protections requises, pas comme access token au RS.',
        },
        {
          text: 'Autoriser une requête API',
          explanation:
            'Il est présenté au token endpoint avec les protections requises, pas comme access token au RS.',
        },
        {
          text: 'Décrire les claims du profil utilisateur',
          explanation:
            'Il est présenté au token endpoint avec les protections requises, pas comme access token au RS.',
        },
      ],
    },
    {
      id: 'q3',
      question: 'Révoquer un refresh token invalide-t-il toujours les access tokens associés ?',
      options: [
        {
          text: 'Oui, toute signature associée devient invérifiable',
          explanation:
            'RFC 7009 formule une recommandation conditionnelle ; la propagation dépend aussi des ressources.',
        },
        {
          text: 'Non, l’effet dépend des capacités et de la politique',
          correct: true,
          explanation:
            'RFC 7009 formule une recommandation conditionnelle ; la propagation dépend aussi des ressources.',
        },
        {
          text: 'Oui, chaque ressource consulte automatiquement l’AS',
          explanation:
            'RFC 7009 formule une recommandation conditionnelle ; la propagation dépend aussi des ressources.',
        },
      ],
    },
  ],
  'oidc/discovery/well-known': [
    {
      id: 'q1',
      question: 'Quel point de départ doit être établi avant la Discovery ?',
      options: [
        {
          text: 'Le kid présent dans un jeton reçu sans contexte',
          explanation:
            'La découverte configure un OP attendu ; un jeton non validé ne doit pas décider librement des endpoints de confiance.',
        },
        {
          text: 'L’adresse email revendiquée dans le payload',
          explanation:
            'La découverte configure un OP attendu ; un jeton non validé ne doit pas décider librement des endpoints de confiance.',
        },
        {
          text: 'L’Issuer auquel le RP entend faire confiance',
          correct: true,
          explanation:
            'La découverte configure un OP attendu ; un jeton non validé ne doit pas décider librement des endpoints de confiance.',
        },
      ],
    },
    {
      id: 'q2',
      question: 'Que doit-on vérifier dans la réponse Discovery ?',
      options: [
        {
          text: 'Que toutes les clés portent le même kid',
          explanation:
            'La concordance exacte de l’Issuer protège contre la substitution de configuration ; ses endpoints sont ensuite validés selon le profil.',
        },
        {
          text: 'Que issuer correspond à l’Issuer attendu',
          correct: true,
          explanation:
            'La concordance exacte de l’Issuer protège contre la substitution de configuration ; ses endpoints sont ensuite validés selon le profil.',
        },
        {
          text: 'Que toutes les URL utilisent le même chemin',
          explanation:
            'La concordance exacte de l’Issuer protège contre la substitution de configuration ; ses endpoints sont ensuite validés selon le profil.',
        },
      ],
    },
    {
      id: 'q3',
      question: 'À quoi sert kid ?',
      options: [
        {
          text: 'Prouver l’identité du signataire',
          explanation:
            'kid est un indice ; la confiance dans l’Issuer et la provenance des clés doivent déjà être établies.',
        },
        {
          text: 'Sélectionner une clé dans un ensemble reconnu',
          correct: true,
          explanation:
            'kid est un indice ; la confiance dans l’Issuer et la provenance des clés doivent déjà être établies.',
        },
        {
          text: 'Désigner le sujet de l’authentification courante',
          explanation:
            'kid est un indice ; la confiance dans l’Issuer et la provenance des clés doivent déjà être établies.',
        },
      ],
    },
  ],
  'oidc/oidc-vs-saml/comparaison': [
    {
      id: 'q1',
      question: 'Quelle différence de format décrit les exemples habituels ?',
      options: [
        {
          text: 'JSON SAML et certificat OIDC',
          explanation:
            'Les deux familles ont des règles de signature, de transport et de validation propres.',
        },
        {
          text: 'Cookie signé SAML et token opaque OIDC',
          explanation:
            'Les deux familles ont des règles de signature, de transport et de validation propres.',
        },
        {
          text: 'Assertion XML SAML et JWT OIDC',
          correct: true,
          explanation:
            'Les deux familles ont des règles de signature, de transport et de validation propres.',
        },
      ],
    },
    {
      id: 'q2',
      question: 'Quelle propriété est commune aux deux approches fédérées ?',
      options: [
        {
          text: 'Le service reçoit toujours le mot de passe de l’utilisateur',
          explanation:
            'Une nouvelle authentification fédérée implique le fournisseur ; la session locale peut fonctionner ensuite sans le contacter.',
        },
        {
          text: 'Le fournisseur est contacté pour chaque clic applicatif',
          explanation:
            'Une nouvelle authentification fédérée implique le fournisseur ; la session locale peut fonctionner ensuite sans le contacter.',
        },
        {
          text: 'Le service accepte une identité attestée par un fournisseur',
          correct: true,
          explanation:
            'Une nouvelle authentification fédérée implique le fournisseur ; la session locale peut fonctionner ensuite sans le contacter.',
        },
      ],
    },
    {
      id: 'q3',
      question: 'Quel critère guide une comparaison utile ?',
      options: [
        {
          text: 'Les intégrations et garanties attendues du système',
          correct: true,
          explanation:
            'Format, profils, exploitation et validation doivent être comparés dans un contexte équivalent.',
        },
        {
          text: 'La longueur moyenne des messages de démonstration',
          explanation:
            'Format, profils, exploitation et validation doivent être comparés dans un contexte équivalent.',
        },
        {
          text: 'La couleur attribuée à chaque protocole du tableau',
          explanation:
            'Format, profils, exploitation et validation doivent être comparés dans un contexte équivalent.',
        },
      ],
    },
  ],
  'oidc/id-token/anatomie-id-token': [
    {
      id: 'q1',
      question: 'Quelle paire identifie le sujet sans dépendre de son email ?',
      options: [
        {
          text: 'aud et iat',
          explanation:
            'sub est unique dans le domaine de l’Issuer ; l’email peut changer ou être réattribué.',
        },
        {
          text: 'iss et sub',
          correct: true,
          explanation:
            'sub est unique dans le domaine de l’Issuer ; l’email peut changer ou être réattribué.',
        },
        {
          text: 'acr et amr',
          explanation:
            'sub est unique dans le domaine de l’Issuer ; l’email peut changer ou être réattribué.',
        },
      ],
    },
    {
      id: 'q2',
      question: 'Quelle différence sépare acr et amr ?',
      options: [
        {
          text: 'Contexte d’authentification et méthodes utilisées',
          correct: true,
          explanation:
            'acr désigne une classe convenue ; amr décrit les méthodes. Leur interprétation dépend du profil.',
        },
        {
          text: 'Date de connexion et date d’émission',
          explanation:
            'acr désigne une classe convenue ; amr décrit les méthodes. Leur interprétation dépend du profil.',
        },
        {
          text: 'Identifiant de l’utilisateur et destinataire du token',
          explanation:
            'acr désigne une classe convenue ; amr décrit les méthodes. Leur interprétation dépend du profil.',
        },
      ],
    },
    {
      id: 'q3',
      question: 'Comment traiter azp dans Core errata set 2 ?',
      options: [
        {
          text: 'Comme un claim toujours requis',
          explanation:
            'Core renvoie aux extensions pour les contrôles azp ; ne pas appliquer une règle universelle copiée d’un ancien tutoriel.',
        },
        {
          text: 'Comme la clé publique servant à vérifier le token',
          explanation:
            'Core renvoie aux extensions pour les contrôles azp ; ne pas appliquer une règle universelle copiée d’un ancien tutoriel.',
        },
        {
          text: 'Selon l’extension qui le fait apparaître',
          correct: true,
          explanation:
            'Core renvoie aux extensions pour les contrôles azp ; ne pas appliquer une règle universelle copiée d’un ancien tutoriel.',
        },
      ],
    },
  ],
  'oidc/validation/jwks-kid-verify': [
    {
      id: 'q1',
      question: 'Une signature valide suffit-elle à accepter l’ID Token ?',
      options: [
        {
          text: 'Non, il faut aussi valider son contexte',
          correct: true,
          explanation:
            'Issuer, audience, dates et paramètres de la demande doivent être contrôlés selon le flow et le profil.',
        },
        {
          text: 'Oui, si l’algorithme utilisé est ES256',
          explanation:
            'Issuer, audience, dates et paramètres de la demande doivent être contrôlés selon le flow et le profil.',
        },
        {
          text: 'Oui, si le header contient un kid connu',
          explanation:
            'Issuer, audience, dates et paramètres de la demande doivent être contrôlés selon le flow et le profil.',
        },
      ],
    },
    {
      id: 'q2',
      question:
        'Les treize points de Core sont-ils treize opérations identiques pour tous les tokens ?',
      options: [
        {
          text: 'Oui, chaque jeton nécessite treize calculs',
          explanation:
            'Chiffrement, MAC, azp, nonce et contexte d’authentification comportent leurs propres conditions.',
        },
        {
          text: 'Oui, tous les algorithmes utilisent le JWKS',
          explanation:
            'Chiffrement, MAC, azp, nonce et contexte d’authentification comportent leurs propres conditions.',
        },
        {
          text: 'Non, plusieurs contrôles sont conditionnels',
          correct: true,
          explanation:
            'Chiffrement, MAC, azp, nonce et contexte d’authentification comportent leurs propres conditions.',
        },
      ],
    },
    {
      id: 'q3',
      question: 'Que prouve le bouton de signature du laboratoire OIDC ?',
      options: [
        {
          text: 'La validation OIDC complète',
          explanation:
            'Le laboratoire démontre une primitive ; il ne réalise ni tous les contrôles Core ni une découverte générale de confiance.',
        },
        {
          text: 'La validité ES256 avec la clé fournie',
          correct: true,
          explanation:
            'Le laboratoire démontre une primitive ; il ne réalise ni tous les contrôles Core ni une découverte générale de confiance.',
        },
        {
          text: 'La confiance dans toute clé publiée en ligne',
          explanation:
            'Le laboratoire démontre une primitive ; il ne réalise ni tous les contrôles Core ni une découverte générale de confiance.',
        },
      ],
    },
  ],
  'oidc/nonce-at-hash/liaisons': [
    {
      id: 'q1',
      question: 'at_hash est-il requis dans tout ID Token de code flow ?',
      options: [
        {
          text: 'Oui, dès qu’un access token est retourné',
          explanation:
            'Core §3.1.3.6 le rend optionnel dans ce cas ; son contrôle est permis par §3.1.3.8.',
        },
        {
          text: 'Non, il est optionnel au token endpoint',
          correct: true,
          explanation:
            'Core §3.1.3.6 le rend optionnel dans ce cas ; son contrôle est permis par §3.1.3.8.',
        },
        {
          text: 'Oui, dès qu’une requête contient state',
          explanation:
            'Core §3.1.3.6 le rend optionnel dans ce cas ; son contrôle est permis par §3.1.3.8.',
        },
      ],
    },
    {
      id: 'q2',
      question: 'Que hache sd_hash, contrairement à at_hash ?',
      options: [
        {
          text: 'La moitié gauche du code reçu dans le callback',
          explanation:
            'sd_hash couvre la présentation exacte, tilde final inclus ; at_hash lie un access token à l’ID Token.',
        },
        {
          text: 'La partie SD-JWT présentée avec ses disclosures',
          correct: true,
          explanation:
            'sd_hash couvre la présentation exacte, tilde final inclus ; at_hash lie un access token à l’ID Token.',
        },
        {
          text: 'La clé publique du serveur qui a émis le token',
          explanation:
            'sd_hash couvre la présentation exacte, tilde final inclus ; at_hash lie un access token à l’ID Token.',
        },
      ],
    },
    {
      id: 'q3',
      question: 'Quel champ OIDC lie la demande au payload signé retourné ?',
      options: [
        {
          text: 'state',
          explanation:
            'nonce est recopié dans l’ID Token ; state revient dans la réponse d’autorisation pour la corrélation du callback.',
        },
        {
          text: 'nonce',
          correct: true,
          explanation:
            'nonce est recopié dans l’ID Token ; state revient dans la réponse d’autorisation pour la corrélation du callback.',
        },
        {
          text: 'scope',
          explanation:
            'nonce est recopié dans l’ID Token ; state revient dans la réponse d’autorisation pour la corrélation du callback.',
        },
      ],
    },
  ],
  'oidc/pourquoi-oidc/anti-pattern-login': [
    {
      id: 'q1',
      question: 'Pourquoi un access token ne suffit-il pas à créer une session OIDC ?',
      options: [
        {
          text: 'Il ne peut contenir aucun claim relatif à son destinataire',
          explanation:
            'Même avec aud et sub, un access token n’a pas le contrat de validation d’un ID Token lié à la demande du RP.',
        },
        {
          text: 'Il ne peut être émis que pour un logiciel sans utilisateur',
          explanation:
            'Même avec aud et sub, un access token n’a pas le contrat de validation d’un ID Token lié à la demande du RP.',
        },
        {
          text: 'Il n’est pas le résultat d’authentification destiné à ce RP',
          correct: true,
          explanation:
            'Même avec aud et sub, un access token n’a pas le contrat de validation d’un ID Token lié à la demande du RP.',
        },
      ],
    },
    {
      id: 'q2',
      question: 'Qui est le destinataire d’un ID Token ?',
      options: [
        {
          text: 'La ressource appelée avec le token',
          explanation:
            'Le RP doit vérifier que aud le désigne, et appliquer les autres contrôles OIDC.',
        },
        {
          text: 'Le RP identifié dans son audience',
          correct: true,
          explanation:
            'Le RP doit vérifier que aud le désigne, et appliquer les autres contrôles OIDC.',
        },
        {
          text: 'Le navigateur choisi par l’OP',
          explanation:
            'Le RP doit vérifier que aud le désigne, et appliquer les autres contrôles OIDC.',
        },
      ],
    },
    {
      id: 'q3',
      question: 'Quel scope déclenche une demande OIDC ?',
      options: [
        {
          text: 'profile',
          explanation:
            'openid identifie la demande OpenID Connect ; profile et email portent sur des ensembles de claims.',
        },
        {
          text: 'email',
          explanation:
            'openid identifie la demande OpenID Connect ; profile et email portent sur des ensembles de claims.',
        },
        {
          text: 'openid',
          correct: true,
          explanation:
            'openid identifie la demande OpenID Connect ; profile et email portent sur des ensembles de claims.',
        },
      ],
    },
  ],
  'oidc/flow-complet/flow-pas-a-pas': [
    {
      id: 'q1',
      question: 'Après le 302 de l’OP, qui appelle le callback du RP ?',
      options: [
        {
          text: 'Le token endpoint de l’OP',
          explanation:
            'Le navigateur suit Location ; le RP contacte /token après avoir reçu et corrélé le code.',
        },
        {
          text: 'Le navigateur de l’utilisateur',
          correct: true,
          explanation:
            'Le navigateur suit Location ; le RP contacte /token après avoir reçu et corrélé le code.',
        },
        {
          text: 'Le serveur de ressources',
          explanation:
            'Le navigateur suit Location ; le RP contacte /token après avoir reçu et corrélé le code.',
        },
      ],
    },
    {
      id: 'q2',
      question: 'Quel token utilise le RP pour appeler UserInfo ?',
      options: [
        {
          text: 'L’access token autorisé pour cette ressource',
          correct: true,
          explanation:
            'UserInfo est une ressource OAuth ; le RP doit aussi comparer le sub retourné à celui de l’ID Token.',
        },
        {
          text: 'L’ID Token destiné à sa propre application',
          explanation:
            'UserInfo est une ressource OAuth ; le RP doit aussi comparer le sub retourné à celui de l’ID Token.',
        },
        {
          text: 'Le refresh token reçu lors du code flow',
          explanation:
            'UserInfo est une ressource OAuth ; le RP doit aussi comparer le sub retourné à celui de l’ID Token.',
        },
      ],
    },
    {
      id: 'q3',
      question: 'nonce est-il toujours obligatoire en code flow OIDC ?',
      options: [
        {
          text: 'Non, mais il doit être vérifié s’il a été envoyé',
          correct: true,
          explanation:
            'Core le rend optionnel dans la demande code ; sa présence initiale impose la concordance dans l’ID Token.',
        },
        {
          text: 'Oui, même si le RP n’a pas émis de demande nonce',
          explanation:
            'Core le rend optionnel dans la demande code ; sa présence initiale impose la concordance dans l’ID Token.',
        },
        {
          text: 'Non, et l’OP peut le modifier librement au retour',
          explanation:
            'Core le rend optionnel dans la demande code ; sa présence initiale impose la concordance dans l’ID Token.',
        },
      ],
    },
  ],
  'oid4vci/eidas/contexte-eudi': [
    {
      id: 'q1',
      question: 'Quel rôle joue un profil d’écosystème ?',
      options: [
        {
          text: 'Sélectionner des options pour l’interopérabilité',
          correct: true,
          explanation:
            'Les protocoles offrent des choix ; un profil fixe les combinaisons et exigences applicables à un contexte.',
        },
        {
          text: 'Remplacer toute validation des signatures reçues',
          explanation:
            'Les protocoles offrent des choix ; un profil fixe les combinaisons et exigences applicables à un contexte.',
        },
        {
          text: 'Garantir la conformité juridique de chaque logiciel',
          explanation:
            'Les protocoles offrent des choix ; un profil fixe les combinaisons et exigences applicables à un contexte.',
        },
      ],
    },
    {
      id: 'q2',
      question: 'Qu’est-ce que le WSCD dans ce contexte ?',
      options: [
        {
          text: 'Le composant de protection cryptographique du wallet',
          correct: true,
          explanation:
            'La protection des clés est une couche distincte des messages OID4VCI et OID4VP.',
        },
        {
          text: 'Le serveur qui héberge les demandes DCQL du Verifier',
          explanation:
            'La protection des clés est une couche distincte des messages OID4VCI et OID4VP.',
        },
        {
          text: 'Le format de sérialisation des attestations d’identité',
          explanation:
            'La protection des clés est une couche distincte des messages OID4VCI et OID4VP.',
        },
      ],
    },
    {
      id: 'q3',
      question: 'Ce cours démontre-t-il une certification EUDI complète ?',
      options: [
        {
          text: 'Oui, dès que les signatures des fixtures sont valides',
          explanation:
            'Conformité de profil, exigences réglementaires et certification demandent d’autres preuves et vérifications.',
        },
        {
          text: 'Non, il explique un périmètre pédagogique annoncé',
          correct: true,
          explanation:
            'Conformité de profil, exigences réglementaires et certification demandent d’autres preuves et vérifications.',
        },
        {
          text: 'Oui, parce que les protocoles OpenID sont finaux',
          explanation:
            'Conformité de profil, exigences réglementaires et certification demandent d’autres preuves et vérifications.',
        },
      ],
    },
  ],
  'oid4vci/proof-of-possession/c-nonce-jwt-proof': [
    {
      id: 'q1',
      question: 'Qui est désigné par aud dans le proof jwt VCI ?',
      options: [
        {
          text: 'Le Verifier OID4VP',
          explanation:
            'Cette preuve appartient à l’émission ; le KB-JWT ultérieur vise un autre destinataire.',
        },
        {
          text: 'Le navigateur du RP',
          explanation:
            'Cette preuve appartient à l’émission ; le KB-JWT ultérieur vise un autre destinataire.',
        },
        {
          text: 'Le Credential Issuer',
          correct: true,
          explanation:
            'Cette preuve appartient à l’émission ; le KB-JWT ultérieur vise un autre destinataire.',
        },
      ],
    },
    {
      id: 'q2',
      question: 'Un c_nonce est-il nécessairement consommé après un seul usage ?',
      options: [
        {
          text: 'Oui, sa forme JWT le rend automatiquement unique',
          explanation:
            'OID4VCI ne fait pas du nonce une transaction à usage unique ; la fraîcheur doit être contrôlée selon la politique.',
        },
        {
          text: 'Non, sa politique d’acceptation relève de l’Issuer',
          correct: true,
          explanation:
            'OID4VCI ne fait pas du nonce une transaction à usage unique ; la fraîcheur doit être contrôlée selon la politique.',
        },
        {
          text: 'Oui, il est toujours l’identifiant du credential émis',
          explanation:
            'OID4VCI ne fait pas du nonce une transaction à usage unique ; la fraîcheur doit être contrôlée selon la politique.',
        },
      ],
    },
    {
      id: 'q3',
      question: 'Que garantit le proof jwt à lui seul ?',
      options: [
        {
          text: 'Le contrôle de la clé qui signe la preuve',
          correct: true,
          explanation:
            'L’autorisation d’émettre et les propriétés de stockage sont des contrôles distincts.',
        },
        {
          text: 'Le droit de recevoir toute sorte de credential',
          explanation:
            'L’autorisation d’émettre et les propriétés de stockage sont des contrôles distincts.',
        },
        {
          text: 'La protection matérielle de la clé dans l’appareil',
          explanation:
            'L’autorisation d’émettre et les propriétés de stockage sont des contrôles distincts.',
        },
      ],
    },
  ],
  'oid4vci/authorization-code/wallet-initiated': [
    {
      id: 'q1',
      question: 'Credential Issuer et Authorization Server sont-ils toujours le même service ?',
      options: [
        {
          text: 'Oui, car ils doivent partager la même clé de signature',
          explanation:
            'Les métadonnées permettent de découvrir l’AS ; les exemples réunissent explicitement ces deux rôles.',
        },
        {
          text: 'Non, leurs rôles peuvent être déployés séparément',
          correct: true,
          explanation:
            'Les métadonnées permettent de découvrir l’AS ; les exemples réunissent explicitement ces deux rôles.',
        },
        {
          text: 'Oui, car le credential endpoint est le token endpoint',
          explanation:
            'Les métadonnées permettent de découvrir l’AS ; les exemples réunissent explicitement ces deux rôles.',
        },
      ],
    },
    {
      id: 'q2',
      question: 'D’où vient credential_configuration_id ?',
      options: [
        {
          text: 'Du catalogue des configurations de l’Issuer',
          correct: true,
          explanation:
            'Le wallet choisit une configuration annoncée, puis suit les identifiants autorisés dans les réponses.',
        },
        {
          text: 'Du sujet sub inscrit dans le dernier ID Token',
          explanation:
            'Le wallet choisit une configuration annoncée, puis suit les identifiants autorisés dans les réponses.',
        },
        {
          text: 'De la clé privée créée par le wallet à l’installation',
          explanation:
            'Le wallet choisit une configuration annoncée, puis suit les identifiants autorisés dans les réponses.',
        },
      ],
    },
    {
      id: 'q3',
      question:
        'Si credential_identifier est utilisé dans la requête d’émission, faut-il aussi credential_configuration_id ?',
      options: [
        {
          text: 'Non, ces deux sélecteurs ne se combinent pas',
          correct: true,
          explanation:
            'La sélection dépend du mode d’autorisation et des identifiants reçus ; OID4VCI §8.2 définit l’exclusion.',
        },
        {
          text: 'Oui, les deux doivent toujours être identiques',
          explanation:
            'La sélection dépend du mode d’autorisation et des identifiants reçus ; OID4VCI §8.2 définit l’exclusion.',
        },
        {
          text: 'Oui, le second sert à vérifier la signature du premier',
          explanation:
            'La sélection dépend du mode d’autorisation et des identifiants reçus ; OID4VCI §8.2 définit l’exclusion.',
        },
      ],
    },
  ],
  'oid4vci/formats/sd-jwt-vc-mdoc': [
    {
      id: 'q1',
      question: 'Quelle valeur typ est utilisée par le draft SD-JWT VC 19 ?',
      options: [
        {
          text: 'vc+sd-jwt',
          explanation:
            'vc+sd-jwt est historique ; le draft 19 ne contient plus la note d’acceptation transitoire des deux valeurs.',
        },
        {
          text: 'dc+sd-jwt',
          correct: true,
          explanation:
            'vc+sd-jwt est historique ; le draft 19 ne contient plus la note d’acceptation transitoire des deux valeurs.',
        },
        {
          text: 'openid4vci-proof+jwt',
          explanation:
            'vc+sd-jwt est historique ; le draft 19 ne contient plus la note d’acceptation transitoire des deux valeurs.',
        },
      ],
    },
    {
      id: 'q2',
      question: 'Où trouve-t-on les valeurs rendues sélectivement divulgables ?',
      options: [
        {
          text: 'Dans les disclosures associées au JWT signé',
          correct: true,
          explanation:
            'Le JWT signé contient leurs digests ; transmettre une disclosure permet d’en contrôler la correspondance.',
        },
        {
          text: 'Dans le header JOSE qui contient la clé de l’Issuer',
          explanation:
            'Le JWT signé contient leurs digests ; transmettre une disclosure permet d’en contrôler la correspondance.',
        },
        {
          text: 'Dans le champ sd_hash de la réponse du Verifier',
          explanation:
            'Le JWT signé contient leurs digests ; transmettre une disclosure permet d’en contrôler la correspondance.',
        },
      ],
    },
    {
      id: 'q3',
      question: 'Le binding mdoc utilise-t-il un KB-JWT ?',
      options: [
        {
          text: 'Oui, avec un header typ égal à mso_mdoc',
          explanation:
            'mdoc lie sa clé device via le MSO et utilise le contexte de session du profil ; ce n’est pas le mécanisme SD-JWT.',
        },
        {
          text: 'Oui, mais seulement pour les données révélées',
          explanation:
            'mdoc lie sa clé device via le MSO et utilise le contexte de session du profil ; ce n’est pas le mécanisme SD-JWT.',
        },
        {
          text: 'Non, il utilise ses mécanismes DeviceAuthentication',
          correct: true,
          explanation:
            'mdoc lie sa clé device via le MSO et utilise le contexte de session du profil ; ce n’est pas le mécanisme SD-JWT.',
        },
      ],
    },
  ],
  'oid4vci/key-attestation/attester-la-cle': [
    {
      id: 'q1',
      question: 'Qui signe une key attestation ?',
      options: [
        {
          text: 'Un tiers attestant reconnu par l’Issuer',
          correct: true,
          explanation:
            'L’Issuer doit valider le tiers et les propriétés attestées, pas seulement la syntaxe du JWT.',
        },
        {
          text: 'Le Verifier qui reçoit la future présentation',
          explanation:
            'L’Issuer doit valider le tiers et les propriétés attestées, pas seulement la syntaxe du JWT.',
        },
        {
          text: 'Le navigateur qui affiche l’offre d’émission',
          explanation:
            'L’Issuer doit valider le tiers et les propriétés attestées, pas seulement la syntaxe du JWT.',
        },
      ],
    },
    {
      id: 'q2',
      question:
        'Le proof de type attestation exige-t-il toujours une signature des clés attestées ?',
      options: [
        {
          text: 'Non, il peut transporter l’attestation sans cette signature',
          correct: true,
          explanation:
            'L’annexe F distingue ce proof d’un proof jwt qui signe avec une clé et transporte key_attestation dans le header.',
        },
        {
          text: 'Oui, chaque clé attestée doit signer le credential émis',
          explanation:
            'L’annexe F distingue ce proof d’un proof jwt qui signe avec une clé et transporte key_attestation dans le header.',
        },
        {
          text: 'Oui, chaque clé attestée doit signer un KB-JWT pour l’Issuer',
          explanation:
            'L’annexe F distingue ce proof d’un proof jwt qui signe avec une clé et transporte key_attestation dans le header.',
        },
      ],
    },
    {
      id: 'q3',
      question: 'Une attestation suffit-elle à identifier la personne qui utilise l’appareil ?',
      options: [
        {
          text: 'Oui, une clé non exportable implique une identité civile',
          explanation:
            'Enrôlement, protection de clé et authentification de l’utilisateur fournissent des garanties différentes.',
        },
        {
          text: 'Oui, toute signature établit la présence physique du sujet',
          explanation:
            'Enrôlement, protection de clé et authentification de l’utilisateur fournissent des garanties différentes.',
        },
        {
          text: 'Non, la clé et la personne sont deux objets de contrôle',
          correct: true,
          explanation:
            'Enrôlement, protection de clé et authentification de l’utilisateur fournissent des garanties différentes.',
        },
      ],
    },
  ],
  'oid4vci/paradigme/phone-home': [
    {
      id: 'q1',
      question: 'Que découple le modèle wallet étudié ?',
      options: [
        {
          text: 'L’émission du credential et sa présentation',
          correct: true,
          explanation:
            'Le Verifier peut vérifier un credential déjà émis sans solliciter l’Issuer pour chaque présentation.',
        },
        {
          text: 'La signature de l’Issuer et la validité des claims',
          explanation:
            'Le Verifier peut vérifier un credential déjà émis sans solliciter l’Issuer pour chaque présentation.',
        },
        {
          text: 'L’autorisation d’émettre et toute preuve de contexte',
          explanation:
            'Le Verifier peut vérifier un credential déjà émis sans solliciter l’Issuer pour chaque présentation.',
        },
      ],
    },
    {
      id: 'q2',
      question: 'Peut-on garantir que l’Issuer ne connaîtra aucun usage ?',
      options: [
        {
          text: 'Oui, puisque le diagramme ne montre aucune flèche vers lui',
          explanation:
            'Le dessin présente un parcours sous hypothèses ; il ne prouve pas une absence générale de fuite.',
        },
        {
          text: 'Oui, dès que le wallet masque un claim de la présentation',
          explanation:
            'Le dessin présente un parcours sous hypothèses ; il ne prouve pas une absence générale de fuite.',
        },
        {
          text: 'Non, statut et collusion peuvent révéler des traces',
          correct: true,
          explanation:
            'Le dessin présente un parcours sous hypothèses ; il ne prouve pas une absence générale de fuite.',
        },
      ],
    },
    {
      id: 'q3',
      question: 'Une session applicative OIDC contacte-t-elle l’OP à chaque action ?',
      options: [
        {
          text: 'Toujours, car l’ID Token est consommé à chaque action',
          explanation:
            'Il faut comparer une nouvelle authentification à une présentation, pas chaque usage de session à une nouvelle connexion.',
        },
        {
          text: 'Toujours, car UserInfo doit vérifier chaque clic du RP',
          explanation:
            'Il faut comparer une nouvelle authentification à une présentation, pas chaque usage de session à une nouvelle connexion.',
        },
        {
          text: 'Pas nécessairement, le RP peut maintenir sa session',
          correct: true,
          explanation:
            'Il faut comparer une nouvelle authentification à une présentation, pas chaque usage de session à une nouvelle connexion.',
        },
      ],
    },
  ],
  'oid4vci/credential-offer/pre-authorized': [
    {
      id: 'q1',
      question: 'Que contient un Credential Offer ?',
      options: [
        {
          text: 'Un credential déjà signé par le Verifier',
          explanation:
            'L’offer identifie notamment l’Issuer et les configurations ; il peut annoncer un grant préautorisé.',
        },
        {
          text: 'La clé privée que le wallet doit utiliser',
          explanation:
            'L’offer identifie notamment l’Issuer et les configurations ; il peut annoncer un grant préautorisé.',
        },
        {
          text: 'Des informations pour amorcer une émission',
          correct: true,
          explanation:
            'L’offer identifie notamment l’Issuer et les configurations ; il peut annoncer un grant préautorisé.',
        },
      ],
    },
    {
      id: 'q2',
      question: 'Quel format OID4VCI impose-t-il universellement ?',
      options: [
        {
          text: 'Aucun format unique de credential',
          correct: true,
          explanation:
            'OID4VCI profile plusieurs formats, dont SD-JWT VC et mdoc ; le cours choisit le premier pour ses calculs.',
        },
        {
          text: 'SD-JWT VC pour toutes les émissions',
          explanation:
            'OID4VCI profile plusieurs formats, dont SD-JWT VC et mdoc ; le cours choisit le premier pour ses calculs.',
        },
        {
          text: 'mdoc pour les seules émissions distantes',
          explanation:
            'OID4VCI profile plusieurs formats, dont SD-JWT VC et mdoc ; le cours choisit le premier pour ses calculs.',
        },
      ],
    },
    {
      id: 'q3',
      question: 'À quoi sert tx_code dans le parcours illustré ?',
      options: [
        {
          text: 'Ajouter un contrôle à l’échange du code préautorisé',
          correct: true,
          explanation:
            'S’il est requis, tx_code est vérifié au token endpoint ; ce n’est ni une clé de chiffrement ni une preuve de possession.',
        },
        {
          text: 'Chiffrer les disclosures qui accompagnent le credential',
          explanation:
            'S’il est requis, tx_code est vérifié au token endpoint ; ce n’est ni une clé de chiffrement ni une preuve de possession.',
        },
        {
          text: 'Remplacer la signature de la preuve de clé du wallet',
          explanation:
            'S’il est requis, tx_code est vérifié au token endpoint ; ce n’est ni une clé de chiffrement ni une preuve de possession.',
        },
      ],
    },
  ],
}
