import { useContext, useEffect, createContext, useState, ReactNode } from "react"
import { SimpleRecord, useApi } from "../.."
import { CrudFilters } from "../../data_providers/types"
import { DatasetRegistryContext } from "../DashboardPage/Page"
import { ProducerType } from "./Producer"


interface IDatasetProps {
    id:string
    provider:any
    resource:string
    filters?:CrudFilters
    children?: ReactNode
}

interface DataContextType {
    data: SimpleRecord[] | undefined;
    setData: React.Dispatch<React.SetStateAction<any[] | undefined>>;
 }



export const DataContext = createContext<DataContextType | null>(null);
export const SetProducersContext = createContext<(p: ProducerType) => void>((() => {} ));

export const DSL_Dataset:React.FC<IDatasetProps> = ({children, id, provider, resource, filters}) => {
    const {data, isFetching, isError} = useApi({dataProvider:provider, resource:resource, filters:filters})
    const datasetRegistryContext = useContext(DatasetRegistryContext)

    const [dataState, setDataState] = useState<any[] | undefined >(undefined);
    const [producers, setProducers] = useState<any[] >([]);

    const pushProducer = (p:ProducerType) => {
        setProducers(prev => { 
            // Protection contre le doublon
            const exists = prev.some(existing => existing.nom === p.nom && existing.url === p.url);
            return exists ? prev : [...prev, p];
          });    }

    useEffect(() => { //Enregistrer le dataset dans le context de la page
        if (datasetRegistryContext) {
           datasetRegistryContext({id:id, resource:resource, data: dataState || data?.data, isFetching:isFetching, isError:isError, producers:producers});
        }
      }, [resource, data, dataState, isFetching]);



    return (
        <DataContext.Provider value={{data: data?.data, setData:setDataState}}>
            <SetProducersContext.Provider value={pushProducer}>
            { children }
            </SetProducersContext.Provider>
        </DataContext.Provider>
    )
}


