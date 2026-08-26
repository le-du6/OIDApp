import { createFileRoute, Link } from '@tanstack/react-router'
import { curriculum, lessonCount } from '../data/curriculum'
import { useAllProgress, useLastVisited, moduleProgress } from '../db/hooks'
import { ProgressRing } from '../components/layout/ProgressRing'
import { buildProgressExport, downloadProgressExport } from '../db/progress-io'

export const Route = createFileRoute('/')({
  component: Dashboard,
})

/** Dashboard d'accueil : progression par module, reprise, export de sauvegarde. */
function Dashboard() {
  const { data: progress } = useAllProgress()
  const { data: last } = useLastVisited()

  const lastParts = last?.id.split('/')

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <section>
        <h1 className="text-2xl font-bold">Votre progression</h1>
        <p className="mt-1 text-sm text-muted">
          Quatre protocoles, un fil rouge : à chaque mécanisme, la question « quel problème de
          sécurité ce truc résout-il, et que se passerait-il sans lui ? »
        </p>
      </section>

      {last && lastParts && lastParts.length === 3 && (
        <Link
          to="/$moduleId/$chapitre/$lecon"
          params={{ moduleId: lastParts[0]!, chapitre: lastParts[1]!, lecon: lastParts[2]! }}
          className="block rounded-xl border border-accent bg-accent-soft p-4 transition-transform hover:-translate-y-0.5"
        >
          <p className="text-xs font-semibold text-accent">Reprendre où vous en étiez</p>
          <p className="mt-1 font-mono text-sm">{last.id}</p>
        </Link>
      )}

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {curriculum.map((module) => {
          const total = lessonCount(module)
          const { done, ratio } = moduleProgress(progress, module.id, total)
          const card = (
            <div
              className={`flex h-full items-center gap-4 rounded-xl border border-line bg-surface p-4 ${
                module.available
                  ? 'transition-transform hover:-translate-y-0.5 hover:border-accent'
                  : 'opacity-55'
              }`}
            >
              <ProgressRing
                ratio={ratio}
                label={`${module.shortTitle} : ${done}/${total} leçons`}
              />
              <div className="min-w-0">
                <h2 className="font-semibold">{module.shortTitle}</h2>
                <p className="mt-0.5 line-clamp-3 text-xs text-muted">{module.description}</p>
                {!module.available && (
                  <p className="mt-1 text-[11px] font-medium text-accent">
                    Phase {module.phase} — à venir
                  </p>
                )}
              </div>
            </div>
          )
          return module.available ? (
            <Link key={module.id} to="/$moduleId" params={{ moduleId: module.id }}>
              {card}
            </Link>
          ) : (
            <div key={module.id}>{card}</div>
          )
        })}
      </section>

      <section className="rounded-xl border border-line bg-surface p-4 text-sm">
        <h2 className="font-semibold">Sauvegarde</h2>
        <p className="mt-1 text-xs text-muted">
          Votre progression ne quitte jamais ce navigateur (IndexedDB). Exportez-la en JSON pour la
          transférer ou la conserver. Import et réinitialisation sont dans le menu{' '}
          <span className="font-medium text-ink">📊 Progression</span> (en haut à droite).
        </p>
        <button
          type="button"
          onClick={() => void buildProgressExport().then(downloadProgressExport)}
          className="mt-3 rounded-md border border-line bg-surface-2 px-3 py-1.5 text-sm transition-colors hover:border-accent"
        >
          ⬇ Exporter ma progression
        </button>
      </section>
    </div>
  )
}
