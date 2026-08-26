import { Term } from '../../components/content/Term'
import { Callout } from '../../components/content/Callout'
import { Quiz } from '../../components/content/Quiz'
import { CompareTable } from '../../components/content/CompareTable'
import { CodeBlock } from '../../components/content/CodeBlock'
import { JwtInspector } from '../../components/jwt/JwtInspector'

const FIXTURE_JWT =
  'eyJhbGciOiJFUzI1NiIsInR5cCI6ImF0K2p3dCIsImtpZCI6ImFzLTIwMjYtMDEifQ.eyJzY29wZSI6InBob3Rvcy5yZWFkIiwiY2xpZW50X2lkIjoid2ViLWFwcCIsImlzcyI6Imh0dHBzOi8vYXMuZXhhbXBsZSIsInN1YiI6InVzZXItOGIyYzkxIiwiYXVkIjoiaHR0cHM6Ly9hcGkuZXhhbXBsZSIsImlhdCI6MTc2NzIyNTYwMCwiZXhwIjoxNzY3MjI5MjAwLCJqdGkiOiI5ZjNhN2QyZS00YjFjLTRjOGEtOWU3NS0xZDJmNmI4YzBhMTEifQ.NMEldLsjPFYimHAjQZe9YwsMD-oouUEX3dThGkW15f5jCdMn_B5c7clmMOfeaoP0QagYLtQv1TpAgIokWqwYAw'

/**
 * Chapitre 4 — Tokens : anatomie, cycle de vie, et le problème du bearer.
 */
