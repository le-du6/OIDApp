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
        Un raccourci tentant : « l'utilisateur m'a donné un <Term id="access-token" /> valide, donc
        il est authentifié ». C'est faux, pour une raison structurelle : un access token ne dit ni{' '}
        <strong>pour qui</strong> il a été émis, ni <strong>pour quel destinataire</strong>. C'est
        un <Term id="bearer-token" /> : quiconque le détient peut l'utiliser, et rien dedans ne le
        lie à votre application. Jouez l'attaque — la{' '}
        <Term id="userinfo">substitution de token</Term> — puis basculez sur la version corrigée :
      </p>

      <div className="not-prose my-6">
        <AttackScenario
          attackId="oidc/login-antipattern-broken"
          protectedId="oidc/login-antipattern-protected"
          attackLabel="🧨 Login par access token"
          protectedLabel="🛡 Login par ID Token"
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
        questions={[
          {
            id: 'q1',
            question: 'Pourquoi un access token ne prouve-t-il pas l’identité de qui le présente ?',
            options: [
              {
                text: 'Parce qu’il est chiffré et illisible par le RP',
                explanation:
                  'Non — un access token peut être opaque ou un JWT lisible ; ce n’est pas la question. Le problème est ce qu’il atteste, pas sa lisibilité.',
              },
              {
                text: 'Parce que c’est un bearer token sans audience côté RP ni preuve de présence',
                correct: true,
                explanation:
                  'Oui — il atteste un droit d’accès accordé à un Client, pas la présence d’un utilisateur devant CE RP. Quiconque le détient peut l’utiliser.',
              },
              {
                text: 'Parce qu’il expire trop vite pour authentifier',
                explanation:
                  'Non — la durée de vie n’a rien à voir. Même frais, un access token n’atteste aucune identité auprès d’un tiers.',
              },
            ],
          },
          {
            id: 'q2',
            question: 'Qu’est-ce qui, dans l’ID Token, bloque la substitution de token ?',
            options: [
              {
                text: 'Sa signature, à elle seule',
                explanation:
                  'Non — la signature prouve l’origine (l’OP l’a émis), pas le destinataire. Un ID Token signé mais émis pour un autre client reste dangereux si on ne vérifie que la signature.',
              },
              {
                text: 'Son audience (aud = client_id) et le nonce, vérifiés par le RP',
                correct: true,
                explanation:
                  'Oui — aud dit POUR QUI le jeton a été fabriqué ; nonce le lie à une requête précise. Un jeton d’un autre client, ou rejoué, échoue à ces contrôles.',
              },
              {
                text: 'Le fait qu’il ne transite jamais par le navigateur',
                explanation:
                  'Non — en code flow l’ID Token vient du token endpoint, mais c’est vrai aussi de l’access token. Ce n’est pas là qu’est la différence.',
              },
            ],
          },
          {
            id: 'q3',
            question: 'Quelle formule résume le partage des rôles ?',
            options: [
              {
                text: 'ID Token pour l’API, access token pour le login',
                explanation:
                  'Non, c’est l’inverse exact — et c’est précisément l’anti-pattern de ce chapitre.',
              },
              {
                text: 'Access token pour accéder à une API, ID Token pour authentifier un utilisateur',
                correct: true,
                explanation:
                  'Oui — deux jetons, deux audiences, deux usages. Les intervertir rouvre la substitution de token.',
              },
              {
                text: 'Un seul jeton suffit si sa signature est valide',
                explanation:
                  'Non — la signature ne dit rien du destinataire ni de l’usage. C’est toute la leçon.',
              },
            ],
          },
        ]}
      />
    </div>
  )
}
