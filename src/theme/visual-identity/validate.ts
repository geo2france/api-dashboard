import type { VisualIdentityTokens } from './types';
import { contrastRatio, WCAG_CONTRAST } from '../utils/contrast';

const HEX_REGEX = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;
const RGB_REGEX = /^rgba?\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}/;

// Surfaces de référence des conteneurs AntD (defaultAlgorithm / darkAlgorithm).
const SURFACE_LIGHT = '#ffffff';
const SURFACE_DARK = '#141414';

function isValidColor(value: string): boolean {
  return HEX_REGEX.test(value) || RGB_REGEX.test(value);
}

export function validateVisualIdentityTokens(tokens: VisualIdentityTokens): void {
  if (process.env.NODE_ENV === 'production') return;

  if (!tokens.light.colorPrimary) {
    console.warn(
      `[api-dashboard/visual-identity] "${tokens.name}": light.colorPrimary est requis.`,
    );
    return;
  }

  if (!isValidColor(tokens.light.colorPrimary)) {
    console.warn(
      `[api-dashboard/visual-identity] "${tokens.name}": light.colorPrimary "${tokens.light.colorPrimary}" n'est pas un format de couleur valide (hex ou rgb attendu).`,
    );
  }

  if (tokens.dark?.colorPrimary && !isValidColor(tokens.dark.colorPrimary)) {
    console.warn(
      `[api-dashboard/visual-identity] "${tokens.name}": dark.colorPrimary "${tokens.dark.colorPrimary}" n'est pas un format de couleur valide.`,
    );
  }

  if (tokens.logo && typeof tokens.logo === 'object' && !tokens.logo.src) {
    console.warn(
      `[api-dashboard/visual-identity] "${tokens.name}": logo.src est requis quand logo est un objet.`,
    );
  }

  // Avertissement de contraste : signale les modes où la primaire échoue le seuil
  // UI (3:1) en avant-plan sur la surface du conteneur. Dans ces modes, la primaire
  // reste la couleur de FOND de marque, mais le texte/les icônes retombent sur un
  // neutre accessible (colorText). On teste par mode plutôt qu'un « ET » global :
  // blanc et fond sombre étant aux extrêmes, une couleur passe toujours au moins
  // l'un des deux — un échec « partout à 3:1 » serait impossible.
  if (isValidColor(tokens.light.colorPrimary)) {
    const failsLight = contrastRatio(tokens.light.colorPrimary, SURFACE_LIGHT) < WCAG_CONTRAST.UI;
    const darkPrimary = tokens.dark?.colorPrimary ?? tokens.light.colorPrimary;
    const failsDark =
      isValidColor(darkPrimary) && contrastRatio(darkPrimary, SURFACE_DARK) < WCAG_CONTRAST.UI;
    const affected = [failsLight && 'clair (light)', failsDark && 'sombre (dark)'].filter(Boolean);
    if (affected.length > 0) {
      console.warn(
        `[api-dashboard/visual-identity] "${tokens.name}": colorPrimary échoue le contraste WCAG (3:1) ` +
          `en avant-plan sur fond ${affected.join(' et ')}. Elle reste la couleur de fond de marque, ` +
          `mais le texte/les icônes utiliseront une couleur neutre accessible (colorText) dans ce(s) mode(s).`,
      );
    }
  }
}
