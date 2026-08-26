import { Link } from '@tanstack/react-router'
import { Term } from '../../components/content/Term'
import { Callout } from '../../components/content/Callout'
import { Quiz } from '../../components/content/Quiz'
import { ScenarioLoader } from '../../components/sequence/AttackScenario'

/**
 * OID4VCI — Chapitre 3 : proof of possession. c_nonce + jwt proof, le
 * mécanisme qui lie le credential à la clé du wallet.
 */
export default function VciCh3() {
  return (
    <div className="lesson-prose">
      <p>
        Question de fond : qu'est-ce qui empêche un credential d'être une simple pièce jointe,
        copiable à l'infini ? Réponse : il est <strong>lié à une clé</strong> que seul votre wallet
        contrôle. Ce chapitre montre comment ce lien se forge à l'émission — un nonce, une
        signature, un claim <Term id="cnf" />. Déroulez le zoom :
      </p>

      <div className="not-prose my-6">
        <ScenarioLoader scenarioId="oid4vci/jwt-proof" />
      </div>

      <h2>Anatomie du jwt proof</h2>
      <p>
        Le <Term id="jwt-proof" /> est un JWT minimal mais où chaque champ ferme un rejeu précis.
        Header : <code>typ: openid4vci-proof+jwt</code> (un proof ne peut être confondu avec aucun
        autre JWT), <code>alg</code>, et <code>jwk</code> — la clé publique dont on prouve le
        contrôle. Payload : <code>aud</code> (ce proof ne vaut que pour CET émetteur),{' '}
        <code>iat</code> (fraîcheur), <code>nonce</code> (le <Term id="c-nonce" /> — ce proof ne
        vaut que pour CE flow). La signature, elle, prouve le contrôle de la clé privée.
      </p>
      <Callout kind="attack" title="Sans aud : le rejeu inter-émetteurs">
        <p>
          Supposez un proof sans <code>aud</code>. Un Issuer malveillant auquel vous demandez un
          credential pourrait <em>rejouer votre proof</em> chez un autre Issuer et se faire émettre,
          lié à VOTRE clé, un credential en votre nom. Avec <code>aud</code>, le second Issuer
          rejette : ce proof ne lui était pas destiné. Même logique que l'audience de l'ID Token en
          Phase 2 — les bonnes idées se répètent.
        </p>
      </Callout>

      <h2>Le résultat : cnf, l'ancrage du key binding</h2>
      <p>
        L'Issuer, une fois le proof vérifié (signature, <code>aud</code>, <code>nonce</code> frais),
        grave la clé publique dans le claim <Term id="cnf" /> du credential et signe le tout. À
        partir de là, le credential et la clé sont indissociables : en Phase 4, chaque présentation
        exigera une signature fraîche de la clé privée (Key Binding JWT). Un credential exfiltré du
        wallet, sans la clé, est un fichier mort.
      </p>
      <Callout kind="note" title="À vos claviers">
        <p>
          La section « 🎫 Proof of possession » du{' '}
          <Link to="/labo-crypto" className="text-accent underline underline-offset-2">
            Crypto Lab
          </Link>{' '}
          vous fait jouer les deux rôles : côté wallet, générez une clé et signez un proof sur un
          c_nonce ; côté issuer, vérifiez-le — puis altérez le nonce et regardez le rejet. Le
          mécanisme tient en trois primitives que vous connaissez déjà toutes.
        </p>
      </Callout>

      <Quiz
        quizId="oid4vci/proof-of-possession/c-nonce-jwt-proof"
        questions={[
          {
            id: 'q1',
            question: 'Que prouve exactement le jwt proof ?',
            options: [
              {
                text: 'L’identité de l’utilisateur',
                explanation:
                  'Non — l’identité relève de l’authentification (portail ou flow d’autorisation). Le proof porte sur autre chose.',
              },
              {
                text: 'Que le wallet contrôle la clé privée correspondant à la jwk du header, ici et maintenant',
                correct: true,
                explanation:
                  'Oui — signature (contrôle de la clé) + nonce (ici et maintenant) + aud (pour cet émetteur). Ni plus, ni moins.',
              },
              {
                text: 'Que le wallet est un logiciel certifié',
                explanation:
                  'Non — ça, c’est le rôle de la key attestation et des wallet attestations (chapitre suivant).',
              },
            ],
          },
          {
            id: 'q2',
            question: 'Pourquoi le c_nonce doit-il venir de l’Issuer et non du wallet ?',
            options: [
              {
                text: 'Parce que le wallet ne sait pas générer d’aléa',
                explanation:
                  'Non — le wallet génère très bien de l’aléa (ses clés !). La raison est ailleurs.',
              },
              {
                text: 'Parce que seul l’émetteur du défi peut garantir qu’une preuve est fraîche et non rejouée',
                correct: true,
                explanation:
                  'Oui — c’est le principe du défi-réponse : celui qui vérifie choisit le défi. Un nonce auto-choisi par le prouveur ne prouve aucune fraîcheur.',
              },
              {
                text: 'Pour économiser une requête réseau',
                explanation:
                  'Non — le Nonce Endpoint AJOUTE une requête, précisément parce que la propriété vaut ce coût.',
              },
            ],
          },
          {
            id: 'q3',
            question:
              'Un credential SD-JWT VC est exfiltré du wallet (sans la clé privée). Que peut en faire le voleur ?',
            options: [
              {
                text: 'Le présenter à un Verifier comme s’il était le Holder',
                explanation:
                  'Non — la présentation exige une signature fraîche de la clé privée liée via cnf (Key Binding, Phase 4). Sans la clé, pas de présentation valable.',
              },
              {
                text: 'Le lire — et c’est tout',
                correct: true,
                explanation:
                  'Oui — comme tout JWS, il se lit (attention aux données personnelles !), mais il est inutilisable comme preuve sans la clé privée du cnf.',
              },
              {
                text: 'Le modifier pour y mettre son propre nom',
                explanation:
                  'Non — toute modification casse la signature de l’Issuer, exactement comme au chapitre validation de la Phase 2.',
              },
            ],
          },
        ]}
      />
    </div>
  )
}
