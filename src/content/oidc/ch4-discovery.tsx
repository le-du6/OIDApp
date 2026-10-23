import { quizBank } from '../../data/quiz-bank'
import { Term } from '../../components/content/Term'
import { Callout } from '../../components/content/Callout'
import { Quiz } from '../../components/content/Quiz'
import { CodeBlock } from '../../components/content/CodeBlock'
import { ScenarioLoader } from '../../components/sequence/AttackScenario'

/**
 * OIDC — Chapitre 4 : Discovery & JWKS. Configurer un RP sans rien coder en
 * dur, à partir du seul issuer. Validation de l'issuer comme ancre.
 */
export default function OidcCh4() {
  return (
    <div className="lesson-prose">
      <p>
        Comment votre application sait-elle <em>où</em> envoyer l'utilisateur, <em>où</em> échanger
        le code, <em>où</em> trouver les clés de vérification ? Sans <Term id="discovery" />, ces
        URL sont codées en dur — fragile, et pénible à maintenir quand l'OP fait tourner ses clés.
        La Discovery les publie à un emplacement standard, dérivé du seul <Term id="issuer" />.
      </p>

      <div className="not-prose my-6">
        <ScenarioLoader scenarioId="oidc/discovery" />
      </div>

      <h2>Un seul point de départ : l'issuer</h2>
      <p>
        Tout part de l'identifiant de l'OP. Le RP y concatène{' '}
        <code>/.well-known/openid-configuration</code> et récupère un JSON qui liste endpoints et
        capacités.
      </p>

      <CodeBlock
        lang="http"
        title="Requête de découverte"
        code={`GET /.well-known/openid-configuration HTTP/1.1
Host: op.example`}
      />
      <CodeBlock
        lang="json"
        title="Réponse (extrait) — le document de configuration"
        code={`{
  "issuer": "https://op.example",
  "authorization_endpoint": "https://op.example/authorize",
  "token_endpoint": "https://op.example/token",
  "userinfo_endpoint": "https://op.example/userinfo",
  "jwks_uri": "https://op.example/.well-known/jwks.json",
  "response_types_supported": ["code"],
  "subject_types_supported": ["public"],
  "id_token_signing_alg_values_supported": ["ES256", "RS256"]
}`}
      />

      <Callout kind="spec" specRef="OIDC Discovery 1.0 §3" title="Dans la spec — champs et statuts">
        <p>
          REQUIRED : <code>issuer</code>, <code>authorization_endpoint</code>, <code>jwks_uri</code>
          , <code>response_types_supported</code>, <code>subject_types_supported</code>,{' '}
          <code>id_token_signing_alg_values_supported</code> ; <code>token_endpoint</code> REQUIRED
          sauf en implicit pur. RECOMMENDED : <code>userinfo_endpoint</code>,{' '}
          <code>scopes_supported</code>, <code>claims_supported</code>,{' '}
          <code>registration_endpoint</code>.
        </p>
      </Callout>

      <h2>L'ancre de confiance : valider l'issuer</h2>
      <p>
        Le contrôle qui rend tout le mécanisme sûr : l'<code>issuer</code> renvoyé dans le document{' '}
        <strong>doit</strong> être identique à celui utilisé pour construire l'URL de découverte. Et
        cette même valeur devra correspondre au claim <code>iss</code> des ID Tokens. Sans ce
        contrôle, un document de configuration détourné pointerait vers des endpoints pirates.
      </p>
      <Callout kind="spec" specRef="OIDC Discovery 1.0 §4.3" title="Dans la spec">
        <p>
          « The <code>issuer</code> value returned MUST be identical to the Issuer URL that was used
          as the prefix to <code>/.well-known/openid-configuration</code> […] and MUST also be
          identical to the <code>iss</code> Claim value in ID Tokens issued from this Issuer. »
        </p>
      </Callout>
      <p>
        Muni du <code>jwks_uri</code> découvert, le RP récupère et met en cache le{' '}
        <Term id="jwks" /> : il est prêt à lancer des flows et à valider les ID Tokens qui
        reviendront, en suivant automatiquement les rotations de clés.
      </p>

      <Quiz quizId="oidc/discovery/well-known" questions={quizBank['oidc/discovery/well-known']!} />
    </div>
  )
}
