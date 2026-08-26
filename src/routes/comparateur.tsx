import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { motion, AnimatePresence } from 'motion/react'

export const Route = createFileRoute('/comparateur')({
  component: ComparateurPage,
})

/**
 * Comparateur de protocoles : les trois grands duels du cours, sur les
 * quatre mêmes axes (cahier des charges §4.3) — secrets échangés, surface
 * d'attaque, vie privée, traçabilité. Lignes animées (Motion) au changement
 * de duel ; les analyses détaillées vivent dans les leçons correspondantes.
 */

type Verdict = 'bad' | 'mid' | 'good'
type Cell = { text: string; verdict: Verdict }
type Duel = {
  id: string
  title: string
  left: string
  right: string
  lesson: { label: string; to: string }
  axes: { axe: string; left: Cell; right: Cell }[]
}

const DUELS: Duel[] = [
  {
    id: 'oauth2-vs-apikeys',
    title: 'OAuth 2.0 vs API keys',
    left: 'API keys / mot de passe partagé',
    right: 'OAuth 2.0',
    lesson: {
      label: 'Leçon : le problème d’origine',
      to: '/oauth2/probleme-origine/partage-mot-de-passe',
    },
    axes: [
      {
        axe: 'Secrets échangés',
        left: {
          text: 'Un secret statique, large, remis au tiers — parfois le mot de passe lui-même',
          verdict: 'bad',
        },
        right: {
          text: 'Aucun secret durable ne sort : tokens courts, à périmètre limité (scope)',
          verdict: 'good',
        },
      },
      {
        axe: 'Surface d’attaque',
        left: {
          text: 'La clé fuite → accès total, longtemps, souvent sans détection',
          verdict: 'bad',
        },
        right: {
          text: 'Token fuité = fenêtre courte + périmètre borné ; PKCE/state ferment le front channel',
          verdict: 'good',
        },
      },
      {
        axe: 'Vie privée',
        left: {
          text: 'L’API ne distingue pas l’app de l’utilisateur : tout se fait « en votre nom »',
          verdict: 'bad',
        },
        right: {
          text: 'client_id + sub séparés : qui agit, pour qui — consentement par scope',
          verdict: 'good',
        },
      },
      {
        axe: 'Traçabilité / révocation',
        left: {
          text: 'Révoquer = changer la clé et casser toutes les intégrations',
          verdict: 'bad',
        },
        right: {
          text: 'Révocation par token/client (RFC 7009), audit par client_id',
          verdict: 'good',
        },
      },
    ],
  },
  {
    id: 'oidc-vs-saml',
    title: 'OIDC vs SAML',
    left: 'SAML 2.0',
    right: 'OpenID Connect',
    lesson: { label: 'Leçon : OIDC vs SAML', to: '/oidc/oidc-vs-saml/comparaison' },
    axes: [
      {
        axe: 'Secrets échangés',
        left: {
          text: 'Assertions XML signées, certificats échangés par métadonnées',
          verdict: 'mid',
        },
        right: {
          text: 'ID Token JWS + JWKS publié : rotation de clés sans friction',
          verdict: 'good',
        },
      },
      {
        axe: 'Surface d’attaque',
        left: {
          text: 'XML-DSig : canonicalisation, wrapping — historiquement piégeux',
          verdict: 'bad',
        },
        right: {
          text: 'Validation JWT plus simple… mais à faire ENTIÈREMENT (aud, alg, nonce)',
          verdict: 'mid',
        },
      },
      {
        axe: 'Vie privée',
        left: { text: 'IdP central : voit chaque connexion (phone home)', verdict: 'mid' },
        right: {
          text: 'OP central : voit chaque connexion (phone home) — identique',
          verdict: 'mid',
        },
      },
      {
        axe: 'Traçabilité / révocation',
        left: { text: 'Sessions SSO centralisées, logout complexe mais central', verdict: 'mid' },
        right: {
          text: 'Sessions centralisées aussi ; révocation immédiate côté OP',
          verdict: 'mid',
        },
      },
    ],
  },
  {
    id: 'federation-vs-wallet',
    title: 'Fédération vs Wallet',
    left: 'Fédération (OIDC/SAML)',
    right: 'Triangle wallet (OID4VCI/VP)',
    lesson: {
      label: 'Leçon : le comparateur final',
      to: '/oid4vp/unlinkability/federation-vs-wallet',
    },
    axes: [
      {
        axe: 'Secrets échangés',
        left: {
          text: 'Identifiants saisis chez l’IdP à chaque session ; tokens de l’IdP',
          verdict: 'mid',
        },
        right: {
          text: 'Rien à saisir : credential signé + preuve de clé locale (KB-JWT)',
          verdict: 'good',
        },
      },
      {
        axe: 'Surface d’attaque',
        left: { text: 'IdP = cible unique concentrée (mais très défendue)', verdict: 'mid' },
        right: {
          text: 'Répartie sur les wallets/terminaux — WSCD et attestation requis',
          verdict: 'mid',
        },
      },
      {
        axe: 'Vie privée',
        left: {
          text: 'L’IdP apprend chaque connexion ; claims par paquets (scopes)',
          verdict: 'bad',
        },
        right: { text: 'Émetteur aveugle aux usages ; divulgation au claim près', verdict: 'good' },
      },
      {
        axe: 'Traçabilité / révocation',
        left: { text: 'Révocation immédiate — l’IdP est dans chaque boucle', verdict: 'good' },
        right: { text: 'Listes de statut, durées courtes, batch : plus difficile', verdict: 'mid' },
      },
    ],
  },
]

