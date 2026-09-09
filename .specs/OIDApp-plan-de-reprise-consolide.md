# OIDApp — Plan de reprise consolidé

Document de travail du 5 septembre 2026 — version 1.

Dépôt analysé : `/Users/bob/codes/OIDApp` ; commit de référence : `9ea321509293b4d2b2c804df6c1002e3375f7a3d`. L'arbre Git était propre lors du relevé.

Ce document consolide l'audit initial et les notes d'Hector transmises par Benoit. Il prépare les modifications ultérieures ; aucune modification de l'application n'a été effectuée pour le produire. Les commentaires des documents et du code sont des éléments examinés, pas des instructions de mise en œuvre.

## Utilisation et portée

Les éléments ci-dessous sont ordonnés par dépendance. Chaque identifiant Rxx constitue une unité de reprise que l'on pourra discuter, réaliser et valider séparément. Toutes les cases restent ouvertes : « confirmé » qualifie le constat, pas la réalisation du travail.

**Priorités :** P1 = compréhension ou exactitude compromise ; P2 = approfondissement et cohérence ; P3 = extension de couverture. La priorité exprime l'impact sur un cours, pas une vulnérabilité exploitable d'un service de production.

**Qualification :** confirmé = établi dans le dépôt ou la spécification ; à nuancer = fond pertinent, formulation trop générale ; déjà correct = ne pas introduire une correction inverse ; pédagogique = choix d'enseignement ; à cadrer = profondeur à décider avant réalisation.

Le périmètre porte sur le contenu, les exemples, les fixtures, les interactions pédagogiques et leurs vérifications. Il ne constitue ni une certification OpenID, ni un audit de sécurité d'un serveur réel. L'audit ISO/mdoc complet et la conformité juridique EUDI ne sont pas établis ici.

Les signatures des fixtures OIDC/VCI/VP, les digests VCI, le `sd_hash` VP et les liens cryptographiques DPoP ont été vérifiés indépendamment pendant l'audit initial. Ces résultats sont à préserver. Ils ne prouvent pas la validité temporelle des fixtures ni la conformité de tous les échanges HTTP. La suite applicative complète n'a pas été relancée pour cette consolidation.

## Arbitrage explicite des notes d'Hector

| Note | Remarque reformulée                                                      | Qualification et traitement                                                                                                                                             | Reprises      |
| ---- | ------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| H01  | La longueur indique la bonne réponse au quiz.                            | Confirmé et quantifié ; le placement constitue aussi un indice.                                                                                                         | R08           |
| H02  | Les rôles des claims JWT sont insuffisamment et inégalement décrits.     | Confirmé : le dictionnaire commun ne couvre pas de nombreux champs des fixtures.                                                                                        | R04, R07, R15 |
| H03  | Des notions sont expliquées après leur utilisation.                      | Pédagogique ; établir les prérequis plutôt que déplacer isolément des paragraphes.                                                                                      | R03           |
| H04  | Le terme « phase » perturbe le repérage.                                 | Confirmé dans le curriculum, des interfaces et les leçons.                                                                                                              | R02           |
| H05  | Le Client OAuth n'est pas surtout un serveur par définition.             | Retenu : rôle logique et forme de déploiement doivent être séparés.                                                                                                     | R09, R12      |
| H06  | OAuth suppose une authentification sans en définir la méthode.           | Retenu avec portée : préciser le grant et qui est authentifié ; éviter « authentification utilisateur obligatoire dans tous les grants ».                               | R09           |
| H07  | L'authentification du client n'est pas mentionnée.                       | À nuancer : elle apparaît déjà, notamment dans les en-têtes Basic des scénarios. Elle n'est pas suffisamment structurée comme notion.                                   | R10           |
| H08  | Digest et Kerberos existaient avant OAuth.                               | Retenu comme correction du récit historique ; Kerberos n'est pas limité au local et l'authentification ne se confond pas avec la délégation OAuth.                      | R11           |
| H09  | L'access token peut traverser le navigateur en Implicit.                 | Retenu ; Implicit est déjà traité au chapitre 5, pas seulement au 7. Le problème est surtout l'interdiction générale enseignée auparavant.                              | R12, R13      |
| H10  | Il manque `acr`, `amr`, `azp` et l'extensibilité de l'ID Token.          | Retenu avec conditions propres à chaque claim et version de Core explicitée.                                                                                            | R15, R17      |
| H11  | Il manque le passage navigateur → callback RP avant `/token`.            | Confirmé dans le scénario OIDC : le dessin passe du 302 à l'appel du RP.                                                                                                | R16           |
| H12  | Les treize étapes de validation sont annoncées mais non détaillées.      | Confirmé ; les conditions d'applicabilité comptent autant que la liste.                                                                                                 | R17           |
| H13  | Le tableau OIDC/SAML est cassé.                                          | Confirmé dans la structure du code ; problème potentiellement partagé par d'autres tableaux.                                                                            | R05           |
| H14  | SD-JWT VC paraît être le format officiel unique.                         | À nuancer : mdoc est bien décrit au chapitre 4 ; le déséquilibre des exemples initiaux entretient cette impression.                                                     | R19           |
| H15  | « Back channel » n'a pas de sens en VCI/VP.                              | Ne pas retenir comme interdiction terminologique universelle. Le véritable problème est l'assimilation automatique à deux serveurs et à une authentification du client. | R12           |
| H16  | OID4VCI peut transporter tout type de donnée.                            | Ne pas reprendre littéralement : agnosticisme de format ne signifie pas API de transfert arbitraire.                                                                    | R19           |
| H17  | Le key binding manque dans les formats.                                  | Retenu comme manque d'articulation ; `cnf` et KB-JWT existent déjà dans le cours.                                                                                       | R23–R26       |
| H18  | Ancien `vc+sd-jwt`, nouveau `dc+sd-jwt`, double acceptation recommandée. | Le sens du changement est déjà correct dans le dépôt. Clarifier la recommandation transitoire, sans inverser les valeurs.                                               | R22           |
| H19  | L'ancien `client_id_scheme` devrait être contextualisé plus tôt.         | Retenu comme problème de transition ; commencer par un ancien draft n'est pas une nécessité pédagogique.                                                                | R03, R27      |
| H20  | Ajouter `intent_to_retain` à DCQL.                                       | Retenu avec précision essentielle : paramètre optionnel des Claims Queries mdoc dans la version examinée.                                                               | R28           |
| H21  | Les timestamps et autres valeurs singulières permettent la corrélation.  | Retenu ; étendre l'analyse aux combinaisons de valeurs, pas uniquement aux identifiants explicites.                                                                     | R31           |

