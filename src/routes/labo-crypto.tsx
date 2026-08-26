import { useEffect, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  base64UrlToBytes,
  bytesToBase64Url,
  computeAtHash,
  computeCodeChallenge,
  computeDisclosureDigest,
  exportPublicJwk,
  generateCodeVerifier,
  generateES256KeyPair,
  sha256Hex,
  signES256,
  verifyCompactJwsES256,
  verifyES256,
} from '../lib/crypto'
import { JwtInspector } from '../components/jwt/JwtInspector'
import { Callout } from '../components/content/Callout'
import { OIDC_ACCESS_TOKEN, OIDC_AT_HASH, OIDC_ID_TOKEN, OIDC_JWKS } from '../data/fixtures/oidc'
import { VCI_DISCLOSURES, VCI_SD_JWT } from '../data/fixtures/oid4vci'

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
      <IdTokenSection />
      <PopSection />
      <SdSection />
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

/* -------------------------------------------------- OIDC : valider un ID Token */
function IdTokenSection() {
  // Type littéral (as const) : conserve kid/alg/use, assignable à JsonWebKey.
  const jwk = OIDC_JWKS.keys[0]
  const [tampered, setTampered] = useState(false)
  const [sigVerdict, setSigVerdict] = useState<boolean | null>(null)
  const [atHash, setAtHash] = useState<string | null>(null)

  // ID Token affiché : l'original, ou une version au sub altéré (payload réécrit).
  const [header, payload, signature] = OIDC_ID_TOKEN.split('.') as [string, string, string]
  let shownToken = OIDC_ID_TOKEN
  if (tampered) {
    const claims = JSON.parse(new TextDecoder().decode(base64UrlToBytes(payload)))
    claims.sub = 'attacker-injected'
    const forged = bytesToBase64Url(new TextEncoder().encode(JSON.stringify(claims)))
    shownToken = `${header}.${forged}.${signature}`
  }

  const verifySig = async () => {
    setSigVerdict(await verifyCompactJwsES256(shownToken, jwk))
  }
  const checkAtHash = async () => {
    setAtHash(await computeAtHash(OIDC_ACCESS_TOKEN))
  }

  return (
    <Section
      title="🪪 Valider un ID Token — JWKS → kid → clé → verify"
      intro="La séquence du chapitre « validation » d'OIDC, en vrai. On vérifie la signature d'un ID Token réel avec la clé du JWKS, puis on ALTÈRE un claim pour voir la vérification échouer. Enfin on recalcule at_hash."
    >
      <div className="rounded-md bg-surface-2 p-2.5 text-xs">
        <p className="text-muted">
          JWKS de l'OP (kid <span className="font-mono text-ink">{jwk.kid}</span>, {jwk.crv}) — clé{' '}
          <strong>publique</strong>, elle ne sert qu'à vérifier :
        </p>
        <code className="mt-1 block break-all font-mono text-[11px] text-ink/90">
          {`{"kty":"${jwk.kty}","crv":"${jwk.crv}","kid":"${jwk.kid}","x":"${jwk.x}","y":"${jwk.y}"}`}
        </code>
      </div>

      <label className="mt-3 flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={tampered}
          onChange={(e) => {
            setTampered(e.target.checked)
            setSigVerdict(null)
          }}
          className="accent-[var(--danger)]"
        />
        Altérer le payload (réécrire <code className="font-mono text-xs">sub</code> →{' '}
        <span className="font-mono text-xs text-danger">attacker-injected</span>)
      </label>

      <div className="mt-3">
        <JwtInspector
          label={tampered ? 'ID Token ALTÉRÉ' : 'ID Token (fixture OP)'}
          jwt={shownToken}
          note={
            tampered
              ? 'Le payload a été réécrit : la signature ne couvre plus ce contenu. Vérifiez-la ci-dessous.'
              : 'ID Token authentique, signé par la clé du JWKS ci-dessus.'
          }
        />
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" onClick={() => void verifySig()} className={btnCls}>
          🔎 Vérifier la signature (clé du JWKS)
        </button>
        <button type="button" onClick={() => void checkAtHash()} className={btnCls}>
          🔗 Recalculer at_hash
        </button>
      </div>

      {sigVerdict !== null && (
        <p
          className={`mt-3 rounded-md border p-2.5 text-sm font-medium ${
            sigVerdict ? 'border-ok bg-ok-soft text-ok' : 'border-danger bg-danger-soft text-danger'
          }`}
          aria-live="polite"
        >
          {sigVerdict
            ? '✔ Signature valide : le jeton vient bien de l’OP et n’a pas été modifié. (Restent iss, aud, exp, nonce à vérifier — la signature ne suffit jamais.)'
            : '✘ Signature invalide : le payload altéré ne correspond plus à la signature. Un ID Token injecté est rejeté ici même.'}
        </p>
      )}

      {atHash && (
        <output className={outCls}>
          <span className="text-muted">access_token</span> = {OIDC_ACCESS_TOKEN}
          <br />
          at_hash recalculé = <span className="text-accent">{atHash}</span>
          <br />
          at_hash dans l’ID Token = <span className="text-accent">{OIDC_AT_HASH}</span>{' '}
          {atHash === OIDC_AT_HASH ? (
            <span className="text-ok">✔ concordent</span>
          ) : (
            <span className="text-danger">✘ divergent</span>
          )}
        </output>
      )}

      <Callout kind="note" title="Ce que vous venez de faire">
        <p>
          Exactement les étapes 6 à 8 de la validation (§3.1.3.7) : sélection de la clé par{' '}
          <code>kid</code>, vérification ES256 sur « header.payload », et le contrôle{' '}
          <code>at_hash</code> (§3.1.3.6). Altérer un seul caractère du payload casse la signature :
          c'est ce qui rend un JWT infalsifiable sans la clé privée de l'OP.
        </p>
      </Callout>
    </Section>
  )
}

