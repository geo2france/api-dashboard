import React from 'react'
import { CaretLeftOutlined, CaretRightOutlined } from "@ant-design/icons"
import { Button, ConfigProvider, Flex, Form, FormInstance, Select, SelectProps } from "antd"
import { CSSProperties, useEffect, useState } from "react"
import { list_to_options } from '../Control/Control'


  // Update field and trigger form OnValueChange, thanks to : https://github.com/ant-design/ant-design/issues/23782#issuecomment-2114700558
  const updateFieldValue = (form: FormInstance, name: string, value: any) => {
    (form as any).getInternalHooks('RC_FORM_INTERNAL_HOOKS').dispatch({
      type: 'updateValue',
      namePath: [name],
      value: value
    })
  }

type NextPrevSelectProps = SelectProps & {
    options:{ label: string ; value: string | number }[] | string[] | number[]
    style?:CSSProperties
    defaultValue?:string | number
    value?:string | number
    onChange?: (value: string | number) => void;
    reverse?:boolean // False : next = goDown
    name?:string
    arrows?:boolean
  }

const style_button_left:CSSProperties = {
  borderRadius: 0,
  borderTopLeftRadius: 4,
  borderBottomLeftRadius: 4,
  borderRight:0,
}

const style_button_right:CSSProperties = {
  borderRadius: 0,
  borderTopRightRadius: 4,
  borderBottomRightRadius: 4,
  borderLeft:0,
}

const NextPrevSelect: React.FC<NextPrevSelectProps> = ({
  name,
  options: input_options = [],
  style,
  value,
  defaultValue,
  onChange,
  reverse = false,
  arrows = true,
  ...rest
}) => {
  const [current_value, setCurrent_value] = useState<string | number | undefined>(value);
  const form = Form.useFormInstance();

  useEffect(() => {
    setCurrent_value(value)
  },[value])

  const options = list_to_options(input_options);

  const current_index = options?.findIndex((o) => o.value == form?.getFieldValue(name) || o.value == current_value );

  const next = () =>
    reverse
      ? options[current_index - 1].value!
      : options[current_index + 1].value!;

  const previous = () =>
    reverse
      ? options[current_index + 1].value!
      : options[current_index - 1].value!;

  const isFirst = () =>
    reverse ? current_index == options.length - 1 : current_index == 0;

  const isLast = () =>
    reverse ? current_index == 0 : current_index == options.length - 1;

  const handleChange = (v:string | number) => {
    setCurrent_value(v);
    name && form && updateFieldValue(form,name, v)
    onChange && onChange(v);
  }


  return (
      <Flex style={style} {...{name:name}}>
      { arrows && <Button style={style_button_left} onClick={() => handleChange(previous())} disabled={isFirst()}>
          <CaretLeftOutlined /> 
        </Button> }

        <ConfigProvider theme={ arrows ? { components: { Select: { borderRadius: 0, }, }, } : undefined} > {/* Radius zero uniquement pour ce select*/}
          <Form.Item name={name} label={name} noStyle={arrows} initialValue={defaultValue} shouldUpdate >
            <Select
              className="nextPrevSelect"
              options={options}
              style={{...style}}
              value={current_value}
              defaultValue={defaultValue}
              onChange={handleChange}
              {...rest}
            />
          </Form.Item>
        </ConfigProvider>

        { arrows && <Button style={style_button_right} onClick={() => handleChange(next())} disabled={isLast()}>
          <CaretRightOutlined />
        </Button> }
      </Flex>
  );
};

export default NextPrevSelect;
