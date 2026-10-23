import { quizBank } from '../../data/quiz-bank'
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
        rowHeading="Claim"
        columns={['Valeur', 'Disclosure (extrait décodé)', 'Digest (extrait de _sd)']}
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
        complète (choisir ses claims, recalculer les hachages) arrive au Crypto Lab dans le module
        OID4VP, avec la présentation.
      </p>
      <Callout kind="spec" specRef="draft-ietf-oauth-sd-jwt-vc" title="Dans la spec — typ et vct">
        <p>
          Le header typ actuel vaut dc+sd-jwt. vc+sd-jwt est l'ancienne valeur. Le draft 13
          conseillait une double acceptation transitoire ; le draft 19 a retiré cette note. Ne pas
          en déduire une obligation permanente. vct identifie le type de credential et doit être
          résistant aux collisions.
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
        columns={['SD-JWT VC', 'mdoc (ISO 18013-5)']}
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

      <h2>Deux manières de lier la présentation à une clé</h2>
      <p>
        Pour notre SD-JWT VC, l’Issuer signe <code>cnf.jwk</code>, puis le wallet signe un KB-JWT.
        Pour mdoc, la clé du device est liée dans le Mobile Security Object et la présentation
        utilise les mécanismes DeviceAuthentication et le SessionTranscript du profil. Aucun KB-JWT
        n’est ajouté à mdoc. Les annexes mdoc d’OpenID décrivent l’intégration ; ce cours
        n’implémente pas un validateur ISO complet.
      </p>
      <Quiz
        quizId="oid4vci/formats/sd-jwt-vc-mdoc"
        questions={quizBank['oid4vci/formats/sd-jwt-vc-mdoc']!}
      />
    </div>
  )
}
