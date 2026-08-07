import type { ThemeConfig } from 'antd';

export interface VisualIdentityColors {
  colorPrimary: string;
  colorLink?: string;
}

export interface VisualIdentityTypography {
  fontFamily?: string;
  fontSize?: number;
  fontSizeHeading1?: number;
}

export interface VisualIdentityLogo {
  src: string;
  alt: string;
  srcDark?: string;
  width?: number;
  height?: number;
}

/**
 * Structure plate de tokens de marque.
 * `dark` est optionnel : si absent, `light` est réutilisé avec `darkAlgorithm`.
 */
export interface VisualIdentityTokens {
  name: string;
  light: VisualIdentityColors;
  dark?: VisualIdentityColors;
  typography?: VisualIdentityTypography;
  borderRadius?: number;
  logo?: VisualIdentityLogo | string;
}

/**
 * Forme courte pour le cas dominant :
 * « je veux juste changer la couleur primaire et poser mon logo ».
 */
export interface VisualIdentityShorthand {
  name: string;
  primary: string;
  logo?: VisualIdentityLogo | string;
}

/**
 * Bundle généré par `createVisualIdentity()`.
 * Le marqueur `__visualIdentity` permet au ThemeProvider de distinguer un bundle prêt à l'emploi.
 */
export interface VisualIdentityThemeBundle {
  __visualIdentity: true;
  name: string;
  light: ThemeConfig;
  dark: ThemeConfig;
  logo?: VisualIdentityLogo;
}
