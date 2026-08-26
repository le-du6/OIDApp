import { Term } from '../../components/content/Term'
import { Callout } from '../../components/content/Callout'
import { Quiz } from '../../components/content/Quiz'
import { ScenarioLoader } from '../../components/sequence/AttackScenario'

/**
 * OIDC — Chapitre 2 : le flow complet (Authorization Code + openid).
 * Réutilise tout OAuth2, ajoute scope=openid, nonce, id_token, UserInfo.
 */
export default function OidcCh2() {
  return (
    <div className="lesson-prose">
      <p>
        Bonne nouvelle : vous connaissez déjà 90 % de ce flow. C'est l'Authorization Code Flow du
        module OAuth2, à trois ajouts près — <code>scope=openid</code> dans la requête, un{' '}
        <Term id="nonce" />, et un <Term id="id-token" /> dans la réponse du token endpoint.
        Jouez-le en entier, puis on commente les trois différences.
      </p>

      <div className="not-prose my-6">
        <ScenarioLoader scenarioId="oidc/authorization-code" />
      </div>

      <h2>Les trois seules différences avec OAuth2</h2>
      <p>
        <strong>
          1. <code>scope=openid</code>
        </strong>{' '}
        — c'est LUI qui transforme une banale authorization request OAuth2 en requête OIDC. Sans{' '}
        <code>openid</code> dans le scope, l'OP n'émet pas d'ID Token : vous faites de l'OAuth2, pas
        de l'authentification.
      </p>
      <p>
        <strong>
          2. <code>nonce</code>
        </strong>{' '}
        — une valeur imprévisible que le RP lie à sa session, recopiée par l'OP dans l'ID Token. Le
        RP vérifiera la correspondance. On y consacre un chapitre entier (nonce vs state), car c'est
        une protection propre à OIDC.
      </p>
      <p>
        <strong>
          3. <code>id_token</code>
        </strong>{' '}
        — la réponse du <Term id="token-endpoint" /> contient désormais, à côté de l'access token,
        le jeton d'identité. C'est le livrable d'OIDC.
      </p>

      <Callout
        kind="spec"
        specRef="OIDC Core 1.0 §3.1.2.1"
        title="Dans la spec — statut des paramètres"
      >
        <p>
          Dans l'authentication request du code flow : <code>scope</code> (REQUIRED, doit contenir{' '}
          <code>openid</code>), <code>response_type=code</code> (REQUIRED), <code>client_id</code>{' '}
          (REQUIRED), <code>redirect_uri</code> (REQUIRED), <code>state</code> (RECOMMENDED),{' '}
          <code>nonce</code> (OPTIONAL en code flow — mais REQUIRED en implicit).
        </p>
      </Callout>

      <h2>UserInfo : des claims, à la demande</h2>
      <p>
        L'ID Token porte l'identité, mais on peut vouloir des claims frais ou volumineux sans
        regonfler le jeton. C'est le rôle de l'endpoint <Term id="userinfo" /> : une ressource
        OAuth2 classique, appelée avec l'<strong>access token</strong> (pas l'ID Token), qui renvoie
        un JSON de claims. Piège classique : sa réponse contient un <code>sub</code>, que le RP{' '}
        <strong>doit</strong> comparer à celui de l'ID Token.
      </p>
      <Callout kind="spec" specRef="OIDC Core 1.0 §5.3.4" title="Dans la spec — vérifier le sub">
        <p>
          Le RP doit « verify that the <code>sub</code> Claim […] returned in the UserInfo Response
          is identical to the <code>sub</code> Claim […] in the ID Token; if they do not match, the
          UserInfo Response values MUST be rejected ». Sans ce contrôle, un access token substitué
          ferait passer les claims d'un autre utilisateur.
        </p>
      </Callout>

      <Quiz
        quizId="oidc/flow-complet/flow-pas-a-pas"
        questions={[
          {
            id: 'q1',
            question: 'Qu’est-ce qui déclenche l’émission d’un ID Token ?',
            options: [
              {
                text: 'response_type=code',
                explanation:
                  'Non — c’est le type de flow (code vs autres). On peut faire de l’OAuth2 pur en code flow, sans ID Token.',
              },
              {
                text: 'La présence du scope openid dans la requête',
                correct: true,
                explanation:
                  'Oui — openid est le déclencheur d’OIDC. Sans lui, pas d’ID Token, même en code flow.',
              },
              {
                text: 'L’appel à UserInfo',
                explanation:
                  'Non — UserInfo renvoie des claims via l’access token ; il n’émet pas d’ID Token.',
              },
            ],
          },
          {
            id: 'q2',
            question: 'Avec quel jeton appelle-t-on l’endpoint UserInfo ?',
            options: [
              {
                text: 'L’ID Token',
                explanation:
                  'Non — l’ID Token n’est pas un laissez-passer d’API ; son audience est le RP. UserInfo est une ressource OAuth2.',
              },
              {
                text: 'L’access token (en Bearer)',
                correct: true,
                explanation:
                  'Oui — UserInfo est une ressource protégée OAuth2 classique, appelée avec l’access token.',
              },
              {
                text: 'Le code d’autorisation',
                explanation: 'Non — le code est à usage unique et déjà consommé au token endpoint.',
              },
            ],
          },
          {
            id: 'q3',
            question: 'Que doit vérifier le RP sur la réponse UserInfo ?',
            options: [
              {
                text: 'Que le sub renvoyé est identique à celui de l’ID Token',
                correct: true,
                explanation:
                  'Oui — sinon (Core §5.3.4) la réponse DOIT être rejetée : un access token substitué apporterait les claims de quelqu’un d’autre.',
              },
              {
                text: 'Que la réponse est signée en ES256',
                explanation:
                  'Non — la réponse UserInfo est un JSON par défaut (elle PEUT être signée/chiffrée, mais ce n’est pas le contrôle central ici).',
              },
              {
                text: 'Que l’access token contient un nonce',
                explanation: 'Non — le nonce est un claim de l’ID Token, pas de l’access token.',
              },
            ],
          },
        ]}
      />
    </div>
  )
}
