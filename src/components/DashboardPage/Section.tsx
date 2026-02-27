
import { Col, Row } from "antd";
import {Children, FC, isValidElement, ReactNode} from "react";
import { DSL_ChartBlock } from "./Block";


export interface SectionProps {
    /** Titre de la section, doit être unique */
    title: string

    /** Composants visibles (dataviz, carto) ou logiques (dataset, palette) */
    children?: ReactNode

    /** Icone de la section. Composant ou nom (iconify) de l'icon */
    icon?: ReactNode | string

    /** Nombre de colonnes. */
    columns?: number
}

export const Section: FC<SectionProps> = ({ children, columns=2 }) => {
  const childrenArray = Children.toArray(children).filter(isValidElement);
  return (
    <Row gutter={[8, 8]} style={{ margin: 0 }}>
      {childrenArray.map((component, idx) => (
        <Col xl={24 / columns} xs={24} key={idx}>
          <DSL_ChartBlock>{component}</DSL_ChartBlock>
        </Col>
      ))}
    </Row>
  );
};