## Étape 1 — Fixer le référentiel et les repères du cours

- [ ] **R01 — Référentiel de versions et niveaux normatifs** · P1 · confirmé · audit initial.

  **À reprendre :** distinguer norme de base, BCP, draft, profil d'écosystème et choix de démonstration. Consigner les éditions exactes et les sections utilisées ; revoir les mentions non versionnées de SD-JWT, désormais également documenté par la [RFC 9901](https://www.rfc-editor.org/rfc/rfc9901.html). Une publication plus récente ne rend pas automatiquement erroné un exemple explicitement rattaché à un ancien draft.

  **Cibles :** [curriculum](/Users/bob/codes/OIDApp/src/data/curriculum.ts), [carte des spécifications](/Users/bob/codes/OIDApp/src/data/spec-map.ts), encadrés normatifs et README.

  **Terminé lorsque :** chaque module annonce son référentiel ; les MUST/SHOULD/MAY et les obligations propres à un profil ne sont plus intervertis. Les conclusions dépendant d'une version sont signalées comme telles.

- [ ] **R02 — Repérage par protocole, chapitre et leçon** · P1 · confirmé · H04.

  **À reprendre :** remplacer dans le parcours apprenant les renvois « Phase 3 », « Phase 4 », etc., par des noms explicites et des liens. Distinguer numérotation éditoriale et historique de développement. Recenser les références avant de les modifier pour éviter des liens orphelins.

  **Cibles :** [curriculum](/Users/bob/codes/OIDApp/src/data/curriculum.ts), [accueil](/Users/bob/codes/OIDApp/src/routes/index.tsx), leçons, scénarios et glossaire.

  **Terminé lorsque :** une leçon ouverte directement se comprend sans connaître les « phases » ; navigation, titres et renvois emploient le même vocabulaire.

- [ ] **R03 — Ordre des notions et prérequis** · P1 · pédagogique · H03, H19.

  **À reprendre :** dresser la carte des premières utilisations : rôle logique et client public/confidentiel ; requête/réponse/redirection ; grant/token ; JWS/JWK ; signature/confiance ; credential/format ; clé du détenteur/binding ; requête de présentation/DCQL. Séparer première définition, rappel et approfondissement. Introduire les différences de versions au moment où elles évitent une confusion, sans obliger le débutant à apprendre un ancien protocole d'abord.

  **Cibles :** [registre des leçons](/Users/bob/codes/OIDApp/src/content/registry.ts), curriculum et introductions de modules.

  **Terminé lorsque :** chaque notion nécessaire à une étape possède une explication préalable ou immédiate ; une relecture dans l'ordre ne nécessite pas de sauts répétés vers des chapitres futurs.

- [ ] **R04 — Convention commune d'explication des champs** · P1 · confirmé · H02, audit HTTP.

  **À reprendre :** définir un format éditorial commun : emplacement, type, sens dans ce message, producteur, destinataire, origine de la valeur, conservation, contrôle attendu, caractère obligatoire et condition, confidentialité, exemple et référence. Distinguer claims du payload et paramètres JOSE du header. Les mêmes noms (`aud`, `nonce`, `cnf`) nécessitent un contexte propre à chaque artefact.

  **Cibles :** [annotations JWT](/Users/bob/codes/OIDApp/src/lib/jwt.ts), [schéma des scénarios](/Users/bob/codes/OIDApp/src/engine/scenario.ts), glossaire et contenu HTTP.

  **Terminé lorsque :** on peut expliquer le trajet et le contrôle d'une valeur, pas seulement développer son acronyme. Convention à fixer avant R06, R07 et R15.

## Étape 2 — Rendre les supports fiables

