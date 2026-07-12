import type { Meta, StoryObj } from '@storybook/react-vite';
import { Statistics, StatisticsCollection } from './Statistics';

const meta = {
  title: 'Dataviz/Statistics',
  component: Statistics,
  parameters: {
    // FIXME(a11y): le composant Statistics utilise des couleurs dynamiques
    // (rouge/vert) pour indiquer les tendances — le ratio de contraste avec le
    // fond dépend de la valeur affichée et n'est pas garanti WCAG AA.
    // Ticket séparé : fix/a11y-statistics-contrast.
    a11y: { test: 'todo' },
  },
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