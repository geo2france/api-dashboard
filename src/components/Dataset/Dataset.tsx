import { useContext, useEffect, ReactNode, ReactElement } from "react"
import { SimpleRecord, useApi } from "../.."
import { CrudFilters,DataProvider } from "../../data_providers/types"
import { ControlContext, DatasetRegistryContext } from "../DashboardPage/Page"
import { Producer, ProducerType } from "./Producer"
import React from "react"
import { Filter, Transform, useAllDatasets, useDatasets } from "../../dsl"
import alasql from "alasql"
import { DataProviderContext, getProviderFromType, ProviderType } from "./Provider"
import { Join, joinTypeType } from "./Join"
import { from } from "arquero"
import { JoinOptions } from "arquero/dist/types/table/types"
import hashCode from "../../utils/hash_data"


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
           // Return undefinied if otherData is Fetching ?

          if (!otherData  || !data ) return undefined; // prevent arquero from crash on missed data
          
          //fallback if one of dataset is empty. Build a 1 row table with existing joinKey
          const [leftKey, rightKey] = Array.isArray(props.joinKey) // joinKey can be a string or un string[]
              ? props.joinKey
              : [props.joinKey, props.joinKey];

          const leftTable = data.length >= 1 ? data : [{ [leftKey]: null }]; 
          const rightTable = otherData.length >= 1 ? otherData : [{ [rightKey]: null }]; 

          return from(leftTable).join(from(rightTable), props.joinKey, undefined, {suffix: ['', '_2'], ...aq_join_option}).objects();
        };
        return funct
      } else {
        throw new Error(`Unknown transformer component: ${component.type}`);
      }
    };

    const datasetRegistryContext = useContext(DatasetRegistryContext)

    const allDatasets = useAllDatasets()

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

    const {data, isFetching, isError } = useApi({dataProvider:provider, resource:resource, filters: filters, pagination:{pageSize:pageSize}, meta:meta})

    const dep_dataset_id:string[] = [] // Dependencies

    const transformers:Function[] = []
    /* Récuperer les fonctions transformers */
    React.Children.toArray(children)
    .filter((c): c is React.ReactElement => React.isValidElement(c))
    .filter((c) => typeof c.type!='string' && (c.type.name == Transform.name || c.type.name == Join.name) ).forEach(
      (c) => {
        transformers.push( getTransformerFn(c) )
        if (typeof c.type!='string' && c.type.name == Join.name) dep_dataset_id.push(c.props.dataset) // Add joint dataset in dep list
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
    
    const depDataset = useDatasets(dep_dataset_id)
    const depDataHash = depDataset?.map(d=>d?.dataHash) //Build hash array from data

    const someDepsAreFetching = depDataset?.some(d => d?.isFetching);

    useEffect(() => { //Appliquer le(s) transformer(s) et enregistrer le dataset dans le context de la page
        const finalData = data?.data && transformers.reduce(
            (datat, fn ) => fn(datat),
            data.data
          );
        if (datasetRegistryContext) {
           datasetRegistryContext.register({
             id: id,
             resource: resource,
             data: finalData,
             isFetching: !!isFetching || !!someDepsAreFetching,
             isError: isError,
             producers: producers,
             geojson: data?.geojson,
             dataHash: hashCode(finalData)
           });
            //Ajouter une info pour distinguer les erreurs du fourniseurs et celles des transformers ?
        }
      }, [resource, data, (!!isFetching || !!someDepsAreFetching), hashCode(depDataHash), children]);


    return (
            <>
               { children }
            </>
    )
}

