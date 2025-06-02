import React from 'react'
import { Typography } from "antd"
import {  ReactElement } from "react"
import FlipCard from "../FlipCard/FlipCard";

const { Text } = Typography;

export interface KeyFigureProps {
    name?:string,
    description?:string,
    value?:number|string,
    unit?:string,
    sub_value?:number|string,
    icon?:ReactElement,
    digits?:number
}

/**
 * Composant permettant d'afficher un chiffre clé.
 * Si une description est fournie, le composant "flip" pour montrer la description
 * L'utilisateur peut aussi fournir une valeur de référence, généralement la valeur régionale ou nationale
 */
const KeyFigure: React.FC<KeyFigureProps> = ({ name, description, value, unit, sub_value, icon, digits }) => {

    return (
        <FlipCard title={name} information={description}>
          <div style={{ textAlign: "center", marginTop: 10 }}>
            <span style={{ fontSize: 24 }}>
              {icon} {value ? value.toLocaleString(undefined,{maximumFractionDigits:digits}) : '-' } {unit}
            </span>{" "}
            <span style={{ fontSize: 18 }}>
              <br />
              <Text type="secondary">{sub_value} </Text>
            </span>
          </div>

          </FlipCard>
    );
};

export default KeyFigure;