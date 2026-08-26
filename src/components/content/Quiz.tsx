import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { db } from '../../db/db'

/**
 * QCM de fin de leçon : chaque réponse (bonne ou mauvaise) a son explication.
 * Score persisté (IndexedDB) ; ≥ 80 % = badge + leçon marquée TERMINÉE.
 *
 * Invariant : `quizId` est exactement le lessonKey de la leçon
 * (moduleId/chapterId/lessonId) — c'est ce qui permet de compléter la leçon
 * automatiquement quand le quiz est réussi. Un test le vérifie pour les 32
 * leçons (src/content/registry.test.ts).
 */
export type QuizQuestion = {
  id: string
  question: string
  options: { text: string; correct?: boolean; explanation: string }[]
}

export const QUIZ_PASS_RATIO = 0.8

export function Quiz({ quizId, questions }: { quizId: string; questions: QuizQuestion[] }) {
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [submitted, setSubmitted] = useState(false)
  const queryClient = useQueryClient()

  const { data: previous } = useQuery({
    queryKey: ['quiz-score', quizId],
    queryFn: async () => (await db.quizScores.get(quizId)) ?? null,
  })

  const save = useMutation({
    mutationFn: async (score: number) => {
      await db.quizScores.put({
        lessonId: quizId,
        score,
        total: questions.length,
        passedAt: Date.now(),
      })
      if (score / questions.length >= QUIZ_PASS_RATIO) {
        await db.badges.put({ id: `quiz:${quizId}`, earnedAt: Date.now() })
        // Réussir le quiz TERMINE la leçon : c'est l'achèvement « naturel »,
        // sans obliger l'utilisateur à cliquer « Marquer comme terminée ».
        await db.lessonProgress.put({
          id: quizId,
          moduleId: quizId.split('/')[0] ?? '',
          status: 'done',
          updatedAt: Date.now(),
        })
      }
    },
    // Invalidation globale : score, badges, progression du module, sidebar.
    onSuccess: () => void queryClient.invalidateQueries(),
  })

  const score = questions.filter((q) => {
    const picked = answers[q.id]
    return picked !== undefined && q.options[picked]?.correct
  }).length
  const allAnswered = questions.every((q) => answers[q.id] !== undefined)
  const passed = score / questions.length >= QUIZ_PASS_RATIO

  const submit = () => {
    setSubmitted(true)
    save.mutate(score)
  }

  return (
    <section
      className="my-6 rounded-xl border border-line bg-surface p-5"
      aria-label="Quiz de validation"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-lg font-bold">✅ Quiz de validation</h2>
        {previous && (
          <p className="text-xs text-muted">
            Meilleur essai : {previous.score}/{previous.total}
          </p>
        )}
      </div>
      <ol className="mt-4 space-y-6">
        {questions.map((q, qi) => {
          const picked = answers[q.id]
          return (
            <li key={q.id}>
              <fieldset>
                <legend className="mb-2 font-medium">
                  {qi + 1}. {q.question}
                </legend>
                <div className="space-y-1.5">
                  {q.options.map((opt, oi) => {
                    const isPicked = picked === oi
                    const showState = submitted && (isPicked || opt.correct)
                    return (
                      <div key={oi}>
                        <label
                          className={`flex cursor-pointer items-start gap-2.5 rounded-lg border p-2.5 text-sm transition-colors ${
                            showState
                              ? opt.correct
                                ? 'border-ok bg-ok-soft'
                                : 'border-danger bg-danger-soft'
                              : isPicked
                                ? 'border-accent bg-accent-soft'
                                : 'border-line hover:border-muted'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`${quizId}-${q.id}`}
                            checked={isPicked}
                            disabled={submitted}
                            onChange={() => setAnswers((a) => ({ ...a, [q.id]: oi }))}
                            className="mt-0.5 accent-[var(--accent)]"
                          />
                          <span>{opt.text}</span>
                        </label>
                        {submitted && (isPicked || opt.correct) && (
                          <p className="mt-1 pl-8 text-xs leading-relaxed text-muted">
                            {opt.correct ? '✓' : '✗'} {opt.explanation}
                          </p>
                        )}
                      </div>
                    )
                  })}
                </div>
              </fieldset>
            </li>
          )
        })}
      </ol>
      <div className="mt-5 flex items-center gap-4">
        {!submitted ? (
          <button
            type="button"
            onClick={submit}
            disabled={!allAnswered}
            className="rounded-md border border-accent bg-accent-soft px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-white disabled:opacity-40"
          >
            Valider mes réponses
          </button>
        ) : (
          <>
            <p className={`text-sm font-semibold ${passed ? 'text-ok' : 'text-warning'}`}>
              {score}/{questions.length} —{' '}
              {passed ? 'leçon validée, badge gagné 🏅' : 'relisez et retentez !'}
            </p>
            <button
              type="button"
              onClick={() => {
                setAnswers({})
                setSubmitted(false)
              }}
              className="rounded-md border border-line px-3 py-1.5 text-sm transition-colors hover:border-accent"
            >
              Recommencer
            </button>
          </>
        )}
      </div>
    </section>
  )
}
