import Table, { ColumnsType } from "antd/es/table";
import { Badge } from "antd";
import { useDataset } from "./hooks";

interface DSL_DataPreviewProps {
    dataset?: string;
    pageSize?: number; //Default : Antdesign default pagesize (10)
    rowKey?: string
}
export const DSL_DataPreview:React.FC<DSL_DataPreviewProps> = ({dataset: dataset_id, pageSize, rowKey}) => {
    const dataset = useDataset(dataset_id)

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
            <h3><Badge status={dataset?.isError ? "error" : dataset?.isFetching ? 'processing' : 'success' } /> {dataset?.resource}</h3>
            <p>Enregistrements : {data?.length}</p>
            <Table pagination={{pageSize:pageSize}} dataSource={data} columns={columns} rowKey={(row) => rowKey ? row[rowKey]:JSON.stringify(row)} />
        </>
    )
    
}