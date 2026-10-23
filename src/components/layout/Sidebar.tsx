import { Link } from '@tanstack/react-router'
import {
  faAddressCard,
  faBookOpen,
  faCircleCheck,
  faCircleHalfStroke,
  faDiagramProject,
  faFingerprint,
  faFlaskVial,
  faKey,
  faScaleBalanced,
  faWandSparkles,
  faStamp,
} from '@fortawesome/free-solid-svg-icons'
import { faCircle as faCircleRegular } from '@fortawesome/free-regular-svg-icons'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { curriculum, lessonKey } from '../../data/curriculum'
import { useAllProgress } from '../../db/hooks'
import { AppIcon } from '../ui/AppIcon'
import { ProgressMenu } from './ProgressMenu'

const moduleIcons: Record<string, IconDefinition> = {
  oauth2: faKey,
  oidc: faFingerprint,
  oid4vci: faStamp,
  oid4vp: faAddressCard,
}

export function Sidebar() {
  const { data: progress } = useAllProgress()
  const statusOf = (key: string) => progress?.find((p) => p.id === key)?.status
  return (
    <nav className="flex h-full flex-col bg-surface" aria-label="Navigation des modules">
      <div className="shrink-0 border-b border-line/80 p-4">
        <Link to="/" className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-xl bg-accent text-sm font-black text-white shadow-lg shadow-accent/20">
            O
          </span>
          <span>
            <span className="block text-base font-bold leading-none text-ink">OIDApp</span>
            <span className="mt-1 block font-mono text-[9px] text-muted">OAuth2 → OID4VP</span>
          </span>
        </Link>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        <Link
          to="/labo-crypto"
          className="group mb-4 block overflow-hidden rounded-2xl border border-accent/35 bg-gradient-to-br from-accent-soft via-surface-2 to-ok-soft p-3 transition-all hover:-translate-y-0.5 hover:border-accent hover:shadow-lg hover:shadow-accent/10"
          activeProps={{ className: 'border-accent ring-1 ring-accent/30' }}
        >
          <div className="flex items-start gap-3">
            <span className="relative grid size-10 shrink-0 place-items-center rounded-xl bg-accent text-white shadow-md">
              <AppIcon icon={faFlaskVial} className="size-4" />
              <AppIcon
                icon={faWandSparkles}
                className="absolute -right-1 -top-1 size-3 text-warning"
              />
            </span>
            <span className="min-w-0">
              <span className="block text-xs font-bold text-ink">Crypto Lab</span>
              <span className="mt-0.5 block text-[10px] leading-relaxed text-muted">
                Signer, altérer, lier et vérifier pour de vrai.
              </span>
            </span>
          </div>
        </Link>

        <div className="space-y-4">
          {curriculum.map((module) => (
            <div key={module.id}>
              <Link
                to="/$moduleId"
                params={{ moduleId: module.id }}
                className="flex items-center gap-2 px-1 text-xs font-semibold text-ink transition-colors hover:text-accent"
                activeProps={{ className: 'text-accent' }}
              >
                <AppIcon icon={moduleIcons[module.id] ?? faKey} className="size-3.5" />
                {module.shortTitle}
              </Link>
              <ul className="mt-2 space-y-2 border-l border-line pl-3">
                {module.chapters.map((chapter) => (
                  <li key={chapter.id}>
                    <p className="text-[11px] font-medium leading-tight text-muted">
                      <span className="font-mono text-accent/80">{chapter.number}.</span>{' '}
                      {chapter.title}
                    </p>
                    <ul className="mt-1 space-y-0.5">
                      {chapter.lessons.map((lesson) => {
                        const key = lessonKey(module.id, chapter.id, lesson.id)
                        const status = statusOf(key)
                        const statusIcon =
                          status === 'done'
                            ? faCircleCheck
                            : status === 'in-progress'
                              ? faCircleHalfStroke
                              : faCircleRegular
                        const statusTone: 'ok' | 'accent' | 'muted' =
                          status === 'done' ? 'ok' : status === 'in-progress' ? 'accent' : 'muted'
                        return (
                          <li key={lesson.id}>
                            <Link
                              to="/$moduleId/$chapitre/$lecon"
                              params={{
                                moduleId: module.id,
                                chapitre: chapter.id,
                                lecon: lesson.id,
                              }}
                              className="flex items-start gap-2 rounded-lg px-2 py-1 text-[11px] leading-snug text-ink/85 transition-colors hover:bg-surface-2 hover:text-ink"
                              activeProps={{ className: 'bg-surface-2 text-accent' }}
                            >
                              <AppIcon
                                icon={statusIcon}
                                tone={statusTone}
                                className="mt-0.5 size-2.5"
                              />
                              <span>{lesson.title}</span>
                            </Link>
                          </li>
                        )
                      })}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-4 border-t border-line pt-3">
          <p className="mb-1 px-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
            Explorer
          </p>
          <ResourceLink to="/glossaire" icon={faBookOpen} label="Glossaire" />
          <ResourceLink to="/carte-des-specs" icon={faDiagramProject} label="Carte des specs" />
          <ResourceLink to="/comparateur" icon={faScaleBalanced} label="Comparateur" />
        </div>
      </div>

      <div className="shrink-0 border-t border-line bg-bg/35 p-2">
        <ProgressMenu placement="sidebar" />
      </div>
    </nav>
  )
}

function ResourceLink({ to, icon, label }: { to: string; icon: IconDefinition; label: string }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-ink/80 transition-colors hover:bg-surface-2 hover:text-ink"
      activeProps={{ className: 'bg-surface-2 text-accent' }}
    >
      <AppIcon icon={icon} className="size-3" />
      {label}
    </Link>
  )
}
