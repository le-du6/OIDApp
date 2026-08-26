import { Term } from '../../components/content/Term'
import { Callout } from '../../components/content/Callout'
import { Quiz } from '../../components/content/Quiz'
import { CompareTable } from '../../components/content/CompareTable'

/**
 * OID4VP — Chapitre 5 : unlinkability, et le comparateur final
 * fédération vs wallet — la synthèse des quatre modules.
 */
export default function VpCh5() {
  return (
    <div className="lesson-prose">
      <p>
        Dernier étage de l'exigence vie privée : au-delà de « l'émetteur ne voit rien » (chapitre 0
        d'OID4VCI) et de « je ne révèle que le nécessaire » (divulgation sélective), il y a l'
        <Term id="unlinkability" /> — deux présentations d'une même personne ne devraient pas être{' '}
        <em>corrélables</em>, ni par des Verifiers qui coopèrent, ni par un Verifier au fil du temps
        (au-delà de ce que les claims révélés impliquent).
      </p>

      <h2>Les ennemis concrets de l'unlinkability</h2>
      <p>
        Présenter deux fois <em>le même</em> credential, c'est présenter deux fois la même{' '}
        <strong>signature</strong> de l'Issuer et les mêmes <strong>digests salés</strong> — deux
        identifiants uniques de fait, corrélables entre Verifiers sans lire un seul claim. Les
        parades sont connues et pratiquées : émission <strong>par lots</strong> de credentials au
        contenu identique mais aux sels et signatures distincts (batch issuance — la Credential
        Request d'OID4VCI accepte plusieurs proofs pour cela), usage limité voire unique de chaque
        exemplaire, rotation.
      </p>
      <Callout kind="security" title="L'état honnête du sujet">
        <p>
          Le batch issuance traite la corrélation entre Verifiers « ordinaires ». Face à un
          adversaire qui serait à la fois émetteur et vérificateur (collusion Issuer-Verifier), les
          signatures classiques gardent des surfaces de corrélation — c'est l'argument des schémas à
          preuves à divulgation nulle (BBS+, ZK-SNARKs sur ECDSA), encore en cours de maturation
          pour ces écosystèmes. Le cours s'arrête à l'état de l'art déployé ; sachez où est la
          frontière.
        </p>
      </Callout>

      <h2>Le comparateur final : fédération vs wallet</h2>
      <p>
        Quatre modules plus tard, la boucle : voici les deux architectures côte à côte, sur les axes
        annoncés au premier jour — secrets échangés, surface d'attaque, vie privée, traçabilité.
      </p>

      <CompareTable
        caption="Fédération (OIDC) vs triangle wallet (OID4VCI/VP)"
        columns={['Axe', 'Fédération (IdP central)', 'Wallet (triangle)']}
        rows={[
          {
            label: 'Qui est en ligne à chaque usage',
            cells: [
              { content: 'L’IdP, à CHAQUE connexion', verdict: 'bad' },
              { content: 'Wallet + Verifier seulement — l’Issuer jamais', verdict: 'good' },
            ],
          },
          {
            label: 'Ce que l’émetteur d’identité apprend',
            cells: [
              { content: 'Où, quand, à quelle fréquence vous vous connectez', verdict: 'bad' },
              { content: 'Rien : il ne voit aucune présentation', verdict: 'good' },
            ],
          },
          {
            label: 'Granularité de la divulgation',
            cells: [
              { content: 'Paquets de claims par scope, définis côté IdP', verdict: 'mid' },
              { content: 'Au claim près, consenti à chaque présentation', verdict: 'good' },
            ],
          },
          {
            label: 'Liaison au porteur',
            cells: [
              { content: 'Session/cookies + (rarement) DPoP', verdict: 'mid' },
              { content: 'Clé dans le wallet + KB-JWT à chaque présentation', verdict: 'good' },
            ],
          },
          {
            label: 'Révocation / fraîcheur',
            cells: [
              { content: 'Immédiate — l’IdP est dans la boucle', verdict: 'good' },
              { content: 'Listes de statut, durées courtes : plus difficile', verdict: 'mid' },
            ],
          },
          {
            label: 'Disponibilité',
            cells: [
              { content: 'IdP en panne = plus personne ne se connecte', verdict: 'bad' },
              { content: 'Présentation possible hors ligne (mdoc, NFC/BLE)', verdict: 'good' },
            ],
          },
          {
            label: 'Charge de sécurité',
            cells: [
              { content: 'Concentrée sur l’IdP (cible unique, très défendue)', verdict: 'mid' },
              {
                content: 'Déplacée vers des millions de wallets (WSCD, attestation)',
                verdict: 'mid',
              },
            ],
          },
          {
            label: 'Maturité opérationnelle',
            cells: [
              { content: 'Vingt ans de production', verdict: 'good' },
              { content: 'Déploiements en cours (EUDI : specs finales 2025)', verdict: 'mid' },
            ],
          },
        ]}
      />

      <p>
        Lecture honnête du tableau : le wallet gagne sur la vie privée et la traçabilité —{' '}
        <em>par construction</em>, pas par promesse. Il paie en complexité de révocation, en
        dépendance à la sécurité des terminaux, en jeunesse opérationnelle. La fédération n'est pas
        « battue » : elle reste parfaitement adaptée là où l'IdP et le service relèvent du même
        périmètre de confiance. Le triangle s'impose là où l'utilisateur, l'émetteur et le
        vérificateur sont trois mondes distincts — l'identité régalienne en est le cas d'école.
      </p>

      <Quiz
        quizId="oid4vp/unlinkability/federation-vs-wallet"
        questions={[
          {
            id: 'q1',
            question: 'Qu’est-ce qui rend deux présentations du MÊME credential corrélables ?',
            options: [
              {
                text: 'Le nonce du Verifier, identique',
                explanation:
                  'Non — le nonce change à chaque transaction : c’est le Verifier qui le choisit.',
              },
              {
                text: 'La signature de l’Issuer et les digests salés, identiques d’une présentation à l’autre',
                correct: true,
                explanation:
                  'Oui — des octets uniques et stables valent identifiant, même sans lire un claim. D’où le batch issuance et la rotation.',
              },
              {
                text: 'Le KB-JWT, réutilisé',
                explanation:
                  'Non — le KB-JWT est resigné à chaque présentation (nonce frais). Ce sont les parties STABLES qui corrèlent.',
              },
            ],
          },
          {
            id: 'q2',
            question: 'Quelle est la parade déployée aujourd’hui ?',
            options: [
              {
                text: 'Chiffrer le credential',
                explanation:
                  'Non — chiffrer ne change pas la stabilité des artefacts entre présentations aux Verifiers.',
              },
              {
                text: 'L’émission par lots : plusieurs exemplaires aux sels/signatures distincts, à usage limité',
                correct: true,
                explanation:
                  'Oui — chaque présentation consomme un exemplaire « frais ». La Credential Request d’OID4VCI (proofs multiples) est prévue pour ça.',
              },
              {
                text: 'Interdire les présentations répétées',
                explanation:
                  'Non — impraticable, et ce n’est pas ce que font les écosystèmes réels.',
              },
            ],
          },
          {
            id: 'q3',
            question: 'Sur quel axe la fédération garde-t-elle l’avantage ?',
            options: [
              {
                text: 'La vie privée vis-à-vis de l’émetteur',
                explanation: 'Non — c’est l’axe où le triangle gagne par construction.',
              },
              {
                text: 'La révocation immédiate et la fraîcheur, l’IdP étant dans la boucle de chaque usage',
                correct: true,
                explanation:
                  'Oui — le prix du découplage : sans émetteur en ligne, la révocation demande listes de statut et durées courtes. Chaque architecture paie ses propriétés.',
              },
              {
                text: 'La divulgation sélective',
                explanation:
                  'Non — les scopes de la fédération sont plus grossiers que la sélection par claim.',
              },
            ],
          },
        ]}
      />
    </div>
  )
}
