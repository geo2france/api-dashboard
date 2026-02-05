import { Table } from "antd"
import { useDataset, useDatasetInput } from "../Dataset/hooks"
import type { TableProps } from 'antd';
import { useBlockConfig } from "../DashboardPage/Block";


export interface DataTableProps {
    /** Jeu de données */
    dataset: useDatasetInput

    /** Titre du composant */
    title?: string

    /** Nombre d'éléments par page */
    pageSize?: number

    /** Style CSS du tableau */
    style?: React.CSSProperties
}

/** Afficher un dataset sous forme de tableau
 */
export const DataTable:React.FC<DataTableProps> = ({
    dataset: dataset_id,
    title,
    pageSize=5,
    style
    }:DataTableProps) => {

    const dataset = useDataset(dataset_id) ; //Récupérer le jeu de données
    const data = dataset?.data ;

    useBlockConfig({
        title:title,
        dataExport: data
    })

    const cols:TableProps['columns'] = Object.keys(data?.[0] || {})?.map( (k:string) => ({
        dataIndex:k,
        title: k,
        ellipsis: true,
        key:k,
        render: (v) =>  typeof v === 'number' ? isNaN(v) ? '' : v.toLocaleString() : v ,
    }))

    return <Table columns={cols} style={style} className="data-table"
                dataSource={ Array.isArray(data) ? data?.map((r, idx) => ({...r, key:idx})) : []  } 
                pagination={{ pageSize:pageSize }} />
}
