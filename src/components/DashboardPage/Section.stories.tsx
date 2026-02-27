import type { Meta, StoryObj } from '@storybook/react-vite';

import { Section } from './Section';

const meta = {
  title: 'Layout/Section',
  component: Section
} satisfies Meta<typeof Section>;

export default meta;


type Story = StoryObj<typeof meta>;

export const Default: Story = {
       args:{
        title:'Section 1'
       },
       argTypes:{
          icon: {
            table:{
              type: {summary : 'string | ReactNode'}
            }
        },
      },
       render: () => <></>, //Disable render
}