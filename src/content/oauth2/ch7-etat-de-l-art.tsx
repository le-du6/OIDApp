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
        Le <Term id="security-bcp" /> (janvier 2025) consolide vingt ans d'incidents en obligations.
        Vous en avez appliqué l'essentiel : <Term id="pkce" /> pour tous les clients,{' '}
        <Term id="redirect-uri" /> en correspondance exacte, mort d'
        <Term id="implicit-grant">implicit</Term> et de <Term id="ropc" />, tokens{' '}
        <Term id="dpop">sender-constrained</Term> recommandés, <Term id="iss-response" /> contre le
        mix-up. Le BCP est le document à citer quand on vous demande « pourquoi cette contrainte ?
        ».
      </p>

      <h2>OAuth 2.1 — le nettoyage</h2>
      <p>
        <Term id="oauth21" /> n'invente rien : il fige RFC 6749 + le BCP en un seul document, et{' '}
        <em>retire</em> ce qui est mort. Disparus : implicit, ROPC, le bearer token en query string.
        Obligatoires : PKCE partout, exact matching des redirect_uri. Migrer vers OAuth 2.1, c'est
        surtout supprimer du code dangereux.
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
      <Callout kind="security" title="La suite : OIDC (Phase 2)">
        <p>
          OAuth 2.0 fait de la <em>délégation d'autorisation</em>. Il ne dit toujours pas « qui est
          l'utilisateur » — et « se connecter avec un access token » est un anti-pattern qu'OpenID
          Connect existe précisément pour corriger. C'est le point de départ de la Phase 2 :{' '}
          <Term id="jwt">ID Token</Term>, validation de signature (JWKS, <code>kid</code>),{' '}
          Discovery, et <code>nonce</code> vs <Term id="state" />.
        </p>
      </Callout>

      <Quiz
        quizId="oauth2/etat-de-l-art/bcp-oauth21"
        questions={[
          {
            id: 'q1',
            question: 'Qu’est-ce qu’OAuth 2.1 apporte de vraiment nouveau ?',
            options: [
              {
                text: 'De nouveaux grants plus sûrs',
                explanation:
                  'Non — OAuth 2.1 n’ajoute pas de grant : il en RETIRE (implicit, ROPC) et consolide le BCP.',
              },
              {
                text: 'Rien de neuf : il consolide RFC 6749 + le BCP et supprime ce qui est déprécié',
                correct: true,
                explanation:
                  'Exactement — c’est un travail de nettoyage et de cohérence, pas d’invention. PKCE obligatoire, exact matching, fin d’implicit/ROPC.',
              },
              {
                text: 'Le remplacement des JWT par un format propriétaire',
                explanation: 'Non — les JWT restent le format structuré de référence.',
              },
            ],
          },
          {
            id: 'q2',
            question: 'PAR (RFC 9126) répond à quel problème du front channel ?',
            options: [
              {
                text: 'Le vol de bearer token',
                explanation: 'Non — ça, c’est DPoP/mTLS.',
              },
              {
                text: 'La manipulation des paramètres de l’authorization request dans le navigateur',
                correct: true,
                explanation:
                  'Oui — en poussant les paramètres en back channel, PAR ne laisse qu’une référence opaque dans l’URL : plus rien à falsifier.',
              },
              {
                text: 'L’expiration trop rapide des access tokens',
                explanation: 'Non — PAR ne touche pas au cycle de vie des tokens.',
              },
            ],
          },
          {
            id: 'q3',
            question: 'Quel est l’apport de RAR (RFC 9396) face aux scopes classiques ?',
            options: [
              {
                text: 'Des scopes plus courts',
                explanation:
                  'Non — RAR ne raccourcit pas les scopes, il les remplace par une structure riche.',
              },
              {
                text: 'Un consentement structuré et précis (« virement de 50 € vers IBAN X ») plutôt qu’un scope grossier',
                correct: true,
                explanation:
                  'Oui — authorization_details en JSON : le consentement décrit l’action exacte. Socle des usages FAPI / banque ouverte.',
              },
              {
                text: 'Le chiffrement du token',
                explanation:
                  'Non — RAR concerne la granularité de l’autorisation, pas la protection du token.',
              },
            ],
          },
          {
            id: 'q4',
            question: 'Le Security BCP (RFC 9700) est avant tout…',
            options: [
              {
                text: 'Un nouveau protocole concurrent d’OAuth2',
                explanation:
                  'Non — c’est un document de bonnes pratiques POUR OAuth 2.0, pas un remplaçant.',
              },
              {
                text: 'La consolidation en obligations des leçons tirées des attaques réelles',
                correct: true,
                explanation:
                  'Oui — chaque « DOIT » du BCP referme une classe d’attaque documentée. C’est la mémoire opérationnelle du protocole.',
              },
              {
                text: 'Une spec réservée au secteur bancaire',
                explanation:
                  'Non — le secteur bancaire a SES profils (FAPI), mais le BCP s’applique à tout déploiement OAuth2.',
              },
            ],
          },
        ]}
      />
    </div>
  )
}
