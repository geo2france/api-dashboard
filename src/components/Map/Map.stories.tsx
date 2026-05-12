import type { Meta, StoryObj } from '@storybook/react-vite';

import { Map } from './Map';
import { ControlContext, CreateControlesRegistry } from '../Control/Control';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Dashboard, Dataset } from '../../dsl';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DatasetRegistryContext } from '../Dataset/context';
import { createDatasetRegistry } from '../Dataset/hooks';

//@ts-ignore
import 'maplibre-gl/dist/maplibre-gl.css';


const meta = {
  title: 'Dataviz/Map',
  component: Map,
  
    decorators: [
   (Story, { args })  => {
        const queryClient = new QueryClient();
            const key = JSON.stringify(args);

      return (
        <ControlContext.Provider value={CreateControlesRegistry()}>
          <QueryClientProvider client={queryClient} key={key}>
            <DatasetRegistryContext.Provider value={ createDatasetRegistry() } >
              <MemoryRouter>
                <HelmetProvider>
                  <Dashboard>
                    <Dataset
                        id="quartiers"
                        type="wfs"
                        url="https://data.lillemetropole.fr/geoserver/ows"
                        resource="ville_roubaix:les_quartiers_de_roubaix_et_leur_elue_referente"
                        meta={{srsname:'EPSG:4326'}}
                        />
                    <Story />
                 </Dashboard>
                </HelmetProvider>
               </MemoryRouter>
            </DatasetRegistryContext.Provider>
          </QueryClientProvider>
        </ControlContext.Provider>
      );
    },
    ]
} satisfies Meta<typeof Map>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args:{
        dataset:"quartiers",
        popup:true,
        popupFormatter : (row) => `Elu de quartier : ${row.elu_de_quartier}`,
        //valueKey:"elu_de_quartier",
        color:"#201f1fee",
        title: "Roubaix :Les élus de quartier"
    },
    argTypes:{
        categoryKey: {
            table: { disable: true },
        }
    }
}


export const Quantitatif: Story = {
    args:{
        dataset:"quartiers",
        popup:true,
        popupFormatter : (row) => `Surface du quartier : ${(row.st_area_shape).toLocaleString(undefined, {maximumFractionDigits:0})} m2`,
        valueKey:"st_area_shape",
        title: "Les quartiers de roubaix"
    },
    argTypes: {
        valueKey: {
            table: { readonly: true },
        },
        dataset:{
            table: { readonly: true },
        },
        title: {
        table: { disable: true }
        }
    },
    parameters: {
        controls: {
            include: ['dataset','valueKey', 'title','interpolationMethod'],
        }
}
}