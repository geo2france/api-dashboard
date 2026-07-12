import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import React, { useEffect } from 'react';
import type { Preview, Decorator } from '@storybook/react-vite';
import { ConfigProvider } from 'antd';
import { customTheme } from './manager';
import {
  geo2franceLightTheme,
  geo2franceDarkTheme,
  neutralLightTheme,
  neutralDarkTheme,
} from '../src/theme';
import type { ThemeName } from '../src/theme';

type ThemeMode = 'light' | 'dark';
type ThemeKey = `${ThemeName}-${ThemeMode}`;

const THEMES: Record<ThemeKey, object> = {
  'geo2france-light': geo2franceLightTheme,
  'geo2france-dark':  geo2franceDarkTheme,
  'neutral-light':    neutralLightTheme,
  'neutral-dark':     neutralDarkTheme,
};

const BG: Record<ThemeMode, string> = {
  light: '#ffffff',
  dark:  '#141414',
};

/**
 * Decorator global : enveloppe chaque story dans un ConfigProvider Ant Design
 * correspondant au couple (theme × mode) sélectionné dans la toolbar Storybook.
 *
 * Note : les stories qui contiennent leur propre <DashboardApp> (qui expose son
 * propre <ThemeProvider>) ignoreront ce decorator pour la partie layout — c'est
 * le comportement attendu (ConfigProvider nested with inherit:true).
 */
const withTheme: Decorator = (Story, context) => {
  const themeName = (context.globals.themeName as ThemeName) ?? 'geo2france';
  const themeMode = (context.globals.themeMode as ThemeMode) ?? 'light';
  const key: ThemeKey = `${themeName}-${themeMode}`;
  const antdTheme = THEMES[key] ?? THEMES['geo2france-light'];
  const bg = BG[themeMode];

  useEffect(() => {
    document.body.style.backgroundColor = bg;
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, [bg]);

  return (
    <div style={{ backgroundColor: bg, minHeight: '100vh' }}>
      <ConfigProvider theme={antdTheme}>
        <Story />
      </ConfigProvider>
    </div>
  );
};

const preview: Preview = {
  tags: ['autodocs'],

  globalTypes: {
    themeName: {
      name: 'Thème',
      defaultValue: 'geo2france',
      toolbar: {
        icon: 'paintbrush',
        items: [
          { value: 'geo2france', title: 'Géo2France' },
          { value: 'neutral',    title: 'Neutral'    },
        ],
        dynamicTitle: true,
      },
    },
    themeMode: {
      name: 'Mode',
      defaultValue: 'light',
      toolbar: {
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Light', right: '☀️' },
          { value: 'dark',  title: 'Dark',  right: '🌙' },
        ],
        dynamicTitle: true,
      },
    },
  },

  decorators: [withTheme],

  parameters: {
    codePanel: true,
    docs: {
      theme: customTheme,
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: {
        order: [
          'Documentation', ['Introduction'],
          'Layout', ['DashboardApp'],
          'Dataset',
          'Dataviz',
          'Controle',
        ],
      },
    },
    a11y: {
      // Mode bloquant : les violations d'accessibilité font échouer les tests vitest/CI.
      // Les stories avec des problèmes techniques connus (canvas ECharts) portent
      // leur propre surcharge `parameters.a11y.test = 'todo'` avec un commentaire FIXME.
      test: 'error',
      config: {
        rules: [
          // FIXME(a11y): La couleur primaire Géo2France (#95c11f) a un ratio de
          // contraste ≈ 2.9:1, en-dessous du seuil WCAG AA (4.5:1 texte normal,
          // 3:1 grand texte). C'est un choix de charte graphique délibéré.
          // À traiter dans un ticket dédié : fix/a11y-geo2france-contrast.
          { id: 'color-contrast', enabled: false },
        ],
      },
    },
  },
};

export default preview;
