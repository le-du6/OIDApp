import { Term } from '../../components/content/Term'
import { Callout } from '../../components/content/Callout'
import { Quiz } from '../../components/content/Quiz'
import { JwtInspector } from '../../components/jwt/JwtInspector'
import { CompareTable } from '../../components/content/CompareTable'
import { OIDC_ID_TOKEN } from '../../data/fixtures/oidc'

/**
 * OIDC — Chapitre 1 : anatomie de l'ID Token. JWT = JWS (signé) ici, JWE
 * (chiffré) en aperçu. Inspection de la vraie fixture signée.
 */
export default function OidcCh1() {
  return (
    <div className="lesson-prose">
      <p>
        L'
        <Term id="id-token" /> est un <Term id="jwt" /> : trois segments en base64url,{' '}
        <code>header.payload.signature</code>. Techniquement, c'est un <Term id="jws" /> — un JWT{' '}
        <em>signé</em>. Décodez la vraie fixture ci-dessous (signée en ES256, comme dans les
        scénarios) : tout se lit sans aucune clé, la signature ne servant qu'à <em>vérifier</em>.
      </p>

      <div className="not-prose my-6">
        <JwtInspector
          label="ID Token de démonstration (ES256)"
          jwt={OIDC_ID_TOKEN}
          note="Cliquez sur le payload : chaque claim est annoté. iss/sub/aud/exp/iat sont obligatoires ; nonce, auth_time, at_hash sont ici présents ; email vient du scope demandé."
        />
      </div>

      <h2>Les claims, et pourquoi chacun est là</h2>
      <p>
        Le Core impose cinq claims (<code>iss</code>, <code>sub</code>, <code>aud</code>,{' '}
        <code>exp</code>, <code>iat</code>) et en cadre plusieurs autres. Ce ne sont pas des
        décorations : chacun ferme une attaque précise, ce qu'on verra au chapitre validation.
      </p>

      <CompareTable
        caption="Les claims de l’ID Token et leur rôle"
        columns={['Claim', 'Rôle', 'Statut (Core §2)']}
        rows={[
          {
            label: 'iss',
            cells: [
              { content: 'Qui a émis le jeton (URL de l’OP)' },
              { content: 'Ancre de confiance : doit valoir l’OP attendu', verdict: 'good' },
              { content: 'REQUIRED' },
            ],
          },
          {
            label: 'sub',
            cells: [
              { content: 'Identifiant stable de l’utilisateur chez l’OP' },
              { content: 'La vraie clé d’identité = (iss, sub)', verdict: 'good' },
              { content: 'REQUIRED · ≤ 255 ASCII' },
            ],
          },
          {
            label: 'aud',
            cells: [
              { content: 'Pour qui le jeton a été fabriqué (= client_id)' },
              { content: 'Bloque la substitution inter-clients', verdict: 'good' },
              { content: 'REQUIRED' },
            ],
          },
          {
            label: 'exp / iat',
            cells: [
              { content: 'Expiration / instant d’émission' },
              { content: 'Fenêtre de validité, anti-jeton périmé', verdict: 'good' },
              { content: 'REQUIRED' },
            ],
          },
          {
            label: 'nonce',
            cells: [
              { content: 'Valeur liée à la requête du RP, recopiée' },
              { content: 'Anti-rejeu / anti-injection', verdict: 'good' },
              { content: 'Si envoyé, l’OP DOIT le renvoyer' },
            ],
          },
          {
            label: 'auth_time',
            cells: [
              { content: 'Instant de l’authentification réelle' },
              { content: 'Permet d’exiger une auth récente (max_age)', verdict: 'mid' },
              { content: 'REQUIRED si max_age, sinon OPTIONAL' },
            ],
          },
          {
            label: 'at_hash',
            cells: [
              { content: 'Empreinte liant l’ID Token à l’access token' },
              { content: 'Empêche l’appariement d’un access token étranger', verdict: 'good' },
              { content: 'OPTIONAL en code flow' },
            ],
          },
        ]}
      />

      <Callout kind="spec" specRef="OIDC Core 1.0 §2" title="Dans la spec — sur sub">
        <p>
          « A locally unique and never reassigned identifier within the Issuer for the End-User […]
          It MUST NOT exceed 255 ASCII characters in length. » D'où la règle pratique : identifiez
          un utilisateur par le couple <code>(iss, sub)</code>, jamais par l'email (mutable) ni par{' '}
          <code>sub</code> seul (unique seulement au sein d'un OP donné).
        </p>
      </Callout>

      <h2>JWS vs JWE : signer n'est pas chiffrer</h2>
      <p>
        Un point de vocabulaire qui piège tout le monde. Un ID Token « normal » est{' '}
        <Term id="jws" /> : <strong>signé</strong>, donc son intégrité et son origine sont garanties
        — mais son contenu est <em>lisible par tous</em> (base64url n'est pas du chiffrement). Le
        chiffrement, c'est <Term id="jwe" />, une autre construction (cinq segments) qui rend le
        jeton illisible sauf au destinataire.
      </p>
      <Callout kind="security" title="Ne mettez rien de secret dans un JWT signé">
        <p>
          Puisqu'un JWS se lit sans clé, un ID Token ne doit contenir aucune donnée que
          l'utilisateur ou un intermédiaire ne devrait pas voir. En pratique, les ID Tokens sont
          signés et rarement chiffrés : la signature suffit à la plupart des besoins, et JWE reste
          réservé aux cas où la confidentialité du contenu du jeton est réellement requise.
        </p>
      </Callout>

      <Quiz
        quizId="oidc/id-token/anatomie-id-token"
        questions={[
          {
            id: 'q1',
            question: 'Que garantit la signature (JWS) d’un ID Token ?',
            options: [
              {
                text: 'La confidentialité de son contenu',
                explanation:
                  'Non — c’est le rôle du chiffrement (JWE). Un JWS est lisible par tous : base64url n’est pas du chiffrement.',
              },
              {
                text: 'Son intégrité et son origine (émis par l’OP, non modifié)',
                correct: true,
                explanation:
                  'Oui — signer prouve qui a émis et que rien n’a été altéré. Mais le contenu reste public.',
              },
              {
                text: 'Que le jeton n’a pas expiré',
                explanation:
                  'Non — l’expiration se vérifie via le claim exp, indépendamment de la signature.',
              },
            ],
          },
          {
            id: 'q2',
            question: 'Quelle est la clé d’identité robuste d’un utilisateur ?',
            options: [
              {
                text: 'Son email',
                explanation:
                  'Non — l’email peut changer et n’est pas garanti unique ni stable. Mauvais choix de clé primaire.',
              },
              {
                text: 'Le couple (iss, sub)',
                correct: true,
                explanation:
                  'Oui — sub est unique et non réattribué AU SEIN d’un OP ; le préfixer par iss lève l’ambiguïté entre OP.',
              },
              {
                text: 'Le claim aud',
                explanation:
                  'Non — aud identifie le destinataire du jeton (le RP), pas l’utilisateur.',
              },
            ],
          },
          {
            id: 'q3',
            question: 'À quoi sert at_hash ?',
            options: [
              {
                text: 'À chiffrer l’access token',
                explanation:
                  'Non — at_hash ne chiffre rien ; c’est une empreinte (hash), pas un chiffrement.',
              },
              {
                text: 'À lier l’ID Token à l’access token de la même réponse',
                correct: true,
                explanation:
                  'Oui — at_hash = base64url(moitié gauche de SHA-256(access_token)). Le RP recalcule et compare : un access token d’une autre provenance ne colle pas.',
              },
              {
                text: 'À prouver que l’utilisateur s’est authentifié récemment',
                explanation: 'Non — c’est le rôle d’auth_time (avec max_age), pas d’at_hash.',
              },
            ],
          },
        ]}
      />
    </div>
  )
}
