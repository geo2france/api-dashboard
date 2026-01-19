import { Radio as AntRadio, Form } from 'antd';
import type { RadioGroupProps } from 'antd';
import { useDataset } from '../Dataset/hooks';
import { from } from 'arquero';
import { SimpleRecord } from '../../types';
import { list_to_options } from './Control';


// On construit les options depuis le tableau de données, utiliser pour Radio et Select
export const buildOptionsFromData = ( 
    data: SimpleRecord[],
    labelField: string = 'label',
    valueField: string = 'value'
  ): { label: string ; value: string }[] => {

    const t = from(data);

    if (data.length <= 0){ //Avoir arquero error on empty data
      return []
    }

    return (
      t.select(labelField, valueField)
        .dedupe(valueField)
        .objects()
        .map((row : { [key: string]: any }) => ({
          label: row[labelField],
          value: row[valueField],
        }))
    );
  }

type ExtendedRadioGroupProps = RadioGroupProps & {
    name?: string;
    dataset?: string;
    options?: { label: string ; value: string }[] | string[];
    labelField?:string,
    valueField?:string,
    initalValue?:string
  };

export const Radio: React.FC<ExtendedRadioGroupProps> = ({
    dataset:datasetSource,
    options:input_options = [],
    labelField = 'label',
    valueField = 'value',
    name,
    initalValue:initalValue_input,
    ...rest
  }) => {
    // Ici tu pourrais fetcher les données depuis un contexte/dataset si datasetSource est présent
  
    const data = useDataset(datasetSource)?.data
    const options = list_to_options(input_options);

    const data_options = options || data && buildOptionsFromData(data,labelField, valueField )
    const initial_value = initalValue_input ? initalValue_input : data_options && data_options?.length > 0 && data_options[0].value

    if (data === undefined && options===undefined ){
        return <></>
      }

    return (
      <Form.Item name={name} label={name} initialValue={initial_value}>
        <AntRadio.Group options={data_options} value={initial_value} {...rest} />
      </Form.Item>
    );
  };