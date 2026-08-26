import { Term } from '../../components/content/Term'
import { Callout } from '../../components/content/Callout'
import { Quiz } from '../../components/content/Quiz'
import { DecisionTree } from '../../components/content/DecisionTree'
import { ScenarioLoader } from '../../components/sequence/AttackScenario'

/**
 * Chapitre 6 — Les autres flows légitimes : Client Credentials, Device Grant,
 * et l'arbre de décision « quel flow pour quel cas ».
 */
export default function Ch6AutresFlows() {
  return (
    <div className="lesson-prose">
      <p>
        Restent deux grants bien vivants — parce qu'ils répondent à des besoins que le flow code ne
        couvre pas : « pas d'utilisateur du tout » et « un utilisateur, mais pas de navigateur ici
        ».
      </p>

      <h2>Client Credentials : machine à machine</h2>
      <p>
        Pas d'utilisateur, pas de délégation : un service parle à un autre{' '}
        <em>en son nom propre</em>. Le <Term id="client-credentials">Client Credentials grant</Term>{' '}
        est le plus simple du protocole — le Client s'authentifie au <Term id="token-endpoint" /> et
        reçoit un token. Pas de <Term id="resource-owner" />, pas de consentement, et pas de{' '}
        <Term id="refresh-token" /> : le Client peut se ré-authentifier quand il veut.
      </p>
      <Callout kind="security" title="Le piège du Client Credentials">
        <p>
          Comme il n'y a pas d'utilisateur, tout repose sur le secret du Client. Un{' '}
          <Term id="client-secret" /> qui fuit (dans un dépôt git, une image Docker, une variable de
          CI) donne un accès machine complet, souvent large en scope et peu surveillé. C'est
          aujourd'hui une des premières causes de compromission cloud. À réserver strictement au
          back channel serveur.
        </p>
      </Callout>

      <h2>Device Authorization Grant : l'utilisateur, mais ailleurs</h2>
      <p>
        Une TV, une CLI, un objet connecté : un utilisateur est bien là, mais l'appareil n'a pas de
        navigateur confortable. Le <Term id="device-grant" /> (RFC 8628) sépare les deux canaux —
        l'appareil affiche un code, l'utilisateur autorise depuis son téléphone, l'appareil
        interroge (<em>polling</em>) le token endpoint. Suivez la danse à deux appareils :
      </p>

      <div className="not-prose my-6">
        <ScenarioLoader scenarioId="oauth2/device-flow" />
      </div>

      <Callout kind="spec" specRef="RFC 8628 §3.5" title="Le polling, proprement">
        <p>
          Pendant l'attente, l'AS répond <code>authorization_pending</code> — un état, pas une
          erreur. S'il répond <code>slow_down</code>, l'appareil DOIT espacer ses requêtes.
          Respecter l'<code>interval</code> annoncé n'est pas de la politesse : c'est ce qui évite
          de faire tomber le token endpoint sous une nuée de clients IoT.
        </p>
      </Callout>

      <h2>Arbre de décision : quel flow ?</h2>
      <p>Toute la matière des chapitres 3 à 6 tient dans quelques questions. Parcourez-les :</p>

      <div className="not-prose my-4">
        <DecisionTree
          rootId="user"
          nodes={[
            {
              kind: 'question',
              id: 'user',
              question: 'Y a-t-il un utilisateur humain à autoriser ?',
              options: [
                { label: 'Non, machine à machine', next: 'm2m' },
                { label: 'Oui, un humain', next: 'browser' },
              ],
            },
            {
              kind: 'answer',
              id: 'm2m',
              result: 'Client Credentials',
              detail:
                'Aucun utilisateur, aucun consentement : le service agit en son nom. Protégez le secret comme un mot de passe de production (RFC 6749 §4.4).',
            },
            {
              kind: 'question',
              id: 'browser',
              question: 'L’appareil a-t-il un navigateur utilisable ?',
              options: [
                { label: 'Oui (web, mobile, desktop)', next: 'code' },
                { label: 'Non (TV, CLI, IoT)', next: 'device' },
              ],
            },
            {
              kind: 'answer',
              id: 'device',
              result: 'Device Authorization Grant',
              detail:
                'Deux appareils, deux canaux : code affiché ici, autorisation là-bas (RFC 8628).',
            },
            {
              kind: 'answer',
              id: 'code',
              result: 'Authorization Code + PKCE',
              detail:
                'LA réponse par défaut, client public ou confidentiel. PKCE obligatoire (RFC 9700). Ni implicit, ni ROPC — jamais.',
            },
          ]}
        />
      </div>

      <Callout kind="note" title="Le tri, en une phrase">
        <p>
          Pas d'humain → <strong>Client Credentials</strong>. Un humain avec navigateur →{' '}
          <strong>Authorization Code + PKCE</strong>. Un humain sans navigateur ici →{' '}
          <strong>Device Grant</strong>. Tout le reste (implicit, ROPC) est historique.
        </p>
      </Callout>

      <Quiz
        quizId="oauth2/autres-flows/client-credentials-device"
        questions={[
          {
            id: 'q1',
            question: 'Pourquoi le Client Credentials grant n’émet-il pas de refresh token ?',
            options: [
              {
                text: 'Par oubli de la spec',
                explanation: 'Non — c’est délibéré (RFC 6749 §4.4.3).',
              },
              {
                text: 'Parce que le Client peut se ré-authentifier quand il veut avec ses propres credentials',
                correct: true,
                explanation:
                  'Oui — un refresh token sert à éviter de re-solliciter l’UTILISATEUR. Ici il n’y en a pas : le Client redemande simplement un token.',
              },
              {
                text: 'Parce que les tokens machine n’expirent jamais',
                explanation:
                  'Non — ils expirent bel et bien ; le Client en redemande via ses credentials.',
              },
            ],
          },
          {
            id: 'q2',
            question: 'Dans le device flow, quel code l’utilisateur saisit-il sur son téléphone ?',
            options: [
              {
                text: 'Le device_code',
                explanation:
                  'Non — le device_code est le secret de l’appareil, long et jamais montré. C’est lui qui s’échange contre le token.',
              },
              {
                text: 'Le user_code, court et lisible',
                correct: true,
                explanation:
                  'Oui — deux codes pour deux canaux : user_code (humain) et device_code (machine). L’un sans l’autre ne donne aucun token (RFC 8628).',
              },
              {
                text: 'Son mot de passe AS directement dans l’appareil',
                explanation:
                  'Non — l’intérêt du flow est justement que le mot de passe reste sur le téléphone de confiance, jamais sur la TV.',
              },
            ],
          },
          {
            id: 'q3',
            question: 'Une nouvelle app web avec login utilisateur : quel flow en 2026 ?',
            options: [
              {
                text: 'Implicit, c’est fait pour le navigateur',
                explanation: 'Non — implicit est déprécié (RFC 9700 §2.1.2). Jamais pour du neuf.',
              },
              {
                text: 'Authorization Code + PKCE',
                correct: true,
                explanation:
                  'Oui — le défaut universel pour tout client avec navigateur, public ou confidentiel.',
              },
              {
                text: 'ROPC, pour éviter la redirection',
                explanation:
                  'Non — ROPC fait saisir le mot de passe au Client : l’anti-pattern fondateur, déprécié (RFC 9700 §2.4).',
              },
            ],
          },
        ]}
      />
    </div>
  )
}
