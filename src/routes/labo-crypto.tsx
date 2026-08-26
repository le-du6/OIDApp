import { useEffect, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  base64UrlToBytes,
  bytesToBase64Url,
  computeCodeChallenge,
  exportPublicJwk,
  generateCodeVerifier,
  generateES256KeyPair,
  sha256Hex,
  signES256,
  verifyES256,
} from '../lib/crypto'
import { JwtInspector } from '../components/jwt/JwtInspector'
import { Callout } from '../components/content/Callout'

export const Route = createFileRoute('/labo-crypto')({
  component: CryptoLabPage,
})

const FIXTURE_JWT =
  'eyJhbGciOiJFUzI1NiIsInR5cCI6ImF0K2p3dCIsImtpZCI6ImFzLTIwMjYtMDEifQ.eyJzY29wZSI6InBob3Rvcy5yZWFkIiwiY2xpZW50X2lkIjoid2ViLWFwcCIsImlzcyI6Imh0dHBzOi8vYXMuZXhhbXBsZSIsInN1YiI6InVzZXItOGIyYzkxIiwiYXVkIjoiaHR0cHM6Ly9hcGkuZXhhbXBsZSIsImlhdCI6MTc2NzIyNTYwMCwiZXhwIjoxNzY3MjI5MjAwLCJqdGkiOiI5ZjNhN2QyZS00YjFjLTRjOGEtOWU3NS0xZDJmNmI4YzBhMTEifQ.NMEldLsjPFYimHAjQZe9YwsMD-oouUEX3dThGkW15f5jCdMn_B5c7clmMOfeaoP0QagYLtQv1TpAgIokWqwYAw'

/**
 * Crypto Lab : manipuler réellement (WebCrypto natif, zéro lib) les
 * primitives qui font tenir OAuth2/OIDC — hachage, PKCE, signature ES256,
 * lecture de JWT. Toutes les clés sont jetables et restent dans ce navigateur.
 */
function CryptoLabPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Crypto Lab</h1>
        <p className="mt-1 text-sm text-muted">
          Tout ici tourne dans votre navigateur avec la <strong>WebCrypto API native</strong> —
          aucune bibliothèque, aucune donnée n'en sort, toutes les clés sont jetables.
        </p>
      </div>
      <HashSection />
      <PkceSection />
      <SignSection />
      <JwtSection />
    </div>
  )
}

function Section({
  title,
  intro,
  children,
}: {
  title: string
  intro: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-xl border border-line bg-surface p-5">
      <h2 className="text-lg font-bold">{title}</h2>
      <p className="mt-1 text-sm text-muted">{intro}</p>
      <div className="mt-4">{children}</div>
    </section>
  )
}

const inputCls =
  'w-full rounded-md border border-line bg-bg px-3 py-2 font-mono text-sm outline-none focus:border-accent'
const btnCls =
  'rounded-md border border-accent bg-accent-soft px-3.5 py-1.5 text-sm font-medium transition-colors hover:bg-accent hover:text-white'
const outCls = 'mt-2 block break-all rounded-md bg-surface-2 p-2.5 font-mono text-xs'

/* -------------------------------------------------------------- SHA-256 */
function HashSection() {
  const [input, setInput] = useState('OIDApp')
  const [hash, setHash] = useState('')
  useEffect(() => {
    let cancelled = false
    void sha256Hex(input).then((h) => {
      if (!cancelled) setHash(h)
    })
    return () => {
      cancelled = true
    }
  }, [input])
  return (
    <Section
      title="🔢 Hachage SHA-256"
      intro="Une empreinte à sens unique : impossible de remonter au texte, et le moindre caractère modifié change tout (effet avalanche). Essayez d'ajouter un point."
    >
      <label className="block text-xs font-medium text-muted">
        Texte à hacher
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className={`mt-1 ${inputCls}`}
        />
      </label>
      <output className={outCls} aria-live="polite">
        SHA-256 : <span className="text-ok">{hash}</span>
      </output>
    </Section>
  )
}

