import { axiosInstance, generateSort, generateFilter } from "./utils";
import { AxiosInstance } from "axios";
import queryString from "query-string";
import { DataProvider } from "../types";

type MethodTypes = "get" | "delete" | "head" | "options";


export const dataProvider = (
  apiUrl: string,
  httpClient: AxiosInstance = axiosInstance
):DataProvider => ({
  getList: async ({ resource, pagination, filters, sorters, meta }) => {
    const url = `${apiUrl}/`;

    const { current = 1, pageSize = 10, mode = "off" } = pagination ?? {};

    const { headers: headersFromMeta, method } = meta ?? {};
    const requestMethod = (method as MethodTypes) ?? "get";

    const {filter:queryFilters, bbox} = generateFilter(filters);
    const generatedSort = generateSort(sorters);

    const query: {
      startindex?: number;
      count?: number;
      service: string;
      request: string;
      version: string;
      outputformat: string;
      typenames: string;
      sortby: string;
      filter?: string;
      bbox?:string;
      srsname?:string;
      propertyname?:string;
    } = {service:'WFS', request: 'GetFeature', sortby : '', version:'2.0.0', outputformat:'application/json', typenames: resource,
    srsname:meta?.srsname, propertyname:meta?.properties?.join(',')};

    if (mode === "server") {
      query.startindex = (current - 1) * pageSize;
      query.count = pageSize;
    }

    if (generatedSort) {
      query.sortby = generatedSort;
    }

    if (queryFilters) {
      query.filter=queryFilters
    }

    if (bbox !==''){
      query.bbox=bbox
    }

    const { data, headers:_headers } = await httpClient[requestMethod](
      `${url}?${queryString.stringify({...query, sortby : undefined})}&sortby=${query.sortby}&`, //"le + de sortby ne doit pas être urlencode"
      {
        headers: headersFromMeta,
      }
    );

    const features: any[] = data.features.map((feature:any) => 
        { const { properties, type, ...rest } = feature; //Remonter d'un niveau les properties, supprimer root.type
        return { ...rest, ...properties };}
    )

    return {
      data: features, 
      geojson:data,
      total: data.numberMatched,
    };
  },


  getApiUrl: () => {
    return apiUrl;
  },

})
