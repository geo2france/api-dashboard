
/**
 * Graphique standard pour afficher des données annuelles
 */

import { from, op } from "arquero"
import { useDataset } from "../Dataset/hooks"
import { SimpleRecord } from "../../types"
import { EChartsOption, SeriesOption } from "echarts"
import { usePalette } from "../Palette/Palette"
import { ChartEcharts } from "./ChartEcharts"
import { useContext, useEffect } from "react"
import { ChartBlockConfig, ChartBlockContext } from "../DashboardPage/Block"

interface IYearSerieProps {
    dataset:string
    title?:string
    yearKey:string
    valueKey:string
    categoryKey?:string
    stack?: boolean
    yearMark?:number | string
    type?: 'bar' | 'line' | 'area'
}
export const ChartYearSerie:React.FC<IYearSerieProps> = ({dataset:dataset_id, categoryKey, valueKey, yearKey, yearMark, stack:stack_input, title, type:chart_type='bar'}) => {
    const stack = stack_input || chart_type == 'line' ? false : true ; // Pas de stack par défaut pour le type line
    const dataset = useDataset(dataset_id)
    const data = dataset?.data
    

    let chart_data:SimpleRecord[] = []
    let distinct_cat:string[] = []

    const blockConfig = useContext(ChartBlockContext) //TODO : créer un hook pour simplifier la config du block
    const block_config:ChartBlockConfig = {
      title: title,
      dataExport: data
    }
    useEffect(() => 
      blockConfig?.setConfig(block_config)
      , [title, data] )

    if (data && data.length > 0) {
        const grouped_data = categoryKey ? from(data).groupby(yearKey, categoryKey) //Somme par année et categorykey
                                                .rollup({[valueKey]:op.sum(valueKey)})
                                                .groupby(yearKey).orderby(yearKey)
                                                :
                                             from(data).groupby(yearKey) //Somme par année seulement
                                            .rollup({[valueKey]:op.sum(valueKey)}).orderby(yearKey)
                                            
 
        const all_years = from(data).groupby(yearKey).rollup({[yearKey]: op.any(yearKey)})
        const all_cats= categoryKey ? (from(data).groupby(categoryKey).rollup({[categoryKey]: op.any(categoryKey)})) : from([{'cat':valueKey}])
        const full = all_years.cross(all_cats) // Contient chaque annee x catégorie (pour éviter les trous)

        distinct_cat = all_cats.array(categoryKey || 'cat') as string[] // Pour générer chaque serie

        chart_data = full.join_left(grouped_data).objects()

    }

    const COLORS = usePalette({nColors:distinct_cat?.length}) || []

    const series = distinct_cat.map((cat, idx) => (
        {
            name:cat,
            type:chart_type === 'area' ? 'line' : chart_type,
            data :categoryKey ? chart_data?.filter((row:SimpleRecord) => row[categoryKey] === cat).map((row:SimpleRecord) => ([String(row[yearKey]), row[valueKey] || 0 ]))
                              : chart_data?.map((row:SimpleRecord) => ([String(row[yearKey]), row[valueKey] || 0 ])),
            itemStyle:{
                color:COLORS && COLORS[idx % COLORS.length],
           },
           stack: stack ? 'total' : undefined,
           areaStyle : chart_type === 'area' ? {} : undefined,
           markLine: idx === 0 && yearMark ? {
            symbol: 'none',
            data: [
              { xAxis: String(yearMark) }  
            ]
          } : undefined
        }
    )) as SeriesOption[];

    function tooltipFormatter(params: any): string {
        if (!params || params.length === 0) return '';
        const year = params[0].value[0];
        const lines = params.map((p:any) => {
          const value = Number(p.value[1]).toLocaleString();
          return `${p.marker} ${p.seriesName} <b><span style="display:inline-block; min-width:80px; text-align:right;">${value}</span></b>`;
        });
      
        return `<div>${year}</div>` + lines.join('<br/>');
    }

    const option:EChartsOption = {
        series:series,
        legend: {
            show:true,
            bottom:0
        },
        tooltip: {
            trigger: 'axis',
            formatter: tooltipFormatter
          },
        xAxis: {
            type: 'time',
        },
        yAxis:  {
            type: 'value',
        },
    }
     
    return (
        <ChartEcharts option={option}/>

    )


}
