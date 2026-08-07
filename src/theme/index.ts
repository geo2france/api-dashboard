export { ThemeProvider } from './ThemeProvider';
export type { ThemeProviderProps } from './ThemeProvider';

export { ThemeToggle } from './ThemeToggle';

export { ThemeContext, useThemeContext } from './context';
export type { ThemeName, ThemeMode, ThemeContextValue } from './context';

export { usePreferredColorScheme } from './hooks/usePreferredColorScheme';
export { useThemeMode } from './hooks/useThemeMode';
export { useVisualIdentityLogo } from './hooks/useVisualIdentityLogo';
export { useBrandForeground } from './hooks/useBrandForeground';

export { contrastRatio, pickAccessibleForeground, WCAG_CONTRAST } from './utils/contrast';

export { geo2franceLightTheme } from './themes/geo2france.light';
export { geo2franceDarkTheme } from './themes/geo2france.dark';
export { neutralLightTheme } from './themes/neutral.light';
export { neutralDarkTheme } from './themes/neutral.dark';

export { baseTokens } from './tokens/base';
export { geo2francePalette } from './tokens/palettes/geo2france';
export { neutralPalette } from './tokens/palettes/neutral';

// Visual identity theming API
export { createVisualIdentity, isBundle, isShorthand } from './visual-identity';
export type {
  VisualIdentityColors,
  VisualIdentityTypography,
  VisualIdentityLogo,
  VisualIdentityTokens,
  VisualIdentityShorthand,
  VisualIdentityThemeBundle,
} from './visual-identity';
