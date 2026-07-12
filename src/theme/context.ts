import { createContext, useContext } from 'react';
import type { VisualIdentityLogo } from './visual-identity/types';

export type ThemeName = 'neutral' | 'geo2france';
export type ThemeMode = 'light' | 'dark' | 'auto';

export interface ThemeContextValue {
  /** Preset de thème actif */
  themeName: ThemeName;
  /** Mode demandé (peut être 'auto') */
  mode: ThemeMode;
  /** Mode résolu (jamais 'auto' — 'light' ou 'dark' effectif) */
  resolvedMode: 'light' | 'dark';
  /** true quand le mode est forcé par l'intégrateur (themeMode ≠ 'auto') — le switcher doit alors être masqué */
  isModeLocked: boolean;
  /** Changer le mode (persiste en localStorage) */
  setMode: (mode: ThemeMode) => void;
  /** Logo de l'identité visuelle (fourni via `visualIdentity`) */
  logo?: VisualIdentityLogo;
}

export const ThemeContext = createContext<ThemeContextValue>({
  themeName: 'geo2france',
  mode: 'light',
  resolvedMode: 'light',
  isModeLocked: false,
  setMode: () => undefined,
});

export const useThemeContext = () => useContext(ThemeContext);
