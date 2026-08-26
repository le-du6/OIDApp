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
        2008. Vous voulez qu'un service d'impression de photos accède à vos photos hébergées
        ailleurs. La « solution » de l'époque tient en un formulaire : « entrez l'email et le mot de
        passe de votre compte photos ». Et ça marchait. C'est précisément ça, le problème.
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
        Les <Term id="api-key">API keys</Term> ont amélioré une chose : le secret n'est plus LE mot
        de passe. Mais une clé statique reste un pouvoir large (rarement un périmètre fin), sans
        expiration, sans identité d'utilisateur final, et sa révocation est une opération manuelle
        qui casse tout ce qui l'utilise. Acceptable entre deux machines de confiance ; inadaptée au
        problème « un utilisateur délègue une partie de ses droits à une app ».
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
              { content: 'Aucun : le tiers ne voit qu’un token limité', verdict: 'good' },
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
              { content: 'Access token à courte durée par conception', verdict: 'good' },
            ],
          },
          {
            label: 'Révocation unitaire',
            cells: [
              { content: 'Impossible sans tout casser', verdict: 'bad' },
              { content: 'Rotation manuelle, casse les intégrations', verdict: 'mid' },
              { content: 'Par token/Client (RFC 7009), sans effet de bord', verdict: 'good' },
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
          l'utilisateur » côté Client — ce sera le travail d'OpenID Connect (Phase 2). Retenir dès
          maintenant : <strong>OAuth2 = autorisation, pas authentification</strong>. La confusion
          entre les deux a produit une décennie de « Login with… » cassés.
        </p>
      </Callout>

      <Quiz
        quizId="oauth2/probleme-origine/partage-mot-de-passe"
        questions={[
          {
            id: 'q1',
            question: 'Pourquoi le partage de mot de passe est-il pire qu’un accès trop large ?',
            options: [
              {
                text: 'Parce que le mot de passe transite en HTTP non chiffré',
                explanation:
                  'Non — même sur TLS, le problème demeure : c’est le DESTINATAIRE (le tiers) qui est le problème, pas le transport.',
              },
              {
                text: 'Parce qu’il donne un pouvoir total, non traçable et non révocable unitairement',
                correct: true,
                explanation:
                  'Oui : pouvoir total (y compris changer le mot de passe), l’API ne voit que « vous », et le retirer à un tiers = le retirer à tous.',
              },
              {
                text: 'Parce que les mots de passe sont trop courts',
                explanation:
                  'Non — un mot de passe de 40 caractères partagé avec un tiers pose exactement le même problème structurel.',
              },
            ],
          },
          {
            id: 'q2',
            question: 'Qu’apporte le scope OAuth2 par rapport à une API key ?',
            options: [
              {
                text: 'Un chiffrement plus fort',
                explanation: 'Non — le scope ne chiffre rien : il DÉLIMITE ce que le token permet.',
              },
              {
                text: 'Un périmètre consenti explicitement, opposable au token',
                correct: true,
                explanation:
                  'Oui (RFC 6749 §3.3) : l’utilisateur voit ce qu’il accorde, et le RS peut refuser tout ce qui dépasse.',
              },
              {
                text: 'La possibilité d’identifier l’utilisateur final',
                explanation:
                  'C’est vrai qu’OAuth2 l’apporte (sub), mais ce n’est pas le rôle du scope — qui délimite le périmètre.',
              },
            ],
          },
          {
            id: 'q3',
            question: 'OAuth 2.0 est un protocole de…',
            options: [
              {
                text: 'Délégation d’autorisation',
                correct: true,
                explanation:
                  'Oui. L’authentification de l’utilisateur y est un moyen interne à l’AS, jamais un résultat livré au Client — c’est OIDC qui livrera ça.',
              },
              {
                text: 'Authentification des utilisateurs',
                explanation:
                  'Non — c’est LE contresens historique. Un access token prouve un droit d’accès, pas une identité. OIDC (Phase 2) traite l’authentification.',
              },
              {
                text: 'Chiffrement des échanges',
                explanation: 'Non — OAuth2 s’appuie sur TLS mais ne chiffre rien lui-même.',
              },
            ],
          },
        ]}
      />
    </div>
  )
}
