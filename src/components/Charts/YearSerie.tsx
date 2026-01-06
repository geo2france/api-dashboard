
/**
 * Graphique standard pour afficher des données annuelles
 */

import { from, op } from "arquero"
import { useDataset } from "../Dataset/hooks"
import { SimpleRecord } from "../../types"
import { EChartsOption, SeriesOption } from "echarts"
import { usePalette, usePaletteLabels } from "../Palette/Palette"
import { ChartEcharts } from "./ChartEcharts"
import { useBlockConfig } from "../DashboardPage/Block"
import deepMerge from "../../utils/deepmerge"

interface IYearSerieProps {
    dataset:string
    title?:string
    yearKey:string
    valueKey:string
    secondaryValueKey?:string
    categoryKey?:string
    stack?: boolean
    yearMark?:number | string
    normalize?:boolean

    /**
     * Fonction de tri appliquée aux séries (SeriesOption) avant affichage.
     * Passée directement à `Array.sort()`.
     *
     * @example
     * // Tri alphabétique des séries par leur nom
     * seriesSort: (a, b) => a.name.localeCompare(b.name)
     */
    seriesSort? : (a: SeriesOption, b: SeriesOption) => number;
    type?: 'bar' | 'line' | 'area'
    /* Options Echarts addtionnelles */
    options?:Partial<EChartsOption>
}
export const ChartYearSerie:React.FC<IYearSerieProps> = ({dataset:dataset_id, categoryKey, valueKey, secondaryValueKey, yearKey, yearMark, stack:stack_input, title, type:chart_type='bar', normalize=false, seriesSort, options:custom_options={}}) => {
    const stack = stack_input || chart_type == 'line' ? false : true ; // Pas de stack par défaut pour le type line
    const dataset = useDataset(dataset_id)
    const data = dataset?.data
    
    let chart_data:SimpleRecord[] = []
    let distinct_cat:string[] = []

    useBlockConfig({ 
      title: title,
      dataExport: data
    })
    
    const rollupSpec: Record<string, any> = { //Construire le rollup pour 1 ou 2 valeurs
        'value': op.sum(valueKey),
    };
    if (secondaryValueKey) {
        rollupSpec['secondaryValue'] = op.sum(secondaryValueKey);
    }

    if (data && data.length > 0) {
        const grouped_data = categoryKey ? from(data).groupby(yearKey, categoryKey) //Somme par année et categorykey
                                                .rollup(rollupSpec)
                                                .groupby(yearKey).orderby(yearKey)
                                                :
                                             from(data).groupby(yearKey) //Somme par année seulement
                                            .rollup(rollupSpec)
                                            .orderby(yearKey)

                                            
        const all_years = from(data).groupby(yearKey).rollup({[yearKey]: op.any(yearKey)})
        const all_cats= categoryKey ? (from(data).groupby(categoryKey).rollup({[categoryKey]: op.any(categoryKey)})) : from([{'cat':valueKey}])
        const full = all_years.cross(all_cats) // Contient chaque annee x catégorie (pour éviter les trous)

        distinct_cat = all_cats.array(categoryKey || 'cat') as string[] // Pour générer chaque serie

        chart_data = full.join_left(
            grouped_data
            .derive({part : d => 100*d.value / op.sum(d.value)}) // Data for normalized view
            .rename({ value: valueKey, part: `${valueKey}_pct`, secondaryValue:secondaryValueKey || ''  }) // Rename to original var name
        ).objects()

        chart_data.sort((a,b) => a[yearKey] - b[yearKey])
    }

    const COLORS = usePalette({nColors:distinct_cat?.length}) || []
    const colors_labels = usePaletteLabels() 

    const series = distinct_cat.map((cat, idx) => (
        {
            name:cat,
            type:chart_type === 'area' ? 'line' : chart_type,
            data :categoryKey ? chart_data?.filter((row:SimpleRecord) => row[categoryKey] === cat)
                                            .map((row:SimpleRecord) => ([String(row[yearKey]), 
                                                                row[valueKey] || 0, 
                                                                secondaryValueKey ? row[secondaryValueKey] : undefined ,
                                                                row[`${valueKey}_pct`] 
                                                            ]))
                              : chart_data?.map((row:SimpleRecord) => ([String(row[yearKey]), 
                                                                        row[valueKey] || 0, 
                                                                        secondaryValueKey ? row[secondaryValueKey] : undefined ,
                                                                        row[`${valueKey}_pct`] ])),
            encode: {
                x: 0,   // annee
                y: normalize ? 3 : 1    // valueKey ou `${ValueKey}_pct`
            },
            itemStyle:{
                color:colors_labels.find( i => i.label.toLowerCase() === cat.toLowerCase())?.color ?? (COLORS && COLORS[idx % COLORS.length]),
           },
           stack: stack ? 'total' : undefined,
           areaStyle : chart_type === 'area' ? {} : undefined,
           markLine: idx === 0 && yearMark ? {
            symbol: 'none',
            animation: false,
            silent: true,
            data: [
              { xAxis: String(yearMark) }  
            ]
          } : undefined,
        }
    )).sort( seriesSort ) as SeriesOption[];

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
            max : normalize ? 100 : undefined,
            min : normalize ? 0 : undefined,
        },
    }
     
    return (
        <ChartEcharts notMerge option={deepMerge({}, option, custom_options)}/>
    )


}
