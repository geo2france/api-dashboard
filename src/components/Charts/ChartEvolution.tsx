import { SimpleRecord } from "../../types";
import { from, op } from "arquero";
import deepMerge from "../../utils/deepmerge";
import { EChartsOption, SeriesOption } from "echarts";
import { useBlockConfig } from "../DashboardPage/Block";
import { ChartEcharts, useDataset } from "../../dsl";
import { datasetInput } from "../Dataset/hooks";


export interface ChartEvolutionProps {
    /** Identifiant du dataset */
    dataset?:datasetInput;

    /** Nom de la colonne qui contient les valeurs numériques */
    valueKey:string;

    /** Nom de la colonne qui contient les catégories */
    nameKey?:string;

    /** Colonne qui contient la date ou année */
    timeKey:string;

    /** Type de graphique */
    chartType?: 'bar' | 'line' | 'area'

    /** Unité à afficher */
    unit?:string;

    /** Titre du graphique */
    title?:string;

    /** Empiler les valeurs ? */
    stack?:boolean

    /** Afficher un marquer sur la  ligne de temps */
    timeMarker?: number | string
    
    /** Options suplémentaires passées à Echarts 
     * https://echarts.apache.org/en/option.html
    */
    option?:EChartsOption;
}


/** Composant de visualisation permettant de montrer l'évolution d'une valeur au cours du temps.
 * La valeur peut-être décomposée en plusieurs catégories
 */
export const ChartEvolution:React.FC<ChartEvolutionProps> = ({
dataset:dataset_id, 
title, 
nameKey,
timeKey,
valueKey, 
chartType='bar',
stack:stack_in,
timeMarker,
unit,
option:custom_option={}}:ChartEvolutionProps) => {

    const dataset = useDataset(dataset_id)
    const data = dataset?.data

    useBlockConfig({ 
        title: title,
        dataExport: data
    })

    // Devnote : ajouter une propriété "timePrecision" ? (year, month, day, etc..)
    // Ceci pourrait permettre aussi d'aggréger les données selon la précision souhaité
    const first_time = data?.[0]?.[timeKey];
    const yearMode = (typeof first_time === 'number' || isNaN(Number(first_time))== false)

    const stack = stack_in ?? (chartType !== 'line');


    const chart_data1: SimpleRecord[] =
        data && data.length > 0
            ? from(data.filter( e => e[valueKey]) )
                .groupby(nameKey ? [nameKey, timeKey] : timeKey )
                .rollup({ value: op.sum(valueKey) })
                .orderby(timeKey)
                .objects()
                .map((d: any) => ([
                    String(d[timeKey]), 
                    d.value, 
                    nameKey ? d[nameKey] : valueKey // Si pas de dimension "cat", on utilise le nom la colonne de valeur
                ]))
            : [];

    const cat =  nameKey ?
                     data?.length ? from(data).select(nameKey).dedupe().array(nameKey) as string[] : undefined
                 : [ valueKey ] // Nom de la série unique

    const series:SeriesOption[] = cat?.map( (c, idx) => ({
        type: chartType === "area" ? 'line' : chartType,
        name: c,
        data: chart_data1.filter( row => row[2] == c),
        stack:stack ? 'total' : undefined,
        connectNulls : true, 
        areaStyle : chartType === 'area' ? {} : undefined,
        symbolSize:  chartType === 'area' ? 2 : chartType === 'line' ? 4 : undefined,
        markLine: idx === 0 && timeMarker ? {
            symbol: 'none',
            animation: false,
            silent: true,
            data: [
              { xAxis: String(timeMarker) }  
            ]
          } : undefined,
        
    })) || []
  
    const option:EChartsOption = {
        legend: {
            show:true,
        },
        tooltip:{
            show: true,
            trigger: 'axis',
            axisPointer:{ 
                // N'afficher que l'année (au lieu de la date du 1er janvier) 
                label:{formatter: yearMode ? (p) => String(new Date(p.value).getUTCFullYear()) ?? `` : undefined }}, 
            valueFormatter: (v) => `${v?.toLocaleString(undefined, {maximumFractionDigits:0})} ${unit ?? ''}`
        },
        yAxis: {show: true, type: 'value' },
        xAxis: {show: true, type: 'time' },
        series:  series ,
    }

    return <ChartEcharts notMerge option={deepMerge(option, custom_option)} />
}