import { quizBank } from '../../data/quiz-bank'
import { Term } from '../../components/content/Term'
import { Callout } from '../../components/content/Callout'
import { Quiz } from '../../components/content/Quiz'
import { CompareTable } from '../../components/content/CompareTable'
import { CodeBlock } from '../../components/content/CodeBlock'

/**
 * Chapitre 1 — Le problème d'origine : la délégation d'accès,
 * et ce que le monde faisait (mal) avant OAuth.
 */
export default function Ch1ProblemeOrigine() {
  return (
    <div className="lesson-prose">
      <p>
        Prenons un anti-pattern historique de délégation : un service d'impression demande le mot de
        passe de votre hébergeur de photos pour agir à votre place. Cela ne décrit pas toute
        l'authentification avant OAuth : HTTP Digest (RFC 2617, 1999) et Kerberos existaient déjà,
        ce dernier dans des réseaux distribués. Ils ne résolvent pas le même problème de délégation
        web à un tiers.
      </p>
      <CodeBlock
        lang="http"
        title="L'anti-pattern fondateur — le Client se fait passer pour vous"
        code={`POST /login HTTP/1.1
Host: photos.example
Content-Type: application/x-www-form-urlencoded

username=vous@example.com&password=VOTRE_VRAI_MOT_DE_PASSE
# saisi… dans l'interface de photoprint.example`}
      />

      <h2>Ce que le mot de passe partagé casse</h2>
      <p>
        Donner son mot de passe à un tiers, c'est lui donner un pouvoir <strong>total</strong> (il
        peut tout faire, y compris changer le mot de passe), <strong>invérifiable</strong> (aucun
        moyen de savoir ce qu'il en fait, ni s'il le stocke en clair),{' '}
        <strong>non résiliable</strong> unitairement (pour le lui retirer, il faut changer le mot de
        passe — et le retirer aussi à tous les autres), et <strong>impersonnel</strong> (les logs du
        service photos voient « vous », jamais « PhotoPrint agissant pour vous »). Chaque service
        tiers qui le stocke devient une extension de votre surface d'attaque.
      </p>

      <h2>L'étape intermédiaire : l'API key</h2>
      <p>
        Une <Term id="api-key" /> évite de partager le mot de passe principal. Sa portée, son
        expiration, sa rotation et son association à une identité dépendent du service. OAuth
        apporte un cadre interopérable d'autorisation et de gestion des tokens ; une API key n'est
        pas par définition illimitée ou éternelle.
      </p>

      <h2>Ce que la délégation exige</h2>
      <p>
        Formulons le cahier des charges qu'OAuth2 devra remplir : un accès{' '}
        <strong>limité en périmètre</strong> (<Term id="scope" /> : lire les photos, pas les
        supprimer), <strong>limité dans le temps</strong> (expiration), <strong>révocable</strong>{' '}
        individuellement sans dommage collatéral, <strong>traçable</strong> (l'API distingue l'app
        de l'utilisateur), et surtout :{' '}
        <strong>sans jamais montrer le mot de passe au tiers</strong>. Le secret d'authentification
        ne doit exister qu'entre vous et l'
        <Term id="authorization-server" />.
      </p>

      <CompareTable
        caption="Ce qui fuit et ce qui se révoque, approche par approche"
        columns={['Mot de passe partagé', 'API key', 'OAuth 2.0']}
        rows={[
          {
            label: 'Secret exposé au tiers',
            cells: [
              { content: 'Le mot de passe lui-même — pouvoir total', verdict: 'bad' },
              { content: 'Une clé dédiée, mais statique et large', verdict: 'mid' },
              { content: 'Un access token sensible, avec une portée accordée', verdict: 'good' },
            ],
          },
          {
            label: 'Périmètre',
            cells: [
              { content: 'Tout le compte, toujours', verdict: 'bad' },
              { content: 'Ce que la clé permet — souvent tout l’API', verdict: 'mid' },
              { content: 'Le scope consenti, rien d’autre', verdict: 'good' },
            ],
          },
          {
            label: 'Expiration',
            cells: [
              { content: 'Jamais (jusqu’au changement de mot de passe)', verdict: 'bad' },
              { content: 'Rarement native', verdict: 'mid' },
              {
                content: 'Durée décidée par le serveur, courte dans notre exemple',
                verdict: 'good',
              },
            ],
          },
          {
            label: 'Révocation unitaire',
            cells: [
              { content: 'Impossible sans tout casser', verdict: 'bad' },
              { content: 'Rotation manuelle, casse les intégrations', verdict: 'mid' },
              {
                content: 'Endpoint de révocation, effets selon la politique (RFC 7009)',
                verdict: 'good',
              },
            ],
          },
          {
            label: 'Identité vue par l’API',
            cells: [
              { content: '« Vous » — l’app est indistinguable', verdict: 'bad' },
              { content: 'La clé — l’utilisateur est invisible', verdict: 'mid' },
              { content: 'client_id + sub : l’app ET l’utilisateur', verdict: 'good' },
            ],
          },
        ]}
      />

      <Callout kind="spec" specRef="RFC 6749 §1 (introduction)" title="Dans la spec">
        <p>
          La RFC 6749 ouvre exactement sur ce constat : dans le modèle client-serveur classique,
          accéder à une ressource protégée pour le compte d'un tiers exigeait de partager ses
          credentials — avec, énumérés dès l'introduction, le stockage du mot de passe en clair chez
          les tiers, l'accès trop large, et l'impossibilité de révoquer un tiers sans les révoquer
          tous.
        </p>
      </Callout>

      <Callout kind="note" title="Ce qu'OAuth2 n'est PAS">
        <p>
          OAuth 2.0 résout la <em>délégation d'autorisation</em>. Il ne dit rien de « qui est
          l'utilisateur » côté Client — ce sera le travail d'OpenID Connect (OIDC). Retenir dès
          maintenant : <strong>OAuth2 = autorisation, pas authentification</strong>. La confusion
          entre les deux a produit une décennie de « Login with… » cassés.
        </p>
      </Callout>

      <p>
        Le corps HTTP affiché est lisible pour l’explication. Cela ne signifie pas qu’il est
        transmis sans TLS. Un bearer token reste une donnée sensible : sa possession permet l’accès
        autorisé.
      </p>
      <Quiz
        quizId="oauth2/probleme-origine/partage-mot-de-passe"
        questions={quizBank['oauth2/probleme-origine/partage-mot-de-passe']!}
      />
    </div>
  )
}
