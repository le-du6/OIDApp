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
        La Phase 3 a mis un credential dans votre wallet. Ce module raconte l'autre moitié du
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
        <strong>L'Issuer est absent.</strong> Relisez le diagramme : deux acteurs actifs (wallet,
        verifier) et pas une flèche vers l'émetteur. La promesse anti-« phone home » de la Phase 3
        est tenue au moment où elle compte — la présentation.
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
        questions={[
          {
            id: 'q1',
            question: 'Qui contacte l’Issuer pendant une présentation OID4VP ?',
            options: [
              {
                text: 'Le Verifier, pour valider le credential',
                explanation:
                  'Non — le Verifier vérifie seul, avec les clés publiques de l’Issuer déjà publiées. Aucun appel.',
              },
              {
                text: 'Personne : l’Issuer n’apparaît pas dans le flow',
                correct: true,
                explanation:
                  'Oui — c’est la propriété structurante du triangle : émission et présentation sont découplées, l’émetteur ne voit rien.',
              },
              {
                text: 'Le wallet, pour obtenir un c_nonce',
                explanation:
                  'Non — le c_nonce appartient à l’ÉMISSION (Phase 3). Ici le nonce vient du VERIFIER, dans sa requête.',
              },
            ],
          },
          {
            id: 'q2',
            question: 'Quelle est la structure du vp_token ?',
            options: [
              {
                text: 'Une simple chaîne contenant la présentation',
                explanation:
                  'Non — c’était le cas dans d’anciens drafts. La 1.0 structure la réponse.',
              },
              {
                text: 'Un objet JSON : clés = ids des Credential Queries DCQL, valeurs = tableaux de présentations',
                correct: true,
                explanation:
                  'Oui (§8.1) — la réponse est indexée par la requête : le Verifier retrouve chaque présentation sous l’id qu’il a lui-même choisi.',
              },
              {
                text: 'Un JWT signé par l’Issuer',
                explanation:
                  'Non — le vp_token CONTIENT des présentations (dont des JWT), mais lui-même est un objet JSON de réponse.',
              },
            ],
          },
          {
            id: 'q3',
            question: 'Pourquoi response_mode=direct_post plutôt qu’une redirection ?',
            options: [
              {
                text: 'Pour chiffrer automatiquement la réponse',
                explanation:
                  'Non — le chiffrement est la variante direct_post.jwt ; direct_post seul est un POST en clair (sous TLS).',
              },
              {
                text: 'Pour envoyer la réponse (volumineuse) directement à la response_uri sans surcharger une redirection navigateur',
                correct: true,
                explanation:
                  'Oui — une présentation (credential + disclosures + KB-JWT) est trop lourde et trop sensible pour voyager dans une URL de redirection.',
              },
              {
                text: 'Parce que le navigateur est interdit dans OID4VP',
                explanation:
                  'Non — le navigateur reste présent (QR, retour utilisateur) ; c’est le canal de RÉPONSE qui change.',
              },
            ],
          },
        ]}
      />
    </div>
  )
}
