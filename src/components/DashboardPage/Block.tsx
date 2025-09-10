import { Card, Dropdown, theme } from "antd";
import { createContext, useContext, useEffect, useId, useState } from "react";
import { SimpleRecord } from "../../types";
import { FaFileCsv } from "react-icons/fa";
import { AiOutlineMore } from "react-icons/ai";
import { ProducersFooter } from "../Dataset/Producer";


const { useToken } = theme;


export interface ChartBlockConfig {
    title?: string,
    dataExport?: SimpleRecord[]
}
type ChartBlockContextType = {
    config: ChartBlockConfig;
    setConfig: (config: ChartBlockConfig) => void;
};

export const ChartBlockContext = createContext<ChartBlockContextType | undefined>(undefined);

interface IChartBlockProps {
    children:React.ReactElement
}
export const DSL_ChartBlock:React.FC<IChartBlockProps> = ({children}) => {
    const id = useId()
    const [config, setConfig] = useState<ChartBlockConfig>({})
    const {token} = useToken()
    const menu_items = [
        {
            key: "export_data_csv",
            label: (
              <a onClick={() => handleExportData()}>
                <FaFileCsv /> CSV
              </a>
            ),
            disabled: config.dataExport === undefined
          },
    ]

    const has_action = menu_items.some(item => !item.disabled);

    const dropdown_toolbox = (
        <Dropdown menu={{ items: menu_items}}>
          <a style={{ color: token.colorTextBase }}>
            <AiOutlineMore />
          </a>
        </Dropdown>
      );

    const handleExportData = () => {
            console.log('datadl')
            console.log(config.dataExport )
            const DL = async() => {
                if (config.dataExport === undefined) { return }
                const XLSX = await import("xlsx");
                const worksheet = XLSX.utils.json_to_sheet(config.dataExport);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, "data");
                XLSX.writeFile(workbook, `${config.title || id}.csv`, {
                    compression: true,
                });
            }
            DL()
    }
    return (
        <ChartBlockContext.Provider value={{config:config, setConfig:(e) => setConfig(e)}}>
            <Card 
            style={{height:'100%'}} 
            extra={has_action && dropdown_toolbox}
            title={config.title}>
                {children} 
                <ProducersFooter component={children} />
            </Card>
        </ChartBlockContext.Provider>
    )
}


export const useBlockConfig = ({ title, dataExport }:ChartBlockConfig) => {
    const blockContext = useContext(ChartBlockContext)
        useEffect(() => 
          blockContext?.setConfig({
            title:title,
            dataExport:dataExport
          })
          , [title, dataExport] )
}