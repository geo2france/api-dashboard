import type {  SelectProps } from 'antd';
import { useDataset } from '../Dataset/hooks';
import { buildOptionsFromData } from './Radio';
import NextPrevSelect from '../NextPrevSelect/NextPrevSelect';
import { list_to_options } from './Control';




type ExtendedSelectProps = Omit<SelectProps<any>, 'options'> & {
    dataset?: string;
    options?: { label: string ; value: string }[] | string[];
    initial_value? : string,
    labelField?:string,
    valueField?:string,
    name?:string,
    label?:string,
    arrows?:boolean,
    reverse?:boolean
  };


// TODO : a fusionner avec NextPrevSelect pour n'avoir qu'un seul composant
// Actuellement, Select apporte seulement le fait de choisir les valeurs depuis un
export const Select: React.FC<ExtendedSelectProps> = ({
    name,
    dataset:datasetSource,
    options:input_options = [],
    labelField = 'label',
    valueField = 'value',
    arrows = false,
    reverse = false,
    label,
    initial_value:initial_value_in,
    ...rest
  }) => {
    
    const options = list_to_options(input_options);

    const data = useDataset(datasetSource)?.data
    const data_options = datasetSource ? (data && buildOptionsFromData(data,labelField, valueField )) : options

    const myOptions = data_options && data_options.map((o) => {
      if (typeof o == "string"){
        return {label:o, value:String(o)}
      }
      return o
    })

    const initial_value = initial_value_in || myOptions && myOptions?.length > 0 && myOptions[0].value ;

    if (data_options === undefined){
      return <></>
    }

    const value =  initial_value == null || initial_value == false
            ? undefined
            : initial_value
    return (
      <NextPrevSelect
        name={name}
        label={label ?? name}
        options={data_options}
        defaultValue={ value }
        value={ value }
        arrows={arrows}
        reverse={reverse}
        optionFilterProp="label"
        {...rest}
      />
    );
  };