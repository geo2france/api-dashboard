# Changelog

## [Unreleased] — Visual Identity Theming API

### Added

- **`createVisualIdentity()`** — factory pour créer une identité visuelle personnalisée à partir de tokens simples
- **`VisualIdentityTokens`** / **`VisualIdentityShorthand`** — contrats stables pour définir une identité visuelle client
- **Prop `visualIdentity`** sur `<ThemeProvider>` et `<DashboardApp>` — accepte 3 formes :
  - `VisualIdentityThemeBundle` (pré-construit via `createVisualIdentity()`)
  - `VisualIdentityTokens` (auto-wrappé)
  - `VisualIdentityShorthand` (`{ name, primary, logo }` — démarrage rapide)
- **`useVisualIdentityLogo()`** — hook retournant le logo adapté au mode (light/dark)
- **Intégration automatique du logo** dans `DashboardSider` via `useVisualIdentityLogo()` (avec fallback sur la prop `logo` existante)
- Types exportés : `VisualIdentityColors`, `VisualIdentityTypography`, `VisualIdentityLogo`, `VisualIdentityTokens`, `VisualIdentityShorthand`, `VisualIdentityThemeBundle`

### Removed

- **`theme={ThemeConfig}`** (objet Ant Design brut sur `<ThemeProvider>` / `<DashboardApp>`) — supprimé. La prop `theme` n'accepte plus qu'un preset (`'geo2france'` | `'neutral'`). Utiliser `visualIdentity` pour toute personnalisation.
- **`default_theme`** (alias exporté vers le thème geo2france) — supprimé. Utiliser `theme="geo2france"`.
- **`cardStyles`** (constante de styles figés) — supprimée. Utiliser le hook `useCardStyles()` (dérivé des tokens du thème actif).

### Migration (3 niveaux)

```tsx
// AVANT (n'est plus supporté — la prop theme n'accepte plus de ThemeConfig brut)
<DashboardApp theme={{ token: { colorPrimary: '#FF6B35' } }} logo="/logo.svg" />

// APRÈS — Niveau 1 : forme courte (recommandé pour démarrer)
<DashboardApp visualIdentity={{ name: 'odema', primary: '#FF6B35', logo: '/logo.svg' }} />

// APRÈS — Niveau 2 : light personnalisé, dark dérivé auto
const myVisualIdentity = createVisualIdentity({
  name: 'odema',
  light: { colorPrimary: '#FF6B35', colorLink: '#0046AD' },
  logo: { src: '/logo.svg', alt: 'Odema' },
});
<DashboardApp visualIdentity={myVisualIdentity} />

// APRÈS — Niveau 3 : light + dark explicites
const myVisualIdentity = createVisualIdentity({
  name: 'odema',
  light: { colorPrimary: '#FF6B35' },
  dark:  { colorPrimary: '#FF8A5C' },
  logo: { src: '/logo.svg', alt: 'Odema', srcDark: '/logo-white.svg' },
});
<DashboardApp visualIdentity={myVisualIdentity} mode="auto" />
```
