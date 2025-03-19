import { Layout, Divider, Typography } from "antd";
import { CSSProperties, useState } from "react";
import { grey } from "@ant-design/colors";

import { UpOutlined, DownOutlined } from "@ant-design/icons";
import { Partner } from "../../types";

const { Text, Link } = Typography;

interface DbFooterProps {
    brands?: Partner[];
    db_logo: string;
}

export const DasbhoardFooter: React.FC<DbFooterProps> = ({brands, db_logo}) => {
  const [isCollapsed, setIsCollapsed] = useState(window.innerWidth < 768 ? true : false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };


  const style_img: CSSProperties = {
    height: "60px",
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
        height: isCollapsed ? "0px" : "150px", 
        transition: "height 0.5s ease-in-out",
        overflow: "hidden",
        borderTop: "1px solid #ccc", 
        zIndex: 999999, // maplibre top zIndex if 99999
      }}
    >
      {/* Texte affiché uniquement lorsque le footer est rétracté */}
      {isCollapsed && (
        <div style={{
          color: "#000",
          fontSize: "14px",
          marginTop:-15,
        }}>
          <Link href="https://odema-hautsdefrance.org" target="_blank">
            <Text>Observatoire déchets et matières des Hauts-de-France</Text>
          </Link>
        </div>
      )}

      {/* Logos et contenu du footer affichés lorsque déplié */}
      <div style={{ display: isCollapsed ? "none" : "block", padding: "10px 0"}}>
        <a href="/">
          <img style={style_img} src={db_logo} alt="Odema" />
        </a>
        <Divider
          type="vertical"
          style={{ height: "30px", backgroundColor: grey[2] }}
        />
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
