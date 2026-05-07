import '@testing-library/jest-dom';
import { QueryClient } from '@tanstack/react-query'
import { DatafairProvider} from '../..';
import { CrudFilters, Pagination } from '../types';

const test_provider_url = "https://data.ademe.fr/data-fair/api/v1/datasets"
const test_page_size = 3;
const test_filter_field = "L_TYP_REG_SERVICE";
const test_filter_value = "Valorisation organique";

const resource = "sinoe-(r)-destination-des-dma-collectes-par-type-de-traitement/lines";
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

const sorters = undefined;

const queryClient = new QueryClient()


describe("DataFair Provider", () => {

    test("basic filter & pagination", async () => {
        const provider = DatafairProvider(test_provider_url)

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