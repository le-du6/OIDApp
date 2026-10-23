import { quizBank } from '../../data/quiz-bank'
import { Callout } from '../../components/content/Callout'
import { Quiz } from '../../components/content/Quiz'
import { CompareTable } from '../../components/content/CompareTable'

/**
 * OID4VCI — Chapitre 6 : le contexte eIDAS 2.0 / EUDI Wallet. Où tout ce
 * qu'on vient d'apprendre devient obligation réglementaire européenne.
 */
export default function VciCh6() {
  return (
    <div className="lesson-prose">
      <p>
        Le cadre européen eIDAS révisé par le règlement (UE) 2024/1183 organise les portefeuilles
        européens d'identité numérique. Les protocoles d'émission et de présentation, les formats et
        les profils techniques sont des couches distinctes des obligations réglementaires. Cette
        leçon situe leur vocabulaire ; elle ne démontre pas une conformité juridique ou une
        certification EUDI.
      </p>

      <h2>La carte des concepts</h2>
      <CompareTable
        caption="Vocabulaire eIDAS 2.0 ↔ concepts du cours"
        rowHeading="Terme eIDAS/EUDI"
        columns={['Sens', 'Lien avec le cours', 'Chapitre']}
        rows={[
          {
            label: 'EUDI Wallet',
            cells: [
              { content: 'Le wallet fourni/reconnu par chaque État membre' },
              { content: 'Le Holder/Wallet du triangle', verdict: 'good' },
              { content: 'Module entier' },
            ],
          },
          {
            label: 'PID (Person Identification Data)',
            cells: [
              { content: 'L’attestation d’identité de base (nom, naissance…)' },
              { content: 'Un credential SD-JWT VC / mdoc', verdict: 'good' },
              { content: 'Chapitre formats' },
            ],
          },
          {
            label: 'QEAA / EAA',
            cells: [
              { content: 'Attestations (qualifiées ou non) d’attributs : diplôme, permis…' },
              {
                content: 'Des credentials émis par des Issuers (qualifiés ou non)',
                verdict: 'good',
              },
              { content: 'Chapitres offer/flows' },
            ],
          },
          {
            label: 'WSCD',
            cells: [
              { content: 'Le composant sécurisé qui garde les clés du wallet' },
              { content: 'La cible de la key attestation', verdict: 'good' },
              { content: 'Chapitre key attestation' },
            ],
          },
          {
            label: 'ARF',
            cells: [
              { content: 'Architecture and Reference Framework : le cadre technique commun' },
              {
                content: 'Le document qui profile OID4VCI/VP + formats pour l’UE',
                verdict: 'good',
              },
              { content: '—' },
            ],
          },
        ]}
      />

      <h2>Pourquoi le wallet, réglementairement ?</h2>
      <p>
        La protection des données et le contrôle de l'utilisateur guident les choix d'architecture.
        Divulgation sélective, prévention du traçage, statut et gouvernance doivent être évalués
        ensemble. Employer OID4VCI et OID4VP ne suffit pas à établir ces garanties ni leur
        conformité réglementaire.
      </p>
      <Callout kind="note" title="Là où il faut rester vigilant">
        <p>
          Le cadre bouge encore : actes d'exécution, versions successives de l'ARF, certification
          des wallets et des WSCD. Ce cours fixe ses versions de référence (en tête de module) et se
          concentre sur les invariants — le triangle, la preuve de possession, la divulgation
          sélective — qui, eux, sont stables. Pour le détail réglementaire du moment, la source fait
          foi, pas les résumés.
        </p>
      </Callout>

      <Quiz
        quizId="oid4vci/eidas/contexte-eudi"
        questions={quizBank['oid4vci/eidas/contexte-eudi']!}
      />
    </div>
  )
}
