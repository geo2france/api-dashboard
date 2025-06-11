import {Select as AntdSelect} from 'antd'
import type {  CheckboxOptionType,  SelectProps } from 'antd';
import { useDataset } from '../Dataset/hooks';
import { buildOptionsFromData } from './Radio';




type ExtendedSelectProps = SelectProps & {
    dataset?: string;
    options?: CheckboxOptionType[];
    labelField?:string,
    valueField?:string,
    name?:string
  };

export const Select: React.FC<ExtendedSelectProps> = ({
    dataset:datasetSource,
    options = [],
    labelField = 'label',
    valueField = 'value',
    ...rest
  }) => {
    // Ici tu pourrais fetcher les données depuis un contexte/dataset si datasetSource est présent
  
    const data = useDataset(datasetSource)?.data

    const data_options = data && buildOptionsFromData(data,labelField, valueField )
    const initial_value = data_options && data_options?.length > 0 && data_options[0].value

    if (data === undefined){
      return <></>
    }
    return (
      <AntdSelect showSearch optionFilterProp={labelField} defaultValue={initial_value} options={data_options} {...rest} />
    );
  };