import type { Meta, StoryObj } from '@storybook/react-vite';
import { Dataset } from '../../dsl';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Table } from 'antd';
import { DatasetRegistryContext } from './context';
import { createDatasetRegistry, useDataset } from './hooks';


const meta = {
  title: 'Dashboard/Dataset',
  component: Dataset,
} satisfies Meta<typeof Dataset>;

export default meta;

type Story = StoryObj<typeof meta>;


const DatasetTable = ({}) => {
    const dataset = useDataset('mon_dataset')
    const data = dataset?.data
    const cols = Object.keys(data?.[0] || {})?.filter( (k:string) => !k.startsWith("_"))?.map( (k:string) => ({
        dataIndex:k,
        title: k,
        ellipsis: true,
        key:k
    }))

    return (
        <Table columns={cols} dataSource={ Array.isArray(data) ? data?.map((r, idx) => ({...r, key:idx})) : []  } pagination={{ pageSize:5 }}/>
    )
}

export const Default: Story = {
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
    },
    decorators: [
        (Story, context) => {
            const key = JSON.stringify(context.args);
            const queryClient = new QueryClient();

            return (
            <QueryClientProvider client={queryClient} key={key}>
                <DatasetRegistryContext.Provider value={ createDatasetRegistry() } >
                    <Story />
                    <DatasetTable />
                </DatasetRegistryContext.Provider>
            </QueryClientProvider>
            )
        },
    ],
}