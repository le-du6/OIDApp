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

      <Quiz
        quizId="oidc/discovery/well-known"
        questions={[
          {
            id: 'q1',
            question: 'À quelle URL se trouve le document de configuration d’un OP ?',
            options: [
              {
                text: 'issuer + /.well-known/openid-configuration',
                correct: true,
                explanation:
                  'Oui — chemin standard dérivé de l’issuer (Discovery §4). Aucune URL à deviner ni à coder en dur.',
              },
              {
                text: 'issuer + /discovery/keys',
                explanation:
                  'Non — ce n’est pas le chemin normalisé. Le jwks_uri, lui, est découvert DANS le document.',
              },
              {
                text: 'Une URL propriétaire, différente pour chaque OP',
                explanation:
                  'Non — c’est justement ce que la Discovery évite : le chemin est standard.',
              },
            ],
          },
          {
            id: 'q2',
            question: 'Pourquoi vérifier que config.issuer == issuer attendu ?',
            options: [
              {
                text: 'Pour améliorer les performances du cache',
                explanation: 'Non — ce contrôle est de sécurité, pas de performance.',
              },
              {
                text: 'Pour empêcher qu’un document détourné pointe vers des endpoints pirates',
                correct: true,
                explanation:
                  'Oui — l’issuer est l’ancre de confiance ; il doit aussi correspondre au claim iss des ID Tokens (Discovery §4.3).',
              },
              {
                text: 'Parce que la spec l’interdit sinon le JSON est invalide',
                explanation:
                  'Non — le JSON serait syntaxiquement valide ; c’est une exigence de sécurité, pas de format.',
              },
            ],
          },
          {
            id: 'q3',
            question: 'D’où le RP tient-il l’URL du JWKS ?',
            options: [
              {
                text: 'Du champ jwks_uri du document de Discovery',
                correct: true,
                explanation:
                  'Oui — comme les autres endpoints, jwks_uri est découvert, pas codé en dur. La rotation des clés devient transparente.',
              },
              {
                text: 'Du header de l’ID Token',
                explanation:
                  'Non — le header porte le kid (quelle clé), pas l’URL du JWKS (où les trouver).',
              },
              {
                text: 'De l’access token',
                explanation: 'Non — l’access token ne contient pas la configuration de l’OP.',
              },
            ],
          },
        ]}
      />
    </div>
  )
}
