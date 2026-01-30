import type { Meta, StoryObj } from '@storybook/react-vite';

import { ChartYearSerie } from './YearSerie';

const meta = {
  component: ChartYearSerie,
} satisfies Meta<typeof ChartYearSerie>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};