import { theme as antTheme } from 'antd';
import type { ThemeConfig } from 'antd';
import { baseTokens } from '../tokens/base';
import { geo2francePalette } from '../tokens/palettes/geo2france';

export const geo2franceDarkTheme: ThemeConfig = {
  ...baseTokens,
  algorithm: antTheme.darkAlgorithm,
  token: {
    ...baseTokens.token,
    ...geo2francePalette,
  },
  components: {
    ...baseTokens.components,
    Form: {
      labelColor: 'rgba(255,255,255,0.7)',
    },
  },
};
