import { Link } from '@tanstack/react-router'
import { Term } from '../../components/content/Term'
import { Callout } from '../../components/content/Callout'
import { Quiz } from '../../components/content/Quiz'
import { ScenarioLoader } from '../../components/sequence/AttackScenario'

/**
 * Chapitre 5, leçon 2 — Interception du code → PKCE.
 * Inclut aussi la validation stricte de redirect_uri (exact match) et
 * l'attaque mix-up → iss (RFC 9207), qui appartiennent au même récit :
 * « le code atterrit au mauvais endroit ».
 */
export default function Ch5InterceptionPkce() {
  return (
    <div className="lesson-prose">
      <p>
        Le chapitre 3 concluait qu'un <Term id="authorization-code" /> volé ne vaut « presque »
        rien. Cette leçon liquide le « presque » — trois manières pour un code d'atterrir chez un
        attaquant, et les trois contre-mesures qui les ferment.
      </p>

      <h2>Voler un code : trois chemins</h2>
      <p>
        <strong>1. L'interception mobile.</strong> Sur mobile, la redirect_uri est souvent un scheme
        custom (<code>photoprint://callback</code>) — et n'importe quelle app installée peut
        s'enregistrer sur le même scheme. Une app malveillante reçoit alors le code à la place de la
        vraie. Pour un client public — pas de <Term id="client-secret" /> — l'attaquant échange le
        code sans obstacle. C'est LE scénario fondateur de la RFC 7636.
      </p>
      <p>
        <strong>2. L'open redirect.</strong> Si l'AS valide la <Term id="redirect-uri" /> trop
        laxistement (préfixe, wildcard, sous-domaine), l'attaquant fait émettre le code vers une URL
        qu'il contrôle. D'où la règle moderne : correspondance <strong>exacte</strong>, chaîne
        contre chaîne (<Term id="open-redirect" />
        ).
      </p>
      <p>
        <strong>3. Le mix-up.</strong> Un Client parlant à plusieurs AS peut être piégé par un AS
        malveillant qui lui fait envoyer le code destiné à un AS honnête… chez l'attaquant.
        Contre-mesure : l'AS s'identifie dans sa réponse (<Term id="iss-response" />, RFC 9207) et
        le Client vérifie que la réponse vient bien de l'AS attendu (<Term id="mix-up" />
        ).
      </p>

      <h2>PKCE : rendre le code inutilisable par un autre</h2>
      <p>
        <Term id="pkce" /> ne bloque pas le vol — il le rend stérile. Le Client génère un{' '}
        <Term id="code-verifier" /> secret, envoie son empreinte (<Term id="code-challenge" />,
        S256) dans l'authorization request, et prouve la possession du verifier à l'échange. L'AS
        recalcule le SHA-256 et compare. Le voleur du code n'a jamais vu le verifier ; le front
        channel n'a exposé qu'une empreinte à sens unique. Jouez le flow durci — les valeurs sont
        les vecteurs officiels de la RFC 7636 (appendice B), recalculables dans le{' '}
        <Link to="/labo-crypto" className="text-accent underline underline-offset-2">
          🧪 Crypto Lab
        </Link>
        .
      </p>

      <div className="not-prose my-6">
        <ScenarioLoader scenarioId="oauth2/auth-code-pkce" />
      </div>

      <Callout kind="spec" specRef="RFC 7636 §4.4.1 · RFC 9700 §2.1.1" title="Dans la spec">
        <p>
          RFC 7636 : le code_challenge DOIT utiliser S256 sauf impossibilité du client (« plain »
          n'existe que comme repli, et le BCP le proscrit). RFC 9700 : TOUS les clients — publics{' '}
          <em>et confidentiels</em> — doivent utiliser PKCE avec le flow code. Ce n'est plus une
          option mobile, c'est le socle.
        </p>
      </Callout>
      <Callout kind="security" title="Pourquoi PKCE même avec un client_secret ?">
        <p>
          Le <Term id="client-secret" /> authentifie <em>l'application</em> ; le verifier
          authentifie <em>cette instance de flow</em>. Un code volé et présenté par la vraie
          application (rejouée par l'attaquant via CSRF, ou sur une autre session) passerait le
          contrôle du secret — pas celui du verifier. Les deux protections ne se recouvrent pas,
          elles s'additionnent.
        </p>
      </Callout>

      <Quiz
        quizId="oauth2/attaques/interception-pkce"
        questions={[
          {
            id: 'q1',
            question: 'Que voit un observateur du front channel dans un flow PKCE ?',
            options: [
              {
                text: 'Le code_verifier, en clair dans l’URL',
                explanation:
                  'Non — le verifier ne quitte JAMAIS le Client avant l’échange en back channel. C’est tout le design.',
              },
              {
                text: 'Le code_challenge — une empreinte SHA-256 dont on ne remonte pas le verifier',
                correct: true,
                explanation:
                  'Oui : seule l’empreinte transite en zone exposée. La préimage (le verifier) reste secrète jusqu’au token endpoint.',
              },
              {
                text: 'Rien : PKCE chiffre l’authorization request',
                explanation:
                  'Non — PKCE ne chiffre rien. Les paramètres restent visibles ; ils sont simplement inexploitables.',
              },
            ],
          },
          {
            id: 'q2',
            question:
              'Une app malveillante intercepte le code sur mobile (scheme custom). Avec PKCE, que se passe-t-il à l’échange ?',
            options: [
              {
                text: 'L’AS détecte l’app malveillante par son empreinte binaire',
                explanation:
                  'Non — l’AS ne sait rien des binaires. Il ne vérifie qu’une chose : SHA-256(verifier présenté) == challenge enregistré.',
              },
              {
                text: 'invalid_grant : l’app ne peut pas fournir le code_verifier correspondant au challenge',
                correct: true,
                explanation:
                  'Oui (RFC 7636 §4.6) — le verifier n’a jamais quitté la vraie app. Le code volé est cryptographiquement orphelin.',
              },
              {
                text: 'L’échange réussit mais avec un scope réduit',
                explanation:
                  'Non — PKCE est binaire : correspondance ou rejet. Aucun mode dégradé.',
              },
            ],
          },
          {
            id: 'q3',
            question:
              'Pourquoi la validation de redirect_uri doit-elle être une correspondance EXACTE ?',
            options: [
              {
                text: 'Pour simplifier le code de l’AS',
                explanation:
                  'Non — c’est une exigence de sécurité : toute flexibilité (préfixe, wildcard, path traversal) a historiquement été exploitée pour détourner des codes.',
              },
              {
                text: 'Parce que toute correspondance approximative ouvre le détournement du code vers une URL contrôlée par l’attaquant',
                correct: true,
                explanation:
                  'Oui (RFC 9700 §4.1) — les attaques réelles ont exploité des wildcards de sous-domaines, des paramètres ajoutés, des chemins relatifs. Exact match ferme la classe entière.',
              },
              {
                text: 'Pour empêcher le CSRF du callback',
                explanation:
                  'Non — le CSRF passe par la VRAIE redirect_uri. C’est state/PKCE qui le traite (leçon précédente).',
              },
            ],
          },
          {
            id: 'q4',
            question: 'Contre quoi protège le paramètre iss de la RFC 9207 ?',
            options: [
              {
                text: 'Le vol de bearer token',
                explanation: 'Non — ça, c’est DPoP/mTLS (leçon suivante).',
              },
              {
                text: 'Le mix-up : un Client multi-AS qui enverrait code ou credentials au mauvais AS',
                correct: true,
                explanation:
                  'Oui — la réponse d’autorisation porte l’identité de l’AS émetteur, que le Client compare à l’AS qu’il croyait solliciter.',
              },
              {
                text: 'La réutilisation d’un authorization code',
                explanation:
                  'Non — l’usage unique du code est une obligation de l’AS (RFC 6749 §4.1.2).',
              },
            ],
          },
        ]}
      />
    </div>
  )
}
