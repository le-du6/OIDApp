import { Suspense, useEffect } from 'react'
import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { getLesson, getModule, lessonKey } from '../../data/curriculum'
import { useAllProgress, useSetLessonStatus } from '../../db/hooks'
import { ScenarioLoader } from '../../components/sequence/AttackScenario'
import { lessonComponents } from '../../content/registry'

export const Route = createFileRoute('/$moduleId/$chapitre/$lecon')({
  loader: ({ params }) => {
    const found = getLesson(params.moduleId, params.chapitre, params.lecon)
    if (!found) throw notFound()
    return params
  },
  component: LessonPage,
})

/** Leçons voisines (précédente / suivante) dans l'ordre du module. */
function neighbors(moduleId: string, chapterId: string, lessonId: string) {
  const module = getModule(moduleId)
  if (!module) return { prev: null, next: null }
  const flat = module.chapters.flatMap((c) => c.lessons.map((l) => ({ chapter: c, lesson: l })))
  const i = flat.findIndex((e) => e.chapter.id === chapterId && e.lesson.id === lessonId)
  return { prev: flat[i - 1] ?? null, next: flat[i + 1] ?? null }
}

function LessonPage() {
  const params = Route.useLoaderData()
  const { module, chapter, lesson } = getLesson(params.moduleId, params.chapitre, params.lecon)!
  const key = lessonKey(module.id, chapter.id, lesson.id)
  const { data: progress } = useAllProgress()
  const setStatus = useSetLessonStatus()
  const status = progress?.find((p) => p.id === key)?.status
  const { prev, next } = neighbors(module.id, chapter.id, lesson.id)

  // Ouvrir une leçon la marque « en cours » (jamais de rétrogradation).
  useEffect(() => {
    if (lesson.ready && status === undefined) {
      setStatus.mutate({ lessonKey: key, moduleId: module.id, status: 'in-progress' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, status === undefined])

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <nav className="text-xs text-muted" aria-label="Fil d'Ariane">
        <Link to="/$moduleId" params={{ moduleId: module.id }} className="hover:text-accent">
          {module.shortTitle}
        </Link>
        {' / '}
        <span>
          {chapter.number}. {chapter.title}
        </span>
      </nav>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">{lesson.title}</h1>
        {lesson.ready && (
          <button
            type="button"
            onClick={() =>
              setStatus.mutate({ lessonKey: key, moduleId: module.id, status: 'done' })
            }
            disabled={status === 'done'}
            className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
              status === 'done'
                ? 'border-ok bg-ok-soft text-ok'
                : 'border-line bg-surface-2 hover:border-ok'
            }`}
          >
            {status === 'done' ? '✓ Leçon validée' : 'Marquer comme terminée'}
          </button>
        )}
      </div>

      <LessonBody lessonId={key} scenarioId={lesson.scenarioId} ready={lesson.ready} />

      <nav
        className="flex justify-between border-t border-line pt-4 text-sm"
        aria-label="Leçons voisines"
      >
        {prev ? (
          <Link
            to="/$moduleId/$chapitre/$lecon"
            params={{ moduleId: module.id, chapitre: prev.chapter.id, lecon: prev.lesson.id }}
            className="text-muted transition-colors hover:text-accent"
          >
            ← {prev.lesson.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            to="/$moduleId/$chapitre/$lecon"
            params={{ moduleId: module.id, chapitre: next.chapter.id, lecon: next.lesson.id }}
            className="text-right text-muted transition-colors hover:text-accent"
          >
            {next.lesson.title} →
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </div>
  )
}

/** Corps de la leçon : contenu rédigé si présent, sinon scénario seul, sinon 🚧. */
function LessonBody({
  lessonId,
  scenarioId,
  ready,
}: {
  lessonId: string
  scenarioId?: string
  ready: boolean
}) {
  const Content = lessonComponents[lessonId]
  if (Content) {
    return (
      <Suspense fallback={<p className="text-sm text-muted">Chargement de la leçon…</p>}>
        <Content />
      </Suspense>
    )
  }
  if (ready && scenarioId) {
    return <ScenarioLoader scenarioId={scenarioId} />
  }
  return (
    <div className="rounded-xl border border-dashed border-line bg-surface p-8 text-center text-sm text-muted">
      <p className="text-2xl">🚧</p>
      <p className="mt-2">
        Leçon en construction — elle arrive avec la suite de la Phase 1 (contenu rédigé, quiz,
        scénarios).
      </p>
    </div>
  )
}
