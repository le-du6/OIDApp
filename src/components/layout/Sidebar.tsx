import { Link } from '@tanstack/react-router'
import { curriculum, lessonKey } from '../../data/curriculum'
import { useAllProgress } from '../../db/hooks'

/**
 * Menu latéral persistant : modules → chapitres → leçons, avec état
 * (non commencé ○ / en cours ◐ / validé ●) issu de la persistance locale.
 */
export function Sidebar() {
  const { data: progress } = useAllProgress()
  const statusOf = (key: string) => progress?.find((p) => p.id === key)?.status

  return (
    <nav
      className="flex h-full flex-col gap-4 overflow-y-auto p-4"
      aria-label="Navigation des modules"
    >
      <Link to="/" className="flex items-baseline gap-2">
        <span className="text-lg font-bold text-ink">OIDApp</span>
        <span className="font-mono text-[10px] text-muted">OAuth2→OID4VP</span>
      </Link>

      {curriculum.map((module) => (
        <div key={module.id}>
          {module.available ? (
            <Link
              to="/$moduleId"
              params={{ moduleId: module.id }}
              className="text-sm font-semibold text-ink transition-colors hover:text-accent"
            >
              {module.shortTitle}
            </Link>
          ) : (
            <p className="flex items-center gap-2 text-sm font-semibold text-muted/60">
              {module.shortTitle}
              <span className="rounded-full border border-line px-1.5 py-0.5 text-[10px]">
                Phase {module.phase}
              </span>
            </p>
          )}
          {module.available && (
            <ul className="mt-2 space-y-2 border-l border-line pl-3">
              {module.chapters.map((chapter) => (
                <li key={chapter.id}>
                  <p className="text-xs font-medium text-muted">
                    <span className="font-mono">{chapter.number}.</span> {chapter.title}
                  </p>
                  <ul className="mt-1 space-y-0.5">
                    {chapter.lessons.map((lesson) => {
                      const key = lessonKey(module.id, chapter.id, lesson.id)
                      const status = statusOf(key)
                      const dot = status === 'done' ? '●' : status === 'in-progress' ? '◐' : '○'
                      const dotColor =
                        status === 'done'
                          ? 'text-ok'
                          : status === 'in-progress'
                            ? 'text-accent'
                            : 'text-muted'
                      return (
                        <li key={lesson.id}>
                          <Link
                            to="/$moduleId/$chapitre/$lecon"
                            params={{ moduleId: module.id, chapitre: chapter.id, lecon: lesson.id }}
                            className={`flex items-start gap-1.5 rounded px-1.5 py-1 text-xs transition-colors hover:bg-surface-2 ${
                              lesson.ready ? 'text-ink/90' : 'text-muted/70'
                            }`}
                            activeProps={{ className: 'bg-surface-2 text-accent' }}
                          >
                            <span className={dotColor} aria-hidden>
                              {dot}
                            </span>
                            <span>{lesson.title}</span>
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}

      <div className="mt-auto border-t border-line pt-3">
        <p className="mb-1 text-xs font-semibold text-muted">Transversal</p>
        <ul className="space-y-0.5 text-xs text-muted/70">
          <li>Glossaire (bientôt)</li>
          <li>Crypto Lab (bientôt)</li>
          <li>Carte des specs (bientôt)</li>
          <li>Comparateur (bientôt)</li>
        </ul>
      </div>
    </nav>
  )
}
