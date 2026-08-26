import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { db, type LessonProgress, type LessonStatus } from './db'
import { clearAllProgress, importProgress } from './progress-io'

/**
 * Dexie exposé via TanStack Query.
 * Choix (vs TanStack DB, cf. README) : Query suffit ici — lectures simples,
 * invalidation par clé, pas de requêtes relationnelles ni de sync temps réel.
 */

const progressKey = ['lesson-progress'] as const

export function useAllProgress() {
  return useQuery({
    queryKey: progressKey,
    queryFn: () => db.lessonProgress.toArray(),
  })
}

export function useLastVisited() {
  return useQuery({
    queryKey: [...progressKey, 'last'],
    queryFn: async (): Promise<LessonProgress | null> => {
      const last = await db.lessonProgress.orderBy('updatedAt').last()
      return last ?? null
    },
  })
}

export function useSetLessonStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: { lessonKey: string; moduleId: string; status: LessonStatus }) => {
      await db.lessonProgress.put({
        id: input.lessonKey,
        moduleId: input.moduleId,
        status: input.status,
        updatedAt: Date.now(),
      })
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: progressKey }),
  })
}

/**
 * Réinitialise toute la progression (leçons, quiz, badges) puis rafraîchit
 * toutes les vues. Invalidation globale : les scores de quiz et badges
 * utilisent leurs propres clés de requête, un invalidateQueries() sans filtre
 * les couvre tous d'un coup.
 */
export function useResetProgress() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: clearAllProgress,
    onSuccess: () => queryClient.invalidateQueries(),
  })
}

/** Importe une sauvegarde JSON (remplace la progression) puis rafraîchit tout. */
export function useImportProgress() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (json: unknown) => importProgress(json),
    onSuccess: () => queryClient.invalidateQueries(),
  })
}

/** Progression d'un module : { done, total } dérivé de la table + du curriculum. */
export function moduleProgress(
  progress: LessonProgress[] | undefined,
  moduleId: string,
  total: number,
): { done: number; total: number; ratio: number } {
  const done = (progress ?? []).filter((p) => p.moduleId === moduleId && p.status === 'done').length
  return { done, total, ratio: total === 0 ? 0 : done / total }
}
