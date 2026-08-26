import { useEffect, useState } from 'react'
import type { HighlighterCore } from 'shiki/core'

/**
 * Coloration syntaxique via Shiki — imports FINS (shiki/core + langages et
 * thèmes ciblés) pour ne bundler QUE http/json/ts/bash, conformément au §5 du
 * cahier des charges. Le moteur WASM oniguruma est remplacé par le moteur
 * JavaScript (plus léger, sans .wasm). Tout est chargé paresseusement.
 */
let highlighterPromise: Promise<HighlighterCore> | null = null

async function getHighlighter(): Promise<HighlighterCore> {
  if (!highlighterPromise) {
    highlighterPromise = (async () => {
      const [{ createHighlighterCore }, { createJavaScriptRegexEngine }] = await Promise.all([
        import('shiki/core'),
        import('shiki/engine/javascript'),
      ])
      return createHighlighterCore({
        themes: [
          import('shiki/themes/github-dark-default.mjs'),
          import('shiki/themes/github-light.mjs'),
        ],
        langs: [
          import('shiki/langs/http.mjs'),
          import('shiki/langs/json.mjs'),
          import('shiki/langs/typescript.mjs'),
          import('shiki/langs/bash.mjs'),
        ],
        engine: createJavaScriptRegexEngine(),
      })
    })()
  }
  return highlighterPromise
}

export type CodeLang = 'http' | 'json' | 'typescript' | 'bash'

export function CodeBlock({ code, lang, title }: { code: string; lang: CodeLang; title?: string }) {
  const [html, setHtml] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    getHighlighter()
      .then((hl) => {
        const out = hl.codeToHtml(code, {
          lang,
          themes: { light: 'github-light', dark: 'github-dark-default' },
          defaultColor: 'light',
        })
        if (!cancelled) setHtml(out)
      })
      .catch(() => {
        if (!cancelled) setHtml(null)
      })
    return () => {
      cancelled = true
    }
  }, [code, lang])

  return (
    <figure className="my-4 overflow-hidden rounded-lg border border-line">
      {title && (
        <figcaption className="border-b border-line bg-surface-2 px-3 py-1.5 font-mono text-xs text-muted">
          {title}
        </figcaption>
      )}
      {html ? (
        <div
          className="code-shiki overflow-x-auto text-xs leading-relaxed [&_pre]:m-0 [&_pre]:bg-transparent [&_pre]:p-3"
          // Sortie de Shiki uniquement (générée localement à partir de nos fixtures).
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <pre className="overflow-x-auto p-3 font-mono text-xs leading-relaxed">{code}</pre>
      )}
    </figure>
  )
}