const verdictCls: Record<Verdict, string> = {
  bad: 'bg-danger-soft',
  mid: 'bg-warning-soft',
  good: 'bg-ok-soft',
}

function ComparateurPage() {
  const [active, setActive] = useState(DUELS[0]!.id)
  const duel = DUELS.find((d) => d.id === active)!

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Comparateur de protocoles</h1>
        <p className="mt-1 text-sm text-muted">
          Les trois grands duels du cours, sur quatre axes constants : secrets échangés, surface
          d'attaque, vie privée, traçabilité. Vert = point fort, ambre = compromis, rouge = point
          faible.
        </p>
      </div>

      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Choix du duel">
        {DUELS.map((d) => (
          <button
            key={d.id}
            type="button"
            role="tab"
            aria-selected={active === d.id}
            onClick={() => setActive(d.id)}
            className={`rounded-md border px-3.5 py-1.5 text-sm font-medium transition-colors ${
              active === d.id
                ? 'border-accent bg-accent-soft text-accent'
                : 'border-line text-muted hover:border-muted'
            }`}
          >
            {d.title}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={duel.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          <div className="overflow-x-auto rounded-xl border border-line">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-line bg-surface-2 text-left">
                  <th className="px-3 py-2 font-semibold">Axe</th>
                  <th className="px-3 py-2 font-semibold">{duel.left}</th>
                  <th className="px-3 py-2 font-semibold">{duel.right}</th>
                </tr>
              </thead>
              <tbody>
                {duel.axes.map((row, i) => (
                  <motion.tr
                    key={row.axe}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 * i, duration: 0.25 }}
                    className="border-b border-line/60 align-top last:border-0"
                  >
                    <th scope="row" className="bg-surface px-3 py-2.5 text-left font-medium">
                      {row.axe}
                    </th>
                    <td className={`px-3 py-2.5 ${verdictCls[row.left.verdict]}`}>
                      {row.left.text}
                    </td>
                    <td className={`px-3 py-2.5 ${verdictCls[row.right.verdict]}`}>
                      {row.right.text}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-muted">
            Pour l'analyse complète :{' '}
            <Link to={duel.lesson.to} className="text-accent underline underline-offset-2">
              {duel.lesson.label}
            </Link>
            .
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
