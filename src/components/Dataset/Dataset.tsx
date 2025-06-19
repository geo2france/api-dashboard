import { useContext, useEffect, createContext, useState, ReactNode } from "react"
import { SimpleRecord, useApi } from "../.."
import { CrudFilters } from "../../data_providers/types"
import { ControlContext, DatasetRegistryContext } from "../DashboardPage/Page"
import { ProducerType } from "./Producer"
import React from "react"
import { Filter, Transform } from "../../dsl"
import alasql from "alasql"


interface IDatasetProps {
    id:string
    provider:any
    resource:string
    filters?:CrudFilters
    children?: ReactNode
    pageSize?:number
}

 
export const SetProducersContext = createContext<(p: ProducerType) => void>((() => {} ));

type transformerFnType = (data: SimpleRecord[]) => SimpleRecord[]

const getTransformerFn = (children: string | transformerFnType):transformerFnType => {
  if (typeof children === "string") {
    // Transformation via une requête SQL
    return (data: SimpleRecord[]) => alasql(children, [data]) as SimpleRecord[];
  } else {
    return (data: SimpleRecord[]) => children(data);
  }
};

export const DSL_Dataset:React.FC<IDatasetProps> = ({children, id, provider, resource, pageSize}) => {
    const datasetRegistryContext = useContext(DatasetRegistryContext)

    const controlContext = useContext(ControlContext)
    const controls = controlContext?.values ;

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

    const {data, isFetching, isError} = useApi({dataProvider:provider, resource:resource, filters: filters, pagination:{pageSize:pageSize}})

    const transformers:Function[] = []
    /* Récuperer les fonctions transoformers */
    React.Children.toArray(children)
    .filter((c): c is React.ReactElement => React.isValidElement(c))
    .filter((c) => c.type == Transform).forEach(
      (c) => {
        transformers.push( getTransformerFn(c.props.children) )
      }
    )


    const pushProducer = (p:ProducerType) => {
        setProducers(prev => { 
            // Protection contre le doublon
            const exists = prev.some(existing => existing.nom === p.nom && existing.url === p.url);
            return exists ? prev : [...prev, p];
          });    }

    useEffect(() => { //Appliquer le(s) transformer(s) et enregistrer le dataset dans le context de la page
        const finalData = data?.data && transformers.reduce(
            (datat, fn ) => fn(datat),
            data.data
          );
        if (datasetRegistryContext) {
           datasetRegistryContext({id:id, resource:resource, data: finalData, isFetching:isFetching, isError:isError, producers:producers});
            //Ajouter une info pour distinguer les erreurs du fourniseurs et celles des transformers ?
        }
      }, [resource, data, isFetching]);



    return (
            <SetProducersContext.Provider value={pushProducer}>
                    { children }
            </SetProducersContext.Provider>
    )
}


