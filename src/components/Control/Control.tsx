import { Layout } from "antd"
import { CSSProperties, ReactElement } from "react"

const {Header} = Layout

interface IControlProps {
    children: ReactElement | ReactElement[];
    style?:CSSProperties
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