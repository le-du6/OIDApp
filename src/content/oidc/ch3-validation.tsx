import { Link } from '@tanstack/react-router'
import { Term } from '../../components/content/Term'
import { Callout } from '../../components/content/Callout'
import { Quiz } from '../../components/content/Quiz'
import { ScenarioLoader } from '../../components/sequence/AttackScenario'

/**
 * OIDC — Chapitre 3 : valider un ID Token (§3.1.3.7). L'étape qui transforme
 * un JWT reçu du réseau en identité de confiance. Renvoi au Crypto Lab.
 */
export default function OidcCh3() {
  return (
    <div className="lesson-prose">
      <p>
        Un <Term id="id-token" /> reçu du réseau ne vaut, a priori, <strong>rien</strong> :
        n'importe qui peut fabriquer un JWT. Ce qui lui donne de la valeur, c'est la séquence de
        contrôles que le <Term id="relying-party" /> exécute avant de faire confiance. La spec en
        liste treize ; déroulons l'essentiel dans l'ordre — signature d'abord, puis les claims.
      </p>

      <div className="not-prose my-6">
        <ScenarioLoader scenarioId="oidc/idtoken-validation" />
      </div>

      <h2>La signature ne suffit jamais</h2>
      <p>
        L'erreur la plus commune : « j'ai vérifié la signature, donc je fais confiance ». La{' '}
        <Term id="jws">signature</Term> prouve deux choses — le jeton vient bien de l'OP, et il n'a
        pas été modifié. Elle ne dit rien de <em>pour qui</em> il a été émis (<code>aud</code>), ni
        s'il est <em>frais</em> (<code>exp</code>, <code>nonce</code>). C'est pourquoi
        l'anti-pattern du chapitre 0 échoue dès le contrôle d'audience, signature valide ou non.
      </p>

      <Callout
        kind="spec"
        specRef="OIDC Core 1.0 §3.1.3.7"
        title="Dans la spec — les contrôles clés"
      >
        <p>
          Parmi les treize étapes : <code>iss</code> doit correspondre exactement à l'OP ;{' '}
          <code>aud</code> doit contenir le <code>client_id</code> ; la signature doit être vérifiée
          avec la clé du <Term id="jwks" /> désignée par le <Term id="kid" /> ; l'algorithme doit
          être celui attendu ; <code>exp</code> ne doit pas être dépassé ; si un <code>nonce</code>{' '}
          a été envoyé, il DOIT être présent et correspondre.
        </p>
      </Callout>

      <h2>at_hash : le contrôle qu'on oublie</h2>
      <p>
        Quand la réponse contient aussi un access token, l'ID Token porte un <Term id="at-hash" /> :
        la moitié gauche de <code>SHA-256(access_token)</code>, en base64url. Le RP recalcule et
        compare. Ce contrôle empêche d'associer cet ID Token à un access token d'une autre
        provenance — une brique de plus contre la substitution.
      </p>

      <Callout kind="note" title="À manipuler dans le Crypto Lab">
        <p>
          La vérification de signature et le calcul d'at_hash ne sont pas des abstractions : la
          section « Valider un ID Token » du{' '}
          <Link to="/labo-crypto" className="text-accent underline underline-offset-2">
            Crypto Lab
          </Link>{' '}
          récupère la clé du JWKS par son <code>kid</code>, vérifie la vraie fixture en ES256, et
          vous laisse <strong>altérer un claim</strong> pour voir la vérification échouer. Rien de
          plus convaincant que de casser la signature soi-même.
        </p>
      </Callout>

      <Quiz
        quizId="oidc/validation/jwks-kid-verify"
        questions={[
          {
            id: 'q1',
            question: 'La signature de l’ID Token est valide. Peut-on faire confiance ?',
            options: [
              {
                text: 'Oui, une signature valide suffit',
                explanation:
                  'Non — c’est l’erreur centrale du chapitre. La signature prouve l’origine, pas le destinataire ni la fraîcheur.',
              },
              {
                text: 'Non : il reste à vérifier iss, aud, exp, nonce, at_hash…',
                correct: true,
                explanation:
                  'Oui — la signature n’est qu’un des treize contrôles. aud (destinataire), exp (fraîcheur), nonce (anti-rejeu) sont indispensables.',
              },
              {
                text: 'Oui, si l’algorithme est ES256',
                explanation:
                  'Non — imposer l’algorithme est nécessaire mais ne remplace pas les contrôles de claims.',
              },
            ],
          },
          {
            id: 'q2',
            question: 'À quoi sert le kid lors de la validation ?',
            options: [
              {
                text: 'Il prouve à lui seul l’authenticité du jeton',
                explanation:
                  'Non — le kid vient du header, fourni par l’émetteur du jeton. Il n’apporte aucune confiance en soi.',
              },
              {
                text: 'Il indique quelle clé publique du JWKS utiliser pour vérifier',
                correct: true,
                explanation:
                  'Oui — il sélectionne LA bonne clé (utile pendant une rotation où le JWKS contient plusieurs clés).',
              },
              {
                text: 'Il chiffre l’ID Token',
                explanation: 'Non — le kid n’a aucun rôle de chiffrement.',
              },
            ],
          },
          {
            id: 'q3',
            question: 'Comment se calcule at_hash ?',
            options: [
              {
                text: 'SHA-256 complet de l’access token, en hexadécimal',
                explanation:
                  'Non — c’est la MOITIÉ GAUCHE du hash, encodée en base64url, pas le hash complet en hexa.',
              },
              {
                text: 'base64url de la moitié gauche de SHA-256(access_token)',
                correct: true,
                explanation:
                  'Oui — exactement la définition du Core §3.1.3.6 (SHA-256 car l’alg est ES256/RS256).',
              },
              {
                text: 'Une signature ES256 de l’access token',
                explanation: 'Non — at_hash est une empreinte (hash), pas une signature.',
              },
            ],
          },
        ]}
      />
    </div>
  )
}
