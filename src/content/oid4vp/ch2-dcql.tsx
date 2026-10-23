import { quizBank } from '../../data/quiz-bank'
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
        DCQL décrit les credentials et les claims demandés dans dcql_query. OID4VP 1.0 l'utilise
        comme langage de requête ; des scopes convenus peuvent aussi référencer une demande (§5.5).
        Les exemples de Presentation Exchange appartiennent à d'autres versions ou profils.
      </p>

      <CodeBlock
        lang="json"
        title="DCQL commenté — extrait pédagogique, commentaires à retirer en JSON"
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
        — le type de credential attendu (le <Term id="vct" /> du module OID4VCI) ; côté mdoc, on
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

      <h2>Conservation déclarée pour mdoc</h2>
      <CodeBlock
        lang="json"
        title="Claims Query mdoc : intent_to_retain (OID4VP annexe B.2.4)"
        code={JSON.stringify(
          {
            credentials: [
              {
                id: 'permis',
                format: 'mso_mdoc',
                meta: { doctype_value: 'org.iso.18013.5.1.mDL' },
                claims: [{ path: ['org.iso.18013.5.1', 'family_name'], intent_to_retain: false }],
              },
            ],
          },
          null,
          2,
        )}
      />
      <p>
        Ce paramètre optionnel exprime l’intention de conservation pour mdoc. Il ne s’applique pas
        ici aux Claims Queries SD-JWT et n’empêche techniquement aucune copie. Le wallet peut en
        informer l’utilisateur.
      </p>
      <h2>Demander, sélectionner, accepter</h2>
      <p>
        Le wallet sélectionne des credentials adaptés à DCQL. Le Verifier doit ensuite contrôler la
        réponse par rapport à cette demande, établir la confiance dans l’Issuer, valider la
        cryptographie et appliquer sa politique. Un filtre trusted_authorities ne réalise pas ces
        vérifications à sa place.
      </p>
      <Quiz
        quizId="oid4vp/dcql/langage-requete"
        questions={quizBank['oid4vp/dcql/langage-requete']!}
      />
    </div>
  )
}
