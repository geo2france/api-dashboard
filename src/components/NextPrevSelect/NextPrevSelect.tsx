import React from 'react'
import { CaretLeftOutlined, CaretRightOutlined } from "@ant-design/icons"
import { Button, ConfigProvider, Flex, Select, SelectProps} from "antd"
import { CSSProperties, useEffect, useState } from "react"


interface NextPrevSelectProps  {
    options:SelectProps['options']
    style?:CSSProperties
    defaultValue?:string | number
    value?:string | number
    onChange?: (value: string | number) => void;
    reverse?:boolean // False : next = goDown
    name?:string
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
  options = [],
  style,
  value,
  defaultValue,
  onChange,
  reverse = false,
}) => {
  const [current_value, setCurrent_value] = useState<string | number | undefined>(value);

  useEffect(() => {
    setCurrent_value(value)
  },[value])

  const current_index = options?.findIndex((o) => o.value == current_value);

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
    onChange && onChange(v);
  }

  return (
    <Flex style={style}>
      <Button style={style_button_left} onClick={() => handleChange(previous())} disabled={isFirst()}>
        <CaretLeftOutlined />
      </Button>

      <ConfigProvider theme={{ components: { Select: { borderRadius: 0, }, }, }} > {/* Radius zero uniquement pour ce select*/}
        <Select
          className="nextPrevSelect"
          options={options}
          style={{...style}}
          value={current_value}
          defaultValue={defaultValue}
          onChange={handleChange}
        />
      </ConfigProvider>

      <Button style={style_button_right} onClick={() => handleChange(next())} disabled={isLast()}>
        <CaretRightOutlined />
      </Button>
    </Flex>
  );
};

export default NextPrevSelect;
