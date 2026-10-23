import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'

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
          text: 'Une clé propre au service ; portée et durée dépendent de sa politique. Le partage de mot de passe est un cas distinct.',
          verdict: 'bad',
        },
        right: {
          text: 'Le tiers reçoit des tokens sensibles ; leur portée, durée et renouvellement suivent la politique du serveur.',
          verdict: 'good',
        },
      },
      {
        axe: 'Surface d’attaque',
        left: {
          text: 'Une fuite expose les droits associés à cette clé jusqu’à expiration ou révocation effective.',
          verdict: 'bad',
        },
        right: {
          text: 'Bearer volé : droits exposés. PKCE protège le code ; DPoP ou mTLS peuvent lier l’usage du token à une clé.',
          verdict: 'good',
        },
      },
      {
        axe: 'Vie privée',
        left: {
          text: 'Le service définit l’identité et les droits associés à la clé ; le partage de mot de passe peut masquer le tiers.',
          verdict: 'bad',
        },
        right: {
          text: 'Client et sujet peuvent être distingués ; l’autorisation porte sur les scopes ou des détails structurés.',
          verdict: 'good',
        },
      },
      {
        axe: 'Traçabilité / révocation',
        left: {
          text: 'Révocation ou rotation selon le service ; limiter le partage de la même clé entre intégrations.',
          verdict: 'bad',
        },
        right: {
          text: 'RFC 7009 définit la révocation ; sa propagation dépend de la validation et des caches des ressources.',
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
          text: 'ID Token signé ; clés publiées ou convenues, avec une politique de rotation et de cache.',
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
        left: {
          text: 'L’IdP observe les authentifications qu’il traite ; les sessions du service peuvent continuer localement.',
          verdict: 'mid',
        },
        right: {
          text: 'L’OP observe ses authentifications ; chaque action de la session locale du RP ne le sollicite pas.',
          verdict: 'mid',
        },
      },
      {
        axe: 'Traçabilité / révocation',
        left: { text: 'Sessions SSO centralisées, logout complexe mais central', verdict: 'mid' },
        right: {
          text: 'Sessions du RP, tokens et session OP ont des cycles de vie distincts ; logout et révocation sont à coordonner.',
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
          text: 'Authentification chez l’OP, éventuellement via une session existante ; résultat destiné au RP.',
          verdict: 'mid',
        },
        right: {
          text: 'Credential et preuve de détenteur selon le profil ; déverrouillage ou consentement possibles.',
          verdict: 'good',
        },
      },
      {
        axe: 'Surface d’attaque',
        left: { text: 'IdP = cible unique concentrée (mais très défendue)', verdict: 'mid' },
        right: {
          text: 'Protection des wallets et terminaux ; stockage matériel et attestations selon le profil d’écosystème.',
          verdict: 'mid',
        },
      },
      {
        axe: 'Vie privée',
        left: {
          text: 'L’OP voit les authentifications ; scopes et paramètre claims permettent de demander des attributs.',
          verdict: 'bad',
        },
        right: {
          text: 'Présentation sans appel imposé à l’Issuer ; statut, clés, données stables et collusion peuvent révéler des usages.',
          verdict: 'good',
        },
      },
      {
        axe: 'Traçabilité / révocation',
        left: {
          text: 'Prise en compte du statut selon tokens, session du RP, introspection et caches.',
          verdict: 'good',
        },
        right: {
          text: 'Statut et durées de validité à gérer ; les lots visent d’autres propriétés, dont certaines corrélations.',
          verdict: 'mid',
        },
      },
    ],
  },
]

const verdictCls: Record<Verdict, string> = {
  bad: 'bg-surface',
  mid: 'bg-surface',
  good: 'bg-surface',
}

function ComparateurPage() {
  const reduced = useReducedMotion()
  const [active, setActive] = useState(DUELS[0]!.id)
  const duel = DUELS.find((d) => d.id === active)!

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Comparateur de protocoles</h1>
        <p className="mt-1 text-sm text-muted">
          Les trois grands duels du cours, sur quatre axes constants : secrets échangés, surface
          d'attaque, vie privée, traçabilité. Chaque cellule décrit des hypothèses et des compromis
          à examiner dans votre contexte.
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
          initial={reduced ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduced ? { opacity: 1 } : { opacity: 0, y: -8 }}
          transition={{ duration: reduced ? 0 : 0.2 }}
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
                    initial={reduced ? false : { opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: reduced ? 0 : 0.08 * i, duration: reduced ? 0 : 0.25 }}
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
