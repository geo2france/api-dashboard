import { useContext, useEffect, createContext, useState, ReactElement } from "react"
import { SimpleRecord, useApi } from "../.."
import { CrudFilters } from "../../data_providers/types"
import { DatasetRegistryContext } from "../DashboardPage/Page"
import { DSL_Transform } from "./Transform"


interface IDatasetProps {
    id:string
    provider:any
    resource:string
    filters?:CrudFilters
    children?:ReactElement<typeof DSL_Transform>;
}

interface DataContextType {
    data: SimpleRecord[] | undefined;
    setData: React.Dispatch<React.SetStateAction<any[] | undefined>>;
  }

export const DataContext = createContext<DataContextType | null>(null);

export const DSL_Dataset:React.FC<IDatasetProps> = ({children, id, provider, resource, filters}) => {
    const {data, isFetching, isError} = useApi({dataProvider:provider, resource:resource, filters:filters})
    const datasetRegistryContext = useContext(DatasetRegistryContext)

    const [dataState, setDataState] = useState<any[] | undefined >(undefined);

    
    useEffect(() => { //Enregistrer le dataset dans le context de la page
        if (datasetRegistryContext) {
           datasetRegistryContext({id:id, resource:resource, data: dataState || data?.data, isFetching:isFetching, isError:isError});
        }
      }, [resource, data, dataState, isFetching]);



    return (
        <DataContext.Provider value={{data: data?.data, setData:setDataState}}>
            { children }
        </DataContext.Provider>
    )
}


