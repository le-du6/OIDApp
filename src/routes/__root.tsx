import { createRootRoute, Outlet } from '@tanstack/react-router'
import { Sidebar } from '../components/layout/Sidebar'
import { TopNav } from '../components/layout/TopNav'
import { AppIcon } from '../components/ui/AppIcon'
import { faShieldHalved } from '@fortawesome/free-solid-svg-icons'

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: () => (
    <main className="p-10">
      <h1 className="text-xl font-bold">Page introuvable</h1>
      <p className="mt-2 text-muted">Cette leçon n'existe pas (encore).</p>
    </main>
  ),
})

function RootLayout() {
  return (
    <div className="flex min-h-screen overflow-x-clip bg-bg text-ink">
      <aside className="sticky top-0 hidden h-screen w-72 shrink-0 border-r border-line bg-surface md:block">
        <Sidebar />
      </aside>
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-10 overflow-x-hidden border-b border-line bg-bg/85 px-4 py-3 backdrop-blur-xl md:px-6">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <p className="flex shrink-0 items-center gap-2 text-xs text-muted">
              <AppIcon icon={faShieldHalved} tone="accent" className="size-3.5" />
              Protocoles, sécurité et crypto
            </p>
            <TopNav />
          </div>
        </header>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
