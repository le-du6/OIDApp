import { Link } from '@tanstack/react-router'
import { Term } from '../../components/content/Term'
import { Callout } from '../../components/content/Callout'
import { Quiz } from '../../components/content/Quiz'
import { CompareTable } from '../../components/content/CompareTable'
import { VP_DISCLOSURES } from '../../data/fixtures/oid4vp'

/**
 * OID4VP — Chapitre 3 : la divulgation sélective en pratique. Ce qui part,
 * ce qui reste, et pourquoi la signature tient. Manipulation au Crypto Lab.
 */
export default function VpCh3() {
  return (
    <div className="lesson-prose">
      <p>
        La Phase 3 a montré la mécanique côté émission : des digests salés dans <code>_sd</code>,
        des <Term id="disclosure">disclosures</Term> à côté. Voici le moment où elle paie : à la
        présentation, le wallet n'envoie <strong>que les disclosures consenties</strong>. Notre
        fixture le fait pour de vrai — regardez ce qui part et ce qui reste :
      </p>

      <CompareTable
        caption="La présentation de la fixture : 2 claims révélés, 1 retenu"
        columns={['Claim', 'Décision', 'Ce que le Verifier peut en savoir']}
        rows={VP_DISCLOSURES.map((d) => ({
          label: d.name,
          cells: [
            { content: d.revealed ? String(d.value) : '(valeur non transmise)' },
            d.revealed
              ? { content: 'Révélé — disclosure jointe', verdict: 'good' as const }
              : { content: 'RETENU — disclosure absente', verdict: 'mid' as const },
            d.revealed
              ? { content: 'Vérifie : digest(disclosure) ∈ _sd ✓' }
              : { content: 'Un digest salé dans _sd — rien d’exploitable' },
          ],
        }))}
      />

      <h2>Pourquoi la signature tient</h2>
      <p>
        L'Issuer n'a signé que les <em>digests</em>. Retirer une disclosure ne modifie donc pas un
        seul octet du JWT signé : la signature reste valide, quelle que soit la sélection. Et le
        digest de <code>family_name</code>, resté seul dans <code>_sd</code>, ne révèle rien : le
        sel le rend imprévisible — impossible de tester « est-ce Martin ? » par force brute.
      </p>
      <Callout kind="note" title="À manipuler, vraiment">
        <p>
          La section « 🎭 Divulgation sélective » du{' '}
          <Link to="/labo-crypto" className="text-accent underline underline-offset-2">
            Crypto Lab
          </Link>{' '}
          vous met dans le rôle du wallet : cochez les claims à révéler, la présentation se
          construit sous vos yeux, chaque digest est recalculé et vérifié contre <code>_sd</code>,
          et le <Term id="sd-hash" /> de VOTRE sélection s'affiche — celui que le Key Binding JWT
          devra sceller (chapitre suivant).
        </p>
      </Callout>

      <h2>Les limites, dites honnêtement</h2>
      <p>
        La divulgation sélective protège les claims <em>non révélés</em> — pas davantage. Ce qui est
        révélé est révélé : un Verifier qui exige trop de claims reste un problème (d'où le cadrage
        des demandes, chapitre 1). Et le nombre de disclosures, la structure du credential, la
        signature elle-même sont visibles — des surfaces de corrélation dont hérite le chapitre
        unlinkability. Aucun mécanisme ne dispense de la question : « cette demande est-elle
        proportionnée ? »
      </p>

      <Quiz
        quizId="oid4vp/divulgation-selective/choisir-ses-claims"
        questions={[
          {
            id: 'q1',
            question: 'Pourquoi retirer une disclosure ne casse-t-il pas la signature ?',
            options: [
              {
                text: 'Parce que le Verifier re-signe la présentation',
                explanation:
                  'Non — le Verifier ne signe rien : il vérifie. La raison est structurelle.',
              },
              {
                text: 'Parce que l’Issuer n’a signé que les digests (_sd) : la sélection ne touche pas au JWT signé',
                correct: true,
                explanation:
                  'Oui — les disclosures voyagent HORS du jeton signé. Les retenir ou les joindre ne modifie pas ce que la signature couvre.',
              },
              {
                text: 'Parce que la signature est recalculée par le wallet',
                explanation:
                  'Non — le wallet ne peut pas signer à la place de l’Issuer ; il n’en a pas la clé. Et il n’en a pas besoin.',
              },
            ],
          },
          {
            id: 'q2',
            question: 'Que peut déduire le Verifier du digest de family_name (claim retenu) ?',
            options: [
              {
                text: 'La valeur, par force brute sur les noms courants',
                explanation:
                  'Non — c’est exactement ce que le SEL empêche : sans lui, tester « Martin » serait trivial. Avec : le digest est imprévisible.',
              },
              {
                text: 'Rien d’exploitable : le sel rend le digest imprévisible',
                correct: true,
                explanation:
                  'Oui — un digest salé non révélé est muet. (La PRÉSENCE d’un claim caché, elle, peut se voir — d’où les réflexions du chapitre unlinkability.)',
              },
              {
                text: 'Le type du claim, via le registre IANA',
                explanation:
                  'Non — le digest couvre [salt, nom, valeur] en bloc : même le NOM du claim retenu n’est pas lisible.',
              },
            ],
          },
          {
            id: 'q3',
            question: 'Contre quoi la divulgation sélective ne protège-t-elle PAS ?',
            options: [
              {
                text: 'Contre la lecture des claims non révélés',
                explanation: 'Si — c’est précisément ce qu’elle protège.',
              },
              {
                text: 'Contre un Verifier qui exige trop de claims — le problème devient la proportionnalité de la demande',
                correct: true,
                explanation:
                  'Oui — révélé = révélé. La minimisation technique doit s’accompagner d’un cadrage des demandes (gouvernance, chapitre 1) et du jugement de l’utilisateur.',
              },
              {
                text: 'Contre la falsification des claims révélés',
                explanation:
                  'Non, elle protège aussi cela — indirectement : un claim modifié ne matche plus son digest dans _sd, signé par l’Issuer.',
              },
            ],
          },
        ]}
      />
    </div>
  )
}
