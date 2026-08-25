import type { ActorRole } from '../engine/scenario'

/**
 * Code couleur constant des acteurs — le même partout (diagrammes, texte,
 * glossaire), défini une seule fois dans index.css.
 */
export function actorColor(role: ActorRole): string {
  return `var(--actor-${role})`
}

export const actorRoleLabels: Record<ActorRole, string> = {
  user: 'Resource Owner / Utilisateur',
  browser: 'User-Agent / Navigateur',
  client: 'Client / Relying Party',
  'authorization-server': 'Authorization Server / OpenID Provider',
  'resource-server': 'Resource Server',
  wallet: 'Wallet',
  issuer: 'Issuer',
  verifier: 'Verifier',
  attacker: 'Attaquant',
}
