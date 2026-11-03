
import { Col, Masonry, Row } from "antd";
import {Children, FC, isValidElement, ReactNode} from "react";
import { DSL_ChartBlock } from "./Block";

export type LayoutType = 'grid' | 'masonry';

export interface SectionProps {
    /** Titre de la section, doit être unique */
    title: string

    /** Composants visibles (dataviz, carto) ou logiques (dataset, palette) */
    children?: ReactNode

    /** Icone de la section. Composant ou nom (iconify) de l'icon */
    icon?: ReactNode | string

    /** Nombre de colonnes. */
    columns?: number

    /** Mise en page. Grid (grille) par défaut */
    layout?: LayoutType
}

export const Section: FC<SectionProps> = ({ 
  children, 
  columns=2, 
  layout='grid' // devnote : contexte de page à créer, pour appliquer  par défaut le layout de la page
}) => {

  const childrenArray = Children.toArray(children).filter(isValidElement);

  if (layout === 'masonry') {

    return (
      <Masonry 
        columns={ columns }
        gutter={ [8, 8] }
        items= { childrenArray.map((component, idx) => (
                { 
                  key: idx,
                  data:component,
                  children: (  <DSL_ChartBlock key={idx}>{component}</DSL_ChartBlock>)
                }      
        ))}
      />
    )

  }
  else { // grid

    return (
      <Row gutter={[8, 8]} style={{ margin: 0 }}>
        {childrenArray.map((component, idx) => {
          const size = isValidElement(component) && typeof (component.props as { size?: unknown }).size === "number" ? 
              (component.props as { size?: number }).size! : 1;
          const children_size =  Math.min(columns, size )
          const span = Math.round( (24 / columns) * children_size )
          
          return (
              
              <Col xl={ span } xs={24} key={idx}>
                <DSL_ChartBlock>{component}</DSL_ChartBlock>
              </Col>
            )
        })}
      </Row>
    );

  };
};