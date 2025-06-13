import { useContext, useEffect, createContext, useState, ReactNode, useCallback } from "react"
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



 
type transformerFnType = (data: SimpleRecord[]) => SimpleRecord[]
interface TransformContextType {
    transformers?:{ id: string, fn: transformerFnType }[];
    addTransformer: (id: string, fn: transformerFnType) => void;
}

export const SetProducersContext = createContext<(p: ProducerType) => void>((() => {} ));
export const TransformContext = createContext<TransformContextType>({  
    transformers: [],
    addTransformer: () => {},
  })

export const DSL_Dataset:React.FC<IDatasetProps> = ({children, id, provider, resource, filters}) => {
    const {data, isFetching, isError} = useApi({dataProvider:provider, resource:resource, filters:filters})
    const datasetRegistryContext = useContext(DatasetRegistryContext)

    const [transformers, setTransformers] = useState<{ id: string, fn: transformerFnType }[]>([])

    const addTransformer = useCallback((id: string, fn: (data: SimpleRecord[]) => SimpleRecord[]) => {
        setTransformers(prev => {
          const exists = prev.find(t => t.id === id);
          if (exists && exists.fn === fn) return prev; // Rien à faire
          // Sinon, remplace ou ajoute
          const filtered = prev.filter(t => t.id !== id);
          return [...filtered, { id, fn }];
        });
      }, []);

    const [producers, setProducers] = useState<any[] >([]);

    const pushProducer = (p:ProducerType) => {
        setProducers(prev => { 
            // Protection contre le doublon
            const exists = prev.some(existing => existing.nom === p.nom && existing.url === p.url);
            return exists ? prev : [...prev, p];
          });    }

    useEffect(() => { //Appliquer le(s) transformer(s) et enregistrer le dataset dans le context de la page
        const finalData = data?.data && transformers.reduce(
            (datat, { fn }) => fn(datat),
            data.data
          );
        if (datasetRegistryContext) {
           datasetRegistryContext({id:id, resource:resource, data: finalData, isFetching:isFetching, isError:isError, producers:producers});
            //Ajouter une info pour distinguer les erreurs du fourniseurs et celles des transformers ?
        }
      }, [resource, data, transformers, isFetching]);



    return (
            <SetProducersContext.Provider value={pushProducer}>
                <TransformContext.Provider value={{addTransformer:addTransformer}}>
                    { children }
                </TransformContext.Provider>
            </SetProducersContext.Provider>
    )
}


