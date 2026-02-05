import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';

export const customTheme = create({
  base: 'light',
  brandTitle: 'Géo2France - Api-dashboard',
  brandImage: 'https://www.geo2france.fr/public/logo-g2f.png',
  fontBase:'Inter',
  appHoverBg: '#8cc83277',
  colorSecondary: '#8bc832',
});


addons.setConfig({
  theme: customTheme,
  panelPosition: 'right',
});