import { quizBank } from '../../data/quiz-bank'
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
        reçoit un token. Pas de connexion interactive du Resource Owner ; un{' '}
        <Term id="refresh-token" /> ne devrait pas être émis dans ce grant (RFC 6749 §4.4.3) : le
        Client peut se ré-authentifier.
      </p>
      <Callout kind="security" title="Le piège du Client Credentials">
        <p>
          Client Credentials est réservé aux clients confidentiels. Leur authentification peut
          utiliser un secret ou une clé privée selon le mécanisme accepté par l'AS. Protéger ces
          moyens et limiter la portée du token sont essentiels : ce grant n'autorise pas
          automatiquement un accès complet.
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
                'LA réponse par défaut, client public ou confidentiel. PKCE requis pour les publics, recommandé pour les confidentiels (RFC 9700). Implicit déconseillé, ROPC interdit.',
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
        questions={quizBank['oauth2/autres-flows/client-credentials-device']!}
      />
    </div>
  )
}