/* ---------------------------------------- OID4VCI : proof of possession */
function PopSection() {
  const [keys, setKeys] = useState<CryptoKeyPair | null>(null)
  const [jwk, setJwk] = useState<JsonWebKey | null>(null)
  const [cNonce, setCNonce] = useState<string | null>(null)
  const [proof, setProof] = useState<string | null>(null)
  const [proofNonce, setProofNonce] = useState<string | null>(null)
  const [verdict, setVerdict] = useState<{ sig: boolean; nonce: boolean } | null>(null)

  // Rôle Issuer : émettre un c_nonce imprévisible (Nonce Endpoint, §7).
  const issueNonce = () => {
    const bytes = crypto.getRandomValues(new Uint8Array(12))
    setCNonce('cn-' + bytesToBase64Url(bytes))
    setVerdict(null)
  }

  // Rôle Wallet : générer la paire de clés (la privée ne « sort » jamais d'ici).
  const genKeys = async () => {
    const kp = await generateES256KeyPair()
    setKeys(kp)
    setJwk(await exportPublicJwk(kp.publicKey))
    setProof(null)
    setVerdict(null)
  }

  // Rôle Wallet : construire et signer le jwt proof (App. F.1).
  const buildProof = async () => {
    if (!keys || !jwk || !cNonce) return
    const header = {
      alg: 'ES256',
      typ: 'openid4vci-proof+jwt',
      jwk: { kty: jwk.kty, crv: jwk.crv, x: jwk.x, y: jwk.y },
    }
    const payload = {
      aud: 'https://issuer.example',
      iat: Math.floor(Date.now() / 1000),
      nonce: cNonce,
    }
    const enc = (obj: object) => bytesToBase64Url(new TextEncoder().encode(JSON.stringify(obj)))
    const signingInput = `${enc(header)}.${enc(payload)}`
    const sig = bytesToBase64Url(await signES256(keys.privateKey, signingInput))
    setProof(`${signingInput}.${sig}`)
    setProofNonce(cNonce)
    setVerdict(null)
  }

  // Rôle Issuer : vérifier signature (avec la jwk du header) ET nonce courant.
  const verify = async (againstNonce: string) => {
    if (!proof) return
    const [h, p, s] = proof.split('.') as [string, string, string]
    const header = JSON.parse(new TextDecoder().decode(base64UrlToBytes(h))) as {
      jwk: JsonWebKey
    }
    const sig = await verifyCompactJwsES256(`${h}.${p}.${s}`, header.jwk)
    const claims = JSON.parse(new TextDecoder().decode(base64UrlToBytes(p))) as { nonce: string }
    setVerdict({ sig, nonce: claims.nonce === againstNonce })
  }

  // Rejeu RÉALISTE : le proof (signature intacte) est représenté alors que
  // l'Issuer a déjà émis un nouveau c_nonce — fraîcheur perdue, rejet.
  const replay = async () => {
    const bytes = crypto.getRandomValues(new Uint8Array(12))
    const fresh = 'cn-' + bytesToBase64Url(bytes)
    setCNonce(fresh)
    await verify(fresh)
  }

  return (
    <Section
      title="🎫 Proof of possession — le jwt proof d'OID4VCI"
      intro="Jouez les deux rôles de l'émission : l'Issuer émet un c_nonce, le Wallet signe un proof (typ openid4vci-proof+jwt) avec sa clé jetable, l'Issuer vérifie signature ET nonce — puis simulez un rejeu pour voir le rejet."
    >
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={issueNonce} className={btnCls}>
          1. (Issuer) Émettre un c_nonce
        </button>
        <button type="button" onClick={() => void genKeys()} className={btnCls}>
          2. (Wallet) Générer la clé
        </button>
        <button
          type="button"
          onClick={() => void buildProof()}
          disabled={!keys || !cNonce}
          className={`${btnCls} disabled:opacity-40`}
        >
          3. (Wallet) Signer le proof
        </button>
        <button
          type="button"
          onClick={() => void (cNonce && verify(cNonce))}
          disabled={!proof}
          className={`${btnCls} disabled:opacity-40`}
        >
          4. (Issuer) Vérifier
        </button>
        <button
          type="button"
          onClick={() => void replay()}
          disabled={!proof}
          className={`${btnCls} disabled:opacity-40`}
        >
          🧨 Rejouer le proof plus tard (nouveau c_nonce)
        </button>
      </div>

      {cNonce && (
        <output className={outCls}>
          c_nonce émis : <span className="text-accent">{cNonce}</span>
        </output>
      )}
      {jwk && (
        <output className={outCls}>
          Clé publique du wallet (la privée ne quitte pas cette page) :{' '}
          {`{"kty":"${jwk.kty}","crv":"${jwk.crv}","x":"${String(jwk.x).slice(0, 16)}…"}`}
        </output>
      )}
      {proof && (
        <div className="mt-3">
          <JwtInspector
            label="jwt proof signé"
            jwt={proof}
            note={
              proofNonce === cNonce
                ? 'Décodez : typ openid4vci-proof+jwt, jwk dans le header, nonce = le c_nonce courant.'
                : 'Attention : un nouveau c_nonce a été émis depuis — ce proof est périmé, la vérification du nonce échouera.'
            }
          />
        </div>
      )}
      {verdict && (
        <p
          className={`mt-3 rounded-md border p-2.5 text-sm font-medium ${
            verdict.sig && verdict.nonce
              ? 'border-ok bg-ok-soft text-ok'
              : 'border-danger bg-danger-soft text-danger'
          }`}
          aria-live="polite"
        >
          Signature : {verdict.sig ? '✔ valide' : '✘ invalide'} · nonce :{' '}
          {verdict.nonce ? '✔ correspond au c_nonce émis' : '✘ ne correspond pas'} —{' '}
          {verdict.sig && verdict.nonce
            ? "l'Issuer accepte : le credential sera lié à cette clé (cnf.jwk)."
            : verdict.sig
              ? 'signature intacte mais nonce étranger : rejeu détecté, émission refusée.'
              : 'payload altéré après signature : rejet immédiat.'}
        </p>
      )}
    </Section>
  )
}

