import { useEffect, useState } from 'react';

/**
 * Détecte la préférence système `prefers-color-scheme` et réagit aux changements.
 * Retourne `'dark'` si l'OS est en mode sombre, sinon `'light'`.
 */
export function usePreferredColorScheme(): 'light' | 'dark' {
  const getPreferred = (): 'light' | 'dark' =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';

  const [preferred, setPreferred] = useState<'light' | 'dark'>(getPreferred);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setPreferred(e.matches ? 'dark' : 'light');

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return preferred;
}
