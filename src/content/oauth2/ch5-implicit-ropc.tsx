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
        La RFC 6749 définissait quatre grants. Deux sont aujourd'hui officiellement enterrés par le
        Security BCP (<span className="font-mono text-xs">RFC 9700</span>) et absents d'OAuth 2.1.
        Comprendre <em>pourquoi</em> ils sont morts vaut mieux que d'apprendre qu'ils le sont : ce
        sont deux leçons de conception.
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
          Le Security BCP est sans ambiguïté : l'implicit grant ne DOIT plus être utilisé — le flow
          expose les tokens dans l'URL et ne permet ni l'authentification du client ni la protection
          PKCE. La cause de sa naissance a disparu : CORS permet aujourd'hui à une SPA d'appeler le
          token endpoint. Remplacement : Authorization Code + PKCE, pour tous.
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
          Au-delà de l'exposition du mot de passe : l'AS ne contrôle plus l'expérience
          d'authentification — donc pas de MFA, pas de passkeys, pas de fédération, pas de détection
          de connexion suspecte. Et l'utilisateur est <em>entraîné</em> à taper son mot de passe
          dans des interfaces tierces : le phishing devient culturellement normal. RFC 9700 §2.4 :
          ne DOIT plus être utilisé.
        </p>
      </Callout>

      <Quiz
        quizId="oauth2/attaques/implicit-ropc"
        questions={[
          {
            id: 'q1',
            question: 'Quelle est la différence de fond entre implicit et le flow code ?',
            options: [
              {
                text: 'Implicit est plus rapide mais moins fiable réseau',
                explanation:
                  'Non — la différence est de sécurité, pas de performance : QUOI transite par le front channel.',
              },
              {
                text: 'Implicit fait transiter le pouvoir (le token) là où le flow code ne fait transiter qu’un jeton intermédiaire périssable',
                correct: true,
                explanation:
                  'Oui — même canal exposé dans les deux cas, mais cargaison radicalement différente : un bearer token vs un code éphémère, à usage unique, inutilisable seul.',
              },
              {
                text: 'Implicit exige un client confidentiel',
                explanation:
                  'Non, l’inverse : implicit visait justement les clients publics — c’est bien le problème, personne ne s’authentifie à la remise du token.',
              },
            ],
          },
          {
            id: 'q2',
            question: 'Pourquoi PKCE ne peut-il pas « réparer » implicit ?',
            options: [
              {
                text: 'Parce que PKCE exige un client_secret',
                explanation: 'Non — PKCE est précisément conçu pour les clients SANS secret.',
              },
              {
                text: 'Parce qu’il n’y a pas d’étape d’échange à protéger : le token est remis directement',
                correct: true,
                explanation:
                  'Oui — PKCE sécurise l’ÉCHANGE code → token au token endpoint. Implicit saute cette étape : il n’y a nulle part où présenter un verifier.',
              },
              {
                text: 'Parce que le fragment d’URL ne peut pas contenir de code_challenge',
                explanation:
                  'Non — techniquement il le pourrait ; c’est l’absence d’échange en back channel qui rend PKCE sans objet.',
              },
            ],
          },
          {
            id: 'q3',
            question: 'Une app legacy utilise ROPC « parce que c’est plus simple ». Le vrai coût ?',
            options: [
              {
                text: 'Des URL plus longues',
                explanation: 'Non — rien à voir.',
              },
              {
                text: 'Le Client voit le mot de passe, et l’AS perd MFA, passkeys, SSO et toute détection — tout en entraînant l’utilisateur au phishing',
                correct: true,
                explanation:
                  'Oui — ROPC ne dégrade pas un détail : il annule la raison d’être du protocole et sabote l’écosystème d’authentification moderne (RFC 9700 §2.4).',
              },
              {
                text: 'Une latence supplémentaire à chaque connexion',
                explanation:
                  'Non — ROPC est même plus « rapide » (un seul aller-retour). C’est bien pour ça qu’il a séduit : le coût est ailleurs.',
              },
            ],
          },
        ]}
      />
    </div>
  )
}
