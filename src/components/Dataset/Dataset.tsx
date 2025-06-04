import { useContext, useEffect, createContext, useState, ReactElement } from "react"
import { SimpleRecord, useApi } from "../.."
import { CrudFilters } from "../../data_providers/types"
import { DatasetRegistryContext } from "../DashboardPage/Page"

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

const DataContext = createContext<DataContextType | null>(null);

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
        <>
            <span>Dataset : {resource} </span>
            <DataContext.Provider value={{data: data?.data, setData:setDataState}}>
                { children }
            </DataContext.Provider>
        </>
    )
}

interface ITransformProps<T = SimpleRecord[]> {
    children:string | ((data: T) => T)
}

export const DSL_Transform:React.FC<ITransformProps> = ({children}) => {
    const dataContext = useContext(DataContext)
    const data = dataContext?.data;

    const isFunction = (value: any): value is Function => typeof value === 'function';
    
    useEffect( () => {
        if (typeof children === 'string') {
            //console.log('Children is a string:', children);
            throw new Error(
                `SQL Transform not implemented yet`
            );
            // ALASQL
        } else if (isFunction(children)) { //Transformation des données via une fonction JS
            //console.log('Use JS transformer');
            data && dataContext?.setData(children(data))
        } else {
                throw new Error(
                    `Transform children must be either a string or a function, got: ${typeof children}`
                );
        } }, [data, children]
    )

    return (
        <>
        </>
    )

}
