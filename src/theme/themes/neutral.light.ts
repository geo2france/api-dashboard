import { theme as antTheme } from 'antd';
import type { ThemeConfig } from 'antd';
import { baseTokens } from '../tokens/base';
import { neutralPalette } from '../tokens/palettes/neutral';

export const neutralLightTheme: ThemeConfig = {
  ...baseTokens,
  algorithm: antTheme.defaultAlgorithm,
  token: {
    ...baseTokens.token,
    ...neutralPalette,
  },
  components: {
    ...baseTokens.components,
    Form: {
      labelColor: 'rgba(0,0,0,0.7)',
    },
  },
};
