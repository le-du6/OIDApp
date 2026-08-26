import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { getModule, lessonKey } from '../../data/curriculum'
import { useAllProgress } from '../../db/hooks'

export const Route = createFileRoute('/$moduleId/')({
  loader: ({ params }) => {
    const module = getModule(params.moduleId)
    if (!module || !module.available) throw notFound()
    return { moduleId: params.moduleId }
  },
  component: ModulePage,
})

/** Page d'un module : liste des chapitres et de leurs leçons, avec état. */
function ModulePage() {
  const { moduleId } = Route.useLoaderData()
  const module = getModule(moduleId)!
  const { data: progress } = useAllProgress()

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{module.title}</h1>
        <p className="mt-1 text-sm text-muted">{module.description}</p>
        {module.specVersions && (
          <p className="mt-2 font-mono text-xs text-muted">
            📜 Version de référence : {module.specVersions.join(' · ')}
          </p>
        )}
      </div>
      <ol className="space-y-4">
        {module.chapters.map((chapter) => (
          <li key={chapter.id} className="rounded-xl border border-line bg-surface p-4">
            <h2 className="font-semibold">
              <span className="font-mono text-accent">{chapter.number}.</span> {chapter.title}
            </h2>
            <ul className="mt-2 space-y-1">
              {chapter.lessons.map((lesson) => {
                const key = lessonKey(module.id, chapter.id, lesson.id)
                const status = progress?.find((p) => p.id === key)?.status
                return (
                  <li key={lesson.id} className="flex items-center justify-between gap-2">
                    <Link
                      to="/$moduleId/$chapitre/$lecon"
                      params={{ moduleId: module.id, chapitre: chapter.id, lecon: lesson.id }}
                      className="text-sm text-ink/90 underline-offset-4 transition-colors hover:text-accent hover:underline"
                    >
                      {lesson.title}
                    </Link>
                    <span className="shrink-0 text-xs">
                      {status === 'done' ? (
                        <span className="text-ok">✓ validée</span>
                      ) : status === 'in-progress' ? (
                        <span className="text-accent">en cours</span>
                      ) : lesson.ready ? (
                        <span className="text-muted">à commencer</span>
                      ) : (
                        <span className="text-muted/60">en construction</span>
                      )}
                    </span>
                  </li>
                )
              })}
            </ul>
          </li>
        ))}
      </ol>
    </div>
  )
}
