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
        Vous avez désormais le tableau complet : OAuth2 (délégation), OIDC (authentification),
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
          OID4VP profile son usage au-dessus de la DC API : le <code>client_id</code> y utilise le
          préfixe <code>origin</code> — fourni par le NAVIGATEUR, pas déclaré par le site. L'origine
          devient une donnée d'infrastructure, plus difficile à usurper qu'un QR affiché.
        </p>
      </Callout>

      <h2>HAIP : des specs aux écosystèmes</h2>
      <p>
        Tout ce cours l'a montré : les specs de base offrent des OPTIONS — formats, préfixes,
        algorithmes, response modes. Un écosystème réel doit choisir, sinon deux implémentations
        conformes peuvent ne pas interopérer. C'est le rôle de <Term id="haip" /> : figer un
        sous-ensemble à haut niveau de garantie (SD-JWT VC, tel algorithme, telle identification du
        Verifier…). L'ARF européen joue le même rôle pour l'EUDI Wallet. Le réflexe à retenir :
        après la spec, cherchez <em>le profil</em> — c'est lui qui dit ce qui se déploie vraiment.
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
        questions={[
          {
            id: 'q1',
            question: 'Quel problème la DC API traite-t-elle par rapport aux QR codes ?',
            options: [
              {
                text: 'La taille des requêtes DCQL',
                explanation:
                  'Non — la taille n’est pas l’enjeu ; le routage et l’authenticité de l’origine le sont.',
              },
              {
                text: 'Le routage fiable vers le wallet et une origine du demandeur garantie par le navigateur',
                correct: true,
                explanation:
                  'Oui — l’OS présente un sélecteur de wallet, et l’origine (préfixe origin du client_id) vient du navigateur, pas d’une déclaration du site.',
              },
              {
                text: 'La révocation des credentials',
                explanation:
                  'Non — la révocation reste un sujet indépendant du canal de transport.',
              },
            ],
          },
          {
            id: 'q2',
            question: 'À quoi sert un profil comme HAIP ou l’ARF ?',
            options: [
              {
                text: 'À remplacer les specs de base',
                explanation:
                  'Non — un profil s’appuie sur les specs : il en SÉLECTIONNE les options, il ne les réécrit pas.',
              },
              {
                text: 'À figer un sous-ensemble d’options pour garantir l’interopérabilité et le niveau de garantie',
                correct: true,
                explanation:
                  'Oui — deux implémentations « conformes OID4VP » peuvent ne pas interopérer ; conformes au MÊME PROFIL, si.',
              },
              {
                text: 'À traduire les specs en droit européen',
                explanation:
                  'Non — le droit, c’est le règlement (eIDAS 2.0) et ses actes d’exécution ; l’ARF est le cadre TECHNIQUE qui s’y articule.',
              },
            ],
          },
          {
            id: 'q3',
            question: 'La question fil rouge à poser à tout nouveau mécanisme ?',
            options: [
              {
                text: '« Est-ce plus performant ? »',
                explanation: 'Non — utile, mais ce n’est pas le fil rouge de ce cours.',
              },
              {
                text: '« Quel problème de sécurité résout-il, et que se passerait-il sans lui ? »',
                correct: true,
                explanation:
                  'Oui — c’est la grille qui a déplié state, PKCE, nonce, at_hash, c_nonce, KB-JWT… Elle marchera aussi pour le prochain acronyme.',
              },
              {
                text: '« Est-ce compatible avec SAML ? »',
                explanation: 'Non — quoique la question puisse, parfois, se poser encore.',
              },
            ],
          },
        ]}
      />
    </div>
  )
}
