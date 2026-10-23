import { quizBank } from '../../data/quiz-bank'
import { Term } from '../../components/content/Term'
import { Callout } from '../../components/content/Callout'
import { Quiz } from '../../components/content/Quiz'
import { ScenarioLoader } from '../../components/sequence/AttackScenario'

/**
 * OID4VP — Chapitre 0 : le flow de présentation de bout en bout.
 * La seconde moitié du triangle, cross-device, direct_post.
 */
export default function VpCh0() {
  return (
    <div className="lesson-prose">
      <p>
        le module OID4VCI a mis un credential dans votre wallet. Ce module raconte l'autre moitié du
        triangle : un <Term id="verifier" /> demande une preuve, le wallet la construit — avec votre
        consentement, claim par claim — et la lui envoie. Jouez d'abord le flow complet ; les
        chapitres suivants zoomeront sur chaque pièce (identification du Verifier, DCQL, divulgation
        sélective, Key Binding).
      </p>

      <div className="not-prose my-6">
        <ScenarioLoader scenarioId="oid4vp/presentation-flow" />
      </div>

      <h2>Ce qu'il faut voir dans ce flow</h2>
      <p>
        <strong>C'est une Authorization Request OAuth2.</strong> Le Verifier est un Client, la
        requête a un <code>client_id</code>, un <code>nonce</code>, un <code>response_type</code> (
        <code>vp_token</code>) — et le Request Object signé est la mécanique <Term id="jar" /> du
        chapitre 7 d'OAuth2. Rien n'est réinventé : OID4VP est un profil de ce que vous savez déjà.
      </p>
      <p>
        <strong>
          La réponse part en <Term id="direct-post" />.
        </strong>{' '}
        Le wallet POSTe directement le <Term id="vp-token" /> à la <code>response_uri</code> — pas
        de redirection navigateur surchargée d'artefacts volumineux. Et quand les claims ne doivent
        pas transiter en clair jusqu'au endpoint, la variante <code>direct_post.jwt</code> chiffre
        la réponse entière.
      </p>
      <p>
        Dans le scénario dessiné, la présentation n'exige pas de contact avec l'Issuer : ses clés
        publiques sont connues. Une récupération de clés ou de statut, ainsi que la collusion entre
        acteurs, peuvent néanmoins révéler des usages. Le module vie privée explicite ces limites.
      </p>
      <Callout kind="spec" specRef="OID4VP 1.0 §8.1" title="Dans la spec — le vp_token">
        <p>
          Le <code>vp_token</code> est un objet JSON dont les clés sont les{' '}
          <strong>ids des Credential Queries</strong> de la requête DCQL, et les valeurs des
          tableaux de présentations. La réponse épouse la structure de la question — pas de
          devinette côté Verifier.
        </p>
      </Callout>

      <Quiz
        quizId="oid4vp/authorization-request/flow-presentation"
        questions={quizBank['oid4vp/authorization-request/flow-presentation']!}
      />
    </div>
  )
}
