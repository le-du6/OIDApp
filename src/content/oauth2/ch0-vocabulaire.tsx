import { quizBank } from '../../data/quiz-bank'
import { Link } from '@tanstack/react-router'
import { Term } from '../../components/content/Term'
import { Callout } from '../../components/content/Callout'
import { Quiz } from '../../components/content/Quiz'
import { actorColor } from '../../lib/actors'
import type { ActorRole } from '../../engine/scenario'

/**
 * Chapitre 0 — Le vocabulaire inutilement compliqué.
 * Porte d'entrée assumée du module : on désamorce le jargon AVANT d'apprendre
 * le protocole, parce que la moitié de la difficulté d'OAuth2 est lexicale.
 */
export default function Ch0Vocabulaire() {
  return (
    <div className="lesson-prose">
      <p>
        OAuth 2.0 n'est pas difficile parce que ses mécanismes sont compliqués. Il est difficile
        parce que son vocabulaire décrit des choses simples avec des mots qui semblent désigner
        autre chose. Ce chapitre est un décodeur : une fois la table de correspondance en tête, le
        reste du module se lit sans friction.
      </p>
      <Callout kind="note" title="Règle de l'app">
        <p>
          Les termes de spec restent en <em>anglais officiel</em> — on ne traduit jamais un terme
          normatif, on l'explique. Chaque terme souligné est cliquable : définition française,
          référence exacte, et critique du nom quand il la mérite.
        </p>
      </Callout>

      <h2>La table de décodage</h2>
      <DecodeTable />

      <h2>Pourquoi ces noms ?</h2>
      <p>
        Parce qu'OAuth 2.0 (<span className="font-mono text-xs">RFC 6749, 2012</span>) est écrit du
        point de vue du <em>modèle d'autorisation</em>, pas du point de vue du développeur qui
        l'implémente. Dans ce modèle, tout tourne autour d'une <strong>ressource</strong> : celui
        qui la possède (<Term id="resource-owner" />
        ), celui qui la sert (
        <Term id="resource-server" />
        ), celui qui veut y accéder (<Term id="client" />) et celui qui arbitre (
        <Term id="authorization-server" />
        ). Cohérent — mais personne ne pense comme ça en écrivant une app.
      </p>
      <p>
        Le <Term id="client" /> est un rôle : le logiciel qui demande l'accès. Il peut être un
        backend, une application dans le navigateur, une application native, une CLI ou un appareil
        dédié. Ici, le premier exemple utilise un backend. Un client confidentiel peut protéger ses
        moyens d'authentification ; un client public ne peut pas garder un secret partagé distribué
        avec son code.
      </p>
      <Callout kind="security" title="Un nom qui dit vrai">
        <p>
          Une exception remarquable : <Term id="bearer-token" />. « Au porteur », comme un billet.
          Le nom énonce exactement le problème de sécurité — quiconque le détient peut s'en servir —
          que le chapitre 5 passera au crible.
        </p>
      </Callout>

      <h2>Les quatre rôles, sans jargon</h2>
      <p>
        Répétons l'histoire entière en une phrase, deux fois. Version spec : le <Term id="client" />{' '}
        obtient de l'
        <Term id="authorization-server" /> un <Term id="access-token" /> matérialisant l'
        <Term id="authorization-grant" /> du <Term id="resource-owner" />, et le présente au{' '}
        <Term id="resource-server" />. Version humaine :{' '}
        <em>
          l'app demande au serveur de login la permission d'appeler l'API à votre place, et vous
          dites oui
        </em>
        . C'est la même phrase.
      </p>
      <p>
        Le chapitre suivant explique le problème de la délégation à travers un exemple de partage de
        mot de passe. Le <Link to="/glossaire">glossaire</Link> reste accessible à tout moment.
      </p>

      <h2>Qui authentifie qui ?</h2>
      <p>
        Dans le code flow, l’AS authentifie le Resource Owner, sans qu’OAuth impose sa méthode : mot
        de passe, passkey ou session existante. Un client confidentiel s’authentifie séparément au
        token endpoint. TLS authentifie le serveur contacté. Le grant client credentials ne suppose
        pas de connexion d’un utilisateur.
      </p>
      <p>
        OAuth définit l’autorisation d’accès. Pour que le RP reçoive un résultat d’authentification
        utilisateur avec un contrat de validation, nous étudierons OIDC.
      </p>
      <Quiz
        quizId="oauth2/vocabulaire/decodage"
        questions={quizBank['oauth2/vocabulaire/decodage']!}
      />
    </div>
  )
}

const rows: {
  role?: ActorRole
  official: string
  termId: string
  real: string
  trap: string
}[] = [
  {
    role: 'user',
    official: 'Resource Owner',
    termId: 'resource-owner',
    real: 'L’utilisateur — vous',
    trap: 'Personne ne dit « propriétaire de ressource » pour dire « vous ».',
  },
  {
    role: 'client',
    official: 'Client',
    termId: 'client',
    real: 'Le logiciel qui demande l’accès',
    trap: '« Client » évoque le navigateur ; ici c’est l’app qui consomme l’API.',
  },
  {
    role: 'authorization-server',
    official: 'Authorization Server',
    termId: 'authorization-server',
    real: 'Le serveur qui authentifie et émet les tokens',
    trap: 'Il fait de l’authentification mais ne s’appelle pas comme ça.',
  },
  {
    role: 'resource-server',
    official: 'Resource Server',
    termId: 'resource-server',
    real: 'L’API',
    trap: '—',
  },
  {
    official: 'Authorization Grant',
    termId: 'authorization-grant',
    real: 'Un moyen d’obtenir une autorisation, selon le grant',
    trap: 'Quatre types de « grants » pour des réalités très différentes.',
  },
  {
    official: 'Bearer token',
    termId: 'bearer-token',
    real: 'Un token que quiconque le porte peut utiliser',
    trap: 'Le nom dit exactement le problème de sécurité (chapitre 5).',
  },
]

function DecodeTable() {
  return (
    <div className="my-4 overflow-x-auto rounded-lg border border-line">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-line bg-surface-2 text-left text-xs text-muted">
            <th className="p-2.5 font-semibold" scope="col">
              Terme officiel
            </th>
            <th className="p-2.5 font-semibold" scope="col">
              Ce que ça veut vraiment dire
            </th>
            <th className="p-2.5 font-semibold" scope="col">
              Pourquoi le nom est piégeux
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.termId} className="border-b border-line/50 align-top last:border-0">
              <td className="p-2.5 whitespace-nowrap">
                <Term id={r.termId} />
              </td>
              <td
                className="p-2.5 text-xs leading-relaxed"
                style={r.role ? { color: actorColor(r.role) } : undefined}
              >
                {r.real}
              </td>
              <td className="p-2.5 text-xs leading-relaxed text-muted">{r.trap}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
