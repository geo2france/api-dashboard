import type { Meta, StoryObj } from '@storybook/react-vite';

import { Select } from './Select';
import { MemoryRouter } from 'react-router-dom';
import { Control } from '../../dsl';
import { ControlContext, CreateControlesRegistry } from './Control';

const meta = {
  component: Select,
  title: 'Controle/Select',
  argTypes:{
    showSearch: {control:{type:"boolean"}, description:'Activer la liste filtrable' },
    dataset:{control:{disable:true}},
    initial_value:{control:{disable:true}},
    labelField:{control:{disable:true}},
    valueField:{control:{disable:true}},
  },
  decorators: [
    (Story) => {
      return (
        <ControlContext.Provider value={CreateControlesRegistry()}>  
          <MemoryRouter>
            <Control>
              <Story />
            </Control>
          </MemoryRouter>
        </ControlContext.Provider >
      );
    },
  ],
} satisfies Meta<typeof Select>;

export default meta;

type Story = StoryObj<typeof meta>;

const DEMO_OPTIONS = [
  { label: "Déchets ménagers", value: "menagers" },
  { label: "Déchets recyclables", value: "recyclables" },
  { label: "Déchets organiques", value: "organiques" },
  { label: "Déchets dangereux", value: "dangereux" },
  { label: "Déchets inertes", value: "inertes" },
];

export const Default: Story = {
  args:{
    options: DEMO_OPTIONS,
    label: 'Mon select',
    name:'myselect',
    showSearch: true,
    arrows: false,
    reverse: false
  }
};

export const YearSelection: Story = {
  name: "Selection d'une année",
  parameters:{
    controls: {
      include: ['arrows', 'reverse'],
    }
  },
  args:{
    options: [...Array(2024 - 2018 + 1)].map((_, i) => 2018 + i).reverse(),
    arrows: true,
    reverse: true,
    label: 'Année',
    name:'myselect',
  },
};

export const Filter: Story = {
  name: "Listre filtrable",
  parameters:{
    controls: {
      include: ['showSearch'],
    }
  },
  args:{
    options: DEMO_OPTIONS,
    label: 'Type',
    name:'myselect',
    showSearch:true
  }
};