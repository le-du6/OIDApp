import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { glossary } from '../data/glossary'
import { actorColor } from '../lib/actors'

export const Route = createFileRoute('/glossaire')({
  component: GlossaryPage,
})

/**
 * Glossaire interactif : terme officiel EN, définition FR, référence de
 * spec, et critique du nom quand elle est méritée.
 */
function GlossaryPage() {
  const [filter, setFilter] = useState('')
  const q = filter.trim().toLowerCase()
  const entries = glossary
    .filter(
      (e) =>
        !q ||
        e.term.toLowerCase().includes(q) ||
        e.definition.toLowerCase().includes(q) ||
        (e.expansion?.toLowerCase().includes(q) ?? false),
    )
    .sort((a, b) => a.term.localeCompare(b.term, 'fr'))

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold">Glossaire</h1>
      <p className="mt-1 text-sm text-muted">
        {glossary.length} entrées. Les termes protocolaires restent en anglais officiel — on ne
        traduit pas une spec — mais chacun a son explication française, sa référence, et la critique
        de son nom quand il la mérite 🏷️.
      </p>
      <label className="mt-4 block">
        <span className="sr-only">Filtrer le glossaire</span>
        <input
          type="search"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filtrer… (ex. token, PKCE, channel)"
          className="w-full rounded-md border border-line bg-surface px-3 py-2 text-sm outline-none placeholder:text-muted focus:border-accent"
        />
      </label>
      <ul className="mt-5 space-y-3">
        {entries.map((e) => {
          const color = e.actorRole ? actorColor(e.actorRole) : undefined
          return (
            <li key={e.id} id={e.id} className="rounded-xl border border-line bg-surface p-4">
              <h2 className="font-semibold" style={color ? { color } : undefined}>
                {e.term}
                {e.expansion && (
                  <span className="ml-2 text-xs font-normal text-muted italic">{e.expansion}</span>
                )}
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-ink/90">{e.definition}</p>
              {e.naming && (
                <p className="mt-2 rounded border-l-2 border-warning bg-warning-soft py-1.5 pl-2.5 pr-2 text-xs leading-relaxed">
                  🏷️ {e.naming}
                </p>
              )}
              <p className="mt-2 font-mono text-xs text-muted">📜 {e.specRef}</p>
            </li>
          )
        })}
        {entries.length === 0 && (
          <li className="text-sm text-muted">Aucune entrée ne correspond à « {filter} ».</li>
        )}
      </ul>
    </div>
  )
}
