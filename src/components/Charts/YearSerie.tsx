
/**
 * Graphique standard pour afficher des données annuelles
 */

import { from, op } from "arquero"
import { useDataset } from "../Dataset/hooks"
import { SimpleRecord } from "../../types"
import { EChartsOption } from "echarts"
import EChartsReact from "echarts-for-react"

interface IYearSerieProps {
    dataset:string
    title?:string
    yearControl?:string
    yearKey:string
    valueKey:string
    categoryKey?:string
    stack?: boolean
    type?: 'bar' | 'line' | 'area'
}
export const ChartYearSerie:React.FC<IYearSerieProps> = ({dataset:dataset_id, categoryKey, valueKey, yearKey, stack:stack_input, type:chart_type='bar', yearControl='year'}) => {
    const stack = stack_input || chart_type == 'line' ? false : true ; // Pas de stack par défaut pour le type line
    const dataset = useDataset(dataset_id)
    const data = dataset?.data
    //const current_year = useControl(yearControl) 

    const COLORS = [
        '#00448e', // bleu foncé
        '#ffa630', // orange
        '#8fc03c', // vert vif
        '#6e40aa', // violet
        '#fb676f', // rouge clair
        '#75a4da', // bleu clair
        '#f82333', // rouge vif
        '#b4d973', // vert clair
        '#2f6bb3'  // bleu moyen
      ];

    const chart_data = categoryKey ? data && from(data).groupby(yearKey, categoryKey) //Somme par année et categorykey
                                            .rollup({[valueKey]:op.sum(valueKey)})
                                            .groupby(yearKey).objects()
                                            :
                                        data &&  from(data).groupby(yearKey) //Somme par année seulement
                                        .rollup({[valueKey]:op.sum(valueKey)})
                                        .objects()

      console.log(chart_data)
    const distinct_cat:string[] | undefined = categoryKey ? 
        data && (from(data).rollup({cat: op.array_agg_distinct(categoryKey)}).object() as { cat: string[] } ).cat
        :
        [valueKey]

    const series = distinct_cat ? distinct_cat.map((cat, idx) => (
        {
            name:cat,
            type:chart_type === 'area' ? 'line' : chart_type,
            data :categoryKey ? chart_data?.filter((row:SimpleRecord) => row[categoryKey] === cat).map((row:SimpleRecord) => ([String(row[yearKey]), row[valueKey] ]))
                              : chart_data?.map((row:SimpleRecord) => ([String(row[yearKey]), row[valueKey] ])),
            itemStyle:{
                color:COLORS[idx % COLORS.length],
           },
           stack: stack ? 'total' : undefined,
           areaStyle : chart_type === 'area' ? {} : undefined
        }
    )) : {};

    function tooltipFormatter(params: any): string {
        if (!params || params.length === 0) return '';
        console.log(params)
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
        xAxis: [
            {
                type: 'time'
            }
        ],
        yAxis: [
            {
                type: 'value',
            }
        ]
    }
     
    return (
        <EChartsReact option={option}/>

    )


}
