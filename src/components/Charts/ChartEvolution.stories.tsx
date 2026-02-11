import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChartEvolution } from './ChartEvolution';


const meta = {
  title: 'Dataviz/Evolution',
  component: ChartEvolution,
} satisfies Meta<typeof ChartEvolution>;

export default meta;

type Story = StoryObj<typeof meta>;

const demoDataset = [
  {"time": "2014", "cat": "Logement", "value": 12700},
  {"time": "2014", "cat": "Tertiaire", "value": 4100},
  {"time": "2014", "cat": "Autre", "value": 1700},
  {"time": "2015", "cat": "Logement", "value": 13000},
  {"time": "2015", "cat": "Tertiaire", "value": 4200},
  {"time": "2015", "cat": "Autre", "value": 1800},
  {"time": "2016", "cat": "Logement", "value": 12800},
  {"time": "2016", "cat": "Tertiaire", "value": 4300},
  {"time": "2016", "cat": "Autre", "value": 1750},
  {"time": "2017", "cat": "Logement", "value": 13200},
  {"time": "2017", "cat": "Tertiaire", "value": 4400},
  {"time": "2017", "cat": "Autre", "value": 1850},
  {"time": "2018", "cat": "Logement", "value": 13500},
  {"time": "2018", "cat": "Tertiaire", "value": 4500},
  {"time": "2018", "cat": "Autre", "value": 1900},
  {"time": "2019", "cat": "Logement", "value": 13800},
  {"time": "2019", "cat": "Tertiaire", "value": 4600},
  {"time": "2019", "cat": "Autre", "value": 1950},
  {"time": "2020", "cat": "Logement", "value": 13000},
  {"time": "2020", "cat": "Tertiaire", "value": 4200},
  {"time": "2020", "cat": "Autre", "value": 1800},
  {"time": "2021", "cat": "Logement", "value": 13300},
  {"time": "2021", "cat": "Tertiaire", "value": 4300},
  {"time": "2021", "cat": "Autre", "value": 1850},
  {"time": "2022", "cat": "Logement", "value": 13600},
  {"time": "2022", "cat": "Tertiaire", "value": 4400},
  {"time": "2022", "cat": "Autre", "value": 1900}
]

const demoDatasetSingle = [
  { "time": "2021-01", "concentration": 42 },
  { "time": "2021-02", "concentration": 48 },
  { "time": "2021-03", "concentration": 65 },
  { "time": "2021-04", "concentration": 78 },
  { "time": "2021-05", "concentration": 92 },
  { "time": "2021-06", "concentration": 105 },
  { "time": "2021-07", "concentration": 110 },
  { "time": "2021-08", "concentration": 98 },
  { "time": "2021-09", "concentration": 76 },
  { "time": "2021-10", "concentration": 60 },
  { "time": "2021-11", "concentration": 50 },
  { "time": "2021-12", "concentration": 44 },

  { "time": "2022-01", "concentration": 38 },
  { "time": "2022-02", "concentration": 45 },
  { "time": "2022-03", "concentration": 70 },
  { "time": "2022-04", "concentration": 85 },
  { "time": "2022-05", "concentration": 100 },
  { "time": "2022-06", "concentration": 118 },
  { "time": "2022-07", "concentration": 122 },
  { "time": "2022-08", "concentration": 108 },
  { "time": "2022-09", "concentration": 82 },
  { "time": "2022-10", "concentration": 63 },
  { "time": "2022-11", "concentration": 52 },
  { "time": "2022-12", "concentration": 41 },

  { "time": "2023-01", "concentration": 40 },
  { "time": "2023-02", "concentration": 47 },
  { "time": "2023-03", "concentration": 68 },
  { "time": "2023-04", "concentration": 82 },
  { "time": "2023-05", "concentration": 95 },
  { "time": "2023-06", "concentration": 112 },
  { "time": "2023-07", "concentration": 115 },
  { "time": "2023-08", "concentration": 101 },
  { "time": "2023-09", "concentration": 79 },
  { "time": "2023-10", "concentration": 61 },
  { "time": "2023-11", "concentration": 49 },
  { "time": "2023-12", "concentration": 43 }
]


export const Default: Story = {
  args: {
    chartType: "area",
    valueKey: "value",
    nameKey: "cat",
    timeKey: "time",
    dataset: demoDataset,
    timeMarker: "2020",
    //option: {xAxis:{maxInterval:1e3*3600*24*30*13}}
  },
  argTypes: {
    valueKey: {
      table: { readonly: true },
    },
    nameKey: {
      table: { readonly: true },
    },
    timeKey: {
      table: { readonly: true },
    },
    dataset: {
      table: { readonly: true }, control:{disable:true},
    },
    title: {
      table: { disable: true }
    },
    chartType:{
       control: 'select'
    }
  },
};


export const SingleSerie: Story = {
  parameters:{
      controls: {
      include: ['chartType', 'valueKey', 'timeKey'],
    },
  },
  args: {
    chartType: "line",
    valueKey: "concentration",
    timeKey: "time",
    unit:"µg/m³",
    dataset: demoDatasetSingle,
  },
  argTypes: {
    valueKey: {
      table: { readonly: true },
    },
    timeKey: {
      table: { readonly: true },
    },
    dataset: {
      table: { readonly: true }, control:{disable:true},
    },
    title: {
      table: { disable: true }
    },
    chartType:{
       control: 'select'
    }
  },
};


export const CustomOptions: Story = {
  parameters: {
    docs: {
      description: {
        story: `Modifier directement la [configuration Echart](https://echarts.apache.org/en/option.html) du graphique pour un usage avancée.

Modifiers les axes, la _tooltip_, etc.`
        ,
      },
    },
    controls: {
      include: ['option'],
    }
  },
  args: {
    chartType: "bar",
    valueKey: "value",
    nameKey: "cat",
    timeKey: "time",
    stack: false,
    dataset: demoDataset,
    option: {
      yAxis:{inverse:true, position:'right'},
      tooltip:{trigger:"axis"}
    }
  },
  argTypes: {
    valueKey: {
      table: { readonly: true },
    },
    nameKey: {
      table: { readonly: true },
    },
    timeKey: {
      table: { readonly: true },
    },
    dataset: {
      table: { readonly: true }, control:{disable:true},
    },
    title: {
      table: { disable: true }
    },
    chartType:{
       control: 'select'
    }
  },
};

