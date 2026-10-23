import { quizBank } from '../../data/quiz-bank'
import { Term } from '../../components/content/Term'
import { Callout } from '../../components/content/Callout'
import { Quiz } from '../../components/content/Quiz'
import { ScenarioLoader } from '../../components/sequence/AttackScenario'

/**
 * OID4VP — Chapitre 1 : identifier le Verifier. Client Identifier Prefixes,
 * x509_san_dns vs x509_hash, et la gouvernance derrière la crypto.
 */
export default function VpCh1() {
  return (
    <div className="lesson-prose">
      <p>
        Renversement de perspective : depuis le module OAuth 2.0, c'est le serveur qui vérifie
        l'utilisateur. Dans notre parcours x509_san_dns, avant le consentement, le{' '}
        <strong>wallet vérifie le Verifier</strong>. L'enjeu n'est pas académique : le scénario
        d'abus numéro un du modèle wallet est le Verifier frauduleux — ou simplement trop curieux —
        qui collecte des attestations d'identité. Déroulez le pipeline d'identification :
      </p>

      <div className="not-prose my-6">
        <ScenarioLoader scenarioId="oid4vp/verifier-identification" />
      </div>

      <h2>Le préfixe : l'identité annonce sa preuve</h2>
      <p>
        La 1.0 a intégré le mode d'identification <em>dans</em> le <code>client_id</code>, sous
        forme de <Term id="client-identifier-prefix" /> : <code>x509_san_dns:verifier.example</code>{' '}
        signifie « je prouverai mon identité par un certificat X.509 dont le SAN DNS vaut
        verifier.example ». Le wallet sait immédiatement quoi vérifier et comment.
      </p>
      <Callout kind="spec" specRef="OID4VP 1.0 §5.9.3" title="Dans la spec — les préfixes">
        <p>
          Les préfixes x509_san_dns, x509_hash, verifier_attestation, openid_federation et
          decentralized_identifier précisent la méthode d'identification. redirect_uri ne fournit
          pas de preuve signée d'identité du Verifier. origin est réservé à l'audience de
          présentation DC API : le wallet doit refuser ce préfixe dans une requête. Un client_id
          sans préfixe reconnu nécessite une relation de confiance appropriée, par exemple un
          enregistrement préalable.
        </p>
      </Callout>
      <Callout kind="note" title="Attention aux articles d'avant 2025">
        <p>
          Les drafts utilisaient un paramètre séparé <code>client_id_scheme</code> — fusionné depuis
          dans le préfixe du <code>client_id</code>. Un exemple de plus de l'intérêt d'afficher la
          version de référence (en tête de module) : sur ces specs jeunes, la moitié des tutoriels
          en ligne décrivent un état antérieur.
        </p>
      </Callout>

      <h2>La crypto ne suffit pas : la gouvernance</h2>
      <p>
        Un certificat valide prouve un <em>nom</em> — pas une <em>légitimité</em>. Qui a le droit de
        demander quoi ? C'est une décision d'écosystème : le profil d’écosystème doit définir les
        enregistrements, les droits de demande et les réponses aux requêtes excessives. La crypto
        authentifie ; la gouvernance autorise. Les deux couches sont nécessaires, et il faut savoir
        laquelle fait quoi.
      </p>

      <Quiz
        quizId="oid4vp/verifier-id/client-id-prefixes"
        questions={quizBank['oid4vp/verifier-id/client-id-prefixes']!}
      />
    </div>
  )
}