/* ----------------------------------------------------------------- PKCE */
function PkceSection() {
  const [verifier, setVerifier] = useState<string | null>(null)
  const [challenge, setChallenge] = useState<string | null>(null)
  const roll = async () => {
    const v = generateCodeVerifier()
    setVerifier(v)
    setChallenge(await computeCodeChallenge(v))
  }
  return (
    <Section
      title="🔐 PKCE — code_verifier → code_challenge (S256)"
      intro="Exactement ce que fait un Client au début d'un flow avec PKCE (RFC 7636) : un secret aléatoire, et son empreinte envoyée dans l'authorization request. challenge = BASE64URL(SHA-256(verifier))."
    >
      <button type="button" onClick={() => void roll()} className={btnCls}>
        🎲 Générer un code_verifier
      </button>
      {verifier && (
        <>
          <output className={outCls}>
            code_verifier ({verifier.length} car.) : <span className="text-accent">{verifier}</span>
          </output>
          <output className={outCls}>
            code_challenge : <span className="text-ok">{challenge}</span>
          </output>
          <Callout kind="note">
            <p>
              Le verifier reste chez le Client ; seul le challenge part en front channel. Un
              attaquant qui intercepte le code n'a pas le verifier — l'échange au token endpoint lui
              est fermé.
            </p>
          </Callout>
        </>
      )}
    </Section>
  )
}

/* ---------------------------------------------------------------- ES256 */
function SignSection() {
  const [keys, setKeys] = useState<CryptoKeyPair | null>(null)
  const [jwk, setJwk] = useState<JsonWebKey | null>(null)
  const [message, setMessage] = useState('{"iss":"https://as.example","sub":"user-8b2c91"}')
  const [signedMessage, setSignedMessage] = useState<string | null>(null)
  const [signature, setSignature] = useState<string | null>(null)
  const [verdict, setVerdict] = useState<boolean | null>(null)

  const genKeys = async () => {
    const kp = await generateES256KeyPair()
    setKeys(kp)
    setJwk(await exportPublicJwk(kp.publicKey))
    setSignature(null)
    setVerdict(null)
  }
  const sign = async () => {
    if (!keys) return
    setSignature(bytesToBase64Url(await signES256(keys.privateKey, message)))
    setSignedMessage(message)
    setVerdict(null)
  }
  const verify = async () => {
    if (!keys || !signature) return
    setVerdict(await verifyES256(keys.publicKey, base64UrlToBytes(signature), message))
  }

  return (
    <Section
      title="✍️ Signature ES256 — signer, vérifier… et altérer"
      intro="La primitive derrière toute signature de JWT : la clé privée signe, la clé publique vérifie. Signez, vérifiez (✔), puis modifiez un caractère du message et re-vérifiez (✘)."
    >
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => void genKeys()} className={btnCls}>
          🔑 Générer une paire de clés P-256
        </button>
        <button
          type="button"
          onClick={() => void sign()}
          disabled={!keys}
          className={`${btnCls} disabled:opacity-40`}
        >
          ✍️ Signer
        </button>
        <button
          type="button"
          onClick={() => void verify()}
          disabled={!signature}
          className={`${btnCls} disabled:opacity-40`}
        >
          🔎 Vérifier
        </button>
      </div>
      {jwk && (
        <output className={outCls}>
          Clé publique (JWK) :{' '}
          {`{"kty":"${jwk.kty}","crv":"${jwk.crv}","x":"${jwk.x}","y":"${jwk.y}"}`}
        </output>
      )}
      <label className="mt-3 block text-xs font-medium text-muted">
        Message
        <textarea
          value={message}
          onChange={(e) => {
            setMessage(e.target.value)
            setVerdict(null)
          }}
          rows={2}
          className={`mt-1 ${inputCls}`}
        />
      </label>
      {signature && (
        <output className={outCls}>
          Signature : <span className="text-accent">{signature}</span>
        </output>
      )}
      {verdict !== null && (
        <p
          className={`mt-3 rounded-md border p-2.5 text-sm font-medium ${
            verdict ? 'border-ok bg-ok-soft text-ok' : 'border-danger bg-danger-soft text-danger'
          }`}
          aria-live="polite"
        >
          {verdict
            ? '✔ Signature valide : ce message est bien celui qui a été signé, par cette clé.'
            : `✘ Signature invalide : le message a changé depuis la signature${
                signedMessage !== message ? ' (vous venez de le modifier)' : ''
              } — c'est exactement ce qui protège un JWT falsifié.`}
        </p>
      )}
    </Section>
  )
}

/* ------------------------------------------------------------------ JWT */
function JwtSection() {
  const [jwt, setJwt] = useState(FIXTURE_JWT)
  return (
    <Section
      title="🔍 Décodeur de JWT"
      intro="Collez n'importe quel JWT : il se LIT sans aucune clé (deux fois du base64url, pas du chiffrement). Seule la signature exige la clé publique de l'émetteur."
    >
      <label className="block text-xs font-medium text-muted">
        JWT
        <textarea
          value={jwt}
          onChange={(e) => setJwt(e.target.value)}
          rows={4}
          className={`mt-1 ${inputCls}`}
        />
      </label>
      <div className="mt-3">
        <JwtInspector label="Décodage" jwt={jwt.trim()} />
      </div>
    </Section>
  )
}
