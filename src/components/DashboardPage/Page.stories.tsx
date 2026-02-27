import type { Meta, StoryObj } from '@storybook/react-vite';

import { DSL_DashboardPage } from './Page';
import DashboardApp, { AppContext } from '../Layout/DashboardApp';
import { HelmetProvider } from 'react-helmet-async';
import { ControlContext, CreateControlesRegistry } from '../Control/Control';
import { MemoryRouter } from 'react-router-dom';

const meta = {
  title: 'Layout/Dashboard',
  component: DSL_DashboardPage,
    decorators: [
    (Story) => {
      return (
        <ControlContext.Provider value={CreateControlesRegistry()}>
          <MemoryRouter>
            <HelmetProvider>
              <Story />
            </HelmetProvider>
          </MemoryRouter>
        </ControlContext.Provider>
      );
    },
    ]
} satisfies Meta<typeof DSL_DashboardPage>;

export default meta;


type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    debug:false
  }
       //render: () => <></>, //Disable render
}