import { renderHook, act } from '@testing-library/react';
import { useThemeMode } from '../hooks/useThemeMode';

const STORAGE_KEY = 'dashboard-theme-mode';

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

beforeEach(() => {
  localStorage.clear();
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: makeMockMatchMedia(false),
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 5.1.4 — Persistance localStorage
// ─────────────────────────────────────────────────────────────────────────────

describe('useThemeMode', () => {
  test('valeur initiale : mode = auto, resolvedMode = light (OS clair)', () => {
    const { result } = renderHook(() => useThemeMode());
    expect(result.current.mode).toBe('auto');
    expect(result.current.resolvedMode).toBe('light');
  });

  test('valeur initiale avec OS sombre : resolvedMode = dark', () => {
    window.matchMedia = makeMockMatchMedia(true);
    const { result } = renderHook(() => useThemeMode());
    expect(result.current.mode).toBe('auto');
    expect(result.current.resolvedMode).toBe('dark');
  });

  test('setMode("dark") → mode = dark, resolvedMode = dark', () => {
    const { result } = renderHook(() => useThemeMode());
    act(() => {
      result.current.setMode('dark');
    });
    expect(result.current.mode).toBe('dark');
    expect(result.current.resolvedMode).toBe('dark');
  });

  test('setMode("light") → mode = light, resolvedMode = light', () => {
    const { result } = renderHook(() => useThemeMode());
    act(() => {
      result.current.setMode('light');
    });
    expect(result.current.mode).toBe('light');
    expect(result.current.resolvedMode).toBe('light');
  });

  test('setMode("auto") + OS light → resolvedMode = light', () => {
    window.matchMedia = makeMockMatchMedia(false);
    const { result } = renderHook(() => useThemeMode());
    act(() => {
      result.current.setMode('dark');
    });
    act(() => {
      result.current.setMode('auto');
    });
    expect(result.current.mode).toBe('auto');
    expect(result.current.resolvedMode).toBe('light');
  });

  test('setMode persiste le choix dans localStorage', () => {
    const { result } = renderHook(() => useThemeMode());
    act(() => {
      result.current.setMode('dark');
    });
    expect(localStorage.getItem(STORAGE_KEY)).toBe('dark');
  });

  test('setMode("auto") persiste "auto" dans localStorage', () => {
    const { result } = renderHook(() => useThemeMode());
    act(() => {
      result.current.setMode('dark');
    });
    act(() => {
      result.current.setMode('auto');
    });
    expect(localStorage.getItem(STORAGE_KEY)).toBe('auto');
  });

  test('initialisation depuis localStorage : lit la valeur sauvegardée "dark"', () => {
    localStorage.setItem(STORAGE_KEY, 'dark');
    const { result } = renderHook(() => useThemeMode());
    expect(result.current.mode).toBe('dark');
    expect(result.current.resolvedMode).toBe('dark');
  });

  test('initialisation depuis localStorage : lit la valeur sauvegardée "light"', () => {
    localStorage.setItem(STORAGE_KEY, 'light');
    const { result } = renderHook(() => useThemeMode());
    expect(result.current.mode).toBe('light');
    expect(result.current.resolvedMode).toBe('light');
  });

  test('valeur localStorage invalide → fallback sur "auto"', () => {
    localStorage.setItem(STORAGE_KEY, 'invalid_value');
    const { result } = renderHook(() => useThemeMode());
    expect(result.current.mode).toBe('auto');
  });
});
