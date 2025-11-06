import { Button, Layout, Typography } from "antd";
import { CSSProperties, useContext, useState } from "react";
import Slider from "@ant-design/react-slick";

import { UpOutlined, DownOutlined } from "@ant-design/icons";
import { Partner } from "../../types";
import { AppContext } from "./DashboardApp";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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
    maxWidth: "100%",
    margin: "auto"
  };

  const nbBrands = brands?.length || 0

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
        padding: 2,
        height: "auto",
        minHeight: "40px",
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
      <div style={{display: isCollapsed ? "none" : "block", padding: "10px 0"}}>
        <Slider
          // Défilement auto si plus de logos que la lagreur de l'écran ne peut en afficher
          autoplay={nbBrands > 4}
          slidesToShow={Math.min(nbBrands, 4)}
          responsive={[
            {
              breakpoint: 1024,
              settings: {
                autoplay: nbBrands > 3,
                slidesToShow: Math.min(nbBrands, 3)
              }
            },
            {
              breakpoint: 600,
              settings: {
                autoplay: nbBrands > 2,
                slidesToShow: Math.min(nbBrands, 2)
              }
            },
            {
              breakpoint: 480,
              settings: {slidesToShow: 1}
            }
          ]}
          slidesToScroll={1}
          infinite={true}
          arrows={false} // affichées en dehors du footer et blanc sur blanc
          autoplaySpeed={3000}
          speed={1000}
        >
          {brands?.map((p:Partner) => (
            <a href={p.url} key={p.name}>
              <img style={style_img} src={p.logo} alt={p.name} />
            </a>
          ))}
        </Slider>
      </div>

      {/* Bouton carré de contrôle pour afficher ou cacher le footer */}
      <Button
        style={{
          position: "absolute",
          bottom: "5px",
          right: "10px",
          zIndex: 1001,
        }}
        type="primary"
        onClick={toggleCollapse}
        aria-label={ isCollapsed ? "Développer le footer" : "Réduire le footer" }
      >
        { isCollapsed ? <UpOutlined /> : <DownOutlined /> }
      </Button>
    </Layout.Footer>
  );
};
