import chroma from "chroma-js";



type PaletteMode = "tintshade" | "brightness";

/**
 * Génère une palette centrée autour d'une couleur.
 *
 * @param color - Couleur centrale (hex, rgb, etc.)
 * @param levels - Nombre de classes (défaut: 7, impair recommandé)
 * @param extent - Intensité max des variations (0 → 1, défaut: 0.75)
 * @param mode - Méthode de génération :
 *  - "tintshade" : variations HSL (tint/shade)
 *  - "brightness" : variations perceptuelles (brighten/darken)
 *
 * @returns Tableau de couleurs hex
 */
export function generateGradient(
  color: string,
  levels: number = 8,
  extent: number = 0.75,
  mode: PaletteMode = "tintshade"
): string[] {
  if (levels < 3) {
    throw new Error("levels must be >= 3");
  }

  const c = chroma(color);

  if (mode === "tintshade") {
    return chroma
    .scale([c.tint(extent), c, c.shade(extent)])
    .mode("lab")
    .colors(levels);
  }

  // "lab"
  return chroma
    .scale([c.brighten(extent), c, c.darken(extent)])
    .mode("lab")
    .colors(levels);
}