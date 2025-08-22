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
    const url = `${apiUrl}`;

    const { current = 1, pageSize = 10, mode = "off" } = pagination ?? {};

    const { headers: headersFromMeta, method } = meta ?? {};
    const requestMethod = (method as MethodTypes) ?? "get";

    const {filter:queryFilters, bbox} = generateFilter(filters);
    const generatedSort = generateSort(sorters);

    const query: {
      startindex?: number;
      maxfeatures?: number;
      service: string;
      request: string;
      version: string;
      outputformat: string;
      typename: string;
      sortby: string;
      filter?: string;
      bbox?:string;
      srsname?:string;
      propertyname?:string;
    } = {service:'WFS', request: 'GetFeature', sortby : '', version:'1.1.0', outputformat:'application/json', typename: resource,
    srsname:meta?.srsname, propertyname:meta?.properties?.join(',')};

    if (mode === "server") {
      query.startindex = (current - 1) * pageSize;
      query.maxfeatures = pageSize;
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

    const urlObj = new URL(url);
    const base_params = Object.fromEntries(urlObj.searchParams.entries()); // Params renseignés par l'utilisateur dans l'URL (notament MAP=XXX pour qgis server)
    const base_url = urlObj.origin + urlObj.pathname
    const { data, headers:_headers } = await httpClient[requestMethod](
      
      `${base_url}?${queryString.stringify({...query, sortby : undefined})}
        &sortby=${query.sortby}
        &${Object.entries(base_params).map(([k, v]) => `${k}=${v}`).join('&') }`, //le + de sortby et les paramètres de bases ne doivent pas être urlencode
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
