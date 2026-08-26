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
          Le Client DOIT implémenter une protection CSRF sur sa redirect_uri, typiquement via{' '}
          <code>state</code>, dont la valeur DOIT être non devinable et liée à l'état de la session
          de l'agent utilisateur. Notez le « DOIT » : ce paramètre optionnel en syntaxe est
          obligatoire en sécurité.
        </p>
      </Callout>
      <Callout kind="security" title="state, et après ?">
        <p>
          Le Security BCP (<span className="font-mono text-xs">RFC 9700 §2.1</span>) note que{' '}
          <Term id="pkce" /> couvre aussi ce cas : le <Term id="code-verifier" /> est lui-même lié à
          la session qui a démarré le flow — un code étranger échouera à l'échange. Avec PKCE
          généralisé, state redevient ce qu'il était aussi : un simple porteur d'état applicatif
          (URL de retour…). Mais la leçon reste :{' '}
          <strong>
            toute réponse arrivant en front channel doit être liée à la requête qui l'a provoquée
          </strong>
          .
        </p>
      </Callout>

      <Quiz
        quizId="oauth2/attaques/csrf-state"
        questions={[
          {
            id: 'q1',
            question: 'Dans le CSRF du callback, quel code arrive chez le Client ?',
            options: [
              {
                text: 'Un code volé à la victime',
                explanation:
                  'Non — rien n’est volé à la victime : c’est le code de l’ATTAQUANT, obtenu légitimement avec son propre compte.',
              },
              {
                text: 'Le code de l’attaquant, émis pour SON compte, jamais consommé',
                correct: true,
                explanation:
                  'Oui — toute l’astuce est là : faire consommer ce code par la session de la victime, pour lier son compte aux ressources de l’attaquant.',
              },
              {
                text: 'Un code forgé, cryptographiquement invalide',
                explanation:
                  'Non — le code est parfaitement valide. Aucune crypto n’est cassée dans cette attaque : c’est le LIEN à la session qui manque.',
              },
            ],
          },
          {
            id: 'q2',
            question: 'Pourquoi l’attaquant ne peut-il pas fournir un state correct ?',
            options: [
              {
                text: 'Parce que le state est chiffré par l’AS',
                explanation:
                  'Non — l’AS renvoie le state TEL QUEL, sans même le comprendre. Sa force est ailleurs.',
              },
              {
                text: 'Parce qu’il est imprévisible ET lié à la session de la victime, stocké dans un cookie qu’il ne peut pas lire',
                correct: true,
                explanation:
                  'Oui — deux propriétés conjointes : non devinable (CSPRNG) et non réutilisable (lié au cookie de session de l’autre navigateur).',
              },
              {
                text: 'Parce que l’AS bloque les requêtes de son adresse IP',
                explanation:
                  'Non — l’AS ne voit rien d’anormal dans toute cette attaque. La défense est entièrement côté Client.',
              },
            ],
          },
          {
            id: 'q3',
            question: 'Où l’attaque échoue-t-elle exactement, avec state ?',
            options: [
              {
                text: 'Au token endpoint : l’AS refuse l’échange',
                explanation:
                  'Non — on n’arrive jamais jusque-là : le Client rejette AVANT, donc le code n’est même pas présenté à l’AS.',
              },
              {
                text: 'Au callback : state reçu ≠ state de la session, le Client rejette sans échanger',
                correct: true,
                explanation:
                  'Oui — c’est une vérification purement locale au Client, avant tout appel réseau. Économique et décisive.',
              },
              {
                text: 'Chez l’AS, à l’émission du code',
                explanation:
                  'Non — l’émission du code pour l’attaquant est légitime : c’est son compte, son consentement.',
              },
            ],
          },
        ]}
      />
    </div>
  )
}
