import { z } from 'zod'
import { db } from './db'

/**
 * Export / import JSON de la progression — la « sauvegarde » de l'utilisateur,
 * puisqu'il n'y a ni compte ni backend.
 */

const exportSchema = z.object({
  app: z.literal('oidapp'),
  version: z.literal(1),
  exportedAt: z.string(),
  lessonProgress: z.array(
    z.object({
      id: z.string(),
      moduleId: z.string(),
      status: z.enum(['in-progress', 'done']),
      updatedAt: z.number(),
    }),
  ),
  quizScores: z.array(
    z.object({
      lessonId: z.string(),
      score: z.number(),
      total: z.number(),
      passedAt: z.number(),
    }),
  ),
  badges: z.array(z.object({ id: z.string(), earnedAt: z.number() })),
})

export type ProgressExport = z.infer<typeof exportSchema>

export async function buildProgressExport(): Promise<ProgressExport> {
  return {
    app: 'oidapp',
    version: 1,
    exportedAt: new Date().toISOString(),
    lessonProgress: await db.lessonProgress.toArray(),
    quizScores: await db.quizScores.toArray(),
    badges: await db.badges.toArray(),
  }
}

export function downloadProgressExport(data: ProgressExport): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `oidapp-progression-${data.exportedAt.slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

/** Efface toute la progression locale (leçons, quiz, badges). Irréversible. */
export async function clearAllProgress(): Promise<void> {
  await db.transaction('rw', db.lessonProgress, db.quizScores, db.badges, async () => {
    await Promise.all([db.lessonProgress.clear(), db.quizScores.clear(), db.badges.clear()])
  })
}

/** Importe un export : remplace la progression courante (après validation Zod). */
export async function importProgress(json: unknown): Promise<void> {
  const data = exportSchema.parse(json)
  await db.transaction('rw', db.lessonProgress, db.quizScores, db.badges, async () => {
    await Promise.all([db.lessonProgress.clear(), db.quizScores.clear(), db.badges.clear()])
    await db.lessonProgress.bulkPut(data.lessonProgress)
    await db.quizScores.bulkPut(data.quizScores)
    await db.badges.bulkPut(data.badges)
  })
}
