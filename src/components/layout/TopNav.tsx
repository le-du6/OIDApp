import { Link } from '@tanstack/react-router'
import { curriculum } from '../../data/curriculum'

const navLinkClass =
  'rounded-full px-3 py-1.5 text-sm text-muted transition-colors hover:bg-surface-2 hover:text-ink'

const activeNavLinkClass = 'bg-surface-2 text-ink shadow-sm'

export function TopNav() {
  const availableModules = curriculum.filter((module) => module.available)

  return (
    <nav className="flex flex-col gap-1.5 lg:items-end" aria-label="Navigation principale">
      <div className="flex flex-wrap items-center gap-1.5">
        <Link to="/" className={navLinkClass} activeProps={{ className: activeNavLinkClass }}>
          Accueil
        </Link>
        {availableModules.map((module) => (
          <Link
            key={module.id}
            to="/$moduleId"
            params={{ moduleId: module.id }}
            className={navLinkClass}
            activeProps={{ className: activeNavLinkClass }}
          >
            {module.shortTitle}
          </Link>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        <Link
          to="/glossaire"
          className={navLinkClass}
          activeProps={{ className: activeNavLinkClass }}
        >
          Glossaire
        </Link>
        <Link
          to="/labo-crypto"
          className={navLinkClass}
          activeProps={{ className: activeNavLinkClass }}
        >
          Crypto Lab
        </Link>
        <Link
          to="/carte-des-specs"
          className={navLinkClass}
          activeProps={{ className: activeNavLinkClass }}
        >
          Specs
        </Link>
        <Link
          to="/comparateur"
          className={navLinkClass}
          activeProps={{ className: activeNavLinkClass }}
        >
          Comparateur
        </Link>
      </div>
    </nav>
  )
}
