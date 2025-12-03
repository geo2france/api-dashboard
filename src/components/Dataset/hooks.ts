import { useCallback, useContext, useState } from "react"
import { dataset } from "./Dataset";
import { DatasetRegistryContext } from "./context";

// 🔹 Hook pour récupérer un dataset unique
export const useDataset = (dataset_id? : string) => {
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



export const useDatasetRegistry = () => {
    /* DATASET */
    const [datasets, setdatasets] = useState<Record<string, dataset>>({});
    const pushDataset = useCallback((d: dataset) => {
      setdatasets(prev => {
        const existing = prev[d.id];
        if (existing && existing.dataHash === d.dataHash) { // Eviter les rerender si les données n'ont pas changé
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