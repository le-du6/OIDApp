import type { HttpExchange, HttpParam } from '../../engine/scenario'

const methodColors: Record<string, string> = {
  GET: 'text-ok',
  POST: 'text-accent',
  PUT: 'text-warning',
  DELETE: 'text-danger',
}

/**
 * Affichage formaté d'un échange HTTP : méthode, URL, paramètres annotés
 * (survol = définition + référence de spec), headers, body, réponse.
 */
export function HttpRequestView({ exchange }: { exchange: HttpExchange }) {
  const { request, response, channel } = exchange
  return (
    <div className="overflow-hidden rounded-lg border border-line">
      <div className="flex items-center justify-between gap-2 border-b border-line bg-surface-2 px-3 py-2">
        <span className="text-xs font-semibold text-muted">Échange HTTP</span>
        <span
          className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
            channel === 'front' ? 'bg-warning-soft text-warning' : 'bg-ok-soft text-ok'
          }`}
          title={
            channel === 'front'
              ? 'Front channel : transite par le navigateur — observable et manipulable.'
              : 'Back channel : serveur à serveur — TLS, authentifié, invisible du navigateur.'
          }
        >
          {channel === 'front' ? 'front channel' : 'back channel'}
        </span>
      </div>
      <div className="space-y-3 p-3 font-mono text-xs leading-relaxed">
        <p className="break-all">
          <span className={`font-bold ${methodColors[request.method] ?? 'text-ink'}`}>
            {request.method}
          </span>{' '}
          <span className="text-ink">{request.url}</span>
        </p>
        {request.params && request.params.length > 0 && (
          <ParamTable title="Paramètres" params={request.params} />
        )}
        {request.headers && <HeaderList headers={request.headers} />}
        {request.body && (
          <div>
            <p className="mb-1 text-muted">Body ({request.body.type})</p>
            {request.body.params ? (
              <ParamTable title="" params={request.body.params} />
            ) : (
              <pre className="overflow-x-auto rounded bg-bg p-2 text-[11px]">
                {request.body.content}
              </pre>
            )}
          </div>
        )}
        {response && (
          <div className="border-t border-line pt-3">
            <p>
              <span
                className={`font-bold ${
                  response.status < 300
                    ? 'text-ok'
                    : response.status < 400
                      ? 'text-warning'
                      : 'text-danger'
                }`}
              >
                {response.status}
              </span>{' '}
              <span className="text-muted">{response.statusText}</span>
            </p>
            {response.headers && <HeaderList headers={response.headers} />}
            {response.body && (
              <pre className="mt-2 overflow-x-auto rounded bg-bg p-2 text-[11px] whitespace-pre-wrap break-all">
                {response.body.content}
              </pre>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function ParamTable({ title, params }: { title: string; params: HttpParam[] }) {
  return (
    <div>
      {title && <p className="mb-1 text-muted">{title}</p>}
      <table className="w-full border-collapse">
        <tbody>
          {params.map((p) => (
            <tr key={p.name} className="border-b border-line/50 last:border-0 align-top">
              <td className="py-1 pr-2">
                <span
                  className="cursor-help border-b border-dotted border-muted text-accent"
                  title={[p.description, p.specRef ? `📜 ${p.specRef}` : null]
                    .filter(Boolean)
                    .join('\n')}
                >
                  {p.name}
                </span>
              </td>
              <td className="break-all py-1 text-ink/90">{p.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function HeaderList({ headers }: { headers: Record<string, string> }) {
  return (
    <div className="mt-1 space-y-0.5">
      {Object.entries(headers).map(([name, value]) => (
        <p key={name} className="break-all">
          <span className="text-muted">{name}:</span> <span className="text-ink/90">{value}</span>
        </p>
      ))}
    </div>
  )
}
