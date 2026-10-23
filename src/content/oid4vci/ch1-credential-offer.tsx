import { quizBank } from '../../data/quiz-bank'
import { Term } from '../../components/content/Term'
import { Callout } from '../../components/content/Callout'
import { Quiz } from '../../components/content/Quiz'
import { ScenarioLoader } from '../../components/sequence/AttackScenario'

/**
 * OID4VCI — Chapitre 1 : Credential Offer & pre-authorized code flow.
 * Le flow d'émission le plus courant, du QR au credential.
 */
export default function VciCh1() {
  return (
    <div className="lesson-prose">
      <p>
        Cas d'usage type : vous êtes connecté au portail de votre université, et vous voulez votre
        diplôme dans votre wallet. L'université vous a <em>déjà</em> identifié — refaire un flow
        d'authentification complet serait absurde. Le <Term id="pre-authorized-code" /> est fait
        pour ça : l'émetteur vous remet un <Term id="credential-offer" /> pré-autorisé, et le wallet
        n'a plus qu'à encaisser. Jouez le flow en entier :
      </p>

      <div className="not-prose my-6">
        <ScenarioLoader scenarioId="oid4vci/pre-authorized-code" />
      </div>

      <h2>Le Credential Offer : trois informations</h2>
      <p>
        L'offer (souvent un QR code) dit au wallet : <strong>qui</strong> émet (
        <code>credential_issuer</code>), <strong>quoi</strong> (
        <code>credential_configuration_ids</code>), <strong>comment</strong> (<code>grants</code>).
        Ici le grant est le pre-authorized code — un vrai grant OAuth2, avec son URN :{' '}
        <code>urn:ietf:params:oauth:grant-type:pre-authorized_code</code>. le module OAuth 2.0 n'a
        jamais été aussi utile : tout le vocabulaire (grant, token endpoint, back channel) resurgit
        tel quel.
      </p>

      <h2>Le maillon anti-interception : tx_code</h2>
      <p>
        Un QR code, ça se photographie. Sans défense, le pre-authorized code serait un bearer secret
        encaissable par n'importe qui l'ayant vu. Le <Term id="tx-code" /> ferme cette porte : un
        code court envoyé par un <strong>canal séparé</strong> (SMS, e-mail), exigé au token
        endpoint. L'attaquant qui n'a que le QR n'a que la moitié du puzzle.
      </p>
      <Callout kind="spec" specRef="OID4VCI 1.0 §4.1.1" title="Dans la spec">
        <p>
          Le <code>tx_code</code> décrit ses contraintes dans l'offer (<code>input_mode</code>{' '}
          numeric ou text, <code>length</code>, <code>description</code> ≤ 300 caractères) — et la
          spec RECOMMANDE explicitement sa transmission par un canal distinct de celui de l'offer.
          Deux canaux, une transaction : le motif « lier ce qui doit l'être » encore une fois.
        </p>
      </Callout>

      <h2>La fin du flow : nonce, preuve, credential</h2>
      <p>
        Une fois l'access token obtenu, il reste l'essentiel : le <Term id="c-nonce" /> (fourni par
        le Nonce Endpoint <em>dédié</em> de la 1.0 finale), le <Term id="jwt-proof" /> signé par la
        clé du wallet, et la Credential Request qui rapporte le <Term id="sd-jwt-vc" />. Ce
        triptyque mérite son propre chapitre — le 3 — car c'est lui qui fait du credential autre
        chose qu'un fichier copiable.
      </p>

      <h2>Format choisi et clé du détenteur</h2>
      <p>
        OID4VCI émet des credentials : le format illustré est SD-JWT VC, identifié par{' '}
        <code>dc+sd-jwt</code>. mdoc, identifié par <code>mso_mdoc</code>, est un autre format
        majeur. Le protocole d’émission ne se confond avec aucun de ces formats.
      </p>
      <p>
        Dans nos exemples, l’Issuer lie le credential à la clé publique du wallet. Cette liaison
        signée sera utilisée à la présentation ; la preuve jwt à l’émission et le KB-JWT ultérieur
        ont des audiences et des objectifs différents.
      </p>
      <Quiz
        quizId="oid4vci/credential-offer/pre-authorized"
        questions={quizBank['oid4vci/credential-offer/pre-authorized']!}
      />
    </div>
  )
}
