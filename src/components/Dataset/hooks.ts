import { useContext } from "react"
import { DatasetRegistryContext } from "../DashboardPage/Page"

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