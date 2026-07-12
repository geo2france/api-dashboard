import { useCallback, useState } from 'react';
import type { ThemeMode } from '../context';
import { usePreferredColorScheme } from './usePreferredColorScheme';

const STORAGE_KEY = 'dashboard-theme-mode';

function readStoredMode(): ThemeMode {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark' || stored === 'auto') return stored;
  } catch {
    // SSR ou localStorage indisponible
  }
  return 'auto';
}

/**
 * Gère l'état global du mode light/dark/auto.
 * - Persiste le choix dans `localStorage` (clé `dashboard-theme-mode`).
 * - En mode `auto`, résout automatiquement selon `prefers-color-scheme`.
 */
export function useThemeMode(): {
  mode: ThemeMode;
  resolvedMode: 'light' | 'dark';
  setMode: (mode: ThemeMode) => void;
} {
  const [mode, setModeState] = useState<ThemeMode>(readStoredMode);
  const systemMode = usePreferredColorScheme();

  const resolvedMode: 'light' | 'dark' = mode === 'auto' ? systemMode : mode;

  const setMode = useCallback((next: ThemeMode) => {
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // SSR ou localStorage indisponible
    }
    setModeState(next);
  }, []);

  return { mode, resolvedMode, setMode };
}
