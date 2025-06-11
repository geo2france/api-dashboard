import { Form, Layout } from "antd";
import React, { CSSProperties, ReactElement, useContext } from "react";
import { ControlContext } from "../DashboardPage/Page";

const { Header } = Layout;

interface IControlProps {
  children: ReactElement | ReactElement[];
  style?: CSSProperties;
}

/*
 * Composant destiné à recevoir un Form avec les contrôles de la page
 */
const Control: React.FC<IControlProps> = ({ children, style = {} }) => {
  return (
    <Header
      style={{
        padding: 12,
        position: "sticky",
        top: 0,
        zIndex: 600, // maplibre top zIndex if 500
        backgroundColor: "#fff",
        height: "auto",
        width: "100%",
        ...style,
      }}
    >
      {children}
    </Header>
  );
};

export default Control;

/*
 * Hook personnalisé pour accéder et mettre à jour un contrôle spécifique de la page
 */
export const useControl = (name: string): [any, (control: any) => void] => {
  const context_controls = useContext(ControlContext);

  if (!context_controls) {
    throw new Error("useControl must be used within a ControlProvider");
  }

  const { values, pushValue } = context_controls;

  const value = values[name];

  return [value, pushValue];
};

interface IControlProps {
  children: ReactElement | ReactElement[];
}

export const DSL_Control: React.FC<IControlProps> = ({ children }) => {
  const [_control, pushControl] = useControl("");

  const childrenArray = React.Children.toArray(children).filter((child) =>
    React.isValidElement(child)
  );

  //Ajout des nouvelles valeurs de controles dans le contexte de la page
  const handleChange = (changed_value: any) => {
    pushControl(changed_value);
  };

  return (
    <Form onValuesChange={handleChange}>
      {childrenArray.map((child, idx) => (
        <Form.Item key={idx} name={child.props.name} label={child.props.name}>
          {child}
        </Form.Item>
      ))}
    </Form>
  );
};

//TODO : ajouter la gestion des useSearchParameters (ici au dans la Page ?)
