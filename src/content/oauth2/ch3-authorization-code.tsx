import { quizBank } from '../../data/quiz-bank'
import { Term } from '../../components/content/Term'
import { Callout } from '../../components/content/Callout'
import { Quiz } from '../../components/content/Quiz'
import { ScenarioLoader } from '../../components/sequence/AttackScenario'

/**
 * Chapitre 3 — Authorization Code Flow, le flow canonique, pas à pas.
 */
export default function Ch3AuthorizationCode() {
  return (
    <div className="lesson-prose">
      <p>
        Voici un code flow avec client confidentiel et backend. Cliquez sur chaque flèche pour lire
        la requête, sa réponse et les champs expliqués. Le chapitre des attaques complète ce premier
        parcours avec PKCE et la corrélation de session.
      </p>

      <div className="not-prose my-6">
        <ScenarioLoader scenarioId="oauth2/authorization-code" />
      </div>

      <h2>La question centrale : pourquoi un code intermédiaire ?</h2>
      <p>
        Dans ce parcours avec backend, regardez la trajectoire : la demande d'autorisation part en{' '}
        <Term id="front-channel" /> (il faut bien passer par l'utilisateur — c'est lui qui consent),
        mais le <Term id="access-token" /> n'y met jamais les pieds. Entre les deux, l'
        <Term id="authorization-code" /> fait le pont : il traverse le navigateur — zone exposée —
        puis s'échange contre les tokens en <Term id="back-channel" /> — zone protégée, avec
        authentification du Client.
      </p>
      <p>
        Le code est conçu pour sa traversée : <strong>opaque pour le client</strong> (sa structure
        interne ne doit pas être interprétée), <strong>éphémère</strong> (quelques secondes à
        quelques minutes), <strong>à usage unique</strong> (l'AS doit rejeter — et peut révoquer les
        tokens déjà émis — si un code est présenté deux fois), et <strong>lié</strong> au{' '}
        <Term id="client-id" /> et à la <Term id="redirect-uri" /> de la demande. Un code volé reste
        sensible : le chapitre 5 montre comment <Term id="pkce" /> lie son échange à un secret de
        transaction.
      </p>

      <Callout kind="spec" specRef="RFC 6749 §4.1.3 · §10.5" title="Dans la spec">
        <p>
          Si redirect_uri figurait dans la demande, le Client DOIT présenter au token endpoint le
          même <code>redirect_uri</code> que dans l'authorization request, et l'AS DOIT vérifier
          cette égalité. Un code est à usage unique ; en cas de réutilisation, l'AS DEVRAIT révoquer
          tous les tokens déjà émis sur ce code. Ces deux phrases arrêtent des attaques entières.
        </p>
      </Callout>

      <h2>Les paramètres qui comptent</h2>
      <p>
        Dans l'authorization request (étape 3 du diagramme) : <code>response_type=code</code>{' '}
        annonce le flow ; <Term id="client-id" /> identifie l'app (donnée publique) ;{' '}
        <Term id="redirect-uri" /> dit où livrer le code — comparée en correspondance{' '}
        <em>exacte</em> avec l'enregistrement ; <Term id="scope" /> énonce le périmètre demandé, que
        l'écran de consentement traduit pour l'humain. Au retour, le Client échange{' '}
        <code>grant_type=authorization_code</code> + le code + son authentification (
        <Term id="client-secret" /> en Basic) contre la réponse JSON : <code>
          access_token
        </code>,{' '}
        <code>token_type</code>, <code>expires_in</code>, et souvent un <Term id="refresh-token" />.
      </p>

      <Callout kind="security" title="Ce que ce flow garantit — et ce qu'il ne garantit pas">
        <p>
          Dans cet exemple avec backend, les tokens reviennent par un appel direct ; cela n'est pas
          une garantie pour tous les grants et toutes les architectures. La protection CSRF et la
          liaison du code à la transaction doivent aussi être établies. Le chapitre suivant détaille
          state et PKCE, puis leurs conditions d'application.
        </p>
      </Callout>

      <Quiz
        quizId="oauth2/authorization-code/flow-pas-a-pas"
        questions={quizBank['oauth2/authorization-code/flow-pas-a-pas']!}
      />
    </div>
  )
}
