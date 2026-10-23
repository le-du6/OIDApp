import { Link } from '@tanstack/react-router'
import { quizBank } from '../../data/quiz-bank'
import { Term } from '../../components/content/Term'
import { Callout } from '../../components/content/Callout'
import { Quiz } from '../../components/content/Quiz'
import { AttackScenario } from '../../components/sequence/AttackScenario'
import { JwtInspector } from '../../components/jwt/JwtInspector'
import { VP_KB_JWT } from '../../data/fixtures/oid4vp'

/**
 * OID4VP — Chapitre 4 : Key Binding JWT. Le rejeu d'une présentation volée,
 * puis la contre-mesure — la promesse cnf du module OID4VCI, encaissée.
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
          attackLabel="Sans Key Binding"
          protectedLabel="Avec Key Binding"
        />
      </div>

      <h2>Anatomie du KB-JWT</h2>
      <p>
        Le KB-JWT clôt la présentation (<code>&lt;jwt&gt;~&lt;disclosures&gt;~&lt;kb-jwt&gt;</code>)
        et la scelle trois fois. Décodez celui de la fixture — signé par la clé du <Term id="cnf" />{' '}
        gravée à l'émission (OID4VCI) :
      </p>

      <div className="not-prose my-6">
        <JwtInspector
          label="Key Binding JWT de la fixture (typ kb+jwt)"
          jwt={VP_KB_JWT}
          note="aud = le client_id préfixé du Verifier (cette présentation ne vaut que pour lui) ; nonce = le défi de SA requête (que pour cette transaction) ; sd_hash = l'empreinte de la présentation exacte (que pour cette sélection de claims)."
        />
      </div>

      <Callout kind="spec" specRef="RFC 9901" title="Dans la spec">
        <p>
          Le header <code>typ</code> DOIT valoir <code>kb+jwt</code> ; les claims <code>iat</code>,{' '}
          <code>aud</code>, <code>nonce</code> et <code>sd_hash</code> sont obligatoires.{' '}
          <Term id="sd-hash" /> est le hachage (algorithme du <code>_sd_alg</code>) de la chaîne «
          JWT signé, tilde, disclosures choisies, chacune suivie d'un tilde » — le tilde final
          inclus. Ajouter ou retirer une disclosure fait diverger sd_hash : la présentation est
          rejetée même si la signature du KB-JWT reste mathématiquement valide.
        </p>
      </Callout>

      <h2>La continuité entre émission et présentation se referme</h2>
      <p>
        Relisez la chaîne de notre exemple SD-JWT avec binding : OID4VCI — le wallet <em>prouve</em>{' '}
        sa clé (jwt proof), l'Issuer la <em>grave</em> dans le credential (<code>cnf</code>). OID4VP
        — le Verifier <em>exige</em> une signature fraîche de cette clé (KB-JWT) et la vérifie avec
        le <code>cnf</code>… sans appel à l’Issuer dans ce scénario, ses clés étant déjà connues. La
        preuve de possession voyage dans les signatures, d'un bout à l'autre du triangle. Cette
        propriété dépend du binding choisi, et ne s’applique pas à tout credential.
      </p>

      <h2>Ce que les signatures ne disent pas</h2>
      <p>
        La signature de l’Issuer lie un credential à une clé publique. Celle du wallet démontre le
        contrôle de la clé privée pour cette audience, ce nonce et cette sélection. La protection
        matérielle de la clé et l’identité de la personne présente sont des questions
        supplémentaires. DPoP protège l’usage d’un token OAuth ; une key attestation décrit une clé
        selon un tiers ; aucun ne remplace ce KB-JWT.
      </p>
      <p>
        Le laboratoire « De l’émission à la présentation » construit cette chaîne avec des clés
        jetables et distingue mauvaise clé, audience, nonce, ancienneté, disclosures et transaction
        déjà consommée.
      </p>
      <p>
        <Link to="/labo-crypto" hash="binding" className="text-accent underline">
          Ouvrir le laboratoire émission → présentation
        </Link>{' '}
        pour manipuler cette chaîne et observer chaque rejet.
      </p>
      <Quiz
        quizId="oid4vp/key-binding/anti-rejeu"
        questions={quizBank['oid4vp/key-binding/anti-rejeu']!}
      />
    </div>
  )
}
