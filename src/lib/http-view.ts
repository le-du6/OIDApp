import type { HttpExchange } from '../engine/scenario'
export function requestTarget(request: HttpExchange['request']): string {
  const url = new URL(request.url)
  for (const param of request.params ?? []) url.searchParams.set(param.name, param.value)
  return url.toString()
}
export function wireRequest(exchange: HttpExchange): string {
  const { request } = exchange
  const target = requestTarget(request)
  if (request.method === 'INVOKE') return target
  const url = new URL(target)
  const headers = { Host: url.host, ...request.headers }
  return `${request.method} ${url.pathname}${url.search} HTTP/1.1\n${Object.entries(headers)
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n')}${request.body ? `\n\n${request.body.content}` : ''}`
}
