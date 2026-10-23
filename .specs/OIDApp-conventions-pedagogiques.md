# Conventions pédagogiques — reprise du 22 octobre 2026

## Carte des prérequis

Les identifiants et l’ordre des 32 leçons restent stables pour préserver la progression. Une définition courte est disponible **avant le contenu**, dans « Repères pour cette leçon ». « Prérequis et références » fournit les rappels et les liens ; les chapitres suivants approfondissent, sans servir de première définition implicite.

| Première utilisation      | Définition immédiate                                                                               | Approfondissement                          |
| ------------------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| OAuth2, vocabulaire       | Rôle logiciel, client public/confidentiel ; grant vs token                                         | Rôles/canaux puis Client Credentials       |
| OAuth2, canaux            | Méthode, URL, headers, corps, 302 suivi d’une nouvelle requête ; TLS vs authentification client    | Authorization Code et attaques             |
| OAuth2, tokens            | JWT/JWS/JWK et encodage sans chiffrement                                                           | Crypto Lab ES256 ; OIDC                    |
| OIDC, premier ID Token    | OP/RP, issuer attendu, Discovery/JWKS, signature vs confiance                                      | Validation et Discovery                    |
| OIDC, code flow           | Code livré au callback par le navigateur, échange par le RP                                        | Treize points de validation conditionnels  |
| VCI, paradigme et offer   | Credential, format, Issuer vs AS ; SD-JWT VC **et** mdoc                                           | Formats et découverte des deux métadonnées |
| VCI, première preuve      | Clé liée par l’Issuer ; proof jwt vs KB-JWT ; autorisation vs possession                           | Proof, key attestation, laboratoire        |
| VP, première requête      | Verifier, DCQL, vp_token et préfixe de client_id ; historique client_id_scheme identifié comme tel | Identification et DCQL                     |
| VP, première présentation | cnf, contrôle de clé, audience, nonce, sélection ; mdoc distinct                                   | Binding, confidentialité et laboratoire    |

Un accès direct à une leçon reçoit les mêmes rappels. Les liens de rappel doivent être contrôlés contre le curriculum. Le glossaire donne le sens d’un terme ; il ne doit pas annuler une condition exprimée dans la leçon.

## Contrat des annotations HTTP et JWT

Le dictionnaire commun est `src/lib/field-guide.ts`. `FieldExplanation` rend les détails à la demande, au clavier comme à la souris. La valeur d’exemple reste visible au-dessus de l’explication.

Chaque champ documenté comporte : emplacement, type, sens, producteur et destinataire, origine de la valeur, contrôle attendu, présence et condition, confidentialité, conservation et source. Les descriptions locales `description`/`specRef` et `guide` complètent le dictionnaire pour un message particulier. Les acteurs HTTP sont ceux de la flèche, inversés pour la réponse ; l’explication d’un claim dépend du profil JWT.

- Ne pas confondre un paramètre JOSE du header avec un claim du payload.
- Ne pas inférer une obligation universelle à partir d’un exemple. Une annotation générique annonce ses conditions ; préciser le profil si nécessaire.
- Pour `nonce` et `aud`, montrer d’où la valeur vient et où elle sera comparée. Pour `cnf`, distinguer la clé du détenteur de la clé de signature de l’Issuer.
- Afficher le corps brut même si ses paramètres sont annotés. Les valeurs du tableau sont décodées ; form et query sont encodés dans la vue brute.
- `representation: decoded` et `excerpt` signalent une vue décodée ou un extrait ; ne pas les appeler messages réseau complets. `responseOnly` évite d’inventer une requête sur une flèche de réponse.
- `INVOKE` représente une URI de lancement du wallet, pas une méthode HTTP.
- Le profil déduit par l’inspecteur est une aide de lecture. Il ne valide ni l’algorithme, ni la signature, ni la confiance.

## Garanties et calculs

Le cours distingue décodage, vérification de signature, validation du profil et acceptation métier. Le laboratoire de binding est borné à ES256, SHA-256, cnf.jwk, claims simples et un Issuer approuvé. Il exige le type attendu et un claim demandé ; ce n’est pas un moteur DCQL complet. X.509, statut, attestations matérielles, CBOR/COSE et JWE ne sont pas exécutés.

