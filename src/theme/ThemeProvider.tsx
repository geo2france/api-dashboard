import { useMemo } from 'react';
import { ConfigProvider, theme as antdToken } from 'antd';
import type { ThemeConfig } from 'antd';
import type { ReactNode } from 'react';
import { pickAccessibleForeground, WCAG_CONTRAST } from './utils/contrast';
import { ThemeContext } from './context';
import type { ThemeName, ThemeMode } from './context';
import { useThemeMode } from './hooks/useThemeMode';
import { geo2franceLightTheme } from './themes/geo2france.light';
import { geo2franceDarkTheme } from './themes/geo2france.dark';
import { neutralLightTheme } from './themes/neutral.light';
import { neutralDarkTheme } from './themes/neutral.dark';
import { createVisualIdentity } from './visual-identity/createVisualIdentity';
import { isBundle } from './visual-identity/normalize';
import type {
  VisualIdentityThemeBundle,
  VisualIdentityTokens,
  VisualIdentityShorthand,
  VisualIdentityLogo,
} from './visual-identity/types';

const PRESETS: Record<ThemeName, Record<'light' | 'dark', ThemeConfig>> = {
  geo2france: {
    light: geo2franceLightTheme,
    dark: geo2franceDarkTheme,
  },
  neutral: {
    light: neutralLightTheme,
    dark: neutralDarkTheme,
  },
};

export interface ThemeProviderProps {
  /**
   * Preset de thème (`'geo2france'` ou `'neutral'`).
   *
   * @default 'geo2france'
   */
  theme?: ThemeName;

  /**
   * Identité visuelle personnalisée. Trois formes acceptées :
   * - `VisualIdentityThemeBundle` (généré par `createVisualIdentity()`) — recommandé en prod
   * - `VisualIdentityTokens` (objet brut avec `light`) — auto-wrappé par le provider
   * - `VisualIdentityShorthand` (`{ name, primary }`) — démarrage rapide
   *
   * Mutuellement exclusif avec `theme` (priorité à `visualIdentity` si les deux sont fournis).
   */
  visualIdentity?: VisualIdentityThemeBundle | VisualIdentityTokens | VisualIdentityShorthand;

  /**
   * Mode d'affichage.
   * - `'auto'` : suit la préférence OS (`prefers-color-scheme`)
   * - `'light'` / `'dark'` : forcé
   *
   * @default 'auto'
   */
  mode?: ThemeMode;

  children: ReactNode;
}

/**
 * Fournisseur de thème principal.
 * Wrape `ConfigProvider` d'Ant Design avec :
 * - sélection du preset (geo2france / neutral)
 * - résolution du mode (auto / light / dark)
 * - support de l'identité visuelle personnalisée via `visualIdentity`
 * - exposition du contexte `ThemeContext` aux composants enfants
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  theme = 'geo2france',
  visualIdentity,
  mode: modeProp = 'auto',
  children,
}) => {
  const { mode, resolvedMode, setMode } = useThemeMode();

  // Quand l'intégrateur force un mode (≠ 'auto'), celui-ci est autoritaire :
  // il ignore le choix localStorage et le switcher est masqué (voir Sider).
  const isModeLocked = modeProp !== 'auto';
  const effectiveMode = isModeLocked ? modeProp : mode;
  const effectiveResolvedMode = isModeLocked ? modeProp : resolvedMode;

  const modeKey: 'light' | 'dark' = effectiveResolvedMode === 'dark' ? 'dark' : 'light';

  // Mémoïse le bundle visualIdentity pour éviter les re-créations inutiles
  const visualIdentityBundle = useMemo<VisualIdentityThemeBundle | undefined>(() => {
    if (!visualIdentity) return undefined;
    if (isBundle(visualIdentity)) return visualIdentity;
    return createVisualIdentity(visualIdentity as VisualIdentityTokens | VisualIdentityShorthand);
  }, [visualIdentity]);

  let resolvedThemeName: ThemeName = 'geo2france';
  let antdTheme: ThemeConfig;
  let logo: VisualIdentityLogo | undefined;

  if (visualIdentity && visualIdentityBundle) {
    // visualIdentity a priorité sur theme
    resolvedThemeName = 'neutral';
    antdTheme = visualIdentityBundle[modeKey];
    logo = visualIdentityBundle.logo;
  } else if (theme === 'geo2france' || theme === 'neutral') {
    resolvedThemeName = theme;
    antdTheme = PRESETS[resolvedThemeName][modeKey];
  } else {
    antdTheme = PRESETS.geo2france[modeKey];
  }

  return (
    <ThemeContext.Provider
      value={{
        themeName: resolvedThemeName,
        mode: effectiveMode,
        resolvedMode: effectiveResolvedMode === 'dark' ? 'dark' : 'light',
        isModeLocked,
        setMode,
        logo,
      }}
    >
      <ConfigProvider theme={antdTheme}>
        <AccessibleBrandButtons>{children}</AccessibleBrandButtons>
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};

/**
 * Neutralise globalement le hover de marque des boutons `type="default"`.
 *
 * AntD dérive `colorPrimaryHover`/`colorPrimaryBorderHover` de la primaire : au
 * survol, l'icône et la bordure d'un bouton `default` passent dans cette teinte
 * — illisible quand la primaire est claire. On
 * surcharge ici les tokens `default*` du composant Button avec un avant-plan
 * garanti accessible : la marque là où elle passe le contraste (dark), un neutre
 * sinon (light). Appliqué une seule fois, donc couvre tous les boutons `default`
 * présents et futurs — les tokens `default*` n'affectent pas les boutons pleins.
 *
 * Doit être rendu SOUS le `ConfigProvider` de thème pour lire les tokens résolus.
 */
const AccessibleBrandButtons: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { token } = antdToken.useToken();
  const fgUi = pickAccessibleForeground(
    token.colorPrimary,
    token.colorBgContainer,
    token.colorText,
    WCAG_CONTRAST.UI,
  );

  return (
    <ConfigProvider
      theme={{
        components: {
          Button: {
            defaultHoverColor: fgUi,
            defaultHoverBorderColor: fgUi,
            defaultActiveColor: fgUi,
            defaultActiveBorderColor: fgUi,
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
};

export default ThemeProvider;
