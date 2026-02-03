import type { Meta, StoryObj } from '@storybook/react-vite';

import { Statistics, StatisticsCollection } from './Statistics';

const meta = {
  title: 'Dataviz/StatisticsCollection',
  component: StatisticsCollection,
} satisfies Meta<typeof StatisticsCollection>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args:{
    children:[<Statistics dataset={[{a:10}]} dataKey='a' color='#ff6700' icon="gis:home" title="Métrique A"/>, 
              <Statistics dataset={[{a:10}]} dataKey='a' color='#13943a' icon="gis:home" unit="km" title="Métrique B"/>,
              <Statistics dataset={[{a:10}]} dataKey='a' color='#c0c0c0' title="Métrique C"/>,
              <Statistics dataset={[{a:1500}]} dataKey='a' color='#3a6ea5' unit='kg' icon="lucide-lab:elephant" title="Métrique D"/>
            ],
    title: "Ma collection"
  }
};