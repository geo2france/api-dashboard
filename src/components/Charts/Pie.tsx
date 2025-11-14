import { useDataset } from "../Dataset/hooks";
import { EChartsOption } from "echarts";
import { usePalette, usePaletteLabels } from "../Palette/Palette";
import { SimpleRecord } from "../../types";
import { from, op } from "arquero";
import { ChartEcharts } from "./ChartEcharts";
import { merge_others } from "../..";
import { useBlockConfig } from "../DashboardPage/Block"


interface IChartPieProps {
    dataset?:string, //dataset ID
    dataKey:string,
    nameKey:string,
    unit?:string,
    title?:string
    donut?:boolean
    other?:number | null // Merge categorie with less than `other` percent
}

export const ChartPie:React.FC<IChartPieProps> = ({dataset:dataset_id, nameKey, dataKey, unit, title, donut=false, other=5}) => {
    const dataset = useDataset(dataset_id)
    const data = dataset?.data

    useBlockConfig({ 
      title: title,
      dataExport: data
    })

    const chart_data1: SimpleRecord[] =
      data && data.length > 0
        ? from(data)
            .groupby(nameKey)
            .rollup({ value: op.sum(dataKey) })
            .objects()
            .map((d: any) => ({
              name: d[nameKey],
              value: d.value,
            }))
        : [];


    const chart_data = merge_others({dataset:chart_data1 || [], min:other || -1 })
    const colors = usePalette({nColors:chart_data?.length})
    const colors_labels = usePaletteLabels() 

    const option:EChartsOption = {
      xAxis:{show:false}, yAxis:{show:false},
      series:[{
        type:'pie',
        color:usePalette({nColors:chart_data?.length}),
        itemStyle:{
          /* Use label's color if any, otherwise fallback to Echarts calculated color */
          color:(p) => { console.log(p.color, p); return colors_labels.find( i => i.label.toLowerCase() === p.name.toLowerCase())?.color ?? colors?.[p.dataIndex] ?? '#000' }
        }, 
        data:chart_data,
        radius : donut ? ['40%','75%'] : [0, '75%'],
      }],
      tooltip:{
        show:true,
        valueFormatter: v => `${v?.toLocaleString()} ${unit || ''} `
      }
    }

    return <ChartEcharts option={option}/>  
       
}
