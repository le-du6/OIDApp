import { Term } from '../../components/content/Term'
import { Callout } from '../../components/content/Callout'
import { Quiz } from '../../components/content/Quiz'
import { CodeBlock } from '../../components/content/CodeBlock'

/**
 * OID4VP — Chapitre 2 : DCQL. Demander au claim près, exiger l'origine,
 * exprimer des alternatives.
 */
export default function VpCh2() {
  return (
    <div className="lesson-prose">
      <p>
        Comment un Verifier dit-il « je veux le prénom et la date de naissance, d'une attestation
        d'identité, émise par une autorité que je reconnais » ? Avec un <Term id="scope" /> OAuth2 —
        impossible : trop grossier. La 1.0 définit <Term id="dcql" />, un langage de requête JSON
        transporté dans le paramètre <code>dcql_query</code>, qui a entièrement remplacé l'ancien
        Presentation Exchange.
      </p>

      <CodeBlock
        lang="json"
        title="Une requête DCQL complète, annotée par l'exemple"
        code={`{
  "credentials": [
    {
      "id": "identite",                    // ← clé que reprendra le vp_token
      "format": "dc+sd-jwt",               // format exigé (ou mso_mdoc…)
      "meta": {
        "vct_values": ["https://credentials.example/identity_credential"]
      },
      "claims": [
        { "path": ["given_name"] },        // au claim près
        { "path": ["birthdate"] }
      ],
      "trusted_authorities": [
        { "type": "aki", "values": ["s9tIpP…"] }   // n'accepter QUE ces émetteurs
      ]
    }
  ],
  "credential_sets": [
    { "options": [["identite"]], "required": true }
  ]
}`}
      />

      <h2>Ce que chaque bloc apporte</h2>
      <p>
        <strong>
          <code>claims[].path</code>
        </strong>{' '}
        — la minimisation commence dans la requête : on demande des claims précis, pas « le
        credential entier ». Le chemin navigue dans la structure (
        <code>["address", "locality"]</code> pour un claim imbriqué).
      </p>
      <p>
        <strong>
          <code>meta.vct_values</code>
        </strong>{' '}
        — le type de credential attendu (le <Term id="vct" /> de la Phase 3) ; côté mdoc, on
        filtrerait par <code>doctype_value</code>.
      </p>
      <p>
        <strong>
          <code>trusted_authorities</code>
        </strong>{' '}
        — n'accepter que certains émetteurs, désignés par type : <code>aki</code> (Authority Key
        Identifier du certificat émetteur), <code>etsi_tl</code> (listes de confiance ETSI — le
        monde eIDAS), ou <code>openid_federation</code>. Le filtre d'origine s'exprime DANS la
        requête, et le wallet peut en tenir compte avant même de proposer un credential.
      </p>
      <p>
        <strong>
          <code>credential_sets</code>
        </strong>{' '}
        — les alternatives : « (permis de conduire) OU (attestation d'identité + justificatif de
        domicile) ». Chaque option est une liste d'ids ; le wallet satisfait celle qu'il peut.
      </p>
      <Callout kind="spec" specRef="OID4VP 1.0 §6" title="Dans la spec">
        <p>
          À noter aussi : <code>multiple</code> (accepter plusieurs credentials pour une même
          query), <code>claim_sets</code> (alternatives au niveau des claims), et{' '}
          <code>require_cryptographic_holder_binding</code> (défaut <code>true</code> — exiger que
          la présentation soit liée au détenteur, le sujet du chapitre Key Binding).
        </p>
      </Callout>

      <Quiz
        quizId="oid4vp/dcql/langage-requete"
        questions={[
          {
            id: 'q1',
            question: 'Pourquoi DCQL plutôt qu’un scope OAuth2 ?',
            options: [
              {
                text: 'Les scopes sont interdits dans OID4VP',
                explanation:
                  'Non — la raison est fonctionnelle : il faut exprimer format, type, claims précis, émetteurs de confiance, alternatives. Un scope ne porte rien de tout ça.',
              },
              {
                text: 'Il faut demander au claim près, filtrer par type/format/émetteur et exprimer des alternatives — granularité hors de portée d’un scope',
                correct: true,
                explanation:
                  'Oui — même logique que RAR au chapitre 7 d’OAuth2 : quand la demande devient structurée, il faut un langage structuré.',
              },
              {
                text: 'Pour la compatibilité avec Presentation Exchange',
                explanation:
                  'Non — au contraire : DCQL a REMPLACÉ Presentation Exchange dans la 1.0 finale.',
              },
            ],
          },
          {
            id: 'q2',
            question: 'À quoi sert trusted_authorities ?',
            options: [
              {
                text: 'À chiffrer la réponse pour certaines autorités',
                explanation: 'Non — le chiffrement relève de direct_post.jwt, pas de DCQL.',
              },
              {
                text: 'À n’accepter que les credentials émis par certains émetteurs (aki, etsi_tl, openid_federation)',
                correct: true,
                explanation:
                  'Oui — le filtre d’origine est exprimé dans la requête ; le type etsi_tl branche directement le monde des listes de confiance eIDAS.',
              },
              {
                text: 'À authentifier le Verifier',
                explanation:
                  'Non — l’identification du Verifier passe par les Client Identifier Prefixes (chapitre précédent).',
              },
            ],
          },
          {
            id: 'q3',
            question: 'Comment exprimer « permis de conduire OU (identité + domicile) » ?',
            options: [
              {
                text: 'Avec credential_sets : options = [[permis], [identite, domicile]]',
                correct: true,
                explanation:
                  'Oui — chaque option est une liste d’ids de credential queries ; le wallet satisfait l’une d’elles.',
              },
              {
                text: 'En envoyant deux requêtes DCQL successives',
                explanation:
                  'Non — les alternatives s’expriment dans UNE requête ; le wallet choisit en une passe, avec l’utilisateur.',
              },
              {
                text: 'Ce n’est pas exprimable en DCQL',
                explanation: 'Si — c’est exactement le rôle de credential_sets (§6).',
              },
            ],
          },
        ]}
      />
    </div>
  )
}
