import { quizBank } from '../../data/quiz-bank'
import { Term } from '../../components/content/Term'
import { Callout } from '../../components/content/Callout'
import { Quiz } from '../../components/content/Quiz'
import { AttackScenario } from '../../components/sequence/AttackScenario'

/**
 * OIDC — Chapitre 0 : pourquoi OIDC existe. Délégation ≠ authentification,
 * démontré par l'anti-pattern « login avec un access token » (jouable).
 */
export default function OidcCh0() {
  return (
    <div className="lesson-prose">
      <p>
        Tout OAuth 2.0 que vous venez d'apprendre répond à une question : « cette application
        a-t-elle le droit d'accéder à cette ressource ? ». Une question qu'il ne sait <em>pas</em>{' '}
        traiter : « qui est l'utilisateur devant moi ? ». OAuth2 fait de la{' '}
        <strong>délégation d'accès</strong>, pas de l'<strong>authentification</strong>. Confondre
        les deux est l'erreur la plus répandue du domaine — et une vraie faille.
      </p>

      <h2>L'anti-pattern : « login avec un access token »</h2>
      <p>
        Un access token peut comporter une audience, un sujet et un client_id, notamment avec RFC
        9068. Il autorise néanmoins l'accès à une ressource : ce n'est pas le résultat
        d'authentification destiné au RP avec les contrôles OIDC. Un token obtenu pour une autre
        application peut tromper un login qui se contente d'appeler UserInfo sans valider cette
        liaison. Jouez les deux versions de l'exemple.
      </p>

      <div className="not-prose my-6">
        <AttackScenario
          attackId="oidc/login-antipattern-broken"
          protectedId="oidc/login-antipattern-protected"
          attackLabel="Login par access token"
          protectedLabel="Login par ID Token"
        />
      </div>

      <Callout kind="spec" specRef="OIDC Core 1.0 §16.11" title="Dans la spec">
        <p>
          La section « Token Substitution » du Core décrit exactement ce risque : un access token
          obtenu pour un Client peut être présenté à un autre. La parade n'est pas un correctif
          ponctuel — c'est OIDC lui-même, qui introduit un jeton <em>conçu</em> pour l'identité :
          l'ID Token.
        </p>
      </Callout>

      <h2>Ce qu'OIDC ajoute</h2>
      <p>
        <Term id="oidc" /> est une couche mince au-dessus d'OAuth 2.0. Elle ne remplace rien : elle
        réutilise l'Authorization Code Flow et ajoute quatre choses. Un <Term id="id-token" /> (le
        jeton d'identité), un endpoint <Term id="userinfo" /> (des claims frais), la{' '}
        <Term id="discovery" /> (configuration automatique), et un vocabulaire : l'Authorization
        Server devient <Term id="openid-provider" />, le Client devient <Term id="relying-party" />.
      </p>
      <Callout kind="note" title="La règle à retenir">
        <p>
          Pour <strong>accéder à une API</strong> : access token. Pour{' '}
          <strong>authentifier un utilisateur</strong> : ID Token, validé entièrement. Ne jamais
          utiliser l'un à la place de l'autre — leurs audiences, et donc leurs destinataires
          légitimes, sont différents.
        </p>
      </Callout>

      <Quiz
        quizId="oidc/pourquoi-oidc/anti-pattern-login"
        questions={quizBank['oidc/pourquoi-oidc/anti-pattern-login']!}
      />
    </div>
  )
}
