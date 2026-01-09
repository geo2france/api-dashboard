import { Descriptions, DescriptionsProps, Form, Layout } from "antd";
import React, { createContext, CSSProperties, ReactElement, useCallback, useContext, useEffect, useState } from "react";

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
        borderBottom: "1px solid #ccc", 
        ...style,
      }}
    >
      {children}
    </Header>
  );
};

export default Control;

/*
 * Hook  pour accéder à un control spécifique de la page
 */
export const useControl = (name: string): string | undefined => { 
  const context_controls = useContext(ControlContext);
  if (!context_controls) {
    throw new Error("useControl must be used within a ControlProvider");
  }

  const values  = context_controls.getAll();
  const value = values[name];

  return value;
};

/*
 * Hook  pour accéder à tous les controls utilisateur
 */
export const useAllControls = (): Record<string, any> => { 
  const context_controls = useContext(ControlContext);
  if (!context_controls) {
    throw new Error("useControl must be used within a ControlProvider");
  }

  const { values } = context_controls;

  return values;
};

/* Convenient function to return Options from list or Options */
export const list_to_options = (input : string[] | number[] | { label: string | number; value: string | number }[] = []):{ label: string | number ; value: string | number }[] => {
  if (input === undefined) { return []}
  return input.map((o) => {
    if (typeof o == "string" || typeof o == "number"){
      return {label:String(o), value:o}
    }
    return o
  })
}


interface IControlProps {
  children: ReactElement | ReactElement[];
}

export const DSL_Control: React.FC<IControlProps> = ({ children }) => {
  const context_controls = useContext(ControlContext);
  const [form] = Form.useForm();

  useEffect(() => {
    handleChange(form?.getFieldsValue(true)); // Appliquer les valeurs par défaut au contexte lors de l'initialisation du composant
  }, []); 


  if (!context_controls) { //Le contexte peut être nul ?
    throw new Error("useControl must be used within a ControlProvider");
  }
  const { values:_control, register:pushControl } = context_controls;


  const childrenArray = React.Children.toArray(children).filter((child) =>
    React.isValidElement(child)
  );

  //Ajout des nouvelles valeurs de controles dans le contexte de la page
  const handleChange = (changed_value: any) => {
    pushControl(changed_value);
  };

  const initialValues = Object.fromEntries(childrenArray.filter((child) => child.props.options && child.props.options.length > 0).map(
    (child) => [child.props.name, child.props.options[0].value]
  )); // Initialisé avec la première valeur de chaque option


  return (
    <Form onValuesChange={handleChange} layout="inline" initialValues={initialValues} form={form}>
      {children}
    </Form>
  );
};

//TODO : ajouter la gestion des useSearchParameters (ici au dans la Page ?)



export const ControlPreview:React.FC = ({}) => {
  const controlValues = useAllControls()

  const items:DescriptionsProps['items'] = Object.entries(controlValues).map(([key, value]) => ({
    key: key,
    label: key,
    children: <p>{value}</p>,
  }));

  return (
    <Descriptions items={items} />
  )

}


type ControlContextType = {
    values : Record<string, any>;
    register: (control: { name: string; value: any }) => void;
    clear: () => void,
    getAll : () =>  Record<string, any>
}

export const ControlContext = createContext<ControlContextType | undefined>(undefined); 


      


export const CreateControlesRegistry = () => {

      /* CONTROLS */
      const [controls, setControles] = useState<Record<string, any>>({});
      
      const pushControl = useCallback( (c: Record<string, any>) => { 
        setControles(prev => ({
            ...prev, 
            ...c
          }));
      }, []);

      const clear = useCallback(() => {
        setControles({});
      }, []);

      const getAll = useCallback(()=> {
        return controls
      }, [controls]);

      return ({
        register: pushControl,
        clear,
        getAll,
        values:controls
      })
  
}