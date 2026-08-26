import { Term } from '../../components/content/Term'
import { Callout } from '../../components/content/Callout'
import { Quiz } from '../../components/content/Quiz'

/**
 * OID4VCI — Chapitre 5 : key attestation. Au-delà de « je contrôle la clé » :
 * « ma clé vit dans un environnement digne de confiance ».
 */
export default function VciCh5() {
  return (
    <div className="lesson-prose">
      <p>
        Le chapitre précédent a prouvé une chose à l'Issuer : le wallet <em>contrôle</em> sa clé.
        Mais contrôler ne dit rien de la <em>qualité de garde</em>. Une clé générée en mémoire d'un
        wallet compromis est contrôlée… et exfiltrable. Pour un credential régalien — une
        attestation d'identité — l'émetteur veut plus : la preuve que la clé vit dans un
        environnement dont elle ne peut pas sortir. C'est la <Term id="key-attestation" />.
      </p>

      <h2>Qui atteste quoi</h2>
      <p>
        L'attestation est une déclaration <strong>signée par un tiers de confiance</strong> — le
        fabricant de l'appareil ou le fournisseur du wallet — affirmant : « cette clé publique a été
        générée dans tel environnement (Secure Enclave, StrongBox, élément sécurisé…), avec telles
        propriétés (non-exportable, protégée par tel niveau de déverrouillage) ». L'Issuer, qui fait
        confiance à ce tiers, peut alors calibrer ce qu'il émet : pas d'attestation d'identité de
        haut niveau vers une clé logicielle nue.
      </p>
      <Callout kind="spec" specRef="OID4VCI 1.0 App. D & F.3" title="Dans la spec">
        <p>
          OID4VCI 1.0 porte la key attestation de deux manières : un format d'attestation en JWT
          (App. D), et un proof type dédié <code>attestation</code> (App. F.3) qui remplace ou
          complète le proof <code>jwt</code> — l'attestation y véhicule alors la clé ET la preuve de
          son environnement, d'un seul tenant.
        </p>
      </Callout>

      <h2>La chaîne de confiance, de bout en bout</h2>
      <p>
        Prenez du recul : la valeur d'un credential présenté en Phase 4 reposera sur une chaîne
        entière — l'utilisateur a été identifié correctement (enrôlement, chapitre 2), la clé est
        bien gardée (key attestation, ce chapitre), le credential est signé (Issuer), la
        présentation est signée par la clé (key binding, Phase 4). Chaque maillon borne les autres :
        la crypto la plus solide ne rattrape ni un enrôlement laxiste, ni une clé mal logée. Dans le
        monde EUDI, le composant de garde s'appelle le WSCD (Wallet Secure Cryptographic Device) —
        et son niveau conditionne le niveau de garantie (LoA) atteignable.
      </p>
      <Callout kind="security" title="Une limite honnête">
        <p>
          L'attestation déplace la confiance, elle ne la crée pas : le Verifier de l'attestation
          doit connaître et accepter les racines du fabricant/fournisseur — une PKI, avec ses listes
          de racines, ses révocations, sa gouvernance. C'est un choix d'ancrage, pas de la magie.
        </p>
      </Callout>

      <Quiz
        quizId="oid4vci/key-attestation/attester-la-cle"
        questions={[
          {
            id: 'q1',
            question: 'Quelle est la différence entre le jwt proof et la key attestation ?',
            options: [
              {
                text: 'Aucune, ce sont deux noms du même mécanisme',
                explanation:
                  'Non — le proof prouve le CONTRÔLE de la clé par le wallet ; l’attestation prouve l’ENVIRONNEMENT où la clé vit, signée par un tiers.',
              },
              {
                text: 'Le proof prouve le contrôle de la clé ; l’attestation prouve, via un tiers de confiance, où et comment la clé est gardée',
                correct: true,
                explanation:
                  'Oui — deux affirmations complémentaires : « c’est ma clé » vs « ma clé est dans un coffre certifié ».',
              },
              {
                text: 'L’attestation remplace la signature de l’Issuer',
                explanation:
                  'Non — la signature de l’Issuer sur le credential reste indispensable ; l’attestation intervient en amont, à l’émission.',
              },
            ],
          },
          {
            id: 'q2',
            question: 'Qui signe une key attestation ?',
            options: [
              {
                text: 'Le wallet lui-même, avec la clé attestée',
                explanation:
                  'Non — auto-attester n’apporte rien : un wallet compromis attesterait n’importe quoi. Il faut un tiers.',
              },
              {
                text: 'Un tiers de confiance : fabricant de l’appareil ou fournisseur du wallet',
                correct: true,
                explanation:
                  'Oui — et l’Issuer doit connaître et accepter les racines de ce tiers : la confiance est déplacée vers une PKI, pas créée ex nihilo.',
              },
              {
                text: 'Le Verifier de la Phase 4',
                explanation:
                  'Non — le Verifier consomme la chaîne de confiance ; il n’atteste rien à l’émission.',
              },
            ],
          },
          {
            id: 'q3',
            question: 'Pourquoi l’Issuer d’un credential régalien exige-t-il une attestation ?',
            options: [
              {
                text: 'Pour vérifier l’identité de l’utilisateur',
                explanation:
                  'Non — l’identité relève de l’enrôlement/authentification. L’attestation porte sur la clé.',
              },
              {
                text: 'Pour calibrer l’émission au niveau de protection réel de la clé (pas de credential fort sur clé faible)',
                correct: true,
                explanation:
                  'Oui — le niveau de garde de la clé (WSCD…) borne le niveau de garantie du credential. Maillon faible = plafond de la chaîne.',
              },
              {
                text: 'Parce que la spec l’impose pour tous les credentials',
                explanation:
                  'Non — c’est une exigence de POLITIQUE d’émission, proportionnée à la valeur du credential, pas une obligation générale du protocole.',
              },
            ],
          },
        ]}
      />
    </div>
  )
}
