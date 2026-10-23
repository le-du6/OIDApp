import { createContext, useContext } from 'react'
import type { HttpExchange, HttpParam } from '../../engine/scenario'
import { httpFieldGuide } from '../../lib/field-guide'
import { FieldExplanation } from '../content/FieldExplanation'
import { wireRequest } from '../../lib/http-view'
import {
  faArrowRightArrowLeft,
  faCode,
  faGlobe,
  faListCheck,
} from '@fortawesome/free-solid-svg-icons'
import { AppIcon } from '../ui/AppIcon'

const MessageActors = createContext({ sender: 'Émetteur', receiver: 'Destinataire' })

/** Raw serialization is always available beside explanations. Decoded examples are labelled. */
export function HttpRequestView({
  exchange,
  actors,
}: {
  exchange: HttpExchange
  actors?: { from: string; to: string }
}) {
  const { request, response, channel } = exchange
  const invocation = request.method === 'INVOKE'
  const requestActors = exchange.responseOnly
    ? { sender: actors?.to ?? 'Client', receiver: actors?.from ?? 'Serveur' }
    : { sender: actors?.from ?? 'Client', receiver: actors?.to ?? 'Serveur' }
  return (
    <MessageActors.Provider value={requestActors}>
      <div className="min-w-0 overflow-hidden rounded-xl border border-line">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-surface-2 px-3 py-2">
          <span className="flex items-center gap-2 text-xs font-semibold">
            <AppIcon
              icon={invocation ? faGlobe : faArrowRightArrowLeft}
              tone="accent"
              className="size-3.5"
            />
            {invocation ? 'Invocation du wallet — URI, pas requête HTTP' : 'Échange HTTP'}
          </span>
          <span className="rounded-full bg-accent-soft px-2 py-1 text-[11px] text-accent">
            {channel === 'front' ? 'Via l’agent utilisateur' : 'Appel direct entre acteurs'}
          </span>
        </div>
        <div className="space-y-4 p-3 text-xs">
          <p className="text-muted">
            {exchange.note ??
              'Exemple pédagogique. Les acteurs du diagramme précisent qui émet et reçoit ce message ; un appel direct ne signifie pas nécessairement client authentifié.'}
          </p>
          {!exchange.responseOnly && (
            <>
              <p className="flex items-center gap-2 font-semibold">
                <AppIcon icon={faCode} tone="client" className="size-3.5" />
                {invocation
                  ? 'URI d’invocation'
                  : `Requête · ${request.body?.representation === 'decoded' ? 'vue décodée, pas sérialisation réseau' : request.body?.representation === 'excerpt' ? 'extrait abrégé' : 'sérialisation affichée'}`}
              </p>
              <pre
                className="max-w-full overflow-x-auto rounded-lg bg-bg p-3 font-mono text-[11px] leading-relaxed"
                tabIndex={0}
              >
                {wireRequest(exchange)}
              </pre>
              {request.params && (
                <ParamTable
                  title="Paramètres d’URL (valeurs décodées)"
                  params={request.params}
                  location="Query de l’URI"
                />
              )}
              {request.headers && <Headers headers={request.headers} />}
              {request.body && (
                <>
                  <p className="text-muted">
                    Corps : {request.body.type}. Les valeurs ci-dessous sont expliquées après
                    décodage.
                  </p>
                  <BodyParams body={request.body} location="Corps de la requête" />
                </>
              )}
            </>
          )}
          {response && (
            <MessageActors.Provider
              value={{ sender: requestActors.receiver, receiver: requestActors.sender }}
            >
              <section className="space-y-3 border-t border-line pt-3">
                <h4 className="flex items-center gap-2 font-semibold">
                  <AppIcon icon={faArrowRightArrowLeft} tone="ok" className="size-3.5" />
                  Réponse ·{' '}
                  {response.body?.representation === 'decoded'
                    ? 'vue décodée, pas corps reçu sur le réseau'
                    : response.body?.representation === 'excerpt'
                      ? 'extrait abrégé'
                      : 'sérialisation affichée'}
                </h4>
                <pre
                  className="max-w-full overflow-x-auto rounded-lg bg-bg p-3 font-mono text-[11px] leading-relaxed"
                  tabIndex={0}
                >{`HTTP/1.1 ${response.status} ${response.statusText ?? ''}\n${Object.entries(
                  response.headers ?? {},
                )
                  .map(([k, v]) => `${k}: ${v}`)
                  .join('\n')}${response.body ? `\n\n${response.body.content}` : ''}`}</pre>
                {response.headers && <Headers headers={response.headers} />}
                {response.body && (
                  <BodyParams body={response.body} location="Corps de la réponse" />
                )}
              </section>
            </MessageActors.Provider>
          )}
        </div>
      </div>
    </MessageActors.Provider>
  )
}
function BodyParams({
  body,
  location,
}: {
  body: NonNullable<HttpExchange['request']['body']>
  location: string
}) {
  let params = body.params
  if (!params && body.type === 'json') {
    try {
      const object: unknown = JSON.parse(body.content)
      if (object && typeof object === 'object' && !Array.isArray(object))
        params = Object.entries(object).map(([name, value]) => ({
          name,
          value: typeof value === 'string' ? value : JSON.stringify(value),
        }))
    } catch {
      /* Excerpts are intentionally not complete JSON. */
    }
  }
  return params ? <ParamTable title="Champs expliqués" params={params} location={location} /> : null
}
function Headers({ headers }: { headers: Record<string, string> }) {
  return (
    <details>
      <summary className="cursor-pointer text-accent">
        <AppIcon icon={faListCheck} className="mr-1.5 inline size-3.5" />
        Comprendre les en-têtes
      </summary>
      <ParamTable
        title=""
        location="En-tête HTTP"
        params={Object.entries(headers).map(([name, value]) => ({ name, value }))}
      />
    </details>
  )
}
function ParamTable({
  title,
  params,
  location,
}: {
  title: string
  params: HttpParam[]
  location: string
}) {
  const actors = useContext(MessageActors)
  return (
    <div>
      {title && <h4 className="mb-2 font-semibold text-muted">{title}</h4>}
      <dl className="divide-y divide-line">
        {params.map((p) => {
          const common = httpFieldGuide(p.name)
          const guide = common
            ? {
                ...common,
                producer: actors.sender,
                recipient: actors.receiver,
                ...p.guide,
                description: p.description ?? common.description,
                specRef: p.specRef ?? common.specRef,
              }
            : undefined
          return (
            <div key={p.name} className="py-2">
              <dt className="font-mono font-semibold text-accent">{p.name}</dt>
              <dd>
                <code className="block break-all text-ink/90">{p.value}</code>
                {p.description && !guide && <p className="mt-1 text-muted">{p.description}</p>}
                {guide && <FieldExplanation guide={guide} location={location} />}
                {!guide && p.specRef && <p className="mt-1 text-muted">{p.specRef}</p>}
              </dd>
            </div>
          )
        })}
      </dl>
    </div>
  )
}
