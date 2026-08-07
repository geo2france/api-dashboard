import type {
  VisualIdentityTokens,
  VisualIdentityShorthand,
  VisualIdentityThemeBundle,
  VisualIdentityLogo,
} from './types';

export function isShorthand(input: unknown): input is VisualIdentityShorthand {
  return (
    typeof input === 'object' &&
    input !== null &&
    'primary' in input &&
    !('light' in input) &&
    !('__visualIdentity' in input)
  );
}

export function isBundle(input: unknown): input is VisualIdentityThemeBundle {
  return (
    typeof input === 'object' &&
    input !== null &&
    '__visualIdentity' in input &&
    (input as VisualIdentityThemeBundle).__visualIdentity === true
  );
}

export function normalizeLogo(
  logo: VisualIdentityLogo | string | undefined,
  visualIdentityName: string,
): VisualIdentityLogo | undefined {
  if (!logo) return undefined;
  if (typeof logo === 'string') {
    return { src: logo, alt: visualIdentityName };
  }
  return logo;
}

export function normalizeTokens(input: VisualIdentityTokens | VisualIdentityShorthand): VisualIdentityTokens {
  if (isShorthand(input)) {
    return {
      name: input.name,
      light: { colorPrimary: input.primary },
      logo: input.logo,
    };
  }
  return input;
}
