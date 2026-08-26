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
        questions={[
          {
            id: 'q1',
            question: 'Que contient le claim cnf.jkt d’un access token DPoP ?',
            options: [
              {
                text: 'La clé privée du Client, chiffrée',
                explanation:
                  'Surtout pas — la clé privée ne quitte JAMAIS le Client. Le token ne porte qu’une empreinte de la clé PUBLIQUE.',
              },
              {
                text: 'L’empreinte SHA-256 de la clé publique du Client (JWK thumbprint)',
                correct: true,
                explanation:
                  'Oui (RFC 9449 §6.1) — signée par l’AS dans le token : c’est le cadenas que seul le détenteur de la clé privée peut ouvrir.',
              },
              {
                text: 'Le hash de l’access token',
                explanation:
                  'Non — ça, c’est ath, dans le PROOF de chaque requête API : il lie le proof au token présenté.',
              },
            ],
          },
          {
            id: 'q2',
            question: 'Pourquoi un proof DPoP intercepté ne peut-il pas être rejoué ?',
            options: [
              {
                text: 'Parce qu’il est chiffré pour le RS',
                explanation: 'Non — un proof est signé, pas chiffré : il se lit comme tout JWT.',
              },
              {
                text: 'jti à usage unique, iat frais, htm/htu liés à une seule requête : le proof est périssable et non transférable',
                correct: true,
                explanation:
                  'Oui (RFC 9449 §4.3) — chaque requête exige un proof neuf. L’intercepté ne vaut que pour la requête déjà faite.',
              },
              {
                text: 'Parce que le RS garde une copie de tous les tokens',
                explanation:
                  'Non — le RS vérifie tout localement par signatures ; il mémorise au plus les jti récents.',
              },
            ],
          },
          {
            id: 'q3',
            question: 'Quand préférer mTLS à DPoP ?',
            options: [
              {
                text: 'Toujours : mTLS est strictement supérieur',
                explanation:
                  'Non — la robustesse de mTLS se paie en gestion de certificats clients, rédhibitoire pour du web/mobile grand public.',
              },
              {
                text: 'Entre serveurs, ou dans des écosystèmes à forte exigence (banque/FAPI) où une PKI cliente existe déjà',
                correct: true,
                explanation:
                  'Oui — la preuve au niveau TLS est imparable et sans code applicatif, si (et seulement si) on peut distribuer des certificats aux clients.',
              },
              {
                text: 'Pour les SPA, qui ne peuvent pas faire de DPoP',
                explanation:
                  'L’inverse : une SPA fait du DPoP avec WebCrypto (clé non-extractible), mais ne peut pas gérer de certificat TLS client.',
              },
            ],
          },
          {
            id: 'q4',
            question: 'DPoP protège-t-il si l’attaquant vole la CLÉ en plus du token ?',
            options: [
              {
                text: 'Oui, le cnf.jkt le détecte',
                explanation:
                  'Non — avec la clé privée, l’attaquant produit des proofs valides : il EST devenu le détenteur légitime aux yeux du protocole.',
              },
              {
                text: 'Non : la preuve de possession vaut ce que vaut la protection de la clé — d’où les clés non-extractibles',
                correct: true,
                explanation:
                  'Exactement — DPoP déplace la cible du token (copiable) vers la clé (protégeable : WebCrypto non-extractible, secure enclave…). Réduire la surface, pas la supprimer.',
              },
              {
                text: 'Oui, car la clé expire avec le token',
                explanation:
                  'Non — la clé n’a pas d’expiration protocolaire ; c’est sa non-exportabilité qui fait le travail.',
              },
            ],
          },
        ]}
      />
    </div>
  )
}
