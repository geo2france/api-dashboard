import { useContext, useEffect, createContext, useState, ReactNode, useCallback } from "react"
import { SimpleRecord, useApi } from "../.."
import { CrudFilters } from "../../data_providers/types"
import { ControlContext, DatasetRegistryContext } from "../DashboardPage/Page"
import { ProducerType } from "./Producer"
import React from "react"
import { Filter } from "../../dsl"


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


export const DSL_Dataset:React.FC<IDatasetProps> = ({children, id, provider, resource}) => {
    const datasetRegistryContext = useContext(DatasetRegistryContext)
    const [transformers, setTransformers] = useState<{ id: string, fn: transformerFnType }[]>([])

    const controlContext = useContext(ControlContext)
    const controls = controlContext?.values ;


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

    
    /* Récupérer les props des filtres depuis les composants enfant Filter */
    const filters:CrudFilters = []
    React.Children.toArray(children)
      .filter((c): c is React.ReactElement => React.isValidElement(c))
      .filter((c) => c.type == Filter).forEach(
      (c) => {
          const value = c.props.children?.trim() || controls?.[c.props.control]
          filters.push({
            operator:c.props.operator || 'eq',
            value: value,
            field: c.props.field
        })
      }) 

    const {data, isFetching, isError} = useApi({dataProvider:provider, resource:resource, filters: filters})

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


