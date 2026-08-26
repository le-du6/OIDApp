import { Term } from '../../components/content/Term'
import { Callout } from '../../components/content/Callout'
import { Quiz } from '../../components/content/Quiz'
import { CompareTable } from '../../components/content/CompareTable'

/**
 * OIDC — Chapitre 6 : OIDC vs SAML. Même objectif (fédérer l'identité), deux
 * générations de choix techniques. Sans caricature : SAML reste très déployé.
 */
export default function OidcCh6() {
  return (
    <div className="lesson-prose">
      <p>
        OIDC n'a pas inventé la fédération d'identité : <Term id="saml" /> le fait depuis 2005 et
        reste massivement déployé, surtout en entreprise. Les deux résolvent le même problème —
        déléguer l'authentification à un fournisseur d'identité — mais avec des choix techniques
        d'époques différentes. Comparer sans caricaturer : le but n'est pas d'élire un gagnant, mais
        de savoir lequel convient à quel contexte.
      </p>

      <CompareTable
        caption="SAML 2.0 vs OpenID Connect — mêmes objectifs, autres moyens"
        columns={['Axe', 'SAML 2.0', 'OpenID Connect']}
        rows={[
          {
            label: 'Format du jeton',
            cells: [
              { content: 'Assertion XML signée (XML-DSig)' },
              { content: 'ID Token = JWT/JWS (JSON signé)', verdict: 'good' },
            ],
          },
          {
            label: 'Socle',
            cells: [
              { content: 'Protocole autonome (bindings SOAP/HTTP-POST)' },
              { content: 'Couche au-dessus d’OAuth 2.0', verdict: 'good' },
            ],
          },
          {
            label: 'Cibles privilégiées',
            cells: [
              { content: 'Web SSO serveur, entreprise', verdict: 'mid' },
              { content: 'API, mobile natif, SPA, plus le web', verdict: 'good' },
            ],
          },
          {
            label: 'Découverte / clés',
            cells: [
              { content: 'Métadonnées XML, certificats' },
              { content: 'Discovery JSON + JWKS, rotation simple', verdict: 'good' },
            ],
          },
          {
            label: 'Transport',
            cells: [
              { content: 'Souvent POST XML volumineux via le navigateur', verdict: 'mid' },
              { content: 'Redirections + appels JSON compacts', verdict: 'good' },
            ],
          },
          {
            label: 'Complexité d’implémentation',
            cells: [
              {
                content: 'Canonicalisation XML, signatures : historiquement piégeux',
                verdict: 'bad',
              },
              {
                content: 'JSON + JWT : plus simple, mais validation à faire correctement',
                verdict: 'mid',
              },
            ],
          },
          {
            label: 'Maturité / déploiement',
            cells: [
              { content: 'Très mûr, omniprésent en entreprise', verdict: 'good' },
              { content: 'Standard de facto du web/mobile moderne', verdict: 'good' },
            ],
          },
        ]}
      />

      <Callout kind="security" title="Le piège n’est pas le format, c’est la validation">
        <p>
          SAML a souffert d'attaques par manipulation de la signature XML (wrapping) : la faute au
          modèle XML-DSig, difficile à valider correctement. OIDC déplace le risque, il ne le
          supprime pas : les failles OIDC réelles viennent presque toujours d'une{' '}
          <strong>validation incomplète</strong> de l'ID Token (signature seule, <code>aud</code>{' '}
          non vérifié, <code>alg</code> non contraint). Dans les deux mondes, la sécurité tient à la
          rigueur du receveur.
        </p>
      </Callout>

      <h2>Lequel choisir ?</h2>
      <p>
        Nouveau développement web/mobile, besoin d'API : OIDC est le choix par défaut. Intégration à
        un écosystème d'entreprise existant (fournisseurs SAML, annuaire, applications legacy) :
        SAML reste souvent la voie la plus directe. Beaucoup d'IdP parlent les deux — le choix se
        fait au cas par cas, pas par idéologie.
      </p>

      <Quiz
        quizId="oidc/oidc-vs-saml/comparaison"
        questions={[
          {
            id: 'q1',
            question: 'Quelle différence de format distingue SAML et OIDC ?',
            options: [
              {
                text: 'SAML utilise des assertions XML signées ; OIDC un JWT/JSON signé',
                correct: true,
                explanation:
                  'Oui — XML-DSig d’un côté, JWS/JSON de l’autre. Cela conditionne outillage, taille des messages et pièges de validation.',
              },
              {
                text: 'SAML est chiffré, OIDC ne l’est jamais',
                explanation:
                  'Non — les deux peuvent chiffrer (SAML EncryptedAssertion, OIDC via JWE), mais ce n’est pas leur différence structurante.',
              },
              {
                text: 'OIDC n’a pas de signature',
                explanation:
                  'Non — l’ID Token est signé (JWS) ; c’est même le cœur de sa validation.',
              },
            ],
          },
          {
            id: 'q2',
            question: 'D’où viennent le plus souvent les failles OIDC en pratique ?',
            options: [
              {
                text: 'Du format JSON, intrinsèquement peu sûr',
                explanation:
                  'Non — le format n’est pas en cause. C’est la validation côté RP qui pèche.',
              },
              {
                text: 'D’une validation incomplète de l’ID Token (signature seule, aud/alg négligés)',
                correct: true,
                explanation:
                  'Oui — la rigueur du receveur fait la sécurité. Vérifier la signature sans aud ni alg contraint laisse des brèches.',
              },
              {
                text: 'De l’absence de chiffrement systématique',
                explanation:
                  'Non — la plupart des ID Tokens sont signés et non chiffrés, et c’est acceptable ; le problème est la validation.',
              },
            ],
          },
          {
            id: 'q3',
            question:
              'Pour une nouvelle application mobile consommant des API, que choisir a priori ?',
            options: [
              {
                text: 'SAML, plus mûr',
                explanation:
                  'Non — SAML est pensé pour le SSO web serveur ; ses bindings XML/POST conviennent mal au mobile natif et aux API.',
              },
              {
                text: 'OIDC, conçu pour API/mobile/SPA au-dessus d’OAuth2',
                correct: true,
                explanation:
                  'Oui — OIDC est le choix par défaut du web/mobile moderne. SAML garde sa place dans l’écosystème d’entreprise existant.',
              },
              {
                text: 'Ni l’un ni l’autre : un mot de passe maison',
                explanation:
                  'Non — refaire de l’authentification maison est exactement ce que ces standards évitent.',
              },
            ],
          },
        ]}
      />
    </div>
  )
}
