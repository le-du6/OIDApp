import { useState } from 'react'

function currentTheme(): 'dark' | 'light' {
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'
}

/** Bascule dark/light — dark par défaut, choix mémorisé (localStorage, lu avant le premier rendu). */
export function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light'>(currentTheme)
  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    localStorage.setItem('oidapp-theme', next)
    setTheme(next)
  }
  return (
    <button
      type="button"
      onClick={toggle}
      className="rounded-md border border-line bg-surface-2 px-3 py-1.5 text-sm text-ink transition-colors hover:border-accent"
      aria-label={theme === 'dark' ? 'Passer en thème clair' : 'Passer en thème sombre'}
    >
      {theme === 'dark' ? '☀️ Clair' : '🌙 Sombre'}
    </button>
  )
}
