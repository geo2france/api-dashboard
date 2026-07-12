import { theme as antTheme } from 'antd';
import type { ThemeConfig } from 'antd';
import { baseTokens } from '../tokens/base';
import { neutralPalette } from '../tokens/palettes/neutral';

export const neutralDarkTheme: ThemeConfig = {
  ...baseTokens,
  algorithm: antTheme.darkAlgorithm,
  token: {
    ...baseTokens.token,
    ...neutralPalette,
  },
  components: {
    ...baseTokens.components,
    Form: {
      labelColor: 'rgba(255,255,255,0.7)',
    },
  },
};
