import { quizBank } from '../../data/quiz-bank'
import { Term } from '../../components/content/Term'
import { Callout } from '../../components/content/Callout'
import { Quiz } from '../../components/content/Quiz'
import { CodeBlock } from '../../components/content/CodeBlock'
import { ScenarioLoader } from '../../components/sequence/AttackScenario'

/**
 * Chapitre 5, leçon 3 — Pourquoi Implicit et ROPC sont morts.
 * Montrer le flow, montrer la faille, montrer la dépréciation par le BCP.
 */
export default function Ch5ImplicitRopc() {
  return (
    <div className="lesson-prose">
      <p>
        RFC 9700 distingue deux niveaux : les clients ne devraient pas utiliser Implicit avec
        livraison d'access token par l'authorization endpoint ; ROPC ne doit pas être utilisé. Le
        draft OAuth 2.1 écarte ces deux grants. Les comprendre aide à reconnaître leurs risques dans
        les systèmes historiques.
      </p>

      <h2>Implicit : le token dans l'URL</h2>
      <p>
        L'
        <Term id="implicit-grant" /> renvoyait l'
        <Term id="access-token" /> directement dans le fragment (<code>#access_token=…</code>), sans
        passage par le <Term id="token-endpoint" />. Raison d'être en 2012 : les navigateurs ne
        pouvaient pas faire d'appels cross-origin (pas de CORS généralisé), et une SPA n'a pas de
        secret. Le prix : le token — le pouvoir lui-même — traverse le front channel, sans
        authentification du destinataire, sans <Term id="pkce" /> possible (rien à échanger), sans
        refresh token. Jouez le flow et son naufrage :
      </p>

      <div className="not-prose my-6">
        <ScenarioLoader scenarioId="oauth2/implicit-broken" />
      </div>

      <Callout kind="spec" specRef="RFC 9700 §2.1.2" title="La sentence">
        <p>
          RFC 9700 §2.1.2 déconseille les réponses livrant un access token depuis l'authorization
          endpoint (SHOULD NOT). Le choix enseigné est Authorization Code avec PKCE. L'interdiction
          MUST NOT de §2.4 concerne ROPC : les deux niveaux normatifs ne sont pas interchangeables.
        </p>
      </Callout>

      <h2>ROPC : l'anti-pattern promu grant</h2>
      <p>
        Le <Term id="ropc" /> mérite une mention spéciale : l'utilisateur donne son mot de passe{' '}
        <em>au Client</em>, qui l'échange contre des tokens. Relisez le chapitre 1 : c'est mot pour
        mot l'anti-pattern qu'OAuth2 a été inventé pour éliminer — réintroduit dans la spec comme «
        aide à la migration » pour les apps legacy. Ce pragmatisme de 2012 a fourni pendant dix ans
        une excuse standardisée pour ne pas faire de vraie délégation.
      </p>
      <CodeBlock
        lang="http"
        title="ROPC (RFC 6749 §4.3) — à reconnaître pour le refuser"
        code={`POST /token HTTP/1.1
Host: as.example
Content-Type: application/x-www-form-urlencoded

grant_type=password&username=vous@example.com&password=VOTRE_MOT_DE_PASSE
# Le Client a vu le mot de passe. Tout ce qui suit est déjà perdu :
# pas de consentement par scope, pas de MFA/passkeys/SSO,
# le phishing devient indistinguable de l'usage légitime.`}
      />
      <Callout kind="security" title="Ce que ROPC casse structurellement">
        <p>
          ROPC expose le mot de passe au client et ne fournit pas le parcours interactif nécessaire
          à de nombreuses méthodes modernes d'authentification. Des extensions propriétaires ne le
          rendent pas recommandé : RFC 9700 §2.4 l'interdit. Les mécanismes de détection d'abus du
          serveur restent possibles, mais ils ne corrigent pas ce défaut d'architecture.
        </p>
      </Callout>

      <Quiz
        quizId="oauth2/attaques/implicit-ropc"
        questions={quizBank['oauth2/attaques/implicit-ropc']!}
      />
    </div>
  )
}
