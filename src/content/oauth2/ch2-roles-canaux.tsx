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
        Vous connaissez les quatre rôles (chapitre 0). Voici maintenant la question qui organise
        tout OAuth2 : <strong>par où passe chaque message ?</strong> Il n'existe que deux réponses
        possibles, et elles n'ont pas du tout les mêmes propriétés de sécurité.
      </p>
      <p>
        Le <Term id="front-channel" /> : tout ce qui transite <em>par le navigateur</em> —
        redirections, paramètres d'URL, fragments. Le <Term id="back-channel" /> : tout ce qui va
        <em> directement de serveur à serveur</em> — le <Term id="client" /> qui appelle le{' '}
        <Term id="token-endpoint" /> de l'AS, ou l'API. Jouez le diagramme : le même flow bascule
        d'un canal à l'autre, et les annotations disent ce que chaque canal autorise.
      </p>

      <div className="not-prose my-6">
        <ScenarioLoader scenarioId="oauth2/canaux" />
      </div>

      <h2>Front channel : observable et manipulable — par construction</h2>
      <p>
        Une URL de redirection traverse la barre d'adresse, l'historique, les journaux de proxys
        d'entreprise, les en-têtes <code>Referer</code>, les extensions du navigateur. Et son
        expéditeur apparent — le navigateur — obéit à l'utilisateur, pas au Client : n'importe qui
        peut copier l'URL, en modifier les paramètres, la rejouer plus tard. Conséquence normative :
        on n'y fait circuler que des données <em>publiques</em> (
        <Term id="client-id" />) ou <em>inutilisables seules</em> (un{' '}
        <Term id="authorization-code" /> éphémère, un <Term id="code-challenge" /> qui n'est qu'une
        empreinte, un <Term id="state" /> qui n'a de sens que pour une session).
      </p>
      <p>
        Mais ce canal a une vertu irremplaçable : <strong>l'utilisateur le voit</strong>. C'est là
        qu'il vérifie le domaine de l'AS, lit l'écran de consentement, tape son mot de passe — sur
        le site de l'AS et nulle part ailleurs. Le front channel est le canal de l'humain.
      </p>

      <h2>Back channel : le canal des secrets</h2>
      <p>
        Quand le Client (un serveur) appelle le <Term id="token-endpoint" />, le navigateur n'est
        plus dans la boucle : TLS direct entre deux machines, authentification du Client (
        <Term id="client-secret" />, mTLS…), aucune trace côté poste utilisateur. C'est le seul
        endroit où un <Term id="access-token" />, un <Term id="refresh-token" /> ou un{' '}
        <Term id="code-verifier" /> ont le droit de circuler.
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
          Cette grille explique aussi la distinction <Term id="confidential-public-client" /> : un
          backend peut garder un <Term id="client-secret" /> (il vit côté back channel) ; une SPA ou
          une app mobile ne le peut pas — tout leur code est distribué à l'utilisateur. D'où des
          exigences différentes, et PKCE pour les clients publics.
        </p>
      </Callout>

      <Quiz
        quizId="oauth2/roles-canaux/front-back-channel"
        questions={[
          {
            id: 'q1',
            question: 'Lequel de ces échanges est du back channel ?',
            options: [
              {
                text: 'La redirection 302 du Client vers /authorize',
                explanation:
                  'Non — une redirection passe PAR le navigateur : front channel par définition.',
              },
              {
                text: 'Le POST du Client vers le token endpoint',
                correct: true,
                explanation:
                  'Oui : serveur → serveur, TLS, authentifié, invisible du navigateur (RFC 6749 §3.2).',
              },
              {
                text: 'Le retour du code sur la redirect_uri',
                explanation:
                  'Non — le code arrive au Client porté par le navigateur : c’est le front channel (et c’est pour ça que le code doit être éphémère).',
              },
            ],
          },
          {
            id: 'q2',
            question: 'Pourquoi le mot de passe se saisit-il côté front channel, chez l’AS ?',
            options: [
              {
                text: 'Parce que le front channel est chiffré de bout en bout',
                explanation:
                  'Non — TLS chiffre le transport partout. La raison est ailleurs : l’utilisateur doit VOIR à qui il parle.',
              },
              {
                text: 'Parce que l’utilisateur peut y vérifier le domaine et consentir en connaissance de cause',
                correct: true,
                explanation:
                  'Oui : l’observabilité du front channel est une protection pour l’humain — barre d’adresse, écran de consentement. Le secret ne quitte jamais le domaine de l’AS.',
              },
              {
                text: 'Parce que le back channel est trop lent',
                explanation: 'Non — la performance n’a rien à voir avec ce choix de conception.',
              },
            ],
          },
          {
            id: 'q3',
            question: 'Quelle donnée a le DROIT de traverser le front channel ?',
            options: [
              {
                text: 'Un refresh token',
                explanation:
                  'Jamais : longue durée + bearer = la pire chose à exposer. Il ne circule qu’au token endpoint.',
              },
              {
                text: 'Un client_secret',
                explanation:
                  'Jamais : un secret exposé au navigateur n’est plus un secret. C’est même la définition d’un client public.',
              },
              {
                text: 'Un authorization code (éphémère, à usage unique)',
                correct: true,
                explanation:
                  'Oui — c’est exactement son rôle : être la seule chose qui transite, en étant inutilisable seule et périssable (RFC 6749 §4.1.2).',
              },
            ],
          },
          {
            id: 'q4',
            question: 'Une SPA peut-elle détenir un client_secret ?',
            options: [
              {
                text: 'Oui, si elle le stocke dans une variable d’environnement au build',
                explanation:
                  'Non — le bundle est livré au navigateur : tout ce qu’il contient est public. Un secret compilé dans une SPA est un secret publié.',
              },
              {
                text: 'Non : tout son code vit côté front channel — c’est un client public',
                correct: true,
                explanation:
                  'Exactement (RFC 6749 §2.1). D’où Authorization Code + PKCE pour les SPA, sans client_secret.',
              },
              {
                text: 'Oui, c’est obligatoire pour tous les clients',
                explanation:
                  'Non — les clients publics s’enregistrent sans secret ; PKCE compense l’absence d’authentification du Client.',
              },
            ],
          },
        ]}
      />
    </div>
  )
}