Les fixtures VCI et VP sont générées ensemble par `scripts/gen-credential-chain.mjs`. Même credential, même clé publique liée, même sélection transmise : la continuité est réelle. Clés privées jetables non persistées ; sels aléatoires. Les dates restent fixes pour rendre les exemples comparables et sont évaluées avec l’horloge de démonstration annoncée, pas l’heure réelle.

La politique de consommation de transaction du labo est explicitement choisie : une acceptation ferme la transaction. Modifier les disclosures après signature laisse la signature du KB-JWT intacte mais fait diverger `sd_hash`. Les autres fautes doivent échouer séparément. Le nonce d’émission n’est pas présenté comme nécessairement consommable une seule fois.

## Quiz et comparaisons

La banque centralisée comporte 96 questions, trois par leçon, avec une seule réponse correcte et des distracteurs plausibles. Chaque explication motive la réponse. Le script `scripts/audit-quizzes.mjs` mesure les positions et longueurs ; le test limite à moins de 40 % chacun des indices « plus long », « plus court » et positions. Ce seuil est un garde-fou contre un biais massif, pas une mesure de qualité pédagogique à lui seul.

Les en-têtes des tableaux correspondent aux cellules ; le premier en-tête décrit le critère de ligne. Les comparaisons de technologies exposent leurs hypothèses, avec des couleurs neutres pour les compromis. Les couleurs d’acteurs et de résultats cryptographiques gardent leur sens.

## Couverture retenue

La matrice est exposée sur chaque page de module via `src/data/coverage.ts`. « Démonstration » signifie calcul ou parcours animé précisément délimité, « Introduction » une explication des concepts, « Approfondissement externe » un sujet non implémenté.

| Sujet complémentaire                           | Niveau retenu                                               | Référence / limite                                                               |
| ---------------------------------------------- | ----------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Erreurs et reprises                            | Introduction                                                | Erreurs des scénarios OAuth et rejets du labo ; pas de moteur de retries général |
| Émission différée                              | Approfondissement externe                                   | OID4VCI §9                                                                       |
| Notifications                                  | Approfondissement externe                                   | OID4VCI §10                                                                      |
| Chiffrement VCI                                | Approfondissement externe                                   | OID4VCI §11                                                                      |
| Lots                                           | Introduction des risques de corrélation ; exécution externe | Nonces différents ou sels seuls ne garantissent pas l’unlinkability              |
| transaction_data                               | Approfondissement externe                                   | OID4VP §5 et profils de format                                                   |
| mdoc                                           | Introduction                                                | Format, MSO, clé device, SessionTranscript ; pas de validateur ISO               |
| Discovery et négociation                       | Démonstration simple ; variantes externes                   | Métadonnées Issuer/AS distinctes, OIDC Discovery ; pas de négociation exhaustive |
| Wallet attestation pour authentifier le client | Approfondissement externe                                   | HAIP §4.4.1 ; distinct de key attestation                                        |
| Extensions OIDC et sessions                    | Introduction ; logout/enregistrement externes               | Claims individuels et session locale expliqués                                   |
| DC API et HAIP                                 | Introduction                                                | OID4VP annexe A et HAIP 1.0 Final ; pas de conformité revendiquée                |

## Validation visuelle

Préserver les couleurs, trajectoires animées, transitions et commandes clavier des diagrammes. Toute nouvelle animation respecte `prefers-reduced-motion`. Contrôler le mobile, les débordements de tokens longs, les tables, les panneaux HTTP et le résultat de chaque erreur du laboratoire. Les conteneurs de code/diagrammes peuvent défiler horizontalement ; la page entière ne doit pas déborder.

Le Crypto Lab reste un point d’entrée de premier rang dans l’accueil, la navigation latérale et la barre supérieure. Les outils secondaires sont regroupés ; le menu Réglages rassemble apparence et données locales sans occuper un bloc permanent. Les pictogrammes applicatifs utilisent les composants Font Awesome SVG et leur couleur renforce le sens sans remplacer le libellé accessible.

Les familles de couleur des acteurs restent stables entre thèmes, avec des nuances plus profondes en thème clair. Une action pleine utilise `--on-accent` pour choisir la couleur du texte selon le thème. Pour un texte de taille normale, viser au moins 4,5:1 ; le bouton Crypto Lab clair est mesuré à 5,18:1. Vérifier les états normal, survolé, actif et désactivé lors de toute évolution des variables de thème.
