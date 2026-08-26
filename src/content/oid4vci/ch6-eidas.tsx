import { Term } from '../../components/content/Term'
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
        Tout ce module pourrait sembler prospectif — il ne l'est pas. Le règlement européen{' '}
        <strong>eIDAS 2.0</strong> (règlement (UE) 2024/1183, en vigueur depuis mai 2024) impose à
        chaque État membre de proposer un <Term id="eudi-wallet" /> à ses citoyens. Et les
        protocoles retenus pour le faire fonctionner sont précisément ceux de ce cours : OID4VCI
        pour l'émission, OID4VP pour la présentation, les formats <Term id="sd-jwt-vc" /> et{' '}
        <Term id="mdoc" />.
      </p>

      <h2>La carte des concepts</h2>
      <CompareTable
        caption="Vocabulaire eIDAS 2.0 ↔ concepts du cours"
        columns={['Terme eIDAS/EUDI', 'Ce que c’est', 'Chapitre correspondant']}
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
        Le choix du modèle triangle n'est pas qu'un goût d'architecte : le règlement exige que
        l'utilisateur garde le contrôle de ses données, et — point directement relié à notre
        chapitre 0 — que l'usage du wallet ne permette pas de tracer l'utilisateur. La
        non-traçabilité par l'émetteur (l'anti « <Term id="phone-home" /> ») et la divulgation
        sélective ne sont pas des options techniques : ce sont des exigences juridiques auxquelles
        l'architecture répond.
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
        questions={[
          {
            id: 'q1',
            question: 'Quel texte fonde l’EUDI Wallet ?',
            options: [
              {
                text: 'Le règlement (UE) 2024/1183 — eIDAS 2.0',
                correct: true,
                explanation:
                  'Oui — il amende eIDAS (910/2014) et impose à chaque État membre de proposer un wallet d’identité numérique.',
              },
              {
                text: 'Le RGPD',
                explanation:
                  'Non — le RGPD encadre les données personnelles en général ; le wallet relève d’eIDAS 2.0 (qui s’y articule).',
              },
              {
                text: 'La spécification OID4VCI elle-même',
                explanation:
                  'Non — OID4VCI est un protocole (OpenID Foundation) ; l’obligation vient du règlement européen, qui le référence via l’ARF.',
              },
            ],
          },
          {
            id: 'q2',
            question: 'Qu’est-ce que le PID ?',
            options: [
              {
                text: 'Le composant matériel qui garde les clés',
                explanation: 'Non — ça, c’est le WSCD. Le PID est une donnée, pas un composant.',
              },
              {
                text: 'L’attestation d’identité de base du citoyen, émise dans le wallet',
                correct: true,
                explanation:
                  'Oui — Person Identification Data : concrètement un credential (SD-JWT VC ou mdoc) émis via OID4VCI.',
              },
              {
                text: 'Le protocole de présentation',
                explanation: 'Non — la présentation, c’est OID4VP (Phase 4).',
              },
            ],
          },
          {
            id: 'q3',
            question:
              'Pourquoi la non-traçabilité par l’émetteur est-elle centrale dans eIDAS 2.0 ?',
            options: [
              {
                text: 'C’est une optimisation de performance',
                explanation:
                  'Non — la motivation est juridique et de protection de la vie privée, pas technique.',
              },
              {
                text: 'C’est une exigence du règlement, à laquelle l’architecture triangle répond structurellement',
                correct: true,
                explanation:
                  'Oui — l’anti « phone home » du chapitre 0 n’est pas un bonus : c’est ce que le texte exige, et ce que le découplage émission/présentation fournit.',
              },
              {
                text: 'Parce que les IdP nationaux ont été supprimés',
                explanation:
                  'Non — les schémas d’identification existants perdurent ; le wallet ajoute un modèle où l’émetteur ne voit pas les usages.',
              },
            ],
          },
        ]}
      />
    </div>
  )
}
