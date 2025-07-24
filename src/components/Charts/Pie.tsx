import { useContext, useEffect } from "react";
import { useDataset } from "../Dataset/hooks";
import { ChartBlockConfig, ChartBlockContext } from "../DashboardPage/Block";
import { EChartsOption } from "echarts";
import { usePalette } from "../Palette/Palette";
import { SimpleRecord } from "../../types";
import { from, op } from "arquero";
import { ChartEcharts } from "./ChartEcharts";


interface IChartPieProps {
    dataset?:string, //dataset ID
    dataKey:string,
    nameKey:string,
    unit?:string,
    title?:string
    donut?:boolean
}

export const ChartPie:React.FC<IChartPieProps> = ({dataset:dataset_id, nameKey, dataKey, unit, title, donut=false}) => {
    const dataset = useDataset(dataset_id)
    const blockConfig = useContext(ChartBlockContext)

    const data = dataset?.data

    const block_config:ChartBlockConfig = {
      title: title,
      dataExport: data
    }
    useEffect(() => 
      blockConfig?.setConfig(block_config)
      , [data] )

    const chart_data:SimpleRecord[] | undefined = data && from(data).groupby(nameKey).rollup({value:op.sum(dataKey)}).objects().map((d:SimpleRecord) => ({
      name: d[nameKey],
      value: d.value,  
    }));

    const option:EChartsOption = {
      color:usePalette({nColors:chart_data?.length}),
      xAxis:{show:false}, yAxis:{show:false},
      series:[{
        type:'pie',
        data:chart_data,
        radius : donut ? ['40%','75%'] : [0, '75%']
      }],
      tooltip:{
        show:true,
        valueFormatter: v => `${v?.toLocaleString()} ${unit || ''} `
      }
    }

    return <ChartEcharts option={option}/>  
       
}
