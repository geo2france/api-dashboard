/**
 * Échelle de z-index documentée pour l'ensemble du dashboard.
 *
 * Références externes :
 * - MapLibre GL gère ses propres couches internes, mais le gestionnaire
 *   de gestes natif (wheel/pinch) est rendu à z-index ~500 dans le DOM
 * - Ant Design : masques/modaux à ~1000, tooltips/popovers à ~1070
 *
 * Règle générale : les éléments collants (sticky) qui doivent passer
 * au-dessus de la carte utilisent CONTROL / FOOTER (≥ 600).
 */
export const Z_INDEX = {
  /** Sidebar collante (au-dessus du contenu, en dessous des contrôles et de la carte) */
  SIDER: 10,

  /** Gestionnaire de gestes MapLibre GL (valeur de référence, non modifiable ici) */
  MAP_GESTURE: 500,

  /** Barre de contrôle sticky en haut de page (au-dessus de la carte) */
  CONTROL: 600,

  /** Footer sticky en bas de page (au-dessus de la carte) */
  FOOTER: 600,

  /**
   * Bouton expand/collapse du footer — position absolute à l'intérieur du footer.
   * Doit passer au-dessus du contenu déployé du footer mais rester
   * en dessous des modaux Ant Design.
   */
  FOOTER_BUTTON: 1001,

  /** Modaux Ant Design (valeur de référence) */
  MODAL: 1100,
} as const;
