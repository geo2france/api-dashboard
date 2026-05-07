//import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom';
//import userEvent from '@testing-library/user-event'
import { QueryClient } from '@tanstack/react-query'
import { /*useApi,*/ WfsProvider } from '../..';
import { CrudFilters, CrudSorting, Pagination } from '../types';

const test_provider_url = "https://www.geo2france.fr/geoserver/ows"
const test_page_size = 3;
const test_filter_field = "siren_epci";
const test_filter_value = "200067999";

const resource = "odema:destination_dma_epci";
const filters: CrudFilters = [
  {
    field: test_filter_field,
    operator: "eq",
    value: test_filter_value,
  },
];

const pagination: Pagination = {
  mode: "server",
  pageSize: test_page_size,
};

const sorters: CrudSorting = [{ field: "fid", order: "asc" }];


const queryClient = new QueryClient()

//TODO tester dans un composant
/*const component_using_api:React.FC = () => {
    const provider = WfsProvider("https://www.geo2france.fr/geoserver/ows")
    const data = useApi({
        dataProvider:provider, 
        resource:"odema:destination_dma_epci ", 
        pagination:{
            mode:"off" 
        },
        filters:[
                {
                    field:"siren_epci",
                    operator:"eq",
                    value:"200067999"
                }]
        })

    return <></>
}*/

describe("WFS Provider", () => {

    test("basic filter & pagination", async () => {
        const provider = WfsProvider(test_provider_url)

        const queryKey = [provider.getApiUrl, resource, filters, pagination, sorters, undefined];

        const result = await queryClient.fetchQuery({
            queryKey: queryKey,
            queryFn: () => provider.getData({
                resource: resource, 
                filters: filters,
                pagination: pagination,
                sorters: sorters
            }),
        });

        expect(result).toHaveProperty('data');
        expect(result.data).toHaveLength(test_page_size); 
        expect(result.data[0][test_filter_field]).toEqual(test_filter_value);

    });

})