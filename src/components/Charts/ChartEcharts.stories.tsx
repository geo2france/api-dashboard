import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChartEcharts } from './ChartEcharts';
import { EChartsOption } from "echarts";
import { useDataset } from "../Dataset/hooks";

const meta = {
  component: ChartEcharts,
  title: 'Charts/ChartEcharts Demo',
} satisfies Meta<typeof ChartEcharts>;

export default meta;

type Story = StoryObj<typeof meta>;



/** Utilisation dans un composant (custom chart) */
export const Demo: Story = {
  args: {
    option:{}
  },
  render: () => {
    const dataset = useDataset('demo_dataset')
    const data = dataset?.data

    const option: EChartsOption = {
      title: { text: 'Diamètre des planètes (km)' },
      tooltip: {},
      yAxis: { type: 'category' },
      xAxis: { type: 'value'},
      series: [
        {
          type: 'bar',
          data: data?.sort((a,b) => a.diameter_km - b.diameter_km).map( r => [r.name, r.diameter_km]),
          encode: {
            x:1,
            y:0
          }
        },
      ],
    }

    return <ChartEcharts option={option} />;
  }
};


/**
 * Utilisation directe de ChartEcharts
 */
export const DirectUsage: Story = {
  args:{
    option: {
      title: { text: 'Exemple direct ChartEcharts' },
      tooltip: {},
      color: ['red','green', 'blue', 'orange'],
      xAxis:{show:false}, yAxis:{show:false},
      series: [
        {
          type: 'pie',
          data: [
            {name:'A', value:4880},
            {name:'B', value: 12104},
            {name:'C', value:12742},
            {name:'D', value: 6779},
          ]        },
      ]
      }
  },
  argTypes: {
    option: { control: 'object' },
  },
  render: (args) => {
    const option: EChartsOption = args.option
    return <ChartEcharts option={option} />;
  },
  parameters: {
    docs: { source: { type: 'code' } },
  },
};