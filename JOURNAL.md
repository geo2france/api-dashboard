# Journal de développement — api-dashboard-redesign

Projet : refonte du système de thème de `@geo2france/api-dashboard`  
Fork : `lucilecollignon/api-dashboard-redesign`  
Upstream : `geo2france/api-dashboard`  
Objectif final : améliorer le fork `lucilecollignon/api-dashboard-redesign` (pas de PR upstream ni de publication npm)

---

## Phase 0 — Préparation de l'environnement
**Branche :** `main`  
**Commit :** `c134292`  
**Date :** 29 avril 2026

- Initialisation du remote `upstream` pointant vers `geo2france/api-dashboard`
- Ajout d'un script `tsc` dans `package.json` pour vérifier le build TypeScript
- Investigation `zeroRuntime` (antd v6) → **décision : non activé**, CSS-in-JS dynamique conservé  
  (la mention `@default true` dans les types est trompeuse ; `defaultConfig` ne contient pas `zeroRuntime` à l'exécution)

---

## Phase 1 + 1b — Architecture du système de thème dual + dark mode
**Branche :** `feat/theme-system-foundation`  
**Commit :** `b2f2576`  
**Date :** 29 avril 2026  
**Fichiers créés :** 16 (+464 lignes)

### Nouvelle arborescence `src/theme/`

```
src/theme/
  tokens/
    base.ts                    — tokens partagés (radius, typo) SANS couleurs (règle antd v6 #53719)
    palettes/
      geo2france.ts            — #95c11f, #0f4496, #0D2449
      neutral.ts               — #1677ff (palette Ant Design par défaut)
  themes/
    geo2france.light.ts        — defaultAlgorithm + palette G2F
    geo2france.dark.ts         — darkAlgorithm + palette G2F + Form.labelColor adapté
    neutral.light.ts           — defaultAlgorithm + palette neutral
    neutral.dark.ts            — darkAlgorithm + palette neutral
  hooks/
    usePreferredColorScheme.ts — détection live prefers-color-scheme
    useThemeMode.ts            — état mode (localStorage, cycle auto/light/dark)
  utils/deepMerge.ts           — merge profond pour ThemeConfig (compat layer)
  ThemeProvider.tsx            — wrapper ConfigProvider avec résolution preset + compat deprecated
  ThemeToggle.tsx              — bouton cycle auto → light → dark (icônes Ant Design)
  context.ts                   — ThemeContext (themeName, mode, resolvedMode, setMode)
  index.ts                     — barrel export
```

### Points clés

- **Règle antd v6 critique** : `baseTokens` ne contient aucune couleur ; sinon `darkAlgorithm` est cassé ([issue #53719](https://github.com/ant-design/ant-design/issues/53719))
- **Rétrocompatibilité** : passer un `ThemeConfig` brut au lieu d'un preset déclenche un `console.warn` de dépréciation + deep merge avec `geo2franceLightTheme`
- **`DashboardApp`** : le `ConfigProvider` inline est remplacé par `<ThemeProvider>`, `default_theme` conservé comme alias `@deprecated`
- **Deep import corrigé** : `antd/es/layout/layout` → `import { Layout } from 'antd'`

---

## Phase 2 — Remplacement des styles hardcodés par des tokens Ant Design
**Branche :** `fix/replace-hardcoded-styles`  
**Commit :** `3a78fde`  
**Date :** 29 avril 2026  
**Fichiers modifiés :** 16

| Fichier | Correction |
|---------|-----------|
| `Layout/Sider.tsx` | `#ccc` → `colorBorderSecondary` ; cleanup resize listener ajouté |
| `Layout/Footer.tsx` | `#fff`/`#ccc`/gradients rgba → `colorBgContainer`/`colorBorder`/transparent |
| `Control/Control.tsx` | `#fff`/`#ccc` → `colorBgContainer`/`colorBorder` |
| `DashboardPage/Page.tsx` | `#fff` sticky header → `colorBgContainer` |
| `Charts/Pie.tsx` | `#000`/`#333` labels ECharts → `colorTextBase`/`colorText` |
| `Charts/ChartComparison.tsx` | `#d4d4d4` fallback → `colorBorderSecondary` |
| `Map/Map.tsx` | `line-color: #fff` → `colorBgContainer` |
| `MapLegend/MapLegend.tsx` | **BUG** `rgba(256,256,256,0.8)` (valeur RGB invalide) → `colorBgElevated` + tokens border/padding |
| `utils/cardStyles.tsx` | Nouveau hook `useCardStyles()` dérivé des tokens ; `cardStyles` conservé `@deprecated` |
| `utils/usechartexports.ts` | Background export `#fff` → `token.colorBgContainer` |
| `Dataset/DataPreview.tsx` | Deep import `antd/es/table` → import public `antd` |

---

## Phase 3 — Toolbar Storybook dual-axe (thème × mode)
**Branche :** `feat/storybook-theme-switcher`  
**Commit :** `fd67857`  
**Date :** 29 avril 2026  
**Fichiers modifiés :** `.storybook/preview.ts` → `.storybook/preview.tsx` (renommé + réécrit)

- `globalTypes` : toolbar **Thème** (`geo2france` / `neutral`) + toolbar **Mode** (`light ☀️` / `dark 🌙`)
- Decorator global `withTheme` : enveloppe chaque story dans le `ConfigProvider` du preset actif
- Fond de canvas adapté au mode via `document.body.style.background` (noir en dark, blanc en light)
- `manager.ts` : branding Géo2France conservé intact (logo, couleurs vertes)

---

## Phase 4 — Corrections UI/UX : cohérence visuelle z-index
**Branche :** `fix/uiux-zindex-visual-consistency`  
**Commit :** `d57cbd7`  
**Date :** 29 avril 2026  
**Fichiers modifiés :** 5 (+44 lignes)

### Nouveau fichier `src/utils/zIndex.ts`

Échelle documentée de z-index pour l'ensemble du dashboard :

| Constante | Valeur | Usage |
|-----------|--------|-------|
| `Z_INDEX.SIDER` | 10 | Sidebar sticky (au-dessus du contenu, sous les contrôles) |
| `Z_INDEX.MAP_GESTURE` | 500 | Gestionnaire de gestes MapLibre GL (référence) |
| `Z_INDEX.CONTROL` | 600 | Barre de contrôle sticky (au-dessus de la carte) |
| `Z_INDEX.FOOTER` | 600 | Footer sticky (au-dessus de la carte) |
| `Z_INDEX.FOOTER_BUTTON` | 1001 | Bouton expand/collapse du footer |
| `Z_INDEX.MODAL` | 1100 | Modaux Ant Design (référence) |

### Remplacements

- `Sider.tsx` : `zIndex: 2` → `Z_INDEX.SIDER`
- `Footer.tsx` : `zIndex: 600` → `Z_INDEX.FOOTER`, `zIndex: 1001` → `Z_INDEX.FOOTER_BUTTON`
- `Control.tsx` : `zIndex: 600` → `Z_INDEX.CONTROL`
- `Page.tsx` : `zIndex: 600` → `Z_INDEX.CONTROL`
- `Footer.tsx` : gradient `rgba(0,0,0,0.1)` → `token.colorFill` (adaptatif dark mode)

### Bugs pré-existants (status)

| Bug | Status |
|-----|--------|
| `MapLegend.tsx` : `rgba(256,256,256,0.8)` invalide | ✅ Corrigé en phase 2 |
| `Sider.tsx` : fuite mémoire listener `resize` sans cleanup | ✅ Corrigé en phase 2 |
| `DashboardApp.tsx` : import CSS commenté (`//TODO`) | ✅ Disparu après refacto phase 1 |

---

## Phase 5 — Tests unitaires, snapshots, Chromatic CI, a11y
**Branche :** `test/theme-system-coverage`  
**Commit :** `72c2670`  
**Date :** 29 avril 2026  
**Fichiers créés/modifiés :** 10 (+280 lignes)

### Tests unitaires `ThemeProvider` (31 tests)

Couverture complète de `src/theme/__tests__/ThemeProvider.test.tsx` :

- Résolution du preset par nom (`'geo2france'` → `geo2franceLightTheme`, `'neutral'` → `neutralLightTheme`)
- Résolution du mode (`'auto'` → suit `prefers-color-scheme`, `'light'` / `'dark'` forcés)
- Couche de rétrocompatibilité : passer un `ThemeConfig` brut déclenche `console.warn` + merge avec G2F
- Persistance `localStorage` (clé `dashboard-theme-mode`)

### Snapshots

- `KeyFigure` en `geo2france-light` et `neutral-dark` (3 snapshots)
- `FlipCard` en `geo2france-light` et `neutral-dark` (2 snapshots)

### Chromatic CI

Nouveau workflow `.github/workflows/chromatic.yml` :
- Déclenché sur toutes les PR et pushs `main`
- Upload Storybook → diff visuel automatique dans les reviews GitHub

### a11y en mode `error` (CI bloquant)

Modifications de `.storybook/preview.tsx` :
- `a11y: { test: 'error' }` activé globalement — violations d'accessibilité bloquent la CI
- **Exceptions documentées** :
  - Règle `color-contrast` désactivée globalement : couleur primaire `#95c11f` de G2F échoue le rapport 4.5:1 (FIXME tracké : `fix/a11y-geo2france-contrast`)
  - Stories ECharts exemptées en `'todo'` : canvas HTML non accessible par nature (FIXME tracké : `fix/a11y-echarts`)
  - Stories `Statistics` exemptées en `'todo'` : indicateurs de tendance colorés à corriger

### Polyfill Jest

`jest.setup.js` : ajout de `TextEncoder` / `TextDecoder` pour compatibilité react-router-dom v7.

---

## Phase 6 — Documentation Storybook (Theming + Dark Mode)
**Branche :** `docs/theming-guide`  
**Commit :** `edb094d`  
**Date :** 29 avril 2026  
**Fichiers créés/modifiés :** 4 (+363 lignes, -3 lignes)

### `stories-docs/Introduction.mdx` (mis à jour)

Section "Personnalisation" entièrement rédigée :
- Table des propriétés `theme` / `themeMode` dans `config.ts`
- Description des presets et modes
- Liens vers `Theming.mdx` et `DarkMode.mdx`

### `stories-docs/Theming.mdx` (nouveau)

- Présentation des presets `geo2france` et `neutral` (palettes, valeurs)
- Tokens de base partagés (`borderRadius`, `fontFamily`, etc.)
- Override partiel : couleurs, typographie, espacements/rayons via `ThemeConfig`
- Intégration logo/branding custom
- Table complète des tokens Ant Design consommés par la bibliothèque
- Rappel règle critique antd v6 (pas de couleurs dans `baseTokens`)

### `stories-docs/DarkMode.mdx` (nouveau)

- Activation via `config.ts` ou `<ThemeProvider>` directement
- Comportement détaillé du mode `auto` (détection OS + override `localStorage`)
- Intégration du `<ThemeToggle>` dans la sidebar
- Hooks : `useThemeContext`, `usePreferredColorScheme`
- Bonnes pratiques : tokens vs hex hardcodés, images adaptatives (SVG/filtre CSS/variantes), graphiques ECharts, cartes MapLibre

### Fix bonus

Suppression de l'import `React` inutilisé dans `ThemeProvider.test.tsx` (erreur `TS6133` pré-existante).

---

## Phase 6b — Masquage automatique du switcher de mode
**Branche :** `main`
**Commit :** _(non commité)_
**Date :** 1er juin 2026
**Fichiers modifiés :** 4 (theme + layout), 1 fichier de test

### Besoin

Quand l'intégrateur force un mode via `themeMode="light"` / `"dark"`, le bouton
`<ThemeToggle>` restait **visible** dans la sidebar : l'utilisateur final pouvait
re-changer le mode, contredisant l'intention de l'intégrateur. Objectif : pouvoir
désactiver complètement le switcher.

### Décision

**Masquage automatique** (pas de nouvelle prop) : forcer un mode (`≠ 'auto'`) cache
le bouton. `themeMode="auto"` (défaut) l'affiche. Compromis assumé : le cas « défaut
forcé mais switchable » n'est pas couvert (option `showThemeToggle`/`hideThemeToggle`
écartée pour garder l'API minimale).

### Changements

| Fichier | Modification |
|---------|-------------|
| `theme/context.ts` | Ajout de `isModeLocked: boolean` à `ThemeContextValue` (+ défaut `false`) |
| `theme/ThemeProvider.tsx` | `isModeLocked = modeProp !== 'auto'` ; le mode forcé devient **autoritaire** (ignore `localStorage`) et est exposé dans le contexte |
| `components/Layout/Sider.tsx` | Rendu conditionnel : `{ !isModeLocked && <ThemeToggle /> }` |
| `components/Layout/DashboardApp.tsx` | JSDoc de `themeMode` : précise le masquage auto |

### Point critique

Le mode forcé est désormais **prioritaire sur `localStorage`**. Sans ça, un visiteur
de retour avec un mode `dark` mémorisé serait resté bloqué en sombre malgré
`themeMode="light"`, le bouton caché l'empêchant de corriger. L'ancienne logique de
blending (`modeProp !== 'auto' && mode === 'auto' ? modeProp : mode`) est remplacée
par `isModeLocked ? modeProp : mode`.

### Tests

`ThemeProvider.test.tsx` : +6 tests (valeur de `isModeLocked` selon `mode`, mode forcé
autoritaire face à un `localStorage` contradictoire, respect du choix `localStorage` en
`auto`). Suite thème : **59/59 ✅**, `tsc --noEmit` OK. Pas de test de rendu Sider ajouté
(condition triviale, déjà couverte par `isModeLocked` ; à valider visuellement en Storybook).

---

## Phase 7 — Nettoyage des béquilles de rétrocompatibilité (feuille blanche)
**Branche :** `chore/remove-backward-compat-shims`
**Commits :** `83e28a5`, `88323ac`, `603a177`, `a6f84fa`
**Date :** 25 juin 2026

### Contexte

Le client confirme que `@geo2france/api-dashboard` est très peu déployé et que l'objectif
se limite désormais à **améliorer le fork** (plus de PR upstream ni de publication npm). Les
4 couches de rétrocompatibilité ajoutées par prudence n'ont donc plus de consommateur à
ménager : devenues du code mort, elles sont supprimées.

### Changements

| Béquille supprimée | Fichier | Remplacement |
|--------------------|---------|--------------|
| Chemin `theme={ThemeConfig}` brut + `console.warn` + garde-fou de mutuelle-exclusion | `theme/ThemeProvider.tsx` | `theme: ThemeName` + `visualIdentity` |
| Alias exporté `default_theme` | `components/Layout/DashboardApp.tsx` | `theme="geo2france"` |
| Constante figée `cardStyles` | `utils/cardStyles.tsx` + `index.ts` | hook `useCardStyles()` |
| Tests des cas legacy | `theme/__tests__/ThemeProvider.test.tsx`, `…visualIdentity.test.tsx` | test de robustesse + test de priorité visualIdentity |

### Décision de comportement assumée

Passer à la fois `visualIdentity` et `theme` ne déclenche plus d'avertissement : `visualIdentity`
gagne silencieusement (impossible de distinguer un `theme` explicite du défaut `'geo2france'`,
et la priorité est déjà documentée).

### Vérification

`tsc --noEmit` OK ; suite thème **67/67 ✅**, 5 snapshots inchangés.

---

## État des phases

| Phase | Statut | Commit | Branche |
|-------|--------|--------|---------|
| 0 — Setup git + investigation zeroRuntime | ✅ terminée | `c134292` | `main` |
| 1+1b — Architecture thème + ThemeToggle | ✅ terminée | `b2f2576` | `feat/theme-system-foundation` |
| 2 — Remplacement styles hardcodés | ✅ terminée | `3a78fde` | `fix/replace-hardcoded-styles` |
| 3 — Toolbar Storybook dual-axe | ✅ terminée | `fd67857` | `feat/storybook-theme-switcher` |
| 4 — Corrections UI/UX | ✅ terminée | `d57cbd7` | `fix/uiux-zindex-visual-consistency` |
| 5 — Tests (unit + snapshot + Chromatic + a11y) | ✅ terminée | `72c2670` | `test/theme-system-coverage` |
| 6 — Documentation (Theming.mdx + DarkMode.mdx) | ✅ terminée | `edb094d` | `docs/theming-guide` |
| 7 — Nettoyage des béquilles de rétrocompat | ✅ terminée | `a6f84fa` | `chore/remove-backward-compat-shims` |

---

## Décisions techniques clés

- **Thème par défaut** : `geo2france` (rétrocompat Odema/Clicnat)
- **`zeroRuntime`** : non activé — comportement CSS-in-JS dynamique préservé
- **Composant `<App>` antd** : non ajouté (pas de static methods dans le code actuel)
- **`locale` ConfigProvider** : non configuré (les consommateurs gèrent leur propre locale)
- **`baseTokens` sans couleurs** : règle critique antd v6 pour que `darkAlgorithm` fonctionne
- **Exports** : le travail s'arrête à l'amélioration du fork `lucilecollignon/api-dashboard-redesign` (ni PR upstream, ni publication npm)