- [ ] **R05 — Tableaux comparatifs : structure et sémantique** · P1 · confirmé · H13.

  **Constat :** [CompareTable](/Users/bob/codes/OIDApp/src/components/content/CompareTable.tsx) ajoute un en-tête vide pour les libellés de lignes. [OIDC/SAML](/Users/bob/codes/OIDApp/src/content/oidc/ch6-oidc-vs-saml.tsx) fournit en plus « Axe » dans `columns` : quatre en-têtes, trois cellules par ligne. D'autres tableaux ont des effectifs compatibles mais des intitulés sémantiquement décalés.

  **À reprendre :** inventorier tous les appels, clarifier le contrat de colonnes et corriger les associations libellé/valeur. Ne pas supposer que supprimer « Axe » partout suffit.

  **Terminé lorsque :** chaque cellule est sous le bon en-tête ; contrôle visuel sur écran large et étroit, et navigation accessible cohérente. Le défaut a été confirmé statiquement ; sa validation visuelle reste à réaliser.

- [ ] **R06 — Échanges HTTP : brut et explications concordants** · P1 · confirmé · audit initial.

  **Constat :** [HttpRequestView](/Users/bob/codes/OIDApp/src/components/http/HttpRequestView.tsx:47) remplace le corps brut par les annotations lorsque `body.params` existe. Headers et réponses sont moins explicités. Certains deep links sont montrés comme des GET HTTP, et certains payloads JWT décodés comme des corps reçus sur le réseau.

  **À reprendre :** rendre lisibles les deux niveaux, indiquer encodage et emplacement, distinguer échange réel, vue décodée et extrait abrégé. Vérifier aussi Content-Type, redirections et cohérence entre valeurs brutes, annotations et artefacts inspectables.

  **Terminé lorsque :** aucun affichage ne fait passer un payload décodé pour la sérialisation réellement transportée ; le lecteur peut reconstituer chaque exemple déclaré complet. Dépend de R04 et R12.

- [ ] **R07 — Inspection JWT adaptée au signataire** · P1 · confirmé · H02, audit key binding.

  **Constat :** [JwtInspector](/Users/bob/codes/OIDApp/src/components/jwt/JwtInspector.tsx:65) annonce toujours ES256 et une recherche JWKS par `kid`. Ce texte ne convient pas à toutes les preuves affichées. Le dictionnaire partagé ne décrit notamment pas `nonce`, `cnf`, `sd_hash` ou les champs DPoP.

  **À reprendre :** contextualiser signataire, clé de vérification et provenance de confiance ; couvrir les objets imbriqués utiles. Distinguer décodage, vérification mathématique, validation de profil et décision d'acceptation.

  **Terminé lorsque :** inspecter successivement ID Token, credential, proof VCI, DPoP et KB-JWT ne produit aucune explication contradictoire sur la clé utilisée.

- [ ] **R08 — Quiz sans indices de forme** · P1 · confirmé et mesuré · H01.

  **Mesure :** analyse syntaxique de 103 questions aux options littérales dans les leçons TSX : bonne réponse parmi les plus longues dans 93 cas, seule plus longue dans 92 cas (89,3 %). Positions correctes : première 14, deuxième 87 (84,5 %), troisième 2. Il s'agit de la longueur du texte de réponse, hors explication ; pas d'une étude d'utilisateurs.

  **À reprendre :** équilibrer longueur, précision, grammaire et plausibilité ; réviser les distracteurs caricaturaux ; répartir les positions ; déplacer les justifications dans le retour après réponse. Ne pas compter sur un simple mélange des options pour résoudre le biais de longueur.

  **Cibles :** [composant Quiz](/Users/bob/codes/OIDApp/src/components/content/Quiz.tsx) et toutes les leçons.

  **Terminé lorsque :** une nouvelle mesure ne révèle plus de stratégie de forme dominante ; chaque question teste une distinction réelle et n'invalide pas un cas autorisé par la spécification.

## Étape 3 — Reprendre les fondations OAuth2

- [ ] **R09 — Rôles et authentifications** · P1 · à nuancer · H05, H06.

  **À reprendre :** définir Client comme rôle, illustrer plusieurs déploiements et identifier séparément utilisateur, client et serveur authentifiés. Conserver le backend comme exemple, pas comme définition. Expliquer que l'authentification du Resource Owner intervient dans les flows concernés alors que sa méthode n'est pas normalisée par OAuth ; éviter de l'imposer au client credentials grant. Références : [RFC 6749, §1.1, §2.1 et §4.1](https://www.rfc-editor.org/rfc/rfc6749.html#section-2.1).

  **Cibles :** [vocabulaire](/Users/bob/codes/OIDApp/src/content/oauth2/ch0-vocabulaire.tsx), glossaire, rôles/canaux.

  **Terminé lorsque :** « OAuth ne fournit pas au RP un protocole d'authentification utilisateur » n'est plus compris comme « aucune authentification n'a lieu ».

