import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { curriculum, lessonKey } from '../data/curriculum'

/**
 * Invariant dont dépend l'auto-complétion des leçons : le `quizId` de chaque
 * quiz DOIT être le lessonKey de la leçon qui le contient. Sans cela, réussir
 * un quiz marquerait « terminée » une leçon inexistante — silencieusement.
 */
describe('quizId ↔ lessonKey', () => {
  const contentDir = join(__dirname)
  const quizIds = readdirSync(contentDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .flatMap((d) =>
      readdirSync(join(contentDir, d.name))
        .filter((f) => f.endsWith('.tsx'))
        .flatMap((f) => {
          const src = readFileSync(join(contentDir, d.name, f), 'utf-8')
          return [...src.matchAll(/quizId="([^"]+)"/g)].map((m) => ({
            file: `${d.name}/${f}`,
            id: m[1]!,
          }))
        }),
    )

  const allKeys = new Set(
    curriculum.flatMap((m) =>
      m.chapters.flatMap((c) => c.lessons.map((l) => lessonKey(m.id, c.id, l.id))),
    ),
  )

  it('trouve un quiz dans chaque fichier de leçon', () => {
    expect(quizIds.length).toBeGreaterThanOrEqual(32)
  })

  it('chaque quizId correspond à une leçon du curriculum', () => {
    for (const { file, id } of quizIds) {
      expect(allKeys.has(id), `${file} : quizId « ${id} » sans leçon correspondante`).toBe(true)
    }
  })

  it('le moduleId dérivé du quizId (préfixe) est un module existant', () => {
    const modules = new Set(curriculum.map((m) => m.id))
    for (const { id } of quizIds) expect(modules.has(id.split('/')[0]!)).toBe(true)
  })
})
