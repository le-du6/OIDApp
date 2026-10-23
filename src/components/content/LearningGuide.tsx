import { Link } from '@tanstack/react-router'
import { getModule } from '../../data/curriculum'
import { faGraduationCap, faRoute } from '@fortawesome/free-solid-svg-icons'
import { AppIcon } from '../ui/AppIcon'
const guides: Record<string, { intro: string; concepts: string[]; links: [string, string][] }> = {
  oauth2: {
    intro:
      'Un rôle décrit une responsabilité, pas un appareil. Suivez d’abord la requête, puis la réponse et la valeur transmise à l’étape suivante.',
    concepts: [
      'HTTP : méthode et URL désignent une opération ; les en-têtes décrivent le message, le corps transporte ses données. Une réponse 302 conduit l’agent utilisateur à émettre une nouvelle requête.',
      'Client public ou confidentiel : capacité à protéger ses moyens d’authentification. Un client_id public identifie, sans authentifier.',
      'Grant : moyen d’obtenir une autorisation. Access token : moyen d’utiliser cette autorisation auprès de la ressource. Un bearer token doit rester confidentiel.',
      'JWT : conteneur de claims. JWS signe leur intégrité, JWK décrit une clé. Base64url ne chiffre rien ; une signature ne vaut confiance qu’avec une clé reconnue.',
    ],
    links: [
      ['Rôles et vocabulaire', '/oauth2/vocabulaire/decodage'],
      ['Canaux et architectures', '/oauth2/roles-canaux/front-back-channel'],
    ],
  },
  oidc: {
    intro:
      'OIDC ajoute un résultat d’authentification destiné au RP. Préparez les rôles OP/RP et la provenance des clés avant de lire un ID Token.',
    concepts: [
      'OP : serveur d’authentification ; RP : application qui accepte son résultat. Un ID Token est destiné au RP, un access token à une ressource.',
      'Discovery : à partir d’un issuer attendu, obtenir ses endpoints et jwks_uri. Vérifier la concordance de issuer avant de faire confiance au JWKS.',
      'JWS est une signature ; JWK une clé ; JWKS une collection de clés. kid sélectionne une clé, mais n’établit pas la confiance.',
      'Le RP lie sa demande à une session, reçoit le code par le navigateur, puis l’échange au token endpoint.',
    ],
    links: [
      ['Discovery et confiance', '/oidc/discovery/well-known'],
      ['Claims de l’ID Token', '/oidc/id-token/anatomie-id-token'],
    ],
  },
  oid4vci: {
    intro:
      'L’émission remet un credential au wallet. SD-JWT VC et mdoc sont des formats distincts ; nos calculs utilisent SD-JWT VC avec une clé de détenteur.',
    concepts: [
      'Credential Issuer : émet le credential. Authorization Server : autorise l’émission. Ces rôles sont réunis dans les exemples, mais peuvent être séparés.',
      'SD-JWT VC : JWT signé et disclosures séparées. mdoc : structures CBOR/COSE, type et namespaces. OID4VCI ne choisit pas un format unique.',
      'Key binding : l’Issuer signe la liaison à une clé publique ; une preuve ultérieure démontrera le contrôle de la partie privée.',
      'Proof jwt : preuve d’émission adressée à l’Issuer. KB-JWT : preuve de présentation adressée au Verifier. Une attestation de clé est encore un autre objet.',
    ],
    links: [
      ['Formats et clés', '/oid4vci/formats/sd-jwt-vc-mdoc'],
      ['Preuve d’émission', '/oid4vci/proof-of-possession/c-nonce-jwt-proof'],
    ],
  },
  oid4vp: {
    intro:
      'La présentation combine une demande, une sélection et une preuve de contexte. Le credential de référence est celui du module d’émission.',
    concepts: [
      'Verifier : demandeur de données. Wallet : sélectionne et présente. DCQL : décrit les credentials et claims demandés ; vp_token : structure la réponse.',
      'client_id peut inclure un préfixe, par exemple x509_san_dns:. Il indique la preuve d’identité à vérifier. L’ancien client_id_scheme était un paramètre séparé.',
      'cnf lie une clé au credential. Le KB-JWT signe aud, nonce, iat et le hash de la sélection ; ce mécanisme SD-JWT ne se transpose pas tel quel à mdoc.',
      'Authentifier un Verifier ne suffit pas à autoriser toute collecte. Consentement, confiance dans l’Issuer, statut et minimisation restent à vérifier.',
    ],
    links: [
      ['Identifier le Verifier', '/oid4vp/verifier-id/client-id-prefixes'],
      ['Requêtes DCQL', '/oid4vp/dcql/langage-requete'],
      ['Key binding', '/oid4vp/key-binding/anti-rejeu'],
    ],
  },
}
export function LearningGuide({ moduleId }: { moduleId: string }) {
  const guide = guides[moduleId],
    module = getModule(moduleId)
  if (!guide) return null
  return (
    <aside className="rounded-xl border border-accent/30 bg-accent-soft p-4 text-sm">
      <p className="flex items-center gap-2 font-semibold">
        <AppIcon icon={faRoute} tone="accent" className="size-4" />
        Repères pour cette leçon
      </p>
      <p className="mt-1 text-ink/90">{guide.intro}</p>
      <details className="mt-2">
        <summary className="cursor-pointer text-accent">
          <AppIcon icon={faGraduationCap} className="mr-1.5 inline size-3.5" />
          Prérequis et références
        </summary>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          {guide.concepts.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <nav className="mt-3 flex flex-wrap gap-3" aria-label="Rappels des prérequis">
          {guide.links.map(([label, to]) => (
            <Link key={to} to={to} className="text-accent underline">
              {label}
            </Link>
          ))}
        </nav>
        <p className="mt-3 text-xs text-muted">
          {module?.specVersions?.join(' · ')}. MUST : exigence ; SHOULD : recommandation à justifier
          en cas d’écart ; MAY : permission. Les choix de démonstration sont annoncés comme tels.
        </p>
      </details>
    </aside>
  )
}
