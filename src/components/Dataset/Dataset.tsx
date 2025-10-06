import { useContext, useEffect, ReactNode, ReactElement } from "react"
import { SimpleRecord, useApi } from "../.."
import { CrudFilters,DataProvider } from "../../data_providers/types"
import { ControlContext, DatasetRegistryContext } from "../DashboardPage/Page"
import { Producer, ProducerType } from "./Producer"
import React from "react"
import { Filter, Transform, useAllDatasets } from "../../dsl"
import alasql from "alasql"
import { DataProviderContext, getProviderFromType, ProviderType } from "./Provider"
import { Join, joinTypeType } from "./Join"
import { from } from "arquero"
import { JoinOptions } from "arquero/dist/types/table/types"


interface IDatasetProps {
    id:string
    provider?:DataProvider // Remplacer/ajouter providerUrl et providerType dans les props Dataset ?
    url?:string
    type?:ProviderType
    resource:string
    filters?:CrudFilters
    children?: ReactNode
    pageSize?:number
    meta?:any
}

 
export const DSL_Dataset:React.FC<IDatasetProps> = ({
  children, 
  id, 
  provider : provider_input, 
  type: providerType='file', 
  url:providerUrl, 
  resource, 
  pageSize, 
  meta}) => {


    const getTransformerFn = (component:ReactElement) => {
    /* 
    * Génére une fonction transformer soit 
    * - A partir d'un composant Transform (string ou fonction js)
    * - A partir d'un composant Join
    */
      if (typeof component.type!='string' && component.type == Transform) {
        const children = component.props.children
        if (typeof children === "string") {
          // Transformation via une requête SQL
          return (data: SimpleRecord[]) => data && alasql(children, [data]) as SimpleRecord[];
        } else {
          return (data: SimpleRecord[]) => data && children(data);
        }
      } 
      else if (typeof component.type!='string' && component.type === Join){
        const props = component.props
  
        const funct = (data: SimpleRecord[]) => {
          const join_type:joinTypeType = props.joinType || 'inner';
          const aq_join_option:JoinOptions = { // Options attendus par arquero
            left:  { left: true, right: false },
            right: { left: false, right: true },
            full: { left: true, right: true },
            inner: { left: false, right: false },
          }[join_type] ?? { left: false, right: false };

          const otherData = allDatasets?.find((d) => d.id === props.dataset)?.data;
          if (!otherData) return undefined; // ou [] ou data selon la logique souhaitée
          return from(data).join(from(otherData), props.joinKey, undefined, aq_join_option).objects();
        };
        return funct
      } else {
        throw new Error(`Unknown transformer component: ${component.type}`);
      }
    };

    const datasetRegistryContext = useContext(DatasetRegistryContext)
    const allDatasets = useAllDatasets()
    const someFetching = !!allDatasets?.some(d => d.isFetching);

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
          const value = (typeof c.props.children === "string" ? c.props.children.trim() : c.props.children ) || controls?.[c.props.control]
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
    .filter((c) => typeof c.type!='string' && (c.type.name == Transform.name || c.type.name == Join.name) ).forEach(
      (c) => {
        transformers.push( getTransformerFn(c) )
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
           datasetRegistryContext({id:id, resource:resource, data: finalData, isFetching:isFetching, isError:isError, producers:producers, geojson:data?.geojson});
            //Ajouter une info pour distinguer les erreurs du fourniseurs et celles des transformers ?
        }
      }, [resource, data, isFetching, someFetching, children]);


    return (
            <>
               { children }
            </>
    )
}


