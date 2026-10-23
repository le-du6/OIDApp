import { quizBank } from '../../data/quiz-bank'
import { Link } from '@tanstack/react-router'
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
        Dans le profil de démonstration, le credential est lié à une clé. OID4VCI n'impose pas ce
        mécanisme à tous les formats : la configuration, les preuves prises en charge et la
        politique d'émission le déterminent. Nous suivons ici un proof jwt et une liaison cnf.jwk.
      </p>

      <div className="not-prose my-6">
        <ScenarioLoader scenarioId="oid4vci/jwt-proof" />
      </div>

      <h2>Anatomie du jwt proof</h2>
      <p>
        Le proof jwt possède un header typ=openid4vci-proof+jwt, un algorithme de signature
        asymétrique et une référence de clé ; ici jwk. Le payload contient aud (Credential Issuer)
        et iat. nonce est requis lorsque l'Issuer possède un Nonce Endpoint : il reprend un c_nonce
        accepté par cet Issuer. Ce nonce n'est pas nécessairement unique par transaction ni consommé
        au premier usage.
      </p>
      <Callout kind="attack" title="Sans aud : le rejeu inter-émetteurs">
        <p>
          Supposez un proof sans <code>aud</code>. Un Issuer malveillant auquel vous demandez un
          credential pourrait <em>rejouer votre proof</em> chez un autre Issuer et se faire émettre,
          lié à VOTRE clé, un credential en votre nom. Avec <code>aud</code>, le second Issuer
          rejette : ce proof ne lui était pas destiné. Même logique que l'audience de l'ID Token en
          OIDC — les bonnes idées se répètent.
        </p>
      </Callout>

      <h2>Le résultat : cnf, l'ancrage du key binding</h2>
      <p>
        L'Issuer valide la preuve et l'autorisation d'émission, puis signe le credential contenant
        cnf.jwk. Cette signature lie le contenu à la clé ; le KB-JWT prouvera plus tard son contrôle
        pour une présentation précise. Sans la clé privée, un voleur ne peut produire cette preuve
        fraîche ; il peut néanmoins lire les données exfiltrées. La possession de clé ne prouve pas
        à elle seule l'identité de la personne utilisant l'appareil.
      </p>
      <Callout kind="note" title="À vos claviers">
        <p>
          La section « Proof of possession » du{' '}
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
        questions={quizBank['oid4vci/proof-of-possession/c-nonce-jwt-proof']!}
      />
    </div>
  )
}
