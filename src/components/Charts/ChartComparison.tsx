import { EChartsOption, LabelFormatterCallback } from "echarts";
import { useDataset, useDatasetInput } from "../Dataset/hooks";
import { ChartEcharts, useBlockConfig, usePalette, usePaletteLabels } from "../../dsl";
import { SimpleRecord } from "../../types";
import { from, op } from "arquero";
import deepMerge from "../../utils/deepmerge";

type labelType = "percent" | "value" | "none"

export interface ChartComparisonProps {
    /** Identifiant du dataset */
    dataset?:useDatasetInput;

    /** Nom de la colonne qui contient les valeurs numériques */
    valueKey:string;

    /** Nom de la colonne qui contient les catégories */
    nameKey:string;

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
unit,
singleColor=false,
label, 
option:custom_option={}}:ChartComparisonProps) => {

    const dataset = useDataset(dataset_id)
    const data = dataset?.data

    useBlockConfig({ 
        title: title,
        dataExport: data
    })


    const chart_data1: SimpleRecord[] =
    data && data.length > 0
        ? from(data.filter( e => e[valueKey]) )
            .groupby(nameKey)
            .rollup({ value: op.sum(valueKey) })
            .orderby('value')
            .objects()
            .map((d: any) => ([
            d[nameKey],
            d.value,
            ]))
        : [];

    const colors_libels = usePaletteLabels()
    const colors_palette = usePalette({nColors:chart_data1.length})  || ['#d4d4d4']

    const total = chart_data1?.reduce((sum, item) => sum + item[1], 0);

    const labelFormatter: LabelFormatterCallback = (v) => {
        if (!label || label == 'none') return '';
        const value = (v?.value as number[])?.[1];

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

            default:
                return '';
        }
    };

    const option:EChartsOption = {
        tooltip:{
            show: true,
            valueFormatter: (v) => `${v?.toLocaleString(undefined, {maximumFractionDigits:0})} t`
        },
        series:{
            type: 'bar',
            data: chart_data1?.map( r => [r[0], r[1] ]),
            label:{
                show: true,
                position: 'right',
                formatter: labelFormatter
            },
            encode:{
                x:1,
                y:0
            },
            itemStyle: {
                color: (p:any) => singleColor? colors_palette?.[0] : colors_libels.find(c => c.label == p.data[0])?.color || colors_palette?.[p.dataIndex]
            },
        },
        xAxis: {type:'value', axisLabel:{formatter: (v) => `${(v).toLocaleString()} ${unit}` } },
        yAxis: {type: 'category', }
    }

    return <ChartEcharts option={deepMerge(option, custom_option)} />
}