/* --------------------------------------- OID4VP : divulgation sélective */
function SdSection() {
  const [revealed, setRevealed] = useState<Record<string, boolean>>({
    given_name: true,
    family_name: false,
    birthdate: true,
  })
  const [digests, setDigests] = useState<Record<string, string>>({})
  const [sdHash, setSdHash] = useState<string | null>(null)

  const chosen = VCI_DISCLOSURES.filter((d) => revealed[d.name])
  const presentationPart = [VCI_SD_JWT, ...chosen.map((d) => d.b64), ''].join('~')

  // Recalcule les digests des disclosures révélées + le sd_hash de la sélection.
  useEffect(() => {
    let cancelled = false
    void (async () => {
      const next: Record<string, string> = {}
      for (const d of chosen) next[d.name] = await computeDisclosureDigest(d.b64)
      const hash = await computeDisclosureDigest(presentationPart)
      if (!cancelled) {
        setDigests(next)
        setSdHash(hash)
      }
    })()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [presentationPart])

  return (
    <Section
      title="🎭 Divulgation sélective — choisissez ce que vous révélez"
      intro="Vous êtes le wallet, face à une demande de présentation. Cochez les claims à révéler : la présentation SD-JWT se construit en direct, chaque digest est recalculé et vérifié contre le _sd signé par l'Issuer, et le sd_hash de VOTRE sélection s'affiche — c'est lui que le Key Binding JWT scellerait."
    >
      <div className="flex flex-wrap gap-4">
        {VCI_DISCLOSURES.map((d) => (
          <label key={d.name} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={!!revealed[d.name]}
              onChange={(e) => setRevealed((r) => ({ ...r, [d.name]: e.target.checked }))}
              className="accent-[var(--ok)]"
            />
            <span className="font-mono text-xs">{d.name}</span>
            <span className="text-muted">= {String(d.value)}</span>
          </label>
        ))}
      </div>

      <output className={outCls}>
        Présentation ({chosen.length}/3 claims révélés) :{' '}
        <span className="text-ink/90">&lt;jwt signé&gt;</span>
        {chosen.map((d) => (
          <span key={d.name}>
            <span className="text-muted">~</span>
            <span className="text-ok">&lt;{d.name}&gt;</span>
          </span>
        ))}
        <span className="text-muted">~</span>
        <span className="text-accent">&lt;kb-jwt&gt;</span>
      </output>

      {chosen.map((d) => (
        <output key={d.name} className={outCls}>
          digest({d.name}) = <span className="text-ok">{digests[d.name] ?? '…'}</span>{' '}
          {digests[d.name] === d.digest ? (
            <span className="text-ok">✔ présent dans _sd</span>
          ) : (
            <span className="text-muted">calcul…</span>
          )}
        </output>
      ))}

      {sdHash && (
        <output className={outCls}>
          sd_hash de cette sélection = <span className="text-accent">{sdHash}</span>
        </output>
      )}

      <Callout kind="note">
        <p>
          Observez : cocher/décocher ne touche jamais au JWT signé — la signature de l'Issuer reste
          valide quelle que soit la sélection, car elle ne couvre que les digests. En revanche le{' '}
          <strong>sd_hash change à chaque sélection</strong> : le Key Binding JWT signé dessus fige
          exactement ce qui a été consenti — ni plus, ni moins.
        </p>
      </Callout>
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
