import type { Preview } from '@storybook/react-vite'
import { customTheme } from './manager';




const preview: Preview = {
tags:['autodocs'],
  parameters: {
    codePanel: true, // ?
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
        order: ['Documentation', ['Introduction']]
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    }
  },
};



export default preview;