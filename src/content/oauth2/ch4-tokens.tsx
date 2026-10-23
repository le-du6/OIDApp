import { quizBank } from '../../data/quiz-bank'
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
        Un token opaque pour le client peut être validé côté RS par un stockage partagé ou par
        introspection. Un JWT signé permet une validation locale si les clés sont connues ; il peut
        aussi être introspecté. Les caches, la distribution des clés et le suivi du statut
        déterminent la fraîcheur effective.
      </p>
      <CompareTable
        caption="Opaque vs JWT — le vrai arbitrage"
        columns={['Token opaque', 'Access token JWT (RFC 9068)']}
        rows={[
          {
            label: 'Validation par le RS',
            cells: [
              {
                content: 'Introspection ou stockage partagé ; mise en cache possible',
                verdict: 'mid',
              },
              {
                content: 'Validation locale possible avec clés et politique connues',
                verdict: 'good',
              },
            ],
          },
          {
            label: 'Révocation effective',
            cells: [
              {
                content: 'Dépend de la réponse d’introspection, des caches et du déploiement',
                verdict: 'good',
              },
              {
                content:
                  'Locale sans statut : jusqu’à exp ; introspection ou liste de révocation possibles',
                verdict: 'mid',
              },
            ],
          },
          {
            label: 'Données exposées',
            cells: [
              {
                content: 'Pas de claims lisibles par le porteur ; référence sensible',
                verdict: 'good',
              },
              {
                content: 'Tous les claims sont LISIBLES par quiconque voit le token',
                verdict: 'mid',
              },
            ],
          },
          {
            label: 'Couplage RS ↔ AS',
            cells: [
              {
                content: 'Dépend du stockage, de l’introspection et de leurs caches',
                verdict: 'mid',
              },
              {
                content: 'Clés, politique et éventuels contrôles de statut nécessaires',
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
        La durée de vie des tokens est une politique du serveur. Le refresh token permet de
        renouveler l'accès sans nouvelle interaction, sous les contrôles du token endpoint. Selon
        RFC 7009 §2.1, lors de la révocation d'un refresh token, révoquer les access tokens associés
        est recommandé si le serveur prend en charge cette révocation. La prise en compte par le RS
        dépend de sa validation et de ses caches.
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
        questions={quizBank['oauth2/tokens/anatomie-tokens']!}
      />
    </div>
  )
}
