import type { ReactNode } from 'react'

/**
 * Tableau comparatif (ex. mot de passe partagé vs API key vs OAuth2).
 * `verdict` colore la cellule : bad (rouge), mid (ambre), good (teal).
 */
export type CompareCell = { content: ReactNode; verdict?: 'bad' | 'mid' | 'good' }

const verdictClass = {
  bad: 'bg-danger-soft',
  mid: 'bg-warning-soft',
  good: 'bg-ok-soft',
} as const

export function CompareTable({
  caption,
  columns,
  rows,
}: {
  caption: string
  columns: string[]
  rows: { label: string; cells: CompareCell[] }[]
}) {
  return (
    <div className="my-4 overflow-x-auto rounded-lg border border-line">
      <table className="w-full border-collapse text-sm">
        <caption className="border-b border-line bg-surface-2 px-3 py-2 text-left text-xs font-semibold text-muted">
          {caption}
        </caption>
        <thead>
          <tr className="border-b border-line">
            <th className="p-2.5 text-left text-xs font-semibold text-muted" scope="col"></th>
            {columns.map((c) => (
              <th key={c} className="p-2.5 text-left text-xs font-semibold" scope="col">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-b border-line/50 align-top last:border-0">
              <th className="p-2.5 text-left text-xs font-medium text-muted" scope="row">
                {row.label}
              </th>
              {row.cells.map((cell, i) => (
                <td
                  key={i}
                  className={`p-2.5 text-xs leading-relaxed ${cell.verdict ? verdictClass[cell.verdict] : ''}`}
                >
                  {cell.content}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
