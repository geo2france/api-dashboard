import type { Meta, StoryObj } from '@storybook/react-vite';

import { ChartPie } from './Pie';

const meta = {
  component: ChartPie,
} satisfies Meta<typeof ChartPie>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    "dataKey": "dataKey",
    "nameKey": "nameKey"
  },
};