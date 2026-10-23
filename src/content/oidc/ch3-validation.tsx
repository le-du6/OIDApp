import { quizBank } from '../../data/quiz-bank'
import { Link } from '@tanstack/react-router'
import { Term } from '../../components/content/Term'
import { Callout } from '../../components/content/Callout'
import { Quiz } from '../../components/content/Quiz'
import { ScenarioLoader } from '../../components/sequence/AttackScenario'

/**
 * OIDC — Chapitre 3 : valider un ID Token (§3.1.3.7). L'étape qui transforme
 * un JWT reçu du réseau en identité de confiance. Renvoi au Crypto Lab.
 */
export default function OidcCh3() {
  return (
    <div className="lesson-prose">
      <p>
        Le RP doit valider un ID Token avant de l'accepter. Core §3.1.3.7 liste treize points, dont
        plusieurs sont conditionnels. Le diagramme regroupe les contrôles de notre exemple ES256 ;
        la liste ci-dessous conserve leur ordre normatif.
      </p>

      <div className="not-prose my-6">
        <ScenarioLoader scenarioId="oidc/idtoken-validation" />
      </div>

      <h2>La signature ne suffit jamais</h2>
      <p>
        L'erreur la plus commune : « j'ai vérifié la signature, donc je fais confiance ». La{' '}
        <Term id="jws">signature</Term> prouve deux choses — le jeton vient bien de l'OP, et il n'a
        pas été modifié. Elle ne dit rien de <em>pour qui</em> il a été émis (<code>aud</code>), ni
        s'il est <em>frais</em> (<code>exp</code>, <code>nonce</code>). C'est pourquoi
        l'anti-pattern du chapitre 0 échoue dès le contrôle d'audience, signature valide ou non.
      </p>

      <Callout
        kind="spec"
        specRef="OIDC Core 1.0 §3.1.3.7"
        title="Dans la spec — les contrôles clés"
      >
        <p>
          Dans notre exemple ES256, la clé vient du JWKS de l'OP attendu et kid la sélectionne. Le
          RP contrôle également issuer, audience, expiration et nonce lorsqu'il a été envoyé. Core
          décrit aussi les branches chiffrement, MAC et extensions dans la liste ci-dessous ; elles
          ne sont pas toutes exécutées par cette démonstration.
        </p>
      </Callout>

      <h2>at_hash : le contrôle qu'on oublie</h2>
      <p>
        En code flow, at_hash est optionnel au token endpoint, et son utilisation pour contrôler
        l'access token est permise par §3.1.3.8. Notre exemple le calcule avec SHA-256 car il
        utilise ES256. Les flows Implicit et Hybrid ont d'autres conditions de présence et de
        contrôle ; le chapitre des liaisons les distingue.
      </p>

      <Callout kind="note" title="À manipuler dans le Crypto Lab">
        <p>
          La vérification de signature et le calcul d'at_hash ne sont pas des abstractions : la
          section de vérification ES256 d’un ID Token du{' '}
          <Link to="/labo-crypto" className="text-accent underline underline-offset-2">
            Crypto Lab
          </Link>{' '}
          récupère la clé du JWKS par son <code>kid</code>, vérifie la vraie fixture en ES256, et
          vous laisse <strong>altérer un claim</strong> pour voir la vérification échouer. Rien de
          plus convaincant que de casser la signature soi-même.
        </p>
      </Callout>

      <details>
        <summary>Les treize points de Core §3.1.3.7, avec leurs conditions</summary>
        <ol>
          <li>
            Déchiffrer si le jeton est chiffré ; s’il ne l’est pas alors que le chiffrement était
            négocié, rejet recommandé.
          </li>
          <li>Comparer exactement iss à l’OP attendu.</li>
          <li>
            Vérifier que aud contient le client_id et aucune audience additionnelle non approuvée.
          </li>
          <li>Si une extension utilise azp, vérifier sa valeur selon cette extension (SHOULD).</li>
          <li>Ce contrôle peut inclure la comparaison azp/client_id (SHOULD dans ce cas).</li>
          <li>
            Vérifier la signature avec les clés de l’Issuer. Core permet de substituer la validation
            TLS du serveur à ce contrôle pour la réception directe au token endpoint ; le cours
            choisit la signature.
          </li>
          <li>
            Contrôler l’algorithme attendu : RS256 par défaut ou valeur négociée ; notre fixture
            utilise ES256.
          </li>
          <li>
            Pour un MAC HS256/384/512, utiliser le client_secret en UTF-8 ; comportement non
            spécifié si aud est multivalué.
          </li>
          <li>Contrôler que le temps courant précède exp.</li>
          <li>Utiliser iat selon la fenêtre de fraîcheur choisie par le client.</li>
          <li>
            Si nonce a été envoyé, exiger la même valeur dans le jeton ; contrôler le rejeu selon la
            politique du client.
          </li>
          <li>Si acr a été demandé, vérifier que sa valeur convient (SHOULD).</li>
          <li>
            Si auth_time a été demandé ou max_age utilisé, vérifier l’âge de l’authentification et
            demander une réauthentification si nécessaire (SHOULD).
          </li>
        </ol>
      </details>
      <p>
        Décoder, vérifier une signature, valider le profil et accepter une connexion sont quatre
        opérations distinctes. Le laboratoire ES256 démontre une primitive et le calcul d’at_hash ;
        il ne remplace pas un validateur OIDC général.
      </p>
      <Quiz
        quizId="oidc/validation/jwks-kid-verify"
        questions={quizBank['oidc/validation/jwks-kid-verify']!}
      />
    </div>
  )
}
