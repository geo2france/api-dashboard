import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from '../ThemeProvider';
import { useVisualIdentityLogo } from '../hooks/useVisualIdentityLogo';
import type { VisualIdentityTokens } from '../visual-identity/types';

const makeMockMatchMedia = (prefersDark = false) =>
  jest.fn().mockImplementation((query: string) => ({
    matches: prefersDark ? query === '(prefers-color-scheme: dark)' : false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }));

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: makeMockMatchMedia(false),
  });
});

beforeEach(() => {
  localStorage.clear();
  window.matchMedia = makeMockMatchMedia(false);
});

const LogoConsumer = () => {
  const logo = useVisualIdentityLogo();
  return (
    <div>
      <span data-testid="src">{logo?.src ?? 'none'}</span>
      <span data-testid="alt">{logo?.alt ?? 'none'}</span>
    </div>
  );
};

describe('useVisualIdentityLogo', () => {
  test('retourne undefined quand pas de visualIdentity', () => {
    render(
      <ThemeProvider>
        <LogoConsumer />
      </ThemeProvider>,
    );
    expect(screen.getByTestId('src')).toHaveTextContent('none');
  });

  test('retourne le logo en mode light', () => {
    window.matchMedia = makeMockMatchMedia(false);
    const visualIdentity: VisualIdentityTokens = {
      name: 'light-logo',
      light: { colorPrimary: '#000' },
      logo: { src: '/logo-light.svg', alt: 'Light', srcDark: '/logo-dark.svg' },
    };
    render(
      <ThemeProvider visualIdentity={visualIdentity} mode="light">
        <LogoConsumer />
      </ThemeProvider>,
    );
    expect(screen.getByTestId('src')).toHaveTextContent('/logo-light.svg');
  });

  test('retourne srcDark en mode dark quand disponible', () => {
    window.matchMedia = makeMockMatchMedia(true);
    const visualIdentity: VisualIdentityTokens = {
      name: 'dark-logo',
      light: { colorPrimary: '#000' },
      logo: { src: '/logo.svg', alt: 'Dark', srcDark: '/logo-dark.svg' },
    };
    render(
      <ThemeProvider visualIdentity={visualIdentity} mode="dark">
        <LogoConsumer />
      </ThemeProvider>,
    );
    expect(screen.getByTestId('src')).toHaveTextContent('/logo-dark.svg');
  });

  test('fallback sur src si srcDark absent en mode dark', () => {
    window.matchMedia = makeMockMatchMedia(true);
    const visualIdentity: VisualIdentityTokens = {
      name: 'no-dark-logo',
      light: { colorPrimary: '#000' },
      logo: { src: '/logo.svg', alt: 'Fallback' },
    };
    render(
      <ThemeProvider visualIdentity={visualIdentity} mode="dark">
        <LogoConsumer />
      </ThemeProvider>,
    );
    expect(screen.getByTestId('src')).toHaveTextContent('/logo.svg');
  });
});
