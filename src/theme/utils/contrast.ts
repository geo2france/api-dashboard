import chroma from 'chroma-js';

/**
 * Seuils de contraste WCAG 2.1 (ratio minimum).
 * - TEXT : 1.4.3 — texte normal (4.5:1)
 * - UI   : 1.4.11 — composants non-textuels : icônes, bordures, focus ring (3:1)
 */
export const WCAG_CONTRAST = {
  TEXT: 4.5,
  UI: 3,
} as const;

/**
 * Ratio de contraste WCAG entre deux couleurs (n'importe quel format accepté
 * par chroma-js : hex, rgb(a), nom CSS). Retourne une valeur dans [1, 21].
 * Si une couleur est invalide, retourne 1 (pire cas) plutôt que de throw —
 * le contrôle de format reste la responsabilité de `validate.ts`.
 */
export function contrastRatio(a: string, b: string): number {
  try {
    return chroma.contrast(a, b);
  } catch {
    return 1;
  }
}

/**
 * Choisit une couleur d'avant-plan accessible sur `background`.
 * Renvoie `candidate` (la couleur de marque) si son contraste atteint `minRatio`,
 * sinon `fallback` (un neutre garanti accessible, typiquement `token.colorText`).
 *
 * C'est le cœur de la stratégie « marque = fond, avant-plan dérivé et garanti » :
 * la primaire est conservée là où elle est lisible (souvent en dark), et remplacée
 * par le neutre là où elle échoue (souvent en light sur fond clair).
 */
export function pickAccessibleForeground(
  candidate: string,
  background: string,
  fallback: string,
  minRatio: number = WCAG_CONTRAST.TEXT,
): string {
  return contrastRatio(candidate, background) >= minRatio ? candidate : fallback;
}
