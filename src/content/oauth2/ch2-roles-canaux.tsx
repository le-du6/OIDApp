import { quizBank } from '../../data/quiz-bank'
import { Term } from '../../components/content/Term'
import { Callout } from '../../components/content/Callout'
import { Quiz } from '../../components/content/Quiz'
import { ScenarioLoader } from '../../components/sequence/AttackScenario'

/**
 * Chapitre 2 — Les 4 rôles et les 2 canaux.
 * LA notion structurante du module : front channel vs back channel.
 */
export default function Ch2RolesCanaux() {
  return (
    <div className="lesson-prose">
      <p>
        Pour comprendre un flow, demandez qui émet et reçoit chaque message, puis s'il passe par
        l'agent utilisateur ou par un appel direct. Le canal, le lieu d'exécution et
        l'authentification sont trois dimensions différentes.
      </p>
      <p>
        Le <Term id="front-channel" /> passe par l'agent utilisateur : redirections et fragments,
        par exemple. Un <Term id="back-channel" /> est ici un appel direct entre acteurs. Un wallet
        natif ou une SPA peut appeler un endpoint directement ; cela ne transforme pas ce logiciel
        en serveur ni en client authentifié.
      </p>

      <div className="not-prose my-6">
        <ScenarioLoader scenarioId="oauth2/canaux" />
      </div>

      <h2>Front channel : observable et manipulable — par construction</h2>
      <p>
        Une redirection peut exposer ses valeurs à l'historique, aux scripts ou aux extensions selon
        le contexte. Un fragment n'est pas envoyé au serveur dans la requête HTTP. Le flow Implicit
        historique livre précisément un access token dans ce fragment : il est déconseillé par RFC
        9700 §2.1.2. Dans le code flow retenu, le navigateur transporte un code, que PKCE lie à la
        transaction.
      </p>
      <p>
        Mais ce canal a une vertu irremplaçable : <strong>l'utilisateur le voit</strong>. C'est là
        qu'il vérifie le domaine de l'AS, lit l'écran de consentement, tape son mot de passe — sur
        le site de l'AS et nulle part ailleurs. Le front channel est le canal de l'humain.
      </p>

      <h2>Back channel : le canal des secrets</h2>
      <p>
        Dans notre exemple avec backend, le Client contacte le token endpoint sur TLS et
        s'authentifie. Dans un client public, l'appel est également direct, mais client_id
        l'identifie sans l'authentifier. Les secrets restent sensibles sur chaque transport et dans
        leur stockage ; un appel direct ne garantit pas leur invisibilité sur un appareil compromis.
      </p>

      <Callout kind="security" title="La grille de lecture à retenir">
        <p>
          Chaque règle apparemment arbitraire d'OAuth2 découle d'une seule question : «{' '}
          <em>cette donnée peut-elle survivre au front channel ?</em> ». Le code intermédiaire
          existe pour que le token n'y passe pas (chapitre 3). PKCE existe parce que le code y passe
          (chapitre 5). Implicit est mort parce que le token y passait (chapitre 5).
        </p>
      </Callout>

      <Callout kind="note" title="Clients confidentiels et publics">
        <p>
          La distinction <Term id="confidential-public-client" /> dépend de la capacité à protéger
          des moyens d'authentification. PKCE protège l'échange du code ; il ne constitue pas un
          secret client enregistré.
        </p>
      </Callout>

      <Quiz
        quizId="oauth2/roles-canaux/front-back-channel"
        questions={quizBank['oauth2/roles-canaux/front-back-channel']!}
      />
    </div>
  )
}
