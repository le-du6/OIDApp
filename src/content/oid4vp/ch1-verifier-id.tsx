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
        Renversement de perspective : depuis la Phase 1, c'est le serveur qui vérifie l'utilisateur.
        Ici, avant tout consentement, c'est le <strong>wallet qui doit vérifier le Verifier</strong>
        . L'enjeu n'est pas académique : le scénario d'abus numéro un du modèle wallet est le
        Verifier frauduleux — ou simplement trop curieux — qui collecte des attestations d'identité.
        Déroulez le pipeline d'identification :
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
          <code>x509_san_dns</code> (SAN DNS du certificat), <code>x509_hash</code> (empreinte
          SHA-256 du certificat — quand l'identité ne passe pas par un nom DNS),{' '}
          <code>verifier_attestation</code> (JWT d'attestation), <code>openid_federation</code>,{' '}
          <code>decentralized_identifier</code>, <code>redirect_uri</code> (⚠ aucune preuve
          cryptographique), et <code>origin</code> — réservé à la DC API. Un <code>client_id</code>{' '}
          sans deux-points : client pré-enregistré classique.
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
        demander quoi ? C'est une décision d'écosystème : dans le cadre eIDAS 2.0, les relying
        parties s'enregistrent, leurs droits de demande sont cadrés, et le wallet peut opposer ce
        cadre à une requête excessive. La crypto authentifie ; la gouvernance autorise. Les deux
        couches sont nécessaires, et il faut savoir laquelle fait quoi.
      </p>

      <Quiz
        quizId="oid4vp/verifier-id/client-id-prefixes"
        questions={[
          {
            id: 'q1',
            question: 'Que signifie client_id = x509_san_dns:verifier.example ?',
            options: [
              {
                text: 'Le Verifier prouvera son identité par un certificat X.509 dont le SAN DNS vaut verifier.example',
                correct: true,
                explanation:
                  'Oui — le préfixe annonce le mode de preuve, l’identifiant annonce l’identité attendue. Le wallet vérifie la correspondance.',
              },
              {
                text: 'Le Verifier est hébergé sur verifier.example',
                explanation:
                  'Non — l’hébergement n’est pas la question : c’est l’identité PROUVÉE par certificat qui compte.',
              },
              {
                text: 'La requête doit être chiffrée pour verifier.example',
                explanation:
                  'Non — le préfixe concerne l’identification du Verifier, pas le chiffrement.',
              },
            ],
          },
          {
            id: 'q2',
            question: 'Que vérifie le wallet, dans l’ordre ?',
            options: [
              {
                text: 'Seulement la signature du Request Object',
                explanation:
                  'Non — une signature ne vaut que par la clé qui la porte : il faut d’abord établir à qui appartient cette clé.',
              },
              {
                text: 'Chaîne X.509 → racine de confiance, SAN == identité annoncée, puis signature de la requête',
                correct: true,
                explanation:
                  'Oui — chaque maillon dépend du précédent : racine acceptée, identité correspondante, requête attribuable.',
              },
              {
                text: 'Le nom affiché dans la requête',
                explanation:
                  'Non — le nom déclaratif est justement ce qu’un fraudeur contrôle. Seule l’identité vérifiée doit être affichée à l’utilisateur.',
              },
            ],
          },
          {
            id: 'q3',
            question: 'Un certificat valide suffit-il à rendre une demande légitime ?',
            options: [
              {
                text: 'Oui, la cryptographie garantit la légitimité',
                explanation:
                  'Non — la crypto prouve QUI demande, pas s’il a le DROIT de demander cela. Deux questions distinctes.',
              },
              {
                text: 'Non : il authentifie le demandeur ; la légitimité de la demande relève de la gouvernance (enregistrement, droits)',
                correct: true,
                explanation:
                  'Oui — dans eIDAS 2.0, l’enregistrement des relying parties et le cadrage de leurs demandes complètent l’authentification.',
              },
              {
                text: 'Oui, si le certificat vient d’une autorité européenne',
                explanation:
                  'Non — l’origine de l’autorité ne change pas la nature du problème : authentification ≠ autorisation de demander.',
              },
            ],
          },
        ]}
      />
    </div>
  )
}
