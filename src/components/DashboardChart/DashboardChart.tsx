import alasql from "alasql";
import { EChartsOption } from "echarts";
import ReactECharts from 'echarts-for-react'; 
import { useRef } from "react";
import { useChartData, useDashboardElement } from "../DashboardElement/hooks";
import deepMerge from "../../utils/deepmerge";


type EChartsSeriesTypes = ('line' | 'bar' | 'pie' | 'scatter');

interface IDashboardChartProps {
    data?: any[];
    chart_type?: EChartsSeriesTypes;  // Utiliser directement le type de SeriesOption
    sql? : string;
    echarts_option?: EChartsOption; 
    reverse_axies?:boolean
}


// Les données doivent être de la forme {axeA :   axeB : } ?

const DashboardChart: React.FC<IDashboardChartProps> = ({data, chart_type='line', reverse_axies=false, echarts_option = {}, sql}) => {
    const chartRef = useRef<any>();
    useDashboardElement({chartRef})

    const data_xy:any = sql ? alasql(sql, [data]) : data;

    useChartData({data:data_xy})

    const keys = Object.keys(data_xy[0]);

    const axis0 = {
        type: typeof data_xy[0][keys[0]] === 'number' ? 'value' : 'category',
        name: keys[0]
    }

    const axis1 = {
        type: typeof data_xy[0][keys[1]] === 'number' ? 'value' : 'category',
        name: keys[1]
    }

    const options:EChartsOption = {
        series:[
            {
                type:chart_type,
                data:data_xy.map((e:any) => 
                    reverse_axies ? 
                        [e[keys[1]], e[keys[0]]] 
                        : [e[keys[0]], e[keys[1]]]
                )
            }  
        ],
        //@ts-ignore
        xAxis:{
            ...reverse_axies ? axis1 : axis0
        },
        //@ts-ignore
        yAxis:{
            ...reverse_axies ? axis0 : axis1
        }
    }
    return (
        <ReactECharts
        option={deepMerge(options,echarts_option)} ref={chartRef} />
    )
}


export default DashboardChart;
 