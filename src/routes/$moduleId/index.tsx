import { coverage } from '../../data/coverage'
import { CompareTable } from '../../components/content/CompareTable'
import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { getModule, lessonKey } from '../../data/curriculum'
import { useAllProgress } from '../../db/hooks'
import {
  faBookBookmark,
  faCheck,
  faCircleHalfStroke,
  faCirclePlay,
  faHammer,
} from '@fortawesome/free-solid-svg-icons'
import { AppIcon } from '../../components/ui/AppIcon'

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
            <AppIcon icon={faBookBookmark} className="mr-2 inline size-3" />
            Version de référence : {module.specVersions.join(' · ')}
          </p>
        )}
      </div>
      <details className="rounded-xl border border-line bg-surface p-4 text-sm">
        <summary className="cursor-pointer font-semibold text-accent">
          Ce que ce module démontre et ce qu’il introduit
        </summary>
        <CompareTable
          caption="Profondeur du parcours"
          rowHeading="Sujet"
          columns={['Niveau', 'Portée']}
          rows={(coverage[moduleId] ?? []).map(([label, level, detail]) => ({
            label,
            cells: [{ content: level }, { content: detail }],
          }))}
        />
      </details>
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
                        <span className="text-ok">
                          <AppIcon icon={faCheck} className="mr-1 inline size-3" />
                          validée
                        </span>
                      ) : status === 'in-progress' ? (
                        <span className="text-accent">
                          <AppIcon icon={faCircleHalfStroke} className="mr-1 inline size-3" />
                          en cours
                        </span>
                      ) : lesson.ready ? (
                        <span className="text-muted">
                          <AppIcon icon={faCirclePlay} className="mr-1 inline size-3" />à commencer
                        </span>
                      ) : (
                        <span className="text-muted/60">
                          <AppIcon icon={faHammer} className="mr-1 inline size-3" />
                          en construction
                        </span>
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
