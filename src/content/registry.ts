import { lazy, type ComponentType, type LazyExoticComponent } from 'react'
import { lessonKey } from '../data/curriculum'

/**
 * Registre des contenus de leçons (code-splitting : chaque leçon est un
 * chunk chargé à la demande). Clé = moduleId/chapterId/lessonId.
 */
export const lessonComponents: Record<string, LazyExoticComponent<ComponentType>> = {
  [lessonKey('oauth2', 'vocabulaire', 'decodage')]: lazy(() => import('./oauth2/ch0-vocabulaire')),
  [lessonKey('oauth2', 'probleme-origine', 'partage-mot-de-passe')]: lazy(
    () => import('./oauth2/ch1-probleme-origine'),
  ),
  [lessonKey('oauth2', 'roles-canaux', 'front-back-channel')]: lazy(
    () => import('./oauth2/ch2-roles-canaux'),
  ),
  [lessonKey('oauth2', 'authorization-code', 'flow-pas-a-pas')]: lazy(
    () => import('./oauth2/ch3-authorization-code'),
  ),
  [lessonKey('oauth2', 'tokens', 'anatomie-tokens')]: lazy(() => import('./oauth2/ch4-tokens')),
  [lessonKey('oauth2', 'attaques', 'csrf-state')]: lazy(() => import('./oauth2/ch5-csrf-state')),
  [lessonKey('oauth2', 'attaques', 'interception-pkce')]: lazy(
    () => import('./oauth2/ch5-interception-pkce'),
  ),
  [lessonKey('oauth2', 'attaques', 'implicit-ropc')]: lazy(
    () => import('./oauth2/ch5-implicit-ropc'),
  ),
  [lessonKey('oauth2', 'attaques', 'bearer-dpop')]: lazy(() => import('./oauth2/ch5-bearer-dpop')),
  [lessonKey('oauth2', 'autres-flows', 'client-credentials-device')]: lazy(
    () => import('./oauth2/ch6-autres-flows'),
  ),
  [lessonKey('oauth2', 'etat-de-l-art', 'bcp-oauth21')]: lazy(
    () => import('./oauth2/ch7-etat-de-l-art'),
  ),

  // — OIDC (Phase 2) —
  [lessonKey('oidc', 'pourquoi-oidc', 'anti-pattern-login')]: lazy(
    () => import('./oidc/ch0-pourquoi-oidc'),
  ),
  [lessonKey('oidc', 'id-token', 'anatomie-id-token')]: lazy(() => import('./oidc/ch1-id-token')),
  [lessonKey('oidc', 'flow-complet', 'flow-pas-a-pas')]: lazy(
    () => import('./oidc/ch2-flow-complet'),
  ),
  [lessonKey('oidc', 'validation', 'jwks-kid-verify')]: lazy(() => import('./oidc/ch3-validation')),
  [lessonKey('oidc', 'discovery', 'well-known')]: lazy(() => import('./oidc/ch4-discovery')),
  [lessonKey('oidc', 'nonce-at-hash', 'liaisons')]: lazy(() => import('./oidc/ch5-nonce-at-hash')),
  [lessonKey('oidc', 'oidc-vs-saml', 'comparaison')]: lazy(() => import('./oidc/ch6-oidc-vs-saml')),
}
