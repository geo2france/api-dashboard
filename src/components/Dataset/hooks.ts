import { useContext } from "react"
import { DatasetContext } from "../DashboardPage/Page"


export const useDataset = (dataset_id? : string) => {
    const datasetContext = useContext(DatasetContext)
    if (dataset_id) {
        return datasetContext[dataset_id];
      }
    
    // Retourne le premier dataset si pas d'id
    const firstKey = Object.keys(datasetContext)[0];
    return firstKey ? datasetContext[firstKey] : undefined;
}