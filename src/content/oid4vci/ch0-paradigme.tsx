import { quizBank } from '../../data/quiz-bank'
import { Callout } from '../../components/content/Callout'
import { Quiz } from '../../components/content/Quiz'
import { AttackScenario } from '../../components/sequence/AttackScenario'

/**
 * OID4VCI — Chapitre 0 : le changement de paradigme. Fédération « phone
 * home » vs triangle Issuer/Holder/Verifier — l'argument vie privée central.
 */
export default function VciCh0() {
  return (
    <div className="lesson-prose">
      <p>
        Les modules OAuth 2.0 et OIDC vous ont appris le modèle <strong>fédéré</strong> : un IdP
        central authentifie, les services s'y connectent. Il fonctionne remarquablement bien — et il
        a un défaut que ni PKCE, ni DPoP, ni aucune contre-mesure de ce cours ne peut corriger,
        parce qu'il n'est pas un bug : c'est l'<em>architecture</em>. Comparez les deux mondes
        ci-dessous — d'abord la fédération vue sous l'angle de ce que l'IdP <em>apprend</em>, puis
        le <strong>triangle</strong>.
      </p>

      <div className="not-prose my-6">
        <AttackScenario
          attackId="oid4vci/federation-phone-home"
          protectedId="oid4vci/triangle"
          attackLabel="🏛 Fédération (phone home)"
          protectedLabel="🔺 Triangle wallet"
        />
      </div>

      <h2>Le « phone home »</h2>
      <p>
        Lors d'une nouvelle authentification fédérée, l'OP reçoit une requête qui identifie le RP.
        Il peut donc observer ces authentifications. Les actions effectuées ensuite dans une session
        locale du RP ne retournent pas nécessairement chez l'OP : cela ne lui donne pas
        automatiquement le graphe complet des usages.
      </p>

      <h2>Le triangle : découpler émission et présentation</h2>
      <p>
        OID4VCI remet un credential signé au wallet ; OID4VP permet de le présenter plus tard. Dans
        notre exemple, le Verifier possède déjà les clés et vérifie localement. Il n'a pas à
        notifier l'Issuer pour chaque présentation. La confidentialité des usages dépend toutefois
        des accès au statut, des résolutions réseau, des données divulguées et d'éventuelles
        collusions.
      </p>
      <Callout kind="note" title="L'analogie qui tient la route">
        <p>
          La carte d'identité physique : la préfecture (Issuer) vous la remet une fois ; vous
          (Holder) la présentez ensuite à qui vous voulez, sans que la préfecture soit prévenue. Le
          monde wallet transpose cette propriété au numérique — en y ajoutant ce que le papier n'a
          pas : divulgation sélective et preuve cryptographique de possession.
        </p>
      </Callout>
      <Callout kind="security" title="Rien n'est gratuit">
        <p>
          Le découplage a un prix, qu'il faut nommer : la <strong>révocation</strong> se complique
          (plus de vérification temps réel chez l'émetteur — il faut des listes de statut ou des
          durées de vie courtes), et la charge de sécurité se déplace vers le wallet (protection des
          clés — d'où la key attestation, chapitre 5). Un modèle n'est pas « meilleur » dans
          l'absolu : il déplace les propriétés.
        </p>
      </Callout>
      <Callout
        kind="spec"
        specRef="Règlement (UE) 2024/1183 (eIDAS 2.0)"
        title="Version de référence"
      >
        <p>
          Ce module suit OID4VCI 1.0 Final (16 septembre 2025), SD-JWT RFC 9901 et le profil SD-JWT
          VC draft 19 (31 août 2026). mdoc est introduit à partir des annexes OpenID ; le cours ne
          démontre pas une conformité ISO ou EUDI complète.
        </p>
      </Callout>

      <Quiz
        quizId="oid4vci/paradigme/phone-home"
        questions={quizBank['oid4vci/paradigme/phone-home']!}
      />
    </div>
  )
}