export default function Ch4Tokens() {
  return (
    <div className="lesson-prose">
      <p>
        La RFC 6749 a fait un choix assumé : elle ne dit <em>pas</em> à quoi ressemble un{' '}
        <Term id="access-token" />. Deux familles cohabitent, et le choix entre elles est un vrai
        arbitrage d'architecture — pas un détail d'implémentation.
      </p>

      <h2>Opaque ou structuré (JWT)</h2>
      <p>
        Un token <Term id="opaque-token">opaque</Term> est une référence aléatoire : le RS doit
        interroger l'AS pour savoir ce qu'elle vaut — c'est l'
        <Term id="introspection" /> (RFC 7662). Un token structuré, presque toujours un{' '}
        <Term id="jwt" /> au profil <span className="font-mono text-xs">RFC 9068</span>, porte ses{' '}
        <Term id="claim">claims</Term> signés : le RS vérifie la signature localement, sans appel
        réseau.
      </p>
      <CompareTable
        caption="Opaque vs JWT — le vrai arbitrage"
        columns={['Token opaque', 'Access token JWT (RFC 9068)']}
        rows={[
          {
            label: 'Validation par le RS',
            cells: [
              {
                content: 'Introspection : un appel à l’AS par validation (RFC 7662)',
                verdict: 'mid',
              },
              { content: 'Locale : signature + exp/aud, zéro appel réseau', verdict: 'good' },
            ],
          },
          {
            label: 'Révocation effective',
            cells: [
              { content: 'Immédiate — l’AS répond « inactif » dès la révocation', verdict: 'good' },
              {
                content: 'Différée — le JWT reste valide jusqu’à exp (d’où des durées courtes)',
                verdict: 'mid',
              },
            ],
          },
          {
            label: 'Données exposées',
            cells: [
              { content: 'Aucune : le token ne contient rien', verdict: 'good' },
              {
                content: 'Tous les claims sont LISIBLES par quiconque voit le token',
                verdict: 'mid',
              },
            ],
          },
          {
            label: 'Couplage RS ↔ AS',
            cells: [
              { content: 'Fort : l’AS doit être joignable et tenir la charge', verdict: 'mid' },
              {
                content: 'Faible : il suffit de connaître les clés publiques (JWKS)',
                verdict: 'good',
              },
            ],
          },
        ]}
      />

      <h2>Anatomie d'un access token JWT — décodez-le</h2>
      <p>
        Trois segments base64url séparés par des points : header, payload, signature. Aucun
        chiffrement : <strong>un JWT se lit sans clé</strong>. Cliquez sur chaque segment — les
        claims sont annotés au survol, la spec en référence.
      </p>
      <div className="not-prose my-4">
        <JwtInspector
          label="L'access token du chapitre 3 (profil at+jwt, RFC 9068)"
          jwt={FIXTURE_JWT}
          note="typ: at+jwt distingue un ACCESS token d'un ID Token OIDC — confusion des deux = vulnérabilité classique. iss/aud disent qui l'a émis et pour quelle API ; exp le périme ; jti le rend traçable."
        />
      </div>
      <Callout kind="security" title="Lisible ≠ falsifiable">
        <p>
          Tout le monde peut <em>lire</em> ce token — c'est pourquoi on n'y met jamais de donnée
          sensible. Personne ne peut le <em>modifier</em> : changer un caractère du payload invalide
          la signature ES256, vérifiable avec la seule clé publique de l'AS. Faites l'expérience
          dans le Crypto Lab (signer, altérer, vérifier).
        </p>
      </Callout>

      <h2>Le cycle de vie : expiration, refresh, révocation</h2>
      <p>
        L'access token vit court (minutes à heure) : c'est la borne du dégât en cas de vol. Le{' '}
        <Term id="refresh-token" /> vit long et permet d'en obtenir d'autres — uniquement au{' '}
        <Term id="token-endpoint" />, jamais présenté à l'API. La <Term id="revocation" /> (RFC
        7009) coupe le refresh token — et avec lui, la délégation entière :
      </p>
      <CodeBlock
        lang="http"
        title="Révocation (RFC 7009) — « PhotoPrint, c'est fini »"
        code={`POST /revoke HTTP/1.1
Host: as.example
Authorization: Basic d2ViLWFwcDpzM2NyM3Q=
Content-Type: application/x-www-form-urlencoded

token=8xLOxBtZp8&token_type_hint=refresh_token

HTTP/1.1 200 OK
# 200 même si le token était déjà invalide : pas d'oracle pour un attaquant`}
      />

      <h2>Le problème du bearer</h2>
      <p>
        Par défaut, tout ce qui précède produit des <Term id="bearer-token">bearer tokens</Term> :
        le RS vérifie ce que le token <em>est</em>, jamais qui le <em>présente</em>. Détention =
        pouvoir, comme un billet au porteur. Toute la discipline du protocole — TLS partout,{' '}
        <code>Cache-Control: no-store</code>, jamais de token en URL, durées courtes — découle de
        cette propriété. Et quand la discipline ne suffit pas, on change la propriété elle-même :
        tokens liés au détenteur, <Term id="dpop" /> et <Term id="mtls" /> — au chapitre 5.
      </p>
      <Callout kind="spec" specRef="RFC 6750 §5.2" title="Dans la spec">
        <p>
          La section « Threat Mitigation » de la RFC 6750 énumère les conséquences : protéger les
          tokens en transit ET au repos, ne jamais les passer en paramètre d'URL, préférer des
          durées de vie courtes. La spec conclut elle-même que le bearer est un compromis —
          simplicité contre garanties.
        </p>
      </Callout>

      <Quiz
        quizId="oauth2/tokens/anatomie-tokens"
        questions={[
          {
            id: 'q1',
            question: 'Que signifie « un JWT se lit sans clé » ?',
            options: [
              {
                text: 'Le JWT n’est pas protégé, c’est une faille',
                explanation:
                  'Non — c’est un choix : signature ≠ chiffrement. L’intégrité est garantie ; la confidentialité, non. On ne met donc RIEN de sensible dans un access token.',
              },
              {
                text: 'Header et payload sont du base64url, pas du chiffrement — seule la falsification est empêchée',
                correct: true,
                explanation:
                  'Exactement : base64url est un ENCODAGE. La signature garantit l’intégrité et l’origine, pas le secret du contenu.',
              },
              {
                text: 'Il faut la clé publique pour décoder le payload',
                explanation:
                  'Non — la clé publique sert à VÉRIFIER la signature. Le décodage du payload ne demande que atob().',
              },
            ],
          },
          {
            id: 'q2',
            question: 'Quel est le principal inconvénient d’un access token JWT face à un opaque ?',
            options: [
              {
                text: 'Il est plus lent à valider',
                explanation:
                  'Au contraire : la validation locale (signature) évite l’aller-retour d’introspection.',
              },
              {
                text: 'Révoqué, il reste techniquement valide jusqu’à son exp',
                correct: true,
                explanation:
                  'Oui — le RS qui valide localement ne voit pas la révocation. Mitigation : durées courtes, et introspection pour les opérations critiques.',
              },
              {
                text: 'Il ne peut pas porter de scope',
                explanation:
                  'Faux — le claim scope est normalisé pour les access tokens JWT (RFC 9068).',
              },
            ],
          },
          {
            id: 'q3',
            question: 'Où un refresh token a-t-il le droit d’être présenté ?',
            options: [
              {
                text: 'Au Resource Server, si l’access token est expiré',
                explanation:
                  'Jamais — présenter un artefact longue durée à l’API multiplierait les points d’exposition. Le RS ne sait même pas quoi en faire.',
              },
              {
                text: 'Au token endpoint de l’AS, exclusivement',
                correct: true,
                explanation:
                  'Oui (RFC 6749 §6) : grant_type=refresh_token, en back channel, avec authentification du Client s’il est confidentiel.',
              },
              {
                text: 'Aux deux, selon la configuration',
                explanation:
                  'Non — aucune configuration légitime n’envoie un refresh token à un RS.',
              },
            ],
          },
          {
            id: 'q4',
            question:
              'Pourquoi l’endpoint de révocation répond-il 200 même pour un token inconnu ?',
            options: [
              {
                text: 'Par simplicité d’implémentation',
                explanation:
                  'Non — c’est une décision de sécurité délibérée, documentée dans la RFC 7009 §2.2.',
              },
              {
                text: 'Pour ne pas servir d’oracle : un attaquant ne doit pas pouvoir tester la validité de tokens volés',
                correct: true,
                explanation:
                  'Oui — répondre différemment selon la validité transformerait /revoke en vérificateur de butin.',
              },
              {
                text: 'Parce que la révocation est asynchrone',
                explanation:
                  'Non — elle peut l’être, mais la réponse uniforme vise l’absence d’oracle, pas l’asynchronisme.',
              },
            ],
          },
        ]}
      />
    </div>
  )
}
