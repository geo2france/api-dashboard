import { Layout, Typography } from "antd";
import { CSSProperties, useContext, useState } from "react";

import { UpOutlined, DownOutlined } from "@ant-design/icons";
import { Partner } from "../../types";
import { AppContext } from "./DashboardApp";

const { Text } = Typography;

interface DbFooterProps {
    brands?: Partner[];
}

export const DasbhoardFooter: React.FC<DbFooterProps> = ({brands}) => {
  const [isCollapsed, setIsCollapsed] = useState(window.innerWidth < 768 ? true : false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const app_context = useContext(AppContext)

  const style_img: CSSProperties = {
    maxHeight: "60px",
    marginRight: "20px",
  };

  return (
    <Layout.Footer
      style={{
        textAlign: "center",
        color: "#fff",
        backgroundColor: "#fff",
        bottom: "0",
        position: "sticky",
        right: "0",
        width: "100%",
        padding:2,
        height: isCollapsed ? "40px" : "80px", 
        transition: "height 0.5s ease-in-out",
        overflow: "hidden",
        borderTop: "1px solid #ccc", 
        zIndex: 600, // maplibre top zIndex if 500
      }}
    >
      {/* Texte affiché uniquement lorsque le footer est rétracté */}
      {isCollapsed && (
            <Text type="secondary">{app_context?.title} - {app_context?.subtitle}</Text>
      )}

      {/* Logos et contenu du footer affichés lorsque déplié */}
      <div style={{ display: isCollapsed ? "none" : "block", padding: "10px 0"}}>
        {brands?.map((p:Partner) => (
          <a href={p.url} key={p.name}>
            <img style={style_img} src={p.logo} alt={p.name} />
          </a>
        ))}
      </div>

      {/* Bouton carré de contrôle pour afficher ou cacher le footer */}
      <div
        style={{
          position: "absolute",
          bottom: "5px",
          right: "10px",
          cursor: "pointer",
          zIndex: 1001,
          backgroundColor: "#dead8f",
          padding: "5px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "4px",
        }}
        onClick={toggleCollapse}
      >
        {isCollapsed ? (
          <UpOutlined style={{ fontSize: "16px", color: "#fff" }} />
        ) : (
          <DownOutlined style={{ fontSize: "16px", color: "#fff" }} />
        )}
      </div>
    </Layout.Footer>
  );
};
