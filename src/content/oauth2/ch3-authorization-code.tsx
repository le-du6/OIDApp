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
        Voici le cœur du protocole : le flow que vous verrez dans 95 % des intégrations réelles.
        Jouez-le en entier avant de lire la suite — chaque flèche s'inspecte (requête HTTP complète,
        paramètres annotés), et l'access token de l'étape 8 se décode.
      </p>

      <div className="not-prose my-6">
        <ScenarioLoader scenarioId="oauth2/authorization-code" />
      </div>

      <h2>La question centrale : pourquoi un code intermédiaire ?</h2>
      <p>
        Regardez la trajectoire : la demande d'autorisation part en <Term id="front-channel" /> (il
        faut bien passer par l'utilisateur — c'est lui qui consent), mais le{' '}
        <Term id="access-token" /> n'y met jamais les pieds. Entre les deux, l'
        <Term id="authorization-code" /> fait le pont : il traverse le navigateur — zone exposée —
        puis s'échange contre les tokens en <Term id="back-channel" /> — zone protégée, avec
        authentification du Client.
      </p>
      <p>
        Le code est conçu pour sa traversée : <strong>opaque</strong> (il ne contient rien),{' '}
        <strong>éphémère</strong> (quelques secondes à quelques minutes),{' '}
        <strong>à usage unique</strong> (l'AS doit rejeter — et peut révoquer les tokens déjà émis —
        si un code est présenté deux fois), et <strong>lié</strong> au <Term id="client-id" /> et à
        la <Term id="redirect-uri" /> de la demande. Volé, il ne vaut presque rien. « Presque » : le
        chapitre 5 montrera le résidu de risque, et <Term id="pkce" /> qui le supprime.
      </p>

      <Callout kind="spec" specRef="RFC 6749 §4.1.3 · §10.5" title="Dans la spec">
        <p>
          Le Client DOIT présenter au token endpoint le même <code>redirect_uri</code> que dans
          l'authorization request, et l'AS DOIT vérifier cette égalité. Un code est à usage unique ;
          en cas de réutilisation, l'AS DEVRAIT révoquer tous les tokens déjà émis sur ce code. Ces
          deux phrases arrêtent des attaques entières.
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
        <Term id="client-secret" /> en Basic) contre la réponse JSON : <code>access_token</code>,{' '}
        <code>token_type</code>, <code>expires_in</code>, et souvent un <Term id="refresh-token" />.
      </p>

      <Callout kind="security" title="Ce que ce flow garantit — et ce qu'il ne garantit pas">
        <p>
          Garanti : le mot de passe ne quitte jamais l'AS ; le token ne traverse jamais le
          navigateur ; le pouvoir délégué est limité (scope), daté (expiration) et révocable. Non
          garanti, en version « nue » : que la réponse au callback corresponde bien à la requête de
          CE navigateur (pas de <Term id="state" />
          ), ni que l'échangeur du code soit bien son demandeur (pas de <Term id="pkce" />
          ). Ces trous sont le programme du chapitre 5.
        </p>
      </Callout>

      <Quiz
        quizId="oauth2/authorization-code/flow-pas-a-pas"
        questions={[
          {
            id: 'q1',
            question: 'Pourquoi l’AS remet-il un code plutôt que directement l’access token ?',
            options: [
              {
                text: 'Pour que le token ne transite jamais par le front channel',
                correct: true,
                explanation:
                  'Oui : le retour vers le Client passe forcément par le navigateur (zone exposée). On n’y fait passer qu’un jeton intermédiaire périssable, et l’échange réel se fait en back channel authentifié.',
              },
              {
                text: 'Pour réduire la taille des URL',
                explanation:
                  'Non — un JWT serait effectivement long, mais c’est un effet secondaire, pas la raison de conception.',
              },
              {
                text: 'Parce que le token n’est pas encore généré à ce moment-là',
                explanation:
                  'Non — l’AS pourrait très bien le générer immédiatement (implicit le faisait). C’est un choix de sécurité, pas une contrainte technique.',
              },
            ],
          },
          {
            id: 'q2',
            question: 'Que vérifie l’AS quand le Client présente le code au token endpoint ?',
            options: [
              {
                text: 'Uniquement que le code existe',
                explanation:
                  'Insuffisant — l’AS vérifie aussi l’authentification du Client, la correspondance du redirect_uri, l’expiration et l’usage unique.',
              },
              {
                text: 'Code valide et jamais utilisé, Client authentifié, redirect_uri identique à la demande',
                correct: true,
                explanation:
                  'Oui (RFC 6749 §4.1.3) : quatre vérifications, chacune ferme une attaque distincte.',
              },
              {
                text: 'Que l’utilisateur est toujours connecté sur l’AS',
                explanation:
                  'Non — l’échange du code est indépendant de la session navigateur de l’utilisateur : il peut avoir fermé l’onglet.',
              },
            ],
          },
          {
            id: 'q3',
            question: 'Le refresh token sert à…',
            options: [
              {
                text: 'Prolonger la session du navigateur chez l’AS',
                explanation:
                  'Non — il ne concerne pas le navigateur : c’est un artefact Client ↔ AS, en back channel exclusivement.',
              },
              {
                text: 'Obtenir de nouveaux access tokens sans re-solliciter l’utilisateur',
                correct: true,
                explanation:
                  'Oui (RFC 6749 §1.5) : l’access token expire vite, le refresh token permet d’en obtenir d’autres au token endpoint — jamais présenté au RS.',
              },
              {
                text: 'Accéder à l’API quand l’access token est expiré',
                explanation:
                  'Piège : on ne présente JAMAIS un refresh token au Resource Server. Il s’échange à l’AS contre un nouvel access token, qui lui ira à l’API.',
              },
            ],
          },
          {
            id: 'q4',
            question: 'Un authorization code intercepté dans l’historique du navigateur est…',
            options: [
              {
                text: 'Aussi grave qu’un access token volé',
                explanation:
                  'Non — seul, il ne donne accès à rien : il faut encore l’échanger au token endpoint, où le Client s’authentifie. (Mais pas « rien du tout » : voir chapitre 5 pour les clients publics.)',
              },
              {
                text: 'Sans aucune valeur pour un attaquant, dans tous les cas',
                explanation:
                  'Trop optimiste : pour un client PUBLIC sans PKCE, un code intercepté peut s’échanger. C’est exactement l’attaque du chapitre 5.',
              },
              {
                text: 'Peu exploitable seul : éphémère, à usage unique, et l’échange exige l’authentification du Client',
                correct: true,
                explanation:
                  'Oui — c’est la bonne mesure du risque : fortement mitigé pour un client confidentiel, résiduel pour un client public… d’où PKCE (RFC 7636).',
              },
            ],
          },
        ]}
      />
    </div>
  )
}
