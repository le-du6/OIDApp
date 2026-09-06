import { createRootRoute, Outlet } from '@tanstack/react-router'
import { Sidebar } from '../components/layout/Sidebar'
import { TopNav } from '../components/layout/TopNav'

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
    <div className="flex min-h-screen bg-bg text-ink">
      <aside className="sticky top-0 hidden h-screen w-72 shrink-0 border-r border-line bg-surface md:block">
        <Sidebar />
      </aside>
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-10 border-b border-line bg-bg/85 px-4 py-3 backdrop-blur-xl md:px-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <p className="text-sm text-muted">
              Comprendre{' '}
              <span className="font-mono text-ink">OAuth2 · OIDC · OID4VCI · OID4VP</span> —
              sécurité et crypto en fil rouge
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
