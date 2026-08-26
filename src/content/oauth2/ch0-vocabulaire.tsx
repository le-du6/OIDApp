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
        Le piège le plus coûteux est <Term id="client" /> : dans une architecture web classique, «
        client » désigne le navigateur. En OAuth2, le Client est <em>l'application</em> — et c'est
        très souvent un serveur. Tant que ce réflexe n'est pas installé, chaque diagramme se lit de
        travers.
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
        Le chapitre suivant explique <em>pourquoi</em> cette machinerie existe — ce que le monde
        faisait avant, et pourquoi c'était indéfendable. Le glossaire complet est accessible à tout
        moment :{' '}
        <Link to="/glossaire" className="text-accent underline underline-offset-2">
          📖 Glossaire
        </Link>
        .
      </p>

      <Quiz
        quizId="oauth2/vocabulaire/decodage"
        questions={[
          {
            id: 'q1',
            question: 'Dans OAuth 2.0, le « Client », c’est…',
            options: [
              {
                text: 'Le navigateur de l’utilisateur',
                explanation:
                  'Non — le navigateur est le User-Agent. C’est LE contresens classique du vocabulaire OAuth2.',
              },
              {
                text: 'L’application qui consomme l’API, souvent un serveur',
                correct: true,
                explanation:
                  'Oui : « client » au sens « client de l’Authorization Server ». Un backend web est un Client au sens de la RFC 6749 §1.1.',
              },
              {
                text: 'L’utilisateur final',
                explanation: 'Non — l’utilisateur est le Resource Owner (RFC 6749 §1.1).',
              },
            ],
          },
          {
            id: 'q2',
            question: 'Qui émet les access tokens ?',
            options: [
              {
                text: 'Le Resource Server',
                explanation:
                  'Non : le RS les CONSOMME (il les valide et sert la ressource). C’est l’AS qui émet.',
              },
              {
                text: 'L’Authorization Server',
                correct: true,
                explanation:
                  'Oui — authentification de l’utilisateur, consentement, émission des tokens : c’est son métier (RFC 6749 §1.1).',
              },
              {
                text: 'Le Client, après consentement',
                explanation:
                  'Non : le Client ne fabrique jamais de token, il en OBTIENT. S’il pouvait s’en fabriquer, le protocole ne servirait à rien.',
              },
            ],
          },
          {
            id: 'q3',
            question: 'Un « authorization grant », c’est fondamentalement…',
            options: [
              {
                text: 'Un type de token d’accès',
                explanation:
                  'Non — le grant est ce qu’on ÉCHANGE contre un token, pas le token lui-même.',
              },
              {
                text: 'La preuve que le Resource Owner a donné son accord',
                correct: true,
                explanation:
                  'Exactement (RFC 6749 §1.3). L’authorization code en est la matérialisation la plus courante.',
              },
              {
                text: 'Le contrat commercial entre le Client et l’AS',
                explanation:
                  'Non — l’enregistrement du Client existe (client_id), mais le grant est un objet protocolaire, par utilisateur et par flow.',
              },
            ],
          },
          {
            id: 'q4',
            question: 'Pourquoi « bearer token » est-il un nom bien choisi ?',
            options: [
              {
                text: 'Parce qu’il décrit le format JWT du token',
                explanation:
                  'Non — bearer ne dit rien du format. Un bearer token peut être opaque ou JWT.',
              },
              {
                text: 'Parce qu’il énonce le risque : la détention suffit à l’utiliser',
                correct: true,
                explanation:
                  'Oui : « au porteur », comme un billet (RFC 6750). Toute la fin du module traite de cette propriété et de ses remèdes.',
              },
              {
                text: 'Parce qu’il indique que le token est chiffré',
                explanation:
                  'Non — rien n’est chiffré dans un bearer token en soi ; un JWT est signé et lisible par tous.',
              },
            ],
          },
        ]}
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
    real: 'L’application (souvent un serveur !)',
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
    real: 'La preuve que l’utilisateur a dit oui',
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
