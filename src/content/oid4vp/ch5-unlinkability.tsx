import { quizBank } from '../../data/quiz-bank'
import { Callout } from '../../components/content/Callout'
import { Quiz } from '../../components/content/Quiz'
import { CompareTable } from '../../components/content/CompareTable'

/**
 * OID4VP — Chapitre 5 : unlinkability, et le comparateur final
 * fédération vs wallet — la synthèse des quatre modules.
 */
export default function VpCh5() {
  return (
    <div className="lesson-prose">
      <p>
        La divulgation sélective limite ce qui est transmis. L'unlinkability vise une autre
        propriété : empêcher de relier plusieurs présentations au-delà de ce que les attributs
        révélés permettent déjà. Les deux propriétés ne se déduisent pas l'une de l'autre.
      </p>

      <h2>Les ennemis concrets de l'unlinkability</h2>
      <p>
        Un credential réutilisé expose les mêmes signatures et digests. Une clé publique stable, un
        timestamp d'émission très précis, un identifiant de statut ou une combinaison rare de claims
        peuvent aussi relier des présentations. Corréler deux traces ne signifie pas toujours
        identifier civilement une personne : cela dépend des connaissances de l'observateur.
      </p>
      <Callout kind="security" title="L'état honnête du sujet">
        <p>
          L'émission de plusieurs exemplaires peut réduire certaines corrélations si les sels, clés,
          horodatages et usages sont convenablement gérés. Elle ne suffit pas à garantir
          l'unlinkability, notamment face à l'Issuer qui connaît les objets qu'il a émis. Un nonce
          renouvelé ne masque aucun autre identifiant stable.
        </p>
      </Callout>

      <h2>Le comparateur final : fédération vs wallet</h2>
      <p>
        Quatre modules plus tard, la boucle : voici les deux architectures côte à côte, sur les axes
        annoncés au premier jour — secrets échangés, surface d'attaque, vie privée, traçabilité.
      </p>

      <CompareTable
        caption="Fédération (OIDC) vs triangle wallet (OID4VCI/VP)"
        columns={['Fédération (IdP central)', 'Wallet (triangle)']}
        rows={[
          {
            label: 'Qui est en ligne à chaque usage',
            cells: [
              { content: 'L’OP lors d’une nouvelle authentification ; session locale ensuite' },
              { content: 'Wallet et Verifier ; clés/statut peuvent nécessiter un accès réseau' },
            ],
          },
          {
            label: 'Ce que l’émetteur d’identité apprend',
            cells: [
              {
                content:
                  'Les nouvelles authentifications qu’il traite, pas toutes les actions du RP',
              },
              {
                content:
                  'Pas d’appel imposé pour chaque présentation ; statut et collusion à considérer',
              },
            ],
          },
          {
            label: 'Granularité de la divulgation',
            cells: [
              { content: 'Scopes et demandes individuelles par claims (Core §5.5)' },
              { content: 'Sélection parmi les claims rendus divulgables par le format' },
            ],
          },
          {
            label: 'Liaison au porteur',
            cells: [
              { content: 'Session du RP ; DPoP lie les access tokens lorsqu’il est utilisé' },
              { content: 'Preuve de détenteur selon format et demande ; KB-JWT pour SD-JWT' },
            ],
          },
          {
            label: 'Révocation / fraîcheur',
            cells: [
              { content: 'Tokens, sessions locales et caches ont des durées distinctes' },
              { content: 'Listes de statut, durées courtes : plus difficile' },
            ],
          },
          {
            label: 'Disponibilité',
            cells: [
              {
                content:
                  'Une panne empêche de nouvelles authentifications, pas forcément les sessions',
              },
              {
                content:
                  'mdoc de proximité peut fonctionner hors ligne ; pas ce parcours OID4VP HTTP',
              },
            ],
          },
          {
            label: 'Charge de sécurité',
            cells: [
              { content: 'Concentrée sur l’IdP (cible unique, très défendue)' },
              {
                content: 'Déplacée vers des millions de wallets (WSCD, attestation)',
                verdict: 'mid',
              },
            ],
          },
          {
            label: 'Maturité opérationnelle',
            cells: [
              { content: 'Vingt ans de production' },
              { content: 'Déploiements en cours (EUDI : specs finales 2025)' },
            ],
          },
        ]}
      />

      <p>
        Le choix dépend du contexte : sessions et gouvernance d'un domaine pour la fédération ;
        réutilisation de credentials entre acteurs distincts pour les wallets. Dans les deux cas,
        minimisation, statut, confiance et sécurité du terminal demandent une politique explicite.
        La couleur d'un tableau ne doit pas remplacer ces hypothèses.
      </p>

      <Quiz
        quizId="oid4vp/unlinkability/federation-vs-wallet"
        questions={quizBank['oid4vp/unlinkability/federation-vs-wallet']!}
      />
    </div>
  )
}
