import { quizBank } from '../../data/quiz-bank'
import { Term } from '../../components/content/Term'
import { Callout } from '../../components/content/Callout'
import { Quiz } from '../../components/content/Quiz'
import { ScenarioLoader } from '../../components/sequence/AttackScenario'

/**
 * Chapitre 5, leçon 4 — Vol de bearer token → DPoP / mTLS.
 * La preuve de possession, animée : le token volé devient inerte.
 */
export default function Ch5BearerDpop() {
  return (
    <div className="lesson-prose">
      <p>
        Dernière attaque du chapitre, et la plus frontale : l'attaquant a obtenu un{' '}
        <Term id="access-token" /> complet — proxy d'entreprise trop curieux, logs applicatifs, XSS,
        dump mémoire. Avec un <Term id="bearer-token" />, la partie est finie : détention = pouvoir,
        le RS ne demande rien d'autre. La réponse moderne change la règle du jeu :{' '}
        <strong>lier le token à son détenteur légitime</strong> (sender-constrained tokens).
      </p>

      <h2>DPoP : la preuve de possession applicative</h2>
      <p>
        <Term id="dpop" /> (RFC 9449) tient en trois idées. <strong>Un.</strong> Le Client génère
        une paire de clés locale et joint à sa demande de token un <em>proof</em> : un petit JWT
        signé par sa clé privée, embarquant sa clé publique. <strong>Deux.</strong> L'AS grave
        l'empreinte de cette clé dans le token émis (claim <code>cnf.jkt</code>) : le lien token ↔
        clé est signé par l'AS, infalsifiable. <strong>Trois.</strong> À chaque appel API, le Client
        présente le token <em>plus</em> un proof frais — lié à la méthode, à l'URL, à l'instant, et
        au token lui-même (<code>ath</code>). Jouez le scénario jusqu'au bout : le vol du token y
        est joué… et échoue.
      </p>

      <div className="not-prose my-6">
        <ScenarioLoader scenarioId="oauth2/dpop" />
      </div>

      <Callout kind="security" title="Pourquoi le voleur est coincé — les trois portes fermées">
        <p>
          Sans proof : rejet immédiat. Avec un proof signé de SA clé : l'empreinte ne correspond pas
          au <code>cnf.jkt</code> du token. En rejouant un proof intercepté : <code>jti</code> déjà
          vu, <code>iat</code> périmé, <code>htm/htu</code> d'une autre requête. Il faudrait la clé
          privée — qui n'a jamais quitté le Client (WebCrypto sait même la rendre non-extractible du
          navigateur).
        </p>
      </Callout>

      <h2>mTLS : la même idée, un étage plus bas</h2>
      <p>
        <Term id="mtls" /> (RFC 8705) lie le token au <em>certificat TLS client</em> : même principe
        (une empreinte dans le token, claim <code>cnf.x5t#S256</code>), mais la preuve de possession
        est faite par la couche TLS elle-même. Plus robuste — impossible à oublier sur une requête —
        mais exige de distribuer et gérer des certificats clients : naturel entre serveurs (banque,
        B2B, FAPI), lourd pour des apps web ou mobiles. DPoP est le compromis déployable partout ;
        mTLS le choix des environnements à forte exigence.
      </p>
      <Callout kind="spec" specRef="RFC 9700 §2.2.1" title="Dans la spec">
        <p>
          Le Security BCP recommande les tokens sender-constrained (mTLS ou DPoP) pour les access
          tokens — et particulièrement pour les refresh tokens des clients publics, où DPoP
          transforme l'artefact le plus dangereux du protocole en objet inutilisable sans la clé.
        </p>
      </Callout>

      <Quiz
        quizId="oauth2/attaques/bearer-dpop"
        questions={quizBank['oauth2/attaques/bearer-dpop']!}
      />
    </div>
  )
}
