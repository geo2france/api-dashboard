import { useContext, useEffect } from "react"
import { useApi } from "../.."
import { CrudFilters } from "../../data_providers/types"
import { DatasetRegistryContext } from "../DashboardPage/Page"

interface IDatasetProps {
    id:string
    provider:any
    resource:string
    filters?:CrudFilters
}
export const DSL_Dataset:React.FC<IDatasetProps> = ({id, provider, resource, filters}) => {
    const {data, isFetching, isError} = useApi({dataProvider:provider, resource:resource, filters:filters})
    const datasetRegistryContext = useContext(DatasetRegistryContext)

    useEffect(() => { //Enregistrer le dataset dans le context de la page
        if (datasetRegistryContext) {
            datasetRegistryContext({id:id, resource:resource, data:data?.data, isFetching:isFetching, isError:isError});
        }
      }, [resource, data, isFetching]);

    return (
            <span>Dataset : {resource} </span>
    )
}
