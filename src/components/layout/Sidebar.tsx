import { Link } from '@tanstack/react-router'
import { curriculum, lessonKey } from '../../data/curriculum'
import { useAllProgress } from '../../db/hooks'
import { ProgressMenu } from './ProgressMenu'
import { ThemeToggle } from './ThemeToggle'

/**
 * Menu latéral persistant : modules → chapitres → leçons, avec état
 * (non commencé ○ / en cours ◐ / validé ●) issu de la persistance locale.
 */
export function Sidebar() {
  const { data: progress } = useAllProgress()
  const statusOf = (key: string) => progress?.find((p) => p.id === key)?.status

  return (
    <nav className="flex h-full flex-col bg-surface" aria-label="Navigation des modules">
      <div className="shrink-0 border-b border-line/80 p-4">
        <Link to="/" className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-ink">OIDApp</span>
          <span className="font-mono text-[10px] text-muted">OAuth2→OID4VP</span>
        </Link>
      </div>

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
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
                              params={{
                                moduleId: module.id,
                                chapitre: chapter.id,
                                lecon: lesson.id,
                              }}
                              className={`flex items-start gap-1.5 rounded-lg px-2 py-1 text-xs transition-colors hover:bg-surface-2 ${
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

        <div className="border-t border-line pt-3">
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
            Ressources
          </p>
          <ul className="space-y-1 text-xs">
            <li>
              <Link
                to="/glossaire"
                className="block rounded-lg px-2 py-1.5 text-ink/85 transition-colors hover:bg-surface-2 hover:text-ink"
                activeProps={{ className: 'bg-surface-2 text-accent' }}
              >
                Glossaire
              </Link>
            </li>
            <li>
              <Link
                to="/labo-crypto"
                className="block rounded-lg px-2 py-1.5 text-ink/85 transition-colors hover:bg-surface-2 hover:text-ink"
                activeProps={{ className: 'bg-surface-2 text-accent' }}
              >
                Crypto Lab
              </Link>
            </li>
            <li>
              <Link
                to="/carte-des-specs"
                className="block rounded-lg px-2 py-1.5 text-ink/85 transition-colors hover:bg-surface-2 hover:text-ink"
                activeProps={{ className: 'bg-surface-2 text-accent' }}
              >
                Carte des specs
              </Link>
            </li>
            <li>
              <Link
                to="/comparateur"
                className="block rounded-lg px-2 py-1.5 text-ink/85 transition-colors hover:bg-surface-2 hover:text-ink"
                activeProps={{ className: 'bg-surface-2 text-accent' }}
              >
                Comparateur
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <section
        className="shrink-0 border-t border-line bg-bg/35 p-3"
        aria-label="Options et paramètres"
      >
        <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
          Paramètres
        </p>
        <div className="space-y-2 rounded-2xl border border-line bg-surface/90 p-2 shadow-sm">
          <ProgressMenu placement="sidebar" />
          <ThemeToggle fullWidth />
        </div>
      </section>
    </nav>
  )
}
