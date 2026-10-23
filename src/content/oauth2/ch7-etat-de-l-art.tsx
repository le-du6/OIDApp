import { quizBank } from '../../data/quiz-bank'
import { Link } from '@tanstack/react-router'
import { Term } from '../../components/content/Term'
import { Callout } from '../../components/content/Callout'
import { Quiz } from '../../components/content/Quiz'

/**
 * Chapitre 7 — L'état de l'art 2026 : BCP, OAuth 2.1, PAR/JAR/RAR,
 * présentés comme des réponses aux attaques du chapitre 5, pas un catalogue.
 */
export default function Ch7EtatDeLArt() {
  return (
    <div className="lesson-prose">
      <p>
        Ce chapitre ne présente pas de nouveautés : il <em>nomme</em> ce que vous avez déjà vu à
        l'œuvre. Chaque document ci-dessous est une réponse à une attaque du chapitre 5.
      </p>

      <h2>RFC 9700 — le Security BCP : la mémoire des leçons</h2>
      <p>
        Le <Term id="security-bcp" /> (RFC 9700, janvier 2025) actualise la sécurité OAuth : PKCE
        requis pour les clients publics et recommandé pour les confidentiels, correspondance exacte
        des redirect_uri avec l'exception des ports loopback des apps natives, défense contre le
        mix-up, Implicit déconseillé et ROPC interdit. Les obligations gardent leur contexte.
      </p>

      <h2>OAuth 2.1 — le nettoyage</h2>
      <p>
        <Term id="oauth21" /> reste un Internet-Draft, ici version 16 (septembre 2026). Il consolide
        le cadre et certaines pratiques modernes ; il ne faut pas attribuer toutes ses formulations
        à RFC 9700. Le cours prend OAuth 2.0 et le BCP comme base normative, et présente 2.1 comme
        évolution.
      </p>

      <h2>PAR, JAR, RAR — durcir la requête elle-même</h2>
      <p>
        Le chapitre 2 posait que le <Term id="front-channel" /> est manipulable. Ces trois
        extensions en tirent les conséquences sur l'authorization request :
      </p>
      <ul>
        <li>
          <Term id="par" /> (RFC 9126) : le Client <em>pousse</em> les paramètres à l'AS en back
          channel et ne met plus qu'une référence à usage unique dans l'URL. Plus rien à manipuler
          en front channel.
        </li>
        <li>
          <Term id="jar" /> (RFC 9101) : l'authorization request devient un JWT signé — intégrité et
          authenticité des paramètres, même exposés.
        </li>
        <li>
          <Term id="rar" /> (RFC 9396) : remplace la granularité pauvre du <Term id="scope" /> par
          un <code>authorization_details</code> structuré — « virement de 50 € vers IBAN X » plutôt
          que « payments ». Consentement précis, auditable : le socle des usages FAPI et de la
          banque ouverte.
        </li>
      </ul>
      <Callout kind="note" title="Le fil rouge, bouclé">
        <p>
          Relisez ces trois extensions avec la grille du chapitre 2 : PAR <em>sort</em> les
          paramètres du front channel, JAR les rend <em>infalsifiables</em> s'ils y restent, RAR
          rend le <em>consentement</em> aussi précis que l'action. Trois réponses, une seule
          question : « cette donnée peut-elle survivre au front channel ? ».
        </p>
      </Callout>

      <h2>Vous avez terminé le module OAuth 2.0</h2>
      <p>
        Vous savez lire n'importe quel flow OAuth avec la bonne grille (front/back channel),
        reconnaître et arrêter les attaques classiques (CSRF, interception, mix-up, vol de bearer),
        choisir le bon grant, et situer PKCE/DPoP/PAR dans l'histoire des menaces. Testez vos outils
        une dernière fois au{' '}
        <Link to="/labo-crypto" className="text-accent underline underline-offset-2">
          🧪 Crypto Lab
        </Link>
        .
      </p>
      <Callout kind="security" title="La suite : OIDC (OIDC)">
        <p>
          OAuth 2.0 fait de la <em>délégation d'autorisation</em>. Il ne dit toujours pas « qui est
          l'utilisateur » — et « se connecter avec un access token » est un anti-pattern qu'OpenID
          Connect existe précisément pour corriger. C'est le point de départ du module OIDC :{' '}
          <Term id="jwt">ID Token</Term>, validation de signature (JWKS, <code>kid</code>),{' '}
          Discovery, et <code>nonce</code> vs <Term id="state" />.
        </p>
      </Callout>

      <Quiz
        quizId="oauth2/etat-de-l-art/bcp-oauth21"
        questions={quizBank['oauth2/etat-de-l-art/bcp-oauth21']!}
      />
    </div>
  )
}
