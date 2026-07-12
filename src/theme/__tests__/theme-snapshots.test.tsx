/**
 * Tests de snapshot : vérifie que les composants principaux se rendent
 * correctement dans les thèmes geo2france-light et neutral-dark.
 *
 * Ces snapshots servent de filet de sécurité contre les régressions de rendu
 * introduites lors des modifications du système de thème.
 *
 * Note : DashboardPage / DashboardElement ne sont pas inclus ici car ils
 * transitent par `arquero` (module ESM pur) incompatible avec ts-jest sans
 * configuration Babel supplémentaire. Ils sont couverts par leurs propres
 * fichiers de test (DashboardPage.test.tsx).
 */
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import { ConfigProvider } from 'antd';

import { geo2franceLightTheme } from '../themes/geo2france.light';
import { neutralDarkTheme } from '../themes/neutral.dark';
import KeyFigure from '../../components/KeyFigure/KeyFigure';
import FlipCard from '../../components/FlipCard/FlipCard';

// ── Mock matchMedia ───────────────────────────────────────────────────────────

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
});

// ── Wrappers ─────────────────────────────────────────────────────────────────

const Geo2FranceLight: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ConfigProvider theme={geo2franceLightTheme}>{children}</ConfigProvider>
);

const NeutralDark: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ConfigProvider theme={neutralDarkTheme}>{children}</ConfigProvider>
);

// ─────────────────────────────────────────────────────────────────────────────
// KeyFigure
// ─────────────────────────────────────────────────────────────────────────────

describe('KeyFigure snapshots', () => {
  test('geo2france-light : rendu sans crash', () => {
    const { container } = render(
      <Geo2FranceLight>
        <KeyFigure name="Population" value={42000} unit="hab." />
      </Geo2FranceLight>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test('neutral-dark : rendu sans crash', () => {
    const { container } = render(
      <NeutralDark>
        <KeyFigure name="Population" value={42000} unit="hab." />
      </NeutralDark>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test('geo2france-light avec description (FlipCard) : rendu sans crash', () => {
    const { container } = render(
      <Geo2FranceLight>
        <KeyFigure
          name="Superficie"
          value={1234}
          unit="km²"
          description="Surface totale du territoire"
        />
      </Geo2FranceLight>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// FlipCard
// ─────────────────────────────────────────────────────────────────────────────

describe('FlipCard snapshots', () => {
  test('geo2france-light : rendu initial (recto visible)', () => {
    const { container } = render(
      <Geo2FranceLight>
        <FlipCard title="Titre" information="Description verso">
          <span>Contenu recto</span>
        </FlipCard>
      </Geo2FranceLight>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test('neutral-dark : rendu initial (recto visible)', () => {
    const { container } = render(
      <NeutralDark>
        <FlipCard title="Titre" information="Description verso">
          <span>Contenu recto</span>
        </FlipCard>
      </NeutralDark>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});

