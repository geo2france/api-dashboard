import { useContext, useEffect, ReactNode } from "react"
import { SimpleRecord, useApi } from "../.."
import { CrudFilters,DataProvider } from "../../data_providers/types"
import { ControlContext, DatasetRegistryContext } from "../DashboardPage/Page"
import { Producer, ProducerType } from "./Producer"
import React from "react"
import { Filter, Transform } from "../../dsl"
import alasql from "alasql"
import { DataProviderContext, getProviderFromType, ProviderType } from "./Provider"


interface IDatasetProps {
    id:string
    provider?:DataProvider // Remplacer/ajouter providerUrl et providerType dans les props Dataset ?
    url?:`http${'s' | ''}://${string}`;
    type?:ProviderType
    resource:string
    filters?:CrudFilters
    children?: ReactNode
    pageSize?:number
    meta?:any
}

 

type transformerFnType = (data: SimpleRecord[]) => SimpleRecord[]

const getTransformerFn = (children: string | transformerFnType):transformerFnType => {
  if (typeof children === "string") {
    // Transformation via une requête SQL
    return (data: SimpleRecord[]) => alasql(children, [data]) as SimpleRecord[];
  } else {
    return (data: SimpleRecord[]) => children(data);
  }
};

export const DSL_Dataset:React.FC<IDatasetProps> = ({
  children, 
  id, 
  provider : provider_input, 
  type: providerType='file', 
  url:providerUrl, 
  resource, 
  pageSize, 
  meta}) => {
    const datasetRegistryContext = useContext(DatasetRegistryContext)

    const controlContext = useContext(ControlContext)
    const controls = controlContext?.values ;

    const providerContext = useContext(DataProviderContext)

    const provider = (providerUrl && getProviderFromType(providerType)(providerUrl)) || providerContext || provider_input;
    if (provider === undefined){
      throw new Error("Error : No dataProvider, please use one of : <Provider> parent, providerUrl/providerType properties or provider property")
    }


    /* Récupérer les props des filtres depuis les composants enfant Filter */
    const filters:CrudFilters = []
    React.Children.toArray(children)
      .filter((c): c is React.ReactElement => React.isValidElement(c))
      .filter((c) => typeof c.type!='string' && c.type.name == Filter.name).forEach(
      (c) => {
          const value = String(c.props.children).trim() || controls?.[c.props.control]
          filters.push({
            operator:c.props.operator || 'eq',
            value: value,
            field: c.props.field
        })
      }) 

    const {data, isFetching, isError} = useApi({dataProvider:provider, resource:resource, filters: filters, pagination:{pageSize:pageSize}, meta:meta})

    const transformers:Function[] = []
    /* Récuperer les fonctions transformers */
    React.Children.toArray(children)
    .filter((c): c is React.ReactElement => React.isValidElement(c))
    .filter((c) => typeof c.type!='string' && c.type.name == Transform.name).forEach(
      (c) => {
        transformers.push( getTransformerFn(c.props.children) )
      }
    )

    const producers:ProducerType[] = [];
    React.Children.toArray(children)
    .filter((c): c is React.ReactElement => React.isValidElement(c))
    .filter((c) => typeof c.type!='string' && c.type.name == Producer.name).forEach(
      (c) => {
        producers.push({nom : c.props.children, url: c.props.url })
      }
    );

    useEffect(() => { //Appliquer le(s) transformer(s) et enregistrer le dataset dans le context de la page
        const finalData = data?.data && transformers.reduce(
            (datat, fn ) => fn(datat),
            data.data
          );
        if (datasetRegistryContext) {
           datasetRegistryContext({id:id, resource:resource, data: finalData, isFetching:isFetching, isError:isError, producers:producers});
            //Ajouter une info pour distinguer les erreurs du fourniseurs et celles des transformers ?
        }
      }, [resource, data, isFetching, children]);



    return (
            <>
               { children }
            </>
    )
}


