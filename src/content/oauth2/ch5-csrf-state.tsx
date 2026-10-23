import { quizBank } from '../../data/quiz-bank'
import { Term } from '../../components/content/Term'
import { Callout } from '../../components/content/Callout'
import { Quiz } from '../../components/content/Quiz'
import { AttackScenario } from '../../components/sequence/AttackScenario'

/**
 * Chapitre 5, leçon 1 — CSRF sur le callback → state.
 * Première attaque jouable : le récit motive la contre-mesure.
 */
export default function Ch5CsrfState() {
  return (
    <div className="lesson-prose">
      <p>
        Méthode de ce chapitre, appliquée à chaque leçon : on prend le flow du chapitre 3, on le
        casse pour de vrai, puis on introduit la contre-mesure et on <em>rejoue la même attaque</em>{' '}
        contre le flow protégé. Première cible : le callback.
      </p>

      <h2>L'attaque : faire finir son flow par quelqu'un d'autre</h2>
      <p>
        Relisez l'étape « callback » du chapitre 3 : le Client reçoit{' '}
        <code>GET /callback?code=…</code> et échange le code. Question qu'un Client naïf ne se pose
        jamais : <strong>ce code correspond-il à un flow que CE navigateur a démarré ?</strong> Un{' '}
        <Term id="csrf" /> exploite exactement ce vide : l'attaquant démarre un flow avec{' '}
        <em>son</em> compte, garde son code sous le coude, et le fait livrer au Client par le
        navigateur de la victime — cookies de session de la victime inclus.
      </p>
      <p>
        Résultat : le compte PhotoPrint de la victime est lié aux ressources de l'attaquant. Selon
        le service, ça veut dire : les fichiers qu'elle téléverse atterrissent chez lui, le moyen de
        paiement « enregistré » est le sien, l'agenda synchronisé est le sien. Jouez l'attaque, puis
        basculez sur l'onglet protégé :
      </p>

      <div className="not-prose my-6">
        <AttackScenario attackId="oauth2/csrf-attack" protectedId="oauth2/csrf-protected" />
      </div>

      <h2>La contre-mesure : state</h2>
      <p>
        Le <Term id="state" /> est d'une simplicité désarmante : une valeur imprévisible, générée au
        démarrage du flow, associée à la session du navigateur (cookie), renvoyée telle quelle par
        l'AS, comparée au retour. Le code de l'attaquant arrive forcément sans le bon state —
        l'attaquant ne peut ni le deviner (CSPRNG), ni le lire (cookie d'un autre domaine). Rejet,
        fin de l'attaque, avant même le token endpoint.
      </p>
      <Callout kind="spec" specRef="RFC 6749 §10.12" title="Dans la spec">
        <p>
          La protection CSRF est obligatoire. state est un moyen classique : valeur imprévisible,
          liée à la session et comparée au retour. RFC 9700 §2.1 permet aussi de s'appuyer sur PKCE
          si son support par l'AS est assuré, ou sur nonce en OIDC avec les contrôles requis. Cela
          ne rend pas state universellement obligatoire.
        </p>
      </Callout>
      <Callout kind="security" title="state, et après ?">
        <p>
          PKCE doit être lié à la transaction de ce navigateur et son support par l'AS vérifié. Avec
          ces conditions, il peut fournir une protection CSRF. state peut toujours servir à la
          corrélation et à retrouver un état applicatif stocké localement ; ne pas y placer
          directement des secrets ou une URL de retour non contrôlée.
        </p>
      </Callout>

      <Quiz
        quizId="oauth2/attaques/csrf-state"
        questions={quizBank['oauth2/attaques/csrf-state']!}
      />
    </div>
  )
}
