import type { Meta, StoryObj } from '@storybook/react-vite';

import { ChartComparison } from './ChartComparison';

const meta = {
  title: 'Dataviz/Comparison',
  component: ChartComparison,
} satisfies Meta<typeof ChartComparison>;

export default meta;

type Story = StoryObj<typeof meta>;

const demoDataset = [
  { cat: 'Alimentation', value: 3200 },
  { cat: 'Transport', value: 1800 },
  { cat: 'Logement', value: 2500 },
  { cat: 'Éducation', value: 1200 },
  { cat: 'Loisirs', value: 1600 },
  { cat: 'Voyages', value: 1400 },
];
export const Default: Story = {
  args: {
    chartType: "bar",
    valueKey: "value",
    nameKey: "cat",
    dataset: demoDataset,
    label: "percent",
    singleColor: false,
    unit: "kg",
  },
  argTypes: {
    valueKey: {
      table: { readonly: true },
    },
    nameKey: {
      table: { readonly: true },
    },
    title: {
      table: { disable: true }
    },
    chartType:{
       control: 'select'
    },
    label:{
       control: 'select'
    }
  },
};

export const Donut: Story = {
  args: {
    chartType: "donut",
    valueKey: "value",
    nameKey: "cat",
    dataset: demoDataset,
  },
  argTypes: {
    valueKey: {
      table: { readonly: true },
    },
    nameKey: {
      table: { readonly: true },
    },
    title: {
      table: { disable: true }
    },
    chartType:{
       control: 'select'
    },
    label:{
       control: 'select'
    }
  },
};