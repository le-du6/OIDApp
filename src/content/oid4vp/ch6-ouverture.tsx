import { quizBank } from '../../data/quiz-bank'
import { Term } from '../../components/content/Term'
import { Callout } from '../../components/content/Callout'
import { Quiz } from '../../components/content/Quiz'

/**
 * OID4VP — Chapitre 6 : ouverture. DC API (le navigateur comme routeur de
 * credentials) et HAIP (les profils qui rendent tout ça interopérable).
 */
export default function VpCh6() {
  return (
    <div className="lesson-prose">
      <p>
        Vous avez parcouru les mécanismes centraux : OAuth2 (délégation), OIDC (authentification),
        OID4VCI (émission), OID4VP (présentation). Deux chantiers dessinent la suite — et méritent
        votre veille.
      </p>

      <h2>DC API : le navigateur entre dans le triangle</h2>
      <p>
        Les flows de ce module reposent sur des QR codes et des deep links — fonctionnels, mais
        bricolés : rien ne garantit que le QR affiché par un site atterrisse dans le BON wallet, et
        le phishing par QR (« quishing ») reste une surface d'attaque. La <Term id="dc-api" />{' '}
        change l'architecture : le site appelle une API du navigateur, qui route la requête vers les
        wallets installés via l'OS — sélecteur système, origine du site vérifiée par le navigateur
        lui-même.
      </p>
      <Callout kind="spec" specRef="OID4VP 1.0 App. A" title="Dans la spec">
        <p>
          La DC API fournit au wallet l'origine du site. Pour la présentation, l'audience est
          construite avec le préfixe origin:. Ce n'est pas un client_id origin: à accepter dans la
          requête : OID4VP §5.9.3 l'interdit. L'annexe A distingue les requêtes signées et non
          signées ainsi que les valeurs apportées par l'environnement.
        </p>
      </Callout>

      <h2>HAIP : des specs aux écosystèmes</h2>
      <p>
        Tout ce cours l'a montré : les specs de base offrent des OPTIONS — formats, préfixes,
        algorithmes, response modes. Un écosystème réel doit choisir, sinon deux implémentations
        conformes peuvent ne pas interopérer. C'est le rôle de <Term id="haip" /> (1.0 Final,
        décembre 2025) : figer un sous-ensemble à haut niveau de garantie (SD-JWT VC, tel
        algorithme, telle identification du Verifier…). L'ARF européen joue le même rôle pour l'EUDI
        Wallet. Le réflexe à retenir : après la spec, cherchez <em>le profil</em> — c'est lui qui
        dit ce qui se déploie vraiment.
      </p>
      <Callout kind="note" title="Fin du parcours — et maintenant ?">
        <p>
          Le fil rouge du cours tient en une question : « quel problème de sécurité ce mécanisme
          résout-il, et que se passerait-il sans lui ? ». Elle vous servira au-delà de ces quatre
          protocoles : posez-la à chaque nouveau draft, chaque nouvelle extension, chaque profil. La
          Carte des specs et le Comparateur (menu Transversal) sont là pour réviser — et le Crypto
          Lab pour garder les mains dans le cambouis.
        </p>
      </Callout>

      <Quiz
        quizId="oid4vp/ouverture/dc-api-haip"
        questions={quizBank['oid4vp/ouverture/dc-api-haip']!}
      />
    </div>
  )
}
