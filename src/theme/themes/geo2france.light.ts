import { theme as antTheme } from 'antd';
import type { ThemeConfig } from 'antd';
import { baseTokens } from '../tokens/base';
import { geo2francePalette } from '../tokens/palettes/geo2france';

export const geo2franceLightTheme: ThemeConfig = {
  ...baseTokens,
  algorithm: antTheme.defaultAlgorithm,
  token: {
    ...baseTokens.token,
    ...geo2francePalette,
  },
  components: {
    ...baseTokens.components,
    Form: {
      labelColor: 'rgba(0,0,0,0.7)',
    },
  },
};
