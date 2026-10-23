import { quizBank } from '../../data/quiz-bank'
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
        le module OID4VCI a montré la mécanique côté émission : des digests salés dans{' '}
        <code>_sd</code>, des <Term id="disclosure">disclosures</Term> à côté. Voici le moment où
        elle paie : à la présentation, le wallet n'envoie{' '}
        <strong>que les disclosures consenties</strong>. Notre fixture le fait pour de vrai —
        regardez ce qui part et ce qui reste :
      </p>

      <CompareTable
        caption="La présentation de la fixture : 2 claims révélés, 1 retenu"
        rowHeading="Claim"
        columns={['Valeur transmise', 'Décision', 'Contrôle du Verifier']}
        rows={VP_DISCLOSURES.map((d) => ({
          label: d.name,
          cells: [
            { content: d.revealed ? String(d.value) : '(valeur non transmise)' },
            d.revealed
              ? { content: 'Révélé — disclosure jointe' }
              : { content: 'RETENU — disclosure absente' },
            d.revealed
              ? { content: 'Vérifie : digest(disclosure) présent dans _sd' }
              : { content: 'Valeur cachée, mais digest stable potentiellement corrélable' },
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
          La section « Divulgation sélective » du{' '}
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
        questions={quizBank['oid4vp/divulgation-selective/choisir-ses-claims']!}
      />
    </div>
  )
}
