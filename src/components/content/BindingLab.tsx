import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import {
  buildPresentation,
  createBindingDemo,
  validatePresentation,
  DEMO_ISSUER,
  DEMO_VERIFIER,
  DEMO_VCT,
  type BindingDemo,
  type Check,
  type Fault,
} from '../../lib/binding-demo'
import { JwtInspector } from '../jwt/JwtInspector'
import {
  faCheck,
  faCircleNotch,
  faFileSignature,
  faFingerprint,
  faKey,
  faLink,
  faShieldHalved,
  faStamp,
  faWallet,
  faXmark,
} from '@fortawesome/free-solid-svg-icons'
import { AppIcon } from '../ui/AppIcon'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
const button =
  'rounded-lg border border-accent bg-accent-soft px-3 py-2 text-sm font-medium text-accent transition-colors hover:bg-surface-2 disabled:opacity-40'
const faults: [Fault, string][] = [
  ['none', 'Présentation correcte'],
  ['key', 'Signer avec une autre clé'],
  ['audience', 'Signer pour un autre Verifier'],
  ['nonce', 'Signer un autre nonce'],
  ['old', 'Signer une preuve trop ancienne'],
  ['disclosures', 'Retirer birthdate après signature'],
]
export function BindingLab() {
  const reduced = useReducedMotion()
  const [demo, setDemo] = useState<BindingDemo | null>(null),
    [busy, setBusy] = useState(false),
    [error, setError] = useState('')
  const [selected, setSelected] = useState(['given_name', 'birthdate']),
    [fault, setFault] = useState<Fault>('none')
  const [presentation, setPresentation] = useState<Awaited<
    ReturnType<typeof buildPresentation>
  > | null>(null)
  const [checks, setChecks] = useState<Check[]>([]),
    [consumed, setConsumed] = useState(false)
  async function run(action: () => Promise<void>) {
    setBusy(true)
    setError('')
    try {
      await action()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Échec du calcul')
    } finally {
      setBusy(false)
    }
  }
  const stage = !demo ? 0 : !presentation ? 1 : checks.length ? 3 : 2
  const cards: [string, string, IconDefinition, 'issuer' | 'client' | 'verifier'][] = [
    ['Issuer', 'Signe le credential et sa liaison cnf.jwk', faStamp, 'issuer' as const],
    ['Wallet', 'Signe la présentation avec cette même clé', faWallet, 'client' as const],
    ['Verifier', 'Contrôle la clé, la demande et les données', faShieldHalved, 'verifier' as const],
  ]
  return (
    <section
      id="binding"
      className="overflow-hidden rounded-2xl border border-accent/40 bg-surface"
      aria-label="Laboratoire de key binding"
    >
      <div className="border-b border-line bg-accent-soft p-5">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-accent">
          <AppIcon icon={faLink} className="size-3.5" />
          Une clé, de l’émission à la présentation
        </p>
        <h2 className="mt-2 text-xl font-bold">Suivre la liaison, éprouver ses limites</h2>
        <p className="mt-2 text-sm text-muted">
          La preuve d’émission, le credential et le KB-JWT sont réellement signés dans ce
          navigateur. Les données sont fictives ; les clés privées restent en mémoire jusqu’au
          rechargement.
        </p>
      </div>
      <div className="space-y-5 p-5">
        <ol className="grid gap-3 sm:grid-cols-3">
          {cards.map(([title, text, icon, tone], i) => (
            <motion.li
              key={title}
              initial={false}
              animate={{ opacity: stage > i ? 1 : 0.65 }}
              transition={{ duration: reduced ? 0 : 0.3 }}
              className={`rounded-xl border p-4 ${stage > i ? 'border-accent bg-accent-soft' : 'border-line bg-bg'}`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-accent">0{i + 1}</span>
                <AppIcon icon={icon} tone={tone} className="size-4" />
              </div>
              <h3 className="mt-2 font-semibold">{title}</h3>
              <p className="mt-1 text-xs text-muted">{text}</p>
            </motion.li>
          ))}
        </ol>
        <button
          type="button"
          className={button}
          disabled={busy}
          onClick={() =>
            void run(async () => {
              setDemo(await createBindingDemo())
              setPresentation(null)
              setChecks([])
              setConsumed(false)
            })
          }
        >
          <AppIcon icon={demo ? faFingerprint : faKey} className="mr-2 inline size-3.5" />
          {demo
            ? 'Nouvelle émission et nouvelle transaction'
            : '1. Émettre un credential lié à une clé'}
        </button>
        {demo && (
          <>
            <p className="text-xs text-muted">
              Horloge de démonstration : {new Date(demo.now * 1000).toISOString()}. Audience :{' '}
              {DEMO_VERIFIER}. Les clés logicielles de ce laboratoire ne démontrent ni stockage
              matériel ni attestation.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg bg-bg p-3">
                <p className="text-xs font-semibold text-muted">Clé du proof = clé dans cnf</p>
                <code className="mt-1 block break-all text-xs">
                  {JSON.stringify(demo.holderJwk)}
                </code>
              </div>
              <div className="rounded-lg bg-bg p-3">
                <p className="text-xs font-semibold text-muted">Deux défis, deux destinataires</p>
                <p className="mt-1 break-all font-mono text-xs">
                  c_nonce : {demo.vciNonce}
                  <br />
                  nonce VP : {demo.nonce}
                </p>
              </div>
            </div>
            <details>
              <summary className="cursor-pointer text-sm text-accent">
                Inspecter la preuve d’émission et le credential
              </summary>
              <div className="mt-3 space-y-3">
                <JwtInspector label="Proof jwt → Issuer" jwt={demo.proof} context="vci-proof" />
                <JwtInspector
                  label="Credential signé par l’Issuer"
                  jwt={demo.credential}
                  context="credential"
                />
              </div>
            </details>
            <fieldset disabled={busy} className="space-y-3">
              <legend className="font-semibold">2. Choisir les disclosures</legend>
              <p className="text-xs text-muted">
                Demande illustrée : given_name requis ; les autres claims sont facultatifs pour ce
                laboratoire.
              </p>
              <div className="flex flex-wrap gap-4">
                {demo.disclosures.map((d) => (
                  <label key={d.name} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={selected.includes(d.name)}
                      onChange={(e) => {
                        setSelected(
                          e.target.checked
                            ? [...selected, d.name]
                            : selected.filter((x) => x !== d.name),
                        )
                        setPresentation(null)
                        setChecks([])
                      }}
                    />
                    {d.name}
                  </label>
                ))}
              </div>
            </fieldset>
            <label className="block text-sm font-semibold">
              Cas à démontrer
              <select
                aria-label="Cas de key binding"
                disabled={busy}
                value={fault}
                onChange={(e) => {
                  setFault(e.target.value as Fault)
                  setPresentation(null)
                  setChecks([])
                }}
                className="mt-2 block w-full rounded-lg border border-line bg-bg p-2 font-normal"
              >
                {faults.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              disabled={busy || (fault === 'disclosures' && !selected.includes('birthdate'))}
              className={button}
              onClick={() =>
                void run(async () => {
                  setPresentation(await buildPresentation(demo, selected, fault))
                  setChecks([])
                })
              }
            >
              <AppIcon icon={faFileSignature} className="mr-2 inline size-3.5" />
              3. Signer et assembler la présentation
            </button>
          </>
        )}
        {demo && presentation && (
          <>
            <JwtInspector
              label="KB-JWT signé par le wallet"
              jwt={presentation.kb}
              context="kb-jwt"
            />
            <details>
              <summary className="cursor-pointer text-sm text-accent">
                Voir les octets de la présentation complète
              </summary>
              <pre
                tabIndex={0}
                className="mt-2 max-w-full overflow-x-auto rounded-lg bg-bg p-3 text-xs"
              >
                {presentation.compact}
              </pre>
            </details>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                className={button}
                disabled={busy}
                onClick={() =>
                  void run(async () => {
                    const result = await validatePresentation(presentation.compact, {
                      issuerJwk: demo.issuerJwk,
                      issuer: DEMO_ISSUER,
                      audience: DEMO_VERIFIER,
                      nonce: demo.nonce,
                      now: demo.now,
                      consumed,
                      requiredClaims: ['given_name'],
                      vct: DEMO_VCT,
                    })
                    setChecks(result)
                    if (result.every((c) => c.ok)) setConsumed(true)
                  })
                }
              >
                <AppIcon icon={faShieldHalved} className="mr-2 inline size-3.5" />
                {consumed
                  ? '4. Soumettre à nouveau (transaction déjà utilisée)'
                  : '4. Vérifier et, si valide, accepter'}
              </button>
              <span className="text-xs text-muted">
                {consumed
                  ? 'Transaction consommée par une acceptation précédente.'
                  : 'Transaction ouverte.'}
              </span>
            </div>
          </>
        )}
        <AnimatePresence mode="wait">
          <motion.div
            key={checks.map((c) => `${c.id}:${c.ok}`).join('|')}
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.2 }}
            aria-live="polite"
          >
            {checks.length > 0 && (
              <>
                <p
                  className={`mb-3 font-semibold ${checks.every((c) => c.ok) ? 'text-ok' : 'text-danger'}`}
                >
                  <AppIcon
                    icon={checks.every((c) => c.ok) ? faCheck : faXmark}
                    className="mr-2 inline size-4"
                  />
                  {checks.every((c) => c.ok)
                    ? 'Présentation acceptée — transaction maintenant fermée'
                    : 'Présentation refusée — les causes sont détaillées ci-dessous'}
                </p>
                <ol className="space-y-2">
                  {checks.map((c, i) => (
                    <motion.li
                      key={c.id}
                      initial={reduced ? false : { opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: reduced ? 0 : 0.2, delay: reduced ? 0 : i * 0.035 }}
                      className={`rounded-lg border p-3 ${c.ok ? 'border-line bg-surface-2' : 'border-danger bg-danger-soft'}`}
                    >
                      <p className="text-sm font-semibold">
                        <AppIcon
                          icon={c.ok ? faCheck : faXmark}
                          tone={c.ok ? 'ok' : 'danger'}
                          className="mr-2 inline size-3.5"
                        />
                        {c.label}
                      </p>
                      <p className="mt-1 text-xs text-muted">{c.detail}</p>
                    </motion.li>
                  ))}
                </ol>
                <p className="mt-3 text-xs text-muted">
                  Profil pédagogique limité : une clé d’Issuer approuvée, ES256, SHA-256 et des
                  claims simples. Les listes de statut, chaînes X.509, attestations matérielles,
                  autres formats et le moteur DCQL complet ne sont pas exécutés ici.
                </p>
              </>
            )}
          </motion.div>
        </AnimatePresence>
        {busy && (
          <p role="status" className="text-sm text-muted">
            <AppIcon
              icon={faCircleNotch}
              tone="accent"
              className="mr-2 inline size-3.5 animate-spin"
            />
            Calcul cryptographique…
          </p>
        )}
        {error && (
          <p role="alert" className="text-sm text-danger">
            {error}
          </p>
        )}
      </div>
    </section>
  )
}
