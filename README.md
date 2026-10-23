# OIDApp — Dashboard pédagogique OAuth2 · OIDC · OID4VCI · OID4VP

Application web pédagogique en français pour apprendre en profondeur **OAuth 2.0**, **OpenID
Connect**, **OID4VCI** et **OID4VP**, avec un fil rouge permanent : la sécurité et la
cryptographie. Chaque mécanisme répond à la question _« quel problème de sécurité ce truc
résout-il, et que se passerait-il sans lui ? »_.

SPA 100 % statique : aucun backend, aucune donnée ne sort du navigateur. La progression est
persistée localement (IndexedDB) et exportable en JSON.

## Démarrage

La migration du projet utilise **Vite+ et pnpm** (versions fixées dans `package.json` et `pnpm-workspace.yaml`).

```bash
vp install
vp dev
vp check          # format, lint et types
vp test run       # tests de scénarios, contenu et cryptographie
vp run build      # build et tsc -b → dist/
vp preview
```

Pour un sous-chemin : `VITE_BASE=/OIDApp/ vp run build`. `dist/` se sert statiquement ; le serveur doit renvoyer `index.html` pour les routes applicatives.

## Stack et limites

React 19, TypeScript strict, TanStack Router/Query, Tailwind CSS, Motion, Dexie, Zod et Shiki. Vite+ pilote la compilation et les vérifications ; pnpm gère les dépendances. Les primitives interactives utilisent WebCrypto. `jose` sert uniquement aux générateurs de fixtures, Playwright aux contrôles navigateur.

Les scénarios représentent les échanges : ils n’effectuent aucun appel vers les domaines fictifs `.example`. Le laboratoire calcule réellement certaines signatures et empreintes, mais ne constitue pas un serveur OAuth, un wallet ou un validateur universel.

## Référentiel et parcours

Les 32 leçons annoncent leurs versions : RFC 6749 et Security BCP RFC 9700 ; OIDC Core/Discovery 1.0 errata set 2 ; OID4VCI 1.0 Final ; OID4VP 1.0 Final ; SD-JWT RFC 9901 et SD-JWT VC draft 19. OAuth 2.1 draft 16 reste un draft. HAIP 1.0 est Final depuis le 24 décembre 2025.

Chaque leçon offre des repères et prérequis ; les pages de module exposent leur matrice de couverture. Les explications HTTP/JWT partagent une convention, tout en distinguant leurs profils. Le cours sépare exigences, recommandations, options et politiques de démonstration.

- [Réexamen et arbitrages des 35 reprises](.specs/OIDApp-reexamen-2026-10-22.md)
- [Plan consolidé et suivi de réalisation](.specs/OIDApp-plan-de-reprise-consolide.md)
- [Conventions, prérequis et couverture](.specs/OIDApp-conventions-pedagogiques.md)

## Le fil key binding

Le même credential et la même clé publique relient les fixtures VCI et VP. Dans `/labo-crypto#binding`, une émission jetable mène à une présentation réellement signée : sélectionner les disclosures, signer, vérifier, puis essayer mauvaise clé/audience/nonce, ancienneté, sélection modifiée et seconde soumission.

Le laboratoire annonce son horloge fixe et sa politique de transaction. Il distingue liaison signée par l’Issuer, contrôle de clé, contexte de présentation et protection du stockage. Son profil reste limité : ES256, SHA-256, cnf.jwk, disclosures simples, type attendu et claim requis. Statut, X.509, matériel sécurisé, mdoc, JWE et DCQL général sont expliqués mais non exécutés.

## Le modèle de scénario — l'API de contribution du contenu

Toute la valeur pédagogique est dans les fichiers de scénarios : `public/scenarios/**/*.json`,
validés au chargement par le schéma Zod de `src/engine/scenario.ts` (source de vérité des types).
Un scénario mal formé échoue bruyamment au chargement, jamais silencieusement au rendu.

