import { ReactElement, useContext } from "react";
import { DatasetContext } from "../DashboardPage/Page";
import { Cell, Legend, Pie, PieChart, PieLabelRenderProps, ResponsiveContainer, Tooltip } from "recharts";


interface IChartPieProps {
    dataset:string, //dataset ID
    children?:ReactElement,
    dataKey:string,
    nameKey:string,
    unit?:string,
    labelText?: (props: PieLabelRenderProps) => React.ReactNode; // retourne le contenu à mettre dans <text>
    legend?:boolean //show legend
}

export const ChartPie:React.FC<IChartPieProps> = ({dataset:dataset_id, nameKey, dataKey, unit, children, labelText, legend=true}) => {
    const datasetContext = useContext(DatasetContext)

    const dataset = datasetContext[dataset_id];
    const data = dataset?.data
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

    const defaultLabelText = ({ percent, value }: PieLabelRenderProps) => (
        <>
          {Number(Math.round((percent ?? 0) * 100)).toLocaleString()}% ({Number(Math.round(value ?? 0)).toLocaleString()}
          {unit ? ` ${unit}` : ''})
        </>
      );

    const customLabel = (props: PieLabelRenderProps) => {
        const { cx, x, y, fill } = props;
        return (
          <text x={x} y={y} fill={fill} textAnchor={x > Number(cx) ? 'start' : 'end'}>
            {labelText ? labelText(props) : defaultLabelText(props)}
          </text>
        );
    };

    return (
    <ResponsiveContainer height={324} width='100%' >
     <PieChart>
        {legend && <Legend />}
        <Tooltip />
         <Pie data={data} label={customLabel} labelLine cornerRadius={4} {...{dataKey, nameKey}} >
            {data?.map((_entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
         </Pie>
         {children}
    </PieChart>
    </ResponsiveContainer>
    )
}
