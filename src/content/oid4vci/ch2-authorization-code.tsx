import { Term } from '../../components/content/Term'
import { Callout } from '../../components/content/Callout'
import { Quiz } from '../../components/content/Quiz'
import { ScenarioLoader } from '../../components/sequence/AttackScenario'

/**
 * OID4VCI — Chapitre 2 : Authorization Code Flow côté émission.
 * Quand le wallet initie : metadata, authorization_details, PKCE.
 */
export default function VciCh2() {
  return (
    <div className="lesson-prose">
      <p>
        Second chemin d'émission : l'utilisateur part de son <Term id="wallet" /> — aucun offer
        pré-autorisé en poche. Le wallet doit alors tout faire : découvrir l'émetteur, demander
        l'autorisation, faire authentifier l'utilisateur. Bonne nouvelle : c'est l'Authorization
        Code Flow de la Phase 1, PKCE compris — avec une brique de précision en plus.
      </p>

      <div className="not-prose my-6">
        <ScenarioLoader scenarioId="oid4vci/authorization-code" />
      </div>

      <h2>authorization_details : demander un credential, pas un scope</h2>
      <p>
        Un <Term id="scope" /> dit « photos.read » — un périmètre d'API. Ici on ne demande pas un
        accès mais un <em>objet précis</em> : « l'attestation d'identité, configuration
        identity_credential ». C'est exactement le cas d'usage de <Term id="rar" /> (RFC 9396), vu
        au chapitre 7 d'OAuth2 : <code>authorization_details</code> de type{' '}
        <code>openid_credential</code> désigne la configuration demandée. La boucle est bouclée —
        l'« état de l'art 2026 » d'OAuth2 est l'infrastructure de base du monde wallet.
      </p>
      <Callout kind="spec" specRef="OID4VCI 1.0 §5.1.1" title="Dans la spec">
        <p>
          <code>authorization_details</code> avec <code>type: "openid_credential"</code> et{' '}
          <code>credential_configuration_id</code> — et si la token response renvoie des{' '}
          <code>credential_identifiers</code>, la Credential Request utilisera{' '}
          <code>credential_identifier</code> au lieu de <code>credential_configuration_id</code>{' '}
          (§8.2 : l'un OU l'autre, jamais les deux).
        </p>
      </Callout>

      <h2>Metadata : le well-known de l'émission</h2>
      <p>
        Avant tout, le wallet lit <code>/.well-known/openid-credential-issuer</code> — le pendant
        OID4VCI de la Discovery OIDC : endpoints (credential, nonce), et le catalogue{' '}
        <code>credential_configurations_supported</code> avec pour chacun son format (
        <code>dc+sd-jwt</code>, <code>mso_mdoc</code>), son <Term id="vct" /> ou doctype, et les
        types de preuves acceptés. Même réflexe qu'en Phase 2 : rien en dur, tout se découvre.
      </p>
      <Callout kind="note" title="Choisir son flow, en une phrase">
        <p>
          L'Issuer vous connaît déjà (portail, guichet) → <strong>pre-authorized code</strong>. Le
          wallet initie et l'Issuer doit vous authentifier pendant le flow →{' '}
          <strong>authorization code</strong>. Dans les deux cas la sortie est identique : nonce →
          preuve de clé → credential.
        </p>
      </Callout>

      <Quiz
        quizId="oid4vci/authorization-code/wallet-initiated"
        questions={[
          {
            id: 'q1',
            question: 'Pourquoi authorization_details plutôt qu’un scope ?',
            options: [
              {
                text: 'Parce que les scopes sont dépréciés par OAuth 2.1',
                explanation:
                  'Non — les scopes se portent très bien. Ils expriment un périmètre d’accès ; ici on désigne un OBJET précis.',
              },
              {
                text: 'Pour désigner précisément le credential demandé (type openid_credential), ce qu’un scope exprime mal',
                correct: true,
                explanation:
                  'Oui — RAR (RFC 9396) structure la demande : configuration, format. Le consentement devient précis et auditable.',
              },
              {
                text: 'Parce que le wallet n’a pas le droit d’utiliser des scopes',
                explanation:
                  'Non — OID4VCI permet d’ailleurs aussi une variante par scope ; authorization_details est simplement l’outil le plus précis.',
              },
            ],
          },
          {
            id: 'q2',
            question: 'Où le wallet apprend-il le format et le vct des credentials offerts ?',
            options: [
              {
                text: 'Dans /.well-known/openid-credential-issuer (credential_configurations_supported)',
                correct: true,
                explanation:
                  'Oui — le metadata dédié d’OID4VCI, pendant du well-known OIDC de la Phase 2.',
              },
              {
                text: 'Dans le header du jwt proof',
                explanation:
                  'Non — le proof prouve la clé du wallet ; il ne décrit pas le catalogue de l’émetteur.',
              },
              {
                text: 'Dans l’access token',
                explanation: 'Non — l’access token autorise ; il ne documente pas les formats.',
              },
            ],
          },
          {
            id: 'q3',
            question: 'PKCE est-il nécessaire dans ce flow ?',
            options: [
              {
                text: 'Non, le wallet est un client de confiance',
                explanation:
                  'Non — le wallet est une app mobile : un client PUBLIC par définition, incapable de garder un client_secret.',
              },
              {
                text: 'Oui : le wallet est un client public, PKCE est indispensable (et obligatoire à la OAuth 2.1)',
                correct: true,
                explanation:
                  'Oui — tout le chapitre « interception du code → PKCE » de la Phase 1 s’applique littéralement au wallet.',
              },
              {
                text: 'Seulement si l’Issuer l’exige dans son metadata',
                explanation:
                  'Non — en pratique et par le Security BCP, un client public sans PKCE est une faute, exigence affichée ou non.',
              },
            ],
          },
        ]}
      />
    </div>
  )
}
