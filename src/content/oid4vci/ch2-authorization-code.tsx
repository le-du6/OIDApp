import { quizBank } from '../../data/quiz-bank'
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
        Code Flow du module OAuth 2.0, PKCE compris — avec une brique de précision en plus.
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
        types de preuves acceptés. Même réflexe qu'dans le module OIDC : rien en dur, tout se
        découvre.
      </p>
      <Callout kind="note" title="Choisir son flow, en une phrase">
        <p>
          Un offer peut annoncer un code préautorisé ou amorcer un parcours authorization code. Le
          choix dépend de la relation établie avec l'Issuer et de sa politique. Les deux exemples
          convergent vers une émission avec preuve jwt ; cette preuve n'est pas universellement
          imposée à tout credential.
        </p>
      </Callout>

      <h2>Deux rôles, parfois un même service</h2>
      <p>
        Les scénarios utilisent un Credential Issuer qui joue aussi le rôle d’Authorization Server.
        En général, les métadonnées de l’Issuer donnent ses <code>authorization_servers</code> ; le
        wallet découvre ensuite les endpoints de l’AS choisi. L’access token autorise l’appel au
        credential endpoint, pas une authentification OIDC du wallet.
      </p>
      <p>
        <code>credential_configuration_id</code> vient du catalogue de l’Issuer. Les{' '}
        <code>credential_identifiers</code> de la token response désignent ensuite les credentials
        autorisés ; la requête d’émission utilise l’identifiant reçu, selon le mode retenu.
      </p>
      <Quiz
        quizId="oid4vci/authorization-code/wallet-initiated"
        questions={quizBank['oid4vci/authorization-code/wallet-initiated']!}
      />
    </div>
  )
}
