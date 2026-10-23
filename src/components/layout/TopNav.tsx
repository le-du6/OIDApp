import { Link } from '@tanstack/react-router'
import {
  faAddressCard,
  faBookOpen,
  faDiagramProject,
  faFingerprint,
  faFlaskVial,
  faHouse,
  faKey,
  faScaleBalanced,
  faStamp,
} from '@fortawesome/free-solid-svg-icons'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { curriculum } from '../../data/curriculum'
import { AppIcon } from '../ui/AppIcon'

const moduleIcons: Record<string, IconDefinition> = {
  oauth2: faKey,
  oidc: faFingerprint,
  oid4vci: faStamp,
  oid4vp: faAddressCard,
}

const navItem =
  'group flex shrink-0 items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-muted transition-all hover:bg-surface-2 hover:text-ink'
const activeItem = 'bg-surface-2 text-accent shadow-sm ring-1 ring-line'

export function TopNav() {
  const availableModules = curriculum.filter((module) => module.available)
  return (
    <nav
      className="flex w-full min-w-0 max-w-full items-center gap-2 overflow-x-auto pb-1 xl:justify-end xl:pb-0"
      aria-label="Navigation principale"
    >
      <div className="flex shrink-0 items-center rounded-xl border border-line bg-surface/70 p-1">
        <Link
          to="/"
          className={`${navItem} px-2`}
          activeProps={{ className: activeItem }}
          activeOptions={{ exact: true }}
          aria-label="Accueil"
          title="Accueil"
        >
          <AppIcon icon={faHouse} className="size-3.5" />
        </Link>
        <span className="mx-1 h-5 w-px bg-line" aria-hidden="true" />
        {availableModules.map((module) => (
          <Link
            key={module.id}
            to="/$moduleId"
            params={{ moduleId: module.id }}
            className={navItem}
            activeProps={{ className: activeItem }}
          >
            <AppIcon icon={moduleIcons[module.id] ?? faKey} className="size-3.5" />
            <span>{module.shortTitle}</span>
          </Link>
        ))}
      </div>

      <div className="flex shrink-0 items-center rounded-xl border border-line bg-surface/70 p-1">
        <ToolLink to="/glossaire" icon={faBookOpen} label="Glossaire" />
        <ToolLink to="/carte-des-specs" icon={faDiagramProject} label="Carte" />
        <ToolLink to="/comparateur" icon={faScaleBalanced} label="Comparer" />
        <Link
          to="/labo-crypto"
          className="group ml-1 flex shrink-0 items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold shadow-sm transition-all hover:-translate-y-px hover:shadow-md"
          style={{
            backgroundColor: 'var(--accent)',
            borderColor: 'var(--accent)',
            color: 'var(--on-accent)',
          }}
          activeProps={{ className: 'ring-2 ring-accent/30' }}
        >
          <AppIcon icon={faFlaskVial} className="size-3.5" />
          <span>Crypto Lab</span>
        </Link>
      </div>
    </nav>
  )
}

function ToolLink({ to, icon, label }: { to: string; icon: IconDefinition; label: string }) {
  return (
    <Link to={to} className={navItem} activeProps={{ className: activeItem }} title={label}>
      <AppIcon icon={icon} className="size-3.5" />
      <span className="hidden 2xl:inline">{label}</span>
      <span className="sr-only 2xl:hidden">{label}</span>
    </Link>
  )
}
