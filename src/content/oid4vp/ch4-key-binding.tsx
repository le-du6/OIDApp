import { Term } from '../../components/content/Term'
import { Callout } from '../../components/content/Callout'
import { Quiz } from '../../components/content/Quiz'
import { AttackScenario } from '../../components/sequence/AttackScenario'
import { JwtInspector } from '../../components/jwt/JwtInspector'
import { VP_KB_JWT } from '../../data/fixtures/oid4vp'

/**
 * OID4VP — Chapitre 4 : Key Binding JWT. Le rejeu d'une présentation volée,
 * puis la contre-mesure — la promesse cnf de la Phase 3, encaissée.
 */
export default function VpCh4() {
  return (
    <div className="lesson-prose">
      <p>
        Question laissée ouverte par le chapitre précédent : une présentation est un{' '}
        <em>fichier</em> — credential signé, disclosures. Qu'est-ce qui empêche quiconque l'a
        interceptée de la rejouer ? Réponse en deux temps, selon la méthode du cours : on casse
        d'abord (monde naïf, sans preuve de possession), puis on rejoue la même attaque contre le{' '}
        <Term id="kb-jwt" />.
      </p>

      <div className="not-prose my-6">
        <AttackScenario
          attackId="oid4vp/replay-attack"
          protectedId="oid4vp/replay-protected"
          attackLabel="🧨 Sans Key Binding"
          protectedLabel="🛡 Avec Key Binding"
        />
      </div>

      <h2>Anatomie du KB-JWT</h2>
      <p>
        Le KB-JWT clôt la présentation (<code>&lt;jwt&gt;~&lt;disclosures&gt;~&lt;kb-jwt&gt;</code>)
        et la scelle trois fois. Décodez celui de la fixture — signé par la clé du <Term id="cnf" />{' '}
        gravée à l'émission (Phase 3) :
      </p>

      <div className="not-prose my-6">
        <JwtInspector
          label="Key Binding JWT de la fixture (typ kb+jwt)"
          jwt={VP_KB_JWT}
          note="aud = le client_id préfixé du Verifier (cette présentation ne vaut que pour lui) ; nonce = le défi de SA requête (que pour cette transaction) ; sd_hash = l'empreinte de la présentation exacte (que pour cette sélection de claims)."
        />
      </div>

      <Callout kind="spec" specRef="draft-ietf-oauth-selective-disclosure-jwt" title="Dans la spec">
        <p>
          Le header <code>typ</code> DOIT valoir <code>kb+jwt</code> ; les claims <code>iat</code>,{' '}
          <code>aud</code>, <code>nonce</code> et <code>sd_hash</code> sont obligatoires.{' '}
          <Term id="sd-hash" /> est le hachage (algorithme du <code>_sd_alg</code>) de la chaîne «
          JWT signé, tilde, disclosures choisies, chacune suivie d'un tilde » — le tilde final
          inclus. Ajouter ou retirer une disclosure après signature invalide donc le KB-JWT.
        </p>
      </Callout>

      <h2>La boucle des deux phases se referme</h2>
      <p>
        Relisez la chaîne entière : Phase 3 — le wallet <em>prouve</em> sa clé (jwt proof), l'Issuer
        la <em>grave</em> dans le credential (<code>cnf</code>). Phase 4 — le Verifier{' '}
        <em>exige</em> une signature fraîche de cette clé (KB-JWT) et la vérifie avec le{' '}
        <code>cnf</code>… sans avoir jamais parlé à l'Issuer. La preuve de possession voyage dans
        les signatures, d'un bout à l'autre du triangle. C'est, en une phrase, ce qui distingue un
        credential d'une photocopie.
      </p>

      <Quiz
        quizId="oid4vp/key-binding/anti-rejeu"
        questions={[
          {
            id: 'q1',
            question: 'Avec quelle clé le Verifier vérifie-t-il le KB-JWT ?',
            options: [
              {
                text: 'La clé publique de l’Issuer (JWKS)',
                explanation:
                  'Non — celle-là vérifie le CREDENTIAL. Le KB-JWT est signé par le wallet, pas par l’émetteur.',
              },
              {
                text: 'La clé du cnf, lue DANS le credential signé par l’Issuer',
                correct: true,
                explanation:
                  'Oui — le credential transporte lui-même la clé de son détenteur, sous la signature de l’Issuer. Aucun annuaire, aucun appel : tout est dans la présentation.',
              },
              {
                text: 'Une clé négociée en TLS avec le wallet',
                explanation:
                  'Non — TLS protège le canal ; le key binding est vérifiable indépendamment du transport (et même hors ligne).',
              },
            ],
          },
          {
            id: 'q2',
            question: 'Pourquoi le rejeu de la présentation volée échoue-t-il, précisément ?',
            options: [
              {
                text: 'La signature du vieux KB-JWT est devenue invalide',
                explanation:
                  'Non — elle reste parfaitement valide : c’est un vrai KB-JWT du wallet de la victime. C’est son CONTENU qui est périmé.',
              },
              {
                text: 'Son nonce est celui d’une autre transaction — et l’attaquant ne peut pas en signer un neuf sans la clé privée',
                correct: true,
                explanation:
                  'Oui — le défi-réponse, une dernière fois : le Verifier choisit un nonce frais, seule la clé du cnf peut le signer, et cette clé n’a jamais quitté le wallet.',
              },
              {
                text: 'Le credential volé a expiré',
                explanation:
                  'Non — l’attaque échoue même avec un credential parfaitement valide : ce n’est pas une question d’expiration.',
              },
            ],
          },
          {
            id: 'q3',
            question: 'Que scelle sd_hash exactement ?',
            options: [
              {
                text: 'Le credential seul',
                explanation:
                  'Non — il couvre la présentation : credential ET disclosures choisies (chaîne à tildes, tilde final inclus).',
              },
              {
                text: 'La chaîne « <jwt>~<disclosures choisies>~ » : la sélection exacte présentée',
                correct: true,
                explanation:
                  'Oui — quiconque ajoute, retire ou remplace une disclosure après coup invalide le KB-JWT. La sélection consentie est verrouillée.',
              },
              {
                text: 'Le nonce et l’aud',
                explanation:
                  'Non — nonce et aud sont des claims à part du KB-JWT ; sd_hash porte sur la présentation elle-même.',
              },
            ],
          },
        ]}
      />
    </div>
  )
}
