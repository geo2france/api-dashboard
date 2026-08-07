import type { ThemeConfig } from 'antd';

/**
 * Tokens partagés entre tous les thèmes et modes.
 *
 * RÈGLE CRITIQUE Ant Design v6 : aucune couleur ici.
 * darkAlgorithm ne peut pas override les tokens couleur définis dans baseTokens.
 * cf. https://github.com/ant-design/ant-design/issues/53719
 */
export const baseTokens: Pick<ThemeConfig, 'token' | 'components'> = {
  token: {
    borderRadius: 4,
    fontFamily: 'Inter, system-ui, sans-serif',
    linkHoverDecoration: 'underline',
  },
  components: {
    Timeline: {
      itemPaddingBottom: 40,
    },
    Tooltip: {
      // Padding horizontal (gauche/droite) du contenu des tooltips.
      // Ant Design v6 calcule ce padding à partir du token global `paddingXS`
      // (8px par défaut) ; on le surcharge ici uniquement pour le composant
      // Tooltip afin que tous les tooltips de l'app soient cohérents.
      paddingXS: 12,
    },
    // Form.labelColor dépend du mode (light/dark) → défini dans chaque thème complet
  },
};