```jsonc
{
  "id": "oauth2/authorization-code", // chemin du fichier sans .json
  "title": "Authorization Code Flow (nu)",
  "description": "…", // affiché dans le panneau avant lecture
  "specRefs": ["RFC 6749 §4.1"], // références normatives principales
  "actors": [
    {
      "id": "as", // référencé par les étapes
      "name": "Authorization Server", // tête de swimlane (terme officiel EN)
      "role": "authorization-server", // pilote le code couleur constant de l'app
      "alias": "= « login avec… »", // traduction concrète, affichée sous le nom
    },
  ],
  "steps": [
    {
      "id": "token-request", // unique dans le scénario
      "from": "client",
      "to": "as", // ids d'acteurs (validés par Zod)
      "kind": "http", // http | redirect | user-action | internal | attack
      "label": "POST /token", // porté par la flèche (monospace)
      "summary": "…", // explication pédagogique (panneau latéral)
      "request": {
        // échange pédagogique, affiché au clic
        "channel": "back", // front (via navigateur) | back (appel direct entre acteurs)
        "request": {
          "method": "POST",
          "url": "https://as.example/token",
          "params": [
            // chaque paramètre annoté :
            {
              "name": "grant_type",
              "value": "authorization_code",
              "description": "…", // définition au survol
              "specRef": "RFC 6749 §4.1.3",
            },
          ],
          "headers": { "…": "…" },
          "body": { "type": "form", "content": "…", "params": [] },
        },
        "response": { "status": 200, "headers": {}, "body": {} },
      },
      "tokens": [
        // artefacts inspectables à cette étape
        { "id": "at", "label": "Access token", "format": "jwt", "value": "eyJ…", "note": "…" },
      ],
      "security": {
        // encadré sécurité de l'étape
        "level": "info", // info | warning | danger
        "note": "…",
        "specRef": "RFC 6749 §10.5",
      },
    },
  ],
  "variants": [], // à venir : diff de scénarios (sans/avec PKCE, attaqué/protégé)
}
```

Règles de contenu : les termes protocolaires restent en anglais officiel et sont expliqués en
français à leur première apparition ; chaque affirmation normative cite sa source (RFC/spec,
numéro de section) ; tous les tokens/clés/secrets sont des fixtures générées (jose), jamais des
données réelles.

## Architecture

```
src/
  engine/       moteur : schéma Zod des scénarios, séquenceur (reducer pur), layout SVG
  components/
    sequence/   SequenceDiagram (le cœur : SVG animé, contrôles, panneau de détail)
    http/       HttpRequestView (échange HTTP annoté, canal et champs expliqués)
    jwt/        JwtInspector (3 zones colorées, claims annotés)
    layout/     Sidebar, ProgressRing (SVG maison), ThemeToggle
  components/
    content/    briques de leçon : Term (popover glossaire), Callout, CodeBlock (Shiki),
                Quiz, CompareTable, DecisionTree
  content/      oauth2/ (11) + oidc/ (7) + oid4vci/ (7) + oid4vp/ (7 leçons), lazy via registry.ts
  routes/       TanStack Router file-based : / (dashboard), /$moduleId,
                /$moduleId/$chapitre/$lecon, /glossaire, /labo-crypto,
                /carte-des-specs (@xyflow/react), /comparateur
  data/         curriculum.ts (navigation + versions de référence des specs),
                glossary.ts (termes et garanties contextualisés), spec-map.ts (graphe des specs),
                fixtures/ (OIDC + OID4VCI + OID4VP — GÉNÉRÉES, cf. scripts/)
  db/           Dexie + hooks TanStack Query, export/import/reset de la progression
  lib/          jwt.ts (décodage base64url à la main), crypto.ts (WebCrypto : PKCE, ES256,
                at_hash, vérif. JWS), actors.ts (code couleur)
scripts/        gen-{oidc,oid4vci,oid4vp}-fixtures.mjs (jose, dev) → src/data/fixtures/
public/
  scenarios/    oauth2/ (8) + oidc/ (5) + oid4vci/ (5) + oid4vp/ (4) scénarios JSON
```

## Fixtures et vérifications

`node scripts/gen-credential-chain.mjs` régénère **ensemble** VCI et VP, leurs preuves et les tokens dans les scénarios. Les anciens points d’entrée `gen-oid4vci-fixtures.mjs` et `gen-oid4vp-fixtures.mjs` appellent le même générateur. Les clés privées ne sont pas écrites, les sels sont aléatoires et les dates fixes sont documentées. OIDC dispose du générateur distinct `gen-oidc-fixtures.mjs`.

`node scripts/audit-quizzes.mjs` mesure les indices de longueur et de position des 96 questions. Les tests contrôlent aussi la livraison du code au callback, les corps form, les URI d’invocation, la cohérence des artefacts affichés et les causes de rejet indépendantes du binding.

Les animations et les contrôles de lecture des diagrammes sont conservés ; le nouveau laboratoire respecte la réduction des mouvements. Les 32 identifiants de leçons restent stables pour la progression locale. Les scores précédemment enregistrés ne sont pas effacés lors de la réécriture des quiz.

Le suivi du plan décrit les preuves de validation et les limites de couverture. Un parcours rédigé ne signifie pas une implémentation exhaustive ou certifiée de toutes les extensions.
