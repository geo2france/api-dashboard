import { useCallback, useContext, useState } from "react"
import { dataset } from "./Dataset";
import { DatasetRegistryContext } from "./context";
import { SimpleRecord } from "../..";

const demo_dataset: dataset = { //devnote a supprimer
  id: 'demo_dataset',
  isError: false,
  isFetching: false,
  resource: 'demo_dataset',
  data: [
    { name: 'Mercure', type: 'Planète', satellites: 0, diameter_km: 4879 },
    { name: 'Vénus', type: 'Planète', satellites: 0, diameter_km: 12104 },
    { name: 'Terre', type: 'Planète', satellites: 1, diameter_km: 12742 },
    { name: 'Mars', type: 'Planète', satellites: 2, diameter_km: 6779 },
    { name: 'Jupiter', type: 'Planète', satellites: 79, diameter_km: 139820 },
    { name: 'Saturne', type: 'Planète', satellites: 83, diameter_km: 116460 },
    { name: 'Uranus', type: 'Planète', satellites: 27, diameter_km: 50724 },
    { name: 'Neptune', type: 'Planète', satellites: 14, diameter_km: 49244 },
    { name: 'Pluton', type: 'Planète naine', satellites: 5, diameter_km: 2370 },
    { name: 'Cérès', type: 'Astéroïde', satellites: 0, diameter_km: 946 },
  ]
};

export type useDatasetInput = string | SimpleRecord[]

// 🔹 Hook pour récupérer un dataset unique
export const useDataset = (dataset_id? : useDatasetInput):dataset | undefined => {

    if(dataset_id == 'demo_dataset'){ //Devnote : a supprimer
      return demo_dataset
    }

    if (Array.isArray(dataset_id)) { //inline dataset
      return { data: dataset_id, isFetching: false, isError: false, resource: '', id:'' }
    }

    const datasetRegistry = useContext(DatasetRegistryContext)
    if (dataset_id) {
        return datasetRegistry.get(dataset_id);
      }
}


// 🔹 Hook pour récupérer tous les datasets sous forme de tableau
export const useAllDatasets = () => {
  const datasetRegistry = useContext(DatasetRegistryContext)
  return  Object.values(datasetRegistry.getAll())
}

// 🔹 Hook pour filtrer plusieurs datasets par id
export const useDatasets = (dataset_ids? : string[]) => {
  const datasets = useAllDatasets()

  return (
    datasets.filter( d => dataset_ids?.includes(d.id))
  )

}


/**
 * Fonction permettant de créer le registre de dataset
 * avec les méthodes nécessaires.
 */
export const createDatasetRegistry = () => {
    /* DATASET */
    const [datasets, setdatasets] = useState<Record<string, dataset>>({});
    const pushDataset = useCallback((d: dataset) => {
      setdatasets(prev => {
        const existing = prev[d.id];
        if (existing && existing.dataHash === d.dataHash && existing.isFetching === d.isFetching) { // Eviter les rerender si les données n'ont pas changé
          return prev; 
        }
        return { ...prev, [d.id]: d };
      });
    }, []);

    const clearDatasets = useCallback(() => {
      setdatasets({});
    }, []);

    const getDataset = useCallback((dataset_id?: string) => {
      if (!dataset_id) return undefined;       
      return datasets[dataset_id] ?? undefined; 
    }, [datasets]);

    const getAllDataset =  useCallback(() => {
      return datasets; 
    }, [datasets]);

    return {
      register: pushDataset,
      clear: clearDatasets,
      get: getDataset,
      getAll: getAllDataset,
    };
}