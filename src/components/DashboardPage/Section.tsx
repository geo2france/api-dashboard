
import { Col, Row } from "antd";
import React, {isValidElement} from "react";
import { DSL_ChartBlock } from "./Block";

export interface SectionProps {
    title: string
    children?: React.ReactElement | React.ReactElement[]
}

export const Section: React.FC<SectionProps> = ({ children }) => {
  const columns = 2;
  const childrenArray = React.Children.toArray(children).filter(isValidElement);

  return (
    <Row gutter={[8, 8]} style={{ margin: 16 }}>
      {childrenArray.map((component, idx) => (
        <Col xl={24 / columns} xs={24} key={idx}>
          <DSL_ChartBlock>{component}</DSL_ChartBlock>
        </Col>
      ))}
    </Row>
  );
};