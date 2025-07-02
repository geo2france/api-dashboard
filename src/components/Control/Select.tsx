import type {  CheckboxOptionType, SelectProps } from 'antd';
import { useDataset } from '../Dataset/hooks';
import { buildOptionsFromData } from './Radio';
import NextPrevSelect from '../NextPrevSelect/NextPrevSelect';




type ExtendedSelectProps = {
    dataset?: string;
    options?: CheckboxOptionType[] | string[] | number[];
    initial_value? : string | number,
    labelField?:string,
    valueField?:string,
    name?:string,
    arrows?:boolean
  };


// TODO : a fusionner avec NextPrevSelect pour n'avoir qu'un seul composant
// Actuellement, Select apporte seulement le fait de choisir les valeurs depuis un dataset
export const Select: React.FC<ExtendedSelectProps> = ({
    name,
    dataset:datasetSource,
    options = [],
    labelField = 'label',
    valueField = 'value',
    arrows = false,
    initial_value:initial_value_in
  }) => {
    
    const data = useDataset(datasetSource)?.data
    const data_options = datasetSource ? (data && buildOptionsFromData(data,labelField, valueField )) : options

    const myOptions:SelectProps['options'] = data_options && data_options.map((o) => {
      if (typeof o == "string" || typeof o == "number"){
        return {label:o, value:o}
      }
      return o
    })

    const initial_value = initial_value_in || myOptions && myOptions?.length > 0 && myOptions[0].value ;

    if (data_options === undefined){
      return <></>
    }

    return (     
       <NextPrevSelect name={name} options={data_options} defaultValue={initial_value == null || initial_value == false ? undefined : initial_value} arrows={arrows} />
    );
  };