- [ ] **R10 — Authentification et identification du client au token endpoint** · P1 · confirmé · H07, audit initial.

  **À reprendre :** expliciter les mécanismes déjà montrés ; différencier `client_id`, secret client, PKCE et DPoP. Corriger les POST du code grant dans [DPoP](/Users/bob/codes/OIDApp/public/scenarios/oauth2/dpop.json) et [VCI authorization code](/Users/bob/codes/OIDApp/public/scenarios/oid4vci/authorization-code.json), actuellement sans authentification client ni `client_id` : cette dernière valeur est requise en l'absence d'authentification. [RFC 6749, §2.3 et §4.1.3](https://www.rfc-editor.org/rfc/rfc6749.html#section-4.1.3).

  **Terminé lorsque :** chaque scénario indique son type de client et montre une requête compatible ; aucune preuve de possession n'est présentée comme une identité enregistrée par elle-même.

- [ ] **R11 — Histoire de la délégation sans caricature** · P2 · à nuancer · H08.

  **À reprendre :** présenter le partage de mot de passe comme l'anti-pattern choisi, pas l'état de toute l'authentification avant OAuth. Situer brièvement [HTTP Digest, RFC 2617 (1999)](https://www.rfc-editor.org/rfc/rfc2617.html) et [Kerberos V5, RFC 4120](https://datatracker.ietf.org/doc/html/rfc4120). Ne pas limiter Kerberos au « local » ; ne pas confondre corps HTTP lisible dans le cours et trafic non chiffré. Nuancer aussi le récit uniforme des API keys et la formule « aucun secret exposé » : un bearer token reste sensible.

  **Cible :** [problème d'origine](/Users/bob/codes/OIDApp/src/content/oauth2/ch1-probleme-origine.tsx).

  **Terminé lorsque :** l'apport étudié est clairement la délégation d'accès à un tiers ; aucune histoire exhaustive ni supériorité universelle n'est suggérée.

- [ ] **R12 — Canaux et différences entre grants et architectures** · P1 · confirmé · H09, H15, audit initial.

  **À reprendre :** séparer parcours via l'agent utilisateur, appel direct, localisation du logiciel et propriétés de sécurité. Montrer tôt l'exception historique Implicit : token dans le fragment, avec sa déconseillation actuelle. Pour les wallets, nommer les acteurs effectifs de chaque transport ; ne pas interdire abstraitement le terme back channel. [RFC 6749, §4.2](https://www.rfc-editor.org/rfc/rfc6749.html#section-4.2).

  **Cibles :** [rôles et canaux](/Users/bob/codes/OIDApp/src/content/oauth2/ch2-roles-canaux.tsx), composants HTTP, glossaire et scénarios VCI/VP.

  **Terminé lorsque :** le cours ne dit plus que tout appel direct exige deux serveurs ou que toute donnée sensible est absente du navigateur ; il conserve les précautions applicables aux redirections.

- [ ] **R13 — BCP, CSRF, PKCE et flows historiques** · P1 · confirmé · audit initial.

  **À reprendre :** distinguer obligations pour clients publics, recommandations pour confidentiels, précautions permettant PKCE/nonce contre CSRF et état applicatif de `state`. Séparer Implicit déconseillé et ROPC interdit ; ne pas attribuer tous les choix d'OAuth 2.1 à RFC 9700. [Security BCP, §2.1 et §2.4](https://www.rfc-editor.org/rfc/rfc9700.html#section-2.1).

  **Cibles :** [état de l'art](/Users/bob/codes/OIDApp/src/content/oauth2/ch7-etat-de-l-art.tsx), leçons CSRF/PKCE, OIDC nonce/state et quiz.

  **Terminé lorsque :** toutes les règles ont une portée explicite ; le choix de conserver plusieurs protections n'est pas présenté comme une obligation universelle.

- [ ] **R14 — Cycle de vie et portée des garanties des tokens** · P2 · confirmé · audit initial.

  **À reprendre :** corriger la révocation automatique supposée de tous les access tokens après révocation du refresh token : [RFC 7009, §2.1](https://www.rfc-editor.org/rfc/rfc7009.html#section-2.1) formule une recommandation conditionnelle. Éviter les équivalences « JWT = révocation impossible » et « opaque = révocation instantanée garantie ». Préciser les hypothèses de validation locale, introspection, cache et politique du système.

  **Cibles :** [tokens](/Users/bob/codes/OIDApp/src/content/oauth2/ch4-tokens.tsx), glossaire et comparateur.

  **Terminé lorsque :** les avantages des exemples restent lisibles sans transformer une architecture choisie en propriété absolue du format.

## Étape 4 — Compléter OIDC

- [ ] **R15 — Claims de l'ID Token et extensibilité** · P1 · confirmé · H02, H10.

  **À reprendre :** intégrer `acr` (contexte), `amr` (méthodes), `azp` (partie autorisée), leurs différences et les claims additionnels. Ne pas rendre ces champs systématiquement obligatoires. La rédaction consultée de [Core §2](https://openid.net/specs/openid-connect-core-1_0.html#IDToken) situe l'usage d'`azp` dans les extensions : éviter une règle copiée d'un ancien tutoriel sans version. Revoir aussi les conditions d'`auth_time`.

  **Cibles :** [anatomie de l'ID Token](/Users/bob/codes/OIDApp/src/content/oidc/ch1-id-token.tsx), dictionnaire partagé et quiz.

  **Terminé lorsque :** chaque champ ajouté est expliqué dans la convention R04 et relié à son usage, sans surcharger artificiellement toutes les fixtures.

- [ ] **R16 — Rendre visible le callback navigateur → RP** · P1 · confirmé · H11.

  **À reprendre :** montrer distinctement réponse 302 de l'OP, suivi du Location par le navigateur, réception du code par le RP, corrélation avec la requête en cours puis POST du RP à `/token`. Les flèches manquantes ne doivent plus être laissées à l'inférence du lecteur.

  **Cibles :** [scénario OIDC complet](/Users/bob/codes/OIDApp/public/scenarios/oidc/authorization-code.json), [leçon associée](/Users/bob/codes/OIDApp/src/content/oidc/ch2-flow-complet.tsx).

  **Terminé lorsque :** le lecteur peut désigner l'émetteur et le receveur de chacun des messages et sait comment le code parvient au RP. Conserver l'exemple de client confidentiel explicitement.

- [ ] **R17 — Validation annoncée et validation réellement couverte** · P1 · confirmé · H12, audit initial.

  **À reprendre :** rendre les treize points de [Core §3.1.3.7](https://openid.net/specs/openid-connect-core-1_0.html#IDTokenValidation) consultables avec leurs conditions ; distinguer ordre normatif et regroupement pédagogique. Inclure les branches non illustrées par ES256 et les exigences de contexte. Ne pas prétendre que tous les contrôles sont treize opérations obligatoires identiques sur chaque jeton.

  **Cibles :** [validation](/Users/bob/codes/OIDApp/src/content/oidc/ch3-validation.tsx), scénario de validation et Crypto Lab.

  **Terminé lorsque :** l'intitulé « validation » indique exactement les vérifications exécutées ou simulées ; le cas de démonstration est traçable au référentiel sans prétendre remplacer un validateur général.

- [ ] **R18 — Cohérence de `at_hash`, `c_hash`, `nonce` et `state`** · P1 · confirmé · audit initial.

  **À reprendre :** supprimer la contradiction entre validation et chapitre des liaisons ; préciser présence et contrôle selon flow/endpoint, et rattacher SHA-256 aux algorithmes choisis. `at_hash` est optionnel en code flow. [Core §3.1.3.6–3.1.3.8](https://openid.net/specs/openid-connect-core-1_0.html#CodeIDToken).

  **Cibles :** [nonce et empreintes](/Users/bob/codes/OIDApp/src/content/oidc/ch5-nonce-at-hash.tsx), validation, glossaire et exercices.

  **Terminé lorsque :** aucune question ne rejette un ID Token valide uniquement pour l'absence d'un champ optionnel dans le cas décrit ; R13 et R17 restent cohérents.

## Étape 5 — Préciser ce qu'OID4VCI enseigne

- [ ] **R19 — Credential, format et choix de l'exemple** · P1 · à nuancer · H14, H16.

  **À reprendre :** annoncer dès l'offer que SD-JWT VC est le format illustré ; positionner mdoc sans attendre un chapitre tardif. Ne pas remplacer « credential » par « toute donnée » : le protocole reste celui d'une émission de credentials, avec des profils de format. [OID4VCI, §3.3.1 et annexe A](https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0.html#section-3.3.1).

  **Cibles :** [Credential Offer](/Users/bob/codes/OIDApp/src/content/oid4vci/ch1-credential-offer.tsx), [formats](/Users/bob/codes/OIDApp/src/content/oid4vci/ch4-formats.tsx).

  **Terminé lorsque :** l'apprenant distingue émission, format, modèle de claims et profil d'écosystème ; les exemples n'impliquent pas que tout credential est un SD-JWT.

- [ ] **R20 — Conditions de preuve et durée du nonce** · P1 · confirmé · audit initial.

  **À reprendre :** retirer « passage obligé des deux flows » comme règle universelle ; différencier preuve, binding et politique d'émission. Le nonce n'est pas intrinsèquement un identifiant exclusif de transaction ni nécessairement à usage unique ; l'Issuer fixe son acceptation. [OID4VCI, §8.1 et §13.8](https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0.html#section-13.8).

  **Cibles :** [proof of possession](/Users/bob/codes/OIDApp/src/content/oid4vci/ch3-proof-of-possession.tsx), scénarios et glossaire.

  **Terminé lorsque :** le cours distingue autorisation d'émettre, possession de clé et fraîcheur ; R25 ne démontre pas une garantie plus forte que celle effectivement contrôlée.

- [ ] **R21 — Découverte et convergence des flows d'émission** · P2 · confirmé comme raccourci pédagogique · audit initial.

  **À reprendre :** expliciter l'hypothèse actuelle « Credential Issuer = Authorization Server », la provenance des endpoints et des configurations, puis suivre les identifiants de credential entre autorisation, token response et émission. Identifier les messages regroupés ou omis dans les scénarios. Traiter l'authentification du wallet avec R10.

  **Cibles :** [flow authorization code VCI](/Users/bob/codes/OIDApp/public/scenarios/oid4vci/authorization-code.json), [pre-authorized code](/Users/bob/codes/OIDApp/public/scenarios/oid4vci/pre-authorized-code.json).

  **Terminé lorsque :** aucune URL ou valeur structurante n'apparaît sans origine expliquée ; les différences entre les deux parcours sont visibles avant leur convergence.

- [ ] **R22 — Transition `vc+sd-jwt` → `dc+sd-jwt`** · P2 · déjà correct sur le sens · H18.

  **À reprendre :** conserver `dc+sd-jwt` dans les exemples actuels. La [leçon existante](/Users/bob/codes/OIDApp/src/content/oid4vci/ch4-formats.tsx) donne déjà la bonne chronologie. Préciser que l'acceptation des deux valeurs est une recommandation transitoire destinée aux Holders et Verifiers, pas une obligation perpétuelle ni l'assurance que tous les produits acceptent les deux. [SD-JWT VC draft-13, §3.2.1](https://www.ietf.org/archive/id/draft-ietf-oauth-sd-jwt-vc-13.html#section-3.2.1).

  **Terminé lorsque :** chronologie, statut normatif, périmètre et exemples concordent ; la note d'Hector n'a pas conduit à inverser une information juste.

## Étape 6 — Faire du key binding une chaîne démontrable

- [ ] **R23 — Distinguer les liaisons et les garanties** · P1 · pédagogique · H17, audit initial.

  **À reprendre :** articuler quatre questions : quelle clé est attachée au credential ; qui contrôle sa partie privée ; à quelle présentation cette preuve correspond ; comment cette clé est protégée. Comparer sans fusionner DPoP, proof VCI, KB-JWT, key attestation et authentification du client. Séparer identité du sujet, détenteur et personne utilisant l'appareil.

  **Cibles :** [key binding](/Users/bob/codes/OIDApp/src/content/oid4vp/ch4-key-binding.tsx), formats VCI, preuves, glossaire.

  **Terminé lorsque :** l'apprenant sait distinguer une liaison certifiée par l'Issuer d'une preuve fraîche du wallet, puis expliquer ce qu'aucune de ces signatures ne prouve à elle seule. Dépend de R04, R09 et R20.

- [ ] **R24 — Continuité des artefacts émission → présentation** · P1 · confirmé · audit initial.

  **Constat :** [le générateur VP](/Users/bob/codes/OIDApp/scripts/gen-oid4vp-fixtures.mjs:6) crée un ensemble autonome, indépendant de VCI. Les clés de détenteur diffèrent effectivement. Ce n'est pas une erreur cryptographique, mais la « boucle » annoncée n'est pas le suivi d'un même objet.

  **À reprendre :** établir une démonstration traçable de l'offer à la présentation : credential, clé liée, disclosures et preuve. Organiser la génération afin que les tokens copiés dans les JSON ne divergent pas des fixtures de référence.

  **Terminé lorsque :** le lecteur peut identifier le même credential et la même clé entre les deux modules ; les variantes autonomes sont annoncées comme telles.

- [ ] **R25 — Laboratoire de binding et scénarios de rejet distincts** · P1 · confirmé · audit initial.

  **Constat :** [le laboratoire](/Users/bob/codes/OIDApp/src/routes/labo-crypto.tsx) calcule le `sd_hash` de la sélection mais laisse `<kb-jwt>` comme emplacement. Le rejeu VCI consiste à remplacer le nonce attendu.

  **À reprendre :** rendre explicites les étapes réellement calculées, puis démontrer la liaison complète. Séparer : mauvaise clé, mauvaise audience, mauvais nonce, preuve trop ancienne, disclosures modifiées, seconde soumission à une transaction déjà close. Présenter la politique de consommation de transaction retenue comme telle. Prévoir une horloge de démonstration cohérente avec les timestamps fixes.

  **Terminé lorsque :** chaque rejet possède sa cause propre ; une signature mathématiquement valide peut échouer à la validation de contexte ; aucune simulation n'est présentée comme un contrôle réellement exécuté. Dépend de R07, R20, R23 et R24.

- [ ] **R26 — Attestations, stockage des clés et binding mdoc** · P2 · à approfondir · H17, audit initial.

  **À reprendre :** montrer la différence entre le type `attestation` et un proof `jwt` transportant `key_attestation` ; le premier peut fonctionner sans signature de possession par la clé attestée. [OID4VCI, annexe F](https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0.html#appendix-F). Expliquer la confiance accordée au tiers attestant. Côté mdoc, cadrer un exemple distinct, sans lui attribuer un KB-JWT.

  **Cibles :** [key attestation](/Users/bob/codes/OIDApp/src/content/oid4vci/ch5-key-attestation.tsx), formats et key binding.

  **Terminé lorsque :** possession, non-exportabilité, attestations et mécanismes propres aux formats ne sont plus interchangeables. Tout détail ISO non vérifié demeure identifié avant rédaction définitive.

## Étape 7 — Compléter la présentation OID4VP

- [ ] **R27 — Requête et identité du Verifier** · P1 · confirmé · H19, audit initial.

  **À reprendre :** contextualiser le préfixe avant son utilisation ; rendre visibles `typ` et `aud` dans les exemples complets de Request Object. [OID4VP, §5 et §5.8](https://openid.net/specs/openid-4-verifiable-presentations-1_0.html#section-5.8). Corriger l'affichage de `location.example` après vérification de `verifier.example`, ou expliciter une relation de confiance vérifiable. Séparer nom déclaré, identité authentifiée et droit de demander des données.

  **Cibles :** [identification du Verifier](/Users/bob/codes/OIDApp/public/scenarios/oid4vp/verifier-identification.json), flow complet et leçon associée.

  **Terminé lorsque :** chaque élément d'identité affiché a une provenance ; le lecteur sait distinguer la forme actuelle de l'ancien `client_id_scheme`.

- [ ] **R28 — DCQL, conservation et décision d'acceptation** · P1 · confirmé · H20, audit initial.

  **À reprendre :** ajouter `intent_to_retain` dans un exemple mdoc : il s'agit d'un paramètre optionnel spécifique à ce format dans [OID4VP, annexe B.2.4](https://openid.net/specs/openid-4-verifiable-presentations-1_0.html#appendix-B.2.4). Distinguer intention déclarée de garantie technique de non-conservation. Compléter « Vérifie tout » par l'adéquation à la requête et distinguer filtre de sélection, confiance dans l'Issuer et validation cryptographique. [OID4VP, §8.6](https://openid.net/specs/openid-4-verifiable-presentations-1_0.html#section-8.6).

  **Cibles :** [DCQL](/Users/bob/codes/OIDApp/src/content/oid4vp/ch2-dcql.tsx) et flow de présentation.

  **Terminé lorsque :** l'ajout n'est pas abusivement appliqué au SD-JWT ; une présentation authentique mais hors demande n'est pas automatiquement acceptée.

- [ ] **R29 — Réponses, chiffrement et DC API** · P1 · confirmé · audit initial et vérification complémentaire.

  **À reprendre :** corriger « signé et/ou chiffré » : `direct_post.jwt` désigne ici une réponse chiffrée. [OID4VP, §8.3](https://openid.net/specs/openid-4-verifiable-presentations-1_0.html#section-8.3). Rectifier aussi la leçon DC API : `origin:` sert à l'audience de présentation ; ce n'est pas un `client_id` préfixé à accepter dans la requête. [OID4VP, §5.9.3](https://openid.net/specs/openid-4-verifiable-presentations-1_0.html#section-5.9.3).

  **Cibles :** [ouverture DC API](/Users/bob/codes/OIDApp/src/content/oid4vp/ch6-ouverture.tsx), glossaire, flow complet.

  **Terminé lorsque :** paramètre de requête, origine fournie par l'environnement et audience de preuve sont distincts ; brut et vue décodée concordent.

## Étape 8 — Reprendre les garanties de vie privée

- [ ] **R30 — Absence de phone home et limites du modèle** · P1 · confirmé · audit initial.

  **À reprendre :** remplacer l'impossibilité absolue de connaître les usages par les hypothèses réelles du scénario. Les contacts de statut et la collusion peuvent révéler des présentations. [RFC 9901, §10.1](https://www.rfc-editor.org/rfc/rfc9901.html#section-10.1). Conserver la valeur du découplage sans confondre absence d'appel requis et absence de toute fuite possible. Nuancer « fichier mort » : une exfiltration peut rester une atteinte aux données personnelles.

  **Cibles :** [paradigme VCI](/Users/bob/codes/OIDApp/src/content/oid4vci/ch0-paradigme.tsx), triangle, quiz, comparateurs et binding.

  **Terminé lorsque :** les premières leçons ne promettent plus ce que le chapitre unlinkability relativise ensuite.

- [ ] **R31 — Corrélation par clés, temps et combinaisons de champs** · P1 · confirmé · H21, audit initial.

  **À reprendre :** compléter signatures et digests par clé publique, timestamps précis, identifiants de statut et combinaisons rares de claims. Pour l'émission en lots, traiter les clés et les temps, pas uniquement les sels/signatures. La [RFC 9901, §10.1](https://www.rfc-editor.org/rfc/rfc9901.html#section-10.1) traite explicitement ces facteurs. Ne pas prétendre que toute valeur unique suffit toujours à réidentifier : décrire sa stabilité, son partage et les connaissances de l'observateur.

  **Cible :** [unlinkability](/Users/bob/codes/OIDApp/src/content/oid4vp/ch5-unlinkability.tsx), fixtures de démonstration et glossaire.

  **Terminé lorsque :** le lecteur distingue corrélation et identification, et peut expliquer pourquoi changer un nonce ne supprime pas les autres identifiants.

- [ ] **R32 — Comparaisons équitables entre fédération et wallets** · P2 · confirmé · audit initial.

  **À reprendre :** intégrer les demandes individuelles par `claims` en OIDC, distinctes de la divulgation sélective d'un credential déjà émis. [Core §5.5](https://openid.net/specs/openid-connect-core-1_0.html#ClaimsParameter). Revoir les absolus « IdP à chaque usage », « révocation immédiate », « aucune présentation visible », ainsi que les jugements de couleur qui avantagent systématiquement une technologie. Distinguer session applicative et nouvelle authentification fédérée.

  **Cibles :** [comparateur](/Users/bob/codes/OIDApp/src/routes/comparateur.tsx), unlinkability, OIDC/SAML.

  **Terminé lorsque :** chaque comparaison décrit un contexte comparable et des hypothèses visibles. Dépend de R05, R14 et R30.

## Étape 9 — Décider les approfondissements, puis valider

- [ ] **R33 — Couverture complémentaire à cadrer** · P3 · à cadrer · audit initial.

  **À reprendre :** classer explicitement comme introduction, approfondissement ou hors périmètre les sujets peu développés : erreurs et reprises ; émission différée ; notifications ; chiffrement VCI ; opérations en lots ; `transaction_data` ; parcours mdoc ; discovery et négociation plus riches ; authentification client par attestation ; extensions OIDC et sessions. Leur absence n'est pas, à elle seule, une non-conformité du cours.

  **Cibles :** [curriculum](/Users/bob/codes/OIDApp/src/data/curriculum.ts) et README.

  **Terminé lorsque :** une matrice indique la profondeur retenue pour chaque sujet et évite de qualifier un module de « complet » sans définir ce que cela couvre. Ce lot ne bloque pas les corrections confirmées précédentes.

- [ ] **R34 — Vérifications du contenu protocolaire** · P1 · confirmé comme manque de couverture · audit initial.

  **À reprendre :** compléter les contrôles existants là où ils ne vérifient que le schéma interne ou les signatures : cohérence entre requêtes/réponses, fixtures affichées, claims attendus, scénario de référence et cas de rejet. Les dates fixes doivent être traitées avec une horloge déclarée. Une primitive telle que `verifyCompactJwsES256` n'est pas à qualifier de validateur OIDC général.

  **Cibles :** [tests de scénarios](/Users/bob/codes/OIDApp/src/engine/scenario.test.ts), [tests crypto](/Users/bob/codes/OIDApp/src/lib/crypto.test.ts), générateurs.

  **Terminé lorsque :** les tests ajoutés détectent les écarts corrigés sans simplement recopier l'implémentation ; les garanties annoncées correspondent aux contrôles exécutés. À traiter avec chaque lot concerné, pas seulement à la fin.

- [ ] **R35 — Relecture finale technique et pédagogique** · P1 · à réaliser après les lots concernés.

  **À reprendre :** contrôler la propagation dans leçons, glossaire, quiz, diagrammes, inspecteurs et README ; vérifier liens et repères ; relire dans l'ordre d'apprentissage puis par accès direct à une leçon. Recontrôler les biais de quiz et les tableaux. Effectuer les vérifications applicatives adaptées après les modifications réelles.

  **Terminé lorsque :** chaque Rxx réalisé possède une preuve de validation ; les points non traités restent ouverts et explicites ; aucune modification de terminologie ne masque une divergence normative. Une nouvelle revue humaine peut alors porter sur le fond plutôt que sur des contradictions d'affichage.

## Traçabilité de l'audit initial

| Constat de la première revue                                 | Reprises associées |
| ------------------------------------------------------------ | ------------------ |
| Front/back channel assimilé à navigateur/serveur             | R09, R12           |
| Identification du client omise dans deux token requests      | R10                |
| MUST/SHOULD et CSRF/PKCE généralisés                         | R01, R13           |
| Révocation des tokens trop automatique                       | R14                |
| Contradiction `at_hash`, portée limitée du Lab OIDC          | R17, R18, R34      |
| PoP VCI présenté comme universel                             | R20, R23, R26      |
| `c_nonce` assimilé à une transaction et à l'usage unique     | R20, R25           |
| Request Object VP incomplet, nom de Verifier incohérent      | R27                |
| `direct_post.jwt` mal défini ; acceptation DCQL peu visible  | R28, R29           |
| Vie privée absolue, clés de lots et granularité OIDC         | R30, R31, R32      |
| Fixtures émission/présentation autonomes                     | R24                |
| Inspecteur JWT générique et KB-JWT non construit dans le Lab | R07, R25           |
| Champs HTTP peu expliqués, corps brut masqué                 | R04, R06           |
| Manques de couverture et limites des tests existants         | R33, R34           |

## Séquence de travail suggérée

1. Fixer les conventions R01–R04 ; produire la carte des prérequis avant de déplacer les leçons.
2. Réparer les supports R05–R07 ; préparer la grille de révision des quiz R08.
3. Reprendre OAuth2 R09–R14, avec les contrôles R34 adaptés.
4. Reprendre OIDC R15–R18 ; vérifier en particulier le chemin du code et les conditions de validation.
5. Reprendre VCI R19–R22 ; relier aux corrections du token endpoint déjà réalisées.
6. Traiter le fil key binding R23–R26 comme un ensemble cohérent, avec validations intermédiaires.
7. Reprendre VP R27–R29 et ses exemples de demande/réponse.
8. Harmoniser vie privée et comparaisons R30–R32.
9. Décider les extensions R33 ; terminer la révision des quiz sur le contenu stabilisé.
10. Exécuter la relecture R35 et consigner ce qui reste hors périmètre.

Pour chaque reprise : relire le constat et les sources, définir le résultat du lot, modifier les seules parties liées, vérifier, puis cocher avec date et preuve. Ce document reste un plan de travail ; il ne vaut pas déclaration que les reprises ont déjà été effectuées.
