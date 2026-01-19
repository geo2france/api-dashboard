import { Button, Layout, theme, Typography } from "antd";
import { CSSProperties, useContext, useEffect, useState } from "react";
import Slider from "@ant-design/react-slick";

import { UpOutlined, DownOutlined } from "@ant-design/icons";
import { Partner } from "../../types";
import { AppContext } from "./DashboardApp";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Icon } from "@iconify/react";

const { Text } = Typography;
const { useToken } = theme;



interface DbFooterProps {
    brands?: Partner[];
    slider?: boolean;
}

export const DasbhoardFooter: React.FC<DbFooterProps> = ({brands, slider=true}) => {
  const [isCollapsed, setIsCollapsed] = useState(window.innerWidth < 768 ? true : false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);

  const { token } = useToken()
/* 🤖 IA Generated effect
* Permet d'afficher ou non le scrollIndicator
*/
  useEffect(() => {
    const checkShadow = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      setShowScrollIndicator(scrollTop + windowHeight < docHeight - 1);
    };

    // scroll listener
    window.addEventListener("scroll", checkShadow);
    // observer pour changements dynamiques du contenu
    const observer = new ResizeObserver(checkShadow);
    observer.observe(document.body);

    checkShadow(); // initial

    return () => {
      window.removeEventListener("scroll", checkShadow);
      observer.disconnect();
    };
  }, []);


  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const app_context = useContext(AppContext)

  // Style avec slider (l'image occupe tout le bloc défilé)
  const style_img: CSSProperties = slider ? {
    maxHeight: "60px",
    maxWidth: "100%",
    margin: "auto"
  }
  // Style sans slider
  : {
    maxHeight: "60px",
    marginRight: "20px",
  };

  const nbBrands = brands?.length || 0

  // Contenu du footer = logos des partenaires
  // TODO : doit pouvoir être surchargé par l'utilisateur
  const footerContent = brands?.map((p:Partner) => (
    <a href={p.url} key={p.name}>
      <img style={style_img} src={p.logo} alt={p.name} />
    </a>
  ))

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
        overflow: "visible",
        borderTop: "1px solid #ccc", 
        zIndex: 600, // maplibre top zIndex if 500
      }}
    >
     {showScrollIndicator &&   
      /* Shaddow + chevron : show the user that remaing content is avaible downside */
      <div
      className="scroll-indicator"
        style={{
          position: "absolute",
          top: -40, 
          left: 0,
          right: 0,
          height: 40,
          pointerEvents: "none",
          display: "flex", 
          justifyContent:"center",
          alignContent:"flex-end",
          background:
            "linear-gradient(to bottom, rgba(255,255,255,0), rgba(0,0,0,0.1))",
        }}
      >
        <Icon icon="fa6-solid:chevron-down" fontSize={ 35 } color={ token.colorPrimary } />
      </div> 
}

      {/* Texte affiché uniquement lorsque le footer est rétracté */}
      {isCollapsed && (
            <Text type="secondary">{app_context?.title} - {app_context?.subtitle}</Text>
      )}

      {/* Logos et contenu du footer affichés lorsque déplié */}
      <div style={{display: isCollapsed ? "none" : "block", padding: "10px 0"}}>
        {
          slider
          // Logos avec défilement (choix par défaut)
          ? <Slider
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
              {footerContent}
            </Slider>
          // Défilement désactivé
          : footerContent
        }
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
