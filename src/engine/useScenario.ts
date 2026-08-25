import { useQuery } from '@tanstack/react-query'
import { parseScenario, type Scenario } from './scenario'

/**
 * Charge un scénario JSON statique (public/scenarios/<id>.json) via TanStack
 * Query, puis le valide avec Zod : un scénario mal formé échoue bruyamment
 * au chargement plutôt que silencieusement au rendu.
 */
export function useScenario(scenarioId: string) {
  return useQuery<Scenario>({
    queryKey: ['scenario', scenarioId],
    staleTime: Infinity,
    queryFn: async () => {
      const url = `${import.meta.env.BASE_URL}scenarios/${scenarioId}.json`
      const res = await fetch(url)
      if (!res.ok) {
        throw new Error(`Scénario introuvable : ${url} (HTTP ${res.status})`)
      }
      return parseScenario(await res.json())
    },
  })
}
