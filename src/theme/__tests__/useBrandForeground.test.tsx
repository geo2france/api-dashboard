import { render, screen } from '@testing-library/react';
import { theme } from 'antd';
import chroma from 'chroma-js';
import { ThemeProvider } from '../ThemeProvider';
import { useBrandForeground } from '../hooks/useBrandForeground';
import { WCAG_CONTRAST } from '../utils/contrast';

const makeMatchMedia = () =>
  jest.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }));

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', { writable: true, value: makeMatchMedia() });
});

// Consomme le hook et expose la couleur dérivée + la surface testée + la primaire.
const Consumer = () => {
  const { token } = theme.useToken();
  const brandFg = useBrandForeground();
  const fg = brandFg(token.colorBgContainer, WCAG_CONTRAST.TEXT);
  return (
    <>
      <span data-testid="fg">{fg}</span>
      <span data-testid="bg">{token.colorBgContainer}</span>
      <span data-testid="primary">{token.colorPrimary}</span>
    </>
  );
};

const renderInMode = (mode: 'light' | 'dark') =>
  render(
    <ThemeProvider theme="geo2france" mode={mode}>
      <Consumer />
    </ThemeProvider>,
  );

describe('useBrandForeground (preset geo2france #95c11f)', () => {
  test('light : la primaire échoue → repli neutre accessible (≠ primaire, contraste OK)', () => {
    renderInMode('light');
    const fg = screen.getByTestId('fg').textContent!;
    const bg = screen.getByTestId('bg').textContent!;
    const primary = screen.getByTestId('primary').textContent!;

    expect(fg.toLowerCase()).not.toBe(primary.toLowerCase());
    // La couleur retenue DOIT être accessible sur la surface (la garantie centrale).
    expect(chroma.contrast(fg, bg)).toBeGreaterThanOrEqual(WCAG_CONTRAST.TEXT);
  });

  test('dark : la primaire passe le contraste → conservée', () => {
    renderInMode('dark');
    const fg = screen.getByTestId('fg').textContent!;
    const bg = screen.getByTestId('bg').textContent!;
    const primary = screen.getByTestId('primary').textContent!;

    expect(fg.toLowerCase()).toBe(primary.toLowerCase());
    expect(chroma.contrast(fg, bg)).toBeGreaterThanOrEqual(WCAG_CONTRAST.TEXT);
  });
});
