import type { Meta, StoryObj } from '@storybook/react-vite';
import { Statistics, StatisticsCollection } from './Statistics';

const meta = {
  component: Statistics,
} satisfies Meta<typeof Statistics>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
      dataset:[{'a':25},{'a':55}],
      dataKey: 'a',
      color:'#8bc832',
      aggregate: "lastNotNull",
      title: "Ma métrique",
      icon:'ic:outline-wifi' ,
      animation: false,
      unit: 't',
      annotation: 'Description',
      help: "Note méthodologique sur le calcul de l'indicateur",
    },
    argTypes: {
      compareWith: {
        table: {
          disable: true,
        },
      },
      invertColor: {
        table: {
          disable: true,
        },
      },
      evolutionSuffix: {
        table: {
          disable: true,
        },
      },
      relativeEvolution: {
        table: {
          disable: true,
        },
      },
      valueFormatter: {
          type: 'function',
      }
    },
    render: (args) => {
      return (
        <StatisticsCollection>
          <Statistics 
            {...args}
            />
          <Statistics 
            {...args}
            />
          </StatisticsCollection>
      )
    }
};