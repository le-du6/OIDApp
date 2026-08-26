import { Term } from '../../components/content/Term'
import { Callout } from '../../components/content/Callout'
import { Quiz } from '../../components/content/Quiz'
import { CompareTable } from '../../components/content/CompareTable'

/**
 * OIDC — Chapitre 5 : nonce vs state, at_hash/c_hash. Trois liaisons contre
 * le rejeu, chacune protégeant un artefact différent.
 */
export default function OidcCh5() {
  return (
    <div className="lesson-prose">
      <p>
        <Term id="state" />, <Term id="nonce" />, <Term id="at-hash" /> : trois mécanismes qu'on
        confond volontiers parce qu'ils partagent une idée — <strong>lier deux choses</strong> pour
        empêcher qu'un élément étranger se glisse dans le flow. Mais chacun protège un{' '}
        <em>artefact différent</em>. Les ranger clairement, une fois pour toutes.
      </p>

      <CompareTable
        caption="Trois liaisons, trois cibles"
        columns={['Mécanisme', 'Ce qu’il lie', 'Attaque évitée']}
        rows={[
          {
            label: 'state',
            cells: [
              { content: 'La réponse du callback ↔ la session qui a démarré le flow' },
              { content: 'Le CODE d’autorisation', verdict: 'good' },
              { content: 'CSRF sur le callback' },
            ],
          },
          {
            label: 'nonce',
            cells: [
              { content: 'L’ID Token ↔ la requête d’authentification du RP' },
              { content: 'L’ID TOKEN', verdict: 'good' },
              { content: 'Rejeu / injection d’un ID Token' },
            ],
          },
          {
            label: 'at_hash',
            cells: [
              { content: 'L’ID Token ↔ l’access token de la même réponse' },
              { content: 'L’ACCESS TOKEN apparié', verdict: 'good' },
              { content: 'Appariement d’un access token étranger' },
            ],
          },
        ]}
      />

      <h2>state et nonce : le même besoin, deux emplacements</h2>
      <p>
        Les deux naissent du même besoin d'imprévisibilité (un{' '}
        <Term id="code-verifier">CSPRNG</Term>, comme pour PKCE). La différence est{' '}
        <em>ce qu'ils protègent</em>. Le <Term id="state" /> vit côté OAuth2 : il protège le{' '}
        <strong>callback</strong>, donc le code. Le <Term id="nonce" /> est propre à OIDC : il est
        recopié dans l'<strong>ID Token</strong>, qu'il protège contre le rejeu. Un flow OIDC
        sérieux utilise les deux.
      </p>

      <Callout kind="attack" title="Injection d’ID Token, contrée par le nonce">
        <p>
          Sans nonce, un attaquant pourrait tenter d'injecter dans la session de la victime un ID
          Token légitime mais obtenu ailleurs (rejeu). Avec nonce : le RP a mémorisé une valeur
          unique liée à SA requête ; un ID Token qui ne la porte pas — ou en porte une autre — est
          rejeté à l'étape 11 de la validation (§3.1.3.7). L'ID Token injecté ne correspond à aucune
          requête en cours.
        </p>
      </Callout>

      <h2>at_hash et c_hash : lier les artefacts entre eux</h2>
      <p>
        Quand plusieurs artefacts voyagent ensemble, on les lie par empreinte. <Term id="at-hash" />{' '}
        lie l'ID Token à l'<strong>access token</strong> (moitié gauche de SHA-256, base64url).{' '}
        <strong>c_hash</strong> fait de même avec le <strong>code</strong> d'autorisation — utile
        dans le flow hybride, où un ID Token est émis directement à l'authorization endpoint{' '}
        <em>en même temps</em> qu'un code.
      </p>
      <Callout kind="spec" specRef="OIDC Core 1.0 §3.1.3.6 · §3.3.2.11" title="Dans la spec">
        <p>
          <code>at_hash</code> (§3.1.3.6) et <code>c_hash</code> (§3.3.2.11) suivent la même recette
          : « base64url encoding of the left-most half of the hash of the octets of the ASCII
          representation » de la valeur (access token, ou code). L'algorithme de hachage découle de{' '}
          <code>alg</code> : SHA-256 pour ES256/RS256.
        </p>
      </Callout>
      <Callout kind="note" title="Où c_hash est-il obligatoire ?">
        <p>
          <code>c_hash</code> est REQUIRED quand un ID Token est délivré depuis l'authorization
          endpoint <em>avec</em> un code (flow hybride : <code>response_type=code id_token</code> ou{' '}
          <code>code id_token token</code>) ; OPTIONAL sinon. <code>at_hash</code> est OPTIONAL en
          code flow, mais REQUIRED en implicit avec <code>response_type=id_token token</code>.
        </p>
      </Callout>

      <Quiz
        quizId="oidc/nonce-at-hash/liaisons"
        questions={[
          {
            id: 'q1',
            question: 'Quelle est la différence entre state et nonce ?',
            options: [
              {
                text: 'Aucune, ce sont deux noms pour la même valeur',
                explanation:
                  'Non — même besoin (imprévisibilité), mais cibles différentes : state protège le callback, nonce protège l’ID Token.',
              },
              {
                text: 'state lie la réponse du callback à la session ; nonce lie l’ID Token à la requête',
                correct: true,
                explanation:
                  'Oui — state est côté OAuth2 (le code), nonce est propre à OIDC (l’ID Token). Un flow sérieux utilise les deux.',
              },
              {
                text: 'state est chiffré, nonce est signé',
                explanation:
                  'Non — ni l’un ni l’autre : ce sont des valeurs imprévisibles comparées, pas des jetons cryptographiques.',
              },
            ],
          },
          {
            id: 'q2',
            question: 'À quelle étape un ID Token injecté (rejoué) est-il rejeté ?',
            options: [
              {
                text: 'À la vérification du nonce (§3.1.3.7)',
                correct: true,
                explanation:
                  'Oui — le RP a mémorisé un nonce unique lié à sa requête ; un ID Token qui ne le porte pas est rejeté.',
              },
              {
                text: 'À la vérification de la signature',
                explanation:
                  'Non — l’ID Token rejoué peut être parfaitement signé par l’OP. C’est le nonce qui détecte le rejeu.',
              },
              {
                text: 'Il n’est jamais détecté',
                explanation: 'Non — c’est précisément le rôle du nonce de le détecter.',
              },
            ],
          },
          {
            id: 'q3',
            question: 'Que lie c_hash ?',
            options: [
              {
                text: 'L’ID Token à l’access token',
                explanation: 'Non — ça, c’est at_hash. c_hash lie l’ID Token au CODE.',
              },
              {
                text: 'L’ID Token au code d’autorisation (flow hybride)',
                correct: true,
                explanation:
                  'Oui — même recette qu’at_hash, appliquée au code ; REQUIRED quand un ID Token est émis à l’authorization endpoint avec un code.',
              },
              {
                text: 'Le code au nonce',
                explanation: 'Non — c_hash porte sur le code et l’ID Token, pas sur le nonce.',
              },
            ],
          },
        ]}
      />
    </div>
  )
}
