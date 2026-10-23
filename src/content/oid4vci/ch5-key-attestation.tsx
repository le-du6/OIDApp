import { quizBank } from '../../data/quiz-bank'
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
          OID4VCI permet un proof jwt contenant key_attestation dans son header : il comporte alors
          une signature de possession de la clé. Le proof de type attestation transporte directement
          une attestation et peut éviter toute signature de possession par les clés attestées. Le
          tiers attestant et ses racines de confiance doivent être reconnus par l'Issuer (annexes D
          et F).
        </p>
      </Callout>

      <h2>La chaîne de confiance, de bout en bout</h2>
      <p>
        Prenez du recul : la valeur d'un credential présenté dans le module OID4VP reposera sur une
        chaîne entière — l'utilisateur a été identifié correctement (enrôlement, chapitre 2), la clé
        est bien gardée (key attestation, ce chapitre), le credential est signé (Issuer), la
        présentation est signée par la clé (key binding, OID4VP). Chaque maillon borne les autres :
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
        questions={quizBank['oid4vci/key-attestation/attester-la-cle']!}
      />
    </div>
  )
}
