import { useContext, useEffect, createContext, useState, ReactElement } from "react"
import { SimpleRecord, useApi } from "../.."
import { CrudFilters } from "../../data_providers/types"
import { DatasetContext, DatasetRegistryContext } from "../DashboardPage/Page"
import alasql from "alasql"
import { Badge, Table } from "antd"
import { ColumnsType } from "antd/es/table"

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
        <DataContext.Provider value={{data: data?.data, setData:setDataState}}>
            { children }
        </DataContext.Provider>
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
        if (typeof children === 'string') { // Transformation via une requête SQL
            //console.log('Children is a string:', children);
            const new_data = data && alasql(children, [data]) as SimpleRecord[]
            data && dataContext?.setData(new_data)
        } else if (isFunction(children)) { //Transformation des données via une fonction JS
            //console.log('Use JS transformer');
            data && dataContext?.setData(children(data))
        } else {
                throw new Error(
                    `Transform children must be either a string or a function, got: ${typeof children}`
                );
        } }, [data, children]
    )

    return <></>

}

interface DSL_DataPreviewProps {
    dataset_id: string;
    pageSize?: number; //Default : Antdesign default pagesize (10)
    rowKey?: string
}
export const DSL_DataPreview:React.FC<DSL_DataPreviewProps> = ({dataset_id, pageSize, rowKey}) => {
    const datasetContext = useContext(DatasetContext)

    const dataset = datasetContext[dataset_id];
    const data = dataset?.data

    if (data === undefined) { // TODO : Afficher Empty si les données ont fini de fetcher et data est null ou lenght==0
        return <></>
    }


    const columns: ColumnsType<any> = Object.keys(data[0] || {}).map((key) => ({
        title: key,
        dataIndex: key,
        key,
        ellipsis: true,
      }));
      
    return (
        <>
            <h3><Badge status={dataset.isError ? "error" : dataset.isFetching ? 'processing' : 'success' } /> {dataset?.resource}</h3>
            <p>Enregistrements : {data?.length}</p>
            <Table pagination={{pageSize:pageSize}} dataSource={data} columns={columns} rowKey={(row) => rowKey ? row[rowKey]:JSON.stringify(row)} />
        </>
    )
    
}