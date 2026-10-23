import { createFileRoute, Link } from '@tanstack/react-router'
import { curriculum, lessonCount } from '../data/curriculum'
import { useAllProgress, useLastVisited, moduleProgress } from '../db/hooks'
import { ProgressRing } from '../components/layout/ProgressRing'
import { buildProgressExport, downloadProgressExport } from '../db/progress-io'
import {
  faAddressCard,
  faArrowRight,
  faDownload,
  faFingerprint,
  faFlaskVial,
  faKey,
  faLink,
  faShieldHalved,
  faSignature,
  faWandSparkles,
  faStamp,
} from '@fortawesome/free-solid-svg-icons'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { AppIcon } from '../components/ui/AppIcon'

const moduleIcons: Record<string, IconDefinition> = {
  oauth2: faKey,
  oidc: faFingerprint,
  oid4vci: faStamp,
  oid4vp: faAddressCard,
}

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

      <Link
        to="/labo-crypto"
        className="group relative block overflow-hidden rounded-2xl border border-accent/40 bg-gradient-to-br from-accent-soft via-surface to-ok-soft p-5 shadow-lg shadow-accent/5 transition-all hover:-translate-y-0.5 hover:border-accent hover:shadow-accent/10"
      >
        <AppIcon
          icon={faWandSparkles}
          className="absolute right-5 top-5 size-6 text-warning opacity-60 transition-transform group-hover:rotate-12 group-hover:scale-110"
        />
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-accent text-white shadow-lg shadow-accent/25">
            <AppIcon icon={faFlaskVial} className="size-6" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
              Expérience interactive
            </p>
            <h2 className="mt-1 text-xl font-bold">Crypto Lab</h2>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted">
              Manipulez les primitives réelles derrière les protocoles et suivez une même clé de
              l’émission à la présentation.
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-medium">
              <LabPill icon={faSignature} label="Signer et altérer" tone="accent" />
              <LabPill icon={faLink} label="Comprendre le key binding" tone="ok" />
              <LabPill icon={faShieldHalved} label="Observer les rejets" tone="danger" />
            </div>
          </div>
          <span className="flex shrink-0 items-center gap-2 text-sm font-semibold text-accent">
            Ouvrir le lab{' '}
            <AppIcon
              icon={faArrowRight}
              className="size-3 transition-transform group-hover:translate-x-1"
            />
          </span>
        </div>
      </Link>

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
                <h2 className="flex items-center gap-2 font-semibold">
                  <AppIcon
                    icon={moduleIcons[module.id] ?? faKey}
                    tone="accent"
                    className="size-3.5"
                  />
                  {module.shortTitle}
                </h2>
                <p className="text-xs font-medium text-muted">
                  <span className={done > 0 ? 'text-accent' : undefined}>{done}</span>/{total}{' '}
                  leçons
                </p>
                <p className="mt-0.5 line-clamp-2 text-xs text-muted">{module.description}</p>
                {!module.available && (
                  <p className="mt-1 text-[11px] font-medium text-accent">
                    {module.shortTitle} — à venir
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
          <span className="font-medium text-ink">Réglages</span>, en bas de la barre latérale.
        </p>
        <button
          type="button"
          onClick={() => void buildProgressExport().then(downloadProgressExport)}
          className="mt-3 rounded-md border border-line bg-surface-2 px-3 py-1.5 text-sm transition-colors hover:border-accent"
        >
          <AppIcon icon={faDownload} tone="accent" className="mr-2 inline size-3.5" />
          Exporter ma progression
        </button>
      </section>
    </div>
  )
}

function LabPill({
  icon,
  label,
  tone,
}: {
  icon: IconDefinition
  label: string
  tone: 'accent' | 'ok' | 'danger'
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface/75 px-2.5 py-1 text-ink/80">
      <AppIcon icon={icon} tone={tone} className="size-3" />
      {label}
    </span>
  )
}
