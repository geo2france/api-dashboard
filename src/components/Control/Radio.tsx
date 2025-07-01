import { Radio as AntRadio } from 'antd';
import type { CheckboxOptionType, RadioGroupProps } from 'antd';
import { useDataset } from '../Dataset/hooks';
import { from } from 'arquero';
import { SimpleRecord } from '../../types';


// On construit les options depuis le tableau de données, utiliser pour Radio et Select
export const buildOptionsFromData = ( 
    data: SimpleRecord[],
    labelField: string = 'label',
    valueField: string = 'value'
  ): CheckboxOptionType[] => {

    const t = from(data);

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
    dataset?: string;
    options?: CheckboxOptionType[];
    labelField?:string,
    valueField?:string
  };

export const Radio: React.FC<ExtendedRadioGroupProps> = ({
    dataset:datasetSource,
    options = [],
    labelField = 'label',
    valueField = 'value',
    ...rest
  }) => {
    // Ici tu pourrais fetcher les données depuis un contexte/dataset si datasetSource est présent
  
    const data = useDataset(datasetSource)?.data
    const data_options = options || data && buildOptionsFromData(data,labelField, valueField )
    const initial_value = data_options && data_options?.length > 0 && data_options[0].value

    if (data === undefined){
        return <></>
      }

    return (
      <AntRadio.Group options={data_options} defaultValue={initial_value} {...rest} />
    );
  };