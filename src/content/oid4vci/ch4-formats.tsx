import { Term } from '../../components/content/Term'
import { Callout } from '../../components/content/Callout'
import { Quiz } from '../../components/content/Quiz'
import { CompareTable } from '../../components/content/CompareTable'
import { JwtInspector } from '../../components/jwt/JwtInspector'
import { VCI_DISCLOSURES, VCI_SD_JWT } from '../../data/fixtures/oid4vci'

/**
 * OID4VCI — Chapitre 4 : les formats. SD-JWT VC (anatomie complète, avec la
 * fixture signée et ses vraies disclosures) et mdoc/mDL en contrepoint.
 */
export default function VciCh4() {
  return (
    <div className="lesson-prose">
      <p>
        OID4VCI est agnostique du format : il transporte des credentials, il n'en définit pas la
        forme. Deux formats dominent le monde EUDI : <Term id="sd-jwt-vc" /> (l'héritier direct de
        tout ce que vous savez sur les JWT) et <Term id="mdoc" /> (l'héritier du permis de conduire
        mobile ISO). Commençons par disséquer un vrai SD-JWT VC — celui émis dans les scénarios de
        ce module.
      </p>

      <div className="not-prose my-6">
        <JwtInspector
          label="SD-JWT VC — la partie JWT signée par l'Issuer"
          jwt={VCI_SD_JWT}
          note="Regardez le payload : vct (le type), cnf.jwk (la clé du wallet)… et _sd : trois hachages à la place des claims. given_name, family_name et birthdate ne sont PAS dans le jeton signé."
        />
      </div>

      <h2>Où sont passés les claims ? Les disclosures</h2>
      <p>
        C'est le cœur de <Term id="sd-jwt" /> : chaque claim cachable est remplacé, dans le jeton
        signé, par le digest SHA-256 d'une <Term id="disclosure" /> — le triplet{' '}
        <code>[salt, nom, valeur]</code> encodé en base64url. Les disclosures voyagent À CÔTÉ du
        jeton (<code>&lt;jwt&gt;~&lt;disclosure&gt;~…~</code>). En voici les vraies, celles dont les
        digests figurent dans le <code>_sd</code> ci-dessus :
      </p>

      <CompareTable
        caption="Les disclosures de la fixture — vérifiables contre _sd"
        columns={['Claim', 'Valeur', 'Digest (dans _sd)']}
        rows={VCI_DISCLOSURES.map((d) => ({
          label: d.name,
          cells: [
            { content: String(d.value) },
            { content: `[${d.salt.slice(0, 12)}…, ${d.name}, …]` },
            { content: `${d.digest.slice(0, 22)}…`, verdict: 'good' },
          ],
        }))}
      />

      <p>
        Le sel rend chaque digest imprévisible : sans lui, un Verifier pourrait tester par force
        brute (« le digest correspond-il à birthdate=1990-01-01 ? »). Révéler une disclosure permet
        de vérifier le claim (recalculer le digest, le chercher dans <code>_sd</code>) ; la retenir
        le garde secret — <em>sans jamais toucher à la signature de l'Issuer</em>. La manipulation
        complète (choisir ses claims, recalculer les hachages) arrive au Crypto Lab en Phase 4, avec
        la présentation.
      </p>
      <Callout kind="spec" specRef="draft-ietf-oauth-sd-jwt-vc" title="Dans la spec — typ et vct">
        <p>
          Le header <code>typ</code> vaut <code>dc+sd-jwt</code> — renommé depuis{' '}
          <code>vc+sd-jwt</code> en novembre 2024, les implémentations acceptant les deux en
          transition : un exemple concret de spec encore mouvante. <Term id="vct" /> est REQUIRED :
          c'est l'identifiant du TYPE de credential, résistant aux collisions.
        </p>
      </Callout>

      <h2>mdoc/mDL : l'autre pilier</h2>
      <p>
        Le second format EUDI vient d'ailleurs : <Term id="mdoc" /> est défini par l'ISO/IEC 18013-5
        pour le permis de conduire mobile (mDL). Encodage binaire CBOR, signatures COSE, claims
        organisés par <code>doctype</code> (ex. <code>org.iso.18013.5.1.mDL</code>) et namespaces,
        divulgation sélective par valeurs hachées elle aussi — la même idée, dans une autre culture
        technique (celle de la proximité : NFC, Bluetooth, présentation hors ligne au contrôle
        routier). Dans OID4VCI, son Format Identifier est <code>mso_mdoc</code>.
      </p>

      <CompareTable
        caption="SD-JWT VC vs mdoc — deux cultures, une idée"
        columns={['Axe', 'SD-JWT VC', 'mdoc (ISO 18013-5)']}
        rows={[
          {
            label: 'Encodage',
            cells: [
              { content: 'JSON / base64url — l’écosystème JWT', verdict: 'good' },
              { content: 'CBOR / COSE — compact, binaire', verdict: 'good' },
            ],
          },
          {
            label: 'Type de credential',
            cells: [{ content: 'vct (URL)' }, { content: 'doctype + namespaces' }],
          },
          {
            label: 'Divulgation sélective',
            cells: [
              { content: 'Disclosures salées + _sd', verdict: 'good' },
              { content: 'Digests salés dans le MSO', verdict: 'good' },
            ],
          },
          {
            label: 'Terrain de prédilection',
            cells: [
              { content: 'Web, API, écosystème OAuth/OIDC', verdict: 'good' },
              { content: 'Proximité (NFC/BLE), contrôle hors ligne', verdict: 'good' },
            ],
          },
          {
            label: 'Identifiant OID4VCI',
            cells: [{ content: 'dc+sd-jwt' }, { content: 'mso_mdoc' }],
          },
        ]}
      />

      <Quiz
        quizId="oid4vci/formats/sd-jwt-vc-mdoc"
        questions={[
          {
            id: 'q1',
            question: 'Où se trouvent given_name et birthdate dans un SD-JWT VC ?',
            options: [
              {
                text: 'Dans le payload du JWT, comme des claims normaux',
                explanation:
                  'Non — c’est toute l’astuce : le payload signé ne contient que leurs digests salés, dans _sd.',
              },
              {
                text: 'Dans les disclosures, hors du JWT signé — seuls leurs digests salés sont dans _sd',
                correct: true,
                explanation:
                  'Oui — format compact <jwt>~<disclosure>~…~. Révéler ou retenir une disclosure ne touche pas la signature.',
              },
              {
                text: 'Chiffrés dans la signature',
                explanation:
                  'Non — une signature ne contient pas de données ; elle atteste. Et rien n’est chiffré ici.',
              },
            ],
          },
          {
            id: 'q2',
            question: 'À quoi sert le salt dans une disclosure ?',
            options: [
              {
                text: 'À empêcher la force brute sur les digests (deviner une valeur et tester son hash)',
                correct: true,
                explanation:
                  'Oui — sans sel, « birthdate »=« 1990-01-01 » se testerait en une opération. Le sel rend chaque digest imprévisible.',
              },
              {
                text: 'À chiffrer la valeur du claim',
                explanation:
                  'Non — rien n’est chiffré : la disclosure révélée est en clair. Le sel protège les claims NON révélés.',
              },
              {
                text: 'À signer la disclosure',
                explanation:
                  'Non — la disclosure n’est pas signée individuellement ; c’est son digest, présent dans le JWT signé, qui l’authentifie.',
              },
            ],
          },
          {
            id: 'q3',
            question: 'Pourquoi le monde EUDI retient-il DEUX formats ?',
            options: [
              {
                text: 'Par indécision du législateur',
                explanation:
                  'Non — les deux formats répondent à des terrains différents, et coexistent à dessein.',
              },
              {
                text: 'SD-JWT VC pour l’écosystème web/OAuth, mdoc pour la proximité et l’héritage ISO (mDL)',
                correct: true,
                explanation:
                  'Oui — même idée (divulgation sélective par digests salés), deux cultures techniques complémentaires.',
              },
              {
                text: 'mdoc est destiné à remplacer SD-JWT VC à terme',
                explanation:
                  'Non — aucun des deux n’est annoncé comme transitoire ; l’ARF les référence tous les deux.',
              },
            ],
          },
        ]}
      />
    </div>
  )
}
