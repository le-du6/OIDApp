import { Term } from '../../components/content/Term'
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
        Les Phases 1 et 2 vous ont appris le modèle <strong>fédéré</strong> : un IdP central
        authentifie, les services s'y connectent. Il fonctionne remarquablement bien — et il a un
        défaut que ni PKCE, ni DPoP, ni aucune contre-mesure de ce cours ne peut corriger, parce
        qu'il n'est pas un bug : c'est l'<em>architecture</em>. Comparez les deux mondes ci-dessous
        — d'abord la fédération vue sous l'angle de ce que l'IdP <em>apprend</em>, puis le{' '}
        <strong>triangle</strong>.
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
        À chaque connexion fédérée, le navigateur <em>retourne chez l'IdP</em> avec le{' '}
        <code>client_id</code> du service demandeur. Conséquence mécanique : l'IdP sait{' '}
        <strong>où</strong> vous vous connectez, <strong>quand</strong>, et à quelle fréquence — le
        graphe complet de votre vie numérique. Peu importe sa bonne foi : la donnée <em>existe</em>,
        donc elle peut fuiter, être exigée, être exploitée. C'est le problème dit du{' '}
        <Term id="phone-home" />.
      </p>

      <h2>Le triangle : découpler émission et présentation</h2>
      <p>
        Le modèle wallet casse cette architecture en séparant deux moments. L'
        <strong>émission</strong> (protocole OID4VCI, ce module) : le{' '}
        <Term id="credential-issuer" /> signe un <Term id="verifiable-credential" /> remis au{' '}
        <Term id="wallet" /> du <Term id="holder" />. La <strong>présentation</strong> (protocole
        OID4VP, Phase 4) : le wallet présente ce credential à un Verifier, qui le vérifie avec les
        clés <em>publiques</em> de l'émetteur — <strong>sans le contacter</strong>. L'émetteur ne
        sait ni où, ni quand, ni auprès de qui ses credentials sont présentés.
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
          Ce module suit <strong>OID4VCI 1.0 (spécification finale)</strong>, le profil{' '}
          <strong>SD-JWT VC</strong> (draft IETF, nov. 2025) et <strong>ISO/IEC 18013-5</strong>{' '}
          pour mdoc — versions affichées en tête de module. Les specs VC évoluent encore : quand
          vous lirez un article, vérifiez sa date contre ces références.
        </p>
      </Callout>

      <Quiz
        quizId="oid4vci/paradigme/phone-home"
        questions={[
          {
            id: 'q1',
            question: 'Pourquoi le « phone home » n’est-il pas corrigeable dans le modèle fédéré ?',
            options: [
              {
                text: 'Parce que les IdP refusent de le corriger',
                explanation:
                  'Non — ce n’est pas une question de volonté : même un IdP parfaitement honnête reçoit structurellement l’information.',
              },
              {
                text: 'Parce qu’il découle de l’architecture : chaque connexion passe par l’IdP, requête comprise',
                correct: true,
                explanation:
                  'Oui — l’authentication request porte le client_id du service. Tant que le flux repasse par l’IdP, la métadonnée existe. Seul un changement d’architecture la supprime.',
              },
              {
                text: 'Parce que TLS ne chiffre pas les métadonnées',
                explanation:
                  'Non — TLS chiffre bien le trafic vis-à-vis des tiers ; le problème est ce que l’IdP lui-même, terminaison légitime, apprend.',
              },
            ],
          },
          {
            id: 'q2',
            question: 'Dans le triangle, que se passe-t-il chez l’Issuer lors d’une présentation ?',
            options: [
              {
                text: 'Il valide la présentation en temps réel',
                explanation:
                  'Non — c’est justement ce que le modèle évite : le Verifier vérifie seul, avec les clés publiques déjà publiées.',
              },
              {
                text: 'Rien : il n’est ni contacté, ni informé',
                correct: true,
                explanation:
                  'Oui — c’est la propriété centrale. L’émetteur ne peut pas tracer les usages de ses credentials.',
              },
              {
                text: 'Il journalise la présentation à des fins d’audit',
                explanation:
                  'Non — il ne PEUT pas journaliser ce qu’il ne voit pas. La donnée n’existe nulle part chez lui.',
              },
            ],
          },
          {
            id: 'q3',
            question: 'Quelle contrepartie le découplage impose-t-il ?',
            options: [
              {
                text: 'La révocation se complique (listes de statut, durées courtes)',
                correct: true,
                explanation:
                  'Oui — sans vérification temps réel chez l’émetteur, il faut d’autres mécanismes de fraîcheur. Rien n’est gratuit : le modèle déplace les propriétés.',
              },
              {
                text: 'Les credentials ne sont plus signés',
                explanation:
                  'Non — au contraire, la signature de l’Issuer est ce qui rend la vérification hors ligne possible.',
              },
              {
                text: 'Le Verifier doit faire confiance au wallet sur parole',
                explanation:
                  'Non — le Verifier vérifie cryptographiquement signature et possession de clé. La confiance est calculée, pas déclarée.',
              },
            ],
          },
        ]}
      />
    </div>
  )
}
