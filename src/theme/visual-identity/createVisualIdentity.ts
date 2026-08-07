import { theme as antTheme } from 'antd';
import type { ThemeConfig } from 'antd';
import type {
  VisualIdentityTokens,
  VisualIdentityShorthand,
  VisualIdentityThemeBundle,
  VisualIdentityColors,
} from './types';
import { normalizeTokens, normalizeLogo } from './normalize';
import { validateVisualIdentityTokens } from './validate';
import { neutralLightTheme } from '../themes/neutral.light';
import { neutralDarkTheme } from '../themes/neutral.dark';
import { deepMerge } from '../utils/deepMerge';

function colorsToToken(colors: VisualIdentityColors): Record<string, unknown> {
  const token: Record<string, unknown> = {};
  if (colors.colorPrimary) token.colorPrimary = colors.colorPrimary;
  if (colors.colorLink) token.colorLink = colors.colorLink;
  return token;
}

/**
 * Crée un bundle de thème à partir de tokens d'identité visuelle.
 * Accepte `VisualIdentityTokens` (forme normale) ou `VisualIdentityShorthand` (forme courte).
 *
 * Le bundle résultant est prêt à être passé à `<ThemeProvider visualIdentity={...} />`.
 */
export function createVisualIdentity(
  input: VisualIdentityTokens | VisualIdentityShorthand,
): VisualIdentityThemeBundle {
  const tokens = normalizeTokens(input);
  validateVisualIdentityTokens(tokens);

  const logo = normalizeLogo(tokens.logo, tokens.name);
  const darkColors = tokens.dark ?? tokens.light;

  const lightToken = {
    ...colorsToToken(tokens.light),
    ...(tokens.typography?.fontFamily ? { fontFamily: tokens.typography.fontFamily } : {}),
    ...(tokens.typography?.fontSize ? { fontSize: tokens.typography.fontSize } : {}),
    ...(tokens.typography?.fontSizeHeading1 ? { fontSizeHeading1: tokens.typography.fontSizeHeading1 } : {}),
    ...(tokens.borderRadius !== undefined ? { borderRadius: tokens.borderRadius } : {}),
  };

  const darkToken = {
    ...colorsToToken(darkColors),
    ...(tokens.typography?.fontFamily ? { fontFamily: tokens.typography.fontFamily } : {}),
    ...(tokens.typography?.fontSize ? { fontSize: tokens.typography.fontSize } : {}),
    ...(tokens.typography?.fontSizeHeading1 ? { fontSizeHeading1: tokens.typography.fontSizeHeading1 } : {}),
    ...(tokens.borderRadius !== undefined ? { borderRadius: tokens.borderRadius } : {}),
  };

  const lightTheme = deepMerge(
    neutralLightTheme as Record<string, unknown>,
    { token: lightToken } as Record<string, unknown>,
  ) as ThemeConfig;

  const darkTheme = deepMerge(
    neutralDarkTheme as Record<string, unknown>,
    {
      algorithm: antTheme.darkAlgorithm,
      token: darkToken,
    } as Record<string, unknown>,
  ) as ThemeConfig;

  return {
    __visualIdentity: true,
    name: tokens.name,
    light: lightTheme,
    dark: darkTheme,
    logo,
  };
}
