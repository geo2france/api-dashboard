import type { Meta, StoryObj } from '@storybook/react-vite';

import { Statistics } from './Statistics';

const meta = {
  component: Statistics,
} satisfies Meta<typeof Statistics>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
      dataset:'demo',
      dataKey: 'col'
    }
};