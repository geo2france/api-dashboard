import { useCallback } from 'react';
import { theme } from 'antd';
import { pickAccessibleForeground, WCAG_CONTRAST } from '../utils/contrast';

/**
 * Dérive une couleur d'avant-plan de marque **garantie accessible**.
 *
 * Principe : `colorPrimary` est une couleur de *fond*. Employée en avant-plan
 * (texte, icône, bordure, focus ring) sur une surface neutre, elle échoue
 * souvent le contraste WCAG quand la graine est claire (ex. le vert #95c11f en
 * light mode). Ce hook renvoie la primaire là où elle est lisible (souvent en
 * dark) et retombe sur `colorText` (neutre, toujours accessible) sinon.
 *
 * Lit les tokens **résolus au runtime** via `theme.useToken()` : fonctionne donc
 * pour tous les thèmes (presets geo2france/neutral comme identités visuelles
 * custom) et contre la *vraie* surface, par mode — ce qu'une valeur statique
 * calculée à la construction du thème ne pourrait pas garantir.
 *
 * @returns `brandForeground(background?, minRatio?)` — par défaut testée contre
 *          `colorBgContainer` au seuil texte (4.5). Passer `WCAG_CONTRAST.UI`
 *          (3) pour une icône/bordure/focus, ou une autre surface (ex.
 *          `token.colorPrimaryBgHover` pour un texte posé sur la pastille).
 */
export function useBrandForeground() {
  const { token } = theme.useToken();

  return useCallback(
    (background: string = token.colorBgContainer, minRatio: number = WCAG_CONTRAST.TEXT): string =>
      pickAccessibleForeground(token.colorPrimary, background, token.colorText, minRatio),
    [token.colorPrimary, token.colorBgContainer, token.colorText],
  );
}
