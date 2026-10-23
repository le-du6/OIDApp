/** Profondeur du cours, pas déclaration de conformité d’une implémentation. */
export const coverage: Record<string, [string, string, string][]> = {
  oauth2: [
    [
      'Code, PKCE, state, bearer et DPoP',
      'Démonstration',
      'Messages animés ; calculs PKCE et signatures dans le laboratoire.',
    ],
    [
      'Client Credentials, Device Grant, erreurs',
      'Introduction',
      'Parcours et erreurs représentatives ; pas de serveur ni de stratégie de reprise exhaustive.',
    ],
    [
      'PAR, JAR, RAR, mTLS, authentification client',
      'Introduction',
      'Rôles et garanties ; détails de déploiement dans les RFC citées.',
    ],
  ],
  oidc: [
    [
      'Code flow, Discovery, claims et validation',
      'Démonstration',
      'Parcours animé ; treize points conditionnels consultables. Le labo exécute seulement ES256 et at_hash.',
    ],
    [
      'claims, acr/amr/azp, JWE, Hybrid et sessions',
      'Introduction',
      'Conditions et distinctions ; aucune implémentation de JWE ni de gestion de session fédérée.',
    ],
    [
      'Logout, enregistrement dynamique et autres extensions',
      'Approfondissement externe',
      'À étudier séparément selon le profil du RP et de l’OP.',
    ],
  ],
  oid4vci: [
    [
      'Deux grants, découverte, proof jwt et SD-JWT VC',
      'Démonstration',
      'Scénarios et artefacts communs avec VP ; émission locale limitée au profil du laboratoire.',
    ],
    [
      'mdoc, attestations et stockage des clés',
      'Introduction',
      'Structures et garanties distinctes ; pas de validateur ISO ni d’attestation matérielle exécutée.',
    ],
    [
      'Émission différée, notifications, chiffrement et lots',
      'Approfondissement externe',
      'OID4VCI 1.0 §8–11 : messages et reprises ne sont pas simulés ici.',
    ],
    [
      'Authentification client par wallet attestation',
      'Approfondissement externe',
      'Distincte de key attestation ; choix de profil à approfondir, notamment HAIP §4.4.1.',
    ],
  ],
  oid4vp: [
    [
      'Request Object, direct_post, DCQL et KB-JWT',
      'Démonstration',
      'Parcours animé et signature fraîche ; X.509 est expliqué, pas validé par le laboratoire.',
    ],
    [
      'Conservation, corrélation, direct_post.jwt et DC API',
      'Introduction',
      'Conditions et frontières de confiance ; pas de JWE ni d’appel DC API exécuté.',
    ],
    [
      'transaction_data, mdoc, négociation avancée et statut',
      'Approfondissement externe',
      'OID4VP §5–8, annexes A/B et profils ; le laboratoire n’évalue pas ces extensions.',
    ],
    [
      'HAIP 1.0 Final',
      'Introduction',
      'Rôle d’un profil d’interopérabilité ; les exemples du cours ne revendiquent pas la conformité HAIP.',
    ],
  ],
}
