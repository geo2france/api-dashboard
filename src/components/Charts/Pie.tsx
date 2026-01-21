import { useDataset } from "../Dataset/hooks";
import { EChartsOption, LabelFormatterCallback } from "echarts";
import type { CallbackDataParams } from 'echarts/types/dist/shared';
import { usePalette, usePaletteLabels } from "../Palette/Palette";
import { SimpleRecord } from "../../types";
import { from, op } from "arquero";
import { ChartEcharts } from "./ChartEcharts";
import { merge_others } from "../..";
import { useBlockConfig } from "../DashboardPage/Block"
import deepMerge from "../../utils/deepmerge";


interface IChartPieProps {
    dataset?:string, //dataset ID
    dataKey:string,
    nameKey:string,
    unit?:string,
    title?:string
    donut?:boolean
    other?:number | null // Merge categorie with less than `other` percent
    
    /** Nombre de décimales après la virgule à afficher (1 par défaut)
     */
    precision?:number

    /** Personnaliser le formatter des labels de la série
     * cf. https://echarts.apache.org/en/option.html#series-pie.label.formatter */
    labelFormatter?: string | LabelFormatterCallback<CallbackDataParams>

    /** Options suplémentaires passées à Echarts */
    option?:EChartsOption
}

export const ChartPie:React.FC<IChartPieProps> = ({dataset:dataset_id, nameKey, dataKey, unit, title, donut=false, other=5, labelFormatter, precision=1, option:customOption = {}}) => {
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

    //@ts-ignore
    const total = chart_data1.length > 0 && from(chart_data1).rollup({ value: op.sum('value') }).object()?.value
    console.log('total',total)
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
          color:(p) => colors_labels.find( i => i.label.toLowerCase() === p.name.toLowerCase())?.color ?? colors?.[p.dataIndex] ?? '#000'
        }, 
        data:chart_data,
        radius : donut ? ['40%','75%'] : [0, '75%'],
        label: {
          formatter : labelFormatter
        }
      }],
      tooltip:{
        show:true,
        valueFormatter: v => `${v?.toLocaleString(undefined, {maximumFractionDigits:precision})} ${unit || ''} `
      },
      graphic: {
        type: 'text',
        left: 'center',
        top: 'center',
        style: {
          text: `${total.toLocaleString(undefined,{maximumFractionDigits:precision})} ${unit}`, 
          fontSize: 24,
          fontWeight: 'bold',
          fill: '#333',
        }
      }
    }

    return <ChartEcharts option={deepMerge({},option, customOption)}/>  
       
}
