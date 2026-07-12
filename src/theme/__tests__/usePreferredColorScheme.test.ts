import { renderHook, act } from '@testing-library/react';
import { usePreferredColorScheme } from '../hooks/usePreferredColorScheme';

type ChangeHandler = (e: MediaQueryListEvent) => void;

const makeMockMatchMedia = (
  prefersDark = false,
  onAddEventListener?: (event: string, handler: ChangeHandler) => void,
) =>
  jest.fn().mockImplementation((query: string) => ({
    matches: prefersDark ? query === '(prefers-color-scheme: dark)' : false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn((event: string, handler: ChangeHandler) => {
      onAddEventListener?.(event, handler);
    }),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }));

beforeEach(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: makeMockMatchMedia(false),
  });
});

describe('usePreferredColorScheme', () => {
  test('retourne "light" quand OS est en mode clair', () => {
    window.matchMedia = makeMockMatchMedia(false);
    const { result } = renderHook(() => usePreferredColorScheme());
    expect(result.current).toBe('light');
  });

  test('retourne "dark" quand OS est en mode sombre', () => {
    window.matchMedia = makeMockMatchMedia(true);
    const { result } = renderHook(() => usePreferredColorScheme());
    expect(result.current).toBe('dark');
  });

  test('réagit aux changements live de préférence OS (light → dark)', () => {
    let capturedHandler: ChangeHandler | null = null;

    window.matchMedia = makeMockMatchMedia(false, (event, handler) => {
      if (event === 'change') capturedHandler = handler;
    });

    const { result } = renderHook(() => usePreferredColorScheme());
    expect(result.current).toBe('light');

    act(() => {
      capturedHandler?.({ matches: true } as MediaQueryListEvent);
    });

    expect(result.current).toBe('dark');
  });

  test('réagit aux changements live de préférence OS (dark → light)', () => {
    let capturedHandler: ChangeHandler | null = null;

    window.matchMedia = makeMockMatchMedia(true, (event, handler) => {
      if (event === 'change') capturedHandler = handler;
    });

    const { result } = renderHook(() => usePreferredColorScheme());
    expect(result.current).toBe('dark');

    act(() => {
      capturedHandler?.({ matches: false } as MediaQueryListEvent);
    });

    expect(result.current).toBe('light');
  });

  test('retourne "light" quand matchMedia est absent (SSR / environnement sans matchMedia)', () => {
    // Simule un environnement où matchMedia n'est pas disponible
    const originalMatchMedia = window.matchMedia;
    // @ts-expect-error simulation SSR / env sans matchMedia
    delete window.matchMedia;
    const { result } = renderHook(() => usePreferredColorScheme());
    expect(result.current).toBe('light');
    window.matchMedia = originalMatchMedia;
  });
});
