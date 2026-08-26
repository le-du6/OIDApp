import 'fake-indexeddb/auto'
import { beforeEach, describe, expect, it } from 'vitest'
import { db } from './db'
import { buildProgressExport, clearAllProgress, importProgress } from './progress-io'

async function seed() {
  await db.lessonProgress.put({
    id: 'oauth2/ch/l',
    moduleId: 'oauth2',
    status: 'done',
    updatedAt: 1,
  })
  await db.quizScores.put({ lessonId: 'oauth2/ch/l', score: 4, total: 5, passedAt: 1 })
  await db.badges.put({ id: 'quiz:oauth2/ch/l', earnedAt: 1 })
}

describe('clearAllProgress', () => {
  beforeEach(async () => {
    await clearAllProgress()
  })

  it('vide les trois tables', async () => {
    await seed()
    expect(await db.lessonProgress.count()).toBe(1)
    await clearAllProgress()
    expect(await db.lessonProgress.count()).toBe(0)
    expect(await db.quizScores.count()).toBe(0)
    expect(await db.badges.count()).toBe(0)
  })

  it('un export après reset est vide, et un import le restaure', async () => {
    await seed()
    const snapshot = await buildProgressExport()
    await clearAllProgress()
    expect((await buildProgressExport()).lessonProgress).toHaveLength(0)
    await importProgress(snapshot)
    expect(await db.lessonProgress.count()).toBe(1)
    expect(await db.badges.count()).toBe(1)
  })
})
