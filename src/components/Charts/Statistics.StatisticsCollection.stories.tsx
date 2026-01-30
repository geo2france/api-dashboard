import type { Meta, StoryObj } from '@storybook/react-vite';

import { StatisticsCollection } from './Statistics';

const meta = {
  component: StatisticsCollection,
} satisfies Meta<typeof StatisticsCollection>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};