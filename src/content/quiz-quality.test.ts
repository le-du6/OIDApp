import { describe, expect, it } from 'vite-plus/test'
import { quizBank } from '../data/quiz-bank'
import { curriculum, lessonKey } from '../data/curriculum'
describe('Révision des quiz', () => {
  const questions = Object.values(quizBank).flat()
  it('couvre chaque leçon avec des questions univoques', () => {
    for (const m of curriculum)
      for (const c of m.chapters)
        for (const l of c.lessons)
          expect(quizBank[lessonKey(m.id, c.id, l.id)]?.length).toBeGreaterThanOrEqual(3)
    for (const q of questions) {
      expect(q.options.filter((o) => o.correct)).toHaveLength(1)
      expect(new Set(q.options.map((o) => o.text)).size).toBe(q.options.length)
    }
  })
  it('ne récompense plus systématiquement la réponse la plus longue ou la plus courte', () => {
    for (const extreme of [Math.max, Math.min]) {
      const matches = questions.filter((q) => {
        const sizes = q.options.map((o) => o.text.length)
        return sizes[q.options.findIndex((o) => o.correct)] === extreme(...sizes)
      }).length
      expect(matches / questions.length).toBeLessThan(0.4)
    }
    for (let i = 0; i < 3; i++)
      expect(questions.filter((q) => q.options[i]?.correct).length / questions.length).toBeLessThan(
        0.4,
      )
  })
})
