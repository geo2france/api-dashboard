import type { Meta, StoryObj } from '@storybook/react-vite';
import { Dataset, Transform as G2F_Transform, DataTable } from '../../dsl';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DatasetRegistryContext } from './context';
import { createDatasetRegistry, useDataset } from './hooks';
import { SimpleRecord } from '../..';


const meta = {
  title: 'Dashboard/Dataset',
  component: Dataset,
  decorators: [
        (Story, { args }) => {
            const key = JSON.stringify(args);
            const queryClient = new QueryClient();
            return (
            <QueryClientProvider client={queryClient} key={key}>
                <DatasetRegistryContext.Provider value={ createDatasetRegistry() } >
                    <Story />
                    <DatasetTable dataset={args.id} />
                </DatasetRegistryContext.Provider>
            </QueryClientProvider>
            )
        },
    ],
} satisfies Meta<typeof Dataset>;

export default meta;

type Story = StoryObj<typeof meta>;


const DatasetTable = ({dataset:dataset_id}:{ dataset: string }) => {
    const dataset = useDataset(dataset_id)

    // Pour la story, filtrer les colonnes avec "_"
    const data: SimpleRecord[] = (dataset?.data ?? []).map(obj =>
        Object.fromEntries(
            Object.entries(obj).filter(([key]) => !key.startsWith('_'))
        )
    );

    return (
        <DataTable  dataset={data.map( row => ({  ...row, valeur_en_nombre:Number(row.valeur_en_nombre) } )) }/> 
        // Pour la storie, on formatte les nombres (en string dans le JDD de la poste.. )
    )
}

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: `
ℹ️ Ce composant n'a pas de rendu graphique direct. Les données doivent
être utilisées dans des composants graphiques (carto, dataviz, tableau, etc.)
Un tableau permet ici de visualiser le contenu brut.
        `,
      },
    },
  },

    args:{
        type: 'datafair',
        id: 'mon_dataset',
        resource: 'rapport-integre-2024/lines',
        url:'https://datanova.laposte.fr/data-fair/api/v1/datasets'
    },
    argTypes:{
        type:{ control:{type:'inline-radio'}},
        children:{ table:{disable:true}},
        pageSize:{ table:{disable:true}},
        filters:{ table:{disable:true} },
        id:{ table: { readonly: true }},
    }
}


export const TransformSQL: Story = {
    name:"Transformer (SQL)",
    args:{
        type: 'datafair',
        id: 'mon_dataset',
        resource: 'rapport-integre-2024/lines',
        url:'https://datanova.laposte.fr/data-fair/api/v1/datasets',
        // @ts-expect-error: 'sql' n'existe pas dans DatasetProps
        sql: 'SELECT * FROM ? LIMIT 2',
    },
    argTypes:{
        type:{ control:{type:'inline-radio'}},
        children:{ table:{disable:true}},
        pageSize:{ table:{disable:true}},
        filters:{ table:{disable:true} },
        id:{ table: { readonly: true }},
    },
    render:(args) => (
        <Dataset 
            id={args.id} type={args.type} resource={args.resource} url={args.url} >
            <G2F_Transform>
                {// @ts-expect-error: 'sql' n'existe pas dans DatasetProps 
                args.sql}
            </G2F_Transform>
        </Dataset>
    )
}