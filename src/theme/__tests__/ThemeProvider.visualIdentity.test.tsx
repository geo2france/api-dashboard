import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from '../ThemeProvider';
import { useThemeContext } from '../context';
import { createVisualIdentity } from '../visual-identity/createVisualIdentity';
import type { VisualIdentityShorthand, VisualIdentityTokens } from '../visual-identity/types';

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

const ThemeConsumer = () => {
  const ctx = useThemeContext();
  return (
    <div>
      <span data-testid="themeName">{ctx.themeName}</span>
      <span data-testid="resolvedMode">{ctx.resolvedMode}</span>
      <span data-testid="logoSrc">{ctx.logo?.src ?? 'none'}</span>
      <span data-testid="logoAlt">{ctx.logo?.alt ?? 'none'}</span>
    </div>
  );
};

describe('ThemeProvider - prop visualIdentity', () => {
  test('visualIdentity shorthand rend le composant sans crash', () => {
    const visualIdentity: VisualIdentityShorthand = { name: 'test', primary: '#FF0000' };
    render(
      <ThemeProvider visualIdentity={visualIdentity}>
        <ThemeConsumer />
      </ThemeProvider>,
    );
    expect(screen.getByTestId('themeName')).toHaveTextContent('neutral');
  });

  test('visualIdentity tokens (light seul) fonctionne', () => {
    const visualIdentity: VisualIdentityTokens = {
      name: 'myVisualIdentity',
      light: { colorPrimary: '#00FF00' },
      logo: { src: '/logo.svg', alt: 'My Visual Identity' },
    };
    render(
      <ThemeProvider visualIdentity={visualIdentity}>
        <ThemeConsumer />
      </ThemeProvider>,
    );
    expect(screen.getByTestId('logoSrc')).toHaveTextContent('/logo.svg');
    expect(screen.getByTestId('logoAlt')).toHaveTextContent('My Visual Identity');
  });

  test('visualIdentity bundle (pré-créé) est utilisé directement', () => {
    const bundle = createVisualIdentity({
      name: 'pre-built',
      light: { colorPrimary: '#0000FF' },
      logo: { src: '/pre.svg', alt: 'Pre' },
    });
    render(
      <ThemeProvider visualIdentity={bundle}>
        <ThemeConsumer />
      </ThemeProvider>,
    );
    expect(screen.getByTestId('logoSrc')).toHaveTextContent('/pre.svg');
    expect(screen.getByTestId('themeName')).toHaveTextContent('neutral');
  });

  test('visualIdentity est prioritaire sur un preset theme', () => {
    const visualIdentity: VisualIdentityShorthand = { name: 'priority', primary: '#111' };

    render(
      <ThemeProvider visualIdentity={visualIdentity} theme="geo2france">
        <ThemeConsumer />
      </ThemeProvider>,
    );

    // visualIdentity gagne : le themeName résolu est 'neutral', pas le preset fourni.
    expect(screen.getByTestId('themeName')).toHaveTextContent('neutral');
  });

  test('mode dark avec visualIdentity affiche resolvedMode dark', () => {
    window.matchMedia = makeMockMatchMedia(true);
    const visualIdentity: VisualIdentityShorthand = { name: 'dark-test', primary: '#333' };
    render(
      <ThemeProvider visualIdentity={visualIdentity} mode="auto">
        <ThemeConsumer />
      </ThemeProvider>,
    );
    expect(screen.getByTestId('resolvedMode')).toHaveTextContent('dark');
  });

  test('sans visualIdentity ni theme -> fallback geo2france', () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>,
    );
    expect(screen.getByTestId('themeName')).toHaveTextContent('geo2france');
  });
});
