import { axiosInstance, generateSort, generateFilter } from "./utils";
import { AxiosInstance } from "axios";
import queryString from "query-string";

type MethodTypes = "get" | "delete" | "head" | "options";

export interface GetListParams { // Reprendre les types depuis le projet refine
  resource: string;
  pagination?: any;
  filters?: any[];
  sorters?: any[];
  meta?: any; 
}


export const dataProvider = (
  apiUrl: string,
  httpClient: AxiosInstance = axiosInstance
) => ({
  getList: async ({ resource, pagination, filters, sorters, meta }:GetListParams) => {
    const url = `${apiUrl}/${resource}`; //Ajouter /line par défaut ? (si aucun autre /machin)

    const { current = 1, pageSize = 10, mode = "server" } = pagination ?? {};

    const { headers: headersFromMeta, method } = meta ?? {};
    const requestMethod = (method as MethodTypes) ?? "get";

    const queryFilters = generateFilter(filters);

    const query: {
      page?: number;
      size?: number;
      sort?: string;
      qs?: string;
    } = {};

    if (mode === "server") {
      query.page = current;
      query.size = pageSize;
    }

    const generatedSort = generateSort(sorters);
    if (generatedSort) {
      query.sort = generatedSort
    }

    if(queryFilters){
      query.qs = queryFilters
    }

    const { data } = await httpClient[requestMethod](
      `${url}?${queryString.stringify(query)}`,
      {
        headers: headersFromMeta,
      }
    );


    return {
      data: data.results,
      total: data.total,
    };
  },
  
  getApiUrl: () => {
    return apiUrl;
  },
 
});
