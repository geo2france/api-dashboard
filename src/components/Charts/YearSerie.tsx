
/**
 * Graphique standard pour afficher des données annuelles
 */

import { Bar, BarChart, ComposedChart, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis } from "recharts"
import { from, op } from "arquero"
import { useDataset } from "../Dataset/hooks"
import { useControl } from "../Control/Control"
import { CategoricalChartProps } from "recharts/types/chart/generateCategoricalChart"

interface IYearSerieProps {
    dataset:string
    title?:string
    yearControl?:string
    yearKey:string
    valueKey:string
    categoryKey?:string
    stack?: boolean
    type?: 'bar' | 'line'
}
export const ChartYearSerie:React.FC<IYearSerieProps> = ({dataset:dataset_id, categoryKey, valueKey, yearKey, stack=true, type:chart_type='bar', yearControl='year'}) => {

    const dataset = useDataset(dataset_id)
    const data = dataset?.data
    const current_year = useControl(yearControl) 

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
                                            .groupby(yearKey)
                                            .pivot(categoryKey,valueKey ).objects()
                                            :
                                        data &&  from(data).groupby(yearKey) //Somme par année seulement
                                        .rollup({[valueKey]:op.sum(valueKey)})
                                        .objects()


    const distinct_cat:string[] | undefined = categoryKey ? 
        data && (from(data).rollup({cat: op.array_agg_distinct(categoryKey)}).object() as { cat: string[] } ).cat
        :
        [valueKey]

    console.log(distinct_cat)
    const CustomTick = (props:any) => { //Rechart ne fournis pas le type pour ca ?
        const { payload, x, y} = props
        const isCurrentYear = payload.value == current_year;
        return (
          <text
            x={x}
            y={y + 10}
            textAnchor="middle"
            fontWeight={isCurrentYear ? 'bold' : 'normal'}
          >
            {payload.value}
          </text>
        );
      };

    const ChartCustomType:React.FC<CategoricalChartProps> = (props) => {
        // Ajouter area ?
        if (chart_type == 'bar') {
            return <BarChart {...props}/>
        } else if (chart_type == 'line') {
            return <LineChart {...props}/>
        } else {
            return <ComposedChart {...props} /> // Type générique de rechart en fallback
        }
    }
     
    return (
        <ResponsiveContainer height={324} width='100%' >
            <ChartCustomType data={chart_data}>
                <Legend />
                <Tooltip />
                <XAxis 
                    dataKey={yearKey}
                    tick={current_year ? CustomTick : undefined}
                />
                {chart_type == 'bar' && distinct_cat?.map((cat, idx) => 
                            <Bar key={idx} dataKey={cat} stackId={stack ? 'a' : undefined} fill={COLORS[idx % COLORS.length]} /> 
                )}
                {chart_type == 'line' && distinct_cat?.map((cat, idx) => 
                   <Line key={idx} dataKey={cat} stroke={COLORS[idx % COLORS.length]}  /> 
                )}

            </ChartCustomType>
        </ResponsiveContainer>
    )


}
