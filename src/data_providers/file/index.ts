import { axiosInstance} from "./utils/axios";
import { AxiosInstance } from "axios";
import { DataProvider } from "../types";

type MethodTypes = "get" | "post";

// Ajouter la possibilite de passer au provider une fonction pour parser le résultat (ex : (e) => e.result)
export const dataProvider = (
    apiUrl: string,
    options?: {
      httpClient?: AxiosInstance;
      processData?: (data: any) => any[];
    }
  ):DataProvider => {
    
    const { httpClient = axiosInstance, processData } = options || {};

    return {
      getList: async ({ resource, pagination, filters, sorters, meta }) => {
      const url = `${apiUrl}/${resource}`; // (ressource = url + nom du fichier + extension)

      const { headers: headersFromMeta, method } = meta ?? {};
      const requestMethod = (method as MethodTypes) ?? "get";

        const { data, headers:_headers } = await httpClient[requestMethod](
          `${url}`,
          {
            headers: headersFromMeta,
          }
        );
        const out_data = processData ? processData(data) : data
        //const features = //papaparse data
        return {
          data: out_data, //Parser ici avec la fonction utilisateur
          total: out_data.length,
          // Ajouter le fichier brut ?
        };

      },

      getApiUrl: () => {
        return apiUrl;
      },

  }}