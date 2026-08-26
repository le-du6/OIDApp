# OIDApp — Dashboard pédagogique OAuth2 · OIDC · OID4VCI · OID4VP

Application web pédagogique en français pour apprendre en profondeur **OAuth 2.0**, **OpenID
Connect**, **OID4VCI** et **OID4VP**, avec un fil rouge permanent : la sécurité et la
cryptographie. Chaque mécanisme répond à la question _« quel problème de sécurité ce truc
résout-il, et que se passerait-il sans lui ? »_.

SPA 100 % statique : aucun backend, aucune donnée ne sort du navigateur. La progression est
persistée localement (IndexedDB) et exportable en JSON.

## Démarrage

```bash
npm install
npm run dev        # serveur de développement
npm run test       # tests Vitest (moteur de scénarios, séquenceur, layout, JWT)
npm run build      # tsc -b + vite build → dist/ autonome
npm run lint       # oxlint
npm run format     # prettier
```

Déploiement : `dist/` se sert tel quel (Netlify, GitHub Pages…). Pour un sous-chemin
(GitHub Pages de projet), builder avec `VITE_BASE=/OIDApp/ npm run build` — le workflow
`.github/workflows/pages.yml` le fait automatiquement à chaque push sur `main`
(activer Pages → Source « GitHub Actions » dans les réglages du repo).

## Stack

Vite + React 19 + TypeScript strict · TanStack Router (file-based, SPA) · TanStack Query ·
Tailwind CSS v4 (dark par défaut, bascule light) · Motion · Dexie (IndexedDB) · Zod · Shiki ·
WebCrypto natif pour le futur Crypto Lab (aucune lib crypto tierce, c'est un argument
pédagogique) · Vitest.

Justification des dépendances hors liste initiale (cf. garde-fous du projet) :

- **oxlint** remplace ESLint : linter par défaut du template Vite 8, plus rapide, mêmes règles
  utiles ici (rules-of-hooks…), zéro config supplémentaire.
- **jose** (dev uniquement) : génération de fixtures JWT réalistes (signées ES256) intégrées aux
  scénarios — jamais embarquée dans le bundle.
- **playwright** (dev uniquement) : smoke test du parcours OAuth2 sur le build de production.

Persistance : **Dexie exposé via TanStack Query** plutôt que TanStack DB — les besoins sont des
lectures simples avec invalidation par clé, sans requêtes relationnelles ni sync ; TanStack DB
ajouterait un concept sans bénéfice ici (`src/db/hooks.ts`).

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
        // échange HTTP complet, affiché au clic
        "channel": "back", // front (via navigateur) | back (serveur↔serveur)
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
    http/       HttpRequestView (échange HTTP annoté, badge front/back channel)
    jwt/        JwtInspector (3 zones colorées, claims annotés)
    layout/     Sidebar, ProgressRing (SVG maison), ThemeToggle
  components/
    content/    briques de leçon : Term (popover glossaire), Callout, CodeBlock (Shiki),
                Quiz, CompareTable, DecisionTree
  content/      oauth2/ : les 11 leçons rédigées (TSX), chargées en lazy via registry.ts
  routes/       TanStack Router file-based : / (dashboard), /$moduleId,
                /$moduleId/$chapitre/$lecon, /glossaire, /labo-crypto
  data/         curriculum.ts (navigation), glossary.ts (40 entrées)
  db/           Dexie + hooks TanStack Query, export/import JSON de la progression
  lib/          jwt.ts (décodage base64url à la main), crypto.ts (WebCrypto : PKCE, ES256…),
                actors.ts (code couleur)
public/
  scenarios/    les 8 scénarios JSON (l'API de contribution ci-dessus)
```

## État d'avancement

- [x] Squelette : layout dashboard/menu, thème bleu nuit (dark/light), Dexie, CI
- [x] Moteur `SequenceDiagram` (SVG animé, self-messages, adaptatif), tests Vitest
- [x] **Phase 1 — OAuth2 complète** : 8 chapitres (0–7) rédigés, 8 scénarios `SequenceDiagram`
      (dont attaques jouables attaqué/protégé), glossaire de 40 entrées, Crypto Lab (SHA-256,
      PKCE, ES256, JWT), quiz + badges par chapitre, export de progression. 34 tests, build
      statique, smoke tests Playwright.
- [ ] Phase 2 — OIDC · Phase 3 — OID4VCI · Phase 4 — OID4VP
