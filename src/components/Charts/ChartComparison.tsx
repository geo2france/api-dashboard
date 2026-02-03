import { EChartsOption, LabelFormatterCallback, SeriesOption } from "echarts";
import { useDataset, useDatasetInput } from "../Dataset/hooks";
import { ChartEcharts, useBlockConfig, usePalette, usePaletteLabels } from "../../dsl";
import { SimpleRecord } from "../../types";
import { from, op } from "arquero";
import deepMerge from "../../utils/deepmerge";

type labelType = "percent" | "value" | "category" | "none" 

export interface ChartComparisonProps {
    /** Identifiant du dataset */
    dataset?:useDatasetInput;

    /** Nom de la colonne qui contient les valeurs numériques */
    valueKey:string;

    /** Nom de la colonne qui contient les catégories */
    nameKey:string;

    /** Type de graphique */
    chartType?: 'bar' | 'pie' | 'donut'

    /** Unité à afficher */
    unit?:string;

    /** Titre du graphique */
    title?:string;

    /** Valeur à afficher en étiquette */
    label?: labelType

    /** Couleur unique pour le graphique */
    singleColor?: boolean
    
    /** Options suplémentaires passées à Echarts 
     * https://echarts.apache.org/en/option.html
    */
    option?:EChartsOption;
}

/** Composant de visualisation destiné à comparer des catégories au sein d’un dataset. */
export const ChartComparison:React.FC<ChartComparisonProps> = ({
dataset:dataset_id, 
title, 
nameKey, 
valueKey, 
chartType='bar',
unit,
singleColor=false,
label: label_in, 
option:custom_option={}}:ChartComparisonProps) => {

    const dataset = useDataset(dataset_id)
    const data = dataset?.data

    useBlockConfig({ 
        title: title,
        dataExport: data
    })

    // Label par défaut selon le type de graphique
    const label:labelType = label_in ?? ( (chartType === 'pie' || chartType === 'donut' ) ? 'category' : 'none');

    const chart_data1: SimpleRecord[] =
    data && data.length > 0
        ? from(data.filter( e => e[valueKey]) )
            .groupby(nameKey)
            .rollup({ value: op.sum(valueKey) })
            .orderby('value')
            .objects()
            .map((d: any) => ([
                d[nameKey], //0
                d.value,  //1
            ]))
        : [];

    const colors_libels = usePaletteLabels()
    const colors_palette = usePalette({nColors:chart_data1.length})  || ['#d4d4d4']

    // Total, utilisé pour les pourcentage
    const total = chart_data1?.reduce((sum, item) => sum + item[1], 0);

    const labelFormatter: LabelFormatterCallback = (v) => {
        if (!label || label == 'none') return '';

        const value = (chartType === 'pie' || chartType === 'donut' ) ?
             v?.value as number 
             : (v?.value as number[])?.[1];
             
        const name =  v?.name;

        switch (label) {
            case 'percent': {
                return (
                    (100 * value / total).toLocaleString(undefined, {
                    maximumFractionDigits: 0,
                    }) + ' %'
                );
                }

            case 'value':
                return `${value.toLocaleString(undefined, {
                    maximumFractionDigits: 0,
                    })}  ${unit || ''}`;

            case 'category':
                return name

            default:
                return '';
        }
    };

    const serie_common = {
        itemStyle: {
            color: (p:any) => singleColor? colors_palette?.[0] : 
                colors_libels.find(c => c.label == p.data[0] || c.label == p.name )?.color || colors_palette?.[p.dataIndex]
        },
    }
    const serie:SeriesOption = chartType == 'bar' ?
        {
            type: 'bar',
            data: chart_data1?.map( r => [r[0], r[1] ]),
            label:{
                show: label && label !== 'none',
                position: 'right',
                formatter: labelFormatter
            },
            encode:{
                x:1,
                y:0
            },
            ...serie_common,
        } :
        {
            type:'pie',
            radius: chartType == 'donut' ? ['40%', '75%'] : [0, '75%'],
            data: chart_data1?.map( r => ({ name: r[0], value: r[1]})),
            label:{
                show: label && label !== 'none',
                formatter: labelFormatter
            },
            ...serie_common,

        }

    const option:EChartsOption = {
        tooltip:{
            show: true,
            valueFormatter: (v) => `${v?.toLocaleString(undefined, {maximumFractionDigits:0})} t`
        },
        yAxis: {show: chartType == 'bar', type: 'category' },
        xAxis: { show: chartType == 'bar', type:'value', axisLabel:{formatter: (v:any) => `${(v).toLocaleString()} ${unit}` } },
        series: [ serie ],
    }

    return <ChartEcharts option={deepMerge(option, custom_option)} />
}