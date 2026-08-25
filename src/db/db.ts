import Dexie, { type EntityTable } from 'dexie'

/**
 * Persistance locale (IndexedDB via Dexie).
 * Aucune donnée ne sort du navigateur : pas de compte, pas de backend.
 * L'export/import JSON (progress-io.ts) sert de sauvegarde portable.
 */

export type LessonStatus = 'in-progress' | 'done'

export type LessonProgress = {
  /** lessonKey : moduleId/chapterId/lessonId */
  id: string
  moduleId: string
  status: LessonStatus
  updatedAt: number
}

export type QuizScore = {
  /** lessonKey de la leçon portant le quiz. */
  lessonId: string
  score: number
  total: number
  passedAt: number
}

export type Badge = {
  id: string
  earnedAt: number
}

export type Pref = {
  key: string
  value: string
}

export const db = new Dexie('oidapp') as Dexie & {
  lessonProgress: EntityTable<LessonProgress, 'id'>
  quizScores: EntityTable<QuizScore, 'lessonId'>
  badges: EntityTable<Badge, 'id'>
  prefs: EntityTable<Pref, 'key'>
}

db.version(1).stores({
  lessonProgress: 'id, moduleId, updatedAt',
  quizScores: 'lessonId, passedAt',
  badges: 'id',
  prefs: 'key',
})
