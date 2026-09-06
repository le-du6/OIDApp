import { useState } from 'react'

function currentTheme(): 'dark' | 'light' {
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'
}

/** Bascule dark/light — dark par défaut, choix mémorisé (localStorage, lu avant le premier rendu). */
export function ThemeToggle({ fullWidth = false }: { fullWidth?: boolean }) {
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
      className={`rounded-xl border border-line bg-surface-2 px-3 py-2 text-sm text-ink transition-colors hover:border-accent ${
        fullWidth ? 'flex w-full items-center justify-between' : ''
      }`}
      aria-label={theme === 'dark' ? 'Passer en thème clair' : 'Passer en thème sombre'}
    >
      <span>Thème</span>
      <span className="text-muted">{theme === 'dark' ? 'Clair' : 'Sombre'}</span>
    </button>
  )